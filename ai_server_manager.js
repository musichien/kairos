const axios = require('axios');

class AIServerManager {
  constructor() {
    this.serverType = process.env.AI_SERVER_TYPE || 'ollama';
    this.ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434';
    this.lmstudioUrl = process.env.LMSTUDIO_URL || 'http://localhost:1234';
    
    console.log(`🤖 AI 서버 관리자 초기화: ${this.serverType.toUpperCase()}`);
  }

  // AI 서버 URL 반환
  getServerUrl() {
    return this.serverType === 'lmstudio' ? this.lmstudioUrl : this.ollamaUrl;
  }

  // 채팅 엔드포인트 반환
  getChatEndpoint() {
    return this.serverType === 'lmstudio' ? '/v1/chat/completions' : '/api/chat';
  }

  // 모델 목록 엔드포인트 반환
  getModelsEndpoint() {
    return this.serverType === 'lmstudio' ? '/v1/models' : '/api/tags';
  }

  // 서버 타입 변경
  setServerType(type) {
    if (['ollama', 'lmstudio'].includes(type)) {
      this.serverType = type;
      console.log(`🔄 AI 서버 타입 변경: ${type.toUpperCase()}`);
      return true;
    }
    return false;
  }

  // 서버 연결 테스트
  async testConnection() {
    try {
      const url = this.getServerUrl();
      const endpoint = this.getModelsEndpoint();
      const response = await axios.get(`${url}${endpoint}`, { timeout: 10000 });
      
      return {
        success: true,
        serverType: this.serverType,
        url: url,
        status: response.status,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        serverType: this.serverType,
        url: this.getServerUrl(),
        error: error.message
      };
    }
  }

  // 채팅 요청 전송
  async sendChatRequest(messages, model, temperature = 0.7, maxTokens = null) {
    try {
      const url = this.getServerUrl();
      const endpoint = this.getChatEndpoint();
      
      let requestData;
      
      if (this.serverType === 'lmstudio') {
        // LM Studio (OpenAI 호환) 형식
        requestData = {
          model: model,
          messages: messages,
          temperature: temperature,
          max_tokens: maxTokens || 1000,
          stream: false
        };
      } else {
        // Ollama 형식
        requestData = {
          model: model,
          messages: messages,
          stream: false,
          options: {
            temperature: temperature,
            ...(maxTokens && { num_predict: maxTokens })
          }
        };
      }

      const response = await axios.post(`${url}${endpoint}`, requestData, {
        timeout: 120000,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      return {
        success: true,
        data: response.data,
        serverType: this.serverType
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        serverType: this.serverType
      };
    }
  }

  // 모델 목록 가져오기
  async getModels() {
    try {
      const url = this.getServerUrl();
      const endpoint = this.getModelsEndpoint();
      const response = await axios.get(`${url}${endpoint}`, { timeout: 10000 });
      
      let models = [];
      
      if (this.serverType === 'lmstudio') {
        // LM Studio 형식: { data: [{ id: "model_name" }] }
        models = response.data.data?.map(model => model.id) || [];
      } else {
        // Ollama 형식: { models: [{ name: "model_name" }] }
        models = response.data.models?.map(model => model.name) || [];
      }
      
      return {
        success: true,
        models: models,
        serverType: this.serverType
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        serverType: this.serverType
      };
    }
  }

  // 현재 설정 정보 반환
  getConfig() {
    return {
      serverType: this.serverType,
      ollamaUrl: this.ollamaUrl,
      lmstudioUrl: this.lmstudioUrl,
      currentUrl: this.getServerUrl(),
      chatEndpoint: this.getChatEndpoint(),
      modelsEndpoint: this.getModelsEndpoint()
    };
  }
}

module.exports = AIServerManager;

