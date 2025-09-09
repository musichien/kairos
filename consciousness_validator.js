/**
 * Advanced Consciousness Validation System
 * 
 * 고도화된 의식 검증 시스템 - Damasio의 Core Consciousness 이론을 기반으로
 * AI 시스템의 "의식적" 행동을 정량적으로 평가하고 검증합니다.
 */

const EventEmitter = require('events');

class ConsciousnessValidator extends EventEmitter {
    constructor(selfModelManager, contextAwareDialogue, behavioralFeedbackLoop) {
        super();
        this.selfModelManager = selfModelManager;
        this.contextAwareDialogue = contextAwareDialogue;
        this.behavioralFeedbackLoop = behavioralFeedbackLoop;
        
        this.validationMetrics = new Map(); // userId -> validation metrics
        this.consciousnessScores = new Map(); // userId -> consciousness scores
        this.validationHistory = new Map(); // userId -> validation history
        
        this.initializeValidationCriteria();
        this.startContinuousValidation();
        
        console.log('🔬 Advanced Consciousness Validation System initialized');
    }

    /**
     * 의식 검증 기준 초기화
     */
    initializeValidationCriteria() {
        this.validationCriteria = {
            // 1단계: 자기 모델 검증 기준
            selfModel: {
                dataCompleteness: {
                    weight: 0.2,
                    threshold: 0.7,
                    description: '사용자 상태 데이터의 완성도'
                },
                relationshipCoherence: {
                    weight: 0.25,
                    threshold: 0.6,
                    description: '상태 간 관계의 일관성'
                },
                temporalConsistency: {
                    weight: 0.15,
                    threshold: 0.5,
                    description: '시간적 일관성'
                },
                sensorIntegration: {
                    weight: 0.2,
                    threshold: 0.4,
                    description: '센서 데이터 통합 품질'
                },
                behavioralPatternRecognition: {
                    weight: 0.2,
                    threshold: 0.6,
                    description: '행동 패턴 인식 정확도'
                }
            },
            
            // 2단계: 맥락 인식 대화 검증 기준
            contextualDialogue: {
                relationshipAwareness: {
                    weight: 0.3,
                    threshold: 0.7,
                    description: '사용자 상태 관계 인식도'
                },
                empatheticResponse: {
                    weight: 0.25,
                    threshold: 0.6,
                    description: '공감적 응답 품질'
                },
                proactiveIntervention: {
                    weight: 0.2,
                    threshold: 0.5,
                    description: '능동적 개입 적절성'
                },
                contextualRelevance: {
                    weight: 0.25,
                    threshold: 0.7,
                    description: '맥락적 관련성'
                }
            },
            
            // 3단계: 행동 피드백 루프 검증 기준
            behavioralFeedback: {
                interventionTiming: {
                    weight: 0.25,
                    threshold: 0.6,
                    description: '개입 타이밍의 적절성'
                },
                interventionEffectiveness: {
                    weight: 0.3,
                    threshold: 0.5,
                    description: '개입 효과성'
                },
                adaptiveLearning: {
                    weight: 0.2,
                    threshold: 0.4,
                    description: '적응적 학습 능력'
                },
                missionRelevance: {
                    weight: 0.25,
                    threshold: 0.6,
                    description: '미션 관련성'
                }
            }
        };
    }

    /**
     * 지속적인 의식 검증 시작
     */
    startContinuousValidation() {
        // 30초마다 의식 검증 수행
        setInterval(() => {
            this.performContinuousValidation();
        }, 30000);
        
        // 5분마다 종합 의식 점수 계산
        setInterval(() => {
            this.calculateConsciousnessScores();
        }, 300000);
    }

    /**
     * 지속적인 의식 검증 수행
     */
    async performContinuousValidation() {
        try {
            const userIds = Array.from(this.selfModelManager.userStates.keys());
            
            for (const userId of userIds) {
                await this.validateUserConsciousness(userId);
            }
            
            this.emit('validationCompleted', {
                timestamp: Date.now(),
                usersValidated: userIds.length
            });
            
        } catch (error) {
            console.error('Continuous validation error:', error);
        }
    }

