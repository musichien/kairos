/**
 * Neural Relationship Mapper - 신경망 기반 관계 매핑 시스템
 * 
 * Damasio의 Core Consciousness 이론에 기반한 고급 신경망 시뮬레이션
 * 객체-관계 매핑과 의식적 관계 형성을 모방
 */

const EventEmitter = require('events');

class NeuralRelationshipMapper extends EventEmitter {
    constructor() {
        super();
        
        // 신경망 구조 시뮬레이션
        this.neuralNetwork = {
            // 입력층 (감각 데이터)
            inputLayer: {
                sensory: new Map(), // 감각 입력
                proprioceptive: new Map(), // 체성감각
                interoceptive: new Map(), // 내장감각
                exteroceptive: new Map() // 외부감각
            },
            
            // 은닉층 (처리 및 통합)
            hiddenLayers: {
                primary: new Map(), // 1차 처리
                secondary: new Map(), // 2차 처리
                association: new Map(), // 연합 처리
                integration: new Map() // 통합 처리
            },
            
            // 출력층 (의식적 표현)
            outputLayer: {
                selfRepresentation: new Map(), // 자기 표현
                objectRepresentation: new Map(), // 객체 표현
                relationshipRepresentation: new Map(), // 관계 표현
                consciousnessOutput: new Map() // 의식 출력
            }
        };
        
        // 신경 연결 가중치
        this.connectionWeights = new Map();
        
        // 활성화 함수들
        this.activationFunctions = {
            sigmoid: (x) => 1 / (1 + Math.exp(-x)),
            tanh: (x) => Math.tanh(x),
            relu: (x) => Math.max(0, x),
            softmax: (x) => Math.exp(x) / Math.exp(x).reduce((a, b) => a + b, 0)
        };
        
        // 학습 파라미터
        this.learningParams = {
            learningRate: 0.01,
            momentum: 0.9,
            decay: 0.001,
            plasticity: 0.1
        };
        
        // 관계 메모리
        this.relationshipMemory = new Map();
        
        // 의식적 경험 저장소
        this.consciousnessExperiences = new Map();
        
        console.log('🧠 Neural Relationship Mapper initialized');
    }
    
    /**
     * 객체-관계 매핑 처리 (핵심 메커니즘)
     */
    async processObjectRelationshipMapping(userId, userState, externalObject) {
        try {
            // 1. 입력 데이터 전처리
            const inputData = await this.preprocessInputData(userState, externalObject);
            
            // 2. 신경망 활성화
            const neuralActivation = await this.activateNeuralNetwork(inputData);
            
            // 3. 관계 형성
            const relationship = await this.formRelationship(neuralActivation, userState, externalObject);
            
            // 4. 의식적 경험 생성
            const consciousExperience = await this.generateConsciousExperience(relationship);
            
            // 5. 학습 및 적응
            await this.adaptNeuralNetwork(consciousExperience);
            
            // 6. 메모리 저장
            this.storeRelationshipMemory(userId, relationship, consciousExperience);
            
            // 7. 이벤트 발생
            this.emit('relationshipFormed', {
                userId,
                relationship,
                consciousExperience,
                timestamp: Date.now()
            });
            
            return {
                relationship,
                consciousExperience,
                neuralActivation
            };
        } catch (error) {
            console.error('Object-relationship mapping error:', error);
            throw error;
        }
    }
    
