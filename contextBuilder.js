/**
 * Context Builder - 세계 최고 수준의 메모리 기반 대화 시스템
 * 
 * 사용자와의 대화 맥락을 잊지 않고, 시간·중요도·감정·빈도를 종합적으로 반영하여
 * 가장 관련성 높은 기억을 검색·요약·활용하는 시스템
 */

const { calcScore, selectTopMemories, getScoringStats } = require('./calcScore');
const MemoryManager = require('./memory');
const vectorDB = require('./vectorDB');
const monitoring = require('./monitoring');

class ContextBuilder {
  constructor() {
    this.memoryManager = new MemoryManager();
    this.workingMemorySize = 10; // 최근 대화 메모리 크기
    this.candidateMemorySize = 50; // 후보 메모리 크기
    this.selectedMemorySize = 5; // 선택할 메모리 크기
  }

  /**
   * 컨텍스트 빌드 - 메인 함수
   * @param {string} userId - 사용자 ID
   * @param {string} query - 사용자 쿼리
   * @param {Array} queryEmbedding - 쿼리 임베딩
   * @param {Object} options - 옵션 설정
   * @returns {Object} 빌드된 컨텍스트
   */
  async buildContext(userId, query, queryEmbedding, options = {}) {
    const startTime = Date.now();
    
    try {
      console.log(`🧠 컨텍스트 빌드 시작: ${userId}`);
      
      // 1. 최근 대화(working memory) 가져오기
      const workingMemory = await this.getWorkingMemory(userId);
      
      // 2. Vector DB에서 후보 메모리 검색
      const candidateMemories = await this.searchCandidateMemories(userId, queryEmbedding);
      
      // 3. 스코어링 및 정렬
      const scoredMemories = selectTopMemories(
        queryEmbedding, 
        candidateMemories, 
        this.selectedMemorySize,
        options.weights
      );
      
      // 4. 메모리 요약(Condensation) 수행
      const condensedMemories = await this.condenseMemories(scoredMemories, query);
      
      // 5. 최종 프롬프트 생성
      const finalPrompt = await this.buildFinalPrompt(
        workingMemory,
        condensedMemories,
        query,
        options
      );
      
      const processingTime = Date.now() - startTime;
      
      // 모니터링 기록
      monitoring.recordContextBuild(processingTime, true, scoredMemories.length);
      
      const result = {
        prompt: finalPrompt,
        usedMemoryIds: scoredMemories.map(m => m.memory.id),
        debug: {
          processingTime,
          workingMemoryCount: workingMemory.length,
          candidateMemoryCount: candidateMemories.length,
          selectedMemoryCount: scoredMemories.length,
          scoringStats: getScoringStats(candidateMemories, queryEmbedding, options.weights),
          condensedMemories: condensedMemories
        }
      };
      
      console.log(`✅ 컨텍스트 빌드 완료: ${processingTime}ms, ${scoredMemories.length}개 메모리 사용`);
      
      return result;
      
    } catch (error) {
      const processingTime = Date.now() - startTime;
      monitoring.recordContextBuild(processingTime, false, 0);
      monitoring.recordError('context_build_error', error.message, { userId, query: query.substring(0, 100) });
      
      console.error('❌ 컨텍스트 빌드 오류:', error);
      throw error;
    }
  }

  /**
   * 최근 대화(working memory) 가져오기
   */
  async getWorkingMemory(userId) {
    try {
      const userMemory = await this.memoryManager.loadUserMemory(userId);
      
      // 최근 대화만 가져오기
      const recentConversations = userMemory.conversations
        .slice(-this.workingMemorySize)
        .map(conv => ({
          role: conv.role || 'user',
          content: conv.content,
          timestamp: conv.timestamp
        }));
      
      return recentConversations;
    } catch (error) {
      console.error('Working memory 가져오기 오류:', error);
      return [];
    }
  }

