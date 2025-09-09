/**
 * Advanced Consciousness System - 고도화된 의식 시스템
 * 
 * Damasio의 Core Consciousness 이론을 기반으로 한 완전한 의식 시뮬레이션 시스템
 * 3단계 구현 + 고급 검증 + 머신러닝 통합
 */

const EventEmitter = require('events');
const SelfModelManager = require('./self_model_manager');
const ContextAwareDialogue = require('./context_aware_dialogue');
const BehavioralFeedbackLoop = require('./behavioral_feedback_loop');
const ConsciousnessValidator = require('./consciousness_validator');
const ConsciousnessMLEngine = require('./consciousness_ml_engine');

class AdvancedConsciousnessSystem extends EventEmitter {
    constructor() {
        super();
        
        // 핵심 시스템 초기화
        this.selfModelManager = new SelfModelManager();
        this.contextAwareDialogue = new ContextAwareDialogue(this.selfModelManager);
        this.behavioralFeedbackLoop = new BehavioralFeedbackLoop(this.selfModelManager, this.contextAwareDialogue);
        
        // 고급 시스템 초기화
        this.consciousnessValidator = new ConsciousnessValidator(
            this.selfModelManager, 
            this.contextAwareDialogue, 
            this.behavioralFeedbackLoop
        );
        this.mlEngine = new ConsciousnessMLEngine(
            this.selfModelManager, 
            this.contextAwareDialogue, 
            this.behavioralFeedbackLoop
        );
        
        // 시스템 통합 및 이벤트 연결
        this.setupSystemIntegration();
        this.startSystemMonitoring();
        
        console.log('🌟 Advanced Consciousness System initialized - Damasio Core Consciousness Implementation');
    }

    /**
     * 시스템 통합 및 이벤트 연결
     */
    setupSystemIntegration() {
        // 1단계: 자기 모델 이벤트 연결
        this.selfModelManager.on('stateChanged', (data) => {
            this.handleStateChange(data);
        });

        // 2단계: 맥락 인식 대화 이벤트 연결
        this.contextAwareDialogue.on('responseGenerated', (data) => {
            this.handleResponseGenerated(data);
        });

        this.contextAwareDialogue.on('proactiveIntervention', (data) => {
            this.handleProactiveIntervention(data);
        });

        // 3단계: 행동 피드백 루프 이벤트 연결
        this.behavioralFeedbackLoop.on('interventionTriggered', (data) => {
            this.handleInterventionTriggered(data);
        });

        this.behavioralFeedbackLoop.on('interventionCompleted', (data) => {
            this.handleInterventionCompleted(data);
        });

        // 고급 시스템 이벤트 연결
        this.consciousnessValidator.on('userConsciousnessValidated', (data) => {
            this.handleConsciousnessValidated(data);
        });

        this.mlEngine.on('statePredicted', (data) => {
            this.handleStatePredicted(data);
        });

        this.mlEngine.on('interventionEffectivenessPredicted', (data) => {
            this.handleInterventionEffectivenessPredicted(data);
        });
    }

    /**
     * 시스템 모니터링 시작
     */
    startSystemMonitoring() {
        // 1분마다 시스템 상태 모니터링
        setInterval(() => {
            this.monitorSystemHealth();
        }, 60000);
        
        // 10분마다 종합 의식 보고서 생성
        setInterval(() => {
            this.generateConsciousnessReport();
        }, 600000);
    }

    /**
     * 통합 사용자 상태 업데이트
     */
    async updateUserState(userId, inputData) {
        try {
            // 1단계: 자기 모델 업데이트
            const userState = await this.selfModelManager.updateUserState(userId, inputData);
            
            // 2단계: ML 예측 업데이트
            await this.mlEngine.predictUserState(userId);
            
            // 3단계: 의식 검증 수행
            await this.consciousnessValidator.validateUserConsciousness(userId);
            
            // 4단계: 통합 이벤트 발생
            this.emit('userStateUpdated', {
                userId,
                userState,
                timestamp: Date.now()
            });
            
            return userState;
        } catch (error) {
            console.error('User state update error:', error);
            throw error;
        }
    }

