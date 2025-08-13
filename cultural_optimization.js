const fs = require('fs');
const path = require('path');

/**
 * Cultural and Language Optimization Manager
 * Handles conversation styles, respectful expressions, and cultural context
 * for English, French, Korean, Japanese, and Chinese cultures
 */
class CulturalOptimizationManager {
    constructor() {
        this.dataDirectory = path.join(__dirname, 'cultural_data');
        this.ensureDataDirectory();
        this.loadCulturalProfiles();
    }

    ensureDataDirectory() {
        if (!fs.existsSync(this.dataDirectory)) {
            fs.mkdirSync(this.dataDirectory, { recursive: true });
        }
    }

    loadCulturalProfiles() {
        this.culturalProfiles = {
            en: {
                name: 'English',
                region: 'Western',
                formalityLevels: ['casual', 'polite', 'formal', 'respectful'],
                conversationStyles: {
                    casual: {
                        greeting: 'Hi there!',
                        farewell: 'See you later!',
                        agreement: 'Sure thing!',
                        disagreement: 'I don\'t think so.',
                        gratitude: 'Thanks!',
                        apology: 'Sorry about that.',
                        encouragement: 'You can do it!',
                        sympathy: 'That\'s tough.',
                        humor: 'That\'s funny!',
                        formality: 'low'
                    },
                    polite: {
                        greeting: 'Hello!',
                        farewell: 'Goodbye!',
                        agreement: 'I agree.',
                        disagreement: 'I respectfully disagree.',
                        gratitude: 'Thank you.',
                        apology: 'I apologize.',
                        encouragement: 'I believe in you.',
                        sympathy: 'I\'m sorry to hear that.',
                        humor: 'That\'s quite amusing.',
                        formality: 'medium'
                    },
                    formal: {
                        greeting: 'Good day.',
                        farewell: 'Farewell.',
                        agreement: 'I concur.',
                        disagreement: 'I must respectfully disagree.',
                        gratitude: 'I am grateful.',
                        apology: 'I offer my sincere apologies.',
                        encouragement: 'I have confidence in your abilities.',
                        sympathy: 'My condolences.',
                        humor: 'That is quite humorous.',
                        formality: 'high'
                    },
                    respectful: {
                        greeting: 'Good day to you.',
                        farewell: 'May you have a wonderful day.',
                        agreement: 'I wholeheartedly agree.',
                        disagreement: 'I must respectfully express my disagreement.',
                        gratitude: 'I am deeply grateful.',
                        apology: 'I offer my deepest apologies.',
                        encouragement: 'I have the utmost confidence in your capabilities.',
                        sympathy: 'My deepest sympathies go out to you.',
                        humor: 'That brings a smile to my face.',
                        formality: 'very high'
                    }
                },
                culturalNorms: {
                    personalSpace: 'Respect personal space (arm\'s length)',
                    eyeContact: 'Maintain moderate eye contact',
                    gestures: 'Use open hand gestures',
                    time: 'Punctuality is highly valued',
                    hierarchy: 'Respect authority but encourage equality',
                    communication: 'Direct and clear communication preferred'
                },
                elderlyRespect: {
                    titles: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
                    addressing: 'Use titles and last names',
                    patience: 'Speak clearly and patiently',
                    assistance: 'Offer help respectfully',
                    wisdom: 'Value their experience and knowledge'
                }
            },
            fr: {
                name: 'Français',
                region: 'Western',
                formalityLevels: ['familier', 'courtois', 'formel', 'respectueux'],
                conversationStyles: {
                    familier: {
                        greeting: 'Salut !',
                        farewell: 'À plus !',
                        agreement: 'D\'accord !',
                        disagreement: 'Je ne pense pas.',
                        gratitude: 'Merci !',
                        apology: 'Désolé.',
                        encouragement: 'Tu peux le faire !',
                        sympathy: 'C\'est dur.',
                        humor: 'C\'est drôle !',
                        formality: 'low'
                    },
                    courtois: {
                        greeting: 'Bonjour !',
                        farewell: 'Au revoir !',
                        agreement: 'Je suis d\'accord.',
                        disagreement: 'Je ne suis pas d\'accord.',
                        gratitude: 'Merci beaucoup.',
                        apology: 'Je m\'excuse.',
                        encouragement: 'Je crois en toi.',
                        sympathy: 'Je suis désolé d\'entendre ça.',
                        humor: 'C\'est amusant.',
                        formality: 'medium'
                    },
                    formel: {
                        greeting: 'Bonjour.',
                        farewell: 'Adieu.',
                        agreement: 'Je suis entièrement d\'accord.',
                        disagreement: 'Je ne peux être d\'accord.',
                        gratitude: 'Je vous remercie.',
                        apology: 'Je vous prie de m\'excuser.',
                        encouragement: 'J\'ai confiance en vos capacités.',
                        sympathy: 'Mes condoléances.',
                        humor: 'C\'est fort amusant.',
                        formality: 'high'
                    },
                    respectueux: {
                        greeting: 'Bonjour à vous.',
                        farewell: 'Que votre journée soit merveilleuse.',
                        agreement: 'Je suis entièrement d\'accord avec vous.',
                        disagreement: 'Je dois respectueusement exprimer mon désaccord.',
                        gratitude: 'Je vous suis profondément reconnaissant.',
                        apology: 'Je vous présente mes excuses les plus sincères.',
                        encouragement: 'J\'ai la plus grande confiance en vos capacités.',
                        sympathy: 'Mes plus sincères condoléances.',
                        humor: 'Cela me fait sourire.',
                        formality: 'very high'
                    }
                },
                culturalNorms: {
                    personalSpace: 'Respecter l\'espace personnel',
                    eyeContact: 'Maintenir un contact visuel modéré',
                    gestures: 'Utiliser des gestes ouverts',
                    time: 'La ponctualité est très appréciée',
                    hierarchy: 'Respecter l\'autorité tout en encourageant l\'égalité',
                    communication: 'Communication directe et claire préférée'
                },
                elderlyRespect: {
                    titles: ['M.', 'Mme.', 'Mlle.', 'Dr.'],
                    addressing: 'Utiliser les titres et noms de famille',
                    patience: 'Parler clairement et patiemment',
                    assistance: 'Offrir de l\'aide respectueusement',
                    wisdom: 'Valoriser leur expérience et connaissances'
                }
            },
            ko: {
                name: '한국어',
                region: 'Eastern',
                formalityLevels: ['반말', '존댓말', '격식체', '경어'],
                conversationStyles: {
                    반말: {
                        greeting: '안녕!',
                        farewell: '잘 가!',
                        agreement: '그래!',
                        disagreement: '아니야.',
                        gratitude: '고마워!',
                        apology: '미안해.',
                        encouragement: '할 수 있어!',
                        sympathy: '힘들겠다.',
                        humor: '웃겨!',
                        formality: 'low'
                    },
                    존댓말: {
                        greeting: '안녕하세요!',
                        farewell: '안녕히 가세요!',
                        agreement: '네, 맞습니다.',
                        disagreement: '아니요, 그렇지 않습니다.',
                        gratitude: '감사합니다.',
                        apology: '죄송합니다.',
                        encouragement: '할 수 있을 것 같습니다.',
                        sympathy: '힘드시겠습니다.',
                        humor: '재미있네요.',
                        formality: 'medium'
                    },
                    격식체: {
                        greeting: '안녕하십니까.',
                        farewell: '안녕히 가십시오.',
                        agreement: '네, 맞습니다.',
                        disagreement: '아니오, 그렇지 않습니다.',
                        gratitude: '감사드립니다.',
                        apology: '죄송드립니다.',
                        encouragement: '충분히 가능할 것 같습니다.',
                        sympathy: '힘드시겠습니다.',
                        humor: '재미있습니다.',
                        formality: 'high'
                    },
                    경어: {
                        greeting: '안녕하십니까.',
                        farewell: '안녕히 가십시오.',
                        agreement: '네, 정말 맞습니다.',
                        disagreement: '아니오, 그렇지 않습니다.',
                        gratitude: '정말 감사드립니다.',
                        apology: '정말 죄송드립니다.',
                        encouragement: '충분히 가능할 것 같습니다.',
                        sympathy: '정말 힘드시겠습니다.',
                        humor: '정말 재미있습니다.',
                        formality: 'very high'
                    }
                },
                culturalNorms: {
                    personalSpace: '개인 공간을 존중합니다',
                    eyeContact: '적당한 눈 맞춤을 유지합니다',
                    gestures: '공손한 제스처를 사용합니다',
                    time: '시간 엄수를 중시합니다',
                    hierarchy: '나이와 지위를 존중합니다',
                    communication: '간접적이고 공손한 소통을 선호합니다'
                },
                elderlyRespect: {
                    titles: ['할아버지', '할머니', '어르신', '선생님'],
                    addressing: '존칭어를 사용합니다',
                    patience: '천천히 명확하게 말씀합니다',
                    assistance: '공손하게 도움을 제공합니다',
                    wisdom: '경험과 지혜를 존중합니다'
                }
            },
            ja: {
                name: '日本語',
                region: 'Eastern',
                formalityLevels: ['タメ口', '丁寧語', '敬語', '最敬語'],
                conversationStyles: {
                    タメ口: {
                        greeting: 'やあ！',
                        farewell: 'またね！',
                        agreement: 'うん！',
                        disagreement: 'ううん。',
                        gratitude: 'ありがとう！',
                        apology: 'ごめん。',
                        encouragement: 'できるよ！',
                        sympathy: '大変だね。',
                        humor: '面白い！',
                        formality: 'low'
                    },
                    丁寧語: {
                        greeting: 'こんにちは！',
                        farewell: 'さようなら！',
                        agreement: 'はい、そうです。',
                        disagreement: 'いいえ、違います。',
                        gratitude: 'ありがとうございます。',
                        apology: 'すみません。',
                        encouragement: 'できると思います。',
                        sympathy: '大変ですね。',
                        humor: '面白いですね。',
                        formality: 'medium'
                    },
                    敬語: {
                        greeting: 'こんにちは。',
                        farewell: 'さようなら。',
                        agreement: 'はい、その通りです。',
                        disagreement: 'いいえ、そうではありません。',
                        gratitude: 'ありがとうございます。',
                        apology: '申し訳ございません。',
                        encouragement: 'きっとできると思います。',
                        sympathy: '大変でございますね。',
                        humor: '面白いでございます。',
                        formality: 'high'
                    },
                    最敬語: {
                        greeting: 'こんにちは。',
                        farewell: 'さようなら。',
                        agreement: 'はい、まさにその通りでございます。',
                        disagreement: 'いいえ、決してそうではございません。',
                        gratitude: '誠にありがとうございます。',
                        apology: '誠に申し訳ございません。',
                        encouragement: 'きっとおできになると思います。',
                        sympathy: '誠に大変でございますね。',
                        humor: '誠に面白いでございます。',
                        formality: 'very high'
                    }
                },
                culturalNorms: {
                    personalSpace: '個人の空間を尊重します',
                    eyeContact: '適度なアイコンタクトを保ちます',
                    gestures: '丁寧なジェスチャーを使用します',
                    time: '時間厳守を重視します',
                    hierarchy: '年齢と地位を尊重します',
                    communication: '間接的で丁寧なコミュニケーションを好みます'
                },
                elderlyRespect: {
                    titles: ['おじいさん', 'おばあさん', 'お年寄り', '先生'],
                    addressing: '敬語を使用します',
                    patience: 'ゆっくりと明確に話します',
                    assistance: '丁寧にサポートを提供します',
                    wisdom: '経験と知恵を尊重します'
                }
            },
            zh: {
                name: '中文',
                region: 'Eastern',
                formalityLevels: ['随意', '礼貌', '正式', '尊敬'],
                conversationStyles: {
                    随意: {
                        greeting: '嗨！',
                        farewell: '再见！',
                        agreement: '好的！',
                        disagreement: '不对。',
                        gratitude: '谢谢！',
                        apology: '抱歉。',
                        encouragement: '你可以的！',
                        sympathy: '真不容易。',
                        humor: '真有趣！',
                        formality: 'low'
                    },
                    礼貌: {
                        greeting: '你好！',
                        farewell: '再见！',
                        agreement: '是的，对的。',
                        disagreement: '不，不对。',
                        gratitude: '谢谢您。',
                        apology: '对不起。',
                        encouragement: '我相信你可以。',
                        sympathy: '真不容易。',
                        humor: '真有趣。',
                        formality: 'medium'
                    },
                    正式: {
                        greeting: '您好。',
                        farewell: '再见。',
                        agreement: '是的，完全正确。',
                        disagreement: '不，不是这样的。',
                        gratitude: '非常感谢。',
                        apology: '非常抱歉。',
                        encouragement: '我相信您一定可以。',
                        sympathy: '真是不容易。',
                        humor: '真是有趣。',
                        formality: 'high'
                    },
                    尊敬: {
                        greeting: '您好。',
                        farewell: '再见。',
                        agreement: '是的，完全正确。',
                        disagreement: '不，绝对不是这样的。',
                        gratitude: '万分感谢。',
                        apology: '万分抱歉。',
                        encouragement: '我相信您一定可以做到。',
                        sympathy: '真是不容易。',
                        humor: '真是有趣。',
                        formality: 'very high'
                    }
                },
                culturalNorms: {
                    personalSpace: '尊重个人空间',
                    eyeContact: '保持适度的眼神接触',
                    gestures: '使用礼貌的手势',
                    time: '重视时间观念',
                    hierarchy: '尊重年龄和地位',
                    communication: '偏好间接和礼貌的沟通方式'
                },
                elderlyRespect: {
                    titles: ['爷爷', '奶奶', '老人家', '老师'],
                    addressing: '使用敬语',
                    patience: '慢慢清晰地说话',
                    assistance: '礼貌地提供帮助',
                    wisdom: '尊重他们的经验和智慧'
                }
            }
        };
    }

