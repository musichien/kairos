/**
 * Behavioral Feedback Loop System - Damasio's Core Consciousness Phase 3
 * 
 * Implements the "Behavioral Feedback" Loop component of Core Consciousness
 * by using the "conscious" state model to drive specific actions and
 * "cognitive training" modules.
 * 
 * This system creates automated prompts or "missions" based on the AI's
 * inference of the user's state, providing proactive wellness interventions.
 */

const EventEmitter = require('events');

class BehavioralFeedbackLoop extends EventEmitter {
    constructor(selfModelManager, contextAwareDialogue) {
        super();
        this.selfModelManager = selfModelManager;
        this.contextAwareDialogue = contextAwareDialogue;
        this.interventionStrategies = new Map(); // strategy type -> implementation
        this.activeInterventions = new Map(); // userId -> active interventions
        this.interventionHistory = new Map(); // userId -> intervention history
        this.missionTemplates = new Map(); // mission type -> template
        
        this.initializeInterventionStrategies();
        this.initializeMissionTemplates();
        this.setupEventListeners();
        this.startInterventionMonitoring();
        
        console.log('🔄 Behavioral Feedback Loop System initialized (Damasio Phase 3)');
    }

    /**
     * Initialize intervention strategies based on user states
     */
    initializeInterventionStrategies() {
        // Stress management interventions
        this.interventionStrategies.set('stress_management', {
            name: 'Stress Management',
            triggers: ['high_stress_affects_attention', 'stress_affects_activity'],
            interventions: [
                {
                    type: 'breathing_exercise',
                    name: 'Guided Breathing Exercise',
                    duration: 300, // 5 minutes
                    description: 'A calming breathing exercise to reduce stress',
                    effectiveness: 0.8
                },
                {
                    type: 'mindfulness_meditation',
                    name: 'Mindfulness Meditation',
                    duration: 600, // 10 minutes
                    description: 'A short mindfulness session to center yourself',
                    effectiveness: 0.9
                },
                {
                    type: 'progressive_relaxation',
                    name: 'Progressive Muscle Relaxation',
                    duration: 900, // 15 minutes
                    description: 'Systematic relaxation of muscle groups',
                    effectiveness: 0.7
                }
            ]
        });

        // Energy boost interventions
        this.interventionStrategies.set('energy_boost', {
            name: 'Energy Enhancement',
            triggers: ['low_energy_affects_emotion'],
            interventions: [
                {
                    type: 'light_exercise',
                    name: 'Light Physical Activity',
                    duration: 600, // 10 minutes
                    description: 'Gentle movement to boost energy levels',
                    effectiveness: 0.8
                },
                {
                    type: 'nutrition_break',
                    name: 'Healthy Snack Break',
                    duration: 300, // 5 minutes
                    description: 'Nutritious snack to provide energy',
                    effectiveness: 0.6
                },
                {
                    type: 'hydration_reminder',
                    name: 'Hydration Check',
                    duration: 120, // 2 minutes
                    description: 'Drink water to maintain energy',
                    effectiveness: 0.5
                }
            ]
        });

        // Focus enhancement interventions
        this.interventionStrategies.set('focus_enhancement', {
            name: 'Focus Enhancement',
            triggers: ['attention_difficulties', 'distraction_patterns'],
            interventions: [
                {
                    type: 'pomodoro_technique',
                    name: 'Pomodoro Focus Session',
                    duration: 1500, // 25 minutes
                    description: 'Focused work session with breaks',
                    effectiveness: 0.9
                },
                {
                    type: 'attention_training',
                    name: 'Attention Training Exercise',
                    duration: 600, // 10 minutes
                    description: 'Cognitive exercise to improve focus',
                    effectiveness: 0.7
                },
                {
                    type: 'environment_optimization',
                    name: 'Environment Setup',
                    duration: 300, // 5 minutes
                    description: 'Optimize your workspace for focus',
                    effectiveness: 0.6
                }
            ]
        });

        // Sleep optimization interventions
        this.interventionStrategies.set('sleep_optimization', {
            name: 'Sleep Optimization',
            triggers: ['insufficient_sleep', 'late_night_usage'],
            interventions: [
                {
                    type: 'sleep_hygiene',
                    name: 'Sleep Hygiene Check',
                    duration: 300, // 5 minutes
                    description: 'Review and improve sleep habits',
                    effectiveness: 0.8
                },
                {
                    type: 'wind_down_routine',
                    name: 'Evening Wind-Down',
                    duration: 900, // 15 minutes
                    description: 'Relaxing routine to prepare for sleep',
                    effectiveness: 0.9
                },
                {
                    type: 'sleep_environment',
                    name: 'Sleep Environment Setup',
                    duration: 600, // 10 minutes
                    description: 'Optimize bedroom for better sleep',
                    effectiveness: 0.7
                }
            ]
        });
    }

