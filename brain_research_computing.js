const crypto = require('crypto');
const path = require('path');
const fs = require('fs').promises;

class BrainResearchComputingManager {
    constructor() {
        this.activeJobs = new Map();
        this.completedJobs = new Map();
        this.userContributions = new Map();
        this.jobQueue = [];
        this.maxConcurrentJobs = 100;
        this.jobTimeout = 300000; // 5 minutes
        this.verificationThreshold = 3; // Number of users needed for verification
        
        // New Collective Brain Modeling features
        this.userSubmittedJobs = new Map();
        this.jobTemplates = new Map();
        this.creditSystem = new Map();
        this.scheduler = null;
        this.policyEngine = null;
        
        this.initializeJobTypes();
        this.initializeComputingTasks();
        this.initializeJobTemplates();
        this.initializeCreditSystem();
        this.initializeScheduler();
        this.initializePolicyEngine();
    }

    initializeJobTypes() {
        this.jobTypes = {
            'neuron_simulation': {
                name: 'Neuron Network Simulation',
                description: 'Simulate small neural networks for Alzheimer\'s research',
                complexity: 'medium',
                estimatedTime: 30000, // 30 seconds
                gpuRequired: true
            },
            'protein_interaction': {
                name: 'Protein Interaction Analysis',
                description: 'Analyze amyloid-beta and tau protein interactions',
                complexity: 'high',
                estimatedTime: 60000, // 1 minute
                gpuRequired: true
            },
            'synaptic_plasticity': {
                name: 'Synaptic Plasticity Modeling',
                description: 'Model synaptic strength changes in dementia',
                complexity: 'medium',
                estimatedTime: 45000, // 45 seconds
                gpuRequired: false
            },
            'molecular_dynamics': {
                name: 'Molecular Dynamics Simulation',
                description: 'Simulate molecular behavior in brain tissue',
                complexity: 'high',
                estimatedTime: 90000, // 1.5 minutes
                gpuRequired: true
            },
            // 🧬 Multi-Scale Brain Modeling 작업 추가
            'microscopic_modeling': {
                name: 'Microscopic Brain Modeling',
                description: 'Individual neuron and synapse modeling with Hodgkin-Huxley equations',
                complexity: 'high',
                estimatedTime: 45000, // 45 seconds
                gpuRequired: false
            },
            'mesoscopic_modeling': {
                name: 'Mesoscopic Brain Modeling',
                description: 'Brain region connectivity simulation with Wilson-Cowan model',
                complexity: 'high',
                estimatedTime: 60000, // 1 minute
                gpuRequired: false
            },
            'macroscopic_modeling': {
                name: 'Macroscopic Brain Modeling',
                description: 'Whole brain network dynamics and consciousness modeling',
                complexity: 'very_high',
                estimatedTime: 90000, // 1.5 minutes
                gpuRequired: false
            }
        };
    }

    initializeComputingTasks() {
        this.computingTasks = {
            'neuron_simulation': {
                algorithm: 'neural_network_forward_pass',
                parameters: {
                    layers: [10, 8, 6, 4],
                    activation: 'relu',
                    input_size: 10,
                    batch_size: 32
                },
                validation: 'cross_entropy_loss'
            },
            'protein_interaction': {
                algorithm: 'molecular_docking',
                parameters: {
                    protein_a: 'amyloid_beta',
                    protein_b: 'tau_protein',
                    binding_sites: 5,
                    energy_threshold: -7.0
                },
                validation: 'binding_affinity_score'
            },
            'synaptic_plasticity': {
                algorithm: 'hebbian_learning',
                parameters: {
                    learning_rate: 0.01,
                    plasticity_window: 100,
                    synapse_count: 1000
                },
                validation: 'synaptic_strength_change'
            },
            'molecular_dynamics': {
                algorithm: 'langevin_dynamics',
                parameters: {
                    timestep: 0.001,
                    temperature: 310,
                    particle_count: 500
                },
                validation: 'energy_conservation'
            },
            // 🧬 Multi-Scale Brain Modeling 작업 추가
            'microscopic_modeling': {
                algorithm: 'hodgkin_huxley_model',
                parameters: {
                    neuronType: 'pyramidal',
                    simulationTime: 1000,
                    timeStep: 0.1,
                    stimulus: { type: 'current_injection', amplitude: 50, duration: 100 }
                },
                validation: 'membrane_potential_consistency'
            },
            'mesoscopic_modeling': {
                algorithm: 'wilson_cowan_model',
                parameters: {
                    regions: ['prefrontal_cortex', 'motor_cortex', 'somatosensory_cortex'],
                    simulationTime: 5000,
                    timeStep: 1,
                    externalStimulus: { region: 'prefrontal_cortex', strength: 0.5, duration: 1000 }
                },
                validation: 'region_activity_consistency'
            },
            'macroscopic_modeling': {
                algorithm: 'global_brain_dynamics',
                parameters: {
                    simulationTime: 10000,
                    timeStep: 10,
                    globalStimulus: { type: 'sensory_input', strength: 0.3, duration: 2000 },
                    consciousnessLevel: 0.8
                },
                validation: 'consciousness_index_consistency'
            }
        };
    }

