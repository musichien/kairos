/**
 * 코사인 유사도 계산 유틸리티
 * 
 * 두 벡터 간의 코사인 유사도를 계산합니다.
 * 범위: -1 (완전 반대) ~ 1 (완전 동일)
 */

/**
 * 코사인 유사도 계산
 * @param {Array} vectorA - 첫 번째 벡터
 * @param {Array} vectorB - 두 번째 벡터
 * @returns {number} 코사인 유사도 (-1 ~ 1)
 */
function cosineSimilarity(vectorA, vectorB) {
  // 입력 검증
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error('입력은 배열이어야 합니다');
  }
  
  if (vectorA.length !== vectorB.length) {
    throw new Error('벡터의 차원이 일치하지 않습니다');
  }
  
  if (vectorA.length === 0) {
    throw new Error('빈 벡터는 허용되지 않습니다');
  }
  
  // 내적 계산
  let dotProduct = 0;
  for (let i = 0; i < vectorA.length; i++) {
    dotProduct += vectorA[i] * vectorB[i];
  }
  
  // 벡터의 크기 계산
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < vectorA.length; i++) {
    magnitudeA += vectorA[i] * vectorA[i];
    magnitudeB += vectorB[i] * vectorB[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  // 0으로 나누기 방지
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  // 코사인 유사도 계산
  return dotProduct / (magnitudeA * magnitudeB);
}

/**
 * 벡터 정규화 (단위 벡터로 변환)
 * @param {Array} vector - 정규화할 벡터
 * @returns {Array} 정규화된 벡터
 */
function normalizeVector(vector) {
  if (!Array.isArray(vector) || vector.length === 0) {
    throw new Error('유효한 벡터가 필요합니다');
  }
  
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitude === 0) {
    return vector.map(() => 0);
  }
  
  return vector.map(val => val / magnitude);
}

/**
 * 유클리드 거리 계산
 * @param {Array} vectorA - 첫 번째 벡터
 * @param {Array} vectorB - 두 번째 벡터
 * @returns {number} 유클리드 거리
 */
function euclideanDistance(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error('입력은 배열이어야 합니다');
  }
  
  if (vectorA.length !== vectorB.length) {
    throw new Error('벡터의 차원이 일치하지 않습니다');
  }
  
  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    const diff = vectorA[i] - vectorB[i];
    sum += diff * diff;
  }
  
  return Math.sqrt(sum);
}

/**
 * 맨하탄 거리 계산
 * @param {Array} vectorA - 첫 번째 벡터
 * @param {Array} vectorB - 두 번째 벡터
 * @returns {number} 맨하탄 거리
 */
function manhattanDistance(vectorA, vectorB) {
  if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
    throw new Error('입력은 배열이어야 합니다');
  }
  
  if (vectorA.length !== vectorB.length) {
    throw new Error('벡터의 차원이 일치하지 않습니다');
  }
  
  let sum = 0;
  for (let i = 0; i < vectorA.length; i++) {
    sum += Math.abs(vectorA[i] - vectorB[i]);
  }
  
  return sum;
}

/**
 * 벡터 유사도 계산 (다양한 메트릭 지원)
 * @param {Array} vectorA - 첫 번째 벡터
 * @param {Array} vectorB - 두 번째 벡터
 * @param {string} metric - 유사도 메트릭 ('cosine', 'euclidean', 'manhattan')
 * @returns {number} 유사도 점수
 */
function calculateSimilarity(vectorA, vectorB, metric = 'cosine') {
  switch (metric) {
    case 'cosine':
      return cosineSimilarity(vectorA, vectorB);
    case 'euclidean':
      // 유클리드 거리를 유사도로 변환 (0-1 범위)
      const euclideanDist = euclideanDistance(vectorA, vectorB);
      return 1 / (1 + euclideanDist);
    case 'manhattan':
      // 맨하탄 거리를 유사도로 변환 (0-1 범위)
      const manhattanDist = manhattanDistance(vectorA, vectorB);
      return 1 / (1 + manhattanDist);
    default:
      throw new Error(`지원하지 않는 메트릭: ${metric}`);
  }
}

module.exports = {
  cosineSimilarity,
  normalizeVector,
  euclideanDistance,
  manhattanDistance,
  calculateSimilarity
};

