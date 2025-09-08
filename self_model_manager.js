/**
 * Self-Model Manager - Damasio's Core Consciousness Implementation
 * 
 * Implements Phase 1: The "Self-Model" as a Data Construct
 * Based on Antonio Damasio's "The Feeling of What Happens"
 * 
 * This system tracks and integrates a user's current "internal state"
 * by monitoring body signals, behavioral patterns, and contextual data.
 */

const EventEmitter = require('events');

class SelfModelManager extends EventEmitter {
    constructor() {
        super();
        this.userStates = new Map(); // userId -> UserState
        this.knowledgeGraph = new Map(); // relationship -> data
        this.sensorConnectors = new Map(); // sensorType -> connector
        this.behavioralPatterns = new Map(); // userId -> patterns
        
        this.initializeSensorConnectors();
        this.startStateMonitoring();
        
        console.log('🧠 Self-Model Manager initialized (Damasio Core Consciousness)');
    }

    /**
     * Initialize sensor connectors for physiological data
     */
    initializeSensorConnectors() {
        // Apple Health integration
        this.sensorConnectors.set('apple_health', {
            name: 'Apple Health',
            metrics: ['heart_rate', 'sleep_duration', 'steps', 'active_energy'],
            connect: this.connectAppleHealth.bind(this)
        });

        // Google Fit integration
        this.sensorConnectors.set('google_fit', {
            name: 'Google Fit',
            metrics: ['heart_rate', 'sleep_duration', 'steps', 'calories'],
            connect: this.connectGoogleFit.bind(this)
        });

        // Mock sensor for development/testing
        this.sensorConnectors.set('mock_sensor', {
            name: 'Mock Sensor',
            metrics: ['heart_rate', 'sleep_duration', 'steps', 'stress_level'],
            connect: this.connectMockSensor.bind(this)
        });
    }

    /**
     * Create or update user's self-model state
     */
    async updateUserState(userId, inputData) {
        try {
            let userState = this.userStates.get(userId);
            if (!userState) {
                userState = this.createInitialUserState(userId);
                this.userStates.set(userId, userState);
            }

            // Update physiological state from sensor data
            if (inputData.sensorData) {
                await this.updatePhysiologicalState(userState, inputData.sensorData);
            }

            // Update behavioral state from dialogue and usage patterns
            if (inputData.dialogueData) {
                await this.updateBehavioralState(userState, inputData.dialogueData);
            }

            // Update contextual state from environmental data
            if (inputData.contextualData) {
                await this.updateContextualState(userState, inputData.contextualData);
            }

            // Build knowledge graph relationships
            await this.buildKnowledgeGraph(userState);

            // Emit state change event
            this.emit('stateChanged', { userId, state: userState });

            return userState;
        } catch (error) {
            console.error('Error updating user state:', error);
            throw error;
        }
    }

    /**
     * Create initial user state structure
     */
    createInitialUserState(userId) {
        return {
            userId,
            timestamp: Date.now(),
            physiological: {
                heartRate: null,
                sleepDuration: null,
                steps: null,
                stressLevel: null,
                energyLevel: null,
                lastUpdated: null
            },
            behavioral: {
                dialogueTone: 'neutral',
                emotionalState: 'calm',
                attentionLevel: 'focused',
                stressIndicators: [],
                usagePatterns: {
                    sessionLength: 0,
                    timeOfDay: new Date().getHours(),
                    frequentCommands: []
                }
            },
            contextual: {
                currentActivity: 'unknown',
                environment: 'unknown',
                socialContext: 'individual',
                temporalContext: this.getTemporalContext()
            },
            relationships: new Map(), // Knowledge graph relationships
            selfAwareness: {
                confidence: 0.5,
                coherence: 0.5,
                stability: 0.5
            }
        };
    }

    /**
     * Update physiological state from sensor data
     */
    async updatePhysiologicalState(userState, sensorData) {
        const physiological = userState.physiological;
        
        if (sensorData.heartRate) {
            physiological.heartRate = sensorData.heartRate;
            // Infer stress level from heart rate variability
            physiological.stressLevel = this.calculateStressFromHRV(sensorData.heartRate);
        }

        if (sensorData.sleepDuration) {
            physiological.sleepDuration = sensorData.sleepDuration;
            // Infer energy level from sleep quality
            physiological.energyLevel = this.calculateEnergyFromSleep(sensorData.sleepDuration);
        }

        if (sensorData.steps) {
            physiological.steps = sensorData.steps;
        }

        physiological.lastUpdated = Date.now();
    }