    initializeJobTemplates() {
        this.jobTemplates = new Map([
            ['hippocampus_microcircuit', {
                id: 'hippocampus_microcircuit',
                name: 'Hippocampus Microcircuit Dynamics',
                description: 'Simulate microcircuit dynamics in hippocampal CA1 region',
                category: 'neural_network',
                complexity: 'high',
                estimatedTime: 120000, // 2 minutes
                gpuRequired: true,
                parameters: {
                    neuron_count: 1000,
                    connection_density: 0.1,
                    simulation_time: 1000,
                    plasticity_enabled: true
                },
                validation: 'spike_timing_consistency',
                scientific_background: 'Based on CA1 microcircuit studies in Alzheimer\'s research',
                references: ['HBP EU', 'KAIST Bioeng', 'KIST']
            }],
            ['amyloid_aggregation', {
                id: 'amyloid_aggregation',
                name: 'Aβ Aggregation Toy Simulation',
                description: 'Coarse-grained molecular dynamics of amyloid-beta aggregation',
                category: 'molecular_dynamics',
                complexity: 'medium',
                estimatedTime: 90000, // 1.5 minutes
                gpuRequired: true,
                parameters: {
                    particle_count: 100,
                    timestep: 0.001,
                    temperature: 310,
                    aggregation_strength: 0.5
                },
                validation: 'aggregation_kinetics',
                scientific_background: 'Simplified model of amyloid-beta oligomer formation',
                references: ['YNA 2025', 'Dongascience']
            }],
            ['eeg_spectral_pipeline', {
                id: 'eeg_spectral_pipeline',
                name: 'EEG Spectral Analysis Pipeline',
                description: 'Feature extraction and denoising from EEG signals',
                category: 'signal_processing',
                complexity: 'low',
                estimatedTime: 60000, // 1 minute
                gpuRequired: false,
                parameters: {
                    sampling_rate: 1000,
                    window_size: 1024,
                    frequency_bands: ['delta', 'theta', 'alpha', 'beta', 'gamma'],
                    denoising_method: 'wavelet'
                },
                validation: 'spectral_power_consistency',
                scientific_background: 'Standard EEG preprocessing for dementia research',
                references: ['HBP EU', 'KAIST Bioeng']
            }]
        ]);
    }

    initializeCreditSystem() {
        this.creditSystem = {
            baseCredits: 100, // Starting credits for new users
            earnRates: {
                'neuron_simulation': 10,
                'protein_interaction': 15,
                'synaptic_plasticity': 12,
                'molecular_dynamics': 18,
                'hippocampus_microcircuit': 25,
                'amyloid_aggregation': 20,
                'eeg_spectral_pipeline': 8
            },
            spendRates: {
                'hippocampus_microcircuit': 50,
                'amyloid_aggregation': 40,
                'eeg_spectral_pipeline': 20
            },
            bonusMultipliers: {
                'high_priority': 1.5,
                'verification_success': 1.2,
                'streak_bonus': 1.1
            }
        };
    }

    initializeScheduler() {
        this.scheduler = {
            priorityLevels: ['critical', 'high', 'normal', 'low'],
            userQuotas: new Map(),
            fairQueuing: {
                enabled: true,
                weightFactors: {
                    'contributor': 1.0,
                    'researcher': 1.5,
                    'maintainer': 2.0
                }
            },
            scheduleJob: (job, availableUsers) => {
                // Implement weighted fair queuing algorithm
                return this.weightedFairQueuing(job, availableUsers);
            }
        };
    }

