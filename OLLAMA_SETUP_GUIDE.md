# 🌟 Kairos AI Memory Support - Complete Setup Guide

**Step-by-Step Installation Guide for AI Memory Support**

This guide will help you set up Kairos, your AI memory companion, from start to finish. Take your time and don't worry if you need help!

## 🎯 What You'll Need

Before we start, you'll need to install these programs on your computer:

1. **Node.js** - This runs the Kairos server
2. **Ollama** - This provides the AI brain
3. **ngrok** - This allows external access (optional)

## 📋 Complete Installation Steps

### Step 1: Install Node.js

**For Windows:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Click the big green "LTS" button to download
3. Run the downloaded file (nodejs-xxx.msi)
4. Follow the installation wizard (click "Next" for each step)
5. Click "Finish" when done

**For Mac:**
1. Go to [nodejs.org](https://nodejs.org/)
2. Click the big green "LTS" button to download
3. Run the downloaded file (.pkg file)
4. Follow the installation wizard
5. Click "Close" when done

**For Linux:**
Open Terminal and type:
```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Install Ollama

**For Windows:**
1. Go to [ollama.ai](https://ollama.ai/)
2. Click "Download for Windows"
3. Run the downloaded file
4. Follow the installation instructions
5. Ollama will open in your web browser

**For Mac:**
1. Go to [ollama.ai](https://ollama.ai/)
2. Click "Download for macOS"
3. Run the downloaded file
4. Follow the installation instructions
5. Ollama will open in your web browser

**For Linux:**
Open Terminal and type:
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Step 3: Install ngrok (Optional - for external access)

**For Windows:**
1. Go to [ngrok.com](https://ngrok.com/)
2. Sign up for a free account
3. Download ngrok for Windows
4. Extract the zip file to a folder (e.g., `C:\ngrok`)
5. Add ngrok to your PATH or use the full path

**For Mac:**
```bash
# Using Homebrew
brew install ngrok/ngrok/ngrok

# Or download manually from ngrok.com
```

**For Linux:**
```bash
# Download and install
wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
tar xvzf ngrok-v3-stable-linux-amd64.tgz
sudo mv ngrok /usr/local/bin/
```

### Step 4: Download an AI Model

After Ollama is installed, you need to download an AI model. This is like giving your computer a brain to think with.

1. **Open Command Prompt (Windows) or Terminal (Mac/Linux)**
   - Windows: Press `Windows + R`, type `cmd`, press Enter
   - Mac: Press `Cmd + Space`, type "Terminal", press Enter
   - Linux: Press `Ctrl + Alt + T`

2. **Download a model** (choose one):
   ```bash
   # For beginners (smaller, faster):
   ollama pull llama3.1:latest
   
   # For better responses (larger, slower):
   ollama pull llama3.1:8b
   
   # For Korean language support:
   ollama pull jinbora/deepseek-r1-Bllossom:8b
   ```

3. **Wait for the download to complete** (this may take several minutes)

### Step 5: Set Up Kairos

1. **Download Kairos**
   - Click the green "Code" button on this page
   - Choose "Download ZIP"
   - Extract the folder to your computer

2. **Open Command Prompt/Terminal**
   - Navigate to the Kairos folder:
   ```bash
   # Windows example:
   cd C:\Users\YourName\Downloads\kairos-master
   
   # Mac/Linux example:
   cd ~/Downloads/kairos-master
   ```

3. **Install Kairos**
   ```bash
   npm install
   ```

### Step 6: Start Ollama Server

1. **Start Ollama** (if not already running):
   ```bash
   ollama serve
   ```
   - This will start the Ollama server in the background
   - Keep this terminal window open

2. **Verify Ollama is running**:
   ```bash
   ollama list
   ```
   - This should show your downloaded models

### Step 7: Start Kairos Server

1. **Open a new Command Prompt/Terminal**
   - Navigate to your Kairos folder
   - Run the server:
   ```bash
   npm start
   ```

2. **You should see**:
   ```
   Server running on port 3000
   Kairos AI Memory Support Server is ready!
   ```

### Step 8: Access Kairos

1. **Local Access**:
   - Open your web browser
   - Go to: `http://localhost:3000`
   - You should see the Kairos chat interface!

2. **External Access (Optional)**:
   - Open a new terminal
   - Navigate to your ngrok folder
   - Run:
   ```bash
   ngrok http 3000
   ```
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
   - Share this URL with others to access your Kairos server

## 🎉 You're Ready!

Once you see the chat interface, you can:
- Type messages and chat with your AI companion
- The AI will remember your conversations
- Your data stays private on your computer

## 🛠️ Troubleshooting

### "Command not found" error
- Make sure Node.js is installed properly
- Try closing and reopening your terminal
- Restart your computer if needed

### "Cannot connect to Ollama" error
- Make sure Ollama is running: `ollama serve`
- Check if you downloaded a model: `ollama list`
- Try running `ollama serve` in a new terminal

### "Page not found" error
- Make sure you typed: `http://localhost:3000`
- Check if the server is running (you should see "Server running on port 3000")
- Try refreshing the page

### "ngrok not found" error
- Make sure ngrok is installed and in your PATH
- Try using the full path to ngrok
- For Windows: `C:\ngrok\ngrok.exe http 3000`

### Slow responses
- This is normal for the first few messages
- The AI needs time to "warm up"
- Responses will get faster after the first conversation

## 📞 Getting Help

If you're stuck:
1. **Ask a friend or family member** - Sometimes a fresh pair of eyes helps!
2. **Check our website**: [kairos.musichien.com](https://kairos.musichien.com/)
3. **Visit our GitHub**: [github.com/musichien/kairos](https://github.com/musichien/kairos)
4. **Email us**: MUSICHIEN7@GMAIL.COM

## 🔒 Privacy and Safety

- **Your conversations stay on your computer**
- **No one else can see your messages**
- **The AI works completely offline**
- **We don't collect any personal information**

## 🎯 Why Kairos?

Kairos is designed to help you:
- **Remember important things** - The AI can help you recall details
- **Stay mentally active** - Regular conversations keep your mind sharp
- **Feel less alone** - A friendly AI companion for daily chats
- **Maintain independence** - Technology that supports healthy aging

## 🙏 Thank You!

Thank you for trying Kairos! We hope it helps you maintain mental clarity and stay connected with your memories as you age.

---

**"With solid science and strong ethics, we help everyone remember their best self."**

*Kairos Project - AI for Healthy and Clear-Minded Aging* 