    /**
     * Update behavioral state from dialogue analysis
     */
    async updateBehavioralState(userState, dialogueData) {
        const behavioral = userState.behavioral;
        
        // Analyze dialogue tone and emotional indicators
        const emotionalAnalysis = this.analyzeEmotionalState(dialogueData);
        behavioral.dialogueTone = emotionalAnalysis.tone;
        behavioral.emotionalState = emotionalAnalysis.emotion;
        behavioral.attentionLevel = emotionalAnalysis.attention;
        
        // Track stress indicators
        if (emotionalAnalysis.stressIndicators.length > 0) {
            behavioral.stressIndicators.push({
                timestamp: Date.now(),
                indicators: emotionalAnalysis.stressIndicators,
                severity: emotionalAnalysis.stressSeverity
            });
        }

        // Update usage patterns
        behavioral.usagePatterns.sessionLength = dialogueData.sessionLength || 0;
        behavioral.usagePatterns.timeOfDay = new Date().getHours();
        
        if (dialogueData.commands) {
            behavioral.usagePatterns.frequentCommands = this.updateFrequentCommands(
                behavioral.usagePatterns.frequentCommands,
                dialogueData.commands
            );
        }
    }

    /**
     * Update contextual state from environmental data
     */
    async updateContextualState(userState, contextualData) {
        const contextual = userState.contextual;
        
        if (contextualData.activity) {
            contextual.currentActivity = contextualData.activity;
        }
        
        if (contextualData.environment) {
            contextual.environment = contextualData.environment;
        }
        
        if (contextualData.socialContext) {
            contextual.socialContext = contextualData.socialContext;
        }
        
        contextual.temporalContext = this.getTemporalContext();
    }

    /**
     * Build knowledge graph relationships between user states
     */
    async buildKnowledgeGraph(userState) {
        const relationships = userState.relationships;
        
        // Clear existing relationships
        relationships.clear();
        
        // Physiological -> Behavioral relationships
        if (userState.physiological.stressLevel > 0.7) {
            relationships.set('high_stress_affects_attention', {
                type: 'causal',
                source: 'physiological.stressLevel',
                target: 'behavioral.attentionLevel',
                strength: userState.physiological.stressLevel,
                description: 'High stress reduces attention span'
            });
        }
        
        if (userState.physiological.energyLevel < 0.3) {
            relationships.set('low_energy_affects_emotion', {
                type: 'causal',
                source: 'physiological.energyLevel',
                target: 'behavioral.emotionalState',
                strength: 1 - userState.physiological.energyLevel,
                description: 'Low energy affects emotional state'
            });
        }
        
        // Behavioral -> Contextual relationships
        if (userState.behavioral.emotionalState === 'stressed') {
            relationships.set('stress_affects_activity', {
                type: 'influential',
                source: 'behavioral.emotionalState',
                target: 'contextual.currentActivity',
                strength: 0.8,
                description: 'Stress influences activity choices'
            });
        }
        
        // Temporal -> Behavioral relationships
        const hour = new Date().getHours();
        if (hour < 6 || hour > 22) {
            relationships.set('late_hour_affects_energy', {
                type: 'temporal',
                source: 'contextual.temporalContext',
                target: 'behavioral.energyLevel',
                strength: 0.6,
                description: 'Late hours affect energy levels'
            });
        }
        
        // Update self-awareness metrics
        this.updateSelfAwareness(userState);
    }

    /**
     * Update self-awareness metrics based on state coherence
     */
    updateSelfAwareness(userState) {
        const awareness = userState.selfAwareness;
        const relationships = userState.relationships;
        
        // Calculate confidence based on data completeness
        const dataCompleteness = this.calculateDataCompleteness(userState);
        awareness.confidence = Math.min(0.9, dataCompleteness);
        
        // Calculate coherence based on relationship consistency
        const coherence = this.calculateStateCoherence(relationships);
        awareness.coherence = coherence;
        
        // Calculate stability based on state changes over time
        const stability = this.calculateStateStability(userState);
        awareness.stability = stability;
    }

