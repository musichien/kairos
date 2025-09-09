/**
 * Predictive Behavioral System - 예측적 행동 시스템
 * 
 * Damasio의 Core Consciousness 이론에 기반한 고도화된 행동 피드백 루프
 * 예측적 모델링과 적응적 개입 시스템
 */

const EventEmitter = require('events');

class PredictiveBehavioralSystem extends EventEmitter {
    constructor() {
        super();
        
        // 예측 모델들
        this.predictionModels = {
            stateTransition: new Map(), // 상태 전환 예측
            interventionEffectiveness: new Map(), // 개입 효과성 예측
            userResponse: new Map(), // 사용자 응답 예측
            environmentalImpact: new Map() // 환경 영향 예측
        };
        
        // 개입 전략들
        this.interventionStrategies = {
            stressManagement: {
                breathing: { effectiveness: 0.8, duration: 300, type: 'immediate' },
                meditation: { effectiveness: 0.7, duration: 600, type: 'sustained' },
                exercise: { effectiveness: 0.9, duration: 1800, type: 'physical' }
            },
            energyBoost: {
                nutrition: { effectiveness: 0.6, duration: 1800, type: 'sustained' },
                movement: { effectiveness: 0.8, duration: 600, type: 'immediate' },
                social: { effectiveness: 0.7, duration: 900, type: 'social' }
            },
            focusEnhancement: {
                attention: { effectiveness: 0.8, duration: 1200, type: 'cognitive' },
                environment: { effectiveness: 0.6, duration: 300, type: 'environmental' },
                breaks: { effectiveness: 0.7, duration: 300, type: 'restorative' }
            }
        };
        
        // 예측 파라미터
        this.predictionParams = {
            timeHorizon: 3600, // 1시간 예측
            confidenceThreshold: 0.7,
            adaptationRate: 0.1,
            learningRate: 0.05
        };
        
        // 개입 이력
        this.interventionHistory = new Map();
        
        // 성과 추적
        this.performanceTracking = new Map();
        
        console.log('🎯 Predictive Behavioral System initialized');
    }
    
    /**
     * 예측적 개입 실행
     */
    async executePredictiveIntervention(userId, userState, externalContext = {}) {
        try {
            // 1. 상태 전환 예측
            const statePrediction = await this.predictStateTransition(userId, userState);
            
            // 2. 개입 필요성 평가
            const interventionNeed = await this.assessInterventionNeed(statePrediction, userState);
            
            // 3. 최적 개입 전략 선택
            const optimalStrategy = await this.selectOptimalStrategy(userId, interventionNeed, userState);
            
            // 4. 개입 효과성 예측
            const effectivenessPrediction = await this.predictInterventionEffectiveness(userId, optimalStrategy);
            
            // 5. 개입 실행
            const intervention = await this.executeIntervention(userId, optimalStrategy, effectivenessPrediction);
            
            // 6. 성과 추적 시작
            this.startPerformanceTracking(userId, intervention);
            
            // 7. 이벤트 발생
            this.emit('predictiveInterventionExecuted', {
                userId,
                intervention,
                prediction: statePrediction,
                effectiveness: effectivenessPrediction,
                timestamp: Date.now()
            });
            
            return intervention;
        } catch (error) {
            console.error('Predictive intervention error:', error);
            throw error;
        }
    }
    
    /**
     * 상태 전환 예측
     */
    async predictStateTransition(userId, currentState) {
        const prediction = {
            timeHorizon: this.predictionParams.timeHorizon,
            predictions: {},
            confidence: {},
            riskFactors: []
        };
        
        // 생리학적 상태 예측
        prediction.predictions.physiological = await this.predictPhysiologicalState(userId, currentState);
        
        // 감정적 상태 예측
        prediction.predictions.emotional = await this.predictEmotionalState(userId, currentState);
        
        // 인지적 상태 예측
        prediction.predictions.cognitive = await this.predictCognitiveState(userId, currentState);
        
        // 행동적 상태 예측
        prediction.predictions.behavioral = await this.predictBehavioralState(userId, currentState);
        
        // 위험 요인 식별
        prediction.riskFactors = this.identifyRiskFactors(prediction.predictions);
        
        // 전체 신뢰도 계산
        prediction.confidence.overall = this.calculateOverallConfidence(prediction.predictions);
        
        return prediction;
    }
    
