/**
 * Context-Aware Dialogue System - Damasio's Core Consciousness Phase 2
 * 
 * Implements the "Object" and "Relationship" components of Core Consciousness
 * by integrating the self-model with external conversation context.
 * 
 * This system makes AI responses contextual and "self-aware" by linking
 * the AI's "self-model" of the user's state to the external conversation.
 */

const EventEmitter = require('events');

class ContextAwareDialogue extends EventEmitter {
    constructor(selfModelManager) {
        super();
        this.selfModelManager = selfModelManager;
        this.dialogueHistory = new Map(); // userId -> conversation history
        this.contextualPrompts = new Map(); // userId -> contextual prompts
        this.relationshipMappings = new Map(); // relationship type -> response strategy
        
        this.initializeRelationshipMappings();
        this.setupEventListeners();
        
        console.log('💬 Context-Aware Dialogue System initialized (Damasio Phase 2)');
    }

    /**
     * Initialize relationship mappings for different types of user states
     */
    initializeRelationshipMappings() {
        // High stress -> empathetic, calming responses
        this.relationshipMappings.set('high_stress_affects_attention', {
            responseStrategy: 'empathetic',
            tone: 'calm',
            suggestions: ['breathing_exercise', 'mindfulness', 'break_suggestion'],
            language: 'supportive'
        });

        // Low energy -> energizing, motivational responses
        this.relationshipMappings.set('low_energy_affects_emotion', {
            responseStrategy: 'motivational',
            tone: 'encouraging',
            suggestions: ['energy_boost', 'light_activity', 'nutrition_tip'],
            language: 'uplifting'
        });

        // Stress affects activity -> activity modification suggestions
        this.relationshipMappings.set('stress_affects_activity', {
            responseStrategy: 'adaptive',
            tone: 'understanding',
            suggestions: ['activity_modification', 'stress_management', 'priority_adjustment'],
            language: 'flexible'
        });

        // Late hour affects energy -> rest suggestions
        this.relationshipMappings.set('late_hour_affects_energy', {
            responseStrategy: 'restful',
            tone: 'gentle',
            suggestions: ['rest_encouragement', 'sleep_hygiene', 'wind_down'],
            language: 'caring'
        });
    }

    /**
     * Setup event listeners for self-model changes
     */
    setupEventListeners() {
        this.selfModelManager.on('stateChanged', (data) => {
            this.handleStateChange(data);
        });

        this.selfModelManager.on('periodicUpdate', (data) => {
            this.handlePeriodicUpdate(data);
        });
    }

    /**
     * Generate context-aware response based on user state and query
     */
    async generateContextualResponse(userId, userQuery, baseResponse = null) {
        try {
            // Get current user state from self-model
            const userState = this.selfModelManager.getCurrentUserState(userId);
            if (!userState) {
                return this.generateDefaultResponse(userQuery);
            }

            // Analyze the relationship between user state and query
            const contextualAnalysis = await this.analyzeContextualRelationship(userState, userQuery);
            
            // Generate contextual response
            const contextualResponse = await this.buildContextualResponse(
                userQuery, 
                userState, 
                contextualAnalysis, 
                baseResponse
            );

            // Update dialogue history
            this.updateDialogueHistory(userId, userQuery, contextualResponse, userState);

            // Emit response generated event
            this.emit('responseGenerated', {
                userId,
                query: userQuery,
                response: contextualResponse,
                context: contextualAnalysis
            });

            return contextualResponse;
        } catch (error) {
            console.error('Error generating contextual response:', error);
            return this.generateDefaultResponse(userQuery);
        }
    }

