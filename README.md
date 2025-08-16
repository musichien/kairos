# 🌟 Kairos AI - Cognitive Enhancement Platform

**AI for Healthy and Clear-Minded Aging with Advanced Memory, Security, and Cultural Intelligence**

Welcome to Kairos! This project provides a **comprehensive AI platform** that combines long-term memory, privacy-centric processing, cognitive enhancement training, multimodal integration, and cultural optimization to support healthy aging and cognitive health.

## 🎯 **5 Core Features Overview**

### 1. 🧠 **Long-term Memory & Contextualization Technology**
**시간축을 따라가는 기억 구조를 개발해, 사용자의 인생 사건을 자연스럽게 연결**

- **Intelligent Memory System**: 이전 대화나 기억을 기반으로 적절한 질문을 하거나, 사용자의 감정 상태를 추적
- **Life Event Connection**: 인생 사건들을 시간순으로 연결하여 맥락적 이해 제공
- **Emotional State Tracking**: 사용자의 감정 상태 변화를 추적하고 패턴 분석
- **Behavioral Pattern Recognition**: 일상 행동 패턴을 분석하여 개인화된 경험 제공

### 2. 🔒 **Privacy-Centric On-Device Processing**
**개인 정보를 로컬에서 안전하게 처리할 수 있는 경량화된 AI 모델**

- **Local Data Storage**: 모든 데이터를 로컬에 저장하여 데이터 유출 위험 최소화
- **Military-Grade Encryption**: AES-256 암호화로 사용자 신뢰 극대화
- **No Cloud Dependency**: 인터넷 없이도 AI 기능 사용 가능
- **Complete Privacy Control**: 사용자가 데이터 접근과 공유를 완전히 제어

### 3. 🧩 **Cognitive Enhancement Routines**
**단순 대화가 아니라, 기억을 활용해 인지 기능을 자극하는 훈련을 제공**

- **Memory-Based Training**: 과거 기억을 회상하게 하는 퀴즈 제공
- **Pattern Recognition**: 일상에서의 작은 변화에 대해 인지하게 하는 미션 제공
- **Personalized Exercises**: 사용자의 기억 데이터를 활용한 맞춤형 훈련
- **Progress Tracking**: 인지 능력 향상 과정을 체계적으로 추적

### 4. 🔊 **Multimodal Integration**
**음성, 영상, 센서 데이터 등을 활용해 사용자 상황을 더 정확히 파악**

- **Voice & Video Processing**: 음성 인식, 영상 분석을 통한 상황 이해
- **Sensor Data Integration**: IoT 기기와의 연동으로 환경 데이터 수집
- **Wearable Device Connectivity**: 웨어러블 기기와 연동해 실시간 건강 데이터 반영
- **Real-time Health Monitoring**: 건강 상태를 실시간으로 모니터링하고 분석

### 5. 🌍 **Cultural & Language Optimization**
**한국어 및 아시아권 문화에 맞춘 대화 스타일, 존중 표현 등을 최적화**

- **Asian Cultural Sensitivity**: 한국어, 일본어, 중국어 문화권에 특화된 대화 스타일
- **Respectful Communication**: 연령과 상황에 맞는 존중 표현 최적화
- **Global Market Ready**: 글로벌 시장 진입 시에도 다양한 문화권에 맞춘 커스터마이징 가능
- **Multi-language Support**: 영어, 프랑스어, 한국어, 일본어, 중국어 지원

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
사용자: "안녕하세요, 저는 김철수입니다."
AI: "안녕하세요, 김철수님! 처음 뵙겠습니다. 어떤 도움이 필요하신가요?"

사용자: "제가 좋아하는 음식이 뭐였지?"
AI: "김철수님, 이전에 말씀해주신 적이 없어서 아직 모르겠습니다. 
     어떤 음식을 좋아하시는지 알려주시면 기억하겠습니다."

사용자: "저는 김치찌개를 좋아해요."
AI: "알겠습니다! 김철수님이 김치찌개를 좋아하신다고 기억하겠습니다."

(나중에...)
사용자: "오늘 점심 뭐 먹을까?"
AI: "김철수님이 김치찌개를 좋아하신다고 기억하는데, 
     오늘 점심으로 김치찌개는 어떠신가요?"
