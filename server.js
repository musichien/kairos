const express = require('express');
const axios = require('axios');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const path = require('path');
const moment = require('moment');
require('dotenv').config();

const MemoryManager = require('./memory');
const SecurityManager = require('./security');
const CognitiveTrainingManager = require('./cognitive_training');
const MultimodalIntegrationManager = require('./multimodal_integration');
const CulturalOptimizationManager = require('./cultural_optimization');
const TelomereHealthManager = require('./telomere_health');
const CardiovascularWarningManager = require('./cardiovascular_warning');
const BrainResearchComputingManager = require('./brain_research_computing');
const EmbodiedIdentityManager = require('./embodied_identity_manager');

// 🚀 고도화 모듈 추가
const AIPerformanceMonitor = require('./ai_performance_monitor');
const UserBehaviorAnalyzer = require('./user_behavior_analyzer');
const AdvancedSecurityManager = require('./advanced_security_manager');
const PerformanceOptimizer = require('./performance_optimizer');

// 🧬 Multi-Scale Brain Modeling 모듈 추가
const MultiScaleBrainModeling = require('./multi_scale_brain_modeling');


const app = express();
const memoryManager = new MemoryManager();
const securityManager = new SecurityManager();
const cognitiveTrainingManager = new CognitiveTrainingManager();
const multimodalManager = new MultimodalIntegrationManager();
const culturalManager = new CulturalOptimizationManager();
const telomereHealthManager = new TelomereHealthManager();
const cardiovascularWarningManager = new CardiovascularWarningManager();
const brainResearchComputingManager = new BrainResearchComputingManager();
const embodiedIdentityManager = new EmbodiedIdentityManager();

// 🚀 고도화 모듈 인스턴스 생성
const aiPerformanceMonitor = new AIPerformanceMonitor();
const userBehaviorAnalyzer = new UserBehaviorAnalyzer();
const advancedSecurityManager = new AdvancedSecurityManager();
const performanceOptimizer = new PerformanceOptimizer();

// 🧬 Multi-Scale Brain Modeling 인스턴스 생성
const multiScaleBrainModeling = new MultiScaleBrainModeling();
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
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
      connectSrc: ["'self'", "http://localhost:11434", "http://localhost:1234"]
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


// 루트 경로 - 개선된 UI로 리다이렉트
app.get('/', (req, res) => {
  res.redirect('/improved_ui.html');
});

// 기본 모델 설정 (GPT-OSS 20B)
const DEFAULT_MODEL = 'gpt-oss:20b';

// 모델별 타임아웃 설정 함수 (안정성 최적화)
function getModelTimeout(model) {
  const modelName = model.toLowerCase();
  
  // 대형 모델 (20B+ 파라미터) - GPT-OSS, Llama2 70B 등
  if (modelName.includes('20b') || modelName.includes('gpt-oss') || modelName.includes('llama2:70b')) {
    return 600000; // 10분 (최대 안정성)
  }
  
  // 중형 모델 (7B-14B 파라미터)
  if (modelName.includes('7b') || modelName.includes('13b') || modelName.includes('14b') || modelName.includes('deepseek')) {
    return 300000; // 5분 (안정성 향상)
  }
  
  // 소형 모델 (3B-8B 파라미터)
  if (modelName.includes('3b') || modelName.includes('8b') || modelName.includes('1b') || modelName.includes('tiny')) {
    return 180000; // 3분
  }
  
  // 기본값 (최대 안정성)
  return 600000; // 10분
}

// 간단한 채팅 엔드포인트 (인증 없음, 안정성 향상)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = DEFAULT_MODEL, temperature = 0.7, max_tokens, user_id } = req.body;

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

    // 지능형 메모리 컨텍스트 추가 (user_id가 제공된 경우)
    let enhancedMessages = [...messages];
    if (user_id) {
      try {
        const currentMessage = messages[messages.length - 1]?.content || '';
        const memoryContext = await memoryManager.generateIntelligentContext(user_id, currentMessage, 3);
        enhancedMessages = [...memoryContext, ...messages];
        console.log(`🧠 사용자 ${user_id}의 지능형 메모리 컨텍스트 추가됨 (${memoryContext.length}개 항목)`);
        
        // 문화적 최적화 컨텍스트 추가
        try {
          const culturalPreferences = await culturalManager.loadCulturalPreferences(user_id);
          if (culturalPreferences && culturalPreferences.language) {
            const culturalPrompt = culturalManager.generateCulturalPrompt(
              culturalPreferences.language, 
              culturalPreferences.formalityLevel || 'polite',
              { age: culturalPreferences.age }
            );
            
            // 시스템 메시지로 문화적 컨텍스트 추가
            const culturalSystemMessage = {
              role: 'system',
              content: culturalPrompt
            };
            
            enhancedMessages.unshift(culturalSystemMessage);
            console.log(`🌍 사용자 ${user_id}의 문화적 최적화 컨텍스트 추가됨 (${culturalPreferences.language}, ${culturalPreferences.formalityLevel || 'polite'})`);
          }
        } catch (culturalError) {
          console.error('문화적 컨텍스트 로드 실패:', culturalError.message);
        }
      } catch (error) {
        console.error('메모리 컨텍스트 로드 실패:', error.message);
      }
    }

    // Ollama API 요청 데이터 준비
    const ollamaRequest = {
      model: model,
      messages: enhancedMessages,
      stream: false,
      options: {
        temperature: temperature,
        ...(max_tokens && { num_predict: max_tokens })
      }
    };

    console.log('Ollama 요청:', JSON.stringify(ollamaRequest, null, 2));

    // Ollama API 직접 호출 (안정성 최적화)
    const timeout = getModelTimeout(model);
    console.log(`⏱️ 모델 ${model}에 대한 타임아웃: ${timeout/1000}초`);
    
    // 재시도 로직을 포함한 Ollama API 호출
    let ollamaResponse;
    let lastError;
    
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Ollama API 호출 시도 ${attempt}/3`);
        
        ollamaResponse = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaRequest, {
          timeout: timeout,
          headers: {
            'Content-Type': 'application/json'
          },
          // 연결 안정성 향상 설정
          maxRedirects: 5,
          validateStatus: function (status) {
            return status >= 200 && status < 600; // 더 넓은 상태 코드 범위 허용
          }
        });
        
        console.log(`✅ Ollama API 호출 성공 (시도 ${attempt}/3)`);
        break; // 성공하면 루프 종료
        
      } catch (error) {
        lastError = error;
        console.log(`❌ Ollama API 호출 실패 (시도 ${attempt}/3): ${error.message}`);
        
        if (attempt < 3) {
          // 재시도 전 대기 (지수 백오프)
          const waitTime = Math.pow(2, attempt) * 1000; // 2초, 4초
          console.log(`⏳ ${waitTime/1000}초 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
        }
      }
    }
    
    if (!ollamaResponse) {
      throw lastError || new Error('Ollama API 호출 실패');
    }

    const chatResponse = ollamaResponse.data;

    // think 블록 제거 함수
    function removeThinkBlocks(content) {
      // <think>...</think> 블록 제거
      return content.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
    }

    // OpenAI API 형식으로 응답 변환
    const response = {
      id: `chatcmpl-${Date.now()}`,
      object: 'chat.completion',
      created: Math.floor(Date.now() / 1000),
      model: model,
              choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: removeThinkBlocks(chatResponse.message.content)
          },
          finish_reason: 'stop'
        }],
      usage: {
        prompt_tokens: 0,
        completion_tokens: 0,
        total_tokens: 0
      }
    };

    res.json(response);

  } catch (error) {
    console.error('채팅 API 오류:', error);
    
    if (error.response) {
      res.status(error.response.status).json({
        error: {
          message: error.response.data?.error || error.message,
          type: 'api_error',
          code: 'ollama_error'
        }
      });
    } else {
      res.status(500).json({
        error: {
          message: error.message,
          type: 'internal_error',
          code: 'server_error'
        }
      });
    }
  }
});