    /**
     * 생리학적 상태 예측
     */
    async predictPhysiologicalState(userId, currentState) {
        const current = currentState.physiological;
        const prediction = {};
        
        // 스트레스 레벨 예측
        const stressTrend = this.calculateTrend(userId, 'stressLevel');
        prediction.stressLevel = Math.max(0, Math.min(1, 
            current.stressLevel + stressTrend * 0.1));
        
        // 에너지 레벨 예측
        const energyTrend = this.calculateTrend(userId, 'energyLevel');
        prediction.energyLevel = Math.max(0, Math.min(1, 
            current.energyLevel + energyTrend * 0.1));
        
        // 심박수 예측
        const heartRateTrend = this.calculateTrend(userId, 'heartRate');
        prediction.heartRate = Math.max(0, Math.min(1, 
            current.heartRate + heartRateTrend * 0.05));
        
        // 수면 품질 예측
        const sleepTrend = this.calculateTrend(userId, 'sleepQuality');
        prediction.sleepQuality = Math.max(0, Math.min(1, 
            current.sleepQuality + sleepTrend * 0.02));
        
        return prediction;
    }
    
    /**
     * 감정적 상태 예측
     */
    async predictEmotionalState(userId, currentState) {
        const current = currentState.emotional.current;
        const prediction = {};
        
        // 감정 궤적 분석
        const emotionalTrajectory = this.analyzeEmotionalTrajectory(userId);
        
        // 감정 전환 확률 계산
        const transitionProbabilities = this.calculateEmotionalTransitions(emotionalTrajectory);
        
        // 예측된 감정 상태
        prediction.valence = this.predictEmotionalValue(current.valence, transitionProbabilities.valence);
        prediction.arousal = this.predictEmotionalValue(current.arousal, transitionProbabilities.arousal);
        prediction.dominance = this.predictEmotionalValue(current.dominance, transitionProbabilities.dominance);
        
        // 세부 감정 예측
        prediction.joy = this.predictEmotionalValue(current.joy, transitionProbabilities.joy);
        prediction.sadness = this.predictEmotionalValue(current.sadness, transitionProbabilities.sadness);
        prediction.anger = this.predictEmotionalValue(current.anger, transitionProbabilities.anger);
        prediction.fear = this.predictEmotionalValue(current.fear, transitionProbabilities.fear);
        
        return prediction;
    }
    
    /**
     * 인지적 상태 예측
     */
    async predictCognitiveState(userId, currentState) {
        const current = currentState.cognitive;
        const prediction = {};
        
        // 인지 부하 예측
        const cognitiveLoadTrend = this.calculateTrend(userId, 'cognitive.load.overall');
        prediction.cognitiveLoad = Math.max(0, Math.min(1, 
            current.load.overall + cognitiveLoadTrend * 0.1));
        
        // 주의력 예측
        const attentionTrend = this.calculateTrend(userId, 'cognitive.capacity.available');
        prediction.attention = Math.max(0, Math.min(1, 
            current.capacity.available + attentionTrend * 0.1));
        
        // 인지 유연성 예측
        const flexibilityTrend = this.calculateTrend(userId, 'cognitive.flexibility.taskSwitching');
        prediction.flexibility = Math.max(0, Math.min(1, 
            current.flexibility.taskSwitching + flexibilityTrend * 0.05));
        
        return prediction;
    }
    
    /**
     * 행동적 상태 예측
     */
    async predictBehavioralState(userId, currentState) {
        const current = currentState.behavioral;
        const prediction = {};
        
        // 활동 수준 예측
        const activityTrend = this.calculateTrend(userId, 'behavioral.patterns.activityLevel');
        prediction.activityLevel = this.predictActivityLevel(current.activityLevel, activityTrend);
        
        // 사회적 참여 예측
        const socialTrend = this.calculateTrend(userId, 'behavioral.socialEngagement');
        prediction.socialEngagement = this.predictSocialEngagement(current.socialEngagement, socialTrend);
        
        // 작업 참여 예측
        const taskTrend = this.calculateTrend(userId, 'behavioral.taskEngagement');
        prediction.taskEngagement = this.predictTaskEngagement(current.taskEngagement, taskTrend);
        
        return prediction;
    }
    
    /**
     * 개입 필요성 평가
     */
    async assessInterventionNeed(statePrediction, currentState) {
        const need = {
            urgency: 0,
            priority: 'low',
            targetAreas: [],
            interventionType: null
        };
        
        // 긴급도 계산
        const riskFactors = statePrediction.riskFactors;
        need.urgency = riskFactors.reduce((sum, risk) => sum + risk.severity, 0) / riskFactors.length;
        
        // 우선순위 결정
        if (need.urgency > 0.8) {
            need.priority = 'critical';
        } else if (need.urgency > 0.6) {
            need.priority = 'high';
        } else if (need.urgency > 0.4) {
            need.priority = 'medium';
        } else {
            need.priority = 'low';
        }
        
        // 대상 영역 식별
        need.targetAreas = this.identifyTargetAreas(statePrediction.predictions);
        
        // 개입 유형 결정
        need.interventionType = this.determineInterventionType(need.targetAreas, need.urgency);
        
        return need;
    }
    
