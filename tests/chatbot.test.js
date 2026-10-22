'use strict';
/**
 * CIKGU AI – Automated Core Tests
 * Run with: node tests/chatbot.test.js
 */

const { createSession, processMessage }  = require('../shared/chatbotEngine');
const { LESSONS, getLessonById, getLessonByKeyword } = require('../shared/mathContent');
const { QUIZ_QUESTIONS, getQuestionById, checkAnswer } = require('../shared/quizData');
const { createProgress, awardCorrectAnswer, getMasteryLevel } = require('../shared/rewards');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`         ${err.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

function assertEqual(a, b, msg) {
  if (a !== b) throw new Error(msg || `Expected ${JSON.stringify(b)}, got ${JSON.stringify(a)}`);
}

// ── 1. Math Content ──────────────────────────────────────────────────────────
console.log('\n📚 Math Content Tests');

test('LESSONS array has exactly 6 lessons', () => {
  assertEqual(LESSONS.length, 6, `Expected 6 lessons, got ${LESSONS.length}`);
});

test('Each lesson has required fields', () => {
  for (const l of LESSONS) {
    assert(l.id, `Lesson missing id`);
    assert(l.title, `Lesson ${l.id} missing title`);
    assert(l.concept, `Lesson ${l.id} missing concept`);
    assert(Array.isArray(l.stepByStep), `Lesson ${l.id} stepByStep not an array`);
    assert(l.check, `Lesson ${l.id} missing check`);
  }
});

test('getLessonById returns correct lesson', () => {
  const l = getLessonById('lesson4');
  assert(l, 'lesson4 not found');
  assertEqual(l.title, 'Equivalent Fractions');
});

test('getLessonByKeyword finds lesson by keyword', () => {
  const l = getLessonByKeyword('how do I add fractions?');
  assert(l, 'No lesson found for addition keyword');
  assertEqual(l.id, 'lesson6');
});

test('getLessonByKeyword finds lesson by numerator keyword', () => {
  const l = getLessonByKeyword('explain numerator');
  assert(l, 'No lesson found for numerator keyword');
  assertEqual(l.id, 'lesson2');
});

// ── 2. Quiz Data ─────────────────────────────────────────────────────────────
console.log('\n🎯 Quiz Data Tests');

test('QUIZ_QUESTIONS has at least 24 questions', () => {
  assert(QUIZ_QUESTIONS.length >= 24, `Expected ≥24 questions, got ${QUIZ_QUESTIONS.length}`);
});

test('Each question has required fields', () => {
  for (const q of QUIZ_QUESTIONS) {
    assert(q.id, `Question missing id`);
    assert(q.lesson, `Question ${q.id} missing lesson`);
    assert(q.question, `Question ${q.id} missing question text`);
    assert(Array.isArray(q.options), `Question ${q.id} options not array`);
    assert(q.options.length >= 3, `Question ${q.id} needs at least 3 options`);
    assert(q.answer, `Question ${q.id} missing answer`);
    assert('ABCD'.includes(q.answer), `Question ${q.id} answer must be A-D, got ${q.answer}`);
    assert(q.hint, `Question ${q.id} missing hint`);
    assert(q.explanation, `Question ${q.id} missing explanation`);
  }
});

test('All 6 lessons have at least 4 questions', () => {
  for (let i = 1; i <= 6; i++) {
    const id = `lesson${i}`;
    const count = QUIZ_QUESTIONS.filter(q => q.lesson === id).length;
    assert(count >= 4, `${id} has only ${count} questions (need ≥ 4)`);
  }
});

test('checkAnswer correctly identifies correct answer for q01', () => {
  const result = checkAnswer('q01', 'A');
  assert(result.valid, 'checkAnswer returned invalid');
  assert(result.correct, 'q01 answer A should be correct');
});

test('checkAnswer correctly identifies wrong answer for q01', () => {
  const result = checkAnswer('q01', 'B');
  assert(result.valid, 'checkAnswer returned invalid');
  assert(!result.correct, 'q01 answer B should be wrong');
});

test('checkAnswer is case-insensitive', () => {
  const r1 = checkAnswer('q01', 'a');
  const r2 = checkAnswer('q01', 'A');
  assertEqual(r1.correct, r2.correct, 'Case should not matter');
});

test('No duplicate question IDs', () => {
  const ids = QUIZ_QUESTIONS.map(q => q.id);
  const unique = new Set(ids);
  assertEqual(unique.size, ids.length, `Duplicate question IDs found`);
});

test('All correct answers appear in their options list', () => {
  for (const q of QUIZ_QUESTIONS) {
    const prefix = `${q.answer})`;
    const has = q.options.some(o => o.trim().startsWith(prefix) || o.trim().toUpperCase().startsWith(q.answer));
    assert(has, `Question ${q.id} correct answer (${q.answer}) not in options`);
  }
});

// ── 3. Rewards ───────────────────────────────────────────────────────────────
console.log('\n🏆 Rewards Tests');

test('createProgress returns zero state', () => {
  const p = createProgress();
  assertEqual(p.points, 0);
  assertEqual(p.stars, 0);
  assertEqual(p.completedQuestions.length, 0);
});

test('awardCorrectAnswer grants 10 points and 1 star', () => {
  const p = createProgress();
  const r = awardCorrectAnswer(p, 'q01');
  assertEqual(r.newPoints, 10);
  assertEqual(r.newStars, 1);
  assertEqual(r.progress.points, 10);
  assertEqual(r.progress.stars, 1);
  assert(!r.alreadyDone, 'First completion should not be alreadyDone');
});

test('awardCorrectAnswer prevents duplicate rewards', () => {
  const p = createProgress();
  const r1 = awardCorrectAnswer(p, 'q01');
  const r2 = awardCorrectAnswer(r1.progress, 'q01');
  assertEqual(r2.newPoints, 0, 'No points for duplicate answer');
  assertEqual(r2.newStars, 0, 'No stars for duplicate answer');
  assert(r2.alreadyDone, 'Should be marked alreadyDone');
});

test('Multiple unique correct answers accumulate correctly', () => {
  let p = createProgress();
  for (let i = 1; i <= 5; i++) {
    const r = awardCorrectAnswer(p, `q0${i}`);
    p = r.progress;
  }
  assertEqual(p.points, 50);
  assertEqual(p.stars, 5);
  assertEqual(p.completedQuestions.length, 5);
});

test('getMasteryLevel returns correct levels', () => {
  assertEqual(getMasteryLevel(0).level,  'New Learner');
  assertEqual(getMasteryLevel(1).level,  'Star Learner');
  assertEqual(getMasteryLevel(5).level,  'Rising Mathematician');
  assertEqual(getMasteryLevel(10).level, 'Fraction Explorer');
  assertEqual(getMasteryLevel(20).level, 'Mathematics Champion');
});

test('Badge awarded at 1 star (first_star)', () => {
  const p = createProgress();
  const r = awardCorrectAnswer(p, 'q01');
  assert(r.newBadges.some(b => b.id === 'first_star'), 'first_star badge not awarded');
});

// ── 4. Chatbot Engine ────────────────────────────────────────────────────────
console.log('\n🤖 Chatbot Engine Tests');

test('createSession returns a valid session', () => {
  const s = createSession('Aiman');
  assertEqual(s.nickname, 'Aiman');
  assertEqual(s.state, 'IDLE');
  assert(s.progress, 'Session must have progress');
  assert(s.quiz, 'Session must have quiz state');
  assert(typeof s.unknownStreak === 'number', 'Session must have unknownStreak');
});

test('Greeting produces a response', () => {
  const s = createSession();
  const r = processMessage(s, 'Hello!');
  assert(r.response, 'No response to greeting');
  assert(r.response.toLowerCase().includes('cikgu ai') || r.response.toLowerCase().includes('hi') || r.response.toLowerCase().includes('hello'), 'Greeting response should mention CIKGU AI or say hi');
  assert(Array.isArray(r.buttons), 'Buttons should be an array');
});

test('Help intent resets to IDLE', () => {
  const s = createSession();
  const r = processMessage(s, 'help');
  assertEqual(r.session.state, 'IDLE', 'State should be IDLE after help');
});

test('Quiz request starts a quiz', () => {
  const s = createSession();
  const r = processMessage(s, 'quiz');
  assertEqual(r.session.state, 'QUIZ', 'State should be QUIZ');
  assert(r.session.quiz.active, 'Quiz should be active');
  assert(r.session.quiz.questions.length > 0, 'Quiz should have questions');
});

test('Lesson request triggers lesson content', () => {
  const s = createSession();
  const r = processMessage(s, 'teach me fractions');
  assert(r.response, 'No response to lesson request');
});

test('Progress request shows points', () => {
  const s = createSession();
  const r = processMessage(s, 'progress');
  assert(r.response.toLowerCase().includes('progress') || r.response.includes('Points') || r.response.includes('Stars'), 'Progress response should show stats');
});

test('Unknown input triggers fallback', () => {
  const s = createSession();
  const r = processMessage(s, 'xyzzy qwerty blorp!!!');
  assert(r.response, 'No fallback response');
  assert(r.response.length > 10, 'Fallback too short');
});

test('Two unknown inputs trigger teacher help offer', () => {
  const s = createSession();
  processMessage(s, 'xyzzy qwerty blorp123');
  const r = processMessage(s, 'frobble zork blorp999');
  assert(
    r.response.toLowerCase().includes('teacher') ||
    r.response.toLowerCase().includes('whatsapp') ||
    r.response.toLowerCase().includes('menu') ||
    r.response.toLowerCase().includes('trouble'),
    'Should suggest teacher help or menu after 2 unknowns. Got: ' + r.response.substring(0,100)
  );
});

test('Quiz answer checking: correct answer awards points', () => {
  const s = createSession();
  const qr = processMessage(s, 'quiz');
  assert(s.quiz && s.quiz.active, 'Quiz should be active');
  const currentQ = s.quiz.questions[0];
  const correctAnswer = currentQ.answer;
  const ar = processMessage(s, correctAnswer);
  assertEqual(s.progress.completedQuestions.includes(currentQ.id), true, 'Question should be in completedQuestions');
  assertEqual(s.progress.points, 10, 'Should have 10 points after correct answer');
});

test('Empty message returns a prompt', () => {
  const s = createSession();
  const r = processMessage(s, '');
  assert(r.response, 'No response to empty message');
});

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n' + '─'.repeat(50));
console.log(`Results: ${passed} passed, ${failed} failed`);
if (failed === 0) {
  console.log('🎉 All tests passed!\n');
} else {
  console.log(`⚠️  ${failed} test(s) failed.\n`);
  process.exitCode = 1;
}