    /**
     * Get cultural profile for a specific language
     */
    getCulturalProfile(language) {
        return this.culturalProfiles[language] || this.culturalProfiles.en;
    }

    /**
     * Get conversation style based on language and formality level
     */
    getConversationStyle(language, formalityLevel = 'polite') {
        const profile = this.getCulturalProfile(language);
        const styles = profile.conversationStyles;
        
        // Map common formality levels to language-specific ones
        const formalityMap = {
            'casual': 'casual',
            'polite': 'polite',
            'formal': 'formal',
            'respectful': 'respectful'
        };

        // For Eastern languages, adjust formality mapping
        if (language === 'ko' || language === 'ja' || language === 'zh') {
            formalityMap.casual = '반말' || 'タメ口' || '随意';
            formalityMap.polite = '존댓말' || '丁寧語' || '礼貌';
            formalityMap.formal = '격식체' || '敬語' || '正式';
            formalityMap.respectful = '경어' || '最敬語' || '尊敬';
        }

        const targetFormality = formalityMap[formalityLevel] || formalityLevel;
        return styles[targetFormality] || styles.polite;
    }

    /**
     * Generate culturally appropriate greeting
     */
    generateGreeting(language, formalityLevel = 'polite', timeOfDay = null) {
        const style = this.getConversationStyle(language, formalityLevel);
        let greeting = style.greeting;

        // Add time-specific greetings for some languages
        if (timeOfDay && (language === 'en' || language === 'fr')) {
            const hour = new Date().getHours();
            if (hour < 12) {
                greeting = language === 'en' ? 'Good morning!' : 'Bonjour !';
            } else if (hour < 18) {
                greeting = language === 'en' ? 'Good afternoon!' : 'Bon après-midi !';
            } else {
                greeting = language === 'en' ? 'Good evening!' : 'Bonsoir !';
            }
        }

        return greeting;
    }