    /**
     * 최적 개입 전략 선택
     */
    async selectOptimalStrategy(userId, interventionNeed, userState) {
        const strategies = this.interventionStrategies[interventionNeed.interventionType] || 
                          this.interventionStrategies.stressManagement;
        
        let bestStrategy = null;
        let bestScore = 0;
        
        // 각 전략의 적합성 평가
        for (const [strategyName, strategy] of Object.entries(strategies)) {
            const score = await this.evaluateStrategyFit(userId, strategyName, strategy, userState, interventionNeed);
            
            if (score > bestScore) {
                bestScore = score;
                bestStrategy = {
                    name: strategyName,
                    type: interventionNeed.interventionType,
                    ...strategy
                };
            }
        }
        
        return bestStrategy || {
            name: 'breathing',
            type: 'stressManagement',
            effectiveness: 0.8,
            duration: 300,
            type: 'immediate'
        };
    }
    
    /**
     * 전략 적합성 평가
     */
    async evaluateStrategyFit(userId, strategyName, strategy, userState, interventionNeed) {
        let score = strategy.effectiveness;
        
        // 사용자 상태와의 적합성
        score *= this.calculateStateCompatibility(strategy, userState);
        
        // 개입 이력 기반 조정
        const historyScore = this.calculateHistoryScore(userId, strategyName);
        score *= historyScore;
        
        // 환경적 적합성
        const environmentalScore = this.calculateEnvironmentalCompatibility(strategy);
        score *= environmentalScore;
        
        // 긴급도 기반 조정
        if (interventionNeed.urgency > 0.7 && strategy.type === 'immediate') {
            score *= 1.2;
        }
        
        return Math.max(0, Math.min(1, score));
    }
    
    /**
     * 개입 실행
     */
    async executeIntervention(userId, strategy, effectivenessPrediction) {
        const intervention = {
            id: `${userId}_${Date.now()}`,
            userId,
            strategy: strategy.name,
            type: strategy.type,
            duration: strategy.duration,
            expectedEffectiveness: effectivenessPrediction.predictedEffectiveness,
            startTime: Date.now(),
            status: 'active',
            progress: 0
        };
        
        // 개입 이력에 추가
        this.interventionHistory.set(intervention.id, intervention);
        
        // 개입 모니터링 시작
        this.startInterventionMonitoring(intervention);
        
        return intervention;
    }
    
    /**
     * 개입 모니터링 시작
     */
    startInterventionMonitoring(intervention) {
        const monitoringInterval = setInterval(() => {
            this.updateInterventionProgress(intervention);
        }, 1000); // 1초마다 업데이트
        
        // 개입 완료 시 모니터링 중지
        setTimeout(() => {
            clearInterval(monitoringInterval);
            this.completeIntervention(intervention);
        }, intervention.duration * 1000);
    }
    
    /**
     * 개입 진행 상황 업데이트
     */
    updateInterventionProgress(intervention) {
        const elapsed = Date.now() - intervention.startTime;
        const progress = Math.min(1, elapsed / (intervention.duration * 1000));
        
        intervention.progress = progress;
        
        // 중간 평가
        if (progress > 0.5 && !intervention.midpointEvaluation) {
            this.performMidpointEvaluation(intervention);
            intervention.midpointEvaluation = true;
        }
    }
    
    /**
     * 중간 평가 수행
     */
    performMidpointEvaluation(intervention) {
        // 실제 효과성 측정 (시뮬레이션)
        const actualEffectiveness = this.measureInterventionEffectiveness(intervention);
        
        // 예측과 실제 비교
        const predictionAccuracy = 1 - Math.abs(
            intervention.expectedEffectiveness - actualEffectiveness
        );
        
        // 학습 데이터 업데이트
        this.updatePredictionModel(intervention, actualEffectiveness, predictionAccuracy);
        
        console.log(`📊 Midpoint evaluation for intervention ${intervention.id}: ${actualEffectiveness.toFixed(3)}`);
    }
    
    /**
     * 개입 완료
     */
    completeIntervention(intervention) {
        intervention.status = 'completed';
        intervention.endTime = Date.now();
        
        // 최종 효과성 측정
        const finalEffectiveness = this.measureInterventionEffectiveness(intervention);
        intervention.actualEffectiveness = finalEffectiveness;
        
        // 성과 추적 업데이트
        this.updatePerformanceTracking(intervention);
        
        // 이벤트 발생
        this.emit('interventionCompleted', {
            intervention,
            effectiveness: finalEffectiveness,
            timestamp: Date.now()
        });
        
        console.log(`✅ Intervention completed: ${intervention.strategy} for user ${intervention.userId}`);
    }
    
