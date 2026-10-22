'use strict';
/**
 * CIKGU AI – chatbotEngine.js
 * Rule-based conversational engine shared by website and Telegram.
 * No LLM API used.
 */

const { LESSONS, getLessonById, getLessonByKeyword } = require('./mathContent.js');
const { getQuestionsByLesson, getRandomQuestions, checkAnswer } = require('./quizData.js');
const { createProgress, awardCorrectAnswer, getMasteryLevel } = require('./rewards.js');

// ─────────────────────────────────────────────────────────────────────────────
// Intent detection
// ─────────────────────────────────────────────────────────────────────────────

const INTENTS = {
  GREETING:   [/\b(hi|hello|hey|good\s+(morning|afternoon|evening)|assalamualaikum|salam)\b/i, /^\/start\b/i],
  QUIZ:       [/\b(quiz|test|practis|practice|challenge|soalan)\b/i],
  PROGRESS:   [/\b(progress|point|star|badge|score|result|achievement)\b/i, /how many (stars?|points?)/i],
  HELP:       [/\b(help|menu|home|restart|reset|start over|main menu|back)\b/i, /^\/help\b/i],
  TOPICS:     [/\b(topics?|lessons?|subjects?|show topics?|choose topic)\b/i, /^\/topics?\b/i],
  LESSON:     [/\b(learn|teach|explain|what is|tell me|show me|fraction|numerator|denominator|proper|improper|equivalent|compar|add(ing)?|subtract)\b/i],
  ANSWER:     [/^\s*[a-dA-D]\s*[).:]?\s*$/, /^(answer is|i (choose|pick|select|think))\s+[a-dA-D]\b/i],
  NEXT:       [/^\s*(next|continue|skip|proceed)\s*$/i],
  HINT:       [/^\s*hint\s*$/i],
  WHATSAPP:   [/\b(teacher|cikgu|whatsapp|wa|contact|human|real person|help me|stuck)\b/i],
  HOMEWORK:   [/\b(do (my |the )?homework|answer (for )?me|solve (my |this )?assignment|cheat)\b/i],
  YES:        [/^\s*(yes|yeah|yep|sure|ok|okay|yup|alright|lets? go|ready|ya)\s*$/i],
  NO:         [/^\s*(no|nope|nah|not now|later|skip)\s*$/i]
};

function detectIntent(text) {
  const t = text.trim();
  for (const [name, patterns] of Object.entries(INTENTS)) {
    if (patterns.some(p => p.test(t))) return name;
  }
  return 'UNKNOWN';
}

// ─────────────────────────────────────────────────────────────────────────────
// Session factory
// ─────────────────────────────────────────────────────────────────────────────