    /**
     * 입력 데이터 전처리
     */
    async preprocessInputData(userState, externalObject) {
        const inputData = {
            // 감각 입력
            sensory: {
                visual: this.extractVisualFeatures(externalObject),
                auditory: this.extractAuditoryFeatures(externalObject),
                tactile: this.extractTactileFeatures(externalObject),
                olfactory: this.extractOlfactoryFeatures(externalObject),
                gustatory: this.extractGustatoryFeatures(externalObject)
            },
            
            // 체성감각 (신체 위치, 움직임)
            proprioceptive: {
                bodyPosition: userState.physiological?.biological?.parameters || {},
                movement: this.extractMovementFeatures(userState),
                posture: this.extractPostureFeatures(userState)
            },
            
            // 내장감각 (내부 상태)
            interoceptive: {
                heartRate: userState.physiological?.heartRate || 0.5,
                stressLevel: userState.physiological?.stressLevel || 0.5,
                energyLevel: userState.physiological?.energyLevel || 0.5,
                hunger: userState.physiological?.hunger || 0.5,
                thirst: userState.physiological?.thirst || 0.5,
                pain: userState.physiological?.painLevel || 0,
                temperature: 0.5, // 기본값
                breathing: 0.5 // 기본값
            },
            
            // 외부감각 (환경 정보)
            exteroceptive: {
                environment: externalObject.environment || {},
                context: externalObject.context || {},
                social: externalObject.social || {},
                temporal: externalObject.temporal || {}
            }
        };
        
        return inputData;
    }
    
    /**
     * 시각적 특징 추출
     */
    extractVisualFeatures(externalObject) {
        return {
            brightness: externalObject.visual?.brightness || 0.5,
            color: externalObject.visual?.color || { r: 0.5, g: 0.5, b: 0.5 },
            shape: externalObject.visual?.shape || 'unknown',
            size: externalObject.visual?.size || 0.5,
            movement: externalObject.visual?.movement || 0,
            complexity: externalObject.visual?.complexity || 0.5
        };
    }
    
    /**
     * 청각적 특징 추출
     */
    extractAuditoryFeatures(externalObject) {
        return {
            volume: externalObject.auditory?.volume || 0.5,
            pitch: externalObject.auditory?.pitch || 0.5,
            rhythm: externalObject.auditory?.rhythm || 0,
            timbre: externalObject.auditory?.timbre || 0.5,
            direction: externalObject.auditory?.direction || 0.5,
            clarity: externalObject.auditory?.clarity || 0.5
        };
    }
    
    /**
     * 촉각적 특징 추출
     */
    extractTactileFeatures(externalObject) {
        return {
            texture: externalObject.tactile?.texture || 0.5,
            temperature: externalObject.tactile?.temperature || 0.5,
            pressure: externalObject.tactile?.pressure || 0.5,
            vibration: externalObject.tactile?.vibration || 0,
            moisture: externalObject.tactile?.moisture || 0.5
        };
    }
    
    /**
     * 후각적 특징 추출
     */
    extractOlfactoryFeatures(externalObject) {
        return {
            intensity: externalObject.olfactory?.intensity || 0,
            pleasantness: externalObject.olfactory?.pleasantness || 0.5,
            familiarity: externalObject.olfactory?.familiarity || 0.5,
            complexity: externalObject.olfactory?.complexity || 0.5
        };
    }
    
    /**
     * 미각적 특징 추출
     */
    extractGustatoryFeatures(externalObject) {
        return {
            sweetness: externalObject.gustatory?.sweetness || 0,
            sourness: externalObject.gustatory?.sourness || 0,
            saltiness: externalObject.gustatory?.saltiness || 0,
            bitterness: externalObject.gustatory?.bitterness || 0,
            umami: externalObject.gustatory?.umami || 0
        };
    }
    
    /**
     * 움직임 특징 추출
     */
    extractMovementFeatures(userState) {
        return {
            speed: userState.behavioral?.patterns?.activityLevel === 'high' ? 0.8 : 
                   userState.behavioral?.patterns?.activityLevel === 'low' ? 0.2 : 0.5,
            direction: 0.5, // 기본값
            acceleration: 0.5, // 기본값
            coordination: userState.behavioral?.patterns?.focusDuration || 0.5
        };
    }
    
    /**
     * 자세 특징 추출
     */
    extractPostureFeatures(userState) {
        return {
            stability: 1 - (userState.physiological?.stressLevel || 0.5),
            alignment: 0.7, // 기본값
            tension: userState.physiological?.stressLevel || 0.5,
            relaxation: 1 - (userState.physiological?.stressLevel || 0.5)
        };
    }
    