    initializePolicyEngine() {
        this.policyEngine = {
            maxRuntime: 300000, // 5 minutes
            maxMemoryUsage: 512 * 1024 * 1024, // 512MB
            maxVRAMUsage: 1024 * 1024 * 1024, // 1GB
            allowedOrigins: ['localhost', 'kairos.ai'],
            privacyRules: {
                defaultPublic: true,
                allowPersonalData: false,
                encryptionRequired: true,
                anonymizationRequired: true
            },
            exportRules: {
                allowPublicSharing: true,
                requireAttribution: true,
                allowCommercialUse: false
            }
        };
    }

    // Generate a new computing job
    generateJob(jobType, priority = 'normal') {
        const jobId = crypto.randomUUID();
        const jobTypeConfig = this.jobTypes[jobType];
        
        if (!jobTypeConfig) {
            throw new Error(`Unknown job type: ${jobType}`);
        }

        const job = {
            id: jobId,
            type: jobType,
            status: 'pending',
            priority: priority,
            createdAt: Date.now(),
            assignedTo: [],
            results: [],
            verificationCount: 0,
            verified: false,
            config: jobTypeConfig,
            task: this.computingTasks[jobType],
            parameters: this.generateJobParameters(jobType),
            expectedResult: this.generateExpectedResult(jobType)
        };

        this.activeJobs.set(jobId, job);
        this.jobQueue.push(jobId);
        
        console.log(`🧠 Generated new ${jobType} job: ${jobId}`);
        return job;
    }

    // Generate random parameters for each job type
    generateJobParameters(jobType) {
        const baseParams = this.computingTasks[jobType].parameters;
        const randomizedParams = { ...baseParams };

        switch (jobType) {
            case 'neuron_simulation':
                randomizedParams.layers = baseParams.layers.map(layer => 
                    Math.floor(layer * (0.8 + Math.random() * 0.4))
                );
                randomizedParams.batch_size = Math.floor(baseParams.batch_size * (0.5 + Math.random() * 1.0));
                break;
            case 'protein_interaction':
                randomizedParams.binding_sites = Math.floor(baseParams.binding_sites * (0.7 + Math.random() * 0.6));
                randomizedParams.energy_threshold = baseParams.energy_threshold * (0.9 + Math.random() * 0.2);
                break;
            case 'synaptic_plasticity':
                randomizedParams.learning_rate = baseParams.learning_rate * (0.8 + Math.random() * 0.4);
                randomizedParams.synapse_count = Math.floor(baseParams.synapse_count * (0.7 + Math.random() * 0.6));
                break;
            case 'molecular_dynamics':
                randomizedParams.timestep = baseParams.timestep * (0.8 + Math.random() * 0.4);
                randomizedParams.particle_count = Math.floor(baseParams.particle_count * (0.8 + Math.random() * 0.4));
                break;
        }

        return randomizedParams;
    }

    // Generate expected result for verification
    generateExpectedResult(jobType) {
        const baseParams = this.computingTasks[jobType].parameters;
        
        switch (jobType) {
            case 'neuron_simulation':
                return {
                    output_shape: [baseParams.batch_size, baseParams.layers[baseParams.layers.length - 1]],
                    loss_range: [0.1, 0.9],
                    accuracy_range: [0.6, 0.95]
                };
            case 'protein_interaction':
                return {
                    binding_score_range: [baseParams.energy_threshold * 1.2, baseParams.energy_threshold * 0.8],
                    interaction_sites: baseParams.binding_sites,
                    confidence_range: [0.7, 0.99]
                };
            case 'synaptic_plasticity':
                return {
                    strength_change_range: [-0.5, 0.5],
                    plasticity_index: [0.3, 0.8],
                    learning_progress: [0.1, 0.9]
                };
            case 'molecular_dynamics':
                return {
                    energy_variance: [0.01, 0.1],
                    temperature_stability: [0.95, 1.05],
                    particle_movement: [0.001, 0.01]
                };
        }
    }

