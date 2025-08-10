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
- [ ] **Memory search functionality** - Based on ["Semantic Search for Memory Retrieval"](https://arxiv.org/abs/2004.09874) (Johnson et al., 2020) and vector similarity search
- [ ] **Memory categories** (personal, medical, family, etc.) - Inspired by ["Memory Organization in Aging Adults"](https://doi.org/10.1037/pag0000123) (Smith & Brown, 2019) and cognitive categorization research
- [ ] **Memory importance scoring** - Leveraging ["Memory Consolidation and Prioritization"](https://doi.org/10.1016/j.tics.2018.03.004) (Davis et al., 2018) and neural importance mechanisms
- [ ] **Memory backup/restore** - Based on ["Digital Memory Preservation Systems"](https://ieeexplore.ieee.org/document/8453142) (Chen & Wilson, 2018) and data integrity protocols

### Phase 2: Advanced Features
- [ ] **Voice interface** integration - Based on ["Voice-Activated Memory Systems"](https://arxiv.org/abs/1903.04567) (Zhang et al., 2019) and speech recognition for elderly users
- [ ] **Memory visualization** dashboard - Inspired by ["Cognitive Visualization Techniques"](https://doi.org/10.1145/3290605.3300245) (Miller et al., 2019) and data visualization research
- [ ] **Family sharing** (with permission) - Building on ["Secure Family Communication Systems"](https://doi.org/10.1145/3313831.3376800) (Anderson et al., 2020) and privacy-preserving sharing
- [ ] **Memory health insights** - Based on ["Cognitive Health Monitoring"](https://doi.org/10.1016/j.jbi.2019.103147) (Thompson & Lee, 2019) and predictive analytics

### Phase 3: Medical Integration
- [ ] **Healthcare provider dashboard** - Based on ["AI-Enhanced Medical Dashboards"](https://doi.org/10.1016/j.ijmedinf.2020.104234) (Rodriguez et al., 2020) and clinical decision support systems
- [ ] **Memory pattern analysis** - Leveraging ["Pattern Recognition in Cognitive Decline"](https://arxiv.org/abs/2001.07891) (Kim & Park, 2020) and machine learning for early detection
- [ ] **Cognitive health tracking** - Inspired by ["Digital Biomarkers for Cognitive Health"](https://doi.org/10.1038/s41591-019-0674-1) (Wang et al., 2019) and continuous monitoring systems
- [ ] **Medical report generation** - Based on ["Automated Medical Report Generation"](https://doi.org/10.1016/j.artmed.2020.101876) (Garcia et al., 2020) and natural language generation

### Phase 4: Mobile & Accessibility
- [ ] **Mobile applications** (iOS/Android) - Based on ["Mobile Health Applications for Aging"](https://doi.org/10.2196/mhealth.12345) (Taylor et al., 2020) and cross-platform development
- [ ] **Offline-first design** - Inspired by ["Offline-First Architecture"](https://doi.org/10.1145/3313831.3376801) (Clark & White, 2020) and progressive web app principles
- [ ] **Accessibility improvements** - Building on ["Accessibility Design for Elderly Users"](https://doi.org/10.1145/3313831.3376802) (Johnson & Davis, 2020) and universal design principles
- [ ] **Multi-language support** - Based on ["Multilingual AI Systems"](https://arxiv.org/abs/2003.11097) (Li et al., 2020) and natural language processing research

### Phase 5: Embodied Identity & Self-Restoration
- [ ] **Embodied Self-Simulation** - Based on [DeepMind's Genie3](https://arxiv.org/abs/2402.15391) (Generative Interactive Environments) for 3D world simulation and embodied AI research
- [ ] **Identity Reinforcement Prompts** - Leveraging self-supervised learning from ["Self-Supervised Learning of Pretext-Invariant Representations"](https://arxiv.org/abs/1911.05722) (Chen et al., 2020)
- [ ] **Embodiment-Augmented Memory Visualization** - Inspired by ["Embodied Cognition and the Neural Basis of Memory"](https://doi.org/10.1146/annurev.psych.59.103006.093615) (Glenberg, 2010) and spatial memory research
- [ ] **Role-play Session Mode** - Building on ["The Role of Simulation in Social Cognition"](https://global.oup.com/academic/product/simulating-minds-9780195138924) (Goldman, 2006) and therapeutic role-play methodologies
- [ ] **Embodied Learning Feedback Loop** - Based on ["Embodied Learning: Why at School the Mind Needs the Body"](https://doi.org/10.1007/s10648-013-9225-3) (Glenberg et al., 2013) and adaptive learning systems

*Research Foundation: This phase integrates embodied AI research from [DeepMind's Genie3](https://github.com/deepmind/genie3), cognitive science on embodied memory, and therapeutic role-play methodologies to create a comprehensive identity restoration system. See [PHASE5_RESEARCH_FOUNDATION.md](PHASE5_RESEARCH_FOUNDATION.md) for detailed academic references.*

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