    /**
     * 통합 맥락 인식 응답 생성
     */
    async generateContextualResponse(userId, userQuery, baseResponse = null) {
        try {
            // 1단계: 응답 품질 예측
            const qualityPrediction = await this.mlEngine.predictResponseQuality(userId, userQuery, baseResponse);
            
            // 2단계: 맥락 인식 응답 생성
            const contextualResponse = await this.contextAwareDialogue.generateContextualResponse(
                userId, 
                userQuery, 
                baseResponse
            );
            
            // 3단계: ML 예측 기반 응답 개선
            if (qualityPrediction && qualityPrediction.improvements.length > 0) {
                contextualResponse.text = this.improveResponseWithML(
                    contextualResponse.text, 
                    qualityPrediction.improvements
                );
            }
            
            // 4단계: 통합 이벤트 발생
            this.emit('contextualResponseGenerated', {
                userId,
                query: userQuery,
                response: contextualResponse,
                qualityPrediction,
                timestamp: Date.now()
            });
            
            return contextualResponse;
        } catch (error) {
            console.error('Contextual response generation error:', error);
            throw error;
        }
    }

    /**
     * 통합 개입 시스템
     */
    async triggerIntervention(userId, strategyType = null) {
        try {
            // 1단계: 개입 효과성 예측
            let effectivenessPrediction = null;
            if (strategyType) {
                effectivenessPrediction = await this.mlEngine.predictInterventionEffectiveness(userId, strategyType);
            }
            
            // 2단계: 최적 개입 전략 선택
            const optimalStrategy = this.selectOptimalInterventionStrategy(
                userId, 
                strategyType, 
                effectivenessPrediction
            );
            
            // 3단계: 개입 실행
            await this.behavioralFeedbackLoop.triggerIntervention(userId, optimalStrategy);
            
            // 4단계: 통합 이벤트 발생
            this.emit('interventionTriggered', {
                userId,
                strategy: optimalStrategy,
                effectivenessPrediction,
                timestamp: Date.now()
            });
            
            return optimalStrategy;
        } catch (error) {
            console.error('Intervention trigger error:', error);
            throw error;
        }
    }

    /**
     * 이벤트 핸들러들
     */
    handleStateChange(data) {
        const { userId, state } = data;
        
        // 상태 변화에 따른 자동 개입 평가
        this.evaluateAutomaticIntervention(userId, state);
        
        // ML 학습 데이터 업데이트
        this.mlEngine.updateAdaptiveLearning(userId, {
            type: 'state_change',
            outcome: 'neutral',
            previousState: this.getPreviousUserState(userId)
        });
    }

    handleResponseGenerated(data) {
        const { userId, query, response, context } = data;
        
        // 응답 효과성 분석
        this.analyzeResponseEffectiveness(userId, query, response, context);
        
        // 사용자 피드백 수집 (시뮬레이션)
        this.collectUserFeedback(userId, response);
    }

    handleProactiveIntervention(data) {
        const { userId, intervention } = data;
        
        // 능동적 개입 로깅
        console.log(`🔄 Proactive intervention for user ${userId}: ${intervention.message}`);
        
        // 개입 효과성 추적 시작
        this.trackInterventionEffectiveness(userId, intervention);
    }

    handleInterventionTriggered(data) {
        const { userId, strategyType, intervention } = data;
        
        // 개입 시작 로깅
        console.log(`🎯 Intervention triggered: ${intervention.name} for user ${userId}`);
        
        // 개입 모니터링 시작
        this.startInterventionMonitoring(userId, data);
    }