    // Assign job to a user
    assignJobToUser(jobId, userId, userCapabilities) {
        const job = this.activeJobs.get(jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }

        if (job.status !== 'pending') {
            throw new Error(`Job ${jobId} is not available for assignment`);
        }

        // Check if user can handle this job type
        if (job.config.gpuRequired && !userCapabilities.gpu) {
            throw new Error(`Job ${jobId} requires GPU, but user ${userId} doesn't have GPU access`);
        }

        // Assign job to user
        job.assignedTo.push(userId);
        job.status = 'assigned';
        job.assignedAt = Date.now();

        // Update user contribution record
        if (!this.userContributions.has(userId)) {
            this.userContributions.set(userId, {
                totalJobs: 0,
                completedJobs: 0,
                totalComputeTime: 0,
                contributionPoints: 0,
                lastActive: Date.now(),
                jobHistory: []
            });
        }

        console.log(`🧠 Assigned job ${jobId} to user ${userId}`);
        return job;
    }

    // Get available jobs for a user
    getAvailableJobs(userId, userCapabilities, limit = 5) {
        const availableJobs = [];
        
        for (const [jobId, job] of this.activeJobs) {
            if (job.status === 'pending' && 
                job.assignedTo.length < this.verificationThreshold &&
                (!job.config.gpuRequired || userCapabilities.gpu)) {
                
                availableJobs.push({
                    id: job.id,
                    type: job.type,
                    name: job.config.name,
                    description: job.config.description,
                    complexity: job.config.complexity,
                    estimatedTime: job.config.estimatedTime,
                    gpuRequired: job.config.gpuRequired,
                    parameters: job.parameters
                });

                if (availableJobs.length >= limit) break;
            }
        }

        return availableJobs;
    }

    // Submit job result from user
    submitJobResult(jobId, userId, result, computeTime) {
        const job = this.activeJobs.get(jobId);
        if (!job) {
            throw new Error(`Job not found: ${jobId}`);
        }

        if (!job.assignedTo.includes(userId)) {
            throw new Error(`User ${userId} is not assigned to job ${jobId}`);
        }

        // Add result to job
        job.results.push({
            userId: userId,
            result: result,
            computeTime: computeTime,
            submittedAt: Date.now(),
            verified: false
        });

        // Update user contribution
        const userContribution = this.userContributions.get(userId);
        if (userContribution) {
            userContribution.totalJobs++;
            userContribution.totalComputeTime += computeTime;
            userContribution.contributionPoints += this.calculateContributionPoints(job.type, computeTime);
            userContribution.lastActive = Date.now();
            userContribution.jobHistory.push({
                jobId: jobId,
                jobType: job.type,
                computeTime: computeTime,
                submittedAt: Date.now()
            });
        }

        // Check if we have enough results for verification
        if (job.results.length >= this.verificationThreshold) {
            this.verifyJobResults(jobId);
        }

        console.log(`🧠 User ${userId} submitted result for job ${jobId}`);
        return { success: true, verificationPending: job.results.length >= this.verificationThreshold };
    }

    // Verify job results from multiple users
    verifyJobResults(jobId) {
        const job = this.activeJobs.get(jobId);
        if (!job || job.results.length < this.verificationThreshold) {
            return false;
        }

        const results = job.results;
        const verificationResults = [];

        // Compare results and check for consensus
        for (let i = 0; i < results.length; i++) {
            for (let j = i + 1; j < results.length; j++) {
                const similarity = this.calculateResultSimilarity(results[i].result, results[j].result, job.type);
                verificationResults.push({
                    user1: results[i].userId,
                    user2: results[j].userId,
                    similarity: similarity,
                    passed: similarity > 0.8 // 80% similarity threshold
                });
            }
        }

        // Count passed verifications
        const passedVerifications = verificationResults.filter(v => v.passed).length;
        const totalVerifications = verificationResults.length;
        const verificationRate = passedVerifications / totalVerifications;

        // Mark job as verified if verification rate is high enough
        if (verificationRate >= 0.7) { // 70% of verifications must pass
            job.verified = true;
            job.status = 'completed';
            job.verificationRate = verificationRate;
            job.completedAt = Date.now();

            // Move to completed jobs
            this.completedJobs.set(jobId, job);
            this.activeJobs.delete(jobId);

            // Update user contributions for verified results
            results.forEach(result => {
                const userContribution = this.userContributions.get(result.userId);
                if (userContribution) {
                    userContribution.completedJobs++;
                    result.verified = true;
                }
            });

            console.log(`🧠 Job ${jobId} verified successfully (${(verificationRate * 100).toFixed(1)}% consensus)`);
            return true;
        } else {
            console.log(`🧠 Job ${jobId} verification failed (${(verificationRate * 100).toFixed(1)}% consensus)`);
            return false;
        }
    }

