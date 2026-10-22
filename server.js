'use strict';
/**
 * CIKGU AI – server.js
 * Express web server. Telegram bot runs as a separate child process.
 */

require('dotenv').config();

const express = require('express');
const path    = require('path');
const { fork } = require('child_process');
const { createSession, processMessage } = require('./shared/chatbotEngine');

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── In-memory web session store ───────────────────────────────────────────────
const sessions = {};

// ── API: chat ─────────────────────────────────────────────────────────────────
app.post('/api/chat', (req, res) => {
  const { sessionId, message, nickname } = req.body || {};

  if (!sessionId || typeof message !== 'string') {
    return res.status(400).json({ error: 'sessionId and message are required.' });
  }

  if (!sessions[sessionId]) {
    sessions[sessionId] = createSession(nickname || '');
  }
  if (nickname && !sessions[sessionId].nickname) {
    sessions[sessionId].nickname = nickname;
  }

  try {
    const result = processMessage(sessions[sessionId], message);
    sessions[sessionId] = result.session;
    return res.json({
      response: result.response,
      buttons:  result.buttons || [],
      progress: result.session.progress
    });
  } catch (err) {
    console.error('[API] chat error:', err);
    return res.status(500).json({ error: 'Internal error. Please try again.' });
  }
});

// ── API: reset session ────────────────────────────────────────────────────────
app.post('/api/reset', (req, res) => {
  const { sessionId, nickname } = req.body || {};
  if (sessionId) {
    sessions[sessionId] = createSession(nickname || '');
  }
  return res.json({ ok: true });
});

// ── SPA fallback ──────────────────────────────────────────────────────────────
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ── Start web server ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🤖  CIKGU AI – Smart Learning Assistant');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🌐  Website:  http://localhost:${PORT}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // ── Launch Telegram bot as a child process ─────────────────────────────────
  if (process.env.TELEGRAM_BOT_TOKEN) {
    const botPath = path.join(__dirname, 'telegram', 'telegramBot.js');
    const child   = fork(botPath, [], {
      env:    { ...process.env },
      silent: false   // inherit stdout/stderr so we see bot logs
    });

    child.on('error',  err  => console.error('[Telegram child] error:', err.message));
    child.on('exit',   code => {
      if (code !== 0 && code !== null) {
        console.warn(`[Telegram child] exited with code ${code}. Bot offline.`);
      }
    });
  } else {
    console.log('ℹ️  Telegram: TELEGRAM_BOT_TOKEN not set — bot disabled.\n');
  }
});
