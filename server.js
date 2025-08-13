const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
require('dotenv').config();

const MemoryManager = require('./memory');
const SecurityManager = require('./security');
const CognitiveTrainingManager = require('./cognitive_training');
const MultimodalIntegrationManager = require('./multimodal_integration');

const app = express();
const memoryManager = new MemoryManager();
const securityManager = new SecurityManager();
const cognitiveTrainingManager = new CognitiveTrainingManager();
const multimodalManager = new MultimodalIntegrationManager();
const PORT = process.env.PORT || 3000;

// 보안 설정
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000'];

// 보안 미들웨어 설정
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      scriptSrcAttr: ["'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "http://localhost:11434"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 요청 제한 설정
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15분
  max: 100, // 최대 100개 요청
  message: {
    error: {
      message: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
      type: 'rate_limit_error',
      code: 'too_many_requests'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use(limiter);

// 미들웨어 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 정적 파일 서빙 설정 (보안 강화)
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
    }
  }
}));

// CORS 설정 (프로덕션 환경 고려)
app.use(cors({
  origin: function (origin, callback) {
    // 로컬 개발 환경 허용
    if (!origin || ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS 정책에 의해 차단되었습니다.'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// 보안 강화된 인증 미들웨어
async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      await securityManager.logAuditEvent('AUTH_FAILED', req.ip || 'unknown', {
        reason: 'missing_token',
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        error: {
          message: 'Access token required',
          type: 'authentication_error',
          code: 'missing_token'
        }
      });
    }

    // 토큰 검증
    if (token !== SECRET_KEY) {
      await securityManager.logAuditEvent('AUTH_FAILED', req.ip || 'unknown', {
        reason: 'invalid_token',
        userAgent: req.get('User-Agent')
      });
      
      return res.status(403).json({
        error: {
          message: 'Invalid access token',
          type: 'authentication_error',
          code: 'invalid_token'
        }
      });
    }

    // 성공적인 인증 로그
    await securityManager.logAuditEvent('AUTH_SUCCESS', req.ip || 'unknown', {
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });

    next();
  } catch (error) {
    console.error('🔒 인증 미들웨어 오류:', error);
    res.status(500).json({
      error: {
        message: 'Authentication service error',
        type: 'server_error',
        code: 'auth_service_error'
      }
    });
  }
}

// 입력 검증 미들웨어
function validateInput(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: {
        message: 'Invalid input data',
        type: 'validation_error',
        code: 'invalid_input',
        details: errors.array()
      }
    });
  }
  next();
}

// Ollama 서버 URL (기본값: localhost:11434)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

// 루트 경로 - 메모리 채팅 인터페이스로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/memory_chat_interface.html');
});

// 기본 모델 설정
const DEFAULT_MODEL = 'jinbora/deepseek-r1-Bllossom:8b';