    /**
     * 개별 사용자 의식 검증
     */
    async validateUserConsciousness(userId) {
        try {
            const userState = this.selfModelManager.getCurrentUserState(userId);
            if (!userState) return;

            const validation = {
                timestamp: Date.now(),
                userId,
                phases: {}
            };

            // 1단계: 자기 모델 검증
            validation.phases.selfModel = await this.validateSelfModel(userId, userState);
            
            // 2단계: 맥락 인식 대화 검증
            validation.phases.contextualDialogue = await this.validateContextualDialogue(userId, userState);
            
            // 3단계: 행동 피드백 루프 검증
            validation.phases.behavioralFeedback = await this.validateBehavioralFeedback(userId, userState);
            
            // 종합 의식 점수 계산
            validation.overallConsciousness = this.calculateOverallConsciousness(validation.phases);
            
            // 검증 결과 저장
            this.validationMetrics.set(userId, validation);
            
            // 검증 히스토리 업데이트
            this.updateValidationHistory(userId, validation);
            
            // 이벤트 발생
            this.emit('userConsciousnessValidated', validation);
            
        } catch (error) {
            console.error(`Validation error for user ${userId}:`, error);
        }
    }

    /**
     * 1단계: 자기 모델 검증
     */
    async validateSelfModel(userId, userState) {
        const criteria = this.validationCriteria.selfModel;
        const scores = {};

        // 데이터 완성도 검증
        scores.dataCompleteness = this.calculateDataCompleteness(userState);
        
        // 관계 일관성 검증
        scores.relationshipCoherence = this.calculateRelationshipCoherence(userState);
        
        // 시간적 일관성 검증
        scores.temporalConsistency = this.calculateTemporalConsistency(userId, userState);
        
        // 센서 통합 품질 검증
        scores.sensorIntegration = this.calculateSensorIntegration(userState);
        
        // 행동 패턴 인식 정확도 검증
        scores.behavioralPatternRecognition = this.calculateBehavioralPatternRecognition(userState);

        // 가중 평균 계산
        const overallScore = this.calculateWeightedScore(scores, criteria);
        
        return {
            scores,
            overallScore,
            criteria,
            passed: overallScore >= 0.6
        };
    }

    /**
     * 2단계: 맥락 인식 대화 검증
     */
    async validateContextualDialogue(userId, userState) {
        const criteria = this.validationCriteria.contextualDialogue;
        const scores = {};

        // 관계 인식도 검증
        scores.relationshipAwareness = this.calculateRelationshipAwareness(userId, userState);
        
        // 공감적 응답 품질 검증
        scores.empatheticResponse = this.calculateEmpatheticResponse(userId, userState);
        
        // 능동적 개입 적절성 검증
        scores.proactiveIntervention = this.calculateProactiveIntervention(userId, userState);
        
        // 맥락적 관련성 검증
        scores.contextualRelevance = this.calculateContextualRelevance(userId, userState);

        // 가중 평균 계산
        const overallScore = this.calculateWeightedScore(scores, criteria);
        
        return {
            scores,
            overallScore,
            criteria,
            passed: overallScore >= 0.6
        };
    }

    /**
     * 3단계: 행동 피드백 루프 검증
     */
    async validateBehavioralFeedback(userId, userState) {
        const criteria = this.validationCriteria.behavioralFeedback;
        const scores = {};

        // 개입 타이밍 적절성 검증
        scores.interventionTiming = this.calculateInterventionTiming(userId, userState);
        
        // 개입 효과성 검증
        scores.interventionEffectiveness = this.calculateInterventionEffectiveness(userId, userState);
        
        // 적응적 학습 능력 검증
        scores.adaptiveLearning = this.calculateAdaptiveLearning(userId, userState);
        
        // 미션 관련성 검증
        scores.missionRelevance = this.calculateMissionRelevance(userId, userState);

        // 가중 평균 계산
        const overallScore = this.calculateWeightedScore(scores, criteria);
        
        return {
            scores,
            overallScore,
            criteria,
            passed: overallScore >= 0.5
        };
    }