// OpenAI API 호환 엔드포인트 (메모리 기능 포함)
app.post('/v1/chat/completions', authenticateToken, async (req, res) => {
  // 🚀 성능 모니터링 시작
  const performanceTimer = aiPerformanceMonitor.startResponseTimer();
  const startTime = Date.now();
  
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
        
        // 문화적 최적화 컨텍스트 추가
        try {
          const culturalPreferences = await culturalManager.loadCulturalPreferences(user_id);
          if (culturalPreferences && culturalPreferences.language) {
            const culturalPrompt = culturalManager.generateCulturalPrompt(
              culturalPreferences.language, 
              culturalPreferences.formalityLevel || 'polite',
              { age: culturalPreferences.age }
            );
            
            // 시스템 메시지로 문화적 컨텍스트 추가
            const culturalSystemMessage = {
              role: 'system',
              content: culturalPrompt
            };
            
            enhancedMessages.unshift(culturalSystemMessage);
            console.log(`🌍 사용자 ${user_id}의 문화적 최적화 컨텍스트 추가됨 (${culturalPreferences.language}, ${culturalPreferences.formalityLevel || 'polite'})`);
          }
        } catch (culturalError) {
          console.error('문화적 컨텍스트 로드 실패:', culturalError.message);
        }
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

    // Ollama API 직접 호출 (모델별 적절한 타임아웃 설정)
    const timeout = getModelTimeout(model);
    console.log(`⏱️ 모델 ${model}에 대한 타임아웃: ${timeout/1000}초`);
    
    const ollamaResponse = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaRequest, {
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const chatResponse = ollamaResponse.data;

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
            content: removeThinkBlocks(chatResponse.data.message.content)
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

    // 🚀 성능 모니터링 완료 및 사용자 행동 분석
    const responseTime = Date.now() - startTime;
    aiPerformanceMonitor.endResponseTimer(performanceTimer, model, true);
    
    // 사용자 행동 분석 (user_id가 있는 경우)
    if (user_id) {
      try {
        userBehaviorAnalyzer.recordUserBehavior(user_id, 'response_interaction', {
          responseType: 'chat_completion',
          userReaction: 'positive', // 기본값, 실제로는 사용자 피드백 필요
          followUpActions: [],
          responseTime,
          model,
          messageCount: messages.length
        });
      } catch (behaviorError) {
        console.error('사용자 행동 분석 실패:', behaviorError.message);
      }
    }

    res.json(openaiResponse);

  } catch (error) {
    // 🚀 성능 모니터링 에러 기록
    aiPerformanceMonitor.endResponseTimer(performanceTimer, model || 'unknown', false);
    aiPerformanceMonitor.recordError(model || 'unknown', 'chat_completion_error', error.message, { user_id });
    
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

    // Ollama API 직접 호출 (모델별 적절한 타임아웃 설정)
    const timeout = getModelTimeout(model);
    console.log(`⏱️ 모델 ${model}에 대한 타임아웃: ${timeout/1000}초`);
    
    const ollamaResponse = await axios.post(`${OLLAMA_URL}/api/chat`, ollamaRequest, {
      timeout: timeout,
      headers: {
        'Content-Type': 'application/json'
      }
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
    const response = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 10000 });
    
    if (response.data && response.data.models) {
      res.json({ models: response.data.models });
    } else {
      res.status(500).json({
        error: {
          message: '모델 목록 조회 실패',
          type: 'server_error',
          code: 'models_fetch_failed'
        }
      });
    }
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

// ===== Telomere-Driven Healthy Aging API =====

// Log a daily routine (sleep, activity, diet, stress)
app.post('/api/telomere/:userId/routine', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const routine = telomereHealthManager.logRoutine(userId, req.body || {});
    res.json({
      message: 'Routine logged successfully',
      userId,
      routine
    });
  } catch (error) {
    console.error('Routine logging failed:', error);
    res.status(500).json({
      error: {
        message: 'Routine logging failed',
        type: 'server_error',
        code: 'routine_log_failed'
      }
    });
  }
});

// Get daily lifestyle signals for a given date (or today by default)
app.get('/api/telomere/:userId/signals', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    const signals = telomereHealthManager.getDailySignals(userId, date);
    res.json(signals);
  } catch (error) {
    console.error('Signals fetch failed:', error);
    res.status(500).json({
      error: {
        message: 'Signals fetch failed',
        type: 'server_error',
        code: 'signals_fetch_failed'
      }
    });
  }
});

// Save biomarker panel result (hs-CRP, fasting glucose, HbA1c, Omega-3 Index)
app.post('/api/telomere/:userId/biomarkers', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const biomarker = telomereHealthManager.saveBiomarkers(userId, req.body || {});
    res.json({
      message: 'Biomarker saved successfully',
      userId,
      biomarker
    });
  } catch (error) {
    console.error('Biomarker save failed:', error);
    res.status(500).json({
      error: {
        message: 'Biomarker save failed',
        type: 'server_error',
        code: 'biomarker_save_failed'
      }
    });
  }
});

// Get biomarker report (quarter or year)
app.get('/api/telomere/:userId/biomarkers/report', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { range = 'quarter', endDate } = req.query;
    const report = telomereHealthManager.getBiomarkerReport(userId, range, endDate);
    res.json(report);
  } catch (error) {
    console.error('Biomarker report failed:', error);
    res.status(500).json({
      error: {
        message: 'Biomarker report failed',
        type: 'server_error',
        code: 'biomarker_report_failed'
      }
    });
  }
});

// Save telomere length (LTL) measurement
app.post('/api/telomere/:userId/ltl', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const saved = telomereHealthManager.saveTelomereResult(userId, req.body || {});
    res.json({
      message: 'Telomere result saved successfully',
      userId,
      result: saved
    });
  } catch (error) {
    console.error('Telomere save failed:', error);
    res.status(500).json({
      error: {
        message: 'Telomere save failed',
        type: 'server_error',
        code: 'telomere_save_failed'
      }
    });
  }
});

// Get telomere trend interpretation
app.get('/api/telomere/:userId/ltl/trend', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const trend = telomereHealthManager.getTelomereTrend(userId);
    res.json(trend);
  } catch (error) {
    console.error('Telomere trend failed:', error);
    res.status(500).json({
      error: {
        message: 'Telomere trend failed',
        type: 'server_error',
        code: 'telomere_trend_failed'
      }
    });
  }
});

// Generate lifestyle feedback and recommendations
app.get('/api/telomere/:userId/feedback', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const feedback = telomereHealthManager.generateFeedback(userId);
    res.json(feedback);
  } catch (error) {
    console.error('Feedback generation failed:', error);
    res.status(500).json({
      error: {
        message: 'Feedback generation failed',
        type: 'server_error',
        code: 'feedback_generation_failed'
      }
    });
  }
});

// ===== Cardiovascular Warning System API Endpoints =====