    /**
     * Get current user state for AI context
     */
    getCurrentUserState(userId) {
        const userState = this.userStates.get(userId);
        if (!userState) {
            return null;
        }
        
        return {
            userId,
            timestamp: userState.timestamp,
            physiological: { ...userState.physiological },
            behavioral: { ...userState.behavioral },
            contextual: { ...userState.contextual },
            relationships: Array.from(userState.relationships.entries()),
            selfAwareness: { ...userState.selfAwareness },
            summary: this.generateStateSummary(userState)
        };
    }

    /**
     * Generate human-readable state summary
     */
    generateStateSummary(userState) {
        const summary = [];
        
        // Physiological summary
        if (userState.physiological.stressLevel > 0.7) {
            summary.push('High stress detected');
        }
        if (userState.physiological.energyLevel < 0.3) {
            summary.push('Low energy levels');
        }
        if (userState.physiological.sleepDuration < 6) {
            summary.push('Insufficient sleep');
        }
        
        // Behavioral summary
        if (userState.behavioral.emotionalState === 'stressed') {
            summary.push('Emotional stress indicators');
        }
        if (userState.behavioral.attentionLevel === 'distracted') {
            summary.push('Attention difficulties');
        }
        
        // Contextual summary
        if (userState.contextual.temporalContext === 'late_night') {
            summary.push('Late night usage pattern');
        }
        
        return summary.length > 0 ? summary.join(', ') : 'Stable state';
    }

    // Helper methods for calculations and analysis
    calculateStressFromHRV(heartRate) {
        // Simplified stress calculation based on heart rate
        // In a real implementation, this would use HRV data
        if (heartRate > 100) return 0.8;
        if (heartRate > 80) return 0.5;
        return 0.2;
    }

    calculateEnergyFromSleep(sleepDuration) {
        // Energy level based on sleep duration
        if (sleepDuration >= 8) return 0.9;
        if (sleepDuration >= 7) return 0.7;
        if (sleepDuration >= 6) return 0.5;
        return 0.3;
    }

    analyzeEmotionalState(dialogueData) {
        const text = dialogueData.text || '';
        const tone = this.detectTone(text);
        const emotion = this.detectEmotion(text);
        const attention = this.detectAttentionLevel(text);
        const stressIndicators = this.detectStressIndicators(text);
        
        return {
            tone,
            emotion,
            attention,
            stressIndicators,
            stressSeverity: stressIndicators.length > 0 ? 0.7 : 0.2
        };
    }

    detectTone(text) {
        const stressWords = ['tired', 'stressed', 'overwhelmed', 'frustrated', 'anxious'];
        const positiveWords = ['good', 'great', 'excited', 'happy', 'confident'];
        
        const lowerText = text.toLowerCase();
        if (stressWords.some(word => lowerText.includes(word))) return 'stressed';
        if (positiveWords.some(word => lowerText.includes(word))) return 'positive';
        return 'neutral';
    }

    detectEmotion(text) {
        const emotions = {
            'stressed': ['tired', 'stressed', 'overwhelmed', 'frustrated'],
            'anxious': ['worried', 'anxious', 'nervous', 'concerned'],
            'calm': ['relaxed', 'calm', 'peaceful', 'content'],
            'excited': ['excited', 'enthusiastic', 'motivated', 'energetic']
        };
        
        const lowerText = text.toLowerCase();
        for (const [emotion, words] of Object.entries(emotions)) {
            if (words.some(word => lowerText.includes(word))) {
                return emotion;
            }
        }
        return 'neutral';
    }

    detectAttentionLevel(text) {
        const attentionWords = ['focus', 'concentrate', 'attention', 'distracted'];
        const lowerText = text.toLowerCase();
        
        if (attentionWords.some(word => lowerText.includes(word))) {
            return 'distracted';
        }
        return 'focused';
    }

    detectStressIndicators(text) {
        const stressIndicators = [];
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('tired') || lowerText.includes('exhausted')) {
            stressIndicators.push('fatigue');
        }
        if (lowerText.includes('stressed') || lowerText.includes('overwhelmed')) {
            stressIndicators.push('overwhelm');
        }
        if (lowerText.includes('anxious') || lowerText.includes('worried')) {
            stressIndicators.push('anxiety');
        }
        if (lowerText.includes('frustrated') || lowerText.includes('angry')) {
            stressIndicators.push('frustration');
        }
        