// OpenAI API 호환 엔드포인트 (메모리 기능 포함)
app.post('/v1/chat/completions', authenticateToken, async (req, res) => {
  try {
    const { messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens, stream = false, user_id } = req.body;

    // 메시지가 없으면 에러
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: {
          message: 'messages array is required',
          type: 'invalid_request_error',
          code: 'missing_messages'
        }
      });
    }

    // API 키 검증 우회 (Authorization 헤더가 있으면 통과)
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: {
          message: 'You didn\'t provide an API key. You need to provide your API key in an Authorization header using Bearer auth (e.g. \'Authorization: Bearer YOUR_API_KEY\'), see https://platform.openai.com/docs/api-reference/authentication for details.',
          type: 'invalid_request_error',
          code: 'missing_api_key'
        }
      });
    }

    // 지능형 메모리 컨텍스트 추가 (user_id가 제공된 경우)
    let enhancedMessages = [...messages];
    if (user_id) {
      try {
        const currentMessage = messages[messages.length - 1]?.content || '';
        const memoryContext = await memoryManager.generateIntelligentContext(user_id, currentMessage, 3);
        enhancedMessages = [...memoryContext, ...messages];
        console.log(`🧠 사용자 ${user_id}의 지능형 메모리 컨텍스트 추가됨 (${memoryContext.length}개 항목)`);
      } catch (error) {
        console.error('메모리 컨텍스트 로드 실패:', error.message);
      }
    }

    // Ollama API 요청 데이터 준비
    const ollamaRequest = {
      model: model,
      messages: enhancedMessages,
      stream: stream,
      options: {
        temperature: temperature,
        ...(max_tokens && { num_predict: max_tokens })
      }
    };

    console.log('Ollama 요청:', JSON.stringify(ollamaRequest, null, 2));

    // Ollama API 호출
    const ollamaResponse = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaRequest, {
      timeout: 120000, // 120초 타임아웃으로 증가
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('Ollama 응답:', JSON.stringify(ollamaResponse.data, null, 2));

    // think 블록 제거 함수
    function removeThinkBlocks(content) {
      // <think>...</think> 블록 제거
      return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    // OpenAI API 형식으로 응답 변환
    const openaiResponse = {
      id: `chatcmpl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
      choices: [
        {
          index: 0,
          message: {
            role: 'assistant',
            content: removeThinkBlocks(ollamaResponse.data.message.content)
          },
          finish_reason: 'stop'
        }
      ],
      usage: {
        prompt_tokens: 0, // Ollama는 토큰 수를 제공하지 않음
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    // 메모리에 대화 저장 (user_id가 제공된 경우)
    if (user_id) {
      try {
        await memoryManager.addConversation(user_id, messages, openaiResponse);
        console.log(`💾 사용자 ${user_id}의 대화가 메모리에 저장됨`);
      } catch (error) {
        console.error('메모리 저장 실패:', error.message);
      }
    }

    res.json(openaiResponse);

  } catch (error) {
    console.error('에러:', error.message);
    console.error('에러 상세:', error);
    
    if (error.code === 'ECONNREFUSED') {
      return res.status(503).json({
        error: {
          message: 'Ollama 서버에 연결할 수 없습니다. Ollama가 실행 중인지 확인해주세요.',
          type: 'server_error',
          code: 'ollama_connection_failed'
        }
      });
    }

    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      return res.status(408).json({
        error: {
          message: '요청 시간이 초과되었습니다. 다시 시도해주세요.',
          type: 'server_error',
          code: 'request_timeout'
        }
      });
    }

    if (error.response) {
      // Ollama에서 오는 에러 응답
      return res.status(error.response.status).json({
        error: {
          message: error.response.data.error || 'Ollama API 오류',
          type: 'server_error',
          code: 'ollama_api_error'
        }
      });
    }

    res.status(500).json({
      error: {
        message: '내부 서버 오류: ' + error.message,
        type: 'server_error',
        code: 'internal_error'
      }
    });
  }
});

// Ollama 직접 호출 엔드포인트 (테스트용)
app.post('/api/generate', async (req, res) => {
  try {
    const { model = DEFAULT_MODEL, prompt, stream = false, temperature = 0.7 } = req.body;

    if (!prompt) {
      return res.status(400).json({
        error: 'prompt is required'
      });
    }

    const ollamaRequest = {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      stream: stream,
      options: {
        temperature: temperature
      }
    };

    const ollamaResponse = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaRequest, {
      timeout: 60000
    });

    res.json(ollamaResponse.data);

  } catch (error) {
    console.error('Ollama 직접 호출 에러:', error.message);
    res.status(500).json({
      error: error.message
    });
  }
});

// 헬스체크 엔드포인트
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    ollama_url: OLLAMA_URL
  });
});

// 설치된 모델 목록 조회 엔드포인트
app.get('/api/models', async (req, res) => {
  try {
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, {
      timeout: 10000
    });
    
    const models = response.data.models.map(model => ({
      name: model.name,
      model: model.model,
      size: model.size,
      modified_at: model.modified_at
    }));
    
    res.json({ models });
  } catch (error) {
    console.error('모델 목록 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '모델 목록 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'models_fetch_failed'
      }
    });
  }
});

// 메모리 관리 API 엔드포인트들

// 사용자 메모리 조회
app.get('/api/memory/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const memory = await memoryManager.getUserMemory(userId);
    res.json(memory);
  } catch (error) {
    console.error('메모리 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '메모리 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'memory_load_failed'
      }
    });
  }
});

// 메모리 통계 조회
app.get('/api/memory/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await memoryManager.getMemoryStats(userId);
    res.json(stats);
  } catch (error) {
    console.error('메모리 통계 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '메모리 통계 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'memory_stats_failed'
      }
    });
  }
});

// 사실 추가
app.post('/api/memory/:userId/facts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { fact, category = 'general' } = req.body;
    
    if (!fact) {
      return res.status(400).json({
        error: {
          message: 'fact is required',
          type: 'invalid_request_error',
          code: 'missing_fact'
        }
      });
    }

    const factEntry = await memoryManager.addFact(userId, fact, category);
    res.json(factEntry);
  } catch (error) {
    console.error('사실 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '사실 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'fact_add_failed'
      }
    });
  }
});

// 선호도 추가
app.post('/api/memory/:userId/preferences', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { preference, value } = req.body;
    
    if (!preference || value === undefined) {
      return res.status(400).json({
        error: {
          message: 'preference and value are required',
          type: 'invalid_request_error',
          code: 'missing_preference_data'
        }
      });
    }

    const prefEntry = await memoryManager.addPreference(userId, preference, value);
    res.json(prefEntry);
  } catch (error) {
    console.error('선호도 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '선호도 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'preference_add_failed'
      }
    });
  }
});

// 메모리 삭제
app.delete('/api/memory/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await memoryManager.deleteUserMemory(userId);
    res.json(result);
  } catch (error) {
    console.error('메모리 삭제 에러:', error.message);
    res.status(500).json({
      error: {
        message: '메모리 삭제 실패: ' + error.message,
        type: 'server_error',
        code: 'memory_delete_failed'
      }
    });
  }
});

// 모든 사용자 목록
app.get('/api/memory', authenticateToken, async (req, res) => {
  try {
    const users = await memoryManager.getAllUsers();
    res.json({ users });
  } catch (error) {
    console.error('사용자 목록 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '사용자 목록 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'users_list_failed'
      }
    });
  }
});

// 감정 상태 통계 조회
app.get('/api/memory/:userId/emotions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const emotionalStats = await memoryManager.getEmotionalStats(userId);
    res.json(emotionalStats);
  } catch (error) {
    console.error('감정 상태 통계 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '감정 상태 통계 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'emotional_stats_failed'
      }
    });
  }
});

// 인생 사건 타임라인 조회
app.get('/api/memory/:userId/timeline', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const timeline = await memoryManager.getLifeEventTimeline(userId);
    res.json({ timeline });
  } catch (error) {
    console.error('인생 사건 타임라인 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '인생 사건 타임라인 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'timeline_failed'
      }
    });
  }
});

// 맥락 패턴 분석 조회
app.get('/api/memory/:userId/patterns', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const patterns = await memoryManager.getContextPatterns(userId);
    res.json({ patterns });
  } catch (error) {
    console.error('맥락 패턴 분석 조회 에러:', error.message);
    res.status(500).json({
      error: {
        message: '맥락 패턴 분석 조회 실패: ' + error.message,
        type: 'server_error',
        code: 'patterns_failed'
      }
    });
  }
});

// 관계 정보 추가
app.post('/api/memory/:userId/relationships', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { person, relationship, details = {} } = req.body;
    
    if (!person || !relationship) {
      return res.status(400).json({
        error: {
          message: 'person and relationship are required',
          type: 'invalid_request_error',
          code: 'missing_relationship_data'
        }
      });
    }

    const relationshipEntry = await memoryManager.addRelationship(userId, person, relationship, details);
    res.json(relationshipEntry);
  } catch (error) {
    console.error('관계 정보 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '관계 정보 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'relationship_add_failed'
      }
    });
  }
});

// 목표 추가
app.post('/api/memory/:userId/goals', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { goal, category = 'general', deadline = null } = req.body;
    
    if (!goal) {
      return res.status(400).json({
        error: {
          message: 'goal is required',
          type: 'invalid_request_error',
          code: 'missing_goal'
        }
      });
    }

    const goalEntry = await memoryManager.addGoal(userId, goal, category, deadline);
    res.json(goalEntry);
  } catch (error) {
    console.error('목표 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '목표 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'goal_add_failed'
      }
    });
  }
});

// 관심사 추가
app.post('/api/memory/:userId/interests', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { interest, category = 'general' } = req.body;
    
    if (!interest) {
      return res.status(400).json({
        error: {
          message: 'interest is required',
          type: 'invalid_request_error',
          code: 'missing_interest'
        }
      });
    }

    const interestEntry = await memoryManager.addInterest(userId, interest, category);
    res.json(interestEntry);
  } catch (error) {
    console.error('관심사 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '관심사 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'interest_add_failed'
      }
    });
  }
});

// 장기 기억 추가
app.post('/api/memory/:userId/longterm', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { memory, category = 'general', importance = 'medium' } = req.body;
    
    if (!memory) {
      return res.status(400).json({
        error: {
          message: 'memory is required',
          type: 'invalid_request_error',
          code: 'missing_memory'
        }
      });
    }

    const longTermMemory = await memoryManager.addLongTermMemory(userId, memory, category, importance);
    res.json(longTermMemory);
  } catch (error) {
    console.error('장기 기억 추가 에러:', error.message);
    res.status(500).json({
      error: {
        message: '장기 기억 추가 실패: ' + error.message,
        type: 'server_error',
        code: 'longterm_memory_add_failed'
      }
    });
  }
});

// 보안 상태 조회
app.get('/api/security/status', authenticateToken, async (req, res) => {
  try {
    const securityStatus = securityManager.getSecurityStatus();
    res.json({
      security: securityStatus,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('보안 상태 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '보안 상태 조회 실패',
        type: 'server_error',
        code: 'security_status_failed'
      }
    });
  }
});

// 보안 설정 업데이트
app.post('/api/security/config', authenticateToken, [
  body('encryptionEnabled').optional().isBoolean(),
  body('auditLogging').optional().isBoolean(),
  body('maxLoginAttempts').optional().isInt({ min: 1, max: 10 }),
  body('lockoutDuration').optional().isInt({ min: 300000, max: 3600000 }) // 5분~1시간
], validateInput, async (req, res) => {
  try {
    const { encryptionEnabled, auditLogging, maxLoginAttempts, lockoutDuration } = req.body;
    
    const configUpdate = {};
    if (encryptionEnabled !== undefined) configUpdate.encryptionEnabled = encryptionEnabled;
    if (auditLogging !== undefined) configUpdate.auditLogging = auditLogging;
    if (maxLoginAttempts !== undefined) configUpdate.maxLoginAttempts = maxLoginAttempts;
    if (lockoutDuration !== undefined) configUpdate.lockoutDuration = lockoutDuration;
    
    securityManager.updateSecurityConfig(configUpdate);
    
    res.json({
      message: '보안 설정이 업데이트되었습니다.',
      updatedConfig: configUpdate,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('보안 설정 업데이트 실패:', error);
    res.status(500).json({
      error: {
        message: '보안 설정 업데이트 실패',
        type: 'server_error',
        code: 'security_config_update_failed'
      }
    });
  }
});

// 메모리 백업 (암호화된 상태로)
app.post('/api/security/backup/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const backupPath = path.join(__dirname, 'backups', `${userId}_backup_${Date.now()}.enc`);
    
    await securityManager.backupMemory(userId, backupPath);
    
    res.json({
      message: '메모리 백업이 완료되었습니다.',
      backupPath: backupPath,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('메모리 백업 실패:', error);
    res.status(500).json({
      error: {
        message: '메모리 백업 실패',
        type: 'server_error',
        code: 'backup_failed'
      }
    });
  }
});

// 메모리 복원
app.post('/api/security/restore/:userId', authenticateToken, [
  body('backupPath').isString().notEmpty()
], validateInput, async (req, res) => {
  try {
    const { userId } = req.params;
    const { backupPath } = req.body;
    
    await securityManager.restoreMemory(userId, backupPath);
    
    res.json({
      message: '메모리 복원이 완료되었습니다.',
      userId: userId,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('메모리 복원 실패:', error);
    res.status(500).json({
      error: {
        message: '메모리 복원 실패',
        type: 'server_error',
        code: 'restore_failed'
      }
    });
  }
});

// 안전한 메모리 삭제
app.delete('/api/security/memory/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    await securityManager.secureDeleteMemory(userId);
    
    res.json({
      message: '메모리가 안전하게 삭제되었습니다.',
      userId: userId,
      deletionMethod: 'secure_overwrite',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('안전한 메모리 삭제 실패:', error);
    res.status(500).json({
      error: {
        message: '메모리 삭제 실패',
        type: 'server_error',
        code: 'secure_delete_failed'
      }
    });
  }
});

// 🧠 인지 훈련 API 엔드포인트들

// 개인화된 인지 훈련 생성
app.post('/api/cognitive/training/:userId', authenticateToken, [
  body('trainingType').optional().isIn(['memoryRecall', 'patternRecognition', 'cognitiveStimulation', 'attentionTraining']),
  body('difficulty').optional().isIn(['easy', 'medium', 'hard'])
], validateInput, async (req, res) => {
  try {
    const { userId } = req.params;
    const { trainingType = 'memoryRecall', difficulty = 'medium' } = req.body;

    // 사용자 메모리 데이터 로드
    const memoryData = memoryManager.getUserMemory(userId);
    if (!memoryData) {
      return res.status(404).json({
        error: {
          message: '사용자 메모리를 찾을 수 없습니다.',
          type: 'not_found',
          code: 'user_memory_not_found'
        }
      });
    }

    // 개인화된 훈련 생성
    const training = cognitiveTrainingManager.generatePersonalizedTraining(
      userId, 
      memoryData, 
      trainingType, 
      difficulty
    );

    // 훈련 기록 저장
    console.log('💾 Saving training record for user:', userId);
    const saveResult = cognitiveTrainingManager.saveTrainingRecord(userId, training);
    console.log('💾 Save result:', saveResult);

    res.json({
      message: '개인화된 인지 훈련이 생성되었습니다.',
      training: training,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('인지 훈련 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '인지 훈련 생성 실패',
        type: 'server_error',
        code: 'cognitive_training_generation_failed'
      }
    });
  }
});

// 훈련 결과 제출 및 평가
app.post('/api/cognitive/training/:userId/:trainingId/submit', authenticateToken, [
  body('answers').isArray().notEmpty()
], validateInput, async (req, res) => {
  try {
    const { userId, trainingId } = req.params;
    const { answers } = req.body;

    // 훈련 기록에서 해당 훈련 찾기
    console.log('🔍 Looking for training:', trainingId, 'for user:', userId);
    const trainingRecords = cognitiveTrainingManager.getTrainingRecords(userId);
    console.log('🔍 Found training records:', trainingRecords.length);
    console.log('🔍 Training IDs:', trainingRecords.map(t => t.id));
    const training = trainingRecords.find(t => t.id === trainingId);
    console.log('🔍 Training found:', training ? 'yes' : 'no');

    if (!training) {
      return res.status(404).json({
        error: {
          message: '훈련을 찾을 수 없습니다.',
          type: 'not_found',
          code: 'training_not_found'
        }
      });
    }

    // 훈련 결과 평가
    const result = cognitiveTrainingManager.evaluateTrainingResult(training, answers);
    
    // 훈련 업데이트
    training.score = result.score;
    training.maxScore = result.maxScore;
    training.completed = true;
    training.result = result;
    training.completedAt = new Date().toISOString();

    // 훈련 기록 저장
    cognitiveTrainingManager.saveTrainingRecord(userId, training);

    res.json({
      message: '훈련 결과가 평가되었습니다.',
      result: result,
      training: training,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('훈련 결과 평가 실패:', error);
    res.status(500).json({
      error: {
        message: '훈련 결과 평가 실패',
        type: 'server_error',
        code: 'training_evaluation_failed'
      }
    });
  }
});

// 사용자 훈련 기록 조회
app.get('/api/cognitive/training/:userId/records', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const records = cognitiveTrainingManager.getTrainingRecords(userId);

    res.json({
      message: '훈련 기록을 조회했습니다.',
      records: records,
      totalCount: records.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('훈련 기록 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '훈련 기록 조회 실패',
        type: 'server_error',
        code: 'training_records_fetch_failed'
      }
    });
  }
});

// 훈련 통계 조회
app.get('/api/cognitive/training/:userId/stats', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = cognitiveTrainingManager.generateTrainingStats(userId);

    res.json({
      message: '훈련 통계를 조회했습니다.',
      stats: stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('훈련 통계 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '훈련 통계 조회 실패',
        type: 'server_error',
        code: 'training_stats_fetch_failed'
      }
    });
  }
});

// 훈련 템플릿 정보 조회
app.get('/api/cognitive/training/templates', authenticateToken, async (req, res) => {
  try {
    const templates = cognitiveTrainingManager.trainingTemplates;

    res.json({
      message: '훈련 템플릿 정보를 조회했습니다.',
      templates: templates,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('훈련 템플릿 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '훈련 템플릿 조회 실패',
        type: 'server_error',
        code: 'training_templates_fetch_failed'
      }
    });
  }
});

// ===== 멀티모달 통합 API 엔드포인트 =====
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// 음성 처리 API
app.post('/api/multimodal/voice/process', authenticateToken, upload.single('audioFile'), async (req, res) => {
  try {
    const { userId } = req.body;
    const audioFile = req.file;
    
    if (!userId || !audioFile) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 오디오 파일이 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_voice_data'
        }
      });
    }

    const result = await multimodalManager.processVoiceInput(userId, audioFile);
    res.json(result);
  } catch (error) {
    console.error('음성 처리 실패:', error);
    res.status(500).json({
      error: {
        message: '음성 처리 실패',
        type: 'server_error',
        code: 'voice_processing_failed'
      }
    });
  }
});

// 음성 합성 API
app.post('/api/multimodal/voice/synthesize', authenticateToken, async (req, res) => {
  try {
    const { userId, text, voiceType } = req.body;
    
    if (!userId || !text) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 텍스트가 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_synthesis_data'
        }
      });
    }

    const result = await multimodalManager.generateVoiceResponse(userId, text, voiceType);
    res.json(result);
  } catch (error) {
    console.error('음성 합성 실패:', error);
    res.status(500).json({
      error: {
        message: '음성 합성 실패',
        type: 'server_error',
        code: 'voice_synthesis_failed'
      }
    });
  }
});

// 영상 처리 API
app.post('/api/multimodal/video/process', authenticateToken, upload.single('videoFile'), async (req, res) => {
  try {
    const { userId } = req.body;
    const videoFile = req.file;
    
    if (!userId || !videoFile) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 비디오 파일이 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_video_data'
        }
      });
    }

    const result = await multimodalManager.processVideoInput(userId, videoFile);
    res.json(result);
  } catch (error) {
    console.error('영상 처리 실패:', error);
    res.status(500).json({
      error: {
        message: '영상 처리 실패',
        type: 'server_error',
        code: 'video_processing_failed'
      }
    });
  }
});

// 영상 프레임 추출 API
app.post('/api/multimodal/video/frames', authenticateToken, upload.single('videoFile'), async (req, res) => {
  try {
    const { userId, frameRate } = req.body;
    const videoFile = req.file;
    
    if (!userId || !videoFile) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 비디오 파일이 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_video_data'
        }
      });
    }

    const result = await multimodalManager.extractVideoFrames(userId, videoFile, frameRate);
    res.json(result);
  } catch (error) {
    console.error('프레임 추출 실패:', error);
    res.status(500).json({
      error: {
        message: '프레임 추출 실패',
        type: 'server_error',
        code: 'frame_extraction_failed'
      }
    });
  }
});

// 센서 데이터 처리 API
app.post('/api/multimodal/sensors/process', authenticateToken, async (req, res) => {
  try {
    const { userId, sensorData } = req.body;
    
    if (!userId || !sensorData) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 센서 데이터가 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_sensor_data'
        }
      });
    }

    const result = await multimodalManager.processSensorData(userId, sensorData);
    res.json(result);
  } catch (error) {
    console.error('센서 데이터 처리 실패:', error);
    res.status(500).json({
      error: {
        message: '센서 데이터 처리 실패',
        type: 'server_error',
        code: 'sensor_processing_failed'
      }
    });
  }
});

// 센서 히스토리 조회 API
app.get('/api/multimodal/sensors/:userId/history', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { sensorType, timeRange } = req.query;

    const result = await multimodalManager.getSensorHistory(userId, sensorType, timeRange);
    res.json(result);
  } catch (error) {
    console.error('센서 히스토리 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '센서 히스토리 조회 실패',
        type: 'server_error',
        code: 'sensor_history_fetch_failed'
      }
    });
  }
});

// 웨어러블 기기 연결 API
app.post('/api/multimodal/wearables/connect', authenticateToken, async (req, res) => {
  try {
    const { userId, deviceType, deviceConfig } = req.body;
    
    if (!userId || !deviceType) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 기기 유형이 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_device_info'
        }
      });
    }

    const result = await multimodalManager.connectWearableDevice(userId, deviceType, deviceConfig);
    res.json(result);
  } catch (error) {
    console.error('웨어러블 기기 연결 실패:', error);
    res.status(500).json({
      error: {
        message: '웨어러블 기기 연결 실패',
        type: 'server_error',
        code: 'wearable_connection_failed'
      }
    });
  }
});

// 웨어러블 데이터 조회 API
app.get('/api/multimodal/wearables/:userId/data', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { deviceType } = req.query;

    const result = await multimodalManager.getWearableData(userId, deviceType);
    res.json(result);
  } catch (error) {
    console.error('웨어러블 데이터 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '웨어러블 데이터 조회 실패',
        type: 'server_error',
        code: 'wearable_data_fetch_failed'
      }
    });
  }
});

// 건강 데이터 처리 API
app.post('/api/multimodal/health/process', authenticateToken, async (req, res) => {
  try {
    const { userId, healthData } = req.body;
    
    if (!userId || !healthData) {
      return res.status(400).json({
        error: {
          message: '사용자 ID와 건강 데이터가 필요합니다.',
          type: 'invalid_request_error',
          code: 'missing_health_data'
        }
      });
    }

    const result = await multimodalManager.processHealthData(userId, healthData);
    res.json(result);
  } catch (error) {
    console.error('건강 데이터 처리 실패:', error);
    res.status(500).json({
      error: {
        message: '건강 데이터 처리 실패',
        type: 'server_error',
        code: 'health_processing_failed'
      }
    });
  }
});

// 건강 리포트 생성 API
app.get('/api/multimodal/health/:userId/report', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { reportType } = req.query;

    const result = await multimodalManager.getHealthReport(userId, reportType);
    res.json(result);
  } catch (error) {
    console.error('건강 리포트 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '건강 리포트 생성 실패',
        type: 'server_error',
        code: 'health_report_failed'
      }
    });
  }
});

// 멀티모달 컨텍스트 생성 API
app.post('/api/multimodal/context/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await multimodalManager.generateMultimodalContext(userId);
    res.json(result);
  } catch (error) {
    console.error('멀티모달 컨텍스트 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '멀티모달 컨텍스트 생성 실패',
        type: 'server_error',
        code: 'multimodal_context_failed'
      }
    });
  }
});

// 멀티모달 상태 조회 API
app.get('/api/multimodal/status', authenticateToken, async (req, res) => {
  try {
    const status = {
      voiceProcessor: 'active',
      videoProcessor: 'active',
      sensorManager: 'active',
      wearableManager: 'active',
      healthMonitor: 'active',
      activeConnections: multimodalManager.activeConnections.size,
      timestamp: new Date().toISOString()
    };

    res.json({
      message: '멀티모달 통합 시스템 상태를 조회했습니다.',
      status: status
    });
  } catch (error) {
    console.error('멀티모달 상태 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '멀티모달 상태 조회 실패',
        type: 'server_error',
        code: 'multimodal_status_failed'
      }
    });
  }
});

// 서버 상태 확인
app.get('/', (req, res) => {
  res.json({
    message: 'Ollama OpenAI API 호환 서버 (메모리 기능 포함)',
    version: '4.0.0',
    endpoints: {
      '/v1/chat/completions': 'OpenAI API 호환 엔드포인트 (지능형 메모리 기능 포함)',
      '/api/generate': 'Ollama 직접 호출 엔드포인트',
      '/api/memory/:userId': '사용자 메모리 조회',
      '/api/memory/:userId/stats': '메모리 통계 조회',
      '/api/memory/:userId/emotions': '감정 상태 통계 조회',
      '/api/memory/:userId/timeline': '인생 사건 타임라인 조회',
      '/api/memory/:userId/patterns': '맥락 패턴 분석 조회',
      '/api/memory/:userId/facts': '사실 추가',
      '/api/memory/:userId/preferences': '선호도 추가',
      '/api/memory/:userId/relationships': '관계 정보 추가',
      '/api/memory/:userId/goals': '목표 추가',
      '/api/memory/:userId/interests': '관심사 추가',
      '/api/memory/:userId/longterm': '장기 기억 추가',
      '/api/memory': '모든 사용자 목록',
      '/api/cognitive/training/:userId': '개인화된 인지 훈련 생성',
      '/api/cognitive/training/:userId/:trainingId/submit': '훈련 결과 제출 및 평가',
      '/api/cognitive/training/:userId/records': '사용자 훈련 기록 조회',
      '/api/cognitive/training/:userId/stats': '훈련 통계 조회',
      '/api/cognitive/training/templates': '훈련 템플릿 정보 조회',
      '/api/multimodal/voice/process': '음성 처리',
      '/api/multimodal/voice/synthesize': '음성 합성',
      '/api/multimodal/video/process': '영상 처리',
      '/api/multimodal/video/frames': '영상 프레임 추출',
      '/api/multimodal/sensors/process': '센서 데이터 처리',
      '/api/multimodal/sensors/:userId/history': '센서 히스토리 조회',
      '/api/multimodal/wearables/connect': '웨어러블 기기 연결',
      '/api/multimodal/wearables/:userId/data': '웨어러블 데이터 조회',
      '/api/multimodal/health/process': '건강 데이터 처리',
      '/api/multimodal/health/:userId/report': '건강 리포트 생성',
      '/api/multimodal/context/:userId': '멀티모달 컨텍스트 생성',
      '/api/multimodal/status': '멀티모달 상태 조회',
      '/api/security/status': '보안 상태 조회',
      '/api/security/config': '보안 설정 업데이트',
      '/api/security/backup/:userId': '암호화된 메모리 백업',
      '/api/security/restore/:userId': '메모리 복원',
      '/api/security/memory/:userId': '안전한 메모리 삭제',
      '/health': '서버 상태 확인'
    }
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ollama API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 Ollama 서버 URL: ${OLLAMA_URL}`);
  console.log(`🔗 OpenAI 호환 엔드포인트: http://localhost:${PORT}/v1/chat/completions`);
  console.log(`🧪 테스트 엔드포인트: http://localhost:${PORT}/api/generate`);
  console.log(`🔊 멀티모달 통합 시스템이 초기화되었습니다.`);
  
  // WebSocket 서버 초기화
  multimodalManager.initializeWebSocket(server);
}); 