// Record physiological metrics
app.post('/api/cardiovascular/:userId/physiological', authenticateToken, [
  body('weight').optional().isFloat({ min: 20, max: 500 }).withMessage('체중은 20-500kg 범위여야 합니다.'),
  body('bmi').optional().isFloat({ min: 10, max: 100 }).withMessage('BMI는 10-100 범위여야 합니다.'),
  body('systolicBP').optional().isInt({ min: 70, max: 300 }).withMessage('수축기 혈압은 70-300mmHg 범위여야 합니다.'),
  body('diastolicBP').optional().isInt({ min: 40, max: 200 }).withMessage('이완기 혈압은 40-200mmHg 범위여야 합니다.'),
  body('heartRate').optional().isInt({ min: 40, max: 200 }).withMessage('심박수는 40-200bpm 범위여야 합니다.'),
  body('bloodSugar').optional().isFloat({ min: 50, max: 500 }).withMessage('혈당은 50-500mg/dL 범위여야 합니다.'),
  body('cholesterol').optional().isFloat({ min: 100, max: 500 }).withMessage('총 콜레스테롤은 100-500mg/dL 범위여야 합니다.'),
  body('ldl').optional().isFloat({ min: 50, max: 300 }).withMessage('LDL은 50-300mg/dL 범위여야 합니다.'),
  body('hdl').optional().isFloat({ min: 20, max: 100 }).withMessage('HDL은 20-100mg/dL 범위여야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const metrics = req.body;
    const record = cardiovascularWarningManager.recordPhysiologicalMetrics(userId, metrics);
    
    res.json({
      message: '생리학적 지표가 기록되었습니다.',
      record: record
    });
  } catch (error) {
    console.error('생리학적 지표 기록 실패:', error);
    res.status(500).json({
      error: {
        message: '생리학적 지표 기록 실패',
        type: 'server_error',
        code: 'physiological_recording_failed'
      }
    });
  }
});

// Record medication
app.post('/api/cardiovascular/:userId/medication', authenticateToken, [
  body('name').notEmpty().withMessage('약물 이름은 필수입니다.'),
  body('type').isIn(['sedative', 'sleep_aid', 'cardiovascular', 'other']).withMessage('올바른 약물 유형을 선택해주세요.'),
  body('dosage').notEmpty().withMessage('용량은 필수입니다.'),
  body('frequency').notEmpty().withMessage('투여 빈도는 필수입니다.'),
  body('startDate').optional().isISO8601().withMessage('올바른 날짜 형식을 입력해주세요.'),
  body('isActive').optional().isBoolean().withMessage('활성 상태는 boolean 값이어야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const medication = req.body;
    const record = cardiovascularWarningManager.recordMedication(userId, medication);
    
    res.json({
      message: '약물 정보가 기록되었습니다.',
      record: record
    });
  } catch (error) {
    console.error('약물 정보 기록 실패:', error);
    res.status(500).json({
      error: {
        message: '약물 정보 기록 실패',
        type: 'server_error',
        code: 'medication_recording_failed'
      }
    });
  }
});

// Record lifestyle data
app.post('/api/cardiovascular/:userId/lifestyle', authenticateToken, [
  body('sleepHours').optional().isFloat({ min: 0, max: 24 }).withMessage('수면 시간은 0-24시간 범위여야 합니다.'),
  body('sleepQuality').optional().isInt({ min: 0, max: 100 }).withMessage('수면 품질은 0-100 범위여야 합니다.'),
  body('exerciseMinutes').optional().isInt({ min: 0, max: 300 }).withMessage('운동 시간은 0-300분 범위여야 합니다.'),
  body('exerciseType').optional().isString().withMessage('운동 유형은 문자열이어야 합니다.'),
  body('steps').optional().isInt({ min: 0, max: 50000 }).withMessage('걸음 수는 0-50000 범위여야 합니다.'),
  body('dietQuality').optional().isInt({ min: 0, max: 100 }).withMessage('식이 품질은 0-100 범위여야 합니다.'),
  body('sodiumIntake').optional().isFloat({ min: 0, max: 10000 }).withMessage('나트륨 섭취량은 0-10000mg 범위여야 합니다.'),
  body('smokingStatus').optional().isIn(['never', 'former', 'current']).withMessage('올바른 흡연 상태를 선택해주세요.'),
  body('alcoholConsumption').optional().isFloat({ min: 0, max: 100 }).withMessage('알코올 섭취량은 0-100 범위여야 합니다.'),
  body('stressLevel').optional().isInt({ min: 0, max: 10 }).withMessage('스트레스 수준은 0-10 범위여야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const lifestyle = req.body;
    const record = cardiovascularWarningManager.recordLifestyleData(userId, lifestyle);
    
    res.json({
      message: '라이프스타일 데이터가 기록되었습니다.',
      record: record
    });
  } catch (error) {
    console.error('라이프스타일 데이터 기록 실패:', error);
    res.status(500).json({
      error: {
        message: '라이프스타일 데이터 기록 실패',
        type: 'server_error',
        code: 'lifestyle_recording_failed'
      }
    });
  }
});

// Record psychosocial data
app.post('/api/cardiovascular/:userId/psychosocial', authenticateToken, [
  body('stressLevel').optional().isInt({ min: 0, max: 10 }).withMessage('스트레스 수준은 0-10 범위여야 합니다.'),
  body('socialInteraction').optional().isIn(['frequent', 'moderate', 'rare', 'isolated']).withMessage('올바른 사회적 상호작용 수준을 선택해주세요.'),
  body('majorLifeEvents').optional().isArray().withMessage('주요 인생 사건은 배열이어야 합니다.'),
  body('emotionalState').optional().isIn(['calm', 'anxious', 'depressed', 'grieving']).withMessage('올바른 감정 상태를 선택해주세요.'),
  body('workStress').optional().isInt({ min: 0, max: 10 }).withMessage('직장 스트레스는 0-10 범위여야 합니다.'),
  body('familyStress').optional().isInt({ min: 0, max: 10 }).withMessage('가족 스트레스는 0-10 범위여야 합니다.'),
  body('griefLevel').optional().isInt({ min: 0, max: 10 }).withMessage('슬픔 수준은 0-10 범위여야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const psychosocial = req.body;
    const record = cardiovascularWarningManager.recordPsychosocialData(userId, psychosocial);
    
    res.json({
      message: '심리사회적 데이터가 기록되었습니다.',
      record: record
    });
  } catch (error) {
    console.error('심리사회적 데이터 기록 실패:', error);
    res.status(500).json({
      error: {
        message: '심리사회적 데이터 기록 실패',
        type: 'server_error',
        code: 'psychosocial_recording_failed'
      }
    });
  }
});

// Assess cardiovascular risk
app.get('/api/cardiovascular/:userId/risk-assessment', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const assessment = cardiovascularWarningManager.assessCardiovascularRisk(userId);
    
    res.json({
      message: '심혈관 위험도 평가가 완료되었습니다.',
      assessment: assessment
    });
  } catch (error) {
    console.error('위험도 평가 실패:', error);
    res.status(500).json({
      error: {
        message: '위험도 평가 실패',
        type: 'server_error',
        code: 'risk_assessment_failed'
      }
    });
  }
});

// Get user risk profile
app.get('/api/cardiovascular/:userId/risk-profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const profile = cardiovascularWarningManager.getUserRiskProfile(userId);
    
    res.json({
      message: '사용자 위험도 프로필을 조회했습니다.',
      profile: profile
    });
  } catch (error) {
    console.error('위험도 프로필 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '위험도 프로필 조회 실패',
        type: 'server_error',
        code: 'risk_profile_failed'
      }
    });
  }
});

// Get risk trends
app.get('/api/cardiovascular/:userId/risk-trends', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days } = req.query;
    const trends = cardiovascularWarningManager.getRiskTrends(userId, parseInt(days) || 30);
    
    res.json({
      message: '위험도 트렌드를 조회했습니다.',
      trends: trends
    });
  } catch (error) {
    console.error('위험도 트렌드 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '위험도 트렌드 조회 실패',
        type: 'server_error',
        code: 'risk_trends_failed'
      }
    });
  }
});