    handleInterventionCompleted(data) {
        const userId = data.userId;
        const intervention = data.intervention || (data.interventionInstance ? data.interventionInstance.intervention : data.intervention);
        const effectiveness = data.effectiveness || data.effectiveness === 0 ? { overall: data.effectiveness } : (data.effectiveness || data.effectiveness === 0 ? data.effectiveness : (data.effectiveness ?? (data.effectiveness))); // keep compatibility
        const overallEffectiveness = typeof (data.effectiveness && data.effectiveness.overall) === 'number'
            ? data.effectiveness.overall
            : (typeof data.effectiveness === 'number' ? data.effectiveness : (data.effectiveness && typeof data.effectiveness.overall === 'number' ? data.effectiveness.overall : 0));
        
        // 개입 완료 로깅
        const name = intervention && intervention.name ? intervention.name : (data.intervention && data.intervention.name ? data.intervention.name : 'Unknown Intervention');
        console.log(`✅ Intervention completed: ${name} for user ${userId}`);
        
        // ML 학습 데이터 업데이트
        this.mlEngine.updateAdaptiveLearning(userId, {
            type: 'intervention_completed',
            outcome: overallEffectiveness > 0.5 ? 'positive' : 'negative',
            interventionType: (intervention && intervention.type) ? intervention.type : 'unknown'
        });
    }

    handleConsciousnessValidated(data) {
        const { userId, overallConsciousness, phases } = data;
        
        // 의식 검증 결과 로깅
        console.log(`🔬 Consciousness validated for user ${userId}: ${overallConsciousness.toFixed(3)}`);
        
        // 의식 수준에 따른 시스템 조정
        this.adjustSystemBasedOnConsciousness(userId, overallConsciousness, phases);
    }

    handleStatePredicted(data) {
        const { userId, prediction } = data;
        
        // 상태 예측 결과를 활용한 사전 개입
        this.considerPreventiveIntervention(userId, prediction);
    }

    handleInterventionEffectivenessPredicted(data) {
        const { userId, effectiveness } = data;
        
        // 개입 효과성 예측 결과 로깅
        console.log(`📊 Intervention effectiveness predicted for user ${userId}: ${effectiveness.predictedEffectiveness.toFixed(3)}`);
    }

    // 고급 기능 메서드들
    selectOptimalInterventionStrategy(userId, requestedStrategy, effectivenessPrediction) {
        const userState = this.selfModelManager.getCurrentUserState(userId);
        if (!userState) return requestedStrategy || 'stress_management';
        
        // ML 예측 기반 최적 전략 선택
        if (effectivenessPrediction && effectivenessPrediction.predictedEffectiveness > 0.7) {
            return requestedStrategy;
        }
        
        // 사용자 상태 기반 전략 선택
        const stressLevel = userState.physiological.stressLevel || 0.5;
        const energyLevel = userState.physiological.energyLevel || 0.5;
        const attentionLevel = userState.behavioral.attentionLevel;
        
        if (stressLevel > 0.7) return 'stress_management';
        if (energyLevel < 0.3) return 'energy_boost';
        if (attentionLevel === 'distracted') return 'focus_enhancement';
        
        return requestedStrategy || 'stress_management';
    }

    improveResponseWithML(responseText, improvements) {
        let improvedResponse = responseText;
        
        improvements.forEach(improvement => {
            switch (improvement) {
                case 'Strengthen user state relationships':
                    improvedResponse = this.addRelationshipContext(improvedResponse);
                    break;
                case 'Add more empathetic language':
                    improvedResponse = this.addEmpatheticLanguage(improvedResponse);
                    break;
                case 'Simplify response complexity':
                    improvedResponse = this.simplifyResponse(improvedResponse);
                    break;
            }
        });
        
        return improvedResponse;
    }

    addRelationshipContext(response) {
        return `Based on your current state, ${response.toLowerCase()}`;
    }

