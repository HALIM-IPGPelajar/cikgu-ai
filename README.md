# CIKGU AI – Smart Learning Assistant

> **"Ask, Learn, and Shine!"** 🤖✨  
> A professional, rule-based educational chatbot for Malaysian Primary School pupils (Year 4 Mathematics – Fractions).

---

## 🚀 Quick Start (Local)

```bash
cd cikgu-ai
npm install
npm start
```

Open **http://localhost:3000** in your browser.

No API keys required for the website. The chatbot is 100% rule-based.

---

## 📚 Features

- Six complete **Year 4 Fractions** lessons
- **24 verified quiz questions** (Easy / Medium / Hard)
- Automatic answer checking with hints
- Points, stars, and achievement badges
- localStorage progress persistence
- Telegram bot integration (optional)
- Responsive design — works on mobile, tablet, and desktop
- **No LLM API required**

---

## 🔧 Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Then edit `.env`:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
PORT=3000
```

---

## 📱 Telegram Bot Setup

1. Open Telegram and message **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the token BotFather provides
4. Add it to your `.env` file as `TELEGRAM_BOT_TOKEN=...`
5. Restart the server — the bot will launch automatically

**Bot commands available:**
- `/start` — Start or restart the session
- `/help` — Show help and main menu
- `/topics` — Browse all fractions lessons
- `/quiz` — Start a quiz
- `/progress` — View your stars and points
- `/reset` — Reset your session

---

## 🌐 GitHub

Push to GitHub:

```bash
git init
git add .
git commit -m "Initial CIKGU AI release"
git remote add origin https://github.com/HALIM-IPGPelajar/cikgu-ai.git
git push -u origin main
```

---

## 🤝 Human Help

Students can reach a teacher via WhatsApp: **+601158921344**

---

## 🛠 Tech Stack

- Node.js + Express
- Vanilla JavaScript (ES modules)
- Telegraf (Telegram Bot API)
- localStorage for progress
- Zero external AI APIs

---

## 📁 Project Structure

```
cikgu-ai/
├── package.json
├── server.js               ← Express web server
├── .env                    ← Your secrets (not committed)
├── .env.example
├── .gitignore
├── README.md
├── public/
│   ├── index.html          ← Main website
│   ├── styles.css          ← Professional EdTech styling
│   └── app.js              ← Frontend logic
├── shared/
│   ├── chatbotEngine.js    ← Core rule-based chatbot
│   ├── mathContent.js      ← 6 Fractions lessons
│   ├── quizData.js         ← 24 quiz questions
│   └── rewards.js          ← Points, stars, badges
├── telegram/
│   └── telegramBot.js      ← Telegram integration
└── tests/
    └── chatbot.test.js     ← Automated tests
```

---

© 2024 CIKGU AI. Built for Malaysian primary school pupils.
