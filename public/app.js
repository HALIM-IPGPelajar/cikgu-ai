'use strict';
/**
 * CIKGU AI – app.js
 * Browser front-end. Communicates with /api/chat (Express back-end).
 * No LLM API used — all intelligence is in the rule-based chatbotEngine.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Constants & state
// ─────────────────────────────────────────────────────────────────────────────

const SESSION_KEY  = 'cikgu_session_id';
const PROGRESS_KEY = 'cikgu_progress';
const WHATSAPP_URL = 'https://wa.me/601158921344';

function makeSessionId() {
  return 'web_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now();
}

let sessionId = localStorage.getItem(SESSION_KEY) || (() => {
  const id = makeSessionId();
  localStorage.setItem(SESSION_KEY, id);
  return id;
})();

let nickname = '';
let progress = (() => {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || null; } catch { return null; }
})() || { points: 0, stars: 0, completedQuestions: [], badges: [] };

// ─────────────────────────────────────────────────────────────────────────────
// DOM references
// ─────────────────────────────────────────────────────────────────────────────

const $ = id => document.getElementById(id);

const welcomeScreen     = $('welcomeScreen');
const appScreen         = $('appScreen');
const nicknameInput     = $('nicknameInput');
const startBtn          = $('startBtn');
const chatMessages      = $('chatMessages');
const emptyState        = $('emptyState');
const typingIndicator   = $('typingIndicator');
const quickReplies      = $('quickReplies');
const chatInput         = $('chatInput');
const sendBtn           = $('sendBtn');
const sidebarToggle     = $('sidebarToggle');
const sidebar           = $('sidebar');
const progressBtn       = $('progressBtn');
const homeBtn           = $('homeBtn');
const progressModal     = $('progressModal');
const modalBackdrop     = $('modalBackdrop');
const closeModal        = $('closeModal');
const closeModalBtn     = $('closeModalBtn');
const toast             = $('toast');
const headerPoints      = $('headerPoints');
const headerStars       = $('headerStars');
const progressBarMini   = $('progressBarMini');
const progressMiniCount = $('progressMiniCount');

// ─────────────────────────────────────────────────────────────────────────────
// Welcome screen
// ─────────────────────────────────────────────────────────────────────────────

startBtn.addEventListener('click', startApp);
nicknameInput.addEventListener('keydown', e => { if (e.key === 'Enter') startApp(); });

function startApp() {
  nickname = nicknameInput.value.trim().slice(0, 20);
  welcomeScreen.classList.remove('active');
  appScreen.classList.add('active');
  updateProgressUI();
  setTimeout(() => sendMessage('hello'), 300);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar
// ─────────────────────────────────────────────────────────────────────────────

sidebarToggle.addEventListener('click', () => sidebar.classList.toggle('open'));

// Close sidebar when clicking outside on mobile
document.addEventListener('click', e => {
  if (window.innerWidth <= 720 &&
      sidebar.classList.contains('open') &&
      !sidebar.contains(e.target) &&
      e.target !== sidebarToggle) {
    sidebar.classList.remove('open');
  }
});

// Lesson buttons in sidebar
document.querySelectorAll('.lesson-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lesson-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sendMessage(btn.dataset.lesson);   // sends "lesson1" … "lesson6"
    sidebar.classList.remove('open');
  });
});

// Action buttons in sidebar
document.querySelectorAll('.action-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    sendMessage(btn.dataset.action);
    sidebar.classList.remove('open');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Header buttons
// ─────────────────────────────────────────────────────────────────────────────

progressBtn.addEventListener('click', openProgressModal);
homeBtn.addEventListener('click', () => sendMessage('home'));

// ─────────────────────────────────────────────────────────────────────────────
// Progress modal
// ─────────────────────────────────────────────────────────────────────────────

closeModal.addEventListener('click',    closeProgressModal);
closeModalBtn.addEventListener('click', closeProgressModal);
modalBackdrop.addEventListener('click', closeProgressModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeProgressModal(); });

function openProgressModal() {
  renderProgressModal();
  progressModal.removeAttribute('hidden');
}

function closeProgressModal() {
  progressModal.setAttribute('hidden', '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Empty-state quick-start buttons
// ─────────────────────────────────────────────────────────────────────────────

document.querySelectorAll('[data-send]').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.send));
});

// ─────────────────────────────────────────────────────────────────────────────
// Chat input
// ─────────────────────────────────────────────────────────────────────────────

sendBtn.addEventListener('click', () => {
  const text = chatInput.value.trim();
  if (text) { sendMessage(text); chatInput.value = ''; }
});

chatInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) { sendMessage(text); chatInput.value = ''; }
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Core send / receive
// ─────────────────────────────────────────────────────────────────────────────

async function sendMessage(text) {
  if (!text) return;

  hideEmpty();
  appendMessage('user', text);
  showTyping();
  clearQuickReplies();

  try {
    const res = await fetch('/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ sessionId, message: text, nickname })
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    hideTyping();

    if (data.error) {
      appendMessage('bot', `😕 Something went wrong: ${data.error}`);
      return;
    }

    // Track stars earned this turn for celebration
    const prevStars = progress.stars;

    if (data.progress) {
      progress = data.progress;
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
      updateProgressUI();
      if (progress.stars > prevStars) triggerCelebration(progress.stars - prevStars);
    }

    appendMessage('bot', data.response);

    if (data.buttons && data.buttons.length > 0) {
      renderQuickReplies(data.buttons);
    }

  } catch (err) {
    hideTyping();
    appendMessage('bot', '🌐 Connection error. Is the server running? Please refresh and try again.');
    console.error('[fetch]', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Message rendering
// ─────────────────────────────────────────────────────────────────────────────

function appendMessage(role, text) {
  const wrap = document.createElement('div');
  wrap.className = `message ${role}`;

  if (role === 'bot') {
    const avatar = document.createElement('div');
    avatar.className = 'msg-avatar';
    avatar.textContent = '🤖';
    wrap.appendChild(avatar);
  }

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.innerHTML = renderText(text);
  wrap.appendChild(bubble);

  chatMessages.appendChild(wrap);
  scrollToBottom();
}

/**
 * Lightweight markdown renderer.
 * Supports: **bold**, *italic*, [link](url), \n → <br>
 */
