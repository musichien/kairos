/**
 * Performance Optimizer - 성능 최적화 및 확장성 개선 시스템
 * 
 * 이 모듈은 응답 시간 단축, 리소스 효율성 향상, 부하 분산 등을 통해
 * 시스템의 전반적인 성능을 최적화하고 확장성을 개선합니다.
 */

const fs = require('fs').promises;
const path = require('path');

class PerformanceOptimizer {
    constructor() {
        this.optimizationConfig = {
            caching: {
                enabled: true,
                maxSize: 1000,
                ttl: 300000 // 5분
            },
            compression: {
                enabled: true,
                threshold: 1024 // 1KB 이상
            }
        };
        
        this.cache = new Map();
        this.performanceMetrics = {
            responseTimes: [],
            memoryUsage: [],
            cacheHits: 0,
            cacheMisses: 0
        };
        
        this.dataPath = path.join(__dirname, 'performance_data');
        this.ensureDataDirectory();
        this.initializeCache();
    }

    async ensureDataDirectory() {
        try {
            await fs.mkdir(this.dataPath, { recursive: true });
        } catch (error) {
            console.log('📁 Performance data directory already exists');
        }
    }

    initializeCache() {
        this.cacheStats = {
            hits: 0,
            misses: 0,
            size: 0,
            maxSize: this.optimizationConfig.caching.maxSize
        };
        
        // 캐시 정리 타이머
        setInterval(() => {
            this.cleanupCache();
        }, this.optimizationConfig.caching.ttl);
    }

    /**
     * 캐시 데이터 저장
     */
    setCache(key, value, ttl = null) {
        if (!this.optimizationConfig.caching.enabled) {
            return false;
        }

        const cacheItem = {
            value,
            timestamp: Date.now(),
            ttl: ttl || this.optimizationConfig.caching.ttl
        };

        // 캐시 크기 제한 확인
        if (this.cache.size >= this.optimizationConfig.caching.maxSize) {
            this.evictCacheItem();
        }

        this.cache.set(key, cacheItem);
        this.cacheStats.size = this.cache.size;
        
        return true;
    }

    /**
     * 캐시 데이터 조회
     */
    getCache(key) {
        if (!this.optimizationConfig.caching.enabled) {
            return null;
        }

        const cacheItem = this.cache.get(key);
        
        if (!cacheItem) {
            this.cacheStats.misses++;
            return null;
        }

        // TTL 확인
        if (Date.now() - cacheItem.timestamp > cacheItem.ttl) {
            this.cache.delete(key);
            this.cacheStats.misses++;
            this.cacheStats.size = this.cache.size;
            return null;
        }

        this.cacheStats.hits++;
        return cacheItem.value;
    }

    /**
     * 캐시 아이템 제거 (LRU 전략)
     */
    evictCacheItem() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, item] of this.cache) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
        }
    }

    /**
     * 캐시 정리
     */
    cleanupCache() {
        const now = Date.now();
        const keysToDelete = [];
        
        for (const [key, item] of this.cache) {
            if (now - item.timestamp > item.ttl) {
                keysToDelete.push(key);
            }
        }
        
        keysToDelete.forEach(key => {
            this.cache.delete(key);
        });
        
        this.cacheStats.size = this.cache.size;
    }

    /**
     * 메모리 사용량 모니터링
     */
    monitorMemoryUsage() {
        const memUsage = process.memoryUsage();
        const memoryUsageMB = {
            rss: Math.round(memUsage.rss / 1024 / 1024),
            heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024),
            heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024),
            external: Math.round(memUsage.external / 1024 / 1024)
        };

        this.performanceMetrics.memoryUsage.push({
            timestamp: new Date().toISOString(),
            ...memoryUsageMB
        });

        // 최근 100개 데이터만 유지
        if (this.performanceMetrics.memoryUsage.length > 100) {
            this.performanceMetrics.memoryUsage.shift();
        }
    }

    /**
     * 응답 시간 최적화
     */
    optimizeResponseTime(operation, callback) {
        const startTime = Date.now();
        
        return new Promise((resolve, reject) => {
            try {
                const result = callback();
                
                if (result instanceof Promise) {
                    result.then(resolve).catch(reject);
                } else {
                    resolve(result);
                }
            } catch (error) {
                reject(error);
            }
        }).finally(() => {
            const responseTime = Date.now() - startTime;
            this.recordResponseTime(operation, responseTime);
        });
    }

    /**
     * 응답 시간 기록
     */
    recordResponseTime(operation, responseTime) {
        this.performanceMetrics.responseTimes.push({
            timestamp: new Date().toISOString(),
            operation,
            responseTime
        });

        // 최근 1000개 데이터만 유지
        if (this.performanceMetrics.responseTimes.length > 1000) {
            this.performanceMetrics.responseTimes.shift();
        }
    }

    /**
     * 성능 통계 생성
     */
    generatePerformanceStats() {
        const stats = {
            cache: {
                hits: this.cacheStats.hits,
                misses: this.cacheStats.misses,
                hitRate: this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses) || 0,
                size: this.cacheStats.size,
                maxSize: this.cacheStats.maxSize
            },
            performance: {
                averageResponseTime: this.calculateAverageResponseTime(),
                memoryUsage: this.getCurrentMemoryUsage(),
                optimizationSuggestions: []
            }
        };

        return stats;
    }

    /**
     * 평균 응답 시간 계산
     */
    calculateAverageResponseTime() {
        if (this.performanceMetrics.responseTimes.length === 0) {
            return 0;
        }

        const totalTime = this.performanceMetrics.responseTimes.reduce((sum, item) => sum + item.responseTime, 0);
        return totalTime / this.performanceMetrics.responseTimes.length;
    }

    /**
     * 현재 메모리 사용량
     */
    getCurrentMemoryUsage() {
        if (this.performanceMetrics.memoryUsage.length === 0) {
            return null;
        }

        return this.performanceMetrics.memoryUsage[this.performanceMetrics.memoryUsage.length - 1];
    }

    /**
     * 성능 최적화 권장사항 생성
     */
    generateOptimizationRecommendations() {
        const recommendations = [];
        
        // 캐시 히트율 분석
        const hitRate = this.cacheStats.hits / (this.cacheStats.hits + this.cacheStats.misses);
        if (hitRate < 0.7) {
            recommendations.push({
                type: 'caching',
                priority: 'medium',
                description: '캐시 히트율이 낮습니다. 캐시 전략을 개선하세요.',
                actions: ['캐시 키 전략 개선', 'TTL 최적화', '캐시 크기 증가']
            });
        }

        // 응답 시간 분석
        const avgResponseTime = this.calculateAverageResponseTime();
        if (avgResponseTime > 2000) {
            recommendations.push({
                type: 'performance',
                priority: 'high',
                description: '평균 응답 시간이 느립니다. 성능을 개선하세요.',
                actions: ['데이터베이스 쿼리 최적화', '캐싱 강화', '비동기 처리 도입']
            });
        }

        return recommendations;
    }
}

module.exports = PerformanceOptimizer;