    /**
     * 신경망 활성화
     */
    async activateNeuralNetwork(inputData) {
        const activation = {
            inputLayer: {},
            hiddenLayers: {},
            outputLayer: {}
        };
        
        // 입력층 활성화
        activation.inputLayer = await this.activateInputLayer(inputData);
        
        // 은닉층 활성화
        activation.hiddenLayers = await this.activateHiddenLayers(activation.inputLayer);
        
        // 출력층 활성화
        activation.outputLayer = await this.activateOutputLayer(activation.hiddenLayers);
        
        return activation;
    }
    
    /**
     * 입력층 활성화
     */
    async activateInputLayer(inputData) {
        const activation = {};
        
        // 감각 입력 활성화
        activation.sensory = {};
        Object.keys(inputData.sensory).forEach(modality => {
            const features = inputData.sensory[modality];
            activation.sensory[modality] = {};
            
            Object.keys(features).forEach(feature => {
                const value = features[feature];
                if (typeof value === 'number') {
                    activation.sensory[modality][feature] = this.activationFunctions.sigmoid(value);
                } else if (typeof value === 'object') {
                    activation.sensory[modality][feature] = this.activationFunctions.sigmoid(
                        Object.values(value).reduce((sum, v) => sum + v, 0) / Object.keys(value).length
                    );
                }
            });
        });
        
        // 체성감각 활성화
        activation.proprioceptive = {};
        Object.keys(inputData.proprioceptive).forEach(feature => {
            const value = inputData.proprioceptive[feature];
            if (typeof value === 'number') {
                activation.proprioceptive[feature] = this.activationFunctions.sigmoid(value);
            } else if (typeof value === 'object') {
                activation.proprioceptive[feature] = this.activationFunctions.sigmoid(
                    Object.values(value).reduce((sum, v) => sum + v, 0) / Object.keys(value).length
                );
            }
        });
        
        // 내장감각 활성화
        activation.interoceptive = {};
        Object.keys(inputData.interoceptive).forEach(feature => {
            const value = inputData.interoceptive[feature];
            activation.interoceptive[feature] = this.activationFunctions.sigmoid(value);
        });
        
        // 외부감각 활성화
        activation.exteroceptive = {};
        Object.keys(inputData.exteroceptive).forEach(feature => {
            const value = inputData.exteroceptive[feature];
            if (typeof value === 'object') {
                activation.exteroceptive[feature] = this.activationFunctions.sigmoid(
                    Object.values(value).reduce((sum, v) => sum + v, 0) / Object.keys(value).length
                );
            } else {
                activation.exteroceptive[feature] = this.activationFunctions.sigmoid(value);
            }
        });
        
        return activation;
    }
    
    /**
     * 은닉층 활성화
     */
    async activateHiddenLayers(inputActivation) {
        const activation = {};
        
        // 1차 처리층
        activation.primary = await this.activatePrimaryLayer(inputActivation);
        
        // 2차 처리층
        activation.secondary = await this.activateSecondaryLayer(activation.primary);
        
        // 연합 처리층
        activation.association = await this.activateAssociationLayer(activation.secondary);
        
        // 통합 처리층
        activation.integration = await this.activateIntegrationLayer(activation.association);
        
        return activation;
    }
    
    /**
     * 1차 처리층 활성화
     */
    async activatePrimaryLayer(inputActivation) {
        const activation = {};
        
        // 감각 통합
        const sensoryInputs = Object.values(inputActivation.sensory).flatMap(modality => 
            Object.values(modality)
        );
        activation.sensoryIntegration = this.activationFunctions.sigmoid(
            sensoryInputs.reduce((sum, val) => sum + val, 0) / sensoryInputs.length
        );
        
        // 체성감각 통합
        const proprioceptiveInputs = Object.values(inputActivation.proprioceptive);
        activation.proprioceptiveIntegration = this.activationFunctions.sigmoid(
            proprioceptiveInputs.reduce((sum, val) => sum + val, 0) / proprioceptiveInputs.length
        );
        
        // 내장감각 통합
        const interoceptiveInputs = Object.values(inputActivation.interoceptive);
        activation.interoceptiveIntegration = this.activationFunctions.sigmoid(
            interoceptiveInputs.reduce((sum, val) => sum + val, 0) / interoceptiveInputs.length
        );
        
        // 외부감각 통합
        const exteroceptiveInputs = Object.values(inputActivation.exteroceptive);
        activation.exteroceptiveIntegration = this.activationFunctions.sigmoid(
            exteroceptiveInputs.reduce((sum, val) => sum + val, 0) / exteroceptiveInputs.length
        );
        
        return activation;
    }
    
