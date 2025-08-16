# 🌟 Kairos AI - Cognitive Enhancement Platform

**AI for Healthy and Clear-Minded Aging with Advanced Memory, Security, and Cultural Intelligence**

Welcome to Kairos! This project provides a **comprehensive AI platform** that combines long-term memory, privacy-centric processing, cognitive enhancement training, multimodal integration, and cultural optimization to support healthy aging and cognitive health.

## 🎯 **5 Core Features Overview**

### 1. 🧠 **Long-term Memory & Contextualization Technology**
**Develops time-based memory structures that naturally connect users' life events**

- **Intelligent Memory System**: Generates appropriate questions based on previous conversations and memories, tracks users' emotional states
- **Life Event Connection**: Connects life events chronologically to provide contextual understanding
- **Emotional State Tracking**: Tracks changes in users' emotional states and analyzes patterns
- **Behavioral Pattern Recognition**: Analyzes daily behavioral patterns to provide personalized experiences

### 2. 🔒 **Privacy-Centric On-Device Processing**
**Lightweight AI model that safely processes personal information locally**

- **Local Data Storage**: Stores all data locally to minimize data leakage risks
- **Military-Grade Encryption**: Maximizes user trust with AES-256 encryption
- **No Cloud Dependency**: AI functionality available without internet connection
- **Complete Privacy Control**: Users have complete control over data access and sharing

### 3. 🧩 **Cognitive Enhancement Routines**
**Provides training that stimulates cognitive functions using memory, not just simple conversations**

- **Memory-Based Training**: Provides quizzes that help recall past memories
- **Pattern Recognition**: Provides missions to recognize small changes in daily life
- **Personalized Exercises**: Customized training using users' memory data
- **Progress Tracking**: Systematically tracks the process of cognitive ability improvement

### 4. 🔊 **Multimodal Integration**
**Utilizes voice, video, sensor data, etc. to more accurately understand user situations**

- **Voice & Video Processing**: Situation understanding through speech recognition and video analysis
- **Sensor Data Integration**: Environmental data collection through IoT device connectivity
- **Wearable Device Connectivity**: Real-time health data reflection through wearable device integration
- **Real-time Health Monitoring**: Real-time monitoring and analysis of health status

### 5. 🌍 **Cultural & Language Optimization**
**Optimizes conversation styles and respectful expressions for Korean and Asian cultures**

- **Asian Cultural Sensitivity**: Conversation styles specialized for Korean, Japanese, and Chinese cultures
- **Respectful Communication**: Optimizes respectful expressions appropriate for age and situation
- **Global Market Ready**: Customization possible for various cultures when entering global markets
- **Multi-language Support**: English, French, Korean, Japanese, and Chinese support

## 🚀 **Quick Start Guide**

### Step 1: Install Required Software

