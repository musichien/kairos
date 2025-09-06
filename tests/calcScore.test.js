/**
 * calcScore.js 테스트 - 메모리 스코어링 함수 검증
 */

const { 
  calcScore, 
  calculateSemanticSimilarity, 
  calculateTimeDecay, 
  calculateAccessFrequency,
  sortMemoriesByScore,
  selectTopMemories,
  getScoringStats
} = require('../calcScore');

describe('calcScore - 메모리 스코어링 함수', () => {
  
  // 테스트용 메모리 객체
  const testMemory = {
    id: 'test_memory_1',
    content: '사용자가 JavaScript를 배우고 있다',
    embedding: [0.1, 0.2, 0.3, 0.4, 0.5],
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
    lastAccessed: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12시간 전
    salienceScore: 0.8,
    emotionScore: 0.3,
    accessCount: 5
  };

  const testQueryEmbedding = [0.1, 0.2, 0.3, 0.4, 0.5]; // 동일한 임베딩

  describe('calcScore 기본 기능', () => {
    test('정상적인 메모리에 대해 스코어를 계산해야 함', () => {
      const result = calcScore(testQueryEmbedding, testMemory);
      
      expect(result).toHaveProperty('score');
      expect(result).toHaveProperty('semSimNorm');
      expect(result).toHaveProperty('tDecay');
      expect(result).toHaveProperty('salience');
      expect(result).toHaveProperty('emo');
      expect(result).toHaveProperty('breakdown');
      expect(result).toHaveProperty('weights');
      
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    test('스코어는 0-1 범위 내에 있어야 함', () => {
      const result = calcScore(testQueryEmbedding, testMemory);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(1);
    });

    test('커스텀 가중치를 적용해야 함', () => {
      const customWeights = { alpha: 0.8, beta: 0.1, gamma: 0.05, delta: 0.05 };
      const result = calcScore(testQueryEmbedding, testMemory, customWeights);
      
      expect(result.weights).toEqual(customWeights);
    });
  });

  describe('calculateSemanticSimilarity', () => {
    test('동일한 임베딩에 대해 높은 유사도를 반환해야 함', () => {
      const similarity = calculateSemanticSimilarity(testQueryEmbedding, testQueryEmbedding);
      expect(similarity).toBeCloseTo(1, 5);
    });

    test('반대 임베딩에 대해 낮은 유사도를 반환해야 함', () => {
      const oppositeEmbedding = testQueryEmbedding.map(x => -x);
      const similarity = calculateSemanticSimilarity(testQueryEmbedding, oppositeEmbedding);
      expect(similarity).toBeCloseTo(-1, 5);
    });

    test('임베딩이 없으면 0을 반환해야 함', () => {
      const similarity = calculateSemanticSimilarity(testQueryEmbedding, null);
      expect(similarity).toBe(0);
    });

    test('차원이 다르면 0을 반환해야 함', () => {
      const differentDimEmbedding = [0.1, 0.2];
      const similarity = calculateSemanticSimilarity(testQueryEmbedding, differentDimEmbedding);
      expect(similarity).toBe(0);
    });
  });

  describe('calculateTimeDecay', () => {
    test('최근 메모리에 대해 높은 시간 가중치를 반환해야 함', () => {
      const recentMemory = {
        ...testMemory,
        timestamp: new Date().toISOString(),
        lastAccessed: new Date().toISOString()
      };
      
      const decay = calculateTimeDecay(recentMemory.timestamp, recentMemory.lastAccessed);
      expect(decay).toBeGreaterThan(0.8);
    });

    test('오래된 메모리에 대해 낮은 시간 가중치를 반환해야 함', () => {
      const oldMemory = {
        ...testMemory,
        timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 1년 전
        lastAccessed: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
      };
      
      const decay = calculateTimeDecay(oldMemory.timestamp, oldMemory.lastAccessed);
      expect(decay).toBeLessThan(0.5);
    });
  });

  describe('calculateAccessFrequency', () => {
    test('높은 접근 빈도에 대해 높은 점수를 반환해야 함', () => {
      const frequentMemory = {
        ...testMemory,
        accessCount: 100,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1주일 전
      };
      
      const frequency = calculateAccessFrequency(frequentMemory.accessCount, frequentMemory.timestamp);
      expect(frequency).toBeGreaterThan(0.5);
    });

    test('낮은 접근 빈도에 대해 낮은 점수를 반환해야 함', () => {
      const infrequentMemory = {
        ...testMemory,
        accessCount: 1,
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 1주일 전
      };
      
      const frequency = calculateAccessFrequency(infrequentMemory.accessCount, infrequentMemory.timestamp);
      expect(frequency).toBeLessThan(0.3);
    });
  });

  describe('sortMemoriesByScore', () => {
    test('메모리를 스코어 기준으로 정렬해야 함', () => {
      const memories = [
        { ...testMemory, id: 'low', salienceScore: 0.2 },
        { ...testMemory, id: 'high', salienceScore: 0.9 },
        { ...testMemory, id: 'medium', salienceScore: 0.5 }
      ];
      
      const sorted = sortMemoriesByScore(testQueryEmbedding, memories);
      
      expect(sorted[0].memory.id).toBe('high');
      expect(sorted[1].memory.id).toBe('medium');
      expect(sorted[2].memory.id).toBe('low');
    });
  });

  describe('selectTopMemories', () => {
    test('상위 K개 메모리를 선택해야 함', () => {
      const memories = Array.from({ length: 10 }, (_, i) => ({
        ...testMemory,
        id: `memory_${i}`,
        salienceScore: i / 10
      }));
      
      const topMemories = selectTopMemories(testQueryEmbedding, memories, 3);
      
      expect(topMemories).toHaveLength(3);
      expect(topMemories[0].memory.salienceScore).toBeGreaterThan(topMemories[1].memory.salienceScore);
      expect(topMemories[1].memory.salienceScore).toBeGreaterThan(topMemories[2].memory.salienceScore);
    });
  });

  describe('getScoringStats', () => {
    test('스코어링 통계를 올바르게 계산해야 함', () => {
      const memories = [
        { ...testMemory, id: 'high', salienceScore: 0.9 },
        { ...testMemory, id: 'medium', salienceScore: 0.5 },
        { ...testMemory, id: 'low', salienceScore: 0.1 }
      ];
      
      const stats = getScoringStats(memories, testQueryEmbedding);
      
      expect(stats).toHaveProperty('totalMemories');
      expect(stats).toHaveProperty('averageScore');
      expect(stats).toHaveProperty('maxScore');
      expect(stats).toHaveProperty('minScore');
      expect(stats).toHaveProperty('scoreDistribution');
      expect(stats).toHaveProperty('topMemories');
      
      expect(stats.totalMemories).toBe(3);
      expect(stats.topMemories).toHaveLength(5);
    });
  });

  describe('최근성과 유사도 우선순위 검증', () => {
    test('최근성과 유사도가 높은 메모리가 우선순위를 가져야 함', () => {
      const recentHighSimilarity = {
        ...testMemory,
        id: 'recent_high',
        embedding: testQueryEmbedding, // 높은 유사도
        timestamp: new Date().toISOString(), // 최근
        salienceScore: 0.9
      };
      
      const oldLowSimilarity = {
        ...testMemory,
        id: 'old_low',
        embedding: testQueryEmbedding.map(x => -x), // 낮은 유사도
        timestamp: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(), // 오래됨
        salienceScore: 0.1
      };
      
      const memories = [oldLowSimilarity, recentHighSimilarity];
      const sorted = sortMemoriesByScore(testQueryEmbedding, memories);
      
      expect(sorted[0].memory.id).toBe('recent_high');
      expect(sorted[1].memory.id).toBe('old_low');
    });
  });

  describe('엣지 케이스', () => {
    test('빈 메모리 배열 처리', () => {
      const sorted = sortMemoriesByScore(testQueryEmbedding, []);
      expect(sorted).toHaveLength(0);
    });

    test('임베딩이 없는 메모리 처리', () => {
      const memoryWithoutEmbedding = { ...testMemory, embedding: null };
      const result = calcScore(testQueryEmbedding, memoryWithoutEmbedding);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });

    test('잘못된 가중치 처리', () => {
      const invalidWeights = { alpha: -1, beta: 2, gamma: 0, delta: 0 };
      const result = calcScore(testQueryEmbedding, testMemory, invalidWeights);
      expect(result.score).toBeGreaterThanOrEqual(0);
    });
  });
});