    /**
     * Generate culturally appropriate response patterns
     */
    generateResponsePattern(language, formalityLevel, responseType) {
        const style = this.getConversationStyle(language, formalityLevel);
        
        switch (responseType) {
            case 'agreement':
                return style.agreement;
            case 'disagreement':
                return style.disagreement;
            case 'gratitude':
                return style.gratitude;
            case 'apology':
                return style.apology;
            case 'encouragement':
                return style.encouragement;
            case 'sympathy':
                return style.sympathy;
            case 'humor':
                return style.humor;
            default:
                return style.agreement;
        }
    }

    /**
     * Apply cultural context to AI response
     */
    applyCulturalContext(language, formalityLevel, message, userAge = null) {
        const profile = this.getCulturalProfile(language);
        const style = this.getConversationStyle(language, formalityLevel);
        
        let enhancedMessage = message;

        // Add cultural context based on language and region
        if (profile.region === 'Eastern') {
            // Eastern cultures emphasize respect and hierarchy
            if (userAge && userAge > 60) {
                enhancedMessage = `[${profile.elderlyRespect.wisdom}] ${enhancedMessage}`;
            }
            
            // Add formality indicators
            if (style.formality === 'very high') {
                enhancedMessage = `[${profile.culturalNorms.hierarchy}] ${enhancedMessage}`;
            }
        } else {
            // Western cultures emphasize equality and directness
            enhancedMessage = `[${profile.culturalNorms.communication}] ${enhancedMessage}`;
        }

        return enhancedMessage;
    }

