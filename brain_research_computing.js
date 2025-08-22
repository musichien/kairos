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
        
        this.initializeJobTypes();
        this.initializeComputingTasks();
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
}

module.exports = BrainResearchComputingManager;
