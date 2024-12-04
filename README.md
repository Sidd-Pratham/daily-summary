# 🚀 Daily Code Summary Generator 

## 🌟 Project Overview

Automate your daily code tracking with this powerful CLI tool that generates comprehensive summaries of your Git repository's changes using AI-powered insights! 

### 📊 What Does It Do?

The Daily Code Summary tool provides an intelligent overview of your daily coding activities by:
- 🔍 Detecting uncommitted changes
- 📝 Summarizing local commits
- 🌐 Highlighting pushed remote changes
- 🤖 Generating AI-powered summaries of your code modifications

## 🛠 Technology Stack

- **Language**: Node.js
- **AI Integration**: Google Generative AI (Gemini)
- **Git Interaction**: simple-git
- **CLI Framework**: Commander.js
- **Styling**: Chalk

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v14 or higher)
- npm (Node Package Manager)
- Git

### Installation

1. Clone the Repository
```
git clone https://github.com/Sidd-Pratham/daily-code-summary.git
cd daily-code-summary
```
2. Install Dependencies

```
npm install
```
3. Global Link (for CLI usage)
```
npm link
```

## 💡 Usage

### Generate Daily Summary
```
daily-summary generate
```
This command will:
- Scan your Git repository
- Detect changes (uncommitted, committed, pushed)
- Generate an AI-summarized markdown report
- Save as `daily-summary.md`

## 🔍 Features

- 🤖 AI-Powered Summaries
- 📅 Daily Code Change Tracking
- 🔢 Comprehensive Change Detection
- 💻 Easy CLI Integration

## 🛡 Configuration

### Google Generative AI
- Replace the placeholder API key in the script with your own
- Ensure you have the necessary permissions

## 📦 Dependencies

- `@google/generative-ai`: AI-powered summarization
- `simple-git`: Git repository interactions
- `commander`: CLI framework
- `chalk`: Console styling

 **Thank you for checking out our project. Happy coding!** 
🌟