    /**
     * Analyze the relationship between user state and query
     */
    async analyzeContextualRelationship(userState, userQuery) {
        const analysis = {
            primaryRelationship: null,
            secondaryRelationships: [],
            emotionalContext: this.detectEmotionalContext(userQuery),
            urgencyLevel: this.detectUrgencyLevel(userQuery),
            interventionNeeded: false,
            suggestedActions: []
        };

        // Check for primary relationships from knowledge graph
        userState.relationships.forEach((relationship, key) => {
            if (relationship.strength > 0.6) {
                if (!analysis.primaryRelationship) {
                    analysis.primaryRelationship = relationship;
                } else {
                    analysis.secondaryRelationships.push(relationship);
                }
            }
        });

        // Determine if intervention is needed
        analysis.interventionNeeded = this.determineInterventionNeeded(userState, userQuery);
        
        // Generate suggested actions
        analysis.suggestedActions = this.generateSuggestedActions(userState, analysis);

        return analysis;
    }

    /**
     * Build contextual response based on analysis
     */
    async buildContextualResponse(userQuery, userState, analysis, baseResponse) {
        let contextualResponse = {
            text: baseResponse || '',
            context: {
                userState: userState.summary,
                relationship: analysis.primaryRelationship?.description || 'No specific relationship detected',
                emotionalContext: analysis.emotionalContext,
                urgencyLevel: analysis.urgencyLevel
            },
            suggestions: analysis.suggestedActions,
            selfAwareness: {
                confidence: userState.selfAwareness.confidence,
                coherence: userState.selfAwareness.coherence
            }
        };

        // Apply relationship-based modifications
        if (analysis.primaryRelationship) {
            const mapping = this.relationshipMappings.get(analysis.primaryRelationship.type);
            if (mapping) {
                contextualResponse = this.applyRelationshipMapping(
                    contextualResponse, 
                    mapping, 
                    userState, 
                    analysis
                );
            }
        }

        // Add contextual awareness to the response text
        contextualResponse.text = this.enhanceResponseWithContext(
            contextualResponse.text,
            userState,
            analysis
        );

        return contextualResponse;
    }

    /**
     * Apply relationship mapping to response
     */
    applyRelationshipMapping(response, mapping, userState, analysis) {
        // Modify response tone and content based on relationship
        switch (mapping.responseStrategy) {
            case 'empathetic':
                response.text = this.addEmpatheticContext(response.text, userState);
                break;
            case 'motivational':
                response.text = this.addMotivationalContext(response.text, userState);
                break;
            case 'adaptive':
                response.text = this.addAdaptiveContext(response.text, userState);
                break;
            case 'restful':
                response.text = this.addRestfulContext(response.text, userState);
                break;
        }

        // Add relationship-specific suggestions
        response.suggestions = [...response.suggestions, ...mapping.suggestions];

        return response;
    }

    /**
     * Enhance response text with contextual awareness
     */
    enhanceResponseWithContext(baseText, userState, analysis) {
        let enhancedText = baseText;

        // Add physiological context
        if (userState.physiological.stressLevel > 0.7) {
            enhancedText = this.addStressAwareness(enhancedText, userState);
        }

        if (userState.physiological.energyLevel < 0.3) {
            enhancedText = this.addEnergyAwareness(enhancedText, userState);
        }

        if (userState.physiological.sleepDuration < 6) {
            enhancedText = this.addSleepAwareness(enhancedText, userState);
        }

        // Add behavioral context
        if (userState.behavioral.emotionalState === 'stressed') {
            enhancedText = this.addEmotionalAwareness(enhancedText, userState);
        }

        if (userState.behavioral.attentionLevel === 'distracted') {
            enhancedText = this.addAttentionAwareness(enhancedText, userState);
        }

        // Add temporal context
        if (userState.contextual.temporalContext === 'late_night') {
            enhancedText = this.addTemporalAwareness(enhancedText, userState);
        }

        return enhancedText;
    }

    // Context enhancement methods
    addStressAwareness(text, userState) {
        const stressLevel = userState.physiological.stressLevel;
        if (stressLevel > 0.8) {
            return `I notice you might be feeling quite stressed right now. ${text} Would you like to try a quick breathing exercise to help you feel more centered?`;
        } else if (stressLevel > 0.6) {
            return `I can sense some stress in your current state. ${text} Let me know if you'd like some help managing this.`;
        }
        return text;
    }

