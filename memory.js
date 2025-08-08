const fs = require('fs').promises;
const path = require('path');

class MemoryManager {
  constructor() {
    this.memoryDir = path.join(__dirname, 'memories');
    this.ensureMemoryDir();
  }

  // 메모리 디렉토리 생성
  async ensureMemoryDir() {
    try {
      await fs.access(this.memoryDir);
    } catch (error) {
      await fs.mkdir(this.memoryDir, { recursive: true });
      console.log('📁 메모리 디렉토리 생성됨:', this.memoryDir);
    }
  }

  // 사용자별 메모리 파일 경로
  getUserMemoryPath(userId) {
    return path.join(this.memoryDir, `${userId}.json`);
  }

  // 사용자 메모리 로드
  async loadUserMemory(userId) {
    try {
      const filePath = this.getUserMemoryPath(userId);
      const data = await fs.readFile(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // 파일이 없으면 새로 생성
      if (error.code === 'ENOENT') {
        const defaultMemory = {
          userId: userId,
          conversations: [],
          facts: [],
          preferences: [],
          createdAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString()
        };
        await this.saveUserMemory(userId, defaultMemory);
        return defaultMemory;
      }
      throw error;
    }
  }

  // 사용자 메모리 저장
  async saveUserMemory(userId, memory) {
    const filePath = this.getUserMemoryPath(userId);
    memory.lastUpdated = new Date().toISOString();
    await fs.writeFile(filePath, JSON.stringify(memory, null, 2), 'utf8');
  }

  // 대화 이력 추가
  async addConversation(userId, messages, response) {
    const memory = await this.loadUserMemory(userId);
    
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      messages: messages,
      response: response,
      summary: this.generateSummary(messages, response)
    };

    memory.conversations.push(conversation);
    
    // 최근 50개 대화만 유지 (메모리 효율성)
    if (memory.conversations.length > 50) {
      memory.conversations = memory.conversations.slice(-50);
    }

    await this.saveUserMemory(userId, memory);
    return conversation;
  }

  // 사실 추가
  async addFact(userId, fact, category = 'general') {
    const memory = await this.loadUserMemory(userId);
    
    const factEntry = {
      id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: fact,
      category: category,
      timestamp: new Date().toISOString(),
      confidence: 1.0
    };

    memory.facts.push(factEntry);
    await this.saveUserMemory(userId, memory);
    return factEntry;
  }

  // 선호도 추가
  async addPreference(userId, preference, value) {
    const memory = await this.loadUserMemory(userId);
    
    const prefEntry = {
      id: `pref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      preference: preference,
      value: value,
      timestamp: new Date().toISOString()
    };

    memory.preferences.push(prefEntry);
    await this.saveUserMemory(userId, memory);
    return prefEntry;
  }

  // 컨텍스트 생성 (AI에게 전달할 기억)
  async generateContext(userId, maxConversations = 5) {
    const memory = await this.loadUserMemory(userId);
    
    let context = [];
    
    // 최근 대화들 추가
    const recentConversations = memory.conversations.slice(-maxConversations);
    for (const conv of recentConversations) {
      context.push({
        role: 'system',
        content: `이전 대화 (${new Date(conv.timestamp).toLocaleString()}): ${conv.summary}`
      });
    }

    // 중요한 사실들 추가
    if (memory.facts.length > 0) {
      const facts = memory.facts.map(f => f.content).join(', ');
      context.push({
        role: 'system',
        content: `사용자에 대해 알고 있는 사실들: ${facts}`
      });
    }

    // 선호도 추가
    if (memory.preferences.length > 0) {
      const prefs = memory.preferences.map(p => `${p.preference}: ${p.value}`).join(', ');
      context.push({
        role: 'system',
        content: `사용자 선호도: ${prefs}`
      });
    }

    return context;
  }

  // 대화 요약 생성
  generateSummary(messages, response) {
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    const aiResponse = response?.choices?.[0]?.message?.content || '';
    
    return `사용자: "${lastUserMessage.substring(0, 100)}${lastUserMessage.length > 100 ? '...' : ''}" | AI: "${aiResponse.substring(0, 100)}${aiResponse.length > 100 ? '...' : ''}"`;
  }

  // 메모리 조회
  async getUserMemory(userId) {
    return await this.loadUserMemory(userId);
  }

  // 메모리 삭제
  async deleteUserMemory(userId) {
    try {
      const filePath = this.getUserMemoryPath(userId);
      await fs.unlink(filePath);
      return { success: true, message: '사용자 메모리가 삭제되었습니다.' };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return { success: false, message: '사용자 메모리를 찾을 수 없습니다.' };
      }
      throw error;
    }
  }

  // 메모리 통계
  async getMemoryStats(userId) {
    const memory = await this.loadUserMemory(userId);
    return {
      userId: userId,
      totalConversations: memory.conversations.length,
      totalFacts: memory.facts.length,
      totalPreferences: memory.preferences.length,
      createdAt: memory.createdAt,
      lastUpdated: memory.lastUpdated
    };
  }

  // 모든 사용자 목록
  async getAllUsers() {
    try {
      const files = await fs.readdir(this.memoryDir);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      return [];
    }
  }
}

module.exports = MemoryManager; 