    /**
     * Initialize mission templates for cognitive training
     */
    initializeMissionTemplates() {
        // Memory-based training missions
        this.missionTemplates.set('memory_recall', {
            name: 'Memory Recall Challenge',
            description: 'Test your memory with personalized questions',
            difficulty: 'adaptive',
            duration: 600, // 10 minutes
            rewards: ['memory_improvement', 'cognitive_boost'],
            requirements: ['user_memories']
        });

        // Pattern recognition missions
        this.missionTemplates.set('pattern_recognition', {
            name: 'Pattern Recognition Mission',
            description: 'Identify patterns in your daily activities',
            difficulty: 'medium',
            duration: 900, // 15 minutes
            rewards: ['pattern_awareness', 'cognitive_flexibility'],
            requirements: ['behavioral_data']
        });

        // Emotional regulation missions
        this.missionTemplates.set('emotional_regulation', {
            name: 'Emotional Regulation Practice',
            description: 'Practice managing emotional responses',
            difficulty: 'adaptive',
            duration: 1200, // 20 minutes
            rewards: ['emotional_intelligence', 'stress_resilience'],
            requirements: ['emotional_state_data']
        });

        // Attention training missions
        this.missionTemplates.set('attention_training', {
            name: 'Attention Training Exercise',
            description: 'Improve focus and concentration',
            difficulty: 'progressive',
            duration: 1800, // 30 minutes
            rewards: ['improved_focus', 'cognitive_endurance'],
            requirements: ['attention_level_data']
        });
    }

    /**
     * Setup event listeners for state changes and dialogue events
     */
    setupEventListeners() {
        this.selfModelManager.on('stateChanged', (data) => {
            this.evaluateInterventionNeeds(data);
        });

        this.contextAwareDialogue.on('responseGenerated', (data) => {
            this.analyzeResponseEffectiveness(data);
        });

        this.contextAwareDialogue.on('proactiveIntervention', (data) => {
            this.handleProactiveIntervention(data);
        });
    }

    /**
     * Start monitoring for intervention opportunities
     */
    startInterventionMonitoring() {
        // Check for intervention opportunities every 2 minutes
        setInterval(() => {
            this.selfModelManager.userStates.forEach((userState, userId) => {
                this.evaluateInterventionNeeds({ userId, state: userState });
            });
        }, 120000);
    }

    /**
     * Evaluate if interventions are needed based on user state
     */
    evaluateInterventionNeeds(data) {
        const { userId, state } = data;
        
        // Check each intervention strategy
        this.interventionStrategies.forEach((strategy, strategyType) => {
            const shouldIntervene = this.shouldTriggerIntervention(state, strategy);
            
            if (shouldIntervene) {
                this.triggerIntervention(userId, strategyType, state);
            }
        });

        // Check for mission opportunities
        this.evaluateMissionOpportunities(userId, state);
    }

    /**
     * Determine if an intervention should be triggered
     */
    shouldTriggerIntervention(userState, strategy) {
        // Check if any triggers are present
        const hasTrigger = strategy.triggers.some(trigger => {
            return userState.relationships.has(trigger) && 
                   userState.relationships.get(trigger).strength > 0.6;
        });

        if (!hasTrigger) return false;

        // Check if intervention is already active
        const activeInterventions = this.activeInterventions.get(userState.userId) || [];
        const alreadyActive = activeInterventions.some(intervention => 
            intervention.strategyType === strategy.name
        );

        if (alreadyActive) return false;

        // Check intervention frequency (don't spam)
        const recentInterventions = this.getRecentInterventions(userState.userId, 3600000); // 1 hour
        if (recentInterventions.length > 2) return false;

        return true;
    }

    /**
     * Trigger an intervention for a user
     */
    async triggerIntervention(userId, strategyType, userState) {
        try {
            const strategy = this.interventionStrategies.get(strategyType);
            if (!strategy) return;

            // Select the most appropriate intervention
            const intervention = this.selectBestIntervention(strategy, userState);
            
            // Create intervention instance
            const interventionInstance = {
                id: this.generateInterventionId(),
                userId,
                strategyType,
                intervention,
                startTime: Date.now(),
                status: 'active',
                userState: this.serializeUserState(userState)
            };

            // Add to active interventions
            if (!this.activeInterventions.has(userId)) {
                this.activeInterventions.set(userId, []);
            }
            this.activeInterventions.get(userId).push(interventionInstance);

            // Emit intervention event
            this.emit('interventionTriggered', interventionInstance);

            // Schedule intervention completion
            setTimeout(() => {
                this.completeIntervention(interventionInstance);
            }, intervention.duration * 1000);

            console.log(`🔄 Intervention triggered: ${intervention.name} for user ${userId}`);
            
        } catch (error) {
            console.error('Error triggering intervention:', error);
        }
    }