// Simulate risk scenario
app.post('/api/cardiovascular/:userId/simulation', authenticateToken, [
  body('skipExercise').optional().isBoolean().withMessage('운동 건너뛰기는 boolean 값이어야 합니다.'),
  body('sleepLess').optional().isBoolean().withMessage('수면 부족은 boolean 값이어야 합니다.'),
  body('increaseStress').optional().isBoolean().withMessage('스트레스 증가는 boolean 값이어야 합니다.'),
  body('poorDiet').optional().isBoolean().withMessage('불량한 식이는 boolean 값이어야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const scenario = req.body;
    const simulation = cardiovascularWarningManager.simulateRiskScenario(userId, scenario);
    
    res.json({
      message: '위험도 시나리오 시뮬레이션이 완료되었습니다.',
      simulation: simulation
    });
  } catch (error) {
    console.error('시나리오 시뮬레이션 실패:', error);
    res.status(500).json({
      error: {
        message: '시나리오 시뮬레이션 실패',
        type: 'server_error',
        code: 'simulation_failed'
      }
    });
  }
});

// Get user alerts
app.get('/api/cardiovascular/:userId/alerts', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = cardiovascularWarningManager._getUserData(userId);
    const recentAlerts = user.alerts.filter(alert => 
      moment(alert.timestamp).isAfter(moment().subtract(7, 'days'))
    );
    
    res.json({
      message: '사용자 알림을 조회했습니다.',
      alerts: recentAlerts,
      count: recentAlerts.length
    });
  } catch (error) {
    console.error('알림 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '알림 조회 실패',
        type: 'server_error',
        code: 'alerts_failed'
      }
    });
  }
});

// ===== Embodied Identity & Self-Restoration API Endpoints =====

// Create or update user identity
app.post('/api/embodied-identity/:userId/identity', authenticateToken, [
  body('personalValues').optional().isArray().withMessage('개인 가치는 배열이어야 합니다.'),
  body('lifeGoals').optional().isArray().withMessage('인생 목표는 배열이어야 합니다.'),
  body('relationships').optional().isArray().withMessage('관계 정보는 배열이어야 합니다.'),
  body('interests').optional().isArray().withMessage('관심사는 배열이어야 합니다.'),
  body('skills').optional().isArray().withMessage('기술은 배열이어야 합니다.'),
  body('experiences').optional().isArray().withMessage('경험은 배열이어야 합니다.'),
  body('beliefs').optional().isArray().withMessage('신념은 배열이어야 합니다.'),
  body('aspirations').optional().isArray().withMessage('포부는 배열이어야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const identityData = req.body;
    const identity = embodiedIdentityManager.createUserIdentity(userId, identityData);
    
    res.json({
      message: '사용자 정체성이 생성/업데이트되었습니다.',
      identity: identity
    });
  } catch (error) {
    console.error('정체성 생성/업데이트 실패:', error);
    res.status(500).json({
      error: {
        message: '정체성 생성/업데이트 실패',
        type: 'server_error',
        code: 'identity_creation_failed'
      }
    });
  }
});

// Start identity session
app.post('/api/embodied-identity/:userId/session', authenticateToken, [
  body('sessionType').isIn(['identity_exploration', 'memory_reconstruction', 'emotional_regulation', 'embodied_simulation']).withMessage('올바른 세션 유형을 선택해주세요.'),
  body('parameters').optional().isObject().withMessage('매개변수는 객체여야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const { sessionType, parameters } = req.body;
    const session = embodiedIdentityManager.startIdentitySession(userId, sessionType, parameters);
    
    res.json({
      message: '정체성 세션이 시작되었습니다.',
      session: session
    });
  } catch (error) {
    console.error('세션 시작 실패:', error);
    res.status(500).json({
      error: {
        message: '세션 시작 실패',
        type: 'server_error',
        code: 'session_start_failed'
      }
    });
  }
});

// Process session interaction
app.post('/api/embodied-identity/session/:sessionId/interaction', authenticateToken, [
  body('type').isIn(['memory_recall', 'identity_exploration', 'emotional_expression', 'cognitive_processing']).withMessage('올바른 상호작용 유형을 선택해주세요.'),
  body('content').notEmpty().withMessage('상호작용 내용은 필수입니다.'),
  body('emotionalState').optional().isObject().withMessage('감정 상태는 객체여야 합니다.'),
  body('response').optional().isString().withMessage('응답은 문자열이어야 합니다.'),
  body('context').optional().isString().withMessage('맥락은 문자열이어야 합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { sessionId } = req.params;
    const interaction = req.body;
    const result = embodiedIdentityManager.processSessionInteraction(sessionId, interaction);
    
    res.json({
      message: '세션 상호작용이 처리되었습니다.',
      result: result
    });
  } catch (error) {
    console.error('상호작용 처리 실패:', error);
    res.status(500).json({
      error: {
        message: '상호작용 처리 실패',
        type: 'server_error',
        code: 'interaction_processing_failed'
      }
    });
  }
});

// End identity session
app.post('/api/embodied-identity/session/:sessionId/end', authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.params;
    const result = embodiedIdentityManager.endIdentitySession(sessionId);
    
    res.json({
      message: '정체성 세션이 종료되었습니다.',
      result: result
    });
  } catch (error) {
    console.error('세션 종료 실패:', error);
    res.status(500).json({
      error: {
        message: '세션 종료 실패',
        type: 'server_error',
        code: 'session_end_failed'
      }
    });
  }
});

// Get user identity profile
app.get('/api/embodied-identity/:userId/profile', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const identity = embodiedIdentityManager.getUserIdentity(userId);
    
    if (!identity) {
      return res.status(404).json({
        error: {
          message: '사용자 정체성을 찾을 수 없습니다.',
          type: 'not_found',
          code: 'identity_not_found'
        }
      });
    }
    
    res.json({
      message: '사용자 정체성 프로필을 조회했습니다.',
      identity: identity
    });
  } catch (error) {
    console.error('정체성 프로필 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '정체성 프로필 조회 실패',
        type: 'server_error',
          code: 'profile_fetch_failed'
      }
    });
  }
});

// Get user active sessions
app.get('/api/embodied-identity/:userId/active-sessions', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const sessions = embodiedIdentityManager.getUserActiveSessions(userId);
    
    res.json({
      message: '사용자의 활성 세션을 조회했습니다.',
      sessions: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('활성 세션 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '활성 세션 조회 실패',
        type: 'server_error',
        code: 'active_sessions_fetch_failed'
      }
    });
  }
});

// Get user session history
app.get('/api/embodied-identity/:userId/session-history', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit } = req.query;
    const sessions = embodiedIdentityManager.getUserSessionHistory(userId, parseInt(limit) || 10);
    
    res.json({
      message: '사용자의 세션 기록을 조회했습니다.',
      sessions: sessions,
      count: sessions.length
    });
  } catch (error) {
    console.error('세션 기록 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '세션 기록 조회 실패',
        type: 'server_error',
        code: 'session_history_fetch_failed'
      }
    });
  }
});

// Get available role-play scenarios
app.get('/api/embodied-identity/scenarios', authenticateToken, async (req, res) => {
  try {
    const scenarios = embodiedIdentityManager.getAvailableScenarios();
    
    res.json({
      message: '사용 가능한 역할극 시나리오를 조회했습니다.',
      scenarios: scenarios,
      count: scenarios.length
    });
  } catch (error) {
  console.error('시나리오 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '시나리오 조회 실패',
        type: 'server_error',
        code: 'scenarios_fetch_failed'
      }
    });
  }
});

