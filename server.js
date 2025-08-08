const express = require('express');
const axios = require('axios');
const cors = require('cors');
const MemoryManager = require('./memory');

const app = express();
const memoryManager = new MemoryManager();
const PORT = process.env.PORT || 3000;

// 보안 설정
const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key-here';
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['*'];

// 미들웨어 설정
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS 설정 (보안 강화)
app.use(cors({
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 인증 미들웨어
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: {
        message: 'Access token required',
        type: 'authentication_error',
        code: 'missing_token'
      }
    });
  }

  if (token !== SECRET_KEY) {
    return res.status(403).json({
      error: {
        message: 'Invalid access token',
        type: 'authentication_error',
        code: 'invalid_token'
      }
    });
  }

  next();
}

// Ollama 서버 URL (기본값: localhost:11434)
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

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

    // 메모리 컨텍스트 추가 (user_id가 제공된 경우)
    let enhancedMessages = [...messages];
    if (user_id) {
      try {
        const memoryContext = await memoryManager.generateContext(user_id, 3);
        enhancedMessages = [...memoryContext, ...messages];
        console.log(`🧠 사용자 ${user_id}의 메모리 컨텍스트 추가됨 (${memoryContext.length}개 항목)`);
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

// 서버 상태 확인
app.get('/', (req, res) => {
  res.json({
    message: 'Ollama OpenAI API 호환 서버 (메모리 기능 포함)',
    version: '2.0.0',
    endpoints: {
      '/v1/chat/completions': 'OpenAI API 호환 엔드포인트 (메모리 기능 포함)',
      '/api/generate': 'Ollama 직접 호출 엔드포인트',
      '/api/memory/:userId': '사용자 메모리 조회',
      '/api/memory/:userId/stats': '메모리 통계 조회',
      '/api/memory/:userId/facts': '사실 추가',
      '/api/memory/:userId/preferences': '선호도 추가',
      '/api/memory': '모든 사용자 목록',
      '/health': '서버 상태 확인'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Ollama API 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📡 Ollama 서버 URL: ${OLLAMA_URL}`);
  console.log(`🔗 OpenAI 호환 엔드포인트: http://localhost:${PORT}/v1/chat/completions`);
  console.log(`🧪 테스트 엔드포인트: http://localhost:${PORT}/api/generate`);
}); 