    /**
     * Generate cultural conversation starter
     */
    generateConversationStarter(language, formalityLevel, topic = 'general') {
        const style = this.getConversationStyle(language, formalityLevel);
        const profile = this.getCulturalProfile(language);
        
        const starters = {
            general: {
                en: 'How are you doing today?',
                fr: 'Comment allez-vous aujourd\'hui ?',
                ko: '오늘 기분이 어떠세요?',
                ja: '今日はお元気ですか？',
                zh: '今天感觉怎么样？'
            },
            health: {
                en: 'How is your health these days?',
                fr: 'Comment va votre santé ces derniers temps ?',
                ko: '요즘 건강은 어떠세요?',
                ja: '最近お体の調子はどうですか？',
                zh: '最近身体怎么样？'
            },
            family: {
                en: 'How is your family doing?',
                fr: 'Comment va votre famille ?',
                ko: '가족분들은 잘 지내시나요?',
                ja: 'ご家族はお元気ですか？',
                zh: '家人还好吗？'
            }
        };

        const starter = starters[topic]?.[language] || starters.general[language];
        return this.applyCulturalContext(language, formalityLevel, starter);
    }

    /**
     * Get cultural norms and etiquette tips
     */
    getCulturalEtiquette(language, context = 'general') {
        const profile = this.getCulturalProfile(language);
        
        const etiquette = {
            general: profile.culturalNorms,
            elderly: profile.elderlyRespect,
            communication: {
                formality: profile.formalityLevels,
                style: profile.conversationStyles
            }
        };

        return etiquette[context] || etiquette.general;
    }