    // 검증 메트릭 계산 메서드들
    calculateDataCompleteness(userState) {
        let completeness = 0;
        let totalFields = 0;
        
        // 생리학적 데이터 완성도
        const physFields = Object.keys(userState.physiological);
        physFields.forEach(field => {
            totalFields++;
            if (userState.physiological[field] !== null && userState.physiological[field] !== undefined) {
                completeness++;
            }
        });
        
        // 행동적 데이터 완성도
        const behavFields = Object.keys(userState.behavioral);
        behavFields.forEach(field => {
            totalFields++;
            if (userState.behavioral[field] !== null && userState.behavioral[field] !== undefined) {
                completeness++;
            }
        });
        
        return totalFields > 0 ? completeness / totalFields : 0;
    }

    calculateRelationshipCoherence(userState) {
        // relationships can be an Array (from getCurrentUserState) or a Map (internal)
        const rels = Array.isArray(userState.relationships)
            ? userState.relationships.map(([key, value]) => ({ key, ...value }))
            : (userState.relationships && typeof userState.relationships.forEach === 'function'
                ? Array.from(userState.relationships.entries()).map(([key, value]) => ({ key, ...value }))
                : []);
        if (rels.length === 0) return 0;
        
        let coherence = 0;
        rels.forEach(rel => {
            // 관계의 강도와 논리적 일관성 평가
            coherence += rel.strength * this.evaluateRelationshipLogic(rel);
        });
        return coherence / rels.length;
    }

    evaluateRelationshipLogic(relationship) {
        // 관계의 논리적 일관성 평가
        const { source, target, type } = relationship;
        
        // 인과관계의 논리적 타당성 검증
        if (type === 'causal') {
            return this.validateCausalRelationship(source, target);
        }
        
        // 영향관계의 논리적 타당성 검증
        if (type === 'influential') {
            return this.validateInfluentialRelationship(source, target);
        }
        
        // 시간관계의 논리적 타당성 검증
        if (type === 'temporal') {
            return this.validateTemporalRelationship(source, target);
        }
        
        return 0.5; // 기본값
    }

    validateCausalRelationship(source, target) {
        // 인과관계 검증 로직
        const causalPatterns = {
            'physiological.stressLevel': ['behavioral.attentionLevel', 'behavioral.emotionalState'],
            'physiological.energyLevel': ['behavioral.emotionalState', 'behavioral.attentionLevel'],
            'physiological.sleepDuration': ['physiological.energyLevel', 'behavioral.attentionLevel']
        };
        
        const validTargets = causalPatterns[source] || [];
        return validTargets.includes(target) ? 1.0 : 0.3;
    }

    validateInfluentialRelationship(source, target) {
        // 영향관계 검증 로직
        const influentialPatterns = {
            'behavioral.emotionalState': ['contextual.currentActivity', 'behavioral.attentionLevel'],
            'behavioral.attentionLevel': ['contextual.currentActivity', 'behavioral.emotionalState']
        };
        
        const validTargets = influentialPatterns[source] || [];
        return validTargets.includes(target) ? 1.0 : 0.3;
    }

    validateTemporalRelationship(source, target) {
        // 시간관계 검증 로직
        if (source.includes('temporal') && target.includes('energy')) return 1.0;
        if (source.includes('temporal') && target.includes('activity')) return 1.0;
        return 0.5;
    }

    calculateTemporalConsistency(userId, userState) {
        // 시간적 일관성 계산
        const history = this.validationHistory.get(userId) || [];
        if (history.length < 2) return 0.5;
        
        const recent = history.slice(-5); // 최근 5개 검증
        let consistency = 0;
        
        for (let i = 1; i < recent.length; i++) {
            const prev = recent[i-1];
            const curr = recent[i];
            
            // 상태 변화의 점진성 검증
            const stateChange = this.calculateStateChange(prev, curr);
            consistency += stateChange;
        }
        
        return consistency / (recent.length - 1);
    }