    addEmpatheticLanguage(response) {
        const empatheticPhrases = [
            "I understand how you're feeling",
            "I can sense that this is important to you",
            "I'm here to support you through this"
        ];
        
        const randomPhrase = empatheticPhrases[Math.floor(Math.random() * empatheticPhrases.length)];
        return `${randomPhrase}. ${response}`;
    }

    simplifyResponse(response) {
        // 복잡한 문장을 단순화
        return response.replace(/\.\s+/g, '. ').replace(/,/g, '');
    }

    evaluateAutomaticIntervention(userId, userState) {
        const stressLevel = userState.physiological.stressLevel || 0.5;
        const energyLevel = userState.physiological.energyLevel || 0.5;
        
        // 자동 개입 임계값
        if (stressLevel > 0.8) {
            this.triggerIntervention(userId, 'stress_management');
        } else if (energyLevel < 0.2) {
            this.triggerIntervention(userId, 'energy_boost');
        }
    }

    analyzeResponseEffectiveness(userId, query, response, context) {
        // 응답 효과성 분석
        const effectiveness = {
            queryLength: query.length,
            responseLength: response.text.length,
            contextUsed: context.relationship !== 'No specific relationship detected',
            suggestionsProvided: response.suggestions.length,
            selfAwareness: response.selfAwareness.confidence
        };
        
        console.log(`📈 Response effectiveness for user ${userId}:`, effectiveness);
        
        // ML 학습 데이터 업데이트
        this.mlEngine.updateAdaptiveLearning(userId, {
            type: 'response_analysis',
            outcome: effectiveness.contextUsed ? 'positive' : 'neutral',
            responseEffectiveness: effectiveness
        });
    }

    collectUserFeedback(userId, response) {
        // 사용자 피드백 수집 (시뮬레이션)
        // 실제 환경에서는 사용자 인터랙션에서 수집
        const simulatedFeedback = this.simulateUserFeedback(response);
        
        this.mlEngine.updateAdaptiveLearning(userId, {
            type: 'user_feedback',
            outcome: simulatedFeedback,
            response: response.text
        });
    }

    simulateUserFeedback(response) {
        // 응답 품질 기반 시뮬레이션된 피드백
        const hasEmpatheticLanguage = response.text.includes('understand') || response.text.includes('sense');
        const hasSuggestions = response.suggestions.length > 0;
        const hasContext = response.context.userState !== 'No state data available';
        
        const qualityScore = (hasEmpatheticLanguage ? 0.3 : 0) + 
                           (hasSuggestions ? 0.3 : 0) + 
                           (hasContext ? 0.4 : 0);
        
        return qualityScore > 0.6 ? 'positive' : qualityScore > 0.3 ? 'neutral' : 'negative';
    }

    trackInterventionEffectiveness(userId, intervention) {
        // 개입 효과성 추적 시작
        setTimeout(() => {
            this.evaluateInterventionOutcome(userId, intervention);
        }, 300000); // 5분 후 평가
    }

    evaluateInterventionOutcome(userId, intervention) {
        const userState = this.selfModelManager.getCurrentUserState(userId);
        if (!userState) return;
        
        // 개입 전후 상태 비교
        const outcome = this.calculateInterventionOutcome(userState, intervention);
        
        this.mlEngine.updateAdaptiveLearning(userId, {
            type: 'intervention_outcome',
            outcome: outcome,
            interventionType: intervention.type
        });
    }

    calculateInterventionOutcome(userState, intervention) {
        // 개입 결과 계산
        const stressLevel = userState.physiological.stressLevel || 0.5;
        const energyLevel = userState.physiological.energyLevel || 0.5;
        
        if (intervention.type === 'breathing_exercise' && stressLevel < 0.6) {
            return 'positive';
        } else if (intervention.type === 'light_exercise' && energyLevel > 0.4) {
            return 'positive';
        }
        
        return 'neutral';
    }

