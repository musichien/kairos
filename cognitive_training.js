const fs = require('fs');
const path = require('path');

/**
 * 🧠 Cognitive Training Module
 * Provides memory recall exercises, pattern recognition tasks, and cognitive stimulation
 * to enhance cognitive function and support healthy aging
 */
class CognitiveTrainingManager {
  constructor() {
    this.trainingDataPath = path.join(__dirname, 'cognitive_training_data');
    this.ensureTrainingDataDirectory();
    this.loadTrainingTemplates();
  }

  ensureTrainingDataDirectory() {
    if (!fs.existsSync(this.trainingDataPath)) {
      fs.mkdirSync(this.trainingDataPath, { recursive: true });
    }
  }

  loadTrainingTemplates() {
    this.trainingTemplates = {
      memoryRecall: {
        name: "Memory Recall Exercise",
        description: "기억 회상 훈련 - 과거 대화나 사건을 기억해내는 연습",
        categories: ["conversation", "events", "facts", "preferences"],
        difficulty: ["easy", "medium", "hard"],
        types: ["quiz", "story", "timeline", "association"]
      },
      patternRecognition: {
        name: "Pattern Recognition Task",
        description: "패턴 인식 훈련 - 반복되는 주제나 행동 패턴을 찾아내는 연습",
        categories: ["emotional", "behavioral", "temporal", "topical"],
        difficulty: ["easy", "medium", "hard"],
        types: ["sequence", "category", "trend", "correlation"]
      },
      cognitiveStimulation: {
        name: "Cognitive Stimulation Activity",
        description: "인지 자극 활동 - 새로운 정보를 연결하고 추론하는 연습",
        categories: ["problem_solving", "creativity", "logic", "attention"],
        difficulty: ["easy", "medium", "hard"],
        types: ["puzzle", "scenario", "decision", "observation"]
      },
      attentionTraining: {
        name: "Attention Training Exercise",
        description: "주의력 훈련 - 세부사항을 관찰하고 기억하는 연습",
        categories: ["visual", "auditory", "detail", "focus"],
        difficulty: ["easy", "medium", "hard"],
        types: ["spot_difference", "sequence_memory", "detail_recall", "focus_task"]
      },
      // Mnemosyne 기반 훈련
      mnemosyneTraining: {
        name: "Mnemosyne Cultural Memory Training",
        description: "Mnemosyne 문화적 기억 훈련 - 문화와 정체성을 통한 기억 강화",
        categories: ["cultural", "mythological", "temporal", "identity"],
        difficulty: ["easy", "medium", "hard"],
        types: ["cultural_recall", "mythological_connection", "temporal_analysis", "identity_exploration"]
      }
    };
  }

