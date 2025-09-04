const fs = require('fs').promises;
const path = require('path');

class MemoryManager {
  constructor() {
    this.memoryDir = path.join(__dirname, 'memories');
    this.mnemosyneDataDir = path.join(__dirname, 'mnemosyne_data');
    this.ensureMemoryDir();
    this.ensureMnemosyneDataDir();
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

  // Mnemosyne 데이터 디렉토리 생성
  async ensureMnemosyneDataDir() {
    try {
      await fs.access(this.mnemosyneDataDir);
    } catch (error) {
      await fs.mkdir(this.mnemosyneDataDir, { recursive: true });
      console.log('🏛️ Mnemosyne 데이터 디렉토리 생성됨:', this.mnemosyneDataDir);
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
          lifeEvents: [], // 인생 사건 타임라인
          emotionalStates: [], // 감정 상태 추적
          relationships: [], // 관계 정보
          goals: [], // 목표 및 계획
          interests: [], // 관심사 및 취미
          memories: [], // 장기 기억
          contextPatterns: [], // 맥락 패턴
          // Mnemosyne 확장 구조
          mnemosyne: {
            culturalMemory: [], // 문화적 기억
            temporalContext: [], // 시간적 맥락
            identityPatterns: [], // 정체성 패턴
            collectiveMemory: [], // 집단 기억
            mythologicalReferences: [], // 신화적 참조
            educationalContext: [], // 교육적 맥락
            scientificContext: [], // 과학적 맥락
            literaryContext: [], // 문학적 맥락
            digitalEraContext: [] // 디지털 시대 맥락
          },
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

  // 대화 이력 추가 (감정 분석 포함)
  async addConversation(userId, messages, response) {
    const memory = await this.loadUserMemory(userId);
    
    // 배열이 undefined인 경우 초기화
    if (!memory.conversations) memory.conversations = [];
    if (!memory.emotionalStates) memory.emotionalStates = [];
    if (!memory.lifeEvents) memory.lifeEvents = [];
    if (!memory.contextPatterns) memory.contextPatterns = [];
    
    // 감정 상태 분석
    const emotionalState = this.analyzeEmotionalState(messages, response);
    
    const conversation = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      messages: messages,
      response: response,
      summary: this.generateSummary(messages, response),
      emotionalState: emotionalState,
      topics: this.extractTopics(messages, response),
      sentiment: this.analyzeSentiment(messages, response),
      context: this.extractContext(messages, response)
    };

    memory.conversations.push(conversation);
    
    // 감정 상태 추적 업데이트
    await this.updateEmotionalState(userId, emotionalState, conversation);
    
    // 인생 사건 추출 및 저장
    await this.extractLifeEvents(userId, conversation);
    
    // 맥락 패턴 업데이트
    await this.updateContextPatterns(userId, conversation);
    
    // 최근 100개 대화만 유지 (메모리 효율성)
    if (memory.conversations.length > 100) {
      memory.conversations = memory.conversations.slice(-100);
    }

    await this.saveUserMemory(userId, memory);
    return conversation;
  }

  // 감정 상태 분석
  analyzeEmotionalState(messages, response) {
    const userMessage = messages[messages.length - 1]?.content || '';
    const aiResponse = response?.choices?.[0]?.message?.content || '';
    
    // 감정 키워드 분석
    const emotionalKeywords = {
      happy: ['행복', '기쁨', '즐거움', '웃음', '좋아', '만족', '성취', '감사'],
      sad: ['슬픔', '우울', '실망', '절망', '외로움', '상실', '아픔', '눈물'],
      angry: ['화남', '분노', '짜증', '열받음', '불만', '격분', '화가'],
      anxious: ['불안', '걱정', '긴장', '스트레스', '두려움', '걱정', '불안'],
      excited: ['흥분', '기대', '설렘', '열정', '동기부여', '의욕'],
      calm: ['평온', '차분', '여유', '안정', '평화', '고요']
    };
    
    let detectedEmotions = [];
    const allText = (userMessage + ' ' + aiResponse).toLowerCase();
    
    for (const [emotion, keywords] of Object.entries(emotionalKeywords)) {
      for (const keyword of keywords) {
        if (allText.includes(keyword)) {
          detectedEmotions.push(emotion);
          break;
        }
      }
    }
    
    return {
      primary: detectedEmotions[0] || 'neutral',
      secondary: detectedEmotions.slice(1),
      intensity: this.calculateEmotionalIntensity(userMessage),
      timestamp: new Date().toISOString()
    };
  }

  // 감정 강도 계산
  calculateEmotionalIntensity(text) {
    const intensityIndicators = {
      high: ['매우', '정말', '너무', '완전히', '극도로', '대단히'],
      medium: ['꽤', '어느 정도', '적당히', '보통'],
      low: ['조금', '약간', '살짝', '미미하게']
    };
    
    const lowerText = text.toLowerCase();
    for (const [level, indicators] of Object.entries(intensityIndicators)) {
      for (const indicator of indicators) {
        if (lowerText.includes(indicator)) {
          return level;
        }
      }
    }
    return 'medium';
  }

  // 감정 상태 추적 업데이트
  async updateEmotionalState(userId, emotionalState, conversation) {
    const memory = await this.loadUserMemory(userId);
    
    const emotionalEntry = {
      id: `emotion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      primary: emotionalState.primary,
      secondary: emotionalState.secondary,
      intensity: emotionalState.intensity,
      timestamp: emotionalState.timestamp,
      context: conversation.summary,
      conversationId: conversation.id
    };
    
    memory.emotionalStates.push(emotionalEntry);
    
    // 최근 50개 감정 상태만 유지
    if (memory.emotionalStates.length > 50) {
      memory.emotionalStates = memory.emotionalStates.slice(-50);
    }
    
    await this.saveUserMemory(userId, memory);
  }

  // 인생 사건 추출
  async extractLifeEvents(userId, conversation) {
    const memory = await this.loadUserMemory(userId);
    const userMessage = conversation.messages[conversation.messages.length - 1]?.content || '';
    
    // 인생 사건 키워드 패턴
    const lifeEventPatterns = [
      /(졸업|입학|시험|학교|대학|학업)/,
      /(취업|직장|일|회사|직업|경력)/,
      /(결혼|이혼|연애|사랑|관계)/,
      /(출생|태어남|생일|기념일)/,
      /(이사|이주|새집|집)/,
      /(여행|휴가|방문|외출)/,
      /(병|병원|치료|건강)/,
      /(사망|죽음|상실|별세)/,
      /(성취|목표|달성|성공)/,
      /(실패|실망|좌절|어려움)/
    ];
    
    for (const pattern of lifeEventPatterns) {
      if (pattern.test(userMessage)) {
        const lifeEvent = {
          id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: this.categorizeLifeEvent(userMessage),
          description: userMessage.substring(0, 200),
          timestamp: new Date().toISOString(),
          conversationId: conversation.id,
          emotionalImpact: conversation.emotionalState.primary,
          importance: this.calculateEventImportance(userMessage)
        };
        
        // 중복 체크
        const isDuplicate = memory.lifeEvents.some(event => 
          event.type === lifeEvent.type && 
          Math.abs(new Date(event.timestamp) - new Date(lifeEvent.timestamp)) < 24 * 60 * 60 * 1000
        );
        
        if (!isDuplicate) {
          memory.lifeEvents.push(lifeEvent);
        }
        break;
      }
    }
    
    await this.saveUserMemory(userId, memory);
  }

  // 인생 사건 분류
  categorizeLifeEvent(message) {
    const categories = {
      education: ['졸업', '입학', '시험', '학교', '대학', '학업'],
      career: ['취업', '직장', '일', '회사', '직업', '경력'],
      relationship: ['결혼', '이혼', '연애', '사랑', '관계'],
      family: ['출생', '태어남', '생일', '기념일', '가족'],
      residence: ['이사', '이주', '새집', '집'],
      travel: ['여행', '휴가', '방문', '외출'],
      health: ['병', '병원', '치료', '건강'],
      loss: ['사망', '죽음', '상실', '별세'],
      achievement: ['성취', '목표', '달성', '성공'],
      challenge: ['실패', '실망', '좌절', '어려움']
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [category, keywords] of Object.entries(categories)) {
      for (const keyword of keywords) {
        if (lowerMessage.includes(keyword)) {
          return category;
        }
      }
    }
    return 'general';
  }

  // 사건 중요도 계산
  calculateEventImportance(message) {
    const importanceIndicators = {
      high: ['중요', '큰', '주요', '핵심', '전환점', '기념비적'],
      medium: ['보통', '일반적', '평범한'],
      low: ['작은', '사소한', '간단한']
    };
    
    const lowerMessage = message.toLowerCase();
    for (const [level, indicators] of Object.entries(importanceIndicators)) {
      for (const indicator of indicators) {
        if (lowerMessage.includes(indicator)) {
          return level;
        }
      }
    }
    return 'medium';
  }

  // 맥락 패턴 업데이트
  async updateContextPatterns(userId, conversation) {
    const memory = await this.loadUserMemory(userId);
    
    // 주제 추출
    const topics = this.extractTopics(conversation.messages, conversation.response);
    
    // 맥락 패턴 생성
    const contextPattern = {
      id: `pattern_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      topics: topics,
      emotionalState: conversation.emotionalState.primary,
      timestamp: new Date().toISOString(),
      frequency: 1,
      relatedConversations: [conversation.id]
    };
    
    // 기존 패턴과 비교하여 빈도 업데이트
    const existingPattern = memory.contextPatterns.find(pattern => 
      pattern.topics.some(topic => topics.includes(topic)) &&
      pattern.emotionalState === contextPattern.emotionalState
    );
    
    if (existingPattern) {
      existingPattern.frequency += 1;
      existingPattern.relatedConversations.push(conversation.id);
      existingPattern.timestamp = new Date().toISOString();
    } else {
      memory.contextPatterns.push(contextPattern);
    }
    
    await this.saveUserMemory(userId, memory);
  }

  // 주제 추출
  extractTopics(messages, response) {
    const allText = messages.map(m => m.content).join(' ') + ' ' + 
                   (response?.choices?.[0]?.message?.content || '');
    
    const topicKeywords = {
      work: ['일', '직장', '회사', '업무', '프로젝트', '업계'],
      family: ['가족', '부모', '자식', '형제', '친척'],
      health: ['건강', '병', '치료', '운동', '다이어트'],
      education: ['학습', '공부', '교육', '지식', '기술'],
      relationships: ['관계', '친구', '연인', '동료', '인간관계'],
      hobbies: ['취미', '관심사', '게임', '독서', '음악'],
      emotions: ['감정', '기분', '마음', '심리', '스트레스'],
      goals: ['목표', '계획', '미래', '꿈', '희망']
    };
    
    const detectedTopics = [];
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      for (const keyword of keywords) {
        if (allText.includes(keyword)) {
          detectedTopics.push(topic);
          break;
        }
      }
    }
    
    return detectedTopics;
  }

  // 맥락 추출
  extractContext(messages, response) {
    const userMessage = messages[messages.length - 1]?.content || '';
    const aiResponse = response?.choices?.[0]?.message?.content || '';
    
    return {
      userContext: this.extractUserContext(userMessage),
      conversationContext: this.extractConversationContext(messages),
      responseContext: this.extractResponseContext(aiResponse)
    };
  }

  // 사용자 맥락 추출
  extractUserContext(message) {
    return {
      intent: this.detectIntent(message),
      urgency: this.detectUrgency(message),
      complexity: this.detectComplexity(message)
    };
  }

  // 의도 감지
  detectIntent(message) {
    const intents = {
      question: ['?', '무엇', '어떻게', '왜', '언제', '어디'],
      statement: ['입니다', '입니다', '이에요', '이야'],
      request: ['도움주세요', '부탁', '원해', '하고 싶어'],
      complaint: ['불만', '문제', '어려움', '힘들어'],
      appreciation: ['감사', '고마워', '좋아', '만족']
    };
    
    for (const [intent, indicators] of Object.entries(intents)) {
      for (const indicator of indicators) {
        if (message.includes(indicator)) {
          return intent;
        }
      }
    }
    return 'general';
  }

  // 긴급성 감지
  detectUrgency(message) {
    const urgencyIndicators = {
      high: ['급해', '바로', '즉시', '당장', '긴급'],
      medium: ['빨리', '곧', '조만간'],
      low: ['천천히', '여유있게', '나중에']
    };
    
    for (const [level, indicators] of Object.entries(urgencyIndicators)) {
      for (const indicator of indicators) {
        if (message.includes(indicator)) {
          return level;
        }
      }
    }
    return 'low';
  }

  // 복잡성 감지
  detectComplexity(message) {
    const wordCount = message.split(' ').length;
    const hasComplexWords = /[가-힣]{4,}/.test(message);
    
    if (wordCount > 20 || hasComplexWords) return 'high';
    if (wordCount > 10) return 'medium';
    return 'low';
  }

  // 대화 맥락 추출
  extractConversationContext(messages) {
    return {
      length: messages.length,
      hasHistory: messages.length > 1,
      topicConsistency: this.checkTopicConsistency(messages)
    };
  }

  // 주제 일관성 확인
  checkTopicConsistency(messages) {
    if (messages.length < 2) return true;
    
    const topics = messages.map(m => this.extractTopics([m], null));
    const firstTopics = topics[0];
    
    return topics.slice(1).some(topics => 
      topics.some(topic => firstTopics.includes(topic))
    );
  }

  // 응답 맥락 추출
  extractResponseContext(response) {
    return {
      length: response?.length || 0,
      tone: this.detectResponseTone(response),
      helpfulness: this.detectHelpfulness(response)
    };
  }

  // 응답 톤 감지
  detectResponseTone(response) {
    if (!response) return 'neutral';
    
    const tones = {
      supportive: ['도움', '지원', '응원', '힘내', '괜찮아'],
      informative: ['정보', '설명', '알려드릴게', '찾아보니'],
      empathetic: ['이해해', '공감해', '같이', '함께'],
      directive: ['해야', '필요해', '권장해', '제안해']
    };
    
    for (const [tone, indicators] of Object.entries(tones)) {
      for (const indicator of indicators) {
        if (response.includes(indicator)) {
          return tone;
        }
      }
    }
    return 'neutral';
  }

  // 도움성 감지
  detectHelpfulness(response) {
    if (!response) return 'unknown';
    
    const helpfulIndicators = ['도움', '해결', '방법', '제안', '권장'];
    const unhelpfulIndicators = ['모르겠어', '어려워', '불가능', '안돼'];
    
    for (const indicator of helpfulIndicators) {
      if (response.includes(indicator)) {
        return 'helpful';
      }
    }
    
    for (const indicator of unhelpfulIndicators) {
      if (response.includes(indicator)) {
        return 'unhelpful';
      }
    }
    
    return 'neutral';
  }

  // 감정 분석
  analyzeSentiment(messages, response) {
    const allText = messages.map(m => m.content).join(' ') + ' ' + 
                   (response?.choices?.[0]?.message?.content || '');
    
    const positiveWords = ['좋아', '행복', '기쁨', '만족', '성공', '희망', '감사'];
    const negativeWords = ['나빠', '슬퍼', '화나', '실망', '걱정', '불안', '스트레스'];
    
    let positiveCount = 0;
    let negativeCount = 0;
    
    for (const word of positiveWords) {
      if (allText.includes(word)) positiveCount++;
    }
    
    for (const word of negativeWords) {
      if (allText.includes(word)) negativeCount++;
    }
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // 사실 추가
  async addFact(userId, fact, category = 'general') {
    const memory = await this.loadUserMemory(userId);
    
    const factEntry = {
      id: `fact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: fact,
      category: category,
      timestamp: new Date().toISOString(),
      confidence: 1.0,
      source: 'manual',
      relatedEvents: []
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
      timestamp: new Date().toISOString(),
      strength: 1.0
    };

    memory.preferences.push(prefEntry);
    await this.saveUserMemory(userId, memory);
    return prefEntry;
  }

  // 관계 정보 추가
  async addRelationship(userId, person, relationship, details = {}) {
    const memory = await this.loadUserMemory(userId);
    
    const relationshipEntry = {
      id: `rel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      person: person,
      relationship: relationship,
      details: details,
      timestamp: new Date().toISOString(),
      lastMentioned: new Date().toISOString()
    };

    memory.relationships.push(relationshipEntry);
    await this.saveUserMemory(userId, memory);
    return relationshipEntry;
  }

  // 목표 추가
  async addGoal(userId, goal, category = 'general', deadline = null) {
    const memory = await this.loadUserMemory(userId);
    
    const goalEntry = {
      id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      goal: goal,
      category: category,
      deadline: deadline,
      status: 'active',
      progress: 0,
      timestamp: new Date().toISOString()
    };

    memory.goals.push(goalEntry);
    await this.saveUserMemory(userId, memory);
    return goalEntry;
  }

  // 관심사 추가
  async addInterest(userId, interest, category = 'general') {
    const memory = await this.loadUserMemory(userId);
    
    const interestEntry = {
      id: `interest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      interest: interest,
      category: category,
      timestamp: new Date().toISOString(),
      intensity: 1.0
    };

    memory.interests.push(interestEntry);
    await this.saveUserMemory(userId, memory);
    return interestEntry;
  }

  // 장기 기억 추가
  async addLongTermMemory(userId, memory, category = 'general', importance = 'medium') {
    const userMemory = await this.loadUserMemory(userId);
    
    const longTermMemory = {
      id: `ltm_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: memory,
      category: category,
      importance: importance,
      timestamp: new Date().toISOString(),
      lastAccessed: new Date().toISOString(),
      accessCount: 1,
      emotionalImpact: 'neutral'
    };

    userMemory.memories.push(longTermMemory);
    await this.saveUserMemory(userId, userMemory);
    return longTermMemory;
  }

  // 지능형 컨텍스트 생성 (AI에게 전달할 기억)
  async generateIntelligentContext(userId, currentMessage, maxConversations = 5) {
    const memory = await this.loadUserMemory(userId);
    
    let context = [];
    
    // 배열이 undefined인 경우 초기화
    if (!memory.emotionalStates) memory.emotionalStates = [];
    if (!memory.lifeEvents) memory.lifeEvents = [];
    if (!memory.contextPatterns) memory.contextPatterns = [];
    if (!memory.conversations) memory.conversations = [];
    if (!memory.facts) memory.facts = [];
    if (!memory.preferences) memory.preferences = [];
    if (!memory.relationships) memory.relationships = [];
    if (!memory.goals) memory.goals = [];
    if (!memory.interests) memory.interests = [];
    
    // 현재 감정 상태 분석
    const currentEmotionalState = this.analyzeEmotionalState([{ content: currentMessage }], null);
    
    // 감정 상태 추적 정보
    const recentEmotions = memory.emotionalStates.slice(-10);
    const emotionalTrend = this.analyzeEmotionalTrend(recentEmotions);
    
    // 관련 인생 사건들
    const relevantLifeEvents = this.findRelevantLifeEvents(memory.lifeEvents, currentMessage);
    
    // 관련 맥락 패턴들
    const relevantPatterns = this.findRelevantPatterns(memory.contextPatterns, currentMessage);
    
    // 최근 대화들 (감정 상태 포함)
    const recentConversations = memory.conversations.slice(-maxConversations);
    for (const conv of recentConversations) {
      if (conv && conv.emotionalState && conv.summary) {
        context.push({
          role: 'system',
          content: `이전 대화 (${new Date(conv.timestamp).toLocaleString()}, 감정: ${conv.emotionalState.primary}): ${conv.summary}`
        });
      }
    }

    // 감정 상태 정보
    if (emotionalTrend) {
      context.push({
        role: 'system',
        content: `사용자의 최근 감정 상태: ${emotionalTrend.description}`
      });
    }

    // 관련 인생 사건들
    if (relevantLifeEvents.length > 0) {
      const eventsText = relevantLifeEvents.map(event => 
        `${event.type}: ${event.description}`
      ).join(', ');
      context.push({
        role: 'system',
        content: `관련 인생 사건들: ${eventsText}`
      });
    }

    // 중요한 사실들
    if (memory.facts.length > 0) {
      const facts = memory.facts.map(f => f.content).join(', ');
      context.push({
        role: 'system',
        content: `사용자에 대해 알고 있는 사실들: ${facts}`
      });
    }

    // 선호도
    if (memory.preferences.length > 0) {
      const prefs = memory.preferences.map(p => `${p.preference}: ${p.value}`).join(', ');
      context.push({
        role: 'system',
        content: `사용자 선호도: ${prefs}`
      });
    }

    // 관계 정보
    if (memory.relationships.length > 0) {
      const relationships = memory.relationships.map(r => 
        `${r.person}(${r.relationship})`
      ).join(', ');
      context.push({
        role: 'system',
        content: `중요한 관계들: ${relationships}`
      });
    }

    // 현재 목표들
    const activeGoals = memory.goals.filter(g => g.status === 'active');
    if (activeGoals.length > 0) {
      const goals = activeGoals.map(g => g.goal).join(', ');
      context.push({
        role: 'system',
        content: `현재 목표들: ${goals}`
      });
    }

    // 관심사
    if (memory.interests.length > 0) {
      const interests = memory.interests.map(i => i.interest).join(', ');
      context.push({
        role: 'system',
        content: `관심사: ${interests}`
      });
    }

    return context;
  }

  // 감정 트렌드 분석
  analyzeEmotionalTrend(emotions) {
    if (emotions.length < 3) return null;
    
    const recentEmotions = emotions.slice(-5);
    const primaryEmotions = recentEmotions.map(e => e.primary);
    
    const emotionCounts = {};
    primaryEmotions.forEach(emotion => {
      emotionCounts[emotion] = (emotionCounts[emotion] || 0) + 1;
    });
    
    // 빈 객체인 경우 처리
    if (Object.keys(emotionCounts).length === 0) return null;
    
    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );
    
    const trend = {
      dominant: dominantEmotion,
      frequency: emotionCounts[dominantEmotion],
      description: `최근 ${dominantEmotion}한 감정이 지속되고 있습니다.`
    };
    
    return trend;
  }

  // 관련 인생 사건 찾기
  findRelevantLifeEvents(events, currentMessage) {
    const relevantEvents = [];
    const messageWords = currentMessage.toLowerCase().split(' ');
    
    for (const event of events) {
      const eventWords = event.description.toLowerCase().split(' ');
      const commonWords = messageWords.filter(word => eventWords.includes(word));
      
      if (commonWords.length > 0) {
        relevantEvents.push(event);
      }
    }
    
    return relevantEvents.slice(-3); // 최근 3개만 반환
  }

  // 관련 맥락 패턴 찾기
  findRelevantPatterns(patterns, currentMessage) {
    const relevantPatterns = [];
    const currentTopics = this.extractTopics([{ content: currentMessage }], null);
    
    for (const pattern of patterns) {
      const commonTopics = currentTopics.filter(topic => pattern.topics.includes(topic));
      
      if (commonTopics.length > 0) {
        relevantPatterns.push(pattern);
      }
    }
    
    return relevantPatterns.slice(-3); // 최근 3개만 반환
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



  // 감정 상태 통계
  async getEmotionalStats(userId) {
    const memory = await this.loadUserMemory(userId);
    const emotions = memory.emotionalStates || [];
    
    const emotionCounts = {};
    emotions.forEach(emotion => {
      if (emotion && emotion.primary) {
        emotionCounts[emotion.primary] = (emotionCounts[emotion.primary] || 0) + 1;
      }
    });
    
    // 빈 객체인 경우 기본값 설정
    const dominantEmotion = Object.keys(emotionCounts).length > 0 
      ? Object.keys(emotionCounts).reduce((a, b) => 
          emotionCounts[a] > emotionCounts[b] ? a : b
        )
      : 'neutral';
    
    return {
      totalEmotions: emotions.length,
      emotionBreakdown: emotionCounts,
      recentEmotions: emotions.slice(-10),
      dominantEmotion: dominantEmotion
    };
  }

  // 인생 사건 타임라인
  async getLifeEventTimeline(userId) {
    const memory = await this.loadUserMemory(userId);
    const lifeEvents = memory.lifeEvents || [];
    return lifeEvents.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  // 맥락 패턴 분석
  async getContextPatterns(userId) {
    const memory = await this.loadUserMemory(userId);
    const contextPatterns = memory.contextPatterns || [];
    return contextPatterns.sort((a, b) => b.frequency - a.frequency);
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

  // ===== MNEMOSYNE FUNCTIONS =====

  // 문화적 기억 저장
  async addCulturalMemory(userId, culturalData) {
    const memory = await this.loadUserMemory(userId);
    if (!memory.mnemosyne) memory.mnemosyne = {};
    if (!memory.mnemosyne.culturalMemory) memory.mnemosyne.culturalMemory = [];
    
    const culturalMemory = {
      id: `cultural_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      type: culturalData.type, // 'mythology', 'education', 'religion', 'science', 'literature', 'digital'
      content: culturalData.content,
      context: culturalData.context,
      culturalElements: culturalData.culturalElements || [],
      significance: culturalData.significance,
      temporalContext: culturalData.temporalContext
    };
    
    memory.mnemosyne.culturalMemory.push(culturalMemory);
    await this.saveUserMemory(userId, memory);
    return culturalMemory;
  }

  // 시간적 맥락 저장
  async addTemporalContext(userId, temporalData) {
    const memory = await this.loadUserMemory(userId);
    if (!memory.mnemosyne) memory.mnemosyne = {};
    if (!memory.mnemosyne.temporalContext) memory.mnemosyne.temporalContext = [];
    
    const temporalContext = {
      id: `temporal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      era: temporalData.era, // 'ancient', 'medieval', 'renaissance', 'modern', 'digital'
      period: temporalData.period,
      culturalShifts: temporalData.culturalShifts || [],
      memoryEvolution: temporalData.memoryEvolution,
      technologicalImpact: temporalData.technologicalImpact
    };
    
    memory.mnemosyne.temporalContext.push(temporalContext);
    await this.saveUserMemory(userId, memory);
    return temporalContext;
  }

  // 정체성 패턴 저장
  async addIdentityPattern(userId, identityData) {
    const memory = await this.loadUserMemory(userId);
    if (!memory.mnemosyne) memory.mnemosyne = {};
    if (!memory.mnemosyne.identityPatterns) memory.mnemosyne.identityPatterns = [];
    
    const identityPattern = {
      id: `identity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      pattern: identityData.pattern,
      culturalInfluence: identityData.culturalInfluence,
      memoryIntegration: identityData.memoryIntegration,
      evolution: identityData.evolution
    };
    
    memory.mnemosyne.identityPatterns.push(identityPattern);
    await this.saveUserMemory(userId, memory);
    return identityPattern;
  }

  // 집단 기억 저장
  async addCollectiveMemory(userId, collectiveData) {
    const memory = await this.loadUserMemory(userId);
    if (!memory.mnemosyne) memory.mnemosyne = {};
    if (!memory.mnemosyne.collectiveMemory) memory.mnemosyne.collectiveMemory = [];
    
    const collectiveMemory = {
      id: `collective_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      community: collectiveData.community,
      sharedExperience: collectiveData.sharedExperience,
      culturalNarrative: collectiveData.culturalNarrative,
      transmissionMethod: collectiveData.transmissionMethod,
      significance: collectiveData.significance
    };
    
    memory.mnemosyne.collectiveMemory.push(collectiveMemory);
    await this.saveUserMemory(userId, memory);
    return collectiveMemory;
  }

  // Mnemosyne 메모리 통계
  async getMnemosyneStats(userId) {
    const memory = await this.loadUserMemory(userId);
    const mnemosyne = memory.mnemosyne || {};
    
    return {
      userId: userId,
      culturalMemory: (mnemosyne.culturalMemory || []).length,
      temporalContext: (mnemosyne.temporalContext || []).length,
      identityPatterns: (mnemosyne.identityPatterns || []).length,
      collectiveMemory: (mnemosyne.collectiveMemory || []).length,
      mythologicalReferences: (mnemosyne.mythologicalReferences || []).length,
      educationalContext: (mnemosyne.educationalContext || []).length,
      scientificContext: (mnemosyne.scientificContext || []).length,
      literaryContext: (mnemosyne.literaryContext || []).length,
      digitalEraContext: (mnemosyne.digitalEraContext || []).length
    };
  }

  // 문화적 기억 검색
  async searchCulturalMemory(userId, query) {
    const memory = await this.loadUserMemory(userId);
    const culturalMemory = memory.mnemosyne?.culturalMemory || [];
    
    return culturalMemory.filter(memory => 
      memory.content.toLowerCase().includes(query.toLowerCase()) ||
      memory.type.toLowerCase().includes(query.toLowerCase()) ||
      memory.context.toLowerCase().includes(query.toLowerCase())
    );
  }

  // 시간적 맥락 검색
  async searchTemporalContext(userId, era) {
    const memory = await this.loadUserMemory(userId);
    const temporalContext = memory.mnemosyne?.temporalContext || [];
    
    return temporalContext.filter(context => 
      context.era.toLowerCase() === era.toLowerCase() ||
      context.period.toLowerCase().includes(era.toLowerCase())
    );
  }

  // 정체성 패턴 분석
  async analyzeIdentityPatterns(userId) {
    const memory = await this.loadUserMemory(userId);
    const identityPatterns = memory.mnemosyne?.identityPatterns || [];
    
    const patternAnalysis = {
      totalPatterns: identityPatterns.length,
      culturalInfluences: {},
      evolutionTrends: [],
      memoryIntegration: {}
    };
    
    identityPatterns.forEach(pattern => {
      // 문화적 영향 분석
      if (pattern.culturalInfluence) {
        patternAnalysis.culturalInfluences[pattern.culturalInfluence] = 
          (patternAnalysis.culturalInfluences[pattern.culturalInfluence] || 0) + 1;
      }
      
      // 기억 통합 패턴 분석
      if (pattern.memoryIntegration) {
        patternAnalysis.memoryIntegration[pattern.memoryIntegration] = 
          (patternAnalysis.memoryIntegration[pattern.memoryIntegration] || 0) + 1;
      }
    });
    
    return patternAnalysis;
  }

  // ===== MEMORY RETRIEVAL & MANAGEMENT FUNCTIONS =====
  
  // 메모리 검색 (get_memory)
  async getMemory(userId, memoryId, type = 'all') {
    const memory = await this.loadUserMemory(userId);
    
    if (type === 'all') {
      return memory;
    }
    
    if (type === 'mnemosyne') {
      return memory.mnemosyne || {};
    }
    
    if (memory.mnemosyne && memory.mnemosyne[type]) {
      return memory.mnemosyne[type];
    }
    
    return null;
  }

  // 메모리 쿼리 (query_memory)
  async queryMemory(userId, query, filters = {}) {
    const memory = await this.loadUserMemory(userId);
    const results = [];
    
    // 검색 범위 설정
    const searchTypes = filters.types || ['conversations', 'facts', 'preferences', 'lifeEvents', 'emotionalStates'];
    const timeRange = filters.timeRange || { start: null, end: null };
    const keywords = filters.keywords || [];
    
    // 각 타입별로 검색
    searchTypes.forEach(type => {
      if (memory[type] && Array.isArray(memory[type])) {
        memory[type].forEach(item => {
          let match = false;
          
          // 키워드 검색
          if (keywords.length > 0) {
            const content = JSON.stringify(item).toLowerCase();
            match = keywords.some(keyword => content.includes(keyword.toLowerCase()));
          } else {
            // 일반 텍스트 검색
            const content = JSON.stringify(item).toLowerCase();
            match = content.includes(query.toLowerCase());
          }
          
          // 시간 범위 필터
          if (match && timeRange.start) {
            const itemTime = new Date(item.timestamp || item.createdAt || item.date);
            const startTime = new Date(timeRange.start);
            if (itemTime < startTime) match = false;
          }
          
          if (match && timeRange.end) {
            const itemTime = new Date(item.timestamp || item.createdAt || item.date);
            const endTime = new Date(timeRange.end);
            if (itemTime > endTime) match = false;
          }
          
          if (match) {
            results.push({
              type: type,
              item: item,
              relevance: this.calculateRelevance(item, query, keywords)
            });
          }
        });
      }
    });
    
    // 관련성 순으로 정렬
    results.sort((a, b) => b.relevance - a.relevance);
    
    return results;
  }

  // 관련성 점수 계산
  calculateRelevance(item, query, keywords) {
    let score = 0;
    const content = JSON.stringify(item).toLowerCase();
    const queryLower = query.toLowerCase();
    
    // 정확한 매치
    if (content.includes(queryLower)) score += 10;
    
    // 키워드 매치
    keywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) score += 5;
    });
    
    // 최신성 점수
    if (item.timestamp || item.createdAt) {
      const age = Date.now() - new Date(item.timestamp || item.createdAt).getTime();
      const daysOld = age / (1000 * 60 * 60 * 24);
      if (daysOld < 1) score += 3;
      else if (daysOld < 7) score += 2;
      else if (daysOld < 30) score += 1;
    }
    
    return score;
  }

  // 메모리 업데이트
  async updateMemory(userId, memoryId, updates, type = 'mnemosyne') {
    const memory = await this.loadUserMemory(userId);
    
    if (type === 'mnemosyne') {
      // Mnemosyne 메모리 업데이트
      const mnemosyneTypes = ['culturalMemory', 'temporalContext', 'identityPatterns', 'collectiveMemory'];
      
      for (const memType of mnemosyneTypes) {
        if (memory.mnemosyne && memory.mnemosyne[memType]) {
          const index = memory.mnemosyne[memType].findIndex(item => item.id === memoryId);
          if (index !== -1) {
            memory.mnemosyne[memType][index] = {
              ...memory.mnemosyne[memType][index],
              ...updates,
              lastUpdated: new Date().toISOString()
            };
            await this.saveUserMemory(userId, memory);
            return memory.mnemosyne[memType][index];
          }
        }
      }
    } else {
      // 일반 메모리 업데이트
      if (memory[type] && Array.isArray(memory[type])) {
        const index = memory[type].findIndex(item => item.id === memoryId);
        if (index !== -1) {
          memory[type][index] = {
            ...memory[type][index],
            ...updates,
            lastUpdated: new Date().toISOString()
          };
          await this.saveUserMemory(userId, memory);
          return memory[type][index];
        }
      }
    }
    
    throw new Error(`Memory not found: ${memoryId}`);
  }

  // 메모리 삭제
  async deleteMemory(userId, memoryId, type = 'mnemosyne') {
    const memory = await this.loadUserMemory(userId);
    
    if (type === 'mnemosyne') {
      // Mnemosyne 메모리 삭제
      const mnemosyneTypes = ['culturalMemory', 'temporalContext', 'identityPatterns', 'collectiveMemory'];
      
      for (const memType of mnemosyneTypes) {
        if (memory.mnemosyne && memory.mnemosyne[memType]) {
          const index = memory.mnemosyne[memType].findIndex(item => item.id === memoryId);
          if (index !== -1) {
            const deletedItem = memory.mnemosyne[memType].splice(index, 1)[0];
            await this.saveUserMemory(userId, memory);
            return deletedItem;
          }
        }
      }
    } else {
      // 일반 메모리 삭제
      if (memory[type] && Array.isArray(memory[type])) {
        const index = memory[type].findIndex(item => item.id === memoryId);
        if (index !== -1) {
          const deletedItem = memory[type].splice(index, 1)[0];
          await this.saveUserMemory(userId, memory);
          return deletedItem;
        }
      }
    }
    
    throw new Error(`Memory not found: ${memoryId}`);
  }

  // 메모리 백업
  async backupMemory(userId) {
    const memory = await this.loadUserMemory(userId);
    const backupPath = path.join(this.memoryDir, `${userId}_backup_${Date.now()}.json`);
    
    const backup = {
      userId: userId,
      timestamp: new Date().toISOString(),
      data: memory
    };
    
    await fs.writeFile(backupPath, JSON.stringify(backup, null, 2), 'utf8');
    return backupPath;
  }

  // 메모리 복원
  async restoreMemory(userId, backupPath) {
    try {
      const backupData = await fs.readFile(backupPath, 'utf8');
      const backup = JSON.parse(backupData);
      
      if (backup.userId === userId) {
        await this.saveUserMemory(userId, backup.data);
        return true;
      } else {
        throw new Error('Backup user ID mismatch');
      }
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  // 메모리 통계
  async getMemoryStats(userId) {
    const memory = await this.loadUserMemory(userId);
    
    const stats = {
      userId: userId,
      totalConversations: (memory.conversations || []).length,
      totalFacts: (memory.facts || []).length,
      totalPreferences: (memory.preferences || []).length,
      totalLifeEvents: (memory.lifeEvents || []).length,
      totalEmotionalStates: (memory.emotionalStates || []).length,
      totalRelationships: (memory.relationships || []).length,
      totalGoals: (memory.goals || []).length,
      totalInterests: (memory.interests || []).length,
      totalMemories: (memory.memories || []).length,
      totalContextPatterns: (memory.contextPatterns || []).length,
      mnemosyne: await this.getMnemosyneStats(userId),
      lastUpdated: memory.lastUpdated,
      createdAt: memory.createdAt
    };
    
    return stats;
  }
}

module.exports = MemoryManager; 