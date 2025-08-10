# 🌟 Kairos AI Memory Support Server

**AI for Healthy and Clear-Minded Aging**

Welcome to Kairos! This project provides a **memory-enabled AI chatbot** that remembers your conversations and helps you maintain cognitive health as you age.

## 🧠 What is Kairos?

Kairos is your **memory-enabled AI companion** that:
- **Remembers everything** you talk about across sessions
- **Learns your preferences** and personal details
- **Helps you recall** important information
- **Stays private** - all data stays on your computer
- **Works offline** - no internet required for AI processing

## 🎯 Quick Start - Get Your Memory AI Running

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

### Step 4: Start Kairos Memory Server

Open a new terminal, navigate to Kairos folder, and run:
```bash
npm install
npm start
```

### Step 5: Access Your Memory AI

Open your browser and go to:
**`http://localhost:3000`**

You'll see the **Kairos Memory Interface** where you can chat with an AI that remembers everything!

## 🧠 Memory Features

### What Your AI Remembers:
- **All conversations** - everything you've ever talked about
- **Your preferences** - likes, dislikes, habits
- **Personal details** - family names, important dates, events
- **Your personality** - how you like to communicate

### How to Use Memory:
- **Ask about past conversations**: "Do you remember when we talked about..."
- **Check what it knows**: "What do you know about me?"
- **Update information**: "Actually, my favorite color is blue, not red"
- **Recall details**: "What did we discuss yesterday?"

## 🔧 Memory Storage & Updates

### Current Memory System:
- **File-based storage** in `memories/` folder
- **JSON format** for easy reading and backup
- **Automatic saving** after each conversation
- **Session persistence** across restarts

### Upcoming Memory Enhancements:
- **Database integration** for better performance
- **Memory search** and filtering
- **Memory export/import** for backup
- **Memory visualization** tools
- **Advanced memory analytics**

## 🚀 Future Roadmap

*Note: Timeline and priorities may change based on research findings and user feedback.*

### Phase 1: Enhanced Memory
- [ ] **Memory search functionality**
- [ ] **Memory categories** (personal, medical, family, etc.)
- [ ] **Memory importance scoring**
- [ ] **Memory backup/restore**

### Phase 2: Advanced Features
- [ ] **Voice interface** integration
- [ ] **Memory visualization** dashboard
- [ ] **Family sharing** (with permission)
- [ ] **Memory health insights**

### Phase 3: Medical Integration
- [ ] **Healthcare provider dashboard**
- [ ] **Memory pattern analysis**
- [ ] **Cognitive health tracking**
- [ ] **Medical report generation**

### Phase 4: Mobile & Accessibility
- [ ] **Mobile applications** (iOS/Android)
- [ ] **Offline-first design**
- [ ] **Accessibility improvements**
- [ ] **Multi-language support**

### Phase 5: Embodied Identity & Self-Restoration
- [ ] **Embodied Self-Simulation** - Based on DeepMind's Genie3 (Generative Interactive Environments) for 3D world simulation and embodied AI research
- [ ] **Identity Reinforcement Prompts** - Leveraging self-supervised learning from "Self-Supervised Learning of Pretext-Invariant Representations" (Chen et al., 2020)
- [ ] **Embodiment-Augmented Memory Visualization** - Inspired by "Embodied Cognition and the Neural Basis of Memory" (Glenberg, 2010) and spatial memory research
- [ ] **Role-play Session Mode** - Building on "The Role of Simulation in Social Cognition" (Goldman, 2006) and therapeutic role-play methodologies
- [ ] **Embodied Learning Feedback Loop** - Based on "Embodied Learning: Why at School the Mind Needs the Body" (Glenberg et al., 2013) and adaptive learning systems

*Research Foundation: This phase integrates embodied AI research from DeepMind's Genie3, cognitive science on embodied memory, and therapeutic role-play methodologies to create a comprehensive identity restoration system.*

## 🛠️ Troubleshooting

### "Cannot connect to Ollama"
- Make sure `ollama serve` is running
- Check if you downloaded a model: `ollama list`

### "Page not found"
- Make sure you go to: `http://localhost:3000`
- Check if server is running (should see "Server running on port 3000")

### "AI doesn't remember"
- Check if `memories/` folder exists
- Restart the server: `npm start`
- Check browser console for errors

## 📞 Support

- **Website**: [kairos.musichien.com](https://kairos.musichien.com/)
- **GitHub**: [github.com/musichien/kairos](https://github.com/musichien/kairos)
- **Email**: MUSICHIEN7@GMAIL.COM

---

**"With solid science and strong ethics, we help everyone remember their best self."**

*Kairos Project - AI for Healthy and Clear-Minded Aging* 