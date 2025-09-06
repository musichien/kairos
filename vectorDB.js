/**
 * Vector DB 연동 - 간단한 인메모리 벡터 검색
 * 
 * 실제 운영 환경에서는 FAISS, Milvus, Weaviate 등을 사용
 * 현재는 개발/테스트용 인메모리 구현
 */

class VectorDB {
  constructor() {
    this.vectors = new Map(); // memoryId -> embedding
    this.index = new Map(); // 임시 인덱스
  }

  /**
   * 벡터 저장
   * @param {string} memoryId - 메모리 ID
   * @param {Array} embedding - 벡터 임베딩
   * @param {Object} metadata - 메타데이터
   */
  async storeVector(memoryId, embedding, metadata = {}) {
    this.vectors.set(memoryId, {
      embedding: embedding,
      metadata: metadata,
      timestamp: new Date().toISOString()
    });
    
    console.log(`📊 벡터 저장됨: ${memoryId} (차원: ${embedding.length})`);
    return true;
  }

  /**
   * 벡터 검색 (코사인 유사도 기반)
   * @param {Array} queryEmbedding - 쿼리 임베딩
   * @param {number} topK - 상위 K개 결과
   * @param {Object} filters - 필터 조건
   * @returns {Array} 검색 결과
   */
  async searchVectors(queryEmbedding, topK = 50, filters = {}) {
    if (!queryEmbedding || queryEmbedding.length === 0) {
      return [];
    }

    const results = [];
    
    for (const [memoryId, vectorData] of this.vectors) {
      // 필터 적용
      if (filters.userId && vectorData.metadata.userId !== filters.userId) {
        continue;
      }
      
      if (filters.type && vectorData.metadata.type !== filters.type) {
        continue;
      }

      // 코사인 유사도 계산
      const similarity = this.calculateCosineSimilarity(queryEmbedding, vectorData.embedding);
      
      results.push({
        memoryId: memoryId,
        similarity: similarity,
        metadata: vectorData.metadata,
        embedding: vectorData.embedding
      });
    }

    // 유사도 기준으로 정렬하고 상위 K개 반환
    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  /**
   * 코사인 유사도 계산
   * @param {Array} vectorA - 첫 번째 벡터
   * @param {Array} vectorB - 두 번째 벡터
   * @returns {number} 코사인 유사도
   */
  calculateCosineSimilarity(vectorA, vectorB) {
    if (vectorA.length !== vectorB.length) {
      return 0;
    }

    let dotProduct = 0;
    let magnitudeA = 0;
    let magnitudeB = 0;

    for (let i = 0; i < vectorA.length; i++) {
      dotProduct += vectorA[i] * vectorB[i];
      magnitudeA += vectorA[i] * vectorA[i];
      magnitudeB += vectorB[i] * vectorB[i];
    }

    magnitudeA = Math.sqrt(magnitudeA);
    magnitudeB = Math.sqrt(magnitudeB);

    if (magnitudeA === 0 || magnitudeB === 0) {
      return 0;
    }

    return dotProduct / (magnitudeA * magnitudeB);
  }

  /**
   * 벡터 삭제
   * @param {string} memoryId - 메모리 ID
   */
  async deleteVector(memoryId) {
    const deleted = this.vectors.delete(memoryId);
    console.log(`🗑️ 벡터 삭제됨: ${memoryId}`);
    return deleted;
  }

  /**
   * 벡터 업데이트
   * @param {string} memoryId - 메모리 ID
   * @param {Array} embedding - 새로운 임베딩
   * @param {Object} metadata - 새로운 메타데이터
   */
  async updateVector(memoryId, embedding, metadata = {}) {
    if (this.vectors.has(memoryId)) {
      this.vectors.set(memoryId, {
        embedding: embedding,
        metadata: { ...this.vectors.get(memoryId).metadata, ...metadata },
        timestamp: new Date().toISOString()
      });
      console.log(`🔄 벡터 업데이트됨: ${memoryId}`);
      return true;
    }
    return false;
  }

  /**
   * 벡터 통계
   * @returns {Object} 통계 정보
   */
  getStats() {
    const totalVectors = this.vectors.size;
    const dimensions = totalVectors > 0 ? this.vectors.values().next().value.embedding.length : 0;
    
    const typeStats = {};
    for (const vectorData of this.vectors.values()) {
      const type = vectorData.metadata.type || 'unknown';
      typeStats[type] = (typeStats[type] || 0) + 1;
    }

    return {
      totalVectors,
      dimensions,
      typeStats,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  /**
   * 메모리 사용량 추정
   * @returns {number} 예상 메모리 사용량 (MB)
   */
  estimateMemoryUsage() {
    let totalSize = 0;
    for (const vectorData of this.vectors.values()) {
      // 임베딩 크기 (float32 = 4 bytes)
      totalSize += vectorData.embedding.length * 4;
      // 메타데이터 크기 (대략적)
      totalSize += JSON.stringify(vectorData.metadata).length * 2;
    }
    return Math.round(totalSize / (1024 * 1024) * 100) / 100; // MB
  }

  /**
   * 벡터 백업
   * @returns {Object} 백업 데이터
   */
  async backup() {
    const backup = {
      vectors: Object.fromEntries(this.vectors),
      timestamp: new Date().toISOString(),
      stats: this.getStats()
    };
    
    console.log(`💾 벡터 백업 생성됨: ${backup.stats.totalVectors}개 벡터`);
    return backup;
  }

  /**
   * 벡터 복원
   * @param {Object} backup - 백업 데이터
   */
  async restore(backup) {
    if (!backup || !backup.vectors) {
      throw new Error('유효하지 않은 백업 데이터');
    }

    this.vectors.clear();
    for (const [memoryId, vectorData] of Object.entries(backup.vectors)) {
      this.vectors.set(memoryId, vectorData);
    }
    
    console.log(`🔄 벡터 복원됨: ${backup.stats.totalVectors}개 벡터`);
    return true;
  }

  /**
   * 벡터 정리 (오래된 벡터 삭제)
   * @param {number} maxAge - 최대 보관 기간 (일)
   */
  async cleanup(maxAge = 365) {
    const cutoffDate = new Date(Date.now() - maxAge * 24 * 60 * 60 * 1000);
    let deletedCount = 0;

    for (const [memoryId, vectorData] of this.vectors) {
      const vectorDate = new Date(vectorData.timestamp);
      if (vectorDate < cutoffDate) {
        this.vectors.delete(memoryId);
        deletedCount++;
      }
    }

    console.log(`🧹 벡터 정리 완료: ${deletedCount}개 삭제됨`);
    return deletedCount;
  }
}

// 싱글톤 인스턴스
const vectorDB = new VectorDB();

module.exports = vectorDB;

