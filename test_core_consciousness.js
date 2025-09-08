/**
 * Test Script for Damasio's Core Consciousness Implementation
 * 
 * This script tests all three phases of the Core Consciousness system:
 * 1. Self-Model as Data Construct
 * 2. Context-Aware Dialogue
 * 3. Behavioral Feedback Loop
 */

const http = require('http');

class CoreConsciousnessTester {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.testUserId = 'test_user_001';
        this.testResults = [];
    }

    async runAllTests() {
        console.log('🧠 Testing Damasio\'s Core Consciousness Implementation');
        console.log('='.repeat(60));

        try {
            // Phase 1: Self-Model Testing
            await this.testSelfModelSystem();
            
            // Phase 2: Context-Aware Dialogue Testing
            await this.testContextAwareDialogue();
            
            // Phase 3: Behavioral Feedback Loop Testing
            await this.testBehavioralFeedbackLoop();
            
            // Integration Testing
            await this.testSystemIntegration();
            
            // Generate Test Report
            this.generateTestReport();
            
        } catch (error) {
            console.error('❌ Test suite failed:', error);
        }
    }

    async testSelfModelSystem() {
        console.log('\n📊 Phase 1: Testing Self-Model System');
        console.log('-'.repeat(40));

        // Test 1: Update user state with sensor data
        await this.testUpdateUserStateWithSensorData();
        
        // Test 2: Update user state with dialogue data
        await this.testUpdateUserStateWithDialogueData();
        
        // Test 3: Retrieve user state
        await this.testRetrieveUserState();
        
        // Test 4: Sensor connection
        await this.testSensorConnection();
    }

    async testContextAwareDialogue() {
        console.log('\n💬 Phase 2: Testing Context-Aware Dialogue');
        console.log('-'.repeat(40));

        // Test 1: Generate contextual response for stressed user
        await this.testContextualResponseStressed();
        
        // Test 2: Generate contextual response for low energy user
        await this.testContextualResponseLowEnergy();
        
        // Test 3: Generate contextual response for late night
        await this.testContextualResponseLateNight();
    }

    async testBehavioralFeedbackLoop() {
        console.log('\n🔄 Phase 3: Testing Behavioral Feedback Loop');
        console.log('-'.repeat(40));

        // Test 1: Check intervention status
        await this.testInterventionStatus();
        
        // Test 2: Trigger stress management intervention
        await this.testTriggerStressIntervention();
        
        // Test 3: Trigger energy boost intervention
        await this.testTriggerEnergyIntervention();
    }

    async testSystemIntegration() {
        console.log('\n🔗 Integration Testing');
        console.log('-'.repeat(40));

        // Test 1: End-to-end consciousness flow
        await this.testEndToEndFlow();
        
        // Test 2: System status
        await this.testSystemStatus();
    }

    // Self-Model Test Methods
    async testUpdateUserStateWithSensorData() {
        try {
            const sensorData = {
                sensorData: {
                    heartRate: 95, // Elevated heart rate
                    sleepDuration: 5.5, // Insufficient sleep
                    steps: 3500, // Low activity
                    stressLevel: 0.8 // High stress
                }
            };

            const result = await this.makeRequest('POST', '/api/consciousness/self-model/update', {
                userId: this.testUserId,
                inputData: sensorData
            });

            this.recordTest('Update User State with Sensor Data', result.success, 
                result.success ? '✅ User state updated with sensor data' : '❌ Failed to update user state');

        } catch (error) {
            this.recordTest('Update User State with Sensor Data', false, `❌ Error: ${error.message}`);
        }
    }

    async testUpdateUserStateWithDialogueData() {
        try {
            const dialogueData = {
                dialogueData: {
                    text: "I'm feeling really stressed and overwhelmed today. I can't focus on anything.",
                    sessionLength: 1200, // 20 minutes
                    commands: ['help', 'stress', 'focus']
                }
            };

            const result = await this.makeRequest('POST', '/api/consciousness/self-model/update', {
                userId: this.testUserId,
                inputData: dialogueData
            });

            this.recordTest('Update User State with Dialogue Data', result.success, 
                result.success ? '✅ User state updated with dialogue analysis' : '❌ Failed to update user state');

        } catch (error) {
            this.recordTest('Update User State with Dialogue Data', false, `❌ Error: ${error.message}`);
        }
    }

    async testRetrieveUserState() {
        try {
            const result = await this.makeRequest('GET', `/api/consciousness/self-model/${this.testUserId}`);

            if (result.success && result.data) {
                const state = result.data;
                const hasPhysiological = state.physiological && Object.keys(state.physiological).length > 0;
                const hasBehavioral = state.behavioral && Object.keys(state.behavioral).length > 0;
                const hasRelationships = state.relationships && state.relationships.length > 0;

                this.recordTest('Retrieve User State', true, 
                    `✅ User state retrieved - Physiological: ${hasPhysiological}, Behavioral: ${hasBehavioral}, Relationships: ${hasRelationships}`);
            } else {
                this.recordTest('Retrieve User State', false, '❌ Failed to retrieve user state');
            }

        } catch (error) {
            this.recordTest('Retrieve User State', false, `❌ Error: ${error.message}`);
        }
    }

    async testSensorConnection() {
        try {
            const result = await this.makeRequest('POST', '/api/consciousness/sensors/connect', {
                userId: this.testUserId,
                sensorType: 'mock_sensor'
            });

            this.recordTest('Sensor Connection', result.success, 
                result.success ? '✅ Mock sensor connected successfully' : '❌ Failed to connect sensor');

        } catch (error) {
            this.recordTest('Sensor Connection', false, `❌ Error: ${error.message}`);
        }
    }

    // Context-Aware Dialogue Test Methods
    async testContextualResponseStressed() {
        try {
            const result = await this.makeRequest('POST', '/api/consciousness/dialogue/generate', {
                userId: this.testUserId,
                userQuery: "I'm having trouble focusing on my work today",
                baseResponse: "I understand you're having focus issues. Let me help you with that."
            });

            if (result.success && result.data) {
                const response = result.data;
                const hasContext = response.context && response.context.userState !== 'No state data available';
                const hasSuggestions = response.suggestions && response.suggestions.length > 0;

                this.recordTest('Contextual Response (Stressed)', true, 
                    `✅ Contextual response generated - Context: ${hasContext}, Suggestions: ${hasSuggestions}`);
            } else {
                this.recordTest('Contextual Response (Stressed)', false, '❌ Failed to generate contextual response');
            }

        } catch (error) {
            this.recordTest('Contextual Response (Stressed)', false, `❌ Error: ${error.message}`);
        }
    }

    async testContextualResponseLowEnergy() {
        try {
            // First update user state to low energy
            await this.makeRequest('POST', '/api/consciousness/self-model/update', {
                userId: this.testUserId,
                inputData: {
                    sensorData: {
                        energyLevel: 0.2, // Very low energy
                        sleepDuration: 4.0 // Very little sleep
                    }
                }
            });

            const result = await this.makeRequest('POST', '/api/consciousness/dialogue/generate', {
                userId: this.testUserId,
                userQuery: "I feel so tired and unmotivated",
                baseResponse: "I can help you with that."
            });

            if (result.success && result.data) {
                const response = result.data;
                const hasEnergyAwareness = response.text.includes('energy') || response.text.includes('tired');
                const hasSuggestions = response.suggestions && response.suggestions.length > 0;

                this.recordTest('Contextual Response (Low Energy)', true, 
                    `✅ Energy-aware response generated - Energy awareness: ${hasEnergyAwareness}, Suggestions: ${hasSuggestions}`);
            } else {
                this.recordTest('Contextual Response (Low Energy)', false, '❌ Failed to generate contextual response');
            }

        } catch (error) {
            this.recordTest('Contextual Response (Low Energy)', false, `❌ Error: ${error.message}`);
        }
    }

    async testContextualResponseLateNight() {
        try {
            const result = await this.makeRequest('POST', '/api/consciousness/dialogue/generate', {
                userId: this.testUserId,
                userQuery: "I'm working late tonight",
                baseResponse: "I understand you're working late."
            });

            if (result.success && result.data) {
                const response = result.data;
                const hasTemporalAwareness = response.text.includes('late') || response.text.includes('rest');
                const hasSuggestions = response.suggestions && response.suggestions.length > 0;

                this.recordTest('Contextual Response (Late Night)', true, 
                    `✅ Temporal-aware response generated - Temporal awareness: ${hasTemporalAwareness}, Suggestions: ${hasSuggestions}`);
            } else {
                this.recordTest('Contextual Response (Late Night)', false, '❌ Failed to generate contextual response');
            }

        } catch (error) {
            this.recordTest('Contextual Response (Late Night)', false, `❌ Error: ${error.message}`);
        }
    }

    // Behavioral Feedback Loop Test Methods
    async testInterventionStatus() {
        try {
            const result = await this.makeRequest('GET', `/api/consciousness/interventions/${this.testUserId}`);

            this.recordTest('Intervention Status', result.success, 
                result.success ? '✅ Intervention status retrieved successfully' : '❌ Failed to retrieve intervention status');

        } catch (error) {
            this.recordTest('Intervention Status', false, `❌ Error: ${error.message}`);
        }
    }

    async testTriggerStressIntervention() {
        try {
            const result = await this.makeRequest('POST', '/api/consciousness/interventions/trigger', {
                userId: this.testUserId,
                strategyType: 'stress_management'
            });

            this.recordTest('Trigger Stress Intervention', result.success, 
                result.success ? '✅ Stress management intervention triggered' : '❌ Failed to trigger intervention');

        } catch (error) {
            this.recordTest('Trigger Stress Intervention', false, `❌ Error: ${error.message}`);
        }
    }

    async testTriggerEnergyIntervention() {
        try {
            const result = await this.makeRequest('POST', '/api/consciousness/interventions/trigger', {
                userId: this.testUserId,
                strategyType: 'energy_boost'
            });

            this.recordTest('Trigger Energy Intervention', result.success, 
                result.success ? '✅ Energy boost intervention triggered' : '❌ Failed to trigger intervention');

        } catch (error) {
            this.recordTest('Trigger Energy Intervention', false, `❌ Error: ${error.message}`);
        }
    }

    // Integration Test Methods
    async testEndToEndFlow() {
        try {
            // Step 1: Update user state
            await this.makeRequest('POST', '/api/consciousness/self-model/update', {
                userId: this.testUserId,
                inputData: {
                    sensorData: { heartRate: 100, stressLevel: 0.9 },
                    dialogueData: { text: "I'm extremely stressed and can't think clearly" }
                }
            });

            // Step 2: Generate contextual response
            const dialogueResult = await this.makeRequest('POST', '/api/consciousness/dialogue/generate', {
                userId: this.testUserId,
                userQuery: "Help me calm down",
                baseResponse: "I'll help you calm down."
            });

            // Step 3: Check for interventions
            const interventionResult = await this.makeRequest('GET', `/api/consciousness/interventions/${this.testUserId}`);

            const success = dialogueResult.success && interventionResult.success;
            this.recordTest('End-to-End Flow', success, 
                success ? '✅ Complete consciousness flow working' : '❌ End-to-end flow failed');

        } catch (error) {
            this.recordTest('End-to-End Flow', false, `❌ Error: ${error.message}`);
        }
    }

    async testSystemStatus() {
        try {
            const result = await this.makeRequest('GET', '/api/consciousness/status');

            if (result.success && result.data) {
                const status = result.data;
                const hasSelfModel = status.selfModel && status.selfModel.active;
                const hasDialogue = status.dialogue && status.dialogue.active;
                const hasFeedbackLoop = status.feedbackLoop && status.feedbackLoop.active;

                this.recordTest('System Status', true, 
                    `✅ System status retrieved - Self-Model: ${hasSelfModel}, Dialogue: ${hasDialogue}, Feedback Loop: ${hasFeedbackLoop}`);
            } else {
                this.recordTest('System Status', false, '❌ Failed to retrieve system status');
            }

        } catch (error) {
            this.recordTest('System Status', false, `❌ Error: ${error.message}`);
        }
    }

    // Utility Methods
    async makeRequest(method, path, data = null) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: path,
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'X-Bypass-Auth': 'true' // Bypass authentication for testing
                }
            };

            const req = http.request(options, (res) => {
                let responseData = '';

                res.on('data', (chunk) => {
                    responseData += chunk;
                });

                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(responseData);
                        resolve(parsedData);
                    } catch (error) {
                        reject(new Error(`Failed to parse response: ${error.message}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(error);
            });

            if (data) {
                req.write(JSON.stringify(data));
            }

            req.end();
        });
    }

    recordTest(testName, success, message) {
        this.testResults.push({ testName, success, message });
        console.log(`${success ? '✅' : '❌'} ${testName}: ${message}`);
    }

    generateTestReport() {
        console.log('\n' + '='.repeat(60));
        console.log('🧠 CORE CONSCIOUSNESS TEST REPORT');
        console.log('='.repeat(60));

        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(test => test.success).length;
        const failedTests = totalTests - passedTests;

        console.log(`\n📊 Test Summary:`);
        console.log(`   Total Tests: ${totalTests}`);
        console.log(`   Passed: ${passedTests} ✅`);
        console.log(`   Failed: ${failedTests} ❌`);
        console.log(`   Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

        if (failedTests > 0) {
            console.log(`\n❌ Failed Tests:`);
            this.testResults
                .filter(test => !test.success)
                .forEach(test => console.log(`   - ${test.testName}: ${test.message}`));
        }

        console.log(`\n🎯 Phase Results:`);
        const phases = [
            { name: 'Phase 1: Self-Model System', tests: this.testResults.slice(0, 4) },
            { name: 'Phase 2: Context-Aware Dialogue', tests: this.testResults.slice(4, 7) },
            { name: 'Phase 3: Behavioral Feedback Loop', tests: this.testResults.slice(7, 10) },
            { name: 'Integration Testing', tests: this.testResults.slice(10) }
        ];

        phases.forEach(phase => {
            const phasePassed = phase.tests.filter(test => test.success).length;
            const phaseTotal = phase.tests.length;
            const phaseSuccess = phaseTotal > 0 ? ((phasePassed / phaseTotal) * 100).toFixed(1) : 0;
            console.log(`   ${phase.name}: ${phasePassed}/${phaseTotal} (${phaseSuccess}%)`);
        });

        console.log('\n' + '='.repeat(60));
        
        if (passedTests === totalTests) {
            console.log('🎉 ALL TESTS PASSED! Core Consciousness system is working correctly.');
        } else {
            console.log('⚠️  Some tests failed. Please check the implementation.');
        }
        
        console.log('='.repeat(60));
    }
}

// Run the tests
if (require.main === module) {
    const tester = new CoreConsciousnessTester();
    tester.runAllTests().catch(console.error);
}

module.exports = CoreConsciousnessTester;