**Node.js** (Required):
- Go to [nodejs.org](https://nodejs.org/)
- Download and install the "LTS" version

**Ollama** (Required):
- Go to [ollama.ai](https://ollama.ai/)
- Download and install for your operating system

### Step 2: Download AI Model

Open Command Prompt/Terminal and run:
```bash
# Download a model (choose one):
ollama pull llama3.1:latest    # Fast, good for beginners
ollama pull llama3.1:8b        # Better responses, slower
ollama pull jinbora/deepseek-r1-Bllossom:8b  # Korean support
```

### Step 3: Start Ollama Server

```bash
ollama serve
```
Keep this terminal open - this runs your AI brain.

### Step 4: Start Kairos Platform

Open a new terminal, navigate to Kairos folder, and run:
```bash
npm install
npm start
```

### Step 5: Access Your AI Platform

Open your browser and go to:
**`http://localhost:3000`**

## 📖 **Detailed Usage Examples**

### 🧠 **1. Long-term Memory & Contextualization**

#### **Basic Memory Usage:**
```
User: "Hello, I'm Kim Cheol-su."
AI: "Hello, Mr. Kim Cheol-su! Nice to meet you. How can I help you?"

User: "What food did I like again?"
AI: "Mr. Kim, I don't know yet as you haven't told me before. 
     Please let me know what food you like, and I'll remember it."

User: "I like kimchi stew."
AI: "Got it! I'll remember that you like kimchi stew."

(Later...)
User: "What should I eat for lunch today?"
AI: "I remember that you like kimchi stew, Mr. Kim. 
     How about kimchi stew for lunch today?"
```

#### **Advanced Memory Features:**
```bash
# Get memory statistics
curl -X GET "http://localhost:3000/api/memory/user_001/stats" \
  -H "Authorization: Bearer your-secret-key-here"

# Get life event timeline
curl -X GET "http://localhost:3000/api/memory/user_001/timeline" \
  -H "Authorization: Bearer your-secret-key-here"

# Get context pattern analysis
curl -X GET "http://localhost:3000/api/memory/user_001/patterns" \
  -H "Authorization: Bearer your-secret-key-here"
```

### 🔒 **2. Privacy-Centric Security**

#### **Security Status Check:**
```bash
# Check security status
curl -X GET "http://localhost:3000/api/security/status" \
  -H "Authorization: Bearer your-secret-key-here"

# Update security settings
curl -X POST "http://localhost:3000/api/security/config" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "encryptionEnabled": true,
    "auditLogging": true,
    "maxLoginAttempts": 5
  }'
```

#### **Data Backup & Recovery:**
```bash
# Encrypted memory backup
curl -X POST "http://localhost:3000/api/security/backup/user_001" \
  -H "Authorization: Bearer your-secret-key-here"

# Memory restoration
curl -X POST "http://localhost:3000/api/security/restore/user_001" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"backupPath": "backups/user_001_backup_1234567890.enc"}'
```

### 🧩 **3. Cognitive Enhancement Training**

#### **Training Generation:**
```bash
# Generate personalized cognitive training
curl -X POST "http://localhost:3000/api/cognitive/training/user_001" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "trainingType": "memoryRecall",
    "difficulty": "medium"
  }'
```

#### **Training Examples:**
```
🧠 Memory Recall Training:
"Mr. Kim, what did you do last week? 
Please tell me what you remember."

🔍 Pattern Recognition Training:
"Looking at your daily patterns, Mr. Kim, 
it seems like you have coffee at a regular time in the morning. 
Is this pattern correct?"

💭 Cognitive Stimulation Training:
"When you left home this morning, 
what color clothes were you wearing? 
Try to remember in detail."
```

#### **Training Progress:**
```bash
# Get training records
curl -X GET "http://localhost:3000/api/cognitive/training/user_001/records" \
  -H "Authorization: Bearer your-secret-key-here"

# Get training statistics
curl -X GET "http://localhost:3000/api/cognitive/training/user_001/stats" \
  -H "Authorization: Bearer your-secret-key-here"
```

### 🔊 **4. Multimodal Integration**

#### **Voice Processing:**
```bash
# Voice processing
curl -X POST "http://localhost:3000/api/multimodal/voice/process" \
  -H "Authorization: Bearer your-secret-key-here" \
  -F "audioFile=@voice_message.wav" \
  -F "userId=user_001"

# Voice synthesis
curl -X POST "http://localhost:3000/api/multimodal/voice/synthesize" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "text": "Hello, Mr. Kim Cheol-su!",
    "voiceType": "natural"
  }'
```

#### **Sensor Data Integration:**
```bash
# Process sensor data
curl -X POST "http://localhost:3000/api/multimodal/sensors/process" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "sensorData": {
      "temperature": 23.5,
      "humidity": 45,
      "motion": "active"
    }
  }'
```

#### **Wearable Device Connection:**
```bash
# Connect wearable device
curl -X POST "http://localhost:3000/api/multimodal/wearables/connect" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "deviceType": "smartwatch",
    "deviceConfig": {
      "brand": "Samsung",
      "model": "Galaxy Watch"
    }
  }'
```

#### **Health Monitoring:**
```bash
# Process health data
curl -X POST "http://localhost:3000/api/multimodal/health/process" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "healthData": {
      "heartRate": 72,
      "bloodPressure": "120/80",
      "steps": 8500
    }
  }'
```

### 🌍 **5. Cultural & Language Optimization**

#### **Cultural Preferences Setup:**
```bash
# Save Korean cultural preferences
curl -X POST "http://localhost:3000/api/cultural/preferences/user_001" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ko",
    "formalityLevel": "polite",
    "age": 65
  }'
```

#### **Cultural Greeting Generation:**
```bash
# Generate cultural greeting
curl -X POST "http://localhost:3000/api/cultural/greeting" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ko",
    "formalityLevel": "polite"
  }'
```

#### **Cultural Response Patterns:**
```bash
# Generate cultural response pattern
curl -X POST "http://localhost:3000/api/cultural/response" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ko",
    "formalityLevel": "polite",
    "responseType": "gratitude"
  }'
```

#### **Cultural Context Application:**
```bash
# Apply cultural context
curl -X POST "http://localhost:3000/api/cultural/context" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ko",
    "formalityLevel": "polite",
    "message": "Hello",
    "userAge": 65
  }'
```

## 🛠️ **Technical Architecture**

### **Backend Technologies:**
- **Node.js/Express.js** - Robust server framework
- **Ollama Integration** - Local LLM inference engine
- **OpenAI API Compatibility** - Standard API interface
- **WebSocket Support** - Real-time communication
- **File-based Storage** - Local data persistence

### **Security Implementation:**
- **Helmet.js** - Security headers and protection
- **Rate Limiting** - Request throttling and abuse prevention
- **Token Authentication** - Secure access control
- **Input Validation** - Data sanitization and verification
- **Audit Logging** - Complete activity tracking

### **Data Management:**
- **JSON-based Storage** - Simple, portable data format
- **Encryption** - AES-256 data protection
- **Backup System** - Encrypted data backups
- **Data Export** - User-controlled data portability

## 📚 **Complete API Reference**

### **Core Endpoints:**
- **`/v1/chat/completions`** - OpenAI-compatible chat API with memory
- **`/api/memory/:userId/*`** - Complete memory management system
- **`/api/cognitive/training/:userId/*`** - Cognitive enhancement training
- **`/api/multimodal/*`** - Multimodal data processing and integration
- **`/api/cultural/*`** - Cultural optimization and language support
- **`/api/security/*`** - Security, privacy, and data management

### **Authentication:**
All API endpoints require authentication using Bearer token:
```bash
Authorization: Bearer your-secret-key-here
```

## 🎯 **Real-World Use Cases**

### **For Elderly Care:**
- **Memory Support**: Remember important conversations and events
- **Cognitive Training**: Maintain cognitive abilities through regular brain training
- **Health Monitoring**: Real-time health status tracking with wearable devices
- **Cultural Sensitivity**: Respectful expressions and conversation styles appropriate for Korean culture

### **For Healthcare Professionals:**
- **Patient Memory**: Track patients' long-term memories and preferences
- **Cognitive Assessment**: Ability assessment through cognitive training
- **Remote Monitoring**: Remote health monitoring and data collection
- **Cultural Communication**: Appropriate communication with patients from diverse cultures

### **For Research:**
- **Memory Studies**: Research on long-term memory pattern analysis
- **Cognitive Research**: Research on training effectiveness evaluation
- **Cultural Studies**: Research on cross-cultural communication patterns
- **Health Analytics**: Research on multimodal health data

## 🔧 **Configuration & Setup**

### **Environment Variables:**
Create a `.env` file in the project root:
```env
PORT=3000
SECRET_KEY=your-secret-key-here
OLLAMA_URL=http://localhost:11434
ALLOWED_ORIGINS=http://localhost:3000
```

### **Security Settings:**
- **Encryption**: Enable/disable data encryption
- **Audit Logging**: Configure logging levels
- **Rate Limiting**: Set request limits
- **Access Control**: Manage authentication tokens

## 📖 **Complete Documentation**

### **User Guides:**
- **[Memory Features Guide](MEMORY_FEATURES.md)** - Complete memory system documentation
- **[Security Guide](SECURITY_GUIDE.md)** - Privacy and security features
- **[Cognitive Training Guide](COGNITIVE_TRAINING_GUIDE.md)** - Training system usage
- **[Multimodal Integration Guide](MULTIMODAL_INTEGRATION_GUIDE.md)** - Sensor and device integration
- **[Cultural Optimization Guide](CULTURAL_OPTIMIZATION_GUIDE.md)** - Cultural features and usage

### **Technical Documentation:**
- **[Project Overview](PROJECT_OVERVIEW.md)** - System architecture and design
- **[Advanced Memory Guide](ADVANCED_MEMORY_GUIDE.md)** - Technical memory implementation
- **[User Guide](USER_GUIDE.md)** - End-user interface documentation
- **[Ollama Setup Guide](OLLAMA_SETUP_GUIDE.md)** - Local AI model setup

## 🤝 **Contributing**

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on:
- Code style and standards
- Testing requirements
- Pull request process
- Development setup

## 📄 **License**

This project is licensed under the **GNU General Public License v2.0 (GPLv2)** - a strong copyleft license that ensures all derivative works remain free and open source. See the [LICENSE](LICENSE) file for complete terms and conditions.

**Key GPLv2 Requirements:**
- **Freedom to Use**: You can use the software for any purpose
- **Freedom to Study**: You can examine how the software works
- **Freedom to Share**: You can redistribute copies
- **Freedom to Modify**: You can modify and improve the software
- **Copyleft Protection**: Any derivative works must also be licensed under GPLv2

## 🙏 **Acknowledgments**

- **Ollama Team** - Local LLM inference engine
- **Express.js Community** - Web framework
- **OpenAI** - API compatibility standards
- **Research Community** - Cognitive enhancement methodologies

## 📞 **Support**

- **Issues**: Report bugs and request features on GitHub
- **Discussions**: Join community discussions
- **Documentation**: Comprehensive guides and examples
- **Examples**: Sample implementations and use cases

---

**🌟 Kairos - Empowering Healthy Aging Through Intelligent AI**

*Built with ❤️ for cognitive health and privacy-first AI experiences*

**🎯 5 Core Features Successfully Implemented:**
1. ✅ **Long-term Memory & Contextualization** - Intelligent memory system
2. ✅ **Privacy-Centric Security** - Military-grade encryption and local storage
3. ✅ **Cognitive Enhancement** - Personalized training routines
4. ✅ **Multimodal Integration** - Voice, video, sensor, and health data
5. ✅ **Cultural Optimization** - Multi-language and cultural sensitivity 