/**
 * 모니터링 시스템 - 메모리 기반 대화 시스템 성능 추적
 */

class MonitoringSystem {
  constructor() {
    this.metrics = {
      contextBuilds: 0,
      contextBuildTime: [],
      memorySearches: 0,
      memorySearchTime: [],
      vectorSearches: 0,
      vectorSearchTime: [],
      errors: 0,
      errorTypes: {},
      memoryUsage: [],
      responseLatency: []
    };
    
    this.startTime = Date.now();
    this.logs = [];
  }

  /**
   * 컨텍스트 빌드 메트릭 기록
   */
  recordContextBuild(duration, success = true, memoryCount = 0) {
    this.metrics.contextBuilds++;
    this.metrics.contextBuildTime.push(duration);
    
    if (!success) {
      this.metrics.errors++;
    }
    
    this.log('context_build', {
      duration,
      success,
      memoryCount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 메모리 검색 메트릭 기록
   */
  recordMemorySearch(duration, resultCount = 0) {
    this.metrics.memorySearches++;
    this.metrics.memorySearchTime.push(duration);
    
    this.log('memory_search', {
      duration,
      resultCount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 벡터 검색 메트릭 기록
   */
  recordVectorSearch(duration, resultCount = 0) {
    this.metrics.vectorSearches++;
    this.metrics.vectorSearchTime.push(duration);
    
    this.log('vector_search', {
      duration,
      resultCount,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 응답 지연시간 기록
   */
  recordResponseLatency(duration) {
    this.metrics.responseLatency.push(duration);
    
    this.log('response_latency', {
      duration,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 오류 기록
   */
  recordError(errorType, errorMessage, context = {}) {
    this.metrics.errors++;
    this.metrics.errorTypes[errorType] = (this.metrics.errorTypes[errorType] || 0) + 1;
    
    this.log('error', {
      errorType,
      errorMessage,
      context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * 메모리 사용량 기록
   */
  recordMemoryUsage(usage) {
    this.metrics.memoryUsage.push({
      usage,
      timestamp: new Date().toISOString()
    });
    
    // 최근 100개만 유지
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage = this.metrics.memoryUsage.slice(-100);
    }
  }

  /**
   * 로그 기록
   */
  log(level, data) {
    const logEntry = {
      level,
      data,
      timestamp: new Date().toISOString()
    };
    
    this.logs.push(logEntry);
    
    // 최근 1000개 로그만 유지
    if (this.logs.length > 1000) {
      this.logs = this.logs.slice(-1000);
    }
    
    // 콘솔에 중요한 로그 출력
    if (level === 'error') {
      console.error(`🚨 [${level.toUpperCase()}]`, data);
    } else if (level === 'context_build') {
      console.log(`🧠 [CONTEXT] ${data.duration}ms, ${data.memoryCount} memories`);
    }
  }

  /**
   * 통계 계산
   */
  getStats() {
    const uptime = Date.now() - this.startTime;
    
    return {
      uptime: uptime,
      uptimeFormatted: this.formatDuration(uptime),
      metrics: {
        contextBuilds: this.metrics.contextBuilds,
        averageContextBuildTime: this.calculateAverage(this.metrics.contextBuildTime),
        memorySearches: this.metrics.memorySearches,
        averageMemorySearchTime: this.calculateAverage(this.metrics.memorySearchTime),
        vectorSearches: this.metrics.vectorSearches,
        averageVectorSearchTime: this.calculateAverage(this.metrics.vectorSearchTime),
        errors: this.metrics.errors,
        errorTypes: this.metrics.errorTypes,
        averageResponseLatency: this.calculateAverage(this.metrics.responseLatency),
        currentMemoryUsage: this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1]?.usage || 0
      },
      performance: {
        contextBuildsPerMinute: this.calculateRate(this.metrics.contextBuilds, uptime),
        errorRate: this.metrics.contextBuilds > 0 ? (this.metrics.errors / this.metrics.contextBuilds) * 100 : 0,
        averageMemoriesPerContext: this.calculateAverageMemoryCount()
      },
      recentLogs: this.logs.slice(-10)
    };
  }

  /**
   * 평균 계산
   */
  calculateAverage(array) {
    if (array.length === 0) return 0;
    return array.reduce((sum, val) => sum + val, 0) / array.length;
  }

  /**
   * 비율 계산 (분당)
   */
  calculateRate(count, uptimeMs) {
    const minutes = uptimeMs / (1000 * 60);
    return minutes > 0 ? count / minutes : 0;
  }

  /**
   * 평균 메모리 개수 계산
   */
  calculateAverageMemoryCount() {
    const contextLogs = this.logs.filter(log => log.level === 'context_build');
    if (contextLogs.length === 0) return 0;
    
    const totalMemories = contextLogs.reduce((sum, log) => sum + (log.data.memoryCount || 0), 0);
    return totalMemories / contextLogs.length;
  }

  /**
   * 지속시간 포맷팅
   */
  formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * 성능 리포트 생성
   */
  generatePerformanceReport() {
    const stats = this.getStats();
    
    return {
      summary: {
        status: stats.metrics.errors > 0 ? 'warning' : 'healthy',
        uptime: stats.uptimeFormatted,
        totalRequests: stats.metrics.contextBuilds,
        errorRate: `${stats.performance.errorRate.toFixed(2)}%`,
        averageResponseTime: `${stats.metrics.averageResponseLatency.toFixed(0)}ms`
      },
      details: stats,
      recommendations: this.generateRecommendations(stats)
    };
  }

  /**
   * 개선 권장사항 생성
   */
  generateRecommendations(stats) {
    const recommendations = [];
    
    if (stats.performance.errorRate > 5) {
      recommendations.push({
        type: 'error',
        message: '오류율이 높습니다. 로그를 확인하고 문제를 해결하세요.',
        priority: 'high'
      });
    }
    
    if (stats.metrics.averageContextBuildTime > 1000) {
      recommendations.push({
        type: 'performance',
        message: '컨텍스트 빌드 시간이 느립니다. Vector DB 최적화를 고려하세요.',
        priority: 'medium'
      });
    }
    
    if (stats.metrics.averageResponseLatency > 5000) {
      recommendations.push({
        type: 'performance',
        message: '응답 지연시간이 길어집니다. 시스템 리소스를 확인하세요.',
        priority: 'medium'
      });
    }
    
    if (stats.metrics.contextBuilds > 0 && stats.performance.averageMemoriesPerContext < 2) {
      recommendations.push({
        type: 'quality',
        message: '컨텍스트당 평균 메모리 수가 적습니다. 메모리 품질을 개선하세요.',
        priority: 'low'
      });
    }
    
    return recommendations;
  }

  /**
   * 메트릭 리셋
   */
  reset() {
    this.metrics = {
      contextBuilds: 0,
      contextBuildTime: [],
      memorySearches: 0,
      memorySearchTime: [],
      vectorSearches: 0,
      vectorSearchTime: [],
      errors: 0,
      errorTypes: {},
      memoryUsage: [],
      responseLatency: []
    };
    
    this.logs = [];
    this.startTime = Date.now();
    
    console.log('📊 모니터링 메트릭이 리셋되었습니다.');
  }
}

// 싱글톤 인스턴스
const monitoring = new MonitoringSystem();

module.exports = monitoring;