    /**
     * Select the best intervention from a strategy
     */
    selectBestIntervention(strategy, userState) {
        // For now, select the first intervention
        // In a more sophisticated implementation, this would consider:
        // - User preferences
        // - Previous effectiveness
        // - Current context
        // - Time constraints
        return strategy.interventions[0];
    }

    /**
     * Complete an intervention
     */
    async completeIntervention(interventionInstance) {
        try {
            // Update intervention status
            interventionInstance.status = 'completed';
            interventionInstance.endTime = Date.now();
            interventionInstance.duration = interventionInstance.endTime - interventionInstance.startTime;

            // Remove from active interventions
            const activeInterventions = this.activeInterventions.get(interventionInstance.userId) || [];
            const updatedActive = activeInterventions.filter(intervention => 
                intervention.id !== interventionInstance.id
            );
            this.activeInterventions.set(interventionInstance.userId, updatedActive);

            // Add to intervention history
            if (!this.interventionHistory.has(interventionInstance.userId)) {
                this.interventionHistory.set(interventionInstance.userId, []);
            }
            this.interventionHistory.get(interventionInstance.userId).push(interventionInstance);

            // Emit completion event
            this.emit('interventionCompleted', interventionInstance);

            // Evaluate effectiveness
            await this.evaluateInterventionEffectiveness(interventionInstance);

            console.log(`✅ Intervention completed: ${interventionInstance.intervention.name} for user ${interventionInstance.userId}`);
            
        } catch (error) {
            console.error('Error completing intervention:', error);
        }
    }

    /**
     * Evaluate intervention effectiveness
     */
    async evaluateInterventionEffectiveness(interventionInstance) {
        try {
            // Get current user state
            const currentState = this.selfModelManager.getCurrentUserState(interventionInstance.userId);
            if (!currentState) return;

            // Compare with state before intervention
            const beforeState = interventionInstance.userState;
            
            // Calculate effectiveness metrics
            const effectiveness = this.calculateEffectiveness(beforeState, currentState, interventionInstance);
            
            // Update intervention with effectiveness data
            interventionInstance.effectiveness = effectiveness;
            
            // Emit effectiveness event
            this.emit('interventionEffectiveness', {
                intervention: interventionInstance,
                effectiveness
            });

            console.log(`📊 Intervention effectiveness: ${effectiveness.overall} for ${interventionInstance.intervention.name}`);
            
        } catch (error) {
            console.error('Error evaluating intervention effectiveness:', error);
        }
    }

    /**
     * Calculate intervention effectiveness
     */
    calculateEffectiveness(beforeState, afterState, intervention) {
        const metrics = {
            stressReduction: 0,
            energyImprovement: 0,
            attentionImprovement: 0,
            overall: 0
        };

        // Calculate stress reduction
        if (beforeState.physiological.stressLevel && afterState.physiological.stressLevel) {
            metrics.stressReduction = Math.max(0, 
                beforeState.physiological.stressLevel - afterState.physiological.stressLevel
            );
        }

        // Calculate energy improvement
        if (beforeState.physiological.energyLevel && afterState.physiological.energyLevel) {
            metrics.energyImprovement = Math.max(0,
                afterState.physiological.energyLevel - beforeState.physiological.energyLevel
            );
        }

        // Calculate attention improvement
        if (beforeState.behavioral.attentionLevel && afterState.behavioral.attentionLevel) {
            const attentionMap = { 'distracted': 0, 'focused': 1, 'hyperfocused': 1.2 };
            const beforeScore = attentionMap[beforeState.behavioral.attentionLevel] || 0.5;
            const afterScore = attentionMap[afterState.behavioral.attentionLevel] || 0.5;
            metrics.attentionImprovement = Math.max(0, afterScore - beforeScore);
        }

        // Calculate overall effectiveness
        metrics.overall = (metrics.stressReduction + metrics.energyImprovement + metrics.attentionImprovement) / 3;

        return metrics;
    }

    /**
     * Evaluate mission opportunities
     */
    evaluateMissionOpportunities(userId, userState) {
        // Check if user is in a good state for missions
        const isGoodStateForMissions = this.isGoodStateForMissions(userState);
        
        if (!isGoodStateForMissions) return;

        // Check for available mission types
        this.missionTemplates.forEach((template, missionType) => {
            if (this.canStartMission(userId, missionType, userState)) {
                this.suggestMission(userId, missionType, userState);
            }
        });
    }

