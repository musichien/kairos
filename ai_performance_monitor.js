/**
 * AI Performance Monitor - AI 모델 성능 모니터링 및 최적화 시스템
 * 
 * 이 모듈은 AI 모델의 성능을 실시간으로 모니터링하고,
 * 응답 시간, 정확도, 사용자 만족도 등을 추적하여
 * 지속적인 성능 개선을 지원합니다.
 */

const fs = require('fs').promises;
const path = require('path');

class AIPerformanceMonitor {
    constructor() {
        this.performanceData = {
            responseTimes: [],
            accuracyMetrics: [],
            userSatisfaction: [],
            modelUsage: {},
            errorRates: {},
            optimizationSuggestions: []
        };
        
        this.metricsPath = path.join(__dirname, 'performance_metrics');
        this.ensureMetricsDirectory();
        this.loadHistoricalData();
    }

    async ensureMetricsDirectory() {
        try {
            await fs.mkdir(this.metricsPath, { recursive: true });
        } catch (error) {
            console.log('📁 Performance metrics directory already exists');
        }
    }

    async loadHistoricalData() {
        try {
            const files = await fs.readdir(this.metricsPath);
            for (const file of files) {
                if (file.endsWith('.json')) {
                    const data = await fs.readFile(path.join(this.metricsPath, file), 'utf8');
                    const metrics = JSON.parse(data);
                    this.mergeMetrics(metrics);
                }
            }
        } catch (error) {
            console.log('📊 No historical performance data found, starting fresh');
        }
    }

    mergeMetrics(metrics) {
        if (metrics.responseTimes) {
            this.performanceData.responseTimes.push(...metrics.responseTimes);
        }
        if (metrics.accuracyMetrics) {
            this.performanceData.accuracyMetrics.push(...metrics.accuracyMetrics);
        }
        if (metrics.userSatisfaction) {
            this.performanceData.userSatisfaction.push(...metrics.userSatisfaction);
        }
        if (metrics.modelUsage) {
            Object.assign(this.performanceData.modelUsage, metrics.modelUsage);
        }
        if (metrics.errorRates) {
            Object.assign(this.performanceData.errorRates, metrics.errorRates);
        }
    }

    /**
     * 응답 시간 측정 및 기록
     */
    startResponseTimer() {
        return {
            startTime: Date.now(),
            startHrTime: process.hrtime()
        };
    }

    endResponseTimer(timer, modelName, success = true) {
        const endTime = Date.now();
        const endHrTime = process.hrtime(timer.startHrTime);
        
        const responseTime = endTime - timer.startTime;
        const hrResponseTime = (endHrTime[0] * 1000 + endHrTime[1] / 1000000);
        
        const metric = {
            timestamp: new Date().toISOString(),
            modelName,
            responseTime,
            hrResponseTime,
            success,
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage()
        };

        this.performanceData.responseTimes.push(metric);
        
        // 모델별 사용 통계 업데이트
        if (!this.performanceData.modelUsage[modelName]) {
            this.performanceData.modelUsage[modelName] = {
                totalRequests: 0,
                successfulRequests: 0,
                totalResponseTime: 0,
                averageResponseTime: 0,
                lastUsed: null
            };
        }

        const modelStats = this.performanceData.modelUsage[modelName];
        modelStats.totalRequests++;
        modelStats.totalResponseTime += responseTime;
        modelStats.averageResponseTime = modelStats.totalResponseTime / modelStats.totalRequests;
        modelStats.lastUsed = new Date().toISOString();

        if (success) {
            modelStats.successfulRequests++;
        }

        return metric;
    }

    /**
     * 에러율 기록
     */
    recordError(modelName, errorType, errorMessage, context) {
        if (!this.performanceData.errorRates[modelName]) {
            this.performanceData.errorRates[modelName] = {
                totalErrors: 0,
                errorTypes: {},
                lastError: null
            };
        }

        const errorStats = this.performanceData.errorRates[modelName];
        errorStats.totalErrors++;
        errorStats.errorTypes[errorType] = (errorStats.errorTypes[errorType] || 0) + 1;
        errorStats.lastError = {
            timestamp: new Date().toISOString(),
            type: errorType,
            message: errorMessage,
            context
        };
    }

