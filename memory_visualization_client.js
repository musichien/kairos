/**
 * 🌟 3D Memory Visualization Client
 * 
 * Implements embodied memory visualization using WebGL/Three.js
 * Based on research from embodied cognition and spatial memory
 */

class MemoryVisualizationClient {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.memoryObjects = [];
        this.currentEnvironment = null;
        this.isInitialized = false;
        
        // Memory visualization settings
        this.visualizationSettings = {
            environmentType: 'personal_space',
            visualizationMode: 'timeline',
            colorScheme: 'emotional',
            animationSpeed: 1.0,
            showLabels: true,
            showConnections: true
        };
    }

    /**
     * Initialize 3D visualization environment
     */
    async initialize(containerId) {
        try {
            // Check WebGL support
            if (!this.checkWebGLSupport()) {
                throw new Error('WebGL not supported in this browser');
            }

            // Initialize Three.js scene
            await this.initializeThreeJS(containerId);
            
            // Initialize controls
            this.initializeControls();
            
            // Initialize lighting
            this.initializeLighting();
            
            // Set up animation loop
            this.animate();
            
            this.isInitialized = true;
            console.log('Memory Visualization Client initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize Memory Visualization Client:', error);
            throw error;
        }
    }

    /**
     * Check WebGL support
     */
    checkWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            return !!gl;
        } catch (e) {
            return false;
        }
    }

    /**
     * Initialize Three.js scene
     */
    async initializeThreeJS(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container with ID '${containerId}' not found`);
        }

        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000011);

        // Create camera
        this.camera = new THREE.PerspectiveCamera(
            75, 
            container.clientWidth / container.clientHeight, 
            0.1, 
            1000
        );
        this.camera.position.set(0, 5, 10);

        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(container.clientWidth, container.clientHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        container.appendChild(this.renderer.domElement);

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(container));
    }

    /**
     * Initialize camera controls
     */
    initializeControls() {
        // Orbit controls for camera movement
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.screenSpacePanning = false;
        this.controls.minDistance = 1;
        this.controls.maxDistance = 50;
        this.controls.maxPolarAngle = Math.PI / 2;
    }

    /**
     * Initialize lighting system
     */
    initializeLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);

        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(10, 10, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for atmosphere
        const pointLight = new THREE.PointLight(0x4444ff, 0.5, 100);
        pointLight.position.set(-10, 5, -10);
        this.scene.add(pointLight);
    }

    /**
     * Create memory landscape based on visualization mode
     */
    createMemoryLandscape(memories, mode = 'timeline') {
        this.clearScene();
        
        switch (mode) {
            case 'timeline':
                this.createTimelineLandscape(memories);
                break;
            case 'emotional_landscape':
                this.createEmotionalLandscape(memories);
                break;
            case 'relationship_network':
                this.createRelationshipNetwork(memories);
                break;
            case 'achievement_mountain':
                this.createAchievementMountain(memories);
                break;
            default:
                this.createTimelineLandscape(memories);
        }
    }

    /**
     * Create timeline-based memory landscape
     */
    createTimelineLandscape(memories) {
        if (!memories || memories.length === 0) return;

        // Sort memories by timestamp
        const sortedMemories = memories.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        // Create timeline path
        const timelinePath = this.createTimelinePath(sortedMemories);
        this.scene.add(timelinePath);

        // Create memory objects along timeline
        sortedMemories.forEach((memory, index) => {
            const memoryObject = this.createMemoryObject(memory, index, sortedMemories.length);
            this.memoryObjects.push(memoryObject);
            this.scene.add(memoryObject);
        });

        // Add timeline labels
        this.addTimelineLabels(sortedMemories);
    }

    /**
     * Create timeline path
     */
    createTimelinePath(memories) {
        const points = [];
        const totalMemories = memories.length;
        
        memories.forEach((memory, index) => {
            const x = (index / (totalMemories - 1)) * 20 - 10; // Spread across -10 to 10
            const y = 0;
            const z = 0;
            points.push(new THREE.Vector3(x, y, z));
        });

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0x00ffff, linewidth: 2 });
        
        return new THREE.Line(geometry, material);
    }

    /**
     * Create individual memory object
     */
    createMemoryObject(memory, index, totalCount) {
        // Create geometry based on memory type
        let geometry;
        switch (memory.type) {
            case 'achievement':
                geometry = new THREE.SphereGeometry(0.3, 16, 16);
                break;
            case 'relationship':
                geometry = new THREE.BoxGeometry(0.4, 0.4, 0.4);
                break;
            case 'learning':
                geometry = new THREE.ConeGeometry(0.3, 0.6, 16);
                break;
            case 'challenge':
                geometry = new THREE.OctahedronGeometry(0.3);
                break;
            default:
                geometry = new THREE.SphereGeometry(0.25, 16, 16);
        }

        // Create material with emotional coloring
        const material = this.createEmotionalMaterial(memory.emotionalIntensity);
        
        // Create mesh
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position along timeline
        const x = (index / (totalCount - 1)) * 20 - 10;
        const y = 0.5;
        const z = 0;
        mesh.position.set(x, y, z);
        
        // Add memory data
        mesh.userData = {
            memoryId: memory.id,
            memoryData: memory,
            type: 'memory_object'
        };

        // Add hover effects
        this.addHoverEffects(mesh);
        
        return mesh;
    }

    /**
     * Create material with emotional coloring
     */
    createEmotionalMaterial(emotionalIntensity) {
        let color;
        let opacity = 0.8;
        
        switch (emotionalIntensity) {
            case 'high':
                color = 0xff4444; // Red for high intensity
                opacity = 1.0;
                break;
            case 'medium':
                color = 0xffaa44; // Orange for medium intensity
                opacity = 0.9;
                break;
            case 'low':
                color = 0x44ff44; // Green for low intensity
                opacity = 0.7;
                break;
            default:
                color = 0x888888; // Gray for unknown
                opacity = 0.6;
        }

        return new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: opacity,
            shininess: 100
        });
    }

    /**
     * Add hover effects to memory objects
     */
    addHoverEffects(mesh) {
        const originalScale = mesh.scale.clone();
        const originalColor = mesh.material.color.clone();
        
        // Mouse enter effect
        mesh.addEventListener('mouseenter', () => {
            mesh.scale.multiplyScalar(1.2);
            mesh.material.color.setHex(0xffff00);
            this.showMemoryDetails(mesh.userData.memoryData);
        });

        // Mouse leave effect
        mesh.addEventListener('mouseleave', () => {
            mesh.scale.copy(originalScale);
            mesh.material.color.copy(originalColor);
            this.hideMemoryDetails();
        });
    }

    /**
     * Show memory details on hover
     */
    showMemoryDetails(memoryData) {
        // Create or update info panel
        let infoPanel = document.getElementById('memory-info-panel');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'memory-info-panel';
            infoPanel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(infoPanel);
        }

        infoPanel.innerHTML = `
            <h3>${memoryData.type || 'Memory'}</h3>
            <p><strong>Date:</strong> ${new Date(memoryData.timestamp).toLocaleDateString()}</p>
            <p><strong>Description:</strong> ${memoryData.description || 'No description'}</p>
            <p><strong>Emotional Intensity:</strong> ${memoryData.emotionalIntensity || 'Unknown'}</p>
            ${memoryData.spatialContext ? `<p><strong>Location:</strong> ${memoryData.spatialContext}</p>` : ''}
        `;
    }

    /**
     * Hide memory details
     */
    hideMemoryDetails() {
        const infoPanel = document.getElementById('memory-info-panel');
        if (infoPanel) {
            infoPanel.remove();
        }
    }

    /**
     * Create emotional landscape visualization
     */
    createEmotionalLandscape(memories) {
        if (!memories || memories.length === 0) return;

        // Create terrain based on emotional patterns
        const terrain = this.createEmotionalTerrain(memories);
        this.scene.add(terrain);

        // Add memory objects as floating elements
        memories.forEach((memory, index) => {
            const memoryObject = this.createEmotionalMemoryObject(memory, index);
            this.memoryObjects.push(memoryObject);
            this.scene.add(memoryObject);
        });
    }

    /**
     * Create emotional terrain
     */
    createEmotionalTerrain(memories) {
        const geometry = new THREE.PlaneGeometry(20, 20, 32, 32);
        const vertices = geometry.attributes.position.array;
        
        // Modify vertices based on emotional patterns
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const z = vertices[i + 2];
            
            // Create wave pattern based on emotional intensity
            let emotionalHeight = 0;
            memories.forEach(memory => {
                const distance = Math.sqrt(x * x + z * z);
                const intensity = this.getEmotionalIntensityValue(memory.emotionalIntensity);
                emotionalHeight += Math.sin(distance * 0.5) * intensity * 0.1;
            });
            
            vertices[i + 1] = emotionalHeight;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
            color: 0x4444aa,
            wireframe: false,
            transparent: true,
            opacity: 0.7
        });

        return new THREE.Mesh(geometry, material);
    }

    /**
     * Get numerical value for emotional intensity
     */
    getEmotionalIntensityValue(intensity) {
        switch (intensity) {
            case 'high': return 1.0;
            case 'medium': return 0.6;
            case 'low': return 0.3;
            default: return 0.5;
        }
    }

    /**
     * Create emotional memory object
     */
    createEmotionalMemoryObject(memory, index) {
        const geometry = new THREE.SphereGeometry(0.2, 16, 16);
        const material = this.createEmotionalMaterial(memory.emotionalIntensity);
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Position in 3D space based on emotional characteristics
        const angle = (index / 10) * Math.PI * 2;
        const radius = 5 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const y = this.getEmotionalIntensityValue(memory.emotionalIntensity) * 3;
        const z = Math.sin(angle) * radius;
        
        mesh.position.set(x, y, z);
        
        // Add memory data
        mesh.userData = {
            memoryId: memory.id,
            memoryData: memory,
            type: 'memory_object'
        };

        // Add hover effects
        this.addHoverEffects(mesh);
        
        return mesh;
    }

    /**
     * Create relationship network visualization
     */
    createRelationshipNetwork(memories) {
        if (!memories || memories.length === 0) return;

        // Extract relationship data
        const relationships = this.extractRelationships(memories);
        
        // Create network nodes
        const nodes = this.createNetworkNodes(relationships);
        nodes.forEach(node => {
            this.scene.add(node);
            this.memoryObjects.push(node);
        });

        // Create network connections
        const connections = this.createNetworkConnections(relationships);
        connections.forEach(connection => {
            this.scene.add(connection);
        });
    }

    /**
     * Extract relationship data from memories
     */
    extractRelationships(memories) {
        const relationships = new Map();
        
        memories.forEach(memory => {
            if (memory.relationships) {
                memory.relationships.forEach(relationship => {
                    if (!relationships.has(relationship.person)) {
                        relationships.set(relationship.person, {
                            person: relationship.person,
                            memories: [],
                            strength: 0
                        });
                    }
                    
                    const rel = relationships.get(relationship.person);
                    rel.memories.push(memory);
                    rel.strength += relationship.strength || 1;
                });
            }
        });

        return Array.from(relationships.values());
    }

    /**
     * Create network nodes
     */
    createNetworkNodes(relationships) {
        const nodes = [];
        
        relationships.forEach((relationship, index) => {
            const geometry = new THREE.SphereGeometry(0.3, 16, 16);
            const material = new THREE.MeshPhongMaterial({
                color: 0x44ff44,
                transparent: true,
                opacity: 0.8
            });
            
            const mesh = new THREE.Mesh(geometry, material);
            
            // Position in circular pattern
            const angle = (index / relationships.length) * Math.PI * 2;
            const radius = 8;
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            
            mesh.position.set(x, 0, z);
            
            // Scale based on relationship strength
            const scale = 0.5 + (relationship.strength / 10) * 0.5;
            mesh.scale.setScalar(scale);
            
            // Add relationship data
            mesh.userData = {
                type: 'relationship_node',
                relationship: relationship
            };

            // Add hover effects
            this.addRelationshipHoverEffects(mesh);
            
            nodes.push(mesh);
        });

        return nodes;
    }

    /**
     * Create network connections
     */
    createNetworkConnections(relationships) {
        const connections = [];
        
        // Create connections between related nodes
        for (let i = 0; i < relationships.length; i++) {
            for (let j = i + 1; j < relationships.length; j++) {
                const rel1 = relationships[i];
                const rel2 = relationships[j];
                
                // Check if they share memories
                const sharedMemories = rel1.memories.filter(memory => 
                    rel2.memories.includes(memory)
                );
                
                if (sharedMemories.length > 0) {
                    const connection = this.createConnection(rel1, rel2, sharedMemories.length);
                    connections.push(connection);
                }
            }
        }

        return connections;
    }

    /**
     * Create connection between nodes
     */
    createConnection(rel1, rel2, strength) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(rel1.x, rel1.y, rel1.z),
            new THREE.Vector3(rel2.x, rel2.y, rel2.z)
        ]);
        
        const material = new THREE.LineBasicMaterial({
            color: 0x00ffff,
            transparent: true,
            opacity: Math.min(1.0, strength * 0.2)
        });
        
        return new THREE.Line(geometry, material);
    }

    /**
     * Add relationship hover effects
     */
    addRelationshipHoverEffects(mesh) {
        const originalScale = mesh.scale.clone();
        
        mesh.addEventListener('mouseenter', () => {
            mesh.scale.multiplyScalar(1.3);
            this.showRelationshipDetails(mesh.userData.relationship);
        });

        mesh.addEventListener('mouseleave', () => {
            mesh.scale.copy(originalScale);
            this.hideRelationshipDetails();
        });
    }

    /**
     * Show relationship details
     */
    showRelationshipDetails(relationship) {
        let infoPanel = document.getElementById('relationship-info-panel');
        if (!infoPanel) {
            infoPanel = document.createElement('div');
            infoPanel.id = 'relationship-info-panel';
            infoPanel.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px;
                border-radius: 8px;
                max-width: 300px;
                z-index: 1000;
                font-family: Arial, sans-serif;
            `;
            document.body.appendChild(infoPanel);
        }

        infoPanel.innerHTML = `
            <h3>${relationship.person}</h3>
            <p><strong>Relationship Strength:</strong> ${relationship.strength}</p>
            <p><strong>Shared Memories:</strong> ${relationship.memories.length}</p>
            <p><strong>Recent Memory:</strong> ${relationship.memories[0]?.description || 'None'}</p>
        `;
    }

    /**
     * Hide relationship details
     */
    hideRelationshipDetails() {
        const infoPanel = document.getElementById('relationship-info-panel');
        if (infoPanel) {
            infoPanel.remove();
        }
    }

    /**
     * Add timeline labels
     */
    addTimelineLabels(memories) {
        if (!this.visualizationSettings.showLabels) return;

        memories.forEach((memory, index) => {
            if (index % Math.max(1, Math.floor(memories.length / 5)) === 0) {
                const label = this.createTimelineLabel(memory, index, memories.length);
                this.scene.add(label);
            }
        });
    }

    /**
     * Create timeline label
     */
    createTimelineLabel(memory, index, totalCount) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 256;
        canvas.height = 64;
        
        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(new Date(memory.timestamp).getFullYear().toString(), 128, 32);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        // Position above timeline
        const x = (index / (totalCount - 1)) * 20 - 10;
        sprite.position.set(x, 2, 0);
        sprite.scale.set(2, 0.5, 1);
        
        return sprite;
    }

    /**
     * Clear current scene
     */
    clearScene() {
        // Remove memory objects
        this.memoryObjects.forEach(obj => {
            this.scene.remove(obj);
        });
        this.memoryObjects = [];

        // Remove other scene elements (keep basic structure)
        const objectsToRemove = [];
        this.scene.children.forEach(child => {
            if (child.type === 'Line' || child.type === 'Mesh' || child.type === 'Sprite') {
                objectsToRemove.push(child);
            }
        });

        objectsToRemove.forEach(obj => {
            this.scene.remove(obj);
        });
    }

    /**
     * Handle window resize
     */
    onWindowResize(container) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
    }

    /**
     * Animation loop
     */
    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        if (this.controls) {
            this.controls.update();
        }

        // Animate memory objects
        this.memoryObjects.forEach((obj, index) => {
            if (obj.type === 'memory_object') {
                obj.rotation.y += 0.01 * this.visualizationSettings.animationSpeed;
                obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.001;
            }
        });

        // Render scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    /**
     * Update visualization settings
     */
    updateSettings(newSettings) {
        this.visualizationSettings = { ...this.visualizationSettings, ...newSettings };
        
        // Recreate landscape if mode changed
        if (newSettings.visualizationMode && this.currentEnvironment) {
            this.createMemoryLandscape(this.currentEnvironment, newSettings.visualizationMode);
        }
    }

    /**
     * Export current visualization as image
     */
    exportAsImage() {
        if (!this.renderer) return null;
        
        this.renderer.render(this.scene, this.camera);
        return this.renderer.domElement.toDataURL('image/png');
    }

    /**
     * Get visualization statistics
     */
    getVisualizationStats() {
        return {
            totalMemoryObjects: this.memoryObjects.length,
            sceneChildren: this.scene ? this.scene.children.length : 0,
            cameraPosition: this.camera ? this.camera.position : null,
            rendererInfo: this.renderer ? this.renderer.info : null
        };
    }

    /**
     * Cleanup resources
     */
    cleanup() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
        
        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize);
        
        this.isInitialized = false;
    }
}

// Export for use in browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MemoryVisualizationClient;
} else {
    window.MemoryVisualizationClient = MemoryVisualizationClient;
}