    addEnergyAwareness(text, userState) {
        const energyLevel = userState.physiological.energyLevel;
        if (energyLevel < 0.2) {
            return `You seem to be quite low on energy. ${text} Perhaps we could try something lighter or take a break?`;
        } else if (energyLevel < 0.4) {
            return `I notice your energy levels are a bit low. ${text} Would you like some suggestions to help boost your energy?`;
        }
        return text;
    }

    addSleepAwareness(text, userState) {
        const sleepDuration = userState.physiological.sleepDuration;
        if (sleepDuration < 5) {
            return `I see you only got ${sleepDuration} hours of sleep last night. ${text} This might be affecting your focus today.`;
        } else if (sleepDuration < 7) {
            return `With ${sleepDuration} hours of sleep, you might want to take it easy today. ${text}`;
        }
        return text;
    }

    addEmotionalAwareness(text, userState) {
        return `I can sense you're feeling ${userState.behavioral.emotionalState} right now. ${text} Is there anything specific that's troubling you?`;
    }

    addAttentionAwareness(text, userState) {
        return `I notice you might be having trouble focusing. ${text} Would you like to try a concentration exercise?`;
    }

    addTemporalAwareness(text, userState) {
        return `It's quite late, and I want to make sure you're taking care of yourself. ${text} Don't forget to get some rest soon.`;
    }

    // Empathetic context methods
    addEmpatheticContext(text, userState) {
        return `I understand this might be challenging for you right now. ${text} I'm here to support you through this.`;
    }

    addMotivationalContext(text, userState) {
        return `I believe in your ability to handle this. ${text} You've got this!`;
    }

    addAdaptiveContext(text, userState) {
        return `Let's work together to find the best approach for your current situation. ${text} We can adjust as needed.`;
    }

    addRestfulContext(text, userState) {
        return `It's important to take care of yourself. ${text} Remember, rest is just as important as productivity.`;
    }

    // Analysis helper methods
    detectEmotionalContext(query) {
        const lowerQuery = query.toLowerCase();
        if (lowerQuery.includes('stressed') || lowerQuery.includes('overwhelmed')) {
            return 'stressed';
        }
        if (lowerQuery.includes('tired') || lowerQuery.includes('exhausted')) {
            return 'fatigued';
        }
        if (lowerQuery.includes('excited') || lowerQuery.includes('motivated')) {
            return 'energetic';
        }
        if (lowerQuery.includes('sad') || lowerQuery.includes('down')) {
            return 'low';
        }
        return 'neutral';
    }

    detectUrgencyLevel(query) {
        const urgentWords = ['urgent', 'asap', 'immediately', 'emergency', 'help'];
        const lowerQuery = query.toLowerCase();
        
        if (urgentWords.some(word => lowerQuery.includes(word))) {
            return 'high';
        }
        if (lowerQuery.includes('soon') || lowerQuery.includes('quickly')) {
            return 'medium';
        }
        return 'low';
    }

    determineInterventionNeeded(userState, query) {
        // High stress + urgent query = intervention needed
        if (userState.physiological.stressLevel > 0.8 && this.detectUrgencyLevel(query) === 'high') {
            return true;
        }
        
        // Low energy + complex query = intervention needed
        if (userState.physiological.energyLevel < 0.3 && query.length > 100) {
            return true;
        }
        
        // Multiple stress indicators = intervention needed
        if (userState.behavioral.stressIndicators.length > 2) {
            return true;
        }
        
        return false;
    }

    generateSuggestedActions(userState, analysis) {
        const suggestions = [];
        
        // Physiological-based suggestions
        if (userState.physiological.stressLevel > 0.7) {
            suggestions.push('Try a 5-minute breathing exercise');
            suggestions.push('Take a short walk to clear your mind');
        }
        
        if (userState.physiological.energyLevel < 0.3) {
            suggestions.push('Have a healthy snack to boost energy');
            suggestions.push('Take a 10-minute break');
        }
        
        if (userState.physiological.sleepDuration < 6) {
            suggestions.push('Consider going to bed earlier tonight');
            suggestions.push('Try a power nap if possible');
        }
        
        // Behavioral-based suggestions
        if (userState.behavioral.attentionLevel === 'distracted') {
            suggestions.push('Try the Pomodoro technique for focus');
            suggestions.push('Minimize distractions in your environment');
        }
        
        // Temporal-based suggestions
        if (userState.contextual.temporalContext === 'late_night') {
            suggestions.push('Consider winding down for the evening');
            suggestions.push('Prepare for tomorrow to reduce morning stress');
        }
        
        return suggestions.slice(0, 3); // Limit to top 3 suggestions
    }