    // Calculate similarity between two results
    calculateResultSimilarity(result1, result2, jobType) {
        // This is a simplified similarity calculation
        // In a real implementation, this would be more sophisticated
        let similarity = 0;
        let totalComparisons = 0;

        switch (jobType) {
            case 'neuron_simulation':
                if (result1.output_shape && result2.output_shape) {
                    const shapeSimilarity = this.compareArrays(result1.output_shape, result2.output_shape);
                    const lossSimilarity = this.compareValues(result1.loss, result2.loss, 0.1);
                    const accuracySimilarity = this.compareValues(result1.accuracy, result2.accuracy, 0.1);
                    similarity = (shapeSimilarity + lossSimilarity + accuracySimilarity) / 3;
                    totalComparisons = 3;
                }
                break;
            case 'protein_interaction':
                if (result1.binding_score && result2.binding_score) {
                    const bindingSimilarity = this.compareValues(result1.binding_score, result2.binding_score, 0.5);
                    const confidenceSimilarity = this.compareValues(result1.confidence, result2.confidence, 0.1);
                    similarity = (bindingSimilarity + confidenceSimilarity) / 2;
                    totalComparisons = 2;
                }
                break;
            case 'synaptic_plasticity':
                if (result1.strength_change && result2.strength_change) {
                    const strengthSimilarity = this.compareValues(result1.strength_change, result2.strength_change, 0.2);
                    const plasticitySimilarity = this.compareValues(result1.plasticity_index, result2.plasticity_index, 0.1);
                    similarity = (strengthSimilarity + plasticitySimilarity) / 2;
                    totalComparisons = 2;
                }
                break;
            case 'molecular_dynamics':
                if (result1.energy_variance && result2.energy_variance) {
                    const energySimilarity = this.compareValues(result1.energy_variance, result2.energy_variance, 0.05);
                    const temperatureSimilarity = this.compareValues(result1.temperature_stability, result2.temperature_stability, 0.02);
                    similarity = (energySimilarity + temperatureSimilarity) / 2;
                    totalComparisons = 2;
                }
                break;
        }

        return totalComparisons > 0 ? similarity : 0;
    }

    // Helper methods for similarity calculation
    compareArrays(arr1, arr2) {
        if (!Array.isArray(arr1) || !Array.isArray(arr2) || arr1.length !== arr2.length) {
            return 0;
        }
        
        let matches = 0;
        for (let i = 0; i < arr1.length; i++) {
            if (Math.abs(arr1[i] - arr2[i]) <= 1) { // Allow 1 unit difference
                matches++;
            }
        }
        return matches / arr1.length;
    }

    compareValues(val1, val2, tolerance) {
        if (typeof val1 !== 'number' || typeof val2 !== 'number') {
            return 0;
        }
        const difference = Math.abs(val1 - val2);
        return difference <= tolerance ? 1 : Math.max(0, 1 - (difference - tolerance) / tolerance);
    }

    // Calculate contribution points for a user
    calculateContributionPoints(jobType, computeTime) {
        const basePoints = {
            'neuron_simulation': 10,
            'protein_interaction': 15,
            'synaptic_plasticity': 12,
            'molecular_dynamics': 18
        };

        const basePoint = basePoints[jobType] || 10;
        const timeMultiplier = Math.min(computeTime / 1000, 2); // Cap at 2x for longer computations
        
        return Math.floor(basePoint * timeMultiplier);
    }

    // Get user contribution statistics
    getUserContribution(userId) {
        const contribution = this.userContributions.get(userId);
        if (!contribution) {
            return null;
        }

        return {
            ...contribution,
            averageComputeTime: contribution.totalJobs > 0 ? 
                contribution.totalComputeTime / contribution.totalJobs : 0,
            successRate: contribution.totalJobs > 0 ? 
                contribution.completedJobs / contribution.totalJobs : 0,
            rank: this.getUserRank(userId)
        };
    }

