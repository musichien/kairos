/**
 * 메모리 스코어링 함수 - 세계 최고 수준의 메모리 기반 대화 시스템
 * 
 * 시간·중요도·감정·빈도를 종합적으로 반영하여 가장 관련성 높은 기억을 검색
 * 
 * @param {Array} queryEmbedding - 쿼리의 벡터 임베딩
 * @param {Object} memory - 메모리 객체
 * @param {Object} weights - 가중치 설정 (기본값: α=0.6, β=0.2, γ=0.15, δ=0.05)
 * @returns {Object} 스코어링 결과
 */

const cosineSimilarity = require('./utils/cosineSimilarity');

/**
 * 메모리 스코어 계산 함수
 * @param {Array} queryEmbedding - 쿼리 임베딩 벡터
 * @param {Object} memory - 메모리 객체
 * @param {Object} weights - 가중치 설정
 * @returns {Object} 스코어링 결과
 */
function calcScore(queryEmbedding, memory, weights = {}) {
  // 기본 가중치 설정
  const defaultWeights = {
    alpha: 0.6,    // α: semantic similarity (의미적 유사도)
    beta: 0.2,     // β: time decay (시간 감쇠)
    gamma: 0.15,   // γ: salience score (중요도)
    delta: 0.05    // δ: emotion score (감정 강도)
  };
  
  const w = { ...defaultWeights, ...weights };
  
  // 1. Semantic Similarity (의미적 유사도) - 코사인 유사도
  const semSim = calculateSemanticSimilarity(queryEmbedding, memory.embedding);
  const semSimNorm = Math.max(0, semSim); // 0-1 범위로 정규화
  
  // 2. Time Decay (시간 감쇠) - 최근성 지수 가중치
  const tDecay = calculateTimeDecay(memory.timestamp, memory.lastAccessed);
  
  // 3. Salience Score (중요도) - 0-1 범위
  const salience = Math.max(0, Math.min(1, memory.salienceScore || 0.5));
  
  // 4. Emotion Score (감정 강도) - -1 to 1 범위를 0-1로 정규화
  const emotion = (memory.emotionScore || 0) + 1; // -1~1 → 0~2
  const emo = emotion / 2; // 0~2 → 0~1
  
  // 5. Access Frequency (접근 빈도) - 추가 가중치
  const accessFreq = calculateAccessFrequency(memory.accessCount, memory.timestamp);
  
  // 6. 최종 스코어 계산
  const finalScore = (
    w.alpha * semSimNorm +
    w.beta * tDecay +
    w.gamma * salience +
    w.delta * emo +
    0.1 * accessFreq // 접근 빈도 추가 가중치
  );
  
  return {
    score: Math.max(0, Math.min(1, finalScore)), // 0-1 범위로 클램핑
    semSimNorm,
    tDecay,
    salience,
    emo,
    accessFreq,
    breakdown: {
      semantic: w.alpha * semSimNorm,
      timeDecay: w.beta * tDecay,
      salience: w.gamma * salience,
      emotion: w.delta * emo,
      accessFreq: 0.1 * accessFreq
    },
    weights: w
  };
}

/**
 * 의미적 유사도 계산 (코사인 유사도)
 */
function calculateSemanticSimilarity(queryEmbedding, memoryEmbedding) {
  if (!queryEmbedding || !memoryEmbedding) {
    return 0; // 임베딩이 없으면 0 반환
  }
  
  if (queryEmbedding.length !== memoryEmbedding.length) {
    console.warn('임베딩 차원이 일치하지 않음:', queryEmbedding.length, memoryEmbedding.length);
    return 0;
  }
  
  return cosineSimilarity(queryEmbedding, memoryEmbedding);
}

/**
 * 시간 감쇠 계산 (최근성 지수 가중치)
 */
function calculateTimeDecay(timestamp, lastAccessed) {
  const now = new Date();
  const memoryTime = new Date(timestamp);
  const lastAccessTime = new Date(lastAccessed || timestamp);
  
  // 메모리 생성 시간으로부터의 경과 시간 (일 단위)
  const daysSinceCreation = (now - memoryTime) / (1000 * 60 * 60 * 24);
  
  // 마지막 접근 시간으로부터의 경과 시간 (일 단위)
  const daysSinceLastAccess = (now - lastAccessTime) / (1000 * 60 * 60 * 24);
  
  // 지수 감쇠 함수: e^(-λt)
  const lambda = 0.1; // 감쇠 상수 (조정 가능)
  const creationDecay = Math.exp(-lambda * daysSinceCreation);
  const accessDecay = Math.exp(-lambda * daysSinceLastAccess);
  
  // 생성 시간과 접근 시간의 가중 평균
  return 0.7 * creationDecay + 0.3 * accessDecay;
}

/**
 * 접근 빈도 계산
 */
function calculateAccessFrequency(accessCount, timestamp) {
  const now = new Date();
  const memoryTime = new Date(timestamp);
  const daysSinceCreation = Math.max(1, (now - memoryTime) / (1000 * 60 * 60 * 24));
  
  // 일일 평균 접근 횟수
  const dailyAccessRate = (accessCount || 0) / daysSinceCreation;
  
  // 로그 스케일로 정규화 (0-1 범위)
  return Math.min(1, Math.log(1 + dailyAccessRate) / Math.log(10));
}

/**
 * 메모리 배열을 스코어 기준으로 정렬
 */
function sortMemoriesByScore(queryEmbedding, memories, weights = {}) {
  return memories
    .map(memory => ({
      memory,
      scoreResult: calcScore(queryEmbedding, memory, weights)
    }))
    .sort((a, b) => b.scoreResult.score - a.scoreResult.score);
}

/**
 * 상위 K개 메모리 선택
 */
function selectTopMemories(queryEmbedding, memories, k = 5, weights = {}) {
  const sortedMemories = sortMemoriesByScore(queryEmbedding, memories, weights);
  return sortedMemories.slice(0, k);
}

/**
 * 메모리 스코어링 통계
 */
function getScoringStats(memories, queryEmbedding, weights = {}) {
  const scoredMemories = memories.map(memory => ({
    id: memory.id,
    type: memory.type,
    scoreResult: calcScore(queryEmbedding, memory, weights)
  }));
  
  const scores = scoredMemories.map(m => m.scoreResult.score);
  
  return {
    totalMemories: memories.length,
    averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
    maxScore: Math.max(...scores),
    minScore: Math.min(...scores),
    scoreDistribution: {
      high: scores.filter(s => s > 0.7).length,
      medium: scores.filter(s => s > 0.3 && s <= 0.7).length,
      low: scores.filter(s => s <= 0.3).length
    },
    topMemories: scoredMemories
      .sort((a, b) => b.scoreResult.score - a.scoreResult.score)
      .slice(0, 5)
  };
}

module.exports = {
  calcScore,
  calculateSemanticSimilarity,
  calculateTimeDecay,
  calculateAccessFrequency,
  sortMemoriesByScore,
  selectTopMemories,
  getScoringStats
};