    /**
     * 성능 통계 생성
     */
    generatePerformanceStats() {
        const stats = {
            overall: {
                totalRequests: this.performanceData.responseTimes.length,
                averageResponseTime: 0,
                successRate: 0,
                totalErrors: 0
            },
            models: {},
            trends: 'stable',
            recommendations: []
        };

        if (this.performanceData.responseTimes.length > 0) {
            const successfulRequests = this.performanceData.responseTimes.filter(r => r.success).length;
            const totalResponseTime = this.performanceData.responseTimes.reduce((sum, r) => sum + r.responseTime, 0);
            
            stats.overall.averageResponseTime = totalResponseTime / this.performanceData.responseTimes.length;
            stats.overall.successRate = successfulRequests / this.performanceData.responseTimes.length;
        }

        // 모델별 통계
        Object.keys(this.performanceData.modelUsage).forEach(modelName => {
            const modelStats = this.performanceData.modelUsage[modelName];
            const errorStats = this.performanceData.errorRates[modelName] || { totalErrors: 0 };
            
            stats.models[modelName] = {
                totalRequests: modelStats.totalRequests,
                successfulRequests: modelStats.successfulRequests,
                successRate: modelStats.successfulRequests / modelStats.totalRequests,
                averageResponseTime: modelStats.averageResponseTime,
                totalErrors: errorStats.totalErrors,
                lastUsed: modelStats.lastUsed
            };
        });

        return stats;
    }

    /**
     * 실시간 성능 대시보드 데이터
     */
    getRealTimeDashboard() {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        const oneDayAgo = now - (24 * 60 * 60 * 1000);
        
        const recentRequests = this.performanceData.responseTimes.filter(r => 
            new Date(r.timestamp).getTime() > oneHourAgo
        );
        
        const dailyRequests = this.performanceData.responseTimes.filter(r => 
            new Date(r.timestamp).getTime() > oneDayAgo
        );

        return {
            currentHour: {
                totalRequests: recentRequests.length,
                averageResponseTime: recentRequests.length > 0 ? 
                    recentRequests.reduce((sum, r) => sum + r.responseTime, 0) / recentRequests.length : 0,
                successRate: recentRequests.length > 0 ? 
                    recentRequests.filter(r => r.success).length / recentRequests.length : 0
            },
            currentDay: {
                totalRequests: dailyRequests.length,
                averageResponseTime: dailyRequests.length > 0 ? 
                    dailyRequests.reduce((sum, r) => sum + r.responseTime, 0) / dailyRequests.length : 0,
                successRate: dailyRequests.length > 0 ? 
                    dailyRequests.filter(r => r.success).length / dailyRequests.length : 0
            },
            topModels: Object.entries(this.performanceData.modelUsage)
                .sort((a, b) => b[1].totalRequests - a[1].totalRequests)
                .slice(0, 5)
                .map(([name, stats]) => ({
                    name,
                    requests: stats.totalRequests,
                    avgResponseTime: stats.averageResponseTime,
                    successRate: stats.successfulRequests / stats.totalRequests
                }))
        };
    }

    /**
     * 성능 최적화 실행
     */
    async runOptimization() {
        const optimization = {
            timestamp: new Date().toISOString(),
            actions: [],
            results: {}
        };

        // 메모리 정리
        if (global.gc) {
            global.gc();
            optimization.actions.push('garbage_collection');
            optimization.results.memoryBefore = process.memoryUsage();
        }

        // 오래된 데이터 정리
        const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7일 전
        this.performanceData.responseTimes = this.performanceData.responseTimes.filter(r => 
            new Date(r.timestamp) > cutoffDate
        );

        optimization.actions.push('data_cleanup');
        optimization.results.recordsKept = this.performanceData.responseTimes.length;

        return optimization;
    }
}

module.exports = AIPerformanceMonitor;
