#!/bin/bash

echo ""
echo "========================================"
echo "    Kairos AI Memory Support Setup"
echo "========================================"
echo ""
echo "Welcome to Kairos! This script will help you set up your AI memory companion."
echo ""
echo "Please make sure you have:"
echo "1. Node.js installed (download from nodejs.org)"
echo "2. Ollama installed (download from ollama.ai)"
echo "3. An AI model downloaded (run: ollama pull llama3.1:latest)"
echo ""

read -p "Press Enter to continue..."

echo ""
echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download and install Node.js from https://nodejs.org/"
    echo "Choose the 'LTS' version for best compatibility."
    exit 1
else
    echo "✓ Node.js is installed"
fi

echo ""
echo "Installing Kairos dependencies..."
if npm install; then
    echo "✓ Dependencies installed successfully"
else
    echo "ERROR: Failed to install dependencies!"
    echo "Please check your internet connection and try again."
    exit 1
fi

echo ""
echo "========================================"
echo "    Setup Complete!"
echo "========================================"
echo ""
echo "To start Kairos:"
echo "1. Make sure Ollama is running"
echo "2. Run: npm start"
echo "3. Open your browser and go to: http://localhost:3000"
echo ""
echo "For help, visit: https://kairos.musichien.com/"
echo "" 