        return stressIndicators;
    }

    updateFrequentCommands(existingCommands, newCommands) {
        const commandCounts = new Map();
        
        // Count existing commands
        existingCommands.forEach(cmd => {
            commandCounts.set(cmd.command, cmd.count);
        });
        
        // Add new commands
        newCommands.forEach(cmd => {
            const count = commandCounts.get(cmd) || 0;
            commandCounts.set(cmd, count + 1);
        });
        
        // Return top 5 most frequent commands
        return Array.from(commandCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([command, count]) => ({ command, count }));
    }

    getTemporalContext() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'late_night';
    }

    calculateDataCompleteness(userState) {
        let completeness = 0;
        let totalFields = 0;
        
        // Check physiological data
        const physFields = Object.keys(userState.physiological);
        physFields.forEach(field => {
            totalFields++;
            if (userState.physiological[field] !== null) completeness++;
        });
        
        // Check behavioral data
        const behavFields = Object.keys(userState.behavioral);
        behavFields.forEach(field => {
            totalFields++;
            if (userState.behavioral[field] !== null && userState.behavioral[field] !== undefined) completeness++;
        });
        
        return totalFields > 0 ? completeness / totalFields : 0;
    }

    calculateStateCoherence(relationships) {
        if (relationships.size === 0) return 0.5;
        
        let coherence = 0;
        let totalRelationships = 0;
        
        relationships.forEach(rel => {
            totalRelationships++;
            coherence += rel.strength;
        });
        
        return totalRelationships > 0 ? coherence / totalRelationships : 0.5;
    }

    calculateStateStability(userState) {
        // Simplified stability calculation
        // In a real implementation, this would track state changes over time
        return 0.7; // Default stability
    }

    // Sensor connector methods (mock implementations)
    async connectAppleHealth(userId) {
        // Mock Apple Health connection
        return {
            connected: true,
            data: {
                heartRate: 72 + Math.random() * 20,
                sleepDuration: 7.5 + Math.random() * 1.5,
                steps: 8000 + Math.random() * 4000
            }
        };
    }

    async connectGoogleFit(userId) {
        // Mock Google Fit connection
        return {
            connected: true,
            data: {
                heartRate: 75 + Math.random() * 15,
                sleepDuration: 7.0 + Math.random() * 2.0,
                steps: 7500 + Math.random() * 5000
            }
        };
    }

    async connectMockSensor(userId) {
        // Mock sensor for development
        return {
            connected: true,
            data: {
                heartRate: 70 + Math.random() * 25,
                sleepDuration: 6.5 + Math.random() * 2.5,
                steps: 7000 + Math.random() * 6000,
                stressLevel: Math.random()
            }
        };
    }

    /**
     * Start monitoring user states
     */
    startStateMonitoring() {
        // Monitor state changes every 30 seconds
        setInterval(() => {
            this.userStates.forEach((userState, userId) => {
                // Update temporal context
                userState.contextual.temporalContext = this.getTemporalContext();
                
                // Emit periodic state update
                this.emit('periodicUpdate', { userId, state: userState });
            });
        }, 30000);
    }

    /**
     * Get self-model statistics
     */
    getStats() {
        return {
            totalUsers: this.userStates.size,
            activeConnectors: this.sensorConnectors.size,
            knowledgeGraphSize: Array.from(this.knowledgeGraph.entries()).length,
            averageConfidence: this.calculateAverageConfidence(),
            averageCoherence: this.calculateAverageCoherence()
        };
    }

    calculateAverageConfidence() {
        if (this.userStates.size === 0) return 0;
        
        let totalConfidence = 0;
        this.userStates.forEach(userState => {
            totalConfidence += userState.selfAwareness.confidence;
        });
        
        return totalConfidence / this.userStates.size;
    }

    calculateAverageCoherence() {
        if (this.userStates.size === 0) return 0;
        
        let totalCoherence = 0;
        this.userStates.forEach(userState => {
            totalCoherence += userState.selfAwareness.coherence;
        });
        
        return totalCoherence / this.userStates.size;
    }
}

module.exports = SelfModelManager;