// Get memory landscape options
app.get('/api/embodied-identity/memory-landscapes', authenticateToken, async (req, res) => {
  try {
    const landscapes = embodiedIdentityManager.getMemoryLandscapeOptions();
    
    res.json({
      message: '메모리 랜드스케이프 옵션을 조회했습니다.',
      landscapes: landscapes,
      count: landscapes.length
    });
  } catch (error) {
    console.error('메모리 랜드스케이프 옵션 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '메모리 랜드스케이프 옵션 조회 실패',
        type: 'server_error',
        code: 'memory_landscapes_fetch_failed'
      }
    });
  }
});

// ===== Brain Research Computing API Endpoints =====
// Get available computing jobs
app.get('/api/brain-research/jobs', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const userCapabilities = req.body.capabilities || { gpu: false, webgpu: false, webassembly: true };
    
    const availableJobs = brainResearchComputingManager.getAvailableJobs(userId, userCapabilities, 10);
    
    res.json({
      message: '사용 가능한 컴퓨팅 작업을 조회했습니다.',
      jobs: availableJobs,
      count: availableJobs.length
    });
  } catch (error) {
    console.error('컴퓨팅 작업 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '컴퓨팅 작업 조회 실패',
        type: 'server_error',
        code: 'jobs_fetch_failed'
      }
    });
  }
});

// Assign job to user
app.post('/api/brain-research/jobs/:jobId/assign', authenticateToken, [
  body('userId').notEmpty().withMessage('사용자 ID가 필요합니다.'),
  body('capabilities').isObject().withMessage('사용자 기능 정보가 필요합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { jobId } = req.params;
    const { userId, capabilities } = req.body;
    
    const job = brainResearchComputingManager.assignJobToUser(jobId, userId, capabilities);
    
    res.json({
      message: '컴퓨팅 작업이 사용자에게 할당되었습니다.',
      job: job
    });
  } catch (error) {
    console.error('작업 할당 실패:', error);
    res.status(500).json({
      error: {
        message: '작업 할당 실패',
        type: 'server_error',
        code: 'job_assignment_failed'
      }
    });
  }
});

// Submit job result
app.post('/api/brain-research/jobs/:jobId/submit', authenticateToken, [
  body('userId').notEmpty().withMessage('사용자 ID가 필요합니다.'),
  body('result').isObject().withMessage('계산 결과가 필요합니다.'),
  body('computeTime').isNumeric().withMessage('계산 시간이 필요합니다.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { jobId } = req.params;
    const { userId, result, computeTime } = req.body;
    
    const submission = brainResearchComputingManager.submitJobResult(jobId, userId, result, computeTime);
    
    res.json({
      message: '계산 결과가 제출되었습니다.',
      submission: submission
    });
  } catch (error) {
    console.error('결과 제출 실패:', error);
    res.status(500).json({
      error: {
        message: '결과 제출 실패',
        type: 'server_error',
        code: 'result_submission_failed'
      }
    });
  }
});

// Get user contribution statistics
app.get('/api/brain-research/contribution/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const contribution = brainResearchComputingManager.getUserContribution(userId);
    
    if (!contribution) {
      return res.status(404).json({
        error: {
          message: '사용자 기여 정보를 찾을 수 없습니다.',
          type: 'not_found',
          code: 'user_not_found'
        }
      });
    }
    
    res.json({
      message: '사용자 기여 통계를 조회했습니다.',
      contribution: contribution
    });
  } catch (error) {
    console.error('기여 통계 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '기여 통계 조회 실패',
        type: 'server_error',
        code: 'contribution_fetch_failed'
      }
    });
  }
});

// Get leaderboard
app.get('/api/brain-research/leaderboard', authenticateToken, async (req, res) => {
  try {
    const { limit } = req.query;
    const leaderboard = brainResearchComputingManager.getLeaderboard(parseInt(limit) || 10);
    
    res.json({
      message: '리더보드를 조회했습니다.',
      leaderboard: leaderboard,
      count: leaderboard.length
    });
  } catch (error) {
    console.error('리더보드 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '리더보드 조회 실패',
        type: 'server_error',
        code: 'leaderboard_fetch_failed'
      }
    });
  }
});

// Get research statistics
app.get('/api/brain-research/statistics', authenticateToken, async (req, res) => {
  try {
    const statistics = brainResearchComputingManager.getResearchStatistics();
    
    res.json({
      message: '연구 통계를 조회했습니다.',
      statistics: statistics
    });
  } catch (error) {
    console.error('연구 통계 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '연구 통계 조회 실패',
        type: 'server_error',
        code: 'statistics_fetch_failed'
      }
    });
  }
});

// Generate new research jobs
app.post('/api/brain-research/generate-jobs', authenticateToken, [
  body('jobType').isIn(['neuron_simulation', 'protein_interaction', 'synaptic_plasticity', 'molecular_dynamics']).withMessage('올바른 작업 유형을 선택해주세요.'),
  body('count').isInt({ min: 1, max: 50 }).withMessage('1-50개의 작업을 생성할 수 있습니다.'),
  body('priority').optional().isIn(['low', 'normal', 'high']).withMessage('올바른 우선순위를 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { jobType, count, priority = 'normal' } = req.body;
    const generatedJobs = [];
    
    for (let i = 0; i < count; i++) {
      const job = brainResearchComputingManager.generateJob(jobType, priority);
      generatedJobs.push(job);
    }
    
    res.json({
      message: `${count}개의 ${jobType} 작업을 생성했습니다.`,
      jobs: generatedJobs,
      count: generatedJobs.length
    });
  } catch (error) {
    console.error('작업 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '작업 생성 실패',
        type: 'server_error',
        code: 'job_generation_failed'
      }
    });
  }
});

// Collective Brain Modeling API 엔드포인트
// Get available job templates
app.get('/api/brain-research/templates', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.query;
    const templates = brainResearchComputingManager.getAvailableTemplates(userId);
    
    res.json({
      message: '사용 가능한 작업 템플릿을 조회했습니다.',
      templates: templates,
      count: templates.length
    });
  } catch (error) {
    console.error('작업 템플릿 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '작업 템플릿 조회 실패',
        type: 'server_error',
        code: 'templates_fetch_failed'
      }
    });
  }
});

// Submit user job using template
app.post('/api/brain-research/submit-job', authenticateToken, [
  body('userId').notEmpty().withMessage('사용자 ID가 필요합니다.'),
  body('templateId').notEmpty().withMessage('템플릿 ID가 필요합니다.'),
  body('customParameters').isObject().withMessage('사용자 정의 매개변수가 필요합니다.'),
  body('priority').optional().isIn(['low', 'normal', 'high']).withMessage('올바른 우선순위를 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId, templateId, customParameters, priority = 'normal' } = req.body;
    
    const result = brainResearchComputingManager.submitUserJob(userId, templateId, customParameters, priority);
    
    res.json({
      message: '사용자 작업이 성공적으로 제출되었습니다.',
      userJob: result.userJob,
      computingJobs: result.computingJobs,
      estimatedCost: result.userJob.estimatedCost,
      estimatedTime: result.userJob.estimatedTime
    });
  } catch (error) {
    console.error('사용자 작업 제출 실패:', error);
    res.status(500).json({
      error: {
        message: error.message || '사용자 작업 제출 실패',
        type: 'server_error',
        code: 'user_job_submission_failed'
      }
    });
  }
});

// Get user submitted jobs status
app.get('/api/brain-research/user-jobs/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const userJobs = brainResearchComputingManager.getUserJobStatus(userId);
    
    res.json({
      message: '사용자 제출 작업 상태를 조회했습니다.',
      userJobs: userJobs,
      count: userJobs.length
    });
  } catch (error) {
    console.error('사용자 작업 상태 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '사용자 작업 상태 조회 실패',
        type: 'server_error',
        code: 'user_jobs_fetch_failed'
      }
    });
  }
});