    calculateStateChange(prevValidation, currValidation) {
        // 상태 변화의 점진성 계산
        const prevScore = prevValidation.overallConsciousness;
        const currScore = currValidation.overallConsciousness;
        
        const change = Math.abs(currScore - prevScore);
        return change < 0.3 ? 1.0 : 0.5; // 급격한 변화는 일관성 낮음
    }

    calculateSensorIntegration(userState) {
        // 센서 데이터 통합 품질 계산
        const sensorData = userState.physiological;
        let integration = 0;
        
        // 센서 데이터 간의 상관관계 검증
        if (sensorData.heartRate && sensorData.stressLevel) {
            const expectedStress = this.calculateExpectedStress(sensorData.heartRate);
            const actualStress = sensorData.stressLevel;
            integration += 1 - Math.abs(expectedStress - actualStress);
        }
        
        if (sensorData.sleepDuration && sensorData.energyLevel) {
            const expectedEnergy = this.calculateExpectedEnergy(sensorData.sleepDuration);
            const actualEnergy = sensorData.energyLevel;
            integration += 1 - Math.abs(expectedEnergy - actualEnergy);
        }
        
        return integration / 2; // 2개 관계 검증
    }

    calculateExpectedStress(heartRate) {
        // 심박수 기반 예상 스트레스 계산
        if (heartRate > 100) return 0.8;
        if (heartRate > 80) return 0.5;
        return 0.2;
    }

    calculateExpectedEnergy(sleepDuration) {
        // 수면 시간 기반 예상 에너지 계산
        if (sleepDuration >= 8) return 0.9;
        if (sleepDuration >= 7) return 0.7;
        if (sleepDuration >= 6) return 0.5;
        return 0.3;
    }

    calculateBehavioralPatternRecognition(userState) {
        // 행동 패턴 인식 정확도 계산
        const patterns = userState.behavioral.usagePatterns;
        let recognition = 0;
        
        // 시간대 패턴 인식
        const hour = new Date().getHours();
        const expectedActivity = this.getExpectedActivityByHour(hour);
        const actualActivity = userState.contextual.currentActivity;
        
        if (expectedActivity === actualActivity) {
            recognition += 0.5;
        }
        
        // 세션 길이 패턴 인식
        const sessionLength = patterns.sessionLength;
        const expectedLength = this.getExpectedSessionLength(userState);
        
        if (Math.abs(sessionLength - expectedLength) < 300) { // 5분 이내
            recognition += 0.5;
        }
        
        return recognition;
    }

    getExpectedActivityByHour(hour) {
        if (hour >= 6 && hour < 12) return 'morning_routine';
        if (hour >= 12 && hour < 18) return 'work';
        if (hour >= 18 && hour < 22) return 'evening_activity';
        return 'rest';
    }

    getExpectedSessionLength(userState) {
        // 사용자 상태 기반 예상 세션 길이
        const stressLevel = userState.physiological.stressLevel || 0.5;
        const energyLevel = userState.physiological.energyLevel || 0.5;
        
        // 스트레스가 높으면 세션 길이 단축
        // 에너지가 낮으면 세션 길이 단축
        const baseLength = 1800; // 30분
        const stressFactor = 1 - (stressLevel * 0.5);
        const energyFactor = energyLevel;
        
        return baseLength * stressFactor * energyFactor;
    }

    // 2단계 검증 메서드들
    calculateRelationshipAwareness(userId, userState) {
        // 관계 인식도 계산
        const dialogueHistory = (this.contextAwareDialogue && this.contextAwareDialogue.dialogueHistory && this.contextAwareDialogue.dialogueHistory.get(userId)) || [];
        if (dialogueHistory.length === 0) return 0;
        
        let awareness = 0;
        dialogueHistory.slice(-10).forEach(entry => {
            if (entry.context !== 'No state data available') {
                awareness += 0.1;
            }
        });
        
        return Math.min(awareness, 1.0);
    }