    /**
     * Save cultural preferences for a user
     */
    async saveCulturalPreferences(userId, preferences) {
        try {
            const filePath = path.join(this.dataDirectory, `${userId}_cultural.json`);
            const data = {
                userId,
                preferences,
                updatedAt: new Date().toISOString()
            };
            
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error('Cultural preferences save error:', error);
            return false;
        }
    }

    /**
     * Load cultural preferences for a user
     */
    async loadCulturalPreferences(userId) {
        try {
            const filePath = path.join(this.dataDirectory, `${userId}_cultural.json`);
            if (fs.existsSync(filePath)) {
                const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                return data.preferences;
            }
            return null;
        } catch (error) {
            console.error('Cultural preferences load error:', error);
            return null;
        }
    }

    /**
     * Generate culturally optimized AI prompt
     */
    generateCulturalPrompt(language, formalityLevel, userContext = {}) {
        const profile = this.getCulturalProfile(language);
        const style = this.getConversationStyle(language, formalityLevel);
        
        let prompt = `You are an AI assistant optimized for ${profile.name} culture and language. `;
        prompt += `Please respond in ${language} with ${style.formality} formality level. `;
        
        if (userContext.age && userContext.age > 60) {
            prompt += `The user is elderly, so please use respectful language and be patient. `;
        }
        
        prompt += `Follow these cultural guidelines: `;
        prompt += `- ${profile.culturalNorms.communication} `;
        prompt += `- ${profile.culturalNorms.hierarchy} `;
        prompt += `- Use appropriate ${style.formality} expressions `;
        
        return prompt;
    }
}

module.exports = CulturalOptimizationManager;