    // Get user ranking based on contribution points
    getUserRank(userId) {
        const allUsers = Array.from(this.userContributions.entries())
            .map(([id, contrib]) => ({ id, points: contrib.contributionPoints }))
            .sort((a, b) => b.points - a.points);

        const userIndex = allUsers.findIndex(user => user.id === userId);
        return userIndex >= 0 ? userIndex + 1 : null;
    }

    // Get leaderboard
    getLeaderboard(limit = 10) {
        return Array.from(this.userContributions.entries())
            .map(([userId, contrib]) => ({
                userId,
                username: contrib.username || `User_${userId.slice(0, 8)}`,
                contributionPoints: contrib.contributionPoints,
                completedJobs: contrib.completedJobs,
                totalComputeTime: contrib.totalComputeTime,
                lastActive: contrib.lastActive
            }))
            .sort((a, b) => b.contributionPoints - a.contributionPoints)
            .slice(0, limit);
    }

    // Get research statistics
    getResearchStatistics() {
        const totalJobs = this.completedJobs.size;
        const totalComputeTime = Array.from(this.completedJobs.values())
            .reduce((sum, job) => sum + job.results.reduce((s, r) => s + r.computeTime, 0), 0);
        const totalContributors = this.userContributions.size;
        const averageVerificationRate = Array.from(this.completedJobs.values())
            .reduce((sum, job) => sum + (job.verificationRate || 0), 0) / Math.max(totalJobs, 1);

        return {
            totalJobs,
            totalComputeTime,
            totalContributors,
            averageVerificationRate: averageVerificationRate.toFixed(3),
            activeJobs: this.activeJobs.size,
            jobTypes: Object.keys(this.jobTypes),
            recentCompletions: Array.from(this.completedJobs.values())
                .sort((a, b) => b.completedAt - a.completedAt)
                .slice(0, 5)
                .map(job => ({
                    id: job.id,
                    type: job.type,
                    completedAt: job.completedAt,
                    verificationRate: job.verificationRate
                }))
        };
    }

    // Clean up old jobs and user data
    cleanup() {
        const now = Date.now();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        // Clean up old completed jobs
        for (const [jobId, job] of this.completedJobs) {
            if (now - job.completedAt > maxAge) {
                this.completedJobs.delete(jobId);
            }
        }

        // Clean up inactive users
        for (const [userId, contribution] of this.userContributions) {
            if (now - contribution.lastActive > maxAge) {
                this.userContributions.delete(userId);
            }
        }

        console.log('🧠 Cleanup completed');
    }

    // Initialize the system with some sample jobs
    initializeSampleJobs() {
        const jobTypes = Object.keys(this.jobTypes);
        for (let i = 0; i < 20; i++) {
            const randomJobType = jobTypes[Math.floor(Math.random() * jobTypes.length)];
            const priority = Math.random() > 0.8 ? 'high' : 'normal';
            this.generateJob(randomJobType, priority);
        }
        console.log('🧠 Initialized with 20 sample jobs');
    }

    // User-submitted job management
    submitUserJob(userId, templateId, customParameters, priority = 'normal') {
        const template = this.jobTemplates.get(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }

        // Check user credits
        const requiredCredits = this.creditSystem.spendRates[templateId] || 20;
        const userCredits = this.getUserCredits(userId);
        
        if (userCredits < requiredCredits) {
            throw new Error(`Insufficient credits. Required: ${requiredCredits}, Available: ${userCredits}`);
        }

        // Validate parameters against template
        const validatedParameters = this.validateJobParameters(template, customParameters);
        
        // Create user job
        const jobId = crypto.randomUUID();
        const userJob = {
            id: jobId,
            userId: userId,
            templateId: templateId,
            template: template,
            customParameters: validatedParameters,
            priority: priority,
            status: 'user_submitted',
            createdAt: Date.now(),
            estimatedCost: requiredCredits,
            estimatedTime: template.estimatedTime,
            gpuRequired: template.gpuRequired,
            category: template.category,
            scientificContext: template.scientific_background,
            references: template.references
        };

        // Deduct credits
        this.deductUserCredits(userId, requiredCredits);

        // Add to user submitted jobs
        this.userSubmittedJobs.set(jobId, userJob);

        // Generate actual computing jobs from user job
        const computingJobs = this.generateComputingJobsFromUserJob(userJob);
        
        console.log(`🧠 User ${userId} submitted job ${jobId} using template ${templateId}`);
        return { userJob, computingJobs };
    }