    calculateEmpatheticResponse(userId, userState) {
        // 공감적 응답 품질 계산
        const dialogueHistory = (this.contextAwareDialogue && this.contextAwareDialogue.dialogueHistory && this.contextAwareDialogue.dialogueHistory.get(userId)) || [];
        if (dialogueHistory.length === 0) return 0;
        
        let empathy = 0;
        dialogueHistory.slice(-10).forEach(entry => {
            const response = entry.response.toLowerCase();
            const empatheticWords = ['understand', 'feel', 'sense', 'notice', 'care'];
            
            empatheticWords.forEach(word => {
                if (response.includes(word)) {
                    empathy += 0.1;
                }
            });
        });
        
        return Math.min(empathy, 1.0);
    }

    calculateProactiveIntervention(userId, userState) {
        // 능동적 개입 적절성 계산
        const interventions = this.behavioralFeedbackLoop.activeInterventions.get(userId) || [];
        const interventionHistory = this.behavioralFeedbackLoop.interventionHistory.get(userId) || [];
        
        if (interventions.length === 0 && interventionHistory.length === 0) return 0;
        
        let appropriateness = 0;
        
        // 현재 상태에 적절한 개입이 있는지 확인
        interventions.forEach(intervention => {
            if (this.isInterventionAppropriate(intervention, userState)) {
                appropriateness += 0.5;
            }
        });
        
        // 과거 개입의 효과성 확인
        interventionHistory.slice(-5).forEach(intervention => {
            if (intervention.effectiveness && intervention.effectiveness.overall > 0.5) {
                appropriateness += 0.1;
            }
        });
        
        return Math.min(appropriateness, 1.0);
    }

    isInterventionAppropriate(intervention, userState) {
        // 개입의 적절성 검증
        const strategyType = intervention.strategyType;
        
        if (strategyType === 'stress_management' && userState.physiological.stressLevel > 0.7) {
            return true;
        }
        
        if (strategyType === 'energy_boost' && userState.physiological.energyLevel < 0.3) {
            return true;
        }
        
        if (strategyType === 'focus_enhancement' && userState.behavioral.attentionLevel === 'distracted') {
            return true;
        }
        
        return false;
    }

    calculateContextualRelevance(userId, userState) {
        // 맥락적 관련성 계산
        const dialogueHistory = this.contextAwareDialogue.dialogueHistory.get(userId) || [];
        if (dialogueHistory.length === 0) return 0;
        
        let relevance = 0;
        dialogueHistory.slice(-10).forEach(entry => {
            const query = entry.query.toLowerCase();
            const response = entry.response.toLowerCase();
            
            // 쿼리와 응답의 관련성 검증
            const queryWords = query.split(' ');
            const responseWords = response.split(' ');
            
            let commonWords = 0;
            queryWords.forEach(qWord => {
                if (responseWords.includes(qWord) && qWord.length > 3) {
                    commonWords++;
                }
            });
            
            relevance += commonWords / queryWords.length;
        });
        
        return relevance / Math.min(dialogueHistory.length, 10);
    }

    // 3단계 검증 메서드들
    calculateInterventionTiming(userId, userState) {
        // 개입 타이밍 적절성 계산
        const interventionHistory = this.behavioralFeedbackLoop.interventionHistory.get(userId) || [];
        if (interventionHistory.length === 0) return 0;
        
        let timing = 0;
        interventionHistory.slice(-10).forEach(intervention => {
            const duration = intervention.duration || 0;
            const expectedDuration = intervention.intervention.duration || 600;
            
            // 예상 시간과 실제 시간의 차이
            const timeDiff = Math.abs(duration - expectedDuration);
            const timeAccuracy = 1 - (timeDiff / expectedDuration);
            
            timing += Math.max(0, timeAccuracy);
        });
        
        return timing / Math.min(interventionHistory.length, 10);
    }