  /**
   * Vector DB에서 후보 메모리 검색
   */
  async searchCandidateMemories(userId, queryEmbedding) {
    try {
      // Vector DB에서 유사한 벡터 검색
      const vectorResults = await vectorDB.searchVectors(
        queryEmbedding, 
        this.candidateMemorySize,
        { userId: userId }
      );
      
      if (vectorResults.length === 0) {
        console.log('🔍 Vector DB에서 후보 메모리를 찾지 못함, 기본 메모리 사용');
        return await this.getFallbackMemories(userId);
      }
      
      // Vector DB 결과를 메모리 객체로 변환
      const userMemory = await this.memoryManager.loadUserMemory(userId);
      const candidates = [];
      
      for (const vectorResult of vectorResults) {
        const memory = userMemory.memories.find(m => m.id === vectorResult.memoryId);
        if (memory && memory.consentFlags?.canUseInContext !== false) {
          // Vector DB에서 가져온 임베딩으로 업데이트
          memory.embedding = vectorResult.embedding;
          memory.vectorSimilarity = vectorResult.similarity;
          candidates.push(memory);
        }
      }
      
      console.log(`🔍 Vector DB에서 ${candidates.length}개 후보 메모리 검색됨`);
      
      return candidates;
    } catch (error) {
      console.error('Vector DB 검색 오류:', error);
      return await this.getFallbackMemories(userId);
    }
  }