    startInterventionMonitoring(userId, interventionData) {
        // 개입 모니터링 시작
        const monitoringInterval = setInterval(() => {
            const userState = this.selfModelManager.getCurrentUserState(userId);
            if (!userState) {
                clearInterval(monitoringInterval);
                return;
            }
            
            // 개입 진행 상황 모니터링
            this.monitorInterventionProgress(userId, interventionData, userState);
        }, 30000); // 30초마다 모니터링
        
        // 5분 후 모니터링 중지
        setTimeout(() => {
            clearInterval(monitoringInterval);
        }, 300000);
    }

    monitorInterventionProgress(userId, interventionData, userState) {
        // 개입 진행 상황 모니터링
        console.log(`📊 Monitoring intervention progress for user ${userId}: ${interventionData.intervention.name}`);
    }

    adjustSystemBasedOnConsciousness(userId, consciousnessLevel, phases) {
        // 의식 수준에 따른 시스템 조정
        if (consciousnessLevel < 0.4) {
            // 낮은 의식 수준: 더 적극적인 개입
            this.increaseInterventionFrequency(userId);
        } else if (consciousnessLevel > 0.8) {
            // 높은 의식 수준: 개입 빈도 감소
            this.decreaseInterventionFrequency(userId);
        }
    }

    increaseInterventionFrequency(userId) {
        // 개입 빈도 증가
        console.log(`🔄 Increasing intervention frequency for user ${userId}`);
    }

    decreaseInterventionFrequency(userId) {
        // 개입 빈도 감소
        console.log(`🔄 Decreasing intervention frequency for user ${userId}`);
    }

    considerPreventiveIntervention(userId, prediction) {
        // 예방적 개입 고려
        if (prediction.predictedStress > 0.8) {
            this.triggerIntervention(userId, 'stress_management');
        } else if (prediction.predictedEnergy < 0.2) {
            this.triggerIntervention(userId, 'energy_boost');
        }
    }

    getPreviousUserState(userId) {
        // 이전 사용자 상태 조회 (구현 필요)
        return null;
    }

    monitorSystemHealth() {
        // 시스템 상태 모니터링
        const health = {
            selfModel: this.selfModelManager.getStats(),
            dialogue: this.contextAwareDialogue.getStats(),
            feedbackLoop: this.behavioralFeedbackLoop.getStats(),
            validator: this.consciousnessValidator.getValidationStats(),
            mlEngine: this.mlEngine.getMLStats()
        };
        
        this.emit('systemHealthMonitored', health);
    }

    generateConsciousnessReport() {
        // 종합 의식 보고서 생성
        const report = this.consciousnessValidator.generateConsciousnessReport();
        
        this.emit('consciousnessReportGenerated', report);
        
        console.log('📊 Consciousness Report Generated:', {
            averageConsciousness: report.summary.averageConsciousness,
            consciousnessLevel: report.summary.consciousnessLevel,
            totalUsers: report.summary.totalUsers
        });
    }

    /**
     * 시스템 통계 조회
     */
    getSystemStats() {
        return {
            selfModel: this.selfModelManager.getStats(),
            dialogue: this.contextAwareDialogue.getStats(),
            feedbackLoop: this.behavioralFeedbackLoop.getStats(),
            validator: this.consciousnessValidator.getValidationStats(),
            mlEngine: this.mlEngine.getMLStats(),
            timestamp: Date.now()
        };
    }

    /**
     * 사용자별 의식 점수 조회
     */
    getUserConsciousnessScore(userId) {
        return this.consciousnessValidator.getUserConsciousnessScore(userId);
    }

    /**
     * 시스템 종료
     */
    shutdown() {
        console.log('🔄 Shutting down Advanced Consciousness System...');
        
        // 모든 이벤트 리스너 제거
        this.removeAllListeners();
        
        console.log('✅ Advanced Consciousness System shutdown complete');
    }
}

module.exports = AdvancedConsciousnessSystem;