function renderText(raw) {
  if (!raw) return '';
  return raw
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/_(.+?)_/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\n/g, '<br>');
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

function hideEmpty() {
  if (emptyState) emptyState.style.display = 'none';
}

// ─────────────────────────────────────────────────────────────────────────────
// Typing indicator
// ─────────────────────────────────────────────────────────────────────────────

function showTyping() {
  typingIndicator.removeAttribute('hidden');
  scrollToBottom();
}

function hideTyping() {
  typingIndicator.setAttribute('hidden', '');
}

// ─────────────────────────────────────────────────────────────────────────────
// Quick-reply buttons
// ─────────────────────────────────────────────────────────────────────────────

function clearQuickReplies() {
  quickReplies.innerHTML = '';
}

function renderQuickReplies(buttons) {
  clearQuickReplies();
  buttons.forEach(btn => {
    // WhatsApp URL buttons open a new tab
    if (btn.value && btn.value.startsWith('https://wa.me')) {
      const a = document.createElement('a');
      a.className  = 'qr-btn';
      a.href       = btn.value;
      a.target     = '_blank';
      a.rel        = 'noopener noreferrer';
      a.textContent = btn.label;
      quickReplies.appendChild(a);
      return;
    }

    const el = document.createElement('button');
    el.className   = 'qr-btn';
    el.textContent = btn.label;
    el.setAttribute('aria-label', btn.label);
    el.addEventListener('click', () => {
      sendMessage(btn.value);
      clearQuickReplies();
    });
    quickReplies.appendChild(el);
  });
  scrollToBottom();
}

// ─────────────────────────────────────────────────────────────────────────────
// Progress UI
// ─────────────────────────────────────────────────────────────────────────────

function updateProgressUI() {
  headerPoints.textContent = progress.points;
  headerStars.textContent  = progress.stars;
  const completed = progress.completedQuestions.length;
  const pct = Math.min(100, Math.round((completed / 24) * 100));
  progressBarMini.style.width  = pct + '%';
  progressMiniCount.textContent = `${completed} / 24`;
}

function renderProgressModal() {
  $('statPoints').textContent    = progress.points;
  $('statStars').textContent     = progress.stars;
  $('statCompleted').textContent = progress.completedQuestions.length;

  const pct = Math.min(100, Math.round((progress.completedQuestions.length / 24) * 100));
  $('progressBarModal').style.width = pct + '%';
  $('progressCaption').textContent  = `${progress.completedQuestions.length} of 24 questions completed`;

  const mastery = getMasteryLevel(progress.stars);
  $('masteryBadge').textContent = `${mastery.emoji} ${mastery.level}`;

  // Badges
  const BADGE_DEFS = [
    { label: '⭐ First Star',           desc: 'Complete 1 question correctly', earned: s => s >= 1  },
    { label: '🚀 Rising Mathematician', desc: 'Earn 5 stars',                 earned: s => s >= 5  },
    { label: '🔭 Fraction Explorer',   desc: 'Earn 10 stars',                earned: s => s >= 10 },
    { label: '🏆 Mathematics Champion',desc: 'Earn 20 stars',                earned: s => s >= 20 }
  ];
  const grid = $('badgesGrid');
  grid.innerHTML = '';
  BADGE_DEFS.forEach(b => {
    const div = document.createElement('div');
    div.className = 'badge-item ' + (b.earned(progress.stars) ? 'earned' : 'locked');
    div.innerHTML = `<span>${b.label}</span><span>${b.desc}</span>`;
    grid.appendChild(div);
  });
}

function getMasteryLevel(stars) {
  if (stars >= 20) return { level: 'Mathematics Champion', emoji: '🏆' };
  if (stars >= 10) return { level: 'Fraction Explorer',    emoji: '🔭' };
  if (stars >= 5)  return { level: 'Rising Mathematician', emoji: '🚀' };
  if (stars >= 1)  return { level: 'Star Learner',         emoji: '⭐' };
  return { level: 'New Learner', emoji: '📚' };
}

// ─────────────────────────────────────────────────────────────────────────────
// Celebration & toast
// ─────────────────────────────────────────────────────────────────────────────

function triggerCelebration(count) {
  showToast(`🎉 +${count * 10} points  ⭐ +${count} star${count > 1 ? 's' : ''}!`);
  for (let i = 0; i < Math.min(count * 4, 12); i++) {
    setTimeout(spawnStar, i * 80);
  }
}

function spawnStar() {
  const el = document.createElement('div');
  el.className   = 'celebrate-star';
  el.textContent = ['⭐', '🌟', '✨'][Math.floor(Math.random() * 3)];
  el.style.left  = Math.random() * 90 + 5 + 'vw';
  el.style.top   = Math.random() * 60 + 10 + 'vh';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 950);
}

let _toastTimer = null;

function showToast(msg) {
  toast.textContent = msg;
  toast.removeAttribute('hidden');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.setAttribute('hidden', ''), 2800);
}

// ─────────────────────────────────────────────────────────────────────────────
// Initialise
// ─────────────────────────────────────────────────────────────────────────────

updateProgressUI();