    /**
     * Update dialogue history
     */
    updateDialogueHistory(userId, query, response, userState) {
        if (!this.dialogueHistory.has(userId)) {
            this.dialogueHistory.set(userId, []);
        }
        
        const history = this.dialogueHistory.get(userId);
        history.push({
            timestamp: Date.now(),
            query,
            response: response.text,
            context: userState.summary,
            relationships: Array.from(userState.relationships.keys())
        });
        
        // Keep only last 50 interactions
        if (history.length > 50) {
            history.shift();
        }
    }

    /**
     * Handle state change events
     */
    handleStateChange(data) {
        const { userId, state } = data;
        
        // Generate contextual prompt based on state change
        const prompt = this.generateContextualPrompt(state);
        this.contextualPrompts.set(userId, prompt);
        
        // Emit state change event
        this.emit('stateChangeDetected', { userId, state, prompt });
    }

    /**
     * Handle periodic updates
     */
    handlePeriodicUpdate(data) {
        const { userId, state } = data;
        
        // Check if proactive intervention is needed
        if (this.shouldProactiveIntervention(state)) {
            const intervention = this.generateProactiveIntervention(state);
            this.emit('proactiveIntervention', { userId, intervention });
        }
    }

    /**
     * Generate contextual prompt based on state
     */
    generateContextualPrompt(userState) {
        const prompts = [];
        
        if (userState.physiological.stressLevel > 0.8) {
            prompts.push("I notice you're quite stressed. Would you like to talk about what's on your mind?");
        }
        
        if (userState.physiological.energyLevel < 0.3) {
            prompts.push("You seem low on energy. How about we try something lighter?");
        }
        
        if (userState.behavioral.emotionalState === 'stressed') {
            prompts.push("I can sense some emotional stress. Is there anything I can help you with?");
        }
        
        return prompts.length > 0 ? prompts[0] : null;
    }

    /**
     * Check if proactive intervention is needed
     */
    shouldProactiveIntervention(userState) {
        // High stress for extended period
        if (userState.physiological.stressLevel > 0.8) {
            return true;
        }
        
        // Very low energy
        if (userState.physiological.energyLevel < 0.2) {
            return true;
        }
        
        // Multiple stress indicators
        if (userState.behavioral.stressIndicators.length > 3) {
            return true;
        }
        
        return false;
    }

    /**
     * Generate proactive intervention
     */
    generateProactiveIntervention(userState) {
        return {
            type: 'wellness_check',
            message: "I've noticed some patterns in your current state that suggest you might benefit from some support. How are you feeling right now?",
            suggestions: this.generateSuggestedActions(userState, {})
        };
    }

    /**
     * Generate default response when no context is available
     */
    generateDefaultResponse(query) {
        return {
            text: `I understand you're asking about: "${query}". I'm here to help, though I don't have much context about your current state. Could you tell me more about how you're feeling right now?`,
            context: {
                userState: 'No state data available',
                relationship: 'No relationship detected',
                emotionalContext: 'unknown',
                urgencyLevel: 'low'
            },
            suggestions: ['Share how you\'re feeling', 'Tell me about your current situation'],
            selfAwareness: {
                confidence: 0.1,
                coherence: 0.1
            }
        };
    }

    /**
     * Get dialogue statistics
     */
    getStats() {
        return {
            totalUsers: this.dialogueHistory.size,
            totalInteractions: Array.from(this.dialogueHistory.values())
                .reduce((sum, history) => sum + history.length, 0),
            activeContextualPrompts: this.contextualPrompts.size,
            relationshipMappings: this.relationshipMappings.size
        };
    }
}

module.exports = ContextAwareDialogue;