    validateJobParameters(template, customParameters) {
        const validated = { ...template.parameters };
        
        // Apply custom parameters with validation
        for (const [key, value] of Object.entries(customParameters)) {
            if (template.parameters.hasOwnProperty(key)) {
                // Basic type and range validation
                if (typeof value === typeof template.parameters[key]) {
                    validated[key] = value;
                }
            }
        }
        
        return validated;
    }

    generateComputingJobsFromUserJob(userJob) {
        const computingJobs = [];
        const jobCount = this.calculateRequiredJobCount(userJob.template);
        
        for (let i = 0; i < jobCount; i++) {
            const computingJob = this.generateJob(userJob.template.category, userJob.priority);
            computingJob.userJobId = userJob.id;
            computingJob.userId = userJob.userId;
            computingJob.templateId = userJob.templateId;
            computingJob.customParameters = userJob.customParameters;
            
            computingJobs.push(computingJob);
        }
        
        return computingJobs;
    }

    calculateRequiredJobCount(template) {
        // Calculate how many computing jobs are needed based on template complexity
        switch (template.complexity) {
            case 'low': return 3;
            case 'medium': return 5;
            case 'high': return 8;
            default: return 3;
        }
    }

    // Credit system management
    getUserCredits(userId) {
        if (!this.userContributions.has(userId)) {
            this.userContributions.set(userId, {
                totalJobs: 0,
                completedJobs: 0,
                totalComputeTime: 0,
                contributionPoints: 0,
                credits: this.creditSystem.baseCredits,
                lastActive: Date.now(),
                jobHistory: [],
                userSubmittedJobs: []
            });
        }
        
        return this.userContributions.get(userId).credits || this.creditSystem.baseCredits;
    }

    addUserCredits(userId, amount, reason = 'job_completion') {
        const contribution = this.userContributions.get(userId);
        if (contribution) {
            contribution.credits = (contribution.credits || 0) + amount;
            console.log(`💰 Added ${amount} credits to user ${userId} for ${reason}`);
        }
    }

    deductUserCredits(userId, amount) {
        const contribution = this.userContributions.get(userId);
        if (contribution) {
            contribution.credits = Math.max(0, (contribution.credits || 0) - amount);
            console.log(`💰 Deducted ${amount} credits from user ${userId}`);
        }
    }

    // Advanced scheduling with weighted fair queuing
    weightedFairQueuing(job, availableUsers) {
        if (!this.scheduler.fairQueuing.enabled) {
            return availableUsers[0]; // Simple round-robin
        }

        // Calculate user weights based on contribution and role
        const userWeights = availableUsers.map(userId => {
            const contribution = this.userContributions.get(userId);
            const baseWeight = contribution ? contribution.contributionPoints / 100 : 1;
            const roleWeight = this.scheduler.fairQueuing.weightFactors.contributor; // Default to contributor
            
            return {
                userId,
                weight: baseWeight * roleWeight,
                lastAssigned: contribution ? contribution.lastActive : 0
            };
        });

        // Sort by weight and last assignment time
        userWeights.sort((a, b) => {
            if (Math.abs(a.weight - b.weight) < 0.1) {
                return a.lastAssigned - b.lastAssigned; // Fairness for similar weights
            }
            return b.weight - a.weight; // Higher weight first
        });

        return userWeights[0].userId;
    }

    // Template management
    getAvailableTemplates(userId) {
        const userCredits = this.getUserCredits(userId);
        const availableTemplates = [];
        
        for (const [id, template] of this.jobTemplates) {
            const cost = this.creditSystem.spendRates[id] || 20;
            availableTemplates.push({
                ...template,
                cost: cost,
                affordable: userCredits >= cost
            });
        }
        
        return availableTemplates;
    }