// Get user credits
app.get('/api/brain-research/credits/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const credits = brainResearchComputingManager.getUserCredits(userId);
    const contribution = brainResearchComputingManager.getUserContribution(userId);
    
    res.json({
      message: '사용자 크레딧 정보를 조회했습니다.',
      credits: credits,
      contribution: contribution,
      creditSystem: {
        baseCredits: brainResearchComputingManager.creditSystem.baseCredits,
        earnRates: brainResearchComputingManager.creditSystem.earnRates,
        spendRates: brainResearchComputingManager.creditSystem.spendRates
      }
    });
  } catch (error) {
    console.error('사용자 크레딧 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '사용자 크레딧 조회 실패',
        type: 'server_error',
        code: 'credits_fetch_failed'
      }
    });
  }
});

// Validate user job results
app.post('/api/brain-research/validate-results/:userJobId', authenticateToken, async (req, res) => {
  try {
    const { userJobId } = req.params;
    const scientificReport = brainResearchComputingManager.validateUserJobResults(userJobId);
    
    if (!scientificReport) {
      return res.status(404).json({
        error: {
          message: '사용자 작업을 찾을 수 없거나 아직 완료되지 않았습니다.',
          type: 'not_found',
          code: 'user_job_not_found'
        }
      });
    }
    
    res.json({
      message: '사용자 작업 결과가 성공적으로 검증되었습니다.',
      scientificReport: scientificReport,
      doi: scientificReport.reproducibility.doi,
      acknowledgments: scientificReport.acknowledgments
    });
  } catch (error) {
    console.error('사용자 작업 결과 검증 실패:', error);
    res.status(500).json({
      error: {
        message: '사용자 작업 결과 검증 실패',
        type: 'server_error',
        code: 'validation_failed'
      }
    });
  }
});

// 문화 및 언어 최적화 API 엔드포인트
app.get('/api/cultural/profile/:language', authenticateToken, async (req, res) => {
  try {
    const { language } = req.params;
    const profile = culturalManager.getCulturalProfile(language);
    
    res.json({
      message: `${language} 문화 프로필을 조회했습니다.`,
      profile: profile
    });
  } catch (error) {
    console.error('문화 프로필 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '문화 프로필 조회 실패',
        type: 'server_error',
        code: 'cultural_profile_failed'
      }
    });
  }
});

app.get('/api/cultural/style/:language/:formality', authenticateToken, async (req, res) => {
  try {
    const { language, formality } = req.params;
    const style = culturalManager.getConversationStyle(language, formality);
    
    res.json({
      message: `${language} ${formality} 대화 스타일을 조회했습니다.`,
      style: style
    });
  } catch (error) {
    console.error('대화 스타일 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '대화 스타일 조회 실패',
        type: 'server_error',
        code: 'conversation_style_failed'
      }
    });
  }
});

app.post('/api/cultural/greeting', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { language, formalityLevel, timeOfDay } = req.body;
    const greeting = culturalManager.generateGreeting(language, formalityLevel, timeOfDay);
    
    res.json({
      message: '문화적 인사말을 생성했습니다.',
      greeting: greeting,
      language: language,
      formalityLevel: formalityLevel
    });
  } catch (error) {
    console.error('인사말 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '인사말 생성 실패',
        type: 'server_error',
        code: 'greeting_generation_failed'
      }
    });
  }
});

app.post('/api/cultural/response', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.'),
  body('responseType').isIn(['agreement', 'disagreement', 'gratitude', 'apology', 'encouragement', 'sympathy', 'humor']).withMessage('올바른 응답 유형을 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { language, formalityLevel, responseType } = req.body;
    const response = culturalManager.generateResponsePattern(language, formalityLevel, responseType);
    
    res.json({
      message: '문화적 응답 패턴을 생성했습니다.',
      response: response,
      language: language,
      formalityLevel: formalityLevel,
      responseType: responseType
    });
  } catch (error) {
    console.error('응답 패턴 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '응답 패턴 생성 실패',
        type: 'server_error',
        code: 'response_pattern_failed'
      }
    });
  }
});

app.post('/api/cultural/context', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.'),
  body('message').notEmpty().withMessage('메시지를 입력해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { language, formalityLevel, message, userAge } = req.body;
    const enhancedMessage = culturalManager.applyCulturalContext(language, formalityLevel, message, userAge);
    
    res.json({
      message: '문화적 컨텍스트를 적용했습니다.',
      originalMessage: message,
      enhancedMessage: enhancedMessage,
      language: language,
      formalityLevel: formalityLevel
    });
  } catch (error) {
    console.error('문화적 컨텍스트 적용 실패:', error);
    res.status(500).json({
      error: {
        message: '문화적 컨텍스트 적용 실패',
        type: 'server_error',
        code: 'cultural_context_failed'
      }
    });
  }
});

app.post('/api/cultural/starter/:topic', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { topic } = req.params;
    const { language, formalityLevel } = req.body;
    const starter = culturalManager.generateConversationStarter(language, formalityLevel, topic);
    
    res.json({
      message: '문화적 대화 시작어를 생성했습니다.',
      starter: starter,
      topic: topic,
      language: language,
      formalityLevel: formalityLevel
    });
  } catch (error) {
    console.error('대화 시작어 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '대화 시작어 생성 실패',
        type: 'server_error',
        code: 'conversation_starter_failed'
      }
    });
  }
});

app.get('/api/cultural/etiquette/:language/:context', authenticateToken, async (req, res) => {
  try {
    const { language, context } = req.params;
    const etiquette = culturalManager.getCulturalEtiquette(language, context);
    
    res.json({
      message: `${language} ${context} 예절 정보를 조회했습니다.`,
      etiquette: etiquette
    });
  } catch (error) {
    console.error('예절 정보 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '예절 정보 조회 실패',
        type: 'server_error',
        code: 'etiquette_info_failed'
      }
    });
  }
});

app.post('/api/cultural/preferences/:userId', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { userId } = req.params;
    const { language, formalityLevel, age } = req.body;
    
    const saved = await culturalManager.saveCulturalPreferences(userId, {
      language,
      formalityLevel,
      age
    });
    
    if (saved) {
             res.json({
         message: '문화적 선호도를 저장했습니다.',
         userId: userId,
         preferences: { language, formalityLevel, age }
       });
    } else {
      res.status(500).json({
        error: {
          message: '문화적 선호도 저장 실패',
          type: 'server_error',
          code: 'preferences_save_failed'
        }
      });
    }
  } catch (error) {
    console.error('문화적 선호도 저장 실패:', error);
    res.status(500).json({
      error: {
        message: '문화적 선호도 저장 실패',
        type: 'server_error',
        code: 'preferences_save_failed'
      }
    });
  }
});

app.get('/api/cultural/preferences/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const preferences = await culturalManager.loadCulturalPreferences(userId);
    
    if (preferences) {
      res.json({
        message: '문화적 선호도를 조회했습니다.',
        userId: userId,
        preferences: preferences
      });
    } else {
      res.json({
        message: '저장된 문화적 선호도가 없습니다.',
        userId: userId,
        preferences: null
      });
    }
  } catch (error) {
    console.error('문화적 선호도 조회 실패:', error);
    res.status(500).json({
      error: {
        message: '문화적 선호도 조회 실패',
        type: 'server_error',
        code: 'preferences_load_failed'
      }
    });
  }
});