function createSession(nickname) {
  return {
    nickname: (nickname || '').trim().slice(0, 20),
    state: 'IDLE',        // IDLE | LESSON | QUIZ | AWAITING_TOPIC
    currentLesson: null,
    quiz: { questions: [], index: 0, attemptCount: 0, active: false },
    progress: createProgress(),
    unknownStreak: 0
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

function processMessage(session, rawText) {
  const text = String(rawText || '').trim();

  if (!text) {
    return reply(session,
      '❓ Please type a message so I can help you!\n\nTry saying *hello*, asking about *fractions*, or typing *quiz*.', []);
  }

  const intent = detectIntent(text);

  // ── Global overrides (always available) ───────────────────────────────────
  if (intent === 'HELP')      return handleHelp(session);
  if (intent === 'WHATSAPP')  return handleWhatsApp(session);
  if (intent === 'HOMEWORK')  return handleHomework(session);
  if (intent === 'PROGRESS')  return handleProgress(session);
  if (intent === 'TOPICS')    return showTopicMenu(session);

  // ── Inside an active quiz: intercept answers/navigation first ────────────
  if (session.state === 'QUIZ' && session.quiz.active) {
    if (intent === 'HINT')                          return giveHint(session);
    if (intent === 'NEXT')                          return nextQuizQuestion(session);
    if (/\b(quit|stop|end quiz|exit quiz)\b/i.test(text)) return endQuiz(session, true);
    // Accept any single A-D letter or "answer is X"
    const answerLetter = extractAnswerLetter(text);
    if (answerLetter)                               return handleQuizAnswer(session, answerLetter);
    // Inside quiz, unknown non-nav text → gentle redirect
    return reply(session,
      '🎯 We are in a quiz! Please choose *A*, *B*, *C*, or *D*, or tap a button below.',
      currentQuizButtons(session));
  }

  // ── Greeting ──────────────────────────────────────────────────────────────
  if (intent === 'GREETING')  return handleGreeting(session);

  // ── Quiz start ────────────────────────────────────────────────────────────
  if (intent === 'QUIZ')      return startQuiz(session, text);

  // ── Lesson / topic request ────────────────────────────────────────────────
  if (intent === 'LESSON')    return handleLesson(session, text);

  // ── Yes/No responses ──────────────────────────────────────────────────────
  if (intent === 'YES')       return showTopicMenu(session);
  if (intent === 'NO') {
    return reply(session,
      "No worries! 😊 Take your time. Type *help* whenever you're ready.",
      [{ label: '📚 Topics', value: 'topics' }, { label: '🎯 Quiz', value: 'quiz' }]);
  }

  // ── Lesson button values (lesson1…lesson6) ────────────────────────────────
  const lessonMatch = text.match(/^lesson([1-6])$/i);
  if (lessonMatch) {
    const lesson = getLessonById('lesson' + lessonMatch[1]);
    if (lesson) return presentLesson(session, lesson);
  }

  // ── Fallback ──────────────────────────────────────────────────────────────
  return handleUnknown(session, text);
}

// ─────────────────────────────────────────────────────────────────────────────
// Handlers
// ─────────────────────────────────────────────────────────────────────────────

function handleGreeting(session) {
  const name = session.nickname ? `, *${session.nickname}*` : '';
  session.state = 'IDLE';
  return reply(session,
    `👋 Hi there${name}! I'm *CIKGU AI*, your friendly Maths learning assistant! 🤖✨\n\nI'm here to help you master *Year 4 Fractions*.\n\nWhat would you like to do today?`,
    topicButtons());
}

function handleHelp(session) {
  session.state = 'IDLE';
  if (session.quiz.active) session.quiz.active = false;
  return reply(session,
    `🏠 *Main Menu*\n\n📚 *Learn* — Six Fractions lessons\n🎯 *Quiz* — Practise with questions\n📊 *Progress* — See your points & stars\n👩‍🏫 *Teacher* — Contact via WhatsApp\n\nChoose a topic or type what you need!`,
    topicButtons());
}

function handleWhatsApp(session) {
  return reply(session,
    `👩‍🏫 *Need more help?*\n\nYou can reach your teacher directly on WhatsApp:\n👉 *+601158921344*\n\nTap the button below or save the number in your phone!`,
    [
      { label: '💬 WhatsApp Teacher',  value: 'https://wa.me/601158921344' },
      { label: '🏠 Main Menu',         value: 'home'                       }
    ]);
}

function handleHomework(session) {
  return reply(session,
    `😊 I'm happy to help you *understand* your homework!\n\nLet's work through the steps together rather than just giving you the answer — that way you will really learn it! 🌟\n\nWhich topic is your homework about?`,
    topicButtons());
}

function handleProgress(session) {
  const p = session.progress;
  const mastery = getMasteryLevel(p.stars);
  const badgeList = p.badges && p.badges.length > 0
    ? p.badges.join(' ')
    : 'No badges yet — keep going! 💪';
  return reply(session,
    `📊 *Your Learning Progress*\n\n⭐ Stars: *${p.stars}*\n🏆 Points: *${p.points}*\n✅ Questions done: *${p.completedQuestions.length}* / 24\n🎯 Level: *${mastery.emoji} ${mastery.level}*\n\n🏅 *Badges:* ${badgeList}`,
    [
      { label: '📚 Keep Learning', value: 'topics' },
      { label: '🎯 Take a Quiz',   value: 'quiz'   }
    ]);
}

function handleLesson(session, text) {
  const lesson = getLessonByKeyword(text);
  if (lesson) {
    return presentLesson(session, lesson);
  }
  // Generic "fractions" keyword → menu
  return showTopicMenu(session);
}

function presentLesson(session, lesson) {
  session.state = 'LESSON';
  session.currentLesson = lesson.id;
  const steps = lesson.stepByStep.map((s, i) => `${i + 1}. ${s}`).join('\n');
  const text =
    `${lesson.icon} *Lesson: ${lesson.title}*\n\n` +
    `🎯 _Objective:_ ${lesson.objective}\n\n` +
    `📖 *Concept:*\n${lesson.concept}\n\n` +
    `📌 *Example:*\n${lesson.example.text}\n` +
    `Fraction: *${lesson.example.fraction}*\n${lesson.example.explanation}\n\n` +
    `🪜 *Steps:*\n${steps}\n\n` +
    `✏️ *Quick Check:* ${lesson.check}`;
  return reply(session, text, [
    { label: `🎯 Quiz on ${lesson.title}`, value: `quiz ${lesson.id}` },
    { label: '📚 Other Topics',            value: 'topics'            },
    { label: '📊 My Progress',             value: 'progress'          }
  ]);
}

function showTopicMenu(session) {
  session.state = 'AWAITING_TOPIC';
  const list = LESSONS.map((l, i) => `${l.icon} *${i + 1}. ${l.title}*`).join('\n');
  return reply(session,
    `📚 *Year 4 Fractions — Choose a Lesson:*\n\n${list}\n\nTap a button or type a topic name!`,
    LESSONS.map(l => ({ label: `${l.icon} ${l.title}`, value: l.id }))
           .concat([{ label: '🎯 Random Quiz', value: 'quiz' }]));
}

function startQuiz(session, text) {
  let questions;

  // Value from lesson button: "quiz lesson3" or just "lesson3"
  const match = text.match(/lesson([1-6])/i);
  if (match) {
    questions = getQuestionsByLesson('lesson' + match[1]);
  } else {
    const lesson = getLessonByKeyword(text);
    questions = lesson
      ? getQuestionsByLesson(lesson.id)
      : getRandomQuestions(null, 6);
  }

  if (!questions || questions.length === 0) {
    questions = getRandomQuestions(null, 6);
  }

  // Shuffle and cap at 6
  questions = [...questions].sort(() => Math.random() - 0.5).slice(0, 6);

  session.state = 'QUIZ';
  session.quiz  = { questions, index: 0, attemptCount: 0, active: true };
  return serveQuestion(session, true);
}

function serveQuestion(session, isFirst) {
  const quiz = session.quiz;
  if (quiz.index >= quiz.questions.length) return endQuiz(session);

  quiz.attemptCount = 0;
  const q      = quiz.questions[quiz.index];
  const header = isFirst ? '🎯 *Quiz Time! Let\'s go!*\n\n' : '➡️ *Next Question:*\n\n';

  return reply(session,
    `${header}*Question ${quiz.index + 1} of ${quiz.questions.length}* (${q.difficulty})\n\n${q.question}\n\n${q.options.join('\n')}`,
    q.options.map(o => ({ label: o, value: o.charAt(0).toUpperCase() }))
             .concat([{ label: '💡 Hint', value: 'hint' }]));
}

// Alias used inside quiz state guard
function nextQuizQuestion(session) {
  return serveQuestion(session, false);
}

function handleQuizAnswer(session, letter) {
  const quiz = session.quiz;
  if (!quiz.active || quiz.index >= quiz.questions.length) {
    return reply(session, "There's no active quiz. Type *quiz* to start one!", []);
  }

  const q = quiz.questions[quiz.index];
  const { correct, question } = checkAnswer(q.id, letter);
  quiz.attemptCount++;

  if (correct) {
    const award = awardCorrectAnswer(session.progress, q.id);
    session.progress = award.progress;
    quiz.index++;

    const rewardLine = award.alreadyDone
      ? '_(already completed — no extra points)_'
      : `You earned *+10 points* and *1 star ⭐*!`;
    const badgeLine = award.newBadges.length > 0
      ? `\n\n🏅 *New Badge: ${award.newBadges[0].name}*\n${award.newBadges[0].desc}`
      : '';
    const hasNext = quiz.index < quiz.questions.length;

    return reply(session,
      `✅ *Excellent! That's correct!* 🎉\n\n📖 ${question.explanation}\n\n${rewardLine}${badgeLine}\n\n⭐ Stars: ${session.progress.stars} | 🏆 Points: ${session.progress.points}`,
      hasNext
        ? [{ label: '➡️ Next Question', value: 'next' }]
        : [{ label: '🏁 See Results',   value: 'next' }]);
  }

  // Wrong answer
  if (quiz.attemptCount === 1) {
    return reply(session,
      `💛 Good try! That's not quite right.\n\n💡 *Hint:* ${question.hint}\n\nHave another go — choose *A*, *B*, *C*, or *D*:`,
      q.options.map(o => ({ label: o, value: o.charAt(0).toUpperCase() })));
  }

  // Second wrong attempt → show answer and move on
  quiz.index++;
  const hasNext = quiz.index < quiz.questions.length;
  return reply(session,
    `😊 No worries! The correct answer was *${question.answer}*.\n\n📖 ${question.explanation}`,
    hasNext
      ? [{ label: '➡️ Next Question', value: 'next' }]
      : [{ label: '🏁 See Results',   value: 'next' }]);
}

function giveHint(session) {
  const { quiz } = session;
  if (!quiz.active || quiz.index >= quiz.questions.length) {
    return reply(session, 'No active question. Type *quiz* to start! 😊', []);
  }
  const q = quiz.questions[quiz.index];
  return reply(session,
    `💡 *Hint:* ${q.hint}`,
    q.options.map(o => ({ label: o, value: o.charAt(0).toUpperCase() })));
}

function endQuiz(session, aborted) {
  const { quiz } = session;
  quiz.active   = false;
  session.state = 'IDLE';

  const correct = quiz.questions.slice(0, quiz.index)
    .filter(q => session.progress.completedQuestions.includes(q.id)).length;
  const total   = quiz.index;
  const pct     = total > 0 ? Math.round((correct / total) * 100) : 0;

  let feedback;
  if (aborted)      feedback = 'Quiz ended early. Come back any time! 😊';
  else if (pct === 100) feedback = '🌟 *PERFECT SCORE!* You are amazing!';
  else if (pct >= 70)   feedback = '🎉 *Great job!* You\'re doing really well!';
  else if (pct >= 50)   feedback = '👍 *Good effort!* Review the lessons and try again!';
  else                  feedback = '💪 *Keep practising!* Every attempt makes you better!';

  return reply(session,
    `🏁 *Quiz Complete!*\n\n✅ Correct: ${correct} / ${total}\n📊 Score: ${pct}%\n⭐ Total Stars: ${session.progress.stars}\n🏆 Total Points: ${session.progress.points}\n\n${feedback}`,
    [
      { label: '🔄 Try Again',   value: 'quiz'     },
      { label: '📚 Learn More',  value: 'topics'   },
      { label: '📊 My Progress', value: 'progress' }
    ]);
}

function handleUnknown(session, text) {
  // Count the streak BEFORE calling reply() — reply() resets unknownStreak to 0
  const nextStreak = (session.unknownStreak || 0) + 1;

  if (nextStreak >= 2) {
    // Second consecutive unknown → offer teacher help
    return reply(session,
      `😅 I'm still having trouble understanding that.\n\nYou can always contact your teacher on *WhatsApp: +601158921344* for extra help!\n\nOr return to the main menu:`,
      [
        { label: '🏠 Main Menu',         value: 'home'                       },
        { label: '💬 WhatsApp Teacher',  value: 'https://wa.me/601158921344' }
      ]);
    // reply() will reset unknownStreak = 0, which is correct here
  }

  // First unknown → gentle redirect; preserve the streak so next unknown triggers teacher help
  const result = reply(session,
    `🤔 Oops! I didn't quite catch that. Try asking another way, or choose a topic below! 😊`,
    topicButtons());
  result.session.unknownStreak = nextStreak;   // restore streak that reply() zeroed
  return result;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function extractAnswerLetter(text) {
  const m = text.trim().match(/^([a-dA-D])[).:\s]?$/) ||
            text.match(/\b(answer is|i choose|i pick|i select)\s+([a-dA-D])\b/i);
  if (!m) return null;
  return (m[2] || m[1]).toUpperCase();
}

function currentQuizButtons(session) {
  const { quiz } = session;
  if (!quiz.active || quiz.index >= quiz.questions.length) return [];
  const q = quiz.questions[quiz.index];
  return q.options.map(o => ({ label: o, value: o.charAt(0).toUpperCase() }))
                  .concat([{ label: '💡 Hint', value: 'hint' }]);
}

function topicButtons() {
  return [
    { label: '🍕 Intro to Fractions',    value: 'lesson1'   },
    { label: '🔢 Numerator/Denominator', value: 'lesson2'   },
    { label: '⚖️ Proper & Improper',     value: 'lesson3'   },
    { label: '🟰 Equivalent Fractions',  value: 'lesson4'   },
    { label: '📊 Comparing Fractions',   value: 'lesson5'   },
    { label: '➕ Add & Subtract',        value: 'lesson6'   },
    { label: '🎯 Take a Quiz',           value: 'quiz'      },
    { label: '📊 My Progress',           value: 'progress'  }
  ];
}

function reply(session, text, buttons) {
  session.unknownStreak = 0;
  return { session, response: text, buttons: buttons || [] };
}

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────
module.exports = { createSession, processMessage };