    /**
     * 2차 처리층 활성화
     */
    async activateSecondaryLayer(primaryActivation) {
        const activation = {};
        
        // 감각-체성감각 통합
        activation.sensoryProprioceptive = this.activationFunctions.sigmoid(
            (primaryActivation.sensoryIntegration + primaryActivation.proprioceptiveIntegration) / 2
        );
        
        // 내장감각-외부감각 통합
        activation.interoExteroceptive = this.activationFunctions.sigmoid(
            (primaryActivation.interoceptiveIntegration + primaryActivation.exteroceptiveIntegration) / 2
        );
        
        // 전체 감각 통합
        activation.totalSensoryIntegration = this.activationFunctions.sigmoid(
            (primaryActivation.sensoryIntegration + 
             primaryActivation.proprioceptiveIntegration + 
             primaryActivation.interoceptiveIntegration + 
             primaryActivation.exteroceptiveIntegration) / 4
        );
        
        return activation;
    }
    
    /**
     * 연합 처리층 활성화
     */
    async activateAssociationLayer(secondaryActivation) {
        const activation = {};
        
        // 자기-객체 구분
        activation.selfObjectDistinction = this.activationFunctions.sigmoid(
            secondaryActivation.sensoryProprioceptive - secondaryActivation.interoExteroceptive
        );
        
        // 공간-시간 통합
        activation.spatiotemporalIntegration = this.activationFunctions.sigmoid(
            secondaryActivation.totalSensoryIntegration
        );
        
        // 감정-인지 통합
        activation.emotionalCognitiveIntegration = this.activationFunctions.sigmoid(
            (secondaryActivation.sensoryProprioceptive + secondaryActivation.interoExteroceptive) / 2
        );
        
        return activation;
    }
    
    /**
     * 통합 처리층 활성화
     */
    async activateIntegrationLayer(associationActivation) {
        const activation = {};
        
        // 의식적 통합
        activation.consciousIntegration = this.activationFunctions.sigmoid(
            (associationActivation.selfObjectDistinction + 
             associationActivation.spatiotemporalIntegration + 
             associationActivation.emotionalCognitiveIntegration) / 3
        );
        
        // 관계 형성 준비
        activation.relationshipFormation = this.activationFunctions.sigmoid(
            associationActivation.selfObjectDistinction * associationActivation.spatiotemporalIntegration
        );
        
        // 의식적 경험 준비
        activation.consciousnessPreparation = this.activationFunctions.sigmoid(
            activation.consciousIntegration * activation.relationshipFormation
        );
        
        return activation;
    }
    
    /**
     * 출력층 활성화
     */
    async activateOutputLayer(hiddenActivation) {
        const activation = {};
        
        // 자기 표현
        activation.selfRepresentation = this.activationFunctions.sigmoid(
            hiddenActivation.integration.consciousIntegration
        );
        
        // 객체 표현
        activation.objectRepresentation = this.activationFunctions.sigmoid(
            hiddenActivation.integration.relationshipFormation
        );
        
        // 관계 표현
        activation.relationshipRepresentation = this.activationFunctions.sigmoid(
            hiddenActivation.integration.consciousnessPreparation
        );
        
        // 의식 출력
        activation.consciousnessOutput = this.activationFunctions.sigmoid(
            (activation.selfRepresentation + activation.objectRepresentation + activation.relationshipRepresentation) / 3
        );
        
        return activation;
    }
    
