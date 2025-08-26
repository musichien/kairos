# Kairos Development Guide

This guide explains how to connect the demo features in `improved_ui.html` to real backend endpoints and extend functionality.

## API Contracts (expected shapes)

- GET `/api/models` -> `{ data?: Array<{id: string, size?: number}> } | { models?: Array<{name: string, size?: number}> } | string[]`
- POST `/api/chat` -> `{ choices: [ { message: { role: 'assistant', content: string } } ] }`

### Memory
- GET `/api/memory/:userId/stats` -> `{ totalConversations:number, totalFacts:number, totalPreferences:number, createdAt:string, lastUpdated:string }`
- GET `/api/memory/:userId` -> `{ facts: Array<{content:string,timestamp?:string}>, preferences: Array<{preference:string,value:string,timestamp?:string}> }`
- POST `/api/memory/:userId/facts` body `{ fact:string, category?:string }`
- POST `/api/memory/:userId/preferences` body `{ preference:string, value:string }`
- DELETE `/api/memory/:userId`
- GET `/api/memory/:userId/emotional-stats` -> custom
- GET `/api/memory/:userId/timeline` -> custom
- GET `/api/memory/:userId/patterns` -> custom
- POST `/api/memory/:userId/relationships` body `{ person:string, relationship:string }`
- POST `/api/memory/:userId/goals` body `{ goal:string, deadline?:string }`
- POST `/api/memory/:userId/interests` body `{ interest:string, category?:string }`
- POST `/api/memory/:userId/long-term` body `{ memory:string, category?:string }`

### Cognitive Training
- POST `/api/cognitive-training/start` body `{ user_id, training_type, difficulty }` -> `{ sessionId, questions: [{id, prompt, type}], startedAt }`
- POST `/api/cognitive-training/submit` body `{ sessionId, answers }` -> `{ score, feedback }`
- GET `/api/cognitive-training/:userId/stats` -> summary
- GET `/api/cognitive-training/:userId/records` -> array
- GET `/api/cognitive-training/templates` -> array

### Multimodal
- Voice/Speech: handled client-side
- POST `/api/multimodal/health/process`

### Cardiovascular
- GET `/api/cardiovascular/risk-assessment/:userId` -> assessment
- POST `/api/cardiovascular/medication` body `{ user_id, medication, dosage }`

### Brain Research
- GET `/api/brain-research/jobs` -> array of jobs
- GET `/api/brain-research/contribution/:userId` -> stats

### Cultural
- POST `/api/cultural-preferences/:userId` body `{ language, formalityLevel, age }`
- POST `/api/cultural/greeting` body `{ user_id, language }` -> `{ greeting }`
- POST `/api/cultural/conversation-starter` body `{ user_id }` -> `{ starter }`
- POST `/api/cultural/etiquette` body `{ user_id, language }` -> `{ tips: string[] }`

### Telomere
- GET `/api/telomere/health-data/:userId` -> `{ telomereLengthKb:number, oxidativeStress:string, lifestyleScore:number }`

## Wiring demo -> backend
- Replace demo fallbacks in functions with actual renderers using API responses.
- Keep graceful fallbacks to preserve UX if endpoints are offline.

## Memory-aware Chat
- `sendMessage()` prepends a system message built from recent facts/preferences.
- Backend `/api/chat` may also inject memory context; ensure no duplication by checking server middleware.

## Testing Scenarios
- Models: ensure at least one model appears in `refreshModels()`.
- Chat: ask "오늘 음악 추천해줘" and verify preferences affect the reply.
- Memory: add a fact/preference, reload stats, and check counts.
- Cognitive: start a training session and submit answers.
- Cardiovascular: run risk assessment; ensure UI card renders.
- Brain Research: load jobs and contribution stats.
- Cultural: save preferences, generate greeting/starter/etiquette.
- Telomere: load telomere demo data card.

## Extension Tips
- Centralize API base and auth in a small wrapper for future Bearer token usage.
- Consider WebSocket for streaming chat and training progress.
- Persist demo seed to localStorage for consistent UX between reloads.