app.post('/api/cultural/prompt', authenticateToken, [
  body('language').isIn(['en', 'fr', 'ko', 'ja', 'zh']).withMessage('지원되는 언어를 선택해주세요.'),
  body('formalityLevel').isIn(['casual', 'polite', 'formal', 'respectful']).withMessage('올바른 격식 수준을 선택해주세요.')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: {
          message: '입력 데이터가 올바르지 않습니다.',
          type: 'validation_error',
          code: 'invalid_input',
          details: errors.array()
        }
      });
    }

    const { language, formalityLevel, userContext } = req.body;
    const prompt = culturalManager.generateCulturalPrompt(language, formalityLevel, userContext || {});
    
    res.json({
      message: '문화적 AI 프롬프트를 생성했습니다.',
      prompt: prompt,
      language: language,
      formalityLevel: formalityLevel,
      userContext: userContext || {}
    });
  } catch (error) {
    console.error('문화적 AI 프롬프트 생성 실패:', error);
    res.status(500).json({
      error: {
        message: '문화적 AI 프롬프트 생성 실패',
        type: 'server_error',
        code: 'cultural_prompt_failed'
      }
    });
  }
});

// 서버 상태 확인 엔드포인트
app.get('/status', (req, res) => {
  res.json({
    message: 'Ollama 기반 OpenAI API 호환 서버 (메모리 기능 포함)',
    version: '9.0.0',
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
      '/api/telomere/:userId/routine': '텔로미어 건강: 일상 루틴 기록',
      '/api/telomere/:userId/signals': '텔로미어 건강: 일일 라이프스타일 신호',
      '/api/telomere/:userId/biomarkers': '텔로미어 건강: 바이오마커 저장',
      '/api/telomere/:userId/biomarkers/report': '텔로미어 건강: 바이오마커 리포트',
      '/api/telomere/:userId/ltl': '텔로미어 건강: LTL 결과 저장',
      '/api/telomere/:userId/ltl/trend': '텔로미어 건강: LTL 추세',
      '/api/telomere/:userId/feedback': '텔로미어 건강: 피드백 생성',
      '/api/cardiovascular/:userId/physiological': '심혈관 경고: 생리학적 지표 기록',
      '/api/cardiovascular/:userId/medication': '심혈관 경고: 약물 기록',
      '/api/cardiovascular/:userId/lifestyle': '심혈관 경고: 라이프스타일 데이터 기록',
      '/api/cardiovascular/:userId/psychosocial': '심혈관 경고: 심리사회적 데이터 기록',
      '/api/cardiovascular/:userId/risk-assessment': '심혈관 경고: 위험도 평가',
      '/api/cardiovascular/:userId/risk-profile': '심혈관 경고: 위험도 프로필 조회',
      '/api/cardiovascular/:userId/risk-trends': '심혈관 경고: 위험도 트렌드',
      '/api/cardiovascular/:userId/simulation': '심혈관 경고: 시나리오 시뮬레이션',
      '/api/cardiovascular/:userId/alerts': '심혈관 경고: 알림 조회',
      '/api/brain-research/jobs': '뇌 연구 컴퓨팅: 사용 가능한 작업 조회',
      '/api/brain-research/jobs/:jobId/assign': '뇌 연구 컴퓨팅: 작업 할당',
      '/api/brain-research/jobs/:jobId/submit': '뇌 연구 컴퓨팅: 결과 제출',
      '/api/brain-research/contribution/:userId': '뇌 연구 컴퓨팅: 사용자 기여 통계',
      '/api/brain-research/leaderboard': '뇌 연구 컴퓨팅: 리더보드',
      '/api/brain-research/statistics': '뇌 연구 컴퓨팅: 연구 통계',
      '/api/brain-research/generate-jobs': '뇌 연구 컴퓨팅: 새 작업 생성',
      '/api/brain-research/templates': '뇌 연구 컴퓨팅: 사용 가능한 템플릿 조회',
      '/api/brain-research/submit-job': '뇌 연구 컴퓨팅: 사용자 작업 제출',
      '/api/brain-research/user-jobs/:userId': '뇌 연구 컴퓨팅: 사용자 제출 작업 상태',
      '/api/brain-research/credits/:userId': '뇌 연구 컴퓨팅: 사용자 크레딧 조회',
      '/api/brain-research/validate-results/:userJobId': '뇌 연구 컴퓨팅: 사용자 작업 결과 검증',
      '/api/embodied-identity/:userId/identity': '체화된 정체성: 사용자 정체성 생성/업데이트',
      '/api/embodied-identity/:userId/session': '체화된 정체성: 정체성 세션 시작',
      '/api/embodied-identity/session/:sessionId/interaction': '체화된 정체성: 세션 상호작용 처리',
      '/api/embodied-identity/session/:sessionId/end': '체화된 정체성: 세션 종료',
      '/api/embodied-identity/:userId/profile': '체화된 정체성: 사용자 정체성 프로필 조회',
      '/api/embodied-identity/:userId/active-sessions': '체화된 정체성: 활성 세션 조회',
      '/api/embodied-identity/:userId/session-history': '체화된 정체성: 세션 기록 조회',
      '/api/embodied-identity/scenarios': '체화된 정체성: 역할극 시나리오 조회',
      '/api/embodied-identity/memory-landscapes': '체화된 정체성: 메모리 랜드스케이프 옵션 조회',
      '/api/cultural/profile/:language': '문화 프로필 조회',
      '/api/cultural/style/:language/:formality': '대화 스타일 조회',
      '/api/cultural/greeting': '문화적 인사말 생성',
      '/api/cultural/response': '문화적 응답 패턴 생성',
      '/api/cultural/context': '문화적 컨텍스트 적용',
      '/api/cultural/starter/:topic': '문화적 대화 시작어 생성',
      '/api/cultural/etiquette/:language/:context': '문화적 예절 정보 조회',
      '/api/cultural/preferences/:userId': '문화적 선호도 저장/조회',
      '/api/cultural/prompt': '문화적 AI 프롬프트 생성',
      '/api/security/status': '보안 상태 조회',
      '/api/security/config': '보안 설정 업데이트',
      '/api/security/backup/:userId': '암호화된 메모리 백업',
      '/api/security/restore/:userId': '메모리 복원',
      '/api/security/memory/:userId': '안전한 메모리 삭제',
      
      // 🚀 고도화 엔드포인트
      '/api/performance/status': 'AI 성능 모니터링 상태',
      '/api/performance/metrics': '성능 메트릭 조회',
      '/api/performance/optimize': '성능 최적화 실행',
      '/api/behavior/analyze': '사용자 행동 분석',
      '/api/behavior/personalize': '개인화 설정 조회',
      '/api/security/advanced/status': '고급 보안 상태',
      '/api/security/advanced/audit': '보안 감사 보고서',
      '/api/security/advanced/alerts': '보안 알림 조회',
      '/api/optimization/cache': '캐시 상태 및 통계',
      '/api/optimization/load-balancer': '로드 밸런서 상태',
      '/api/optimization/recommendations': '최적화 권장사항',

      '/health': '서버 상태 확인'
    }
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ollama 기반 OpenAI API 호환 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`🤖 AI 서버: OLLAMA`);
  console.log(`📡 AI 서버 URL: ${OLLAMA_URL}`);
  console.log(`🔗 OpenAI 호환 엔드포인트: http://localhost:${PORT}/v1/chat/completions`);
    console.log(`🧪 테스트 엔드포인트: http://localhost:${PORT}/api/generate`);
  console.log(`🔊 멀티모달 통합 시스템이 초기화되었습니다.`);
  console.log(`🌍 문화 및 언어 최적화 시스템이 초기화되었습니다.`);
  console.log(`🧬 텔로미어 기반 건강 관리 모듈이 초기화되었습니다.`);
  console.log(`💓 급성 심혈관 사건 조기 경고 시스템이 초기화되었습니다.`);
  console.log(`🧠 뇌 질환 연구 분산 컴퓨팅 시스템이 초기화되었습니다.`);
  console.log(`🌟 체화된 정체성 및 자아 복원 시스템이 초기화되었습니다.`);
  
  // WebSocket 서버 초기화
  multimodalManager.initializeWebSocket(server);
  
  // Brain Research Computing 초기화
  brainResearchComputingManager.initializeSampleJobs();
  
  // 정기적인 정리 작업 스케줄링
  setInterval(() => {
    brainResearchComputingManager.cleanup();
    embodiedIdentityManager.cleanup();
  }, 60 * 60 * 1000); // 1시간마다
  
  // 🚀 고도화 모듈 초기화 완료
  console.log(`📊 AI 성능 모니터링 시스템이 초기화되었습니다.`);
  console.log(`👤 사용자 행동 분석 시스템이 초기화되었습니다.`);
  console.log(`🔒 고급 보안 관리 시스템이 초기화되었습니다.`);
  console.log(`⚡ 성능 최적화 시스템이 초기화되었습니다.`);
}); 