    // Enhanced job tracking for user submissions
    getUserJobStatus(userId) {
        const userJobs = Array.from(this.userSubmittedJobs.values())
            .filter(job => job.userId === userId);
        
        return userJobs.map(job => {
            const relatedComputingJobs = Array.from(this.activeJobs.values())
                .filter(compJob => compJob.userJobId === job.id);
            
            const completedCount = relatedComputingJobs.filter(compJob => 
                compJob.status === 'completed').length;
            const totalCount = relatedComputingJobs.length;
            
            return {
                ...job,
                progress: totalCount > 0 ? (completedCount / totalCount) * 100 : 0,
                completedComputingJobs: completedCount,
                totalComputingJobs: totalCount,
                estimatedCompletion: this.estimateJobCompletion(job)
            };
        });
    }

    estimateJobCompletion(userJob) {
        const relatedJobs = Array.from(this.activeJobs.values())
            .filter(compJob => compJob.userJobId === userJob.id);
        
        if (relatedJobs.length === 0) return null;
        
        const avgTimePerJob = relatedJobs.reduce((sum, job) => 
            sum + (job.estimatedTime || 60000), 0) / relatedJobs.length;
        
        const pendingJobs = relatedJobs.filter(job => job.status === 'pending').length;
        const estimatedTime = pendingJobs * avgTimePerJob;
        
        return Date.now() + estimatedTime;
    }

    // Enhanced result validation for user jobs
    validateUserJobResults(userJobId) {
        const userJob = this.userSubmittedJobs.get(userJobId);
        if (!userJob) return null;
        
        const relatedComputingJobs = Array.from(this.completedJobs.values())
            .filter(compJob => compJob.userJobId === userJobId);
        
        if (relatedComputingJobs.length === 0) return null;
        
        // Aggregate results from all related computing jobs
        const aggregatedResults = this.aggregateComputingJobResults(relatedComputingJobs);
        
        // Generate scientific report
        const scientificReport = this.generateScientificReport(userJob, aggregatedResults);
        
        // Update user job status
        userJob.status = 'completed';
        userJob.completedAt = Date.now();
        userJob.results = aggregatedResults;
        userJob.scientificReport = scientificReport;
        
        // Award bonus credits for successful completion
        const bonusCredits = Math.floor(userJob.estimatedCost * 0.2); // 20% bonus
        this.addUserCredits(userJob.userId, bonusCredits, 'job_completion_bonus');
        
        return scientificReport;
    }

    aggregateComputingJobResults(computingJobs) {
        const aggregated = {
            totalJobs: computingJobs.length,
            verifiedJobs: computingJobs.filter(job => job.verified).length,
            averageVerificationRate: 0,
            combinedResults: {},
            metadata: {
                totalComputeTime: 0,
                averageComputeTime: 0,
                contributors: new Set()
            }
        };
        
        // Calculate verification rate
        aggregated.averageVerificationRate = computingJobs.reduce((sum, job) => 
            sum + (job.verificationRate || 0), 0) / computingJobs.length;
        
        // Aggregate compute time and contributors
        computingJobs.forEach(job => {
            job.results.forEach(result => {
                aggregated.metadata.totalComputeTime += result.computeTime;
                aggregated.metadata.contributors.add(result.userId);
            });
        });
        
        aggregated.metadata.averageComputeTime = aggregated.metadata.totalComputeTime / aggregated.totalJobs;
        aggregated.metadata.contributors = Array.from(aggregated.metadata.contributors);
        
        return aggregated;
    }

    generateScientificReport(userJob, aggregatedResults) {
        const report = {
            title: `Scientific Report: ${userJob.template.name}`,
            jobId: userJob.id,
            template: userJob.template.name,
            submittedBy: userJob.userId,
            submittedAt: userJob.createdAt,
            completedAt: Date.now(),
            parameters: userJob.customParameters,
            results: aggregatedResults,
            scientificContext: userJob.scientificContext,
            references: userJob.references,
            reproducibility: {
                seed: crypto.randomBytes(16).toString('hex'),
                version: '1.0.0',
                timestamp: Date.now(),
                hash: this.generateResultHash(aggregatedResults)
            },
            acknowledgments: aggregatedResults.metadata.contributors.map(userId => 
                `User_${userId.slice(0, 8)}`),
            exportOptions: {
                public: true,
                citable: true,
                doi: `kairos-${userJob.id.slice(0, 8)}-${Date.now()}`
            }
        };
        
        return report;
    }

    generateResultHash(results) {
        const dataString = JSON.stringify(results);
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }
}

module.exports = BrainResearchComputingManager;