    /**
     * 성과 추적 시작
     */
    startPerformanceTracking(userId, intervention) {
        const tracking = {
            userId,
            interventionId: intervention.id,
            startTime: Date.now(),
            metrics: {
                effectiveness: 0,
                userSatisfaction: 0,
                adherence: 0,
                sideEffects: 0
            },
            checkpoints: []
        };
        
        this.performanceTracking.set(intervention.id, tracking);
    }
    
    /**
     * 성과 추적 업데이트
     */
    updatePerformanceTracking(intervention) {
        const tracking = this.performanceTracking.get(intervention.id);
        if (!tracking) return;
        
        tracking.metrics.effectiveness = intervention.actualEffectiveness;
        tracking.metrics.userSatisfaction = this.assessUserSatisfaction(intervention);
        tracking.metrics.adherence = this.assessAdherence(intervention);
        tracking.metrics.sideEffects = this.assessSideEffects(intervention);
        
        tracking.endTime = Date.now();
        tracking.duration = tracking.endTime - tracking.startTime;
    }
    
    /**
     * 사용자 만족도 평가
     */
    assessUserSatisfaction(intervention) {
        // 시뮬레이션된 만족도 (실제로는 사용자 피드백 기반)
        return Math.max(0, Math.min(1, intervention.actualEffectiveness + (Math.random() - 0.5) * 0.2));
    }
    
    /**
     * 순응도 평가
     */
    assessAdherence(intervention) {
        // 시뮬레이션된 순응도
        return Math.max(0, Math.min(1, intervention.progress + (Math.random() - 0.5) * 0.1));
    }
    
    /**
     * 부작용 평가
     */
    assessSideEffects(intervention) {
        // 시뮬레이션된 부작용 (낮을수록 좋음)
        return Math.max(0, Math.min(1, (1 - intervention.actualEffectiveness) * 0.3));
    }
    
    /**
     * 예측 모델 업데이트
     */
    updatePredictionModel(intervention, actualEffectiveness, predictionAccuracy) {
        const modelKey = `${intervention.type}_${intervention.strategy}`;
        
        if (!this.predictionModels.interventionEffectiveness.has(modelKey)) {
            this.predictionModels.interventionEffectiveness.set(modelKey, {
                predictions: [],
                actuals: [],
                accuracy: []
            });
        }
        
        const model = this.predictionModels.interventionEffectiveness.get(modelKey);
        model.predictions.push(intervention.expectedEffectiveness);
        model.actuals.push(actualEffectiveness);
        model.accuracy.push(predictionAccuracy);
        
        // 최근 100개 데이터만 유지
        if (model.predictions.length > 100) {
            model.predictions.shift();
            model.actuals.shift();
            model.accuracy.shift();
        }
    }
    
    /**
     * 개입 효과성 예측
     */
    async predictInterventionEffectiveness(userId, strategy) {
        const modelKey = `${strategy.type}_${strategy.name}`;
        const model = this.predictionModels.interventionEffectiveness.get(modelKey);
        
        let predictedEffectiveness = strategy.effectiveness; // 기본값
        
        if (model && model.actuals.length > 0) {
            // 과거 데이터 기반 예측
            const avgEffectiveness = model.actuals.reduce((sum, val) => sum + val, 0) / model.actuals.length;
            const avgAccuracy = model.accuracy.reduce((sum, val) => sum + val, 0) / model.accuracy.length;
            
            predictedEffectiveness = avgEffectiveness * avgAccuracy + strategy.effectiveness * (1 - avgAccuracy);
        }
        
        return {
            predictedEffectiveness,
            confidence: model ? model.accuracy.reduce((sum, val) => sum + val, 0) / model.accuracy.length : 0.5,
            model: modelKey
        };
    }
    
    /**
     * 시스템 통계 조회
     */
    getStats() {
        return {
            totalInterventions: this.interventionHistory.size,
            activeInterventions: Array.from(this.interventionHistory.values())
                .filter(i => i.status === 'active').length,
            predictionModels: {
                stateTransition: this.predictionModels.stateTransition.size,
                interventionEffectiveness: this.predictionModels.interventionEffectiveness.size,
                userResponse: this.predictionModels.userResponse.size,
                environmentalImpact: this.predictionModels.environmentalImpact.size
            },
            performanceTracking: this.performanceTracking.size,
            timestamp: Date.now()
        };
    }
    
    /**
     * 시스템 종료
     */
    shutdown() {
        this.removeAllListeners();
        console.log('🎯 Predictive Behavioral System shutdown complete');
    }
}

module.exports = PredictiveBehavioralSystem;


