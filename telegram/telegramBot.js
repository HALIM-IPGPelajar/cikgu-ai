'use strict';
/**
 * CIKGU AI – telegramBot.js
 * Standalone Telegram bot using Telegraf + shared chatbot engine.
 * Token loaded from process.env.TELEGRAM_BOT_TOKEN (set in .env).
 *
 * Commands:
 *   /start    – welcome + topic menu
 *   /help     – main menu
 *   /topics   – browse lessons
 *   /quiz     – start a quiz
 *   /progress – view stars & points
 *   /reset    – reset this user's session
 *   /teacher  – WhatsApp contact
 */

require('dotenv').config();

const { Telegraf, Markup } = require('telegraf');
const { createSession, processMessage } = require('../shared/chatbotEngine');

// ─────────────────────────────────────────────────────────────────────────────
// Token guard
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;

if (!TOKEN) {
  console.error('❌ TELEGRAM_BOT_TOKEN is not set. Telegram bot cannot start.');
  process.exit(1);
}

// ─────────────────────────────────────────────────────────────────────────────
// Bot & session store
// ─────────────────────────────────────────────────────────────────────────────

const bot      = new Telegraf(TOKEN);
const sessions = {};   // keyed by Telegram user ID (string)

function getSession(userId, firstName) {
  if (!sessions[userId]) {
    sessions[userId] = createSession(firstName || '');
  }
  return sessions[userId];
}

function saveSession(userId, session) {
  sessions[userId] = session;
}

// ─────────────────────────────────────────────────────────────────────────────
// Text & keyboard helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convert engine response text (uses *bold* already via chatbotEngine)
 * to safe Telegram Markdown. Strip any unsafe characters.
 */
function toTgMd(text) {
  // Engine already uses single *bold* (not **bold**) — safe for Telegram Markdown
  // Convert markdown links [text](url) → "text: url" (Markdown v1 doesn't support inline links)
  return text.replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g, '$1: $2');
}

/**
 * Build an InlineKeyboard from engine button array.
 * Rows of max 2 buttons.
 * Skip URL-type buttons (those starting with https://) — they become separate messages.
 */
function buildKeyboard(buttons) {
  if (!buttons || buttons.length === 0) return null;

  const urlButtons = buttons.filter(b => b.value.startsWith('http'));
  const cbButtons  = buttons.filter(b => !b.value.startsWith('http'));

  const rows = [];

  // Inline callback buttons (max 2 per row)
  for (let i = 0; i < cbButtons.length; i += 2) {
    const row = [
      Markup.button.callback(
        cbButtons[i].label.slice(0, 64),
        cbButtons[i].value.slice(0, 64)
      )
    ];
    if (cbButtons[i + 1]) {
      row.push(Markup.button.callback(
        cbButtons[i + 1].label.slice(0, 64),
        cbButtons[i + 1].value.slice(0, 64)
      ));
    }
    rows.push(row);
  }

  // URL buttons (one per row)
  for (const b of urlButtons) {
    rows.push([Markup.button.url(b.label.slice(0, 64), b.value)]);
  }

  return rows.length > 0 ? Markup.inlineKeyboard(rows) : null;
}

/**
 * Send the engine result to Telegram.
 * Falls back to plain text if Markdown parse fails.
 */
async function sendResult(ctx, result) {
  const text    = toTgMd(result.response);
  const keyboard = buildKeyboard(result.buttons);

  const opts = { parse_mode: 'Markdown' };
  if (keyboard) opts.reply_markup = keyboard.reply_markup;

  try {
    await ctx.reply(text, opts);
  } catch (mdErr) {
    // Markdown parse failed — send as plain text
    try {
      const plainOpts = {};
      if (keyboard) plainOpts.reply_markup = keyboard.reply_markup;
      await ctx.reply(result.response.replace(/[*_`]/g, ''), plainOpts);
    } catch (e) {
      console.error('[Telegram] send failed completely:', e.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Core dispatcher
// ─────────────────────────────────────────────────────────────────────────────

async function dispatch(ctx, input) {
  const userId = String(ctx.from.id);
  const firstName = ctx.from.first_name || '';

  const session = getSession(userId, firstName);
  const result  = processMessage(session, input);
  saveSession(userId, result.session);

  await sendResult(ctx, result);
}

// ─────────────────────────────────────────────────────────────────────────────
// Commands
// ─────────────────────────────────────────────────────────────────────────────

bot.start(async ctx => {
  // Always reset session on /start so user gets a fresh greeting
  const userId = String(ctx.from.id);
  sessions[userId] = createSession(ctx.from.first_name || '');
  await dispatch(ctx, 'hello');
});

bot.command('help',     ctx => dispatch(ctx, 'help'));
bot.command('topics',   ctx => dispatch(ctx, 'topics'));
bot.command('quiz',     ctx => dispatch(ctx, 'quiz'));
bot.command('progress', ctx => dispatch(ctx, 'progress'));
bot.command('teacher',  ctx => dispatch(ctx, 'teacher'));

bot.command('reset', async ctx => {
  const userId = String(ctx.from.id);
  sessions[userId] = createSession(ctx.from.first_name || '');
  await ctx.reply(
    '✅ Your session has been reset!\n\nType /start to begin again.',
    { parse_mode: 'Markdown' }
  );
});

// ─────────────────────────────────────────────────────────────────────────────
// Inline keyboard callbacks
// ─────────────────────────────────────────────────────────────────────────────

bot.on('callback_query', async ctx => {
  await ctx.answerCbQuery();   // dismiss the "loading" spinner
  const data = (ctx.callbackQuery.data || '').trim();
  await dispatch(ctx, data);
});

// ─────────────────────────────────────────────────────────────────────────────
// Plain text messages
// ─────────────────────────────────────────────────────────────────────────────

bot.on('text', ctx => {
  const text = (ctx.message.text || '').trim();
  // Ignore Telegram command-style messages not handled above
  if (text.startsWith('/')) return;
  return dispatch(ctx, text);
});

// ─────────────────────────────────────────────────────────────────────────────
// Error handler
// ─────────────────────────────────────────────────────────────────────────────

bot.catch((err, ctx) => {
  console.error('[Telegram] Unhandled error:', err.message);
  ctx.reply('😅 Something went wrong. Please type /start to reset.').catch(() => {});
});

// ─────────────────────────────────────────────────────────────────────────────
// Launch (long-polling)
// ─────────────────────────────────────────────────────────────────────────────

bot.launch()
  .then(() => {
    const info = bot.botInfo;
    console.log(`✅ Telegram bot connected: @${info ? info.username : 'CIKGUAI0001_bot'}`);
    console.log('   Users can now chat at: https://t.me/CIKGUAI0001_bot');
  })
  .catch(err => {
    console.error('❌ Telegram bot failed to start:', err.message);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT',  () => { console.log('Stopping bot…'); bot.stop('SIGINT');  });
process.once('SIGTERM', () => { console.log('Stopping bot…'); bot.stop('SIGTERM'); });

module.exports = { bot };