  /**
   * Vector DB 검색 실패 시 사용할 기본 메모리
   */
  async getFallbackMemories(userId) {
    try {
      const userMemory = await this.memoryManager.loadUserMemory(userId);
      
      // memories 배열이 없으면 빈 배열 반환
      if (!userMemory.memories || !Array.isArray(userMemory.memories)) {
        console.log('🔍 메모리 배열이 없음, 빈 배열 반환');
        return [];
      }
      
      // 임베딩이 있는 메모리만 필터링
      const memoriesWithEmbeddings = userMemory.memories.filter(memory => 
        memory.embedding && 
        memory.consentFlags?.canUseInContext !== false
      );
      
      // 최근 메모리 우선 선택
      const candidates = memoriesWithEmbeddings
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, this.candidateMemorySize);
      
      console.log(`🔍 기본 메모리에서 ${candidates.length}개 후보 선택됨`);
      
      return candidates;
    } catch (error) {
      console.error('기본 메모리 검색 오류:', error);
      return [];
    }
  }

  /**
   * 메모리 요약(Condensation)
   */
  async condenseMemories(scoredMemories, query) {
    if (scoredMemories.length === 0) {
      return {
        tldr: "관련된 기억이 없습니다.",
        condensed: [],
        facts: [],
        provenance: []
      };
    }

    try {
      // 간단한 요약 로직 (실제로는 LLM 사용)
      const condensed = scoredMemories.map(({ memory, scoreResult }) => ({
        id: memory.id,
        type: memory.type,
        content: this.truncateContent(memory.content, 100),
        score: scoreResult.score,
        timestamp: memory.timestamp,
        salience: memory.salienceScore,
        emotion: memory.emotionScore
      }));

      const tldr = this.generateTLDR(condensed, query);
      const facts = this.extractFacts(condensed);
      const provenance = condensed.map(m => ({
        id: m.id,
        type: m.type,
        score: m.score
      }));

      return {
        tldr,
        condensed,
        facts,
        provenance
      };
    } catch (error) {
      console.error('메모리 요약 오류:', error);
      return {
        tldr: "메모리 요약 중 오류가 발생했습니다.",
        condensed: [],
        facts: [],
        provenance: []
      };
    }
  }

  /**
   * 최종 프롬프트 생성
   */
  async buildFinalPrompt(workingMemory, condensedMemories, query, options = {}) {
    const systemPrompt = this.buildSystemPrompt(condensedMemories, options);
    const contextPrompt = this.buildContextPrompt(workingMemory, condensedMemories);
    const userPrompt = this.buildUserPrompt(query, condensedMemories);

    return {
      system: systemPrompt,
      context: contextPrompt,
      user: userPrompt,
      fullPrompt: `${systemPrompt}\n\n${contextPrompt}\n\n${userPrompt}`
    };
  }

  /**
   * 시스템 프롬프트 생성
   */
  buildSystemPrompt(condensedMemories, options = {}) {
    const basePrompt = `당신은 Kairos입니다. 사용자의 기억을 바탕으로 맥락에 맞는 대화를 제공하는 AI 동반자입니다.

===== 기억 기반 대화 지침 =====
1. 사용자의 과거 기억을 존중하고 활용하세요
2. 맥락에 맞는 관련 정보를 제공하세요
3. 개인정보는 보호하면서 유용한 정보를 공유하세요
4. 감정적 맥락을 고려한 응답을 하세요`;

    if (condensedMemories.tldr && condensedMemories.tldr !== "관련된 기억이 없습니다.") {
      return `${basePrompt}

===== 사용자 기억 요약 =====
${condensedMemories.tldr}

이 정보를 바탕으로 사용자와 자연스럽고 맥락에 맞는 대화를 진행하세요.`;
    }

    return basePrompt;
  }

  /**
   * 컨텍스트 프롬프트 생성
   */
  buildContextPrompt(workingMemory, condensedMemories) {
    let contextPrompt = "===== 대화 맥락 =====\n";
    
    if (workingMemory.length > 0) {
      contextPrompt += "최근 대화:\n";
      workingMemory.slice(-3).forEach(conv => {
        contextPrompt += `- ${conv.role}: ${this.truncateContent(conv.content, 50)}\n`;
      });
    }

    if (condensedMemories.facts.length > 0) {
      contextPrompt += "\n관련 사실들:\n";
      condensedMemories.facts.forEach(fact => {
        contextPrompt += `- ${fact}\n`;
      });
    }

    return contextPrompt;
  }

  /**
   * 사용자 프롬프트 생성
   */
  buildUserPrompt(query, condensedMemories) {
    let userPrompt = `사용자: ${query}`;
    
    if (condensedMemories.provenance.length > 0) {
      userPrompt += `\n\n[참고: 이 답변은 ${condensedMemories.provenance.length}개의 관련 기억을 바탕으로 작성되었습니다]`;
    }

    return userPrompt;
  }

  /**
   * TLDR 생성 (간단한 요약)
   */
  generateTLDR(condensed, query) {
    if (condensed.length === 0) return "관련된 기억이 없습니다.";
    
    const highScoreMemories = condensed.filter(m => m.score > 0.7);
    const recentMemories = condensed.filter(m => {
      const daysSince = (Date.now() - new Date(m.timestamp)) / (1000 * 60 * 60 * 24);
      return daysSince < 30;
    });

    let tldr = "사용자에 대한 주요 기억들:\n";
    
    if (highScoreMemories.length > 0) {
      tldr += `- 높은 관련성: ${highScoreMemories.length}개 기억\n`;
    }
    
    if (recentMemories.length > 0) {
      tldr += `- 최근 활동: ${recentMemories.length}개 기억\n`;
    }

    return tldr;
  }

  /**
   * 사실 추출
   */
  extractFacts(condensed) {
    return condensed
      .filter(m => m.type === 'fact' && m.score > 0.5)
      .map(m => m.content)
      .slice(0, 5);
  }

  /**
   * 내용 자르기
   */
  truncateContent(content, maxLength) {
    if (!content) return "";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  }

  /**
   * 메모리 접근 업데이트
   */
  async updateMemoryAccess(userId, memoryIds) {
    try {
      const userMemory = await this.memoryManager.loadUserMemory(userId);
      
      memoryIds.forEach(memoryId => {
        const memory = userMemory.memories.find(m => m.id === memoryId);
        if (memory) {
          memory.accessCount = (memory.accessCount || 0) + 1;
          memory.lastAccessed = new Date().toISOString();
        }
      });
      
      await this.memoryManager.saveUserMemory(userId, userMemory);
    } catch (error) {
      console.error('메모리 접근 업데이트 오류:', error);
    }
  }
}

module.exports = ContextBuilder;
