@echo off
echo.
echo ========================================
echo    Kairos AI Memory Support Setup
echo ========================================
echo.
echo Welcome to Kairos! This script will help you set up your AI memory companion.
echo.
echo Please make sure you have:
echo 1. Node.js installed (download from nodejs.org)
echo 2. Ollama installed (download from ollama.ai)
echo 3. An AI model downloaded (run: ollama pull llama3.1:latest)
echo.
pause

echo.
echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    echo Choose the "LTS" version for best compatibility.
    pause
    exit /b 1
) else (
    echo ✓ Node.js is installed
)

echo.
echo Installing Kairos dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    echo Please check your internet connection and try again.
    pause
    exit /b 1
) else (
    echo ✓ Dependencies installed successfully
)

echo.
echo ========================================
echo    Setup Complete!
echo ========================================
echo.
echo To start Kairos:
echo 1. Make sure Ollama is running
echo 2. Run: npm start
echo 3. Open your browser and go to: http://localhost:3000
echo.
echo For help, visit: https://kairos.musichien.com/
echo.
pause 