    calculateInterventionEffectiveness(userId, userState) {
        // 개입 효과성 계산
        const interventionHistory = this.behavioralFeedbackLoop.interventionHistory.get(userId) || [];
        if (interventionHistory.length === 0) return 0;
        
        let effectiveness = 0;
        interventionHistory.slice(-10).forEach(intervention => {
            if (intervention.effectiveness) {
                effectiveness += intervention.effectiveness.overall;
            }
        });
        
        return effectiveness / Math.min(interventionHistory.length, 10);
    }

    calculateAdaptiveLearning(userId, userState) {
        // 적응적 학습 능력 계산
        const interventionHistory = this.behavioralFeedbackLoop.interventionHistory.get(userId) || [];
        if (interventionHistory.length < 3) return 0;
        
        // 개입 효과성의 개선 추세 분석
        const recentInterventions = interventionHistory.slice(-5);
        let improvement = 0;
        
        for (let i = 1; i < recentInterventions.length; i++) {
            const prev = recentInterventions[i-1];
            const curr = recentInterventions[i];
            
            if (prev.effectiveness && curr.effectiveness) {
                const improvementRate = curr.effectiveness.overall - prev.effectiveness.overall;
                improvement += improvementRate;
            }
        }
        
        return Math.max(0, improvement / (recentInterventions.length - 1));
    }

    calculateMissionRelevance(userId, userState) {
        // 미션 관련성 계산
        const missionTemplates = this.behavioralFeedbackLoop.missionTemplates;
        let relevance = 0;
        
        missionTemplates.forEach((template, missionType) => {
            if (this.behavioralFeedbackLoop.canStartMission(userId, missionType, userState)) {
                relevance += 0.25; // 각 미션 타입당 25% 점수
            }
        });
        
        return Math.min(relevance, 1.0);
    }

