// AI Server Configuration
module.exports = {
  // AI Server Type: 'ollama' or 'lmstudio'
  AI_SERVER_TYPE: process.env.AI_SERVER_TYPE || 'ollama',
  
  // Server URLs
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  LMSTUDIO_URL: process.env.LMSTUDIO_URL || 'http://localhost:1234',
  
  // Server Configuration
  PORT: process.env.PORT || 3000,
  SECRET_KEY: process.env.SECRET_KEY || 'your-secret-key-here',
  
  // Security
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? 
    process.env.ALLOWED_ORIGINS.split(',') : 
    ['http://localhost:3000', 'http://localhost:3001'],
  
  // Timeouts
  REQUEST_TIMEOUT: 120000, // 2 minutes
  CONNECTION_TIMEOUT: 10000, // 10 seconds
  
  // Default Model
  DEFAULT_MODEL: 'jinbora/deepseek-r1-Bllossom:8b'
};