  /**
   * 사용자의 메모리를 기반으로 개인화된 인지 훈련 생성
   */
  generatePersonalizedTraining(userId, memoryData, trainingType = 'memoryRecall', difficulty = 'medium') {
    try {
      console.log('🧠 Generating personalized training:', { userId, trainingType, difficulty });
      console.log('🧠 Memory data received:', memoryData ? 'exists' : 'null/undefined');
      console.log('🧠 Memory data type:', typeof memoryData);
      console.log('🧠 Memory data keys:', memoryData ? Object.keys(memoryData) : 'none');
      
      const template = this.trainingTemplates[trainingType];
      if (!template) {
        throw new Error(`Unknown training type: ${trainingType}`);
      }

      const training = {
        id: `training_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: trainingType,
        difficulty: difficulty,
        timestamp: new Date().toISOString(),
        userId: userId,
        status: 'active',
        score: 0,
        maxScore: 0,
        attempts: 0,
        completed: false
      };

      switch (trainingType) {
        case 'memoryRecall':
          training.exercise = this.generateMemoryRecallExercise(memoryData, difficulty);
          break;
        case 'patternRecognition':
          training.exercise = this.generatePatternRecognitionExercise(memoryData, difficulty);
          break;
        case 'cognitiveStimulation':
          training.exercise = this.generateCognitiveStimulationExercise(memoryData, difficulty);
          break;
        case 'attentionTraining':
          training.exercise = this.generateAttentionTrainingExercise(memoryData, difficulty);
          break;
        case 'mnemosyneTraining':
          training.exercise = this.generateMnemosyneTrainingExercise(memoryData, difficulty);
          break;
        default:
          throw new Error(`Training type not implemented: ${trainingType}`);
      }

      return training;
    } catch (error) {
      console.error('개인화된 훈련 생성 실패:', error);
      throw error;
    }
  }

  /**
   * 기억 회상 훈련 생성
   */
  generateMemoryRecallExercise(memoryData, difficulty) {
    // Ensure memoryData exists and has required properties
    if (!memoryData) {
      console.log('⚠️ No memory data provided, using default exercise');
      return this.createDefaultMemoryExercise();
    }
    
    const conversations = memoryData.conversations || [];
    const facts = memoryData.facts || [];
    const preferences = memoryData.preferences || [];
    const lifeEvents = memoryData.lifeEvents || [];
    
    console.log('🧠 Memory data for exercise:', {
      conversations: conversations.length,
      facts: facts.length,
      preferences: preferences.length,
      lifeEvents: lifeEvents.length
    });

    const exerciseTypes = {
      easy: ['conversation_summary', 'fact_recall', 'preference_check'],
      medium: ['event_timeline', 'detail_recall', 'context_memory'],
      hard: ['cross_reference', 'emotional_memory', 'pattern_memory']
    };

    const availableTypes = exerciseTypes[difficulty] || exerciseTypes.medium;
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    switch (selectedType) {
      case 'conversation_summary':
        return this.createConversationSummaryExercise(conversations, difficulty);
      case 'fact_recall':
        return this.createFactRecallExercise(facts, difficulty);
      case 'preference_check':
        return this.createPreferenceCheckExercise(preferences, difficulty);
      case 'event_timeline':
        return this.createEventTimelineExercise(lifeEvents, difficulty);
      case 'detail_recall':
        return this.createDetailRecallExercise(conversations, facts, difficulty);
      case 'context_memory':
        return this.createContextMemoryExercise(conversations, difficulty);
      case 'cross_reference':
        return this.createCrossReferenceExercise(memoryData, difficulty);
      case 'emotional_memory':
        return this.createEmotionalMemoryExercise(memoryData, difficulty);
      case 'pattern_memory':
        return this.createPatternMemoryExercise(memoryData, difficulty);
      default:
        return this.createConversationSummaryExercise(conversations, difficulty);
    }
  }

  /**
   * 대화 요약 훈련 생성
   */
  createConversationSummaryExercise(conversations, difficulty) {
    if (conversations.length === 0) {
      return this.createDefaultMemoryExercise();
    }

    const recentConversations = conversations
      .filter(conv => conv.summary)
      .slice(-5);

    if (recentConversations.length === 0) {
      return this.createDefaultMemoryExercise();
    }

    const selectedConversation = recentConversations[Math.floor(Math.random() * recentConversations.length)];
    const summary = selectedConversation.summary;
    const timestamp = new Date(selectedConversation.timestamp);

    const questions = [
      {
        type: 'multiple_choice',
        question: `다음 중 우리가 언제 대화했는지 맞는 것은?`,
        options: [
          `${timestamp.toLocaleDateString('ko-KR')} 오전`,
          `${timestamp.toLocaleDateString('ko-KR')} 오후`,
          `${timestamp.toLocaleDateString('ko-KR')} 저녁`,
          `${timestamp.toLocaleDateString('ko-KR')} 밤`
        ],
        correctAnswer: this.getTimeOfDay(timestamp),
        explanation: `이 대화는 ${timestamp.toLocaleDateString('ko-KR')} ${this.getTimeOfDay(timestamp)}에 나눈 대화입니다.`
      },
      {
        type: 'fill_blank',
        question: `우리가 나눈 대화의 요약: "${summary.substring(0, 100)}..."\n이 대화에서 언급된 주요 주제는 무엇인가요?`,
        correctAnswer: this.extractMainTopic(summary),
        explanation: `이 대화의 주요 주제는 "${this.extractMainTopic(summary)}"였습니다.`
      }
    ];

    return {
      title: "대화 기억 회상 훈련",
      description: "최근에 나눈 대화를 기억해보세요.",
      type: "memory_recall",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : 60
    };
  }

  /**
   * 사실 회상 훈련 생성
   */
  createFactRecallExercise(facts, difficulty) {
    if (facts.length === 0) {
      return this.createDefaultMemoryExercise();
    }

    const selectedFacts = facts.slice(-3);
    const questions = selectedFacts.map((fact, index) => ({
      type: 'true_false',
      question: `다음 중 맞는 것은?\n"${fact.content}"`,
      correctAnswer: true,
      explanation: `이 정보는 ${fact.timestamp ? new Date(fact.timestamp).toLocaleDateString('ko-KR') : '이전에'} 저장된 사실입니다.`
    }));

    return {
      title: "사실 기억 회상 훈련",
      description: "저장된 사실들을 기억해보세요.",
      type: "fact_recall",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 선호도 확인 훈련 생성
   */
  createPreferenceCheckExercise(preferences, difficulty) {
    if (preferences.length === 0) {
      return this.createDefaultMemoryExercise();
    }

    const selectedPreferences = preferences.slice(-3);
    const questions = selectedPreferences.map(pref => ({
      type: 'multiple_choice',
      question: `당신의 선호도 중 "${pref.category}"에 관한 것은?`,
      options: [
        pref.content,
        "기억나지 않습니다",
        "다른 선호도가 있습니다",
        "변경되었습니다"
      ],
      correctAnswer: pref.content,
      explanation: `당신의 ${pref.category} 관련 선호도는 "${pref.content}"입니다.`
    }));

    return {
      title: "선호도 기억 훈련",
      description: "당신의 선호도를 기억해보세요.",
      type: "preference_recall",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 패턴 인식 훈련 생성
   */
  generatePatternRecognitionExercise(memoryData, difficulty) {
    const emotionalStates = memoryData.emotionalStates || [];
    const contextPatterns = memoryData.contextPatterns || [];
    const conversations = memoryData.conversations || [];

    const exerciseTypes = {
      easy: ['emotional_pattern', 'topic_pattern', 'time_pattern'],
      medium: ['behavioral_pattern', 'context_pattern', 'frequency_pattern'],
      hard: ['correlation_pattern', 'trend_analysis', 'complex_pattern']
    };

    const availableTypes = exerciseTypes[difficulty] || exerciseTypes.medium;
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    switch (selectedType) {
      case 'emotional_pattern':
        return this.createEmotionalPatternExercise(emotionalStates, difficulty);
      case 'topic_pattern':
        return this.createTopicPatternExercise(conversations, difficulty);
      case 'time_pattern':
        return this.createTimePatternExercise(conversations, difficulty);
      case 'behavioral_pattern':
        return this.createBehavioralPatternExercise(memoryData, difficulty);
      case 'context_pattern':
        return this.createContextPatternExercise(contextPatterns, difficulty);
      case 'frequency_pattern':
        return this.createFrequencyPatternExercise(memoryData, difficulty);
      default:
        return this.createEmotionalPatternExercise(emotionalStates, difficulty);
    }
  }

  /**
   * 감정 패턴 훈련 생성
   */
  createEmotionalPatternExercise(emotionalStates, difficulty) {
    if (emotionalStates.length < 3) {
      return this.createDefaultPatternExercise();
    }

    const recentEmotions = emotionalStates.slice(-5);
    const emotionCounts = {};
    recentEmotions.forEach(emotion => {
      emotionCounts[emotion.primary] = (emotionCounts[emotion.primary] || 0) + 1;
    });

    const dominantEmotion = Object.keys(emotionCounts).reduce((a, b) => 
      emotionCounts[a] > emotionCounts[b] ? a : b
    );

    const questions = [
      {
        type: 'multiple_choice',
        question: `최근 대화에서 가장 자주 나타난 감정은?`,
        options: Object.keys(emotionCounts),
        correctAnswer: dominantEmotion,
        explanation: `최근 대화에서 "${dominantEmotion}" 감정이 가장 자주 나타났습니다.`
      },
      {
        type: 'fill_blank',
        question: `최근 감정 패턴을 보면 어떤 감정이 증가하고 있나요?`,
        correctAnswer: this.analyzeEmotionTrend(recentEmotions),
        explanation: `감정 패턴 분석 결과, "${this.analyzeEmotionTrend(recentEmotions)}" 감정이 증가하는 추세입니다.`
      }
    ];

    return {
      title: "감정 패턴 인식 훈련",
      description: "최근 감정 패턴을 분석해보세요.",
      type: "emotional_pattern",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : 60
    };
  }

  /**
   * 인지 자극 훈련 생성
   */
  generateCognitiveStimulationExercise(memoryData, difficulty) {
    const conversations = memoryData.conversations || [];
    const facts = memoryData.facts || [];
    const goals = memoryData.goals || [];

    const exerciseTypes = {
      easy: ['problem_solving', 'creative_thinking', 'logical_reasoning'],
      medium: ['scenario_analysis', 'decision_making', 'hypothesis_testing'],
      hard: ['complex_problem', 'creative_synthesis', 'critical_analysis']
    };

    const availableTypes = exerciseTypes[difficulty] || exerciseTypes.medium;
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    switch (selectedType) {
      case 'problem_solving':
        return this.createProblemSolvingExercise(memoryData, difficulty);
      case 'creative_thinking':
        return this.createCreativeThinkingExercise(memoryData, difficulty);
      case 'logical_reasoning':
        return this.createLogicalReasoningExercise(memoryData, difficulty);
      case 'scenario_analysis':
        return this.createScenarioAnalysisExercise(memoryData, difficulty);
      case 'decision_making':
        return this.createDecisionMakingExercise(memoryData, difficulty);
      default:
        return this.createProblemSolvingExercise(memoryData, difficulty);
    }
  }

  /**
   * 문제 해결 훈련 생성
   */
  createProblemSolvingExercise(memoryData, difficulty) {
    const goals = memoryData.goals || [];
    const problems = goals.filter(goal => goal.status === 'active' && goal.progress < 100);

    if (problems.length === 0) {
      return this.createDefaultCognitiveExercise();
    }

    const selectedProblem = problems[Math.floor(Math.random() * problems.length)];

    const questions = [
      {
        type: 'open_ended',
        question: `목표 "${selectedProblem.goal}"를 달성하기 위해 어떤 단계가 필요한가요?`,
        correctAnswer: this.generateProblemSteps(selectedProblem),
        explanation: `목표 달성을 위한 단계: 1) 계획 수립, 2) 실행, 3) 모니터링, 4) 조정`
      },
      {
        type: 'multiple_choice',
        question: `이 목표의 현재 진행률은?`,
        options: ['0-25%', '26-50%', '51-75%', '76-100%'],
        correctAnswer: this.getProgressRange(selectedProblem.progress),
        explanation: `현재 진행률은 ${selectedProblem.progress}%입니다.`
      }
    ];

    return {
      title: "목표 달성 문제 해결 훈련",
      description: "현재 목표를 달성하기 위한 방법을 생각해보세요.",
      type: "problem_solving",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 180 : difficulty === 'medium' ? 120 : 90
    };
  }

  /**
   * 창의적 사고 훈련 생성
   */
  createCreativeThinkingExercise(memoryData, difficulty) {
    return this.createDefaultCognitiveExercise();
  }

  /**
   * 논리적 추론 훈련 생성
   */
  createLogicalReasoningExercise(memoryData, difficulty) {
    return this.createDefaultCognitiveExercise();
  }

  /**
   * 시나리오 분석 훈련 생성
   */
  createScenarioAnalysisExercise(memoryData, difficulty) {
    return this.createDefaultCognitiveExercise();
  }

  /**
   * 의사결정 훈련 생성
   */
  createDecisionMakingExercise(memoryData, difficulty) {
    return this.createDefaultCognitiveExercise();
  }

  /**
   * 주의력 훈련 생성
   */
  generateAttentionTrainingExercise(memoryData, difficulty) {
    const conversations = memoryData.conversations || [];
    const facts = memoryData.facts || [];

    const exerciseTypes = {
      easy: ['detail_observation', 'sequence_memory', 'focus_task'],
      medium: ['pattern_spotting', 'context_switching', 'sustained_attention'],
      hard: ['divided_attention', 'selective_attention', 'working_memory']
    };

    const availableTypes = exerciseTypes[difficulty] || exerciseTypes.medium;
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    switch (selectedType) {
      case 'detail_observation':
        return this.createDetailObservationExercise(memoryData, difficulty);
      case 'sequence_memory':
        return this.createSequenceMemoryExercise(conversations, difficulty);
      case 'focus_task':
        return this.createFocusTaskExercise(memoryData, difficulty);
      default:
        return this.createDetailObservationExercise(memoryData, difficulty);
    }
  }

  /**
   * 세부사항 관찰 훈련 생성
   */
  createDetailObservationExercise(memoryData, difficulty) {
    const conversations = memoryData.conversations || [];
    const facts = memoryData.facts || [];

    if (conversations.length === 0 && facts.length === 0) {
      return this.createDefaultAttentionExercise();
    }

    const recentData = [...conversations.slice(-3), ...facts.slice(-2)];
    const selectedItem = recentData[Math.floor(Math.random() * recentData.length)];

    const questions = [
      {
        type: 'multiple_choice',
        question: `다음 중 정확한 세부사항은?\n"${selectedItem.summary || selectedItem.content}"`,
        options: [
          "정확한 정보입니다",
          "일부만 맞습니다",
          "대부분 틀렸습니다",
          "기억나지 않습니다"
        ],
        correctAnswer: "정확한 정보입니다",
        explanation: "이 정보는 정확하게 기록된 내용입니다."
      }
    ];

    return {
      title: "세부사항 관찰 훈련",
      description: "정보의 세부사항을 주의 깊게 관찰해보세요.",
      type: "detail_observation",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30
    };
  }

  /**
   * 순서 기억 훈련 생성
   */
  createSequenceMemoryExercise(conversations, difficulty) {
    if (conversations.length === 0) {
      return this.createDefaultAttentionExercise();
    }
    
    const questions = [{
      type: 'multiple_choice',
      question: "대화의 순서를 기억하는 데 가장 중요한 것은?",
      options: ["시간", "장소", "감정", "주제"],
      correctAnswer: "시간",
      explanation: "시간 순서가 대화의 맥락을 이해하는 데 가장 중요합니다."
    }];

    return {
      title: "순서 기억 훈련",
      description: "대화의 순서를 정확히 기억해보세요.",
      type: "sequence_memory",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 집중력 훈련 생성
   */
  createFocusTaskExercise(memoryData, difficulty) {
    return this.createDefaultAttentionExercise();
  }

  /**
   * 훈련 결과 평가
   */
  evaluateTrainingResult(training, userAnswers) {
    const exercise = training.exercise;
    let score = 0;
    const feedback = [];

    exercise.questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const isCorrect = this.checkAnswer(question, userAnswer);
      
      if (isCorrect) {
        score += 10;
        feedback.push({
          questionIndex: index,
          correct: true,
          feedback: question.explanation || "정답입니다!"
        });
      } else {
        feedback.push({
          questionIndex: index,
          correct: false,
          feedback: question.explanation || "틀렸습니다. 다시 생각해보세요.",
          correctAnswer: question.correctAnswer
        });
      }
    });

    const completionRate = (score / exercise.maxScore) * 100;
    const performance = this.assessPerformance(completionRate);

    return {
      score: score,
      maxScore: exercise.maxScore,
      completionRate: completionRate,
      performance: performance,
      feedback: feedback,
      completed: true,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * 답변 확인
   */
  checkAnswer(question, userAnswer) {
    switch (question.type) {
      case 'multiple_choice':
        return userAnswer === question.correctAnswer;
      case 'true_false':
        return userAnswer === question.correctAnswer;
      case 'fill_blank':
        return this.checkTextAnswer(userAnswer, question.correctAnswer);
      case 'open_ended':
        return this.checkOpenEndedAnswer(userAnswer, question.correctAnswer);
      default:
        return false;
    }
  }

  /**
   * 텍스트 답변 확인
   */
  checkTextAnswer(userAnswer, correctAnswer) {
    if (!userAnswer || !correctAnswer) return false;
    
    const userWords = userAnswer.toLowerCase().split(/\s+/);
    const correctWords = correctAnswer.toLowerCase().split(/\s+/);
    
    const matchingWords = userWords.filter(word => 
      correctWords.some(correctWord => 
        correctWord.includes(word) || word.includes(correctWord)
      )
    );
    
    return matchingWords.length >= Math.min(userWords.length, correctWords.length) * 0.6;
  }

  /**
   * 주관식 답변 확인
   */
  checkOpenEndedAnswer(userAnswer, correctAnswer) {
    if (!userAnswer) return false;
    
    const userText = userAnswer.toLowerCase();
    const correctText = correctAnswer.toLowerCase();
    
    // 키워드 매칭
    const keywords = correctText.split(/\s+/).filter(word => word.length > 3);
    const matchingKeywords = keywords.filter(keyword => 
      userText.includes(keyword)
    );
    
    return matchingKeywords.length >= keywords.length * 0.5;
  }

  /**
   * 성과 평가
   */
  assessPerformance(completionRate) {
    if (completionRate >= 90) return 'excellent';
    if (completionRate >= 80) return 'good';
    if (completionRate >= 70) return 'fair';
    if (completionRate >= 60) return 'needs_improvement';
    return 'poor';
  }

  /**
   * 기본 훈련 생성 (데이터가 부족한 경우)
   */
  createDefaultMemoryExercise() {
    return {
      title: "기본 기억 훈련",
      description: "새로운 정보를 기억해보세요.",
      type: "basic_memory",
      questions: [
        {
          type: 'multiple_choice',
          question: "오늘 날씨는 어떤가요?",
          options: ["맑음", "흐림", "비", "눈"],
          correctAnswer: "맑음",
          explanation: "현재 날씨를 관찰해보세요."
        }
      ],
      maxScore: 10,
      timeLimit: 60
    };
  }

  createDefaultPatternExercise() {
    return {
      title: "기본 패턴 훈련",
      description: "일상의 패턴을 관찰해보세요.",
      type: "basic_pattern",
      questions: [
        {
          type: 'multiple_choice',
          question: "일반적으로 언제 가장 활발한가요?",
          options: ["아침", "오후", "저녁", "밤"],
          correctAnswer: "오후",
          explanation: "자신의 패턴을 관찰해보세요."
        }
      ],
      maxScore: 10,
      timeLimit: 60
    };
  }

  createDefaultCognitiveExercise() {
    return {
      title: "기본 인지 훈련",
      description: "문제 해결 능력을 향상시켜보세요.",
      type: "basic_cognitive",
      questions: [
        {
          type: 'open_ended',
          question: "오늘 해결해야 할 가장 중요한 일은 무엇인가요?",
          correctAnswer: "개인적인 목표",
          explanation: "목표를 명확히 하는 것이 중요합니다."
        }
      ],
      maxScore: 10,
      timeLimit: 120
    };
  }

  createDefaultAttentionExercise() {
    return {
      title: "기본 주의력 훈련",
      description: "주의력을 집중시켜보세요.",
      type: "basic_attention",
      questions: [
        {
          type: 'multiple_choice',
          question: "현재 주변에서 들리는 소리는 무엇인가요?",
          options: ["조용함", "음악", "대화", "기계음"],
          correctAnswer: "조용함",
          explanation: "주변 환경에 주의를 기울여보세요."
        }
      ],
      maxScore: 10,
      timeLimit: 60
    };
  }

  // 헬퍼 메서드들
  getTimeOfDay(timestamp) {
    const hour = timestamp.getHours();
    if (hour < 12) return `${timestamp.toLocaleDateString('ko-KR')} 오전`;
    if (hour < 18) return `${timestamp.toLocaleDateString('ko-KR')} 오후`;
    return `${timestamp.toLocaleDateString('ko-KR')} 저녁`;
  }

  extractMainTopic(summary) {
    const topics = ['일상', '일', '가족', '건강', '취미', '학습', '관계'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  analyzeEmotionTrend(emotions) {
    const recent = emotions.slice(-3);
    const positive = recent.filter(e => ['happy', 'excited', 'content'].includes(e.primary)).length;
    const negative = recent.filter(e => ['sad', 'angry', 'anxious'].includes(e.primary)).length;
    
    if (positive > negative) return "긍정적";
    if (negative > positive) return "부정적";
    return "중립적";
  }

  generateProblemSteps(goal) {
    return `1) ${goal.goal}에 대한 구체적인 계획 수립\n2) 단계별 실행\n3) 진행 상황 모니터링\n4) 필요시 계획 조정`;
  }

  getProgressRange(progress) {
    if (progress <= 25) return '0-25%';
    if (progress <= 50) return '26-50%';
    if (progress <= 75) return '51-75%';
    return '76-100%';
  }

  /**
   * 이벤트 타임라인 훈련 생성
   */
  createEventTimelineExercise(lifeEvents, difficulty) {
    if (lifeEvents.length === 0) {
      return this.createDefaultMemoryExercise();
    }
    
    const recentEvents = lifeEvents.slice(-3);
    const questions = recentEvents.map((event, index) => ({
      type: 'multiple_choice',
      question: `인생 사건 "${event.title || '중요한 사건'}"이 언제 발생했나요?`,
      options: [
        new Date(event.timestamp).toLocaleDateString('ko-KR'),
        "기억나지 않습니다",
        "다른 날짜입니다",
        "정확하지 않습니다"
      ],
      correctAnswer: new Date(event.timestamp).toLocaleDateString('ko-KR'),
      explanation: `이 사건은 ${new Date(event.timestamp).toLocaleDateString('ko-KR')}에 발생했습니다.`
    }));

    return {
      title: "인생 사건 타임라인 훈련",
      description: "중요한 인생 사건들을 기억해보세요.",
      type: "event_timeline",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 120 : difficulty === 'medium' ? 90 : 60
    };
  }

  /**
   * 세부사항 회상 훈련 생성
   */
  createDetailRecallExercise(conversations, facts, difficulty) {
    const allData = [...conversations, ...facts];
    if (allData.length === 0) {
      return this.createDefaultMemoryExercise();
    }
    
    const selectedItem = allData[Math.floor(Math.random() * allData.length)];
    const questions = [{
      type: 'multiple_choice',
      question: `다음 정보의 세부사항 중 정확한 것은?\n"${selectedItem.summary || selectedItem.content}"`,
      options: [
        "정확한 정보입니다",
        "일부만 맞습니다",
        "대부분 틀렸습니다",
        "기억나지 않습니다"
      ],
      correctAnswer: "정확한 정보입니다",
      explanation: "이 정보는 정확하게 기록된 내용입니다."
    }];

    return {
      title: "세부사항 회상 훈련",
      description: "정보의 세부사항을 정확히 기억해보세요.",
      type: "detail_recall",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 맥락 기억 훈련 생성
   */
  createContextMemoryExercise(conversations, difficulty) {
    if (conversations.length === 0) {
      return this.createDefaultMemoryExercise();
    }
    
    const recentConversations = conversations.slice(-3);
    const questions = recentConversations.map((conv, index) => ({
      type: 'fill_blank',
      question: `대화 "${conv.summary?.substring(0, 50) || '최근 대화'}"의 맥락은 무엇인가요?`,
      correctAnswer: "일상적인 대화",
      explanation: "이 대화는 일상적인 맥락에서 나눈 대화입니다."
    }));

    return {
      title: "맥락 기억 훈련",
      description: "대화의 맥락을 기억해보세요.",
      type: "context_memory",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 교차 참조 훈련 생성
   */
  createCrossReferenceExercise(memoryData, difficulty) {
    return this.createDefaultMemoryExercise();
  }

  /**
   * 감정 기억 훈련 생성
   */
  createEmotionalMemoryExercise(memoryData, difficulty) {
    return this.createDefaultMemoryExercise();
  }

  /**
   * 패턴 기억 훈련 생성
   */
  createPatternMemoryExercise(memoryData, difficulty) {
    return this.createDefaultMemoryExercise();
  }

  /**
   * 토픽 패턴 훈련 생성
   */
  createTopicPatternExercise(conversations, difficulty) {
    if (conversations.length === 0) {
      return this.createDefaultPatternExercise();
    }
    
    const recentConversations = conversations.slice(-5);
    const questions = [{
      type: 'multiple_choice',
      question: "최근 대화에서 가장 자주 언급되는 주제는?",
      options: ["일상", "일", "가족", "건강", "취미"],
      correctAnswer: "일상",
      explanation: "일상적인 주제가 가장 자주 언급됩니다."
    }];

    return {
      title: "토픽 패턴 인식 훈련",
      description: "대화 주제의 패턴을 분석해보세요.",
      type: "topic_pattern",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 시간 패턴 훈련 생성
   */
  createTimePatternExercise(conversations, difficulty) {
    if (conversations.length === 0) {
      return this.createDefaultPatternExercise();
    }
    
    const questions = [{
      type: 'multiple_choice',
      question: "언제 가장 활발하게 대화하시나요?",
      options: ["아침", "오후", "저녁", "밤"],
      correctAnswer: "오후",
      explanation: "오후 시간대가 가장 활발한 대화 시간입니다."
    }];

    return {
      title: "시간 패턴 인식 훈련",
      description: "대화 시간의 패턴을 분석해보세요.",
      type: "time_pattern",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 행동 패턴 훈련 생성
   */
  createBehavioralPatternExercise(memoryData, difficulty) {
    return this.createDefaultPatternExercise();
  }

  /**
   * 맥락 패턴 훈련 생성
   */
  createContextPatternExercise(contextPatterns, difficulty) {
    if (contextPatterns.length === 0) {
      return this.createDefaultPatternExercise();
    }
    
    const questions = [{
      type: 'multiple_choice',
      question: "대화 맥락에서 가장 중요한 요소는?",
      options: ["시간", "장소", "감정", "주제"],
      correctAnswer: "주제",
      explanation: "대화의 주제가 맥락을 이해하는 데 가장 중요합니다."
    }];

    return {
      title: "맥락 패턴 인식 훈련",
      description: "대화 맥락의 패턴을 분석해보세요.",
      type: "context_pattern",
      questions: questions,
      maxScore: questions.length * 10,
      timeLimit: difficulty === 'easy' ? 90 : difficulty === 'medium' ? 60 : 45
    };
  }

  /**
   * 빈도 패턴 훈련 생성
   */
  createFrequencyPatternExercise(memoryData, difficulty) {
    return this.createDefaultPatternExercise();
  }

  /**
   * Mnemosyne 문화적 기억 훈련 생성
   */
  generateMnemosyneTrainingExercise(memoryData, difficulty = 'medium') {
    try {
      const mnemosyneData = memoryData?.mnemosyne || {};
      const exercise = {
        type: 'mnemosyne_cultural',
        title: 'Mnemosyne 문화적 기억 훈련',
        description: '문화와 정체성을 통한 기억 강화 훈련',
        difficulty: difficulty,
        questions: [],
        culturalContext: {},
        temporalElements: [],
        identityConnections: []
      };

      // 문화적 기억 기반 질문 생성
      if (mnemosyneData.culturalMemory && mnemosyneData.culturalMemory.length > 0) {
        const culturalQuestions = this.generateCulturalMemoryQuestions(mnemosyneData.culturalMemory, difficulty);
        exercise.questions.push(...culturalQuestions);
      }

      // 시간적 맥락 기반 질문 생성
      if (mnemosyneData.temporalContext && mnemosyneData.temporalContext.length > 0) {
        const temporalQuestions = this.generateTemporalContextQuestions(mnemosyneData.temporalContext, difficulty);
        exercise.questions.push(...temporalQuestions);
      }

      // 정체성 패턴 기반 질문 생성
      if (mnemosyneData.identityPatterns && mnemosyneData.identityPatterns.length > 0) {
        const identityQuestions = this.generateIdentityPatternQuestions(mnemosyneData.identityPatterns, difficulty);
        exercise.questions.push(...identityQuestions);
      }

      // 기본 Mnemosyne 질문 추가 (문화적 맥락이 부족한 경우)
      if (exercise.questions.length === 0) {
        exercise.questions = this.generateDefaultMnemosyneQuestions(difficulty);
      }

      exercise.maxScore = exercise.questions.length * 10;
      return exercise;
    } catch (error) {
      console.error('Mnemosyne 훈련 생성 실패:', error);
      return this.createDefaultMnemosyneExercise(difficulty);
    }
  }

  /**
   * 문화적 기억 기반 질문 생성
   */
  generateCulturalMemoryQuestions(culturalMemory, difficulty) {
    const questions = [];
    const recentCulturalMemory = culturalMemory.slice(-5); // 최근 5개

    recentCulturalMemory.forEach((memory, index) => {
      // content가 없는 경우 기본값 사용
      const content = memory.content || memory.type || '문화적 기억';
      const safeContent = content.substring ? content.substring(0, 50) : content;
      
      const question = {
        id: `cultural_${index}`,
        type: 'cultural_recall',
        question: `당신의 문화적 기억 중 "${safeContent}..."와 관련된 맥락은 무엇인가요?`,
        options: [
          `신화적 맥락 (${memory.type === 'mythology' ? '✓' : '○'})`,
          `교육적 맥락 (${memory.type === 'education' ? '✓' : '○'})`,
          `과학적 맥락 (${memory.type === 'science' ? '✓' : '○'})`,
          `문학적 맥락 (${memory.type === 'literature' ? '✓' : '○'})`
        ],
        correctAnswer: memory.type || 'mythology',
        explanation: `이 기억은 ${memory.type || '문화적'} 맥락에서 형성되었으며, ${memory.significance || '문화적 의미가 있습니다'}.`,
        culturalContext: memory.context || '일반적',
        difficulty: difficulty
      };
      questions.push(question);
    });

    return questions;
  }

  /**
   * 시간적 맥락 기반 질문 생성
   */
  generateTemporalContextQuestions(temporalContext, difficulty) {
    const questions = [];
    const recentTemporalContext = temporalContext.slice(-3); // 최근 3개

    recentTemporalContext.forEach((context, index) => {
      const question = {
        id: `temporal_${index}`,
        type: 'temporal_analysis',
        question: `${context.era} 시대의 기억 형성 방식은 현대와 어떻게 다른가요?`,
        options: [
          '구전 전통과 집단 기억',
          '문자 기록과 개인 기억',
          '디지털 저장과 공유 기억',
          '혼합적 접근 방식'
        ],
        correctAnswer: this.getCorrectTemporalAnswer(context.era),
        explanation: `${context.era} 시대는 ${context.memoryEvolution || '특정한 기억 형성 방식을 가지고 있었습니다'}.`,
        temporalContext: context.period,
        difficulty: difficulty
      };
      questions.push(question);
    });

    return questions;
  }

  /**
   * 정체성 패턴 기반 질문 생성
   */
  generateIdentityPatternQuestions(identityPatterns, difficulty) {
    const questions = [];
    const recentPatterns = identityPatterns.slice(-3); // 최근 3개

    recentPatterns.forEach((pattern, index) => {
      const question = {
        id: `identity_${index}`,
        type: 'identity_exploration',
        question: `당신의 정체성 패턴 "${pattern.pattern}"이 문화적 기억 형성에 어떤 영향을 미치나요?`,
        options: [
          '문화적 전통 강화',
          '새로운 문화 요소 수용',
          '문화적 혼합과 융합',
          '문화적 정체성 재정의'
        ],
        correctAnswer: pattern.culturalInfluence || '문화적 전통 강화',
        explanation: `이 패턴은 ${pattern.culturalInfluence || '문화적 영향'}을 나타내며, ${pattern.evolution || '지속적인 발전'}을 보여줍니다.`,
        identityContext: pattern.pattern,
        difficulty: difficulty
      };
      questions.push(question);
    });

    return questions;
  }

  /**
   * 기본 Mnemosyne 질문 생성
   */
  generateDefaultMnemosyneQuestions(difficulty) {
    const defaultQuestions = [
      {
        id: 'mnemosyne_default_1',
        type: 'mythological_connection',
        question: 'Mnemosyne는 그리스 신화에서 어떤 역할을 담당했나요?',
        options: ['전쟁의 여신', '기억의 여신', '지혜의 여신', '사랑의 여신'],
        correctAnswer: '기억의 여신',
        explanation: 'Mnemosyne는 그리스 신화에서 기억의 여신으로, 9명의 뮤즈의 어머니입니다.',
        culturalContext: '그리스 신화',
        difficulty: difficulty
      },
      {
        id: 'mnemosyne_default_2',
        type: 'cultural_evolution',
        question: '기억이 문화와 정체성에 미치는 영향은 시대별로 어떻게 변화했나요?',
        options: [
          '구전 전통 → 문자 기록 → 디지털 저장',
          '개인 기억 → 집단 기억 → 공유 기억',
          '지역적 기억 → 국가적 기억 → 글로벌 기억',
          '모든 위의 것들'
        ],
        correctAnswer: '모든 위의 것들',
        explanation: '기억의 형태와 의미는 시대와 함께 진화하며, 문화와 정체성의 핵심 요소로 작용합니다.',
        culturalContext: '문화사',
        difficulty: difficulty
      }
    ];

    return defaultQuestions;
  }

  /**
   * 기본 Mnemosyne 훈련 생성
   */
  createDefaultMnemosyneExercise(difficulty) {
    return {
      type: 'mnemosyne_cultural',
      title: 'Mnemosyne 기본 문화적 기억 훈련',
      description: '문화와 정체성을 통한 기억 강화 훈련',
      difficulty: difficulty,
      questions: this.generateDefaultMnemosyneQuestions(difficulty),
      maxScore: 20
    };
  }

  /**
   * 시간적 맥락에 따른 정답 결정
   */
  getCorrectTemporalAnswer(era) {
    const eraAnswers = {
      'ancient': '구전 전통과 집단 기억',
      'medieval': '문자 기록과 개인 기억',
      'renaissance': '문자 기록과 개인 기억',
      'modern': '혼합적 접근 방식',
      'digital': '디지털 저장과 공유 기억'
    };
    return eraAnswers[era] || '혼합적 접근 방식';
  }

  /**
   * 사용자의 훈련 기록 저장
   */
  saveTrainingRecord(userId, training) {
    try {
      const recordPath = path.join(this.trainingDataPath, `${userId}_training.json`);
      let records = [];
      
      if (fs.existsSync(recordPath)) {
        const data = fs.readFileSync(recordPath, 'utf8');
        records = JSON.parse(data);
      }
      
      records.push(training);
      fs.writeFileSync(recordPath, JSON.stringify(records, null, 2));
      
      return true;
    } catch (error) {
      console.error('훈련 기록 저장 실패:', error);
      return false;
    }
  }

  /**
   * 사용자의 훈련 기록 조회
   */
  getTrainingRecords(userId) {
    try {
      const recordPath = path.join(this.trainingDataPath, `${userId}_training.json`);
      
      if (!fs.existsSync(recordPath)) {
        return [];
      }
      
      const data = fs.readFileSync(recordPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('훈련 기록 조회 실패:', error);
      return [];
    }
  }

  /**
   * 훈련 통계 생성
   */
  generateTrainingStats(userId) {
    const records = this.getTrainingRecords(userId);
    
    if (records.length === 0) {
      return {
        totalTrainings: 0,
        averageScore: 0,
        bestPerformance: 'none',
        mostFrequentType: 'none',
        improvementTrend: 'stable'
      };
    }

    const completedTrainings = records.filter(r => r.completed);
    const scores = completedTrainings.map(t => t.score);
    const types = completedTrainings.map(t => t.exercise.type);

    const typeCounts = {};
    types.forEach(type => {
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const mostFrequentType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b
    );

    const recentScores = scores.slice(-5);
    const olderScores = scores.slice(-10, -5);
    
    let improvementTrend = 'stable';
    if (recentScores.length > 0 && olderScores.length > 0) {
      const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
      const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
      
      if (recentAvg > olderAvg + 5) improvementTrend = 'improving';
      else if (recentAvg < olderAvg - 5) improvementTrend = 'declining';
    }

    return {
      totalTrainings: records.length,
      completedTrainings: completedTrainings.length,
      averageScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      mostFrequentType: mostFrequentType,
      improvementTrend: improvementTrend,
      lastTraining: records.length > 0 ? records[records.length - 1].timestamp : null
    };
  }
}

module.exports = CognitiveTrainingManager;