```

#### **Advanced Memory Features:**
```bash
# 메모리 통계 조회
curl -X GET "http://localhost:3000/api/memory/user_001/stats" \
  -H "Authorization: Bearer your-secret-key-here"

# 인생 사건 타임라인 조회
curl -X GET "http://localhost:3000/api/memory/user_001/timeline" \
  -H "Authorization: Bearer your-secret-key-here"

# 맥락 패턴 분석
curl -X GET "http://localhost:3000/api/memory/user_001/patterns" \
  -H "Authorization: Bearer your-secret-key-here"
```

### 🔒 **2. Privacy-Centric Security**

#### **Security Status Check:**
```bash
# 보안 상태 조회
curl -X GET "http://localhost:3000/api/security/status" \
  -H "Authorization: Bearer your-secret-key-here"

# 보안 설정 업데이트
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
# 암호화된 메모리 백업
curl -X POST "http://localhost:3000/api/security/backup/user_001" \
  -H "Authorization: Bearer your-secret-key-here"

# 메모리 복원
curl -X POST "http://localhost:3000/api/security/restore/user_001" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{"backupPath": "backups/user_001_backup_1234567890.enc"}'
```

### 🧩 **3. Cognitive Enhancement Training**

#### **Training Generation:**
```bash
# 개인화된 인지 훈련 생성
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
🧠 기억 회상 훈련:
"김철수님, 지난주에 어떤 일을 하셨나요? 
기억나는 대로 말씀해주세요."

🔍 패턴 인식 훈련:
"김철수님의 일상 패턴을 보면, 
아침에 커피를 마시는 시간이 일정한 것 같습니다. 
이 패턴이 맞나요?"

💭 인지 자극 훈련:
"오늘 아침에 집을 나올 때, 
어떤 색깔의 옷을 입고 계셨나요? 
자세히 기억해보세요."
```

#### **Training Progress:**
```bash
# 훈련 기록 조회
curl -X GET "http://localhost:3000/api/cognitive/training/user_001/records" \
  -H "Authorization: Bearer your-secret-key-here"

# 훈련 통계 조회
curl -X GET "http://localhost:3000/api/cognitive/training/user_001/stats" \
  -H "Authorization: Bearer your-secret-key-here"
```

### 🔊 **4. Multimodal Integration**

#### **Voice Processing:**
```bash
# 음성 처리
curl -X POST "http://localhost:3000/api/multimodal/voice/process" \
  -H "Authorization: Bearer your-secret-key-here" \
  -F "audioFile=@voice_message.wav" \
  -F "userId=user_001"

# 음성 합성
curl -X POST "http://localhost:3000/api/multimodal/voice/synthesize" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_001",
    "text": "안녕하세요, 김철수님!",
    "voiceType": "natural"
  }'
```

#### **Sensor Data Integration:**
```bash
# 센서 데이터 처리
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
# 웨어러블 기기 연결
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
# 건강 데이터 처리
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
# 한국어 문화적 선호도 저장
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
# 문화적 인사말 생성
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
# 문화적 응답 패턴 생성
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
# 문화적 컨텍스트 적용
curl -X POST "http://localhost:3000/api/cultural/context" \
  -H "Authorization: Bearer your-secret-key-here" \
  -H "Content-Type: application/json" \
  -d '{
    "language": "ko",
    "formalityLevel": "polite",
    "message": "안녕하세요",
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
- **Memory Support**: 중요한 대화와 이벤트 기억
- **Cognitive Training**: 정기적인 두뇌 훈련으로 인지 능력 유지
- **Health Monitoring**: 웨어러블 기기로 건강 상태 실시간 추적
- **Cultural Sensitivity**: 한국 문화에 맞는 존중 표현과 대화 스타일

### **For Healthcare Professionals:**
- **Patient Memory**: 환자의 장기 기억과 선호도 추적
- **Cognitive Assessment**: 인지 훈련을 통한 능력 평가
- **Remote Monitoring**: 원격 건강 모니터링 및 데이터 수집
- **Cultural Communication**: 다양한 문화권 환자와의 적절한 소통

### **For Research:**
- **Memory Studies**: 장기 기억 패턴 분석 연구
- **Cognitive Research**: 훈련 효과성 평가 연구
- **Cultural Studies**: 문화간 의사소통 패턴 연구
- **Health Analytics**: 멀티모달 건강 데이터 연구

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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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