    /**
     * 관계 형성
     */
    async formRelationship(neuralActivation, userState, externalObject) {
        const relationship = {
            // 관계 유형
            type: this.determineRelationshipType(neuralActivation, userState, externalObject),
            
            // 관계 강도
            strength: neuralActivation.outputLayer.relationshipRepresentation,
            
            // 관계 방향
            direction: this.determineRelationshipDirection(neuralActivation, userState, externalObject),
            
            // 관계 품질
            quality: this.assessRelationshipQuality(neuralActivation, userState, externalObject),
            
            // 관계 맥락
            context: this.extractRelationshipContext(userState, externalObject),
            
            // 관계 메타데이터
            metadata: {
                timestamp: Date.now(),
                confidence: neuralActivation.outputLayer.consciousnessOutput,
                novelty: this.assessNovelty(externalObject),
                salience: this.assessSalience(neuralActivation, userState, externalObject)
            }
        };
        
        return relationship;
    }
    
    /**
     * 관계 유형 결정
     */
    determineRelationshipType(neuralActivation, userState, externalObject) {
        const selfObjectDistinction = neuralActivation.hiddenLayers.association.selfObjectDistinction;
        const emotionalIntegration = neuralActivation.hiddenLayers.association.emotionalCognitiveIntegration;
        
        if (selfObjectDistinction > 0.7) {
            return 'self_object';
        } else if (emotionalIntegration > 0.7) {
            return 'emotional';
        } else if (neuralActivation.outputLayer.relationshipRepresentation > 0.6) {
            return 'cognitive';
        } else {
            return 'neutral';
        }
    }
    
    /**
     * 관계 방향 결정
     */
    determineRelationshipDirection(neuralActivation, userState, externalObject) {
        const selfRepresentation = neuralActivation.outputLayer.selfRepresentation;
        const objectRepresentation = neuralActivation.outputLayer.objectRepresentation;
        
        if (selfRepresentation > objectRepresentation + 0.2) {
            return 'self_to_object';
        } else if (objectRepresentation > selfRepresentation + 0.2) {
            return 'object_to_self';
        } else {
            return 'bidirectional';
        }
    }
    
    /**
     * 관계 품질 평가
     */
    assessRelationshipQuality(neuralActivation, userState, externalObject) {
        const quality = {
            coherence: neuralActivation.outputLayer.consciousnessOutput,
            stability: 1 - Math.abs(neuralActivation.hiddenLayers.association.selfObjectDistinction - 0.5),
            richness: neuralActivation.hiddenLayers.secondary.totalSensoryIntegration,
            depth: neuralActivation.hiddenLayers.integration.consciousIntegration,
            clarity: neuralActivation.outputLayer.relationshipRepresentation
        };
        
        quality.overall = Object.values(quality).reduce((sum, val) => sum + val, 0) / 5;
        
        return quality;
    }
    
    /**
     * 관계 맥락 추출
     */
    extractRelationshipContext(userState, externalObject) {
        return {
            temporal: {
                timeOfDay: new Date().getHours(),
                duration: 0, // 기본값
                frequency: 0 // 기본값
            },
            spatial: {
                location: externalObject.environment?.location || 'unknown',
                proximity: externalObject.environment?.proximity || 0.5,
                orientation: externalObject.environment?.orientation || 0.5
            },
            social: {
                presence: externalObject.social?.presence || 'none',
                interaction: externalObject.social?.interaction || 'none',
                relationship: externalObject.social?.relationship || 'unknown'
            },
            emotional: {
                mood: userState.emotional?.current?.valence || 0,
                arousal: userState.emotional?.current?.arousal || 0.5,
                dominance: userState.emotional?.current?.dominance || 0.5
            }
        };
    }
    
    /**
     * 신규성 평가
     */
    assessNovelty(externalObject) {
        // 간단한 신규성 평가 (실제로는 더 복잡한 알고리즘 필요)
        const objectHash = JSON.stringify(externalObject);
        const isNovel = !this.relationshipMemory.has(objectHash);
        
        return isNovel ? 1.0 : 0.3;
    }
    
    /**
     * 중요성 평가
     */
    assessSalience(neuralActivation, userState, externalObject) {
        const salience = {
            sensory: neuralActivation.hiddenLayers.primary.totalSensoryIntegration,
            emotional: userState.emotional?.current?.arousal || 0.5,
            cognitive: userState.cognitive?.load?.overall || 0.5,
            motivational: 0.5 // 기본값
        };
        
        return Object.values(salience).reduce((sum, val) => sum + val, 0) / 4;
    }
    