    /**
     * Check if user is in a good state for missions
     */
    isGoodStateForMissions(userState) {
        // Good state: moderate stress, decent energy, focused attention
        const stressLevel = userState.physiological.stressLevel || 0.5;
        const energyLevel = userState.physiological.energyLevel || 0.5;
        const attentionLevel = userState.behavioral.attentionLevel || 'focused';
        
        return stressLevel < 0.7 && 
               energyLevel > 0.4 && 
               attentionLevel === 'focused';
    }

    /**
     * Check if a mission can be started
     */
    canStartMission(userId, missionType, userState) {
        // Check if mission is already active
        const activeInterventions = this.activeInterventions.get(userId) || [];
        const missionActive = activeInterventions.some(intervention => 
            intervention.intervention.type === missionType
        );

        if (missionActive) return false;

        // Check mission requirements
        const template = this.missionTemplates.get(missionType);
        const hasRequirements = template.requirements.every(requirement => {
            switch (requirement) {
                case 'user_memories':
                    return userState.relationships.size > 0;
                case 'behavioral_data':
                    return userState.behavioral.usagePatterns.frequentCommands.length > 0;
                case 'emotional_state_data':
                    return userState.behavioral.emotionalState !== 'neutral';
                case 'attention_level_data':
                    return userState.behavioral.attentionLevel !== 'unknown';
                default:
                    return true;
            }
        });

        return hasRequirements;
    }

    /**
     * Suggest a mission to a user
     */
    suggestMission(userId, missionType, userState) {
        const template = this.missionTemplates.get(missionType);
        
        const missionSuggestion = {
            id: this.generateMissionId(),
            userId,
            missionType,
            template,
            suggestedAt: Date.now(),
            userState: this.serializeUserState(userState)
        };

        // Emit mission suggestion event
        this.emit('missionSuggested', missionSuggestion);

        console.log(`🎯 Mission suggested: ${template.name} for user ${userId}`);
    }

    /**
     * Handle proactive intervention from dialogue system
     */
    handleProactiveIntervention(data) {
        const { userId, intervention } = data;
        
        // Convert dialogue intervention to feedback loop intervention
        const feedbackIntervention = {
            id: this.generateInterventionId(),
            userId,
            strategyType: 'proactive_dialogue',
            intervention: {
                type: 'wellness_check',
                name: 'Wellness Check',
                duration: 300,
                description: intervention.message,
                effectiveness: 0.6
            },
            startTime: Date.now(),
            status: 'active',
            source: 'dialogue_system'
        };

        // Add to active interventions
        if (!this.activeInterventions.has(userId)) {
            this.activeInterventions.set(userId, []);
        }
        this.activeInterventions.get(userId).push(feedbackIntervention);

        // Emit intervention event
        this.emit('interventionTriggered', feedbackIntervention);
    }

    /**
     * Analyze response effectiveness
     */
    analyzeResponseEffectiveness(data) {
        const { userId, query, response, context } = data;
        
        // This would analyze how well the contextual response addressed the user's needs
        // For now, we'll just log the analysis
        console.log(`📈 Response effectiveness analysis for user ${userId}:`, {
            queryLength: query.length,
            responseLength: response.text.length,
            contextUsed: context.relationship !== 'No specific relationship detected',
            suggestionsProvided: response.suggestions.length
        });
    }

    // Helper methods
    generateInterventionId() {
        return `intervention_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    generateMissionId() {
        return `mission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    getRecentInterventions(userId, timeWindow) {
        const history = this.interventionHistory.get(userId) || [];
        const cutoff = Date.now() - timeWindow;
        return history.filter(intervention => intervention.startTime > cutoff);
    }

    serializeUserState(userState) {
        return {
            physiological: { ...userState.physiological },
            behavioral: { ...userState.behavioral },
            contextual: { ...userState.contextual },
            selfAwareness: { ...userState.selfAwareness }
        };
    }

    /**
     * Get feedback loop statistics
     */
    getStats() {
        const totalInterventions = Array.from(this.interventionHistory.values())
            .reduce((sum, history) => sum + history.length, 0);
        
        const activeInterventions = Array.from(this.activeInterventions.values())
            .reduce((sum, interventions) => sum + interventions.length, 0);

        return {
            totalInterventions,
            activeInterventions,
            interventionStrategies: this.interventionStrategies.size,
            missionTemplates: this.missionTemplates.size,
            totalUsers: this.interventionHistory.size
        };
    }
}

module.exports = BehavioralFeedbackLoop;