// 🚀 고도화 엔드포인트 구현

// AI 성능 모니터링 상태
app.get('/api/performance/status', (req, res) => {
  try {
    const status = aiPerformanceMonitor.getRealTimeDashboard();
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 성능 메트릭 조회
app.get('/api/performance/metrics', (req, res) => {
  try {
    const metrics = aiPerformanceMonitor.generatePerformanceStats();
    res.json({
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 성능 최적화 실행
app.post('/api/performance/optimize', (req, res) => {
  try {
    const { operation, data } = req.body;
    
    if (!operation) {
      return res.status(400).json({
        success: false,
        error: {
          message: '최적화 작업을 지정해야 합니다.',
          type: 'validation_error',
          code: 'missing_operation'
        }
      });
    }

    // 성능 최적화 실행
    const result = performanceOptimizer.optimizeResponseTime(operation, () => {
      // 실제 최적화 로직 (예시)
      return { optimized: true, operation, timestamp: new Date().toISOString() };
    });

    res.json({
      success: true,
      data: result,
      message: '성능 최적화가 완료되었습니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 사용자 행동 분석
app.post('/api/behavior/analyze', (req, res) => {
  try {
    const { userId, behaviorType, data } = req.body;
    
    if (!userId || !behaviorType) {
      return res.status(400).json({
        success: false,
        error: {
          message: '사용자 ID와 행동 유형을 지정해야 합니다.',
          type: 'validation_error',
          code: 'missing_parameters'
        }
      });
    }

    // 사용자 행동 기록 및 분석
    const behaviorRecord = userBehaviorAnalyzer.recordUserBehavior(userId, behaviorType, data);
    
    res.json({
      success: true,
      data: behaviorRecord,
      message: '사용자 행동이 분석되었습니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 개인화 설정 조회
app.get('/api/behavior/personalize/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const context = req.query.context || 'general';
    
    const personalization = userBehaviorAnalyzer.generatePersonalizedResponse(userId, context);
    
    res.json({
      success: true,
      data: personalization,
      message: '개인화 설정이 생성되었습니다.',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 고급 보안 상태
app.get('/api/security/advanced/status', (req, res) => {
  try {
    const status = advancedSecurityManager.getSecurityStatus();
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 보안 감사 보고서
app.get('/api/security/advanced/audit', (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({
        success: false,
        error: {
          message: '시작일과 종료일을 지정해야 합니다.',
          type: 'validation_error',
          code: 'missing_dates'
        }
      });
    }

    const auditReport = advancedSecurityManager.generateSecurityAuditReport(startDate, endDate);
    
    res.json({
      success: true,
      data: auditReport,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 보안 알림 조회
app.get('/api/security/advanced/alerts', (req, res) => {
  try {
    const alerts = advancedSecurityManager.generateAlerts();
    
    res.json({
      success: true,
      data: alerts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 캐시 상태 및 통계
app.get('/api/optimization/cache', (req, res) => {
  try {
    const cacheStats = performanceOptimizer.generatePerformanceStats();
    
    res.json({
      success: true,
      data: cacheStats.cache,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 로드 밸런서 상태
app.get('/api/optimization/load-balancer', (req, res) => {
  try {
    const loadBalancerStats = performanceOptimizer.generatePerformanceStats();
    
    res.json({
      success: true,
      data: loadBalancerStats.loadBalancer,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 최적화 권장사항
app.get('/api/optimization/recommendations', (req, res) => {
  try {
    const recommendations = performanceOptimizer.generateOptimizationRecommendations();
    
    res.json({
      success: true,
      data: recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// ===== 🧬 Multi-Scale Brain Modeling API Endpoints =====

// 뇌 영역 정보 조회
app.get('/api/brain-modeling/regions', (req, res) => {
  try {
    const regions = multiScaleBrainModeling.getBrainRegions();
    
    res.json({
      success: true,
      data: regions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 뉴런 타입 정보 조회
app.get('/api/brain-modeling/neuron-types', (req, res) => {
  try {
    const neuronTypes = multiScaleBrainModeling.getNeuronTypes();
    
    res.json({
      success: true,
      data: neuronTypes,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 연결성 매트릭스 조회
app.get('/api/brain-modeling/connectivity', (req, res) => {
  try {
    const connectivity = multiScaleBrainModeling.getConnectivityMatrix();
    
    res.json({
      success: true,
      data: connectivity,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 현미경 수준 시뮬레이션 (개별 뉴런)
app.post('/api/brain-modeling/microscopic', (req, res) => {
  try {
    const parameters = req.body;
    
    multiScaleBrainModeling.simulateMicroscopicLevel(parameters)
      .then(result => {
        res.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          error: {
            message: error.message,
            type: 'simulation_error',
            code: 'microscopic_simulation_failed'
          }
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 중간 수준 시뮬레이션 (뇌 영역 간 연결성)
app.post('/api/brain-modeling/mesoscopic', (req, res) => {
  try {
    const parameters = req.body;
    
    multiScaleBrainModeling.simulateMesoscopicLevel(parameters)
      .then(result => {
        res.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          error: {
            message: error.message,
            type: 'simulation_error',
            code: 'mesoscopic_simulation_failed'
          }
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 거시 수준 시뮬레이션 (전체 뇌 네트워크)
app.post('/api/brain-modeling/macroscopic', (req, res) => {
  try {
    const parameters = req.body;
    
    multiScaleBrainModeling.simulateMacroscopicLevel(parameters)
      .then(result => {
        res.json({
          success: true,
          data: result,
          timestamp: new Date().toISOString()
        });
      })
      .catch(error => {
        res.status(400).json({
          success: false,
          error: {
            message: error.message,
            type: 'simulation_error',
            code: 'macroscopic_simulation_failed'
          }
        });
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 시뮬레이션 상태 조회
app.get('/api/brain-modeling/simulation/:simulationId', (req, res) => {
  try {
    const { simulationId } = req.params;
    const status = multiScaleBrainModeling.getSimulationStatus(simulationId);
    
    if (!status.success) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Simulation not found',
          type: 'not_found',
          code: 'simulation_not_found'
        }
      });
    }
    
    res.json({
      success: true,
      data: status,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 활성 시뮬레이션 목록 조회
app.get('/api/brain-modeling/simulations', (req, res) => {
  try {
    const simulations = multiScaleBrainModeling.getActiveSimulations();
    
    res.json({
      success: true,
      data: simulations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});

// 시뮬레이션 삭제
app.delete('/api/brain-modeling/simulation/:simulationId', (req, res) => {
  try {
    const { simulationId } = req.params;
    const deleted = multiScaleBrainModeling.clearSimulation(simulationId);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Simulation not found',
          type: 'not_found',
          code: 'simulation_not_found'
        }
      });
    }
    
    res.json({
      success: true,
      message: 'Simulation cleared successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        message: error.message,
        type: 'internal_error',
        code: 'server_error'
      }
    });
  }
});