    /**
     * 의식적 경험 생성
     */
    async generateConsciousExperience(relationship) {
        const experience = {
            // 의식적 경험의 핵심 요소들
            selfAwareness: {
                presence: relationship.strength,
                continuity: 0.8, // 기본값
                agency: relationship.direction === 'self_to_object' ? 0.8 : 0.4,
                ownership: relationship.type === 'self_object' ? 0.9 : 0.5
            },
            
            // 객체 인식
            objectAwareness: {
                distinctness: relationship.quality.coherence,
                stability: relationship.quality.stability,
                properties: this.extractObjectProperties(relationship),
                significance: relationship.metadata.salience
            },
            
            // 관계 인식
            relationshipAwareness: {
                type: relationship.type,
                direction: relationship.direction,
                quality: relationship.quality.overall,
                context: relationship.context
            },
            
            // 의식적 통합
            consciousIntegration: {
                unity: relationship.quality.coherence,
                continuity: relationship.quality.stability,
                coherence: relationship.quality.clarity,
                richness: relationship.quality.richness
            },
            
            // 메타데이터
            metadata: {
                timestamp: Date.now(),
                confidence: relationship.metadata.confidence,
                novelty: relationship.metadata.novelty,
                salience: relationship.metadata.salience
            }
        };
        
        return experience;
    }
    
    /**
     * 객체 속성 추출
     */
    extractObjectProperties(relationship) {
        return {
            physical: {
                size: 0.5, // 기본값
                shape: 'unknown',
                color: 'unknown',
                texture: 'unknown'
            },
            functional: {
                purpose: 'unknown',
                utility: 0.5,
                interactivity: 0.5
            },
            emotional: {
                valence: 0,
                arousal: 0.5,
                approach: 0.5
            },
            cognitive: {
                familiarity: 0.5,
                complexity: 0.5,
                predictability: 0.5
            }
        };
    }
    
    /**
     * 신경망 적응
     */
    async adaptNeuralNetwork(consciousExperience) {
        // 간단한 적응 메커니즘 (실제로는 더 복잡한 학습 알고리즘 필요)
        const adaptationStrength = consciousExperience.metadata.confidence * this.learningParams.learningRate;
        
        // 연결 가중치 업데이트
        this.updateConnectionWeights(adaptationStrength);
        
        // 신경 가소성 시뮬레이션
        this.simulateNeuralPlasticity(consciousExperience);
        
        // 학습률 조정
        this.adjustLearningRate(consciousExperience);
    }
    
    /**
     * 연결 가중치 업데이트
     */
    updateConnectionWeights(adaptationStrength) {
        // 간단한 가중치 업데이트 (실제로는 역전파 알고리즘 필요)
        this.connectionWeights.forEach((weight, connection) => {
            const newWeight = weight + adaptationStrength * (Math.random() - 0.5);
            this.connectionWeights.set(connection, Math.max(0, Math.min(1, newWeight)));
        });
    }
    
    /**
     * 신경 가소성 시뮬레이션
     */
    simulateNeuralPlasticity(consciousExperience) {
        const plasticity = this.learningParams.plasticity * consciousExperience.metadata.confidence;
        
        // 신경망 구조 조정
        this.adjustNeuralStructure(plasticity);
        
        // 활성화 임계값 조정
        this.adjustActivationThresholds(plasticity);
    }
    
    /**
     * 신경망 구조 조정
     */
    adjustNeuralStructure(plasticity) {
        // 간단한 구조 조정 (실제로는 더 복잡한 메커니즘 필요)
        if (plasticity > 0.5) {
            // 새로운 연결 추가
            this.addNewConnections(plasticity);
        } else if (plasticity < 0.2) {
            // 기존 연결 제거
            this.removeWeakConnections();
        }
    }
    
    /**
     * 새로운 연결 추가
     */
    addNewConnections(plasticity) {
        const numNewConnections = Math.floor(plasticity * 10);
        
        for (let i = 0; i < numNewConnections; i++) {
            const connectionId = `connection_${Date.now()}_${i}`;
            this.connectionWeights.set(connectionId, Math.random() * 0.5);
        }
    }
    