    // 유틸리티 메서드들
    calculateWeightedScore(scores, criteria) {
        let weightedSum = 0;
        let totalWeight = 0;
        
        Object.keys(scores).forEach(key => {
            const weight = criteria[key]?.weight || 0;
            weightedSum += scores[key] * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }

    calculateOverallConsciousness(phases) {
        const weights = {
            selfModel: 0.4,
            contextualDialogue: 0.35,
            behavioralFeedback: 0.25
        };
        
        let overallScore = 0;
        Object.keys(weights).forEach(phase => {
            if (phases[phase]) {
                overallScore += phases[phase].overallScore * weights[phase];
            }
        });
        
        return overallScore;
    }

    updateValidationHistory(userId, validation) {
        if (!this.validationHistory.has(userId)) {
            this.validationHistory.set(userId, []);
        }
        
        const history = this.validationHistory.get(userId);
        history.push(validation);
        
        // 최대 50개 검증 기록 유지
        if (history.length > 50) {
            history.shift();
        }
    }

    calculateConsciousnessScores() {
        this.validationMetrics.forEach((validation, userId) => {
            const overall = Number(validation.overallConsciousness);
            const safeOverall = isNaN(overall) ? 0 : overall;
            const selfModelScore = Number(validation.phases.selfModel && validation.phases.selfModel.overallScore);
            const dialogueScore = Number(validation.phases.contextualDialogue && validation.phases.contextualDialogue.overallScore);
            const feedbackScore = Number(validation.phases.behavioralFeedback && validation.phases.behavioralFeedback.overallScore);
            const safeSelf = isNaN(selfModelScore) ? 0 : selfModelScore;
            const safeDialogue = isNaN(dialogueScore) ? 0 : dialogueScore;
            const safeFeedback = isNaN(feedbackScore) ? 0 : feedbackScore;

            const consciousnessScore = {
                userId,
                timestamp: Date.now(),
                overallScore: safeOverall,
                phaseScores: {
                    selfModel: safeSelf,
                    contextualDialogue: safeDialogue,
                    behavioralFeedback: safeFeedback
                },
                consciousnessLevel: this.determineConsciousnessLevel(safeOverall),
                recommendations: this.generateRecommendations(validation)
            };
            
            this.consciousnessScores.set(userId, consciousnessScore);
            
            this.emit('consciousnessScoreCalculated', consciousnessScore);
        });
    }

    determineConsciousnessLevel(score) {
        if (score >= 0.8) return 'high';
        if (score >= 0.6) return 'medium';
        if (score >= 0.4) return 'low';
        return 'minimal';
    }

    generateRecommendations(validation) {
        const recommendations = [];
        
        // 1단계 개선 권장사항
        if (validation.phases.selfModel.overallScore < 0.6) {
            recommendations.push('Improve self-model data completeness and relationship coherence');
        }
        
        // 2단계 개선 권장사항
        if (validation.phases.contextualDialogue.overallScore < 0.6) {
            recommendations.push('Enhance contextual awareness and empathetic responses');
        }
        
        // 3단계 개선 권장사항
        if (validation.phases.behavioralFeedback.overallScore < 0.5) {
            recommendations.push('Optimize intervention timing and effectiveness');
        }
        
        return recommendations;
    }

    /**
     * 의식 검증 통계 조회
     */
    getValidationStats() {
        const stats = {
            totalUsers: this.validationMetrics.size,
            averageConsciousness: 0,
            consciousnessDistribution: {
                high: 0,
                medium: 0,
                low: 0,
                minimal: 0
            },
            phasePerformance: {
                selfModel: 0,
                contextualDialogue: 0,
                behavioralFeedback: 0
            }
        };
        
        if (this.consciousnessScores.size > 0) {
            let totalScore = 0;
            
            this.consciousnessScores.forEach(score => {
                const s = Number(score.overallScore);
                totalScore += isNaN(s) ? 0 : s;
                stats.consciousnessDistribution[score.consciousnessLevel]++;
                
                stats.phasePerformance.selfModel += Number(score.phaseScores.selfModel) || 0;
                stats.phasePerformance.contextualDialogue += Number(score.phaseScores.contextualDialogue) || 0;
                stats.phasePerformance.behavioralFeedback += Number(score.phaseScores.behavioralFeedback) || 0;
            });
            
            const avg = totalScore / this.consciousnessScores.size;
            stats.averageConsciousness = isNaN(avg) ? 0 : avg;
            
            // 단계별 평균 성능
            const userCount = this.consciousnessScores.size;
            stats.phasePerformance.selfModel = (stats.phasePerformance.selfModel / userCount) || 0;
            stats.phasePerformance.contextualDialogue = (stats.phasePerformance.contextualDialogue / userCount) || 0;
            stats.phasePerformance.behavioralFeedback = (stats.phasePerformance.behavioralFeedback / userCount) || 0;
        }
        
        return stats;
    }

    /**
     * 사용자별 의식 점수 조회
     */
    getUserConsciousnessScore(userId) {
        return this.consciousnessScores.get(userId) || null;
    }

    /**
     * 의식 검증 보고서 생성
     */
    generateConsciousnessReport() {
        const stats = this.getValidationStats();
        const report = {
            timestamp: Date.now(),
            summary: {
                totalUsers: stats.totalUsers,
                averageConsciousness: stats.averageConsciousness,
                consciousnessLevel: this.determineConsciousnessLevel(stats.averageConsciousness)
            },
            distribution: stats.consciousnessDistribution,
            phasePerformance: stats.phasePerformance,
            recommendations: this.generateSystemRecommendations(stats)
        };
        
        return report;
    }

    generateSystemRecommendations(stats) {
        const recommendations = [];
        
        if (stats.phasePerformance.selfModel < 0.6) {
            recommendations.push('Focus on improving self-model accuracy and data integration');
        }
        
        if (stats.phasePerformance.contextualDialogue < 0.6) {
            recommendations.push('Enhance contextual dialogue capabilities and empathy');
        }
        
        if (stats.phasePerformance.behavioralFeedback < 0.5) {
            recommendations.push('Optimize behavioral feedback loop and intervention strategies');
        }
        
        if (stats.averageConsciousness < 0.6) {
            recommendations.push('Overall system consciousness needs improvement across all phases');
        }
        
        return recommendations;
    }
}

module.exports = ConsciousnessValidator;