    /**
     * 약한 연결 제거
     */
    removeWeakConnections() {
        const weakConnections = [];
        
        this.connectionWeights.forEach((weight, connection) => {
            if (weight < 0.1) {
                weakConnections.push(connection);
            }
        });
        
        weakConnections.forEach(connection => {
            this.connectionWeights.delete(connection);
        });
    }
    
    /**
     * 활성화 임계값 조정
     */
    adjustActivationThresholds(plasticity) {
        // 간단한 임계값 조정
        this.activationThresholds = this.activationThresholds || 0.5;
        this.activationThresholds += plasticity * 0.01;
        this.activationThresholds = Math.max(0.1, Math.min(0.9, this.activationThresholds));
    }
    
    /**
     * 학습률 조정
     */
    adjustLearningRate(consciousExperience) {
        const performance = consciousExperience.consciousIntegration.coherence;
        
        if (performance > 0.8) {
            this.learningParams.learningRate *= 0.99; // 학습률 감소
        } else if (performance < 0.4) {
            this.learningParams.learningRate *= 1.01; // 학습률 증가
        }
        
        this.learningParams.learningRate = Math.max(0.001, Math.min(0.1, this.learningParams.learningRate));
    }
    
    /**
     * 관계 메모리 저장
     */
    storeRelationshipMemory(userId, relationship, consciousExperience) {
        const memoryKey = `${userId}_${Date.now()}`;
        
        this.relationshipMemory.set(memoryKey, {
            relationship,
            consciousExperience,
            timestamp: Date.now()
        });
        
        this.consciousnessExperiences.set(memoryKey, consciousExperience);
        
        // 메모리 크기 제한
        if (this.relationshipMemory.size > 1000) {
            const oldestKey = this.relationshipMemory.keys().next().value;
            this.relationshipMemory.delete(oldestKey);
            this.consciousnessExperiences.delete(oldestKey);
        }
    }
    
    /**
     * 관계 메모리 조회
     */
    getRelationshipMemory(userId, limit = 10) {
        const userMemories = [];
        
        this.relationshipMemory.forEach((memory, key) => {
            if (key.startsWith(userId)) {
                userMemories.push(memory);
            }
        });
        
        return userMemories
            .sort((a, b) => b.timestamp - a.timestamp)
            .slice(0, limit);
    }
    
    /**
     * 의식적 경험 조회
     */
    getConsciousnessExperiences(userId, limit = 10) {
        const userExperiences = [];
        
        this.consciousnessExperiences.forEach((experience, key) => {
            if (key.startsWith(userId)) {
                userExperiences.push(experience);
            }
        });
        
        return userExperiences
            .sort((a, b) => b.metadata.timestamp - a.metadata.timestamp)
            .slice(0, limit);
    }
    
    /**
     * 신경망 상태 조회
     */
    getNeuralNetworkState() {
        return {
            structure: {
                inputLayer: Object.keys(this.neuralNetwork.inputLayer).length,
                hiddenLayers: Object.keys(this.neuralNetwork.hiddenLayers).length,
                outputLayer: Object.keys(this.neuralNetwork.outputLayer).length
            },
            connections: this.connectionWeights.size,
            learningParams: { ...this.learningParams },
            memory: {
                relationships: this.relationshipMemory.size,
                experiences: this.consciousnessExperiences.size
            }
        };
    }
    
    /**
     * 시스템 통계 조회
     */
    getStats() {
        return {
            neuralNetwork: this.getNeuralNetworkState(),
            totalRelationships: this.relationshipMemory.size,
            totalExperiences: this.consciousnessExperiences.size,
            learningRate: this.learningParams.learningRate,
            timestamp: Date.now()
        };
    }
    
    /**
     * 시스템 종료
     */
    shutdown() {
        this.removeAllListeners();
        console.log('🧠 Neural Relationship Mapper shutdown complete');
    }
}

module.exports = NeuralRelationshipMapper;


