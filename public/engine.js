/* CIKGU AI – engine.js
 * Browser-compatible bundle of shared/mathContent.js + shared/quizData.js
 * + shared/rewards.js + shared/chatbotEngine.js
 * Exposes: window.CikguEngine = { createSession, processMessage }
 */
(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════════════════════════
  // mathContent
  // ═══════════════════════════════════════════════════════════════════════════

  var LESSONS = [
    {
      id: 'lesson1', title: 'Introduction to Fractions', icon: '🍕',
      objective: 'Understand what a fraction is and how it represents equal parts of a whole.',
      concept: 'A fraction shows how many equal parts of a whole you have.\n\nImagine a pizza cut into 4 equal slices. If you eat 1 slice, you have eaten 1 out of 4 equal parts — that is written as **1/4** (one-quarter).',
      example: {
        text: 'A chocolate bar is divided into 8 equal pieces. Mia eats 3 pieces.',
        fraction: '3/8',
        explanation: 'Mia ate 3 out of 8 equal pieces, so she ate **3/8** of the chocolate bar.'
      },
      stepByStep: [
        'Count the TOTAL equal parts → this is the bottom number (denominator).',
        'Count the SHADED or chosen parts → this is the top number (numerator).',
        'Write it as: numerator / denominator.'
      ],
      check: 'A cake is cut into 6 equal slices. Tom eats 2 slices. What fraction did Tom eat?',
      topic: 'fractions'
    },
    {
      id: 'lesson2', title: 'Numerators and Denominators', icon: '🔢',
      objective: 'Identify and explain the numerator and denominator in any fraction.',
      concept: 'Every fraction has two parts:\n\n• **Numerator** (top number) — how many parts you have.\n• **Denominator** (bottom number) — the total number of equal parts the whole is divided into.\n\nIn the fraction **3/5**, the numerator is **3** and the denominator is **5**.',
      example: {
        text: 'Look at the fraction 2/7.',
        fraction: '2/7',
        explanation: 'Numerator = **2** (you have 2 parts). Denominator = **7** (the whole is divided into 7 equal parts).'
      },
      stepByStep: [
        'The TOP number is the NUMERATOR — it tells you how many parts you have.',
        'The BOTTOM number is the DENOMINATOR — it tells you how many equal parts make the whole.',
        'Remember: denominator = down (bottom)!'
      ],
      check: 'In the fraction 5/9, what is the numerator and what is the denominator?',
      topic: 'fractions'
    },
    {
      id: 'lesson3', title: 'Proper and Improper Fractions', icon: '⚖️',
      objective: 'Tell the difference between proper fractions and improper fractions.',
      concept: '**Proper fraction**: The numerator is SMALLER than the denominator.\nExample: **3/4** → 3 < 4 ✅ (less than one whole)\n\n**Improper fraction**: The numerator is EQUAL TO or GREATER THAN the denominator.\nExample: **5/3** → 5 > 3 ✅ (more than one whole)\n\nAn improper fraction like **6/4** can also be written as a mixed number: **1 and 2/4**.',
      example: {
        text: 'Which is proper and which is improper?',
        fraction: '3/4 vs 7/4',
        explanation: '3/4 is proper (3 < 4). 7/4 is improper (7 > 4) — it equals 1 and 3/4.'
      },
      stepByStep: [
        'Look at the numerator and denominator.',
        'If numerator < denominator → PROPER fraction (less than 1 whole).',
        'If numerator ≥ denominator → IMPROPER fraction (1 whole or more).',
        'Improper fractions can be converted to mixed numbers.'
      ],
      check: 'Is 7/5 a proper or improper fraction?',
      topic: 'fractions'
    },
    {
      id: 'lesson4', title: 'Equivalent Fractions', icon: '🟰',
      objective: 'Find and create equivalent fractions using multiplication and division.',
      concept: '**Equivalent fractions** are different fractions that represent the SAME amount.\n\nExample: **1/2 = 2/4 = 4/8** — all equal the same amount, like half a pizza.\n\nTo find an equivalent fraction, multiply or divide BOTH the numerator and denominator by the SAME number.',
      example: {
        text: 'Find two fractions equivalent to 1/3.',
        fraction: '1/3',
        explanation: '1/3 × 2/2 = 2/6 ✅ and 1/3 × 3/3 = 3/9 ✅. All three are equal!'
      },
      stepByStep: [
        'Choose a number to multiply (e.g. 2).',
        'Multiply the NUMERATOR by that number: 1 × 2 = 2.',
        'Multiply the DENOMINATOR by the SAME number: 3 × 2 = 6.',
        'Result: 1/3 = 2/6 ✅'
      ],
      check: 'Find a fraction equivalent to 2/5 by multiplying by 3.',
      topic: 'fractions'
    },
    {
      id: 'lesson5', title: 'Comparing and Ordering Fractions', icon: '📊',
      objective: 'Compare fractions using <, >, or = and arrange them in order.',
      concept: 'To compare fractions with the **same denominator**, compare the numerators.\nExample: **3/8 < 5/8** because 3 < 5.\n\nTo compare fractions with **different denominators**, first find a common denominator.\nExample: Compare **1/2** and **1/3**.\n1/2 = 3/6 and 1/3 = 2/6 → so **1/2 > 1/3**.',
      example: {
        text: 'Which is bigger: 3/4 or 5/8?',
        fraction: '3/4 vs 5/8',
        explanation: '3/4 = 6/8 and 5/8 = 5/8. Since 6 > 5, we know **3/4 > 5/8**.'
      },
      stepByStep: [
        'Check if denominators are the same.',
        'If different, find the Lowest Common Denominator (LCD).',
        'Convert both fractions to equivalent fractions with the LCD.',
        'Compare the numerators — the bigger numerator is the bigger fraction.'
      ],
      check: 'Which is bigger: 2/3 or 3/4?',
      topic: 'fractions'
    },
    {
      id: 'lesson6', title: 'Adding and Subtracting Fractions', icon: '➕',
      objective: 'Add and subtract fractions with the same and different denominators.',
      concept: '**Same denominators**: Add or subtract the numerators only. Keep the denominator.\nExample: **2/7 + 3/7 = 5/7**\n\n**Different denominators**: First find the LCD, convert, then add/subtract.\nExample: **1/4 + 1/2 = 1/4 + 2/4 = 3/4**',
      example: {
        text: 'Calculate: 1/3 + 1/6',
        fraction: '1/3 + 1/6',
        explanation: 'LCD of 3 and 6 is 6. 1/3 = 2/6. So 2/6 + 1/6 = **3/6 = 1/2** ✅'
      },
      stepByStep: [
        'Check if denominators are the same.',
        'If the same: add/subtract numerators, keep denominator.',
        'If different: find the LCD.',
        'Convert fractions to the LCD.',
        'Add/subtract numerators.',
        'Simplify if possible.'
      ],
      check: 'Calculate: 3/8 + 1/8',
      topic: 'fractions'
    }
  ];

  var TOPIC_KEYWORDS = {
    lesson1: ['introduction', 'intro', 'what is', 'basic', 'pizza', 'part', 'parts', 'whole'],
    lesson2: ['numerator', 'denominator', 'top number', 'bottom number'],
    lesson3: ['proper', 'improper', 'mixed number', 'greater than'],
    lesson4: ['equivalent', 'same amount', 'equal fraction'],
    lesson5: ['compare', 'order', 'bigger', 'smaller', 'greater', 'less'],
    lesson6: ['add', 'subtract', 'plus', 'minus', 'addition', 'subtraction', 'sum']
  };

  function getLessonById(id) {
    return LESSONS.find(function (l) { return l.id === id; }) || null;
  }

  function getLessonByKeyword(text) {
    var lower = text.toLowerCase();
    for (var key in TOPIC_KEYWORDS) {
      if (Object.prototype.hasOwnProperty.call(TOPIC_KEYWORDS, key)) {
        var words = TOPIC_KEYWORDS[key];
        if (words.some(function (w) { return lower.includes(w); })) {
          return getLessonById(key);
        }
      }
    }
    return null;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // quizData
  // ═══════════════════════════════════════════════════════════════════════════

  var QUIZ_QUESTIONS = [
    // Lesson 1
    { id: 'q01', lesson: 'lesson1', difficulty: 'easy',
      question: 'A pizza is cut into 4 equal slices. Aiman eats 1 slice. What fraction of the pizza did Aiman eat?',
      options: ['A) 1/4', 'B) 1/3', 'C) 4/1', 'D) 3/4'], answer: 'A',
      hint: 'Aiman ate 1 slice out of 4 equal slices total.',
      explanation: '1 slice out of 4 equal slices = **1/4**. The numerator (1) shows how many he ate, and the denominator (4) shows the total slices.' },
    { id: 'q02', lesson: 'lesson1', difficulty: 'easy',
      question: 'A cake is cut into 8 equal pieces. Siti eats 3 pieces. What fraction did Siti eat?',
      options: ['A) 8/3', 'B) 3/5', 'C) 3/8', 'D) 5/8'], answer: 'C',
      hint: 'Siti ate 3 pieces out of 8 total pieces.',
      explanation: 'Siti ate 3 out of 8 equal pieces = **3/8**. Numerator = 3 (pieces eaten), Denominator = 8 (total pieces).' },
    { id: 'q03', lesson: 'lesson1', difficulty: 'medium',
      question: 'A chocolate bar has 10 equal squares. Lina eats 4 squares. Which fraction shows the part Lina did NOT eat?',
      options: ['A) 4/10', 'B) 6/10', 'C) 10/6', 'D) 4/6'], answer: 'B',
      hint: 'Lina ate 4 squares. How many squares were left uneaten?',
      explanation: 'Lina ate 4 squares, so 10 − 4 = 6 squares were NOT eaten. The fraction is **6/10**.' },
    { id: 'q04', lesson: 'lesson1', difficulty: 'hard',
      question: 'A fruit basket has 12 fruits. 5 are mangoes. What fraction of the fruits are NOT mangoes?',
      options: ['A) 5/12', 'B) 7/5', 'C) 7/12', 'D) 5/7'], answer: 'C',
      hint: 'First find how many fruits are NOT mangoes: 12 − 5 = ?',
      explanation: '12 − 5 = 7 fruits are not mangoes. Fraction = **7/12**.' },
    // Lesson 2
    { id: 'q05', lesson: 'lesson2', difficulty: 'easy',
      question: 'In the fraction 3/7, what is the denominator?',
      options: ['A) 3', 'B) 7', 'C) 10', 'D) 4'], answer: 'B',
      hint: 'The denominator is the bottom number of the fraction.',
      explanation: 'In **3/7**, the number **7** is at the bottom — that is the denominator.' },
    { id: 'q06', lesson: 'lesson2', difficulty: 'easy',
      question: 'In the fraction 5/9, what is the numerator?',
      options: ['A) 9', 'B) 4', 'C) 14', 'D) 5'], answer: 'D',
      hint: 'The numerator is the top number of the fraction.',
      explanation: 'In **5/9**, the number **5** is on top — that is the numerator.' },
    { id: 'q07', lesson: 'lesson2', difficulty: 'medium',
      question: 'A fraction has numerator 4 and denominator 9. Which fraction is this?',
      options: ['A) 9/4', 'B) 4/9', 'C) 4/4', 'D) 9/9'], answer: 'B',
      hint: 'Numerator goes on TOP, denominator goes on the BOTTOM.',
      explanation: 'Numerator (4) on top, Denominator (9) on bottom = **4/9**.' },
    { id: 'q08', lesson: 'lesson2', difficulty: 'hard',
      question: 'A fraction has denominator 6. The numerator is 2 less than the denominator. What is the fraction?',
      options: ['A) 2/6', 'B) 6/4', 'C) 4/6', 'D) 6/2'], answer: 'C',
      hint: 'Calculate: denominator − 2 = numerator. So 6 − 2 = ?',
      explanation: 'Denominator = 6. Numerator = 6 − 2 = 4. The fraction is **4/6**.' },
    // Lesson 3
    { id: 'q09', lesson: 'lesson3', difficulty: 'easy',
      question: 'Which of these is a proper fraction?',
      options: ['A) 7/4', 'B) 5/5', 'C) 3/8', 'D) 9/6'], answer: 'C',
      hint: 'A proper fraction has a numerator SMALLER than the denominator.',
      explanation: '**3/8**: 3 < 8, so it is a proper fraction.' },
    { id: 'q10', lesson: 'lesson3', difficulty: 'easy',
      question: 'Which of these is an improper fraction?',
      options: ['A) 1/3', 'B) 2/5', 'C) 3/4', 'D) 8/5'], answer: 'D',
      hint: 'An improper fraction has a numerator GREATER THAN or EQUAL to the denominator.',
      explanation: '**8/5**: 8 > 5, so it is an improper fraction.' },
    { id: 'q11', lesson: 'lesson3', difficulty: 'medium',
      question: 'Convert the improper fraction 9/4 into a mixed number.',
      options: ['A) 2 and 1/4', 'B) 1 and 3/4', 'C) 2 and 2/4', 'D) 3 and 1/4'], answer: 'A',
      hint: 'Divide 9 ÷ 4. What is the whole number part and the remainder?',
      explanation: '9 ÷ 4 = 2 remainder 1. So 9/4 = **2 and 1/4**.' },
    { id: 'q12', lesson: 'lesson3', difficulty: 'hard',
      question: 'Convert the mixed number 3 and 2/5 into an improper fraction.',
      options: ['A) 17/5', 'B) 5/17', 'C) 13/5', 'D) 15/5'], answer: 'A',
      hint: 'Multiply the whole number by the denominator, then add the numerator: (3 × 5) + 2 = ?',
      explanation: '(3 × 5) + 2 = 15 + 2 = 17. The improper fraction is **17/5**.' },
    // Lesson 4
    { id: 'q13', lesson: 'lesson4', difficulty: 'easy',
      question: 'Which fraction is equivalent to 1/2?',
      options: ['A) 1/4', 'B) 2/6', 'C) 3/6', 'D) 2/8'], answer: 'C',
      hint: 'Multiply both 1 and 2 by the same number. Try multiplying by 3.',
      explanation: '1/2 × 3/3 = **3/6**. Both fractions represent exactly half.' },
    { id: 'q14', lesson: 'lesson4', difficulty: 'easy',
      question: 'Which fraction is equivalent to 2/3?',
      options: ['A) 4/9', 'B) 6/9', 'C) 3/6', 'D) 4/6'], answer: 'D',
      hint: 'Multiply numerator and denominator of 2/3 by the same number.',
      explanation: '2/3 × 2/2 = **4/6**. Both 2/3 and 4/6 represent the same amount.' },
    { id: 'q15', lesson: 'lesson4', difficulty: 'medium',
      question: 'Complete the equivalent fraction: 3/4 = ?/12',
      options: ['A) 6', 'B) 8', 'C) 9', 'D) 12'], answer: 'C',
      hint: 'What did we multiply 4 by to get 12? Multiply the numerator by the same number.',
      explanation: '4 × 3 = 12, so we multiply numerator 3 × 3 = **9**. Therefore 3/4 = 9/12.' },
    { id: 'q16', lesson: 'lesson4', difficulty: 'hard',
      question: 'Simplify the fraction 12/16 to its simplest form.',
      options: ['A) 6/8', 'B) 3/4', 'C) 4/5', 'D) 2/3'], answer: 'B',
      hint: 'Find the largest number that divides both 12 and 16 exactly (HCF).',
      explanation: 'HCF of 12 and 16 is 4. 12 ÷ 4 = 3 and 16 ÷ 4 = 4. Simplest form = **3/4**.' },
    // Lesson 5
    { id: 'q17', lesson: 'lesson5', difficulty: 'easy',
      question: 'Which fraction is bigger: 3/8 or 5/8?',
      options: ['A) 3/8', 'B) 5/8', 'C) They are equal', 'D) Cannot compare'], answer: 'B',
      hint: 'The denominators are the same. Compare the numerators.',
      explanation: 'Same denominator (8). Compare numerators: 5 > 3. So **5/8 > 3/8**.' },
    { id: 'q18', lesson: 'lesson5', difficulty: 'easy',
      question: 'Arrange these fractions from smallest to largest: 1/4, 1/2, 1/8',
      options: ['A) 1/2, 1/4, 1/8', 'B) 1/8, 1/4, 1/2', 'C) 1/4, 1/8, 1/2', 'D) 1/2, 1/8, 1/4'], answer: 'B',
      hint: 'All numerators are 1. A bigger denominator means a SMALLER piece.',
      explanation: 'With the same numerator (1): bigger denominator = smaller fraction. So: **1/8 < 1/4 < 1/2**.' },
    { id: 'q19', lesson: 'lesson5', difficulty: 'medium',
      question: 'Which is greater: 2/3 or 3/5?',
      options: ['A) 2/3', 'B) 3/5', 'C) They are equal', 'D) Cannot compare'], answer: 'A',
      hint: 'Find the LCD of 3 and 5, then convert both fractions.',
      explanation: 'LCD = 15. 2/3 = 10/15 and 3/5 = 9/15. Since 10 > 9, **2/3 > 3/5**.' },
    { id: 'q20', lesson: 'lesson5', difficulty: 'hard',
      question: 'Arrange from smallest to largest: 5/6, 3/4, 7/12',
      options: ['A) 3/4, 7/12, 5/6', 'B) 5/6, 3/4, 7/12', 'C) 7/12, 3/4, 5/6', 'D) 7/12, 5/6, 3/4'], answer: 'C',
      hint: 'Find the LCD of 6, 4, and 12. Then convert all fractions.',
      explanation: 'LCD = 12. 5/6 = 10/12, 3/4 = 9/12, 7/12 = 7/12. Order: **7/12 < 3/4 < 5/6**.' },
    // Lesson 6
    { id: 'q21', lesson: 'lesson6', difficulty: 'easy',
      question: 'Calculate: 2/9 + 4/9',
      options: ['A) 6/18', 'B) 6/9', 'C) 2/9', 'D) 8/9'], answer: 'B',
      hint: 'Same denominator! Just add the numerators and keep the denominator.',
      explanation: '2/9 + 4/9 = (2+4)/9 = **6/9**.' },
    { id: 'q22', lesson: 'lesson6', difficulty: 'easy',
      question: 'Calculate: 7/10 − 3/10',
      options: ['A) 10/10', 'B) 4/20', 'C) 4/10', 'D) 3/10'], answer: 'C',
      hint: 'Same denominator! Subtract the numerators and keep the denominator.',
      explanation: '7/10 − 3/10 = (7−3)/10 = **4/10**.' },
    { id: 'q23', lesson: 'lesson6', difficulty: 'medium',
      question: 'Calculate: 1/3 + 1/4',
      options: ['A) 2/7', 'B) 2/12', 'C) 7/12', 'D) 5/12'], answer: 'C',
      hint: 'Different denominators! Find the LCD of 3 and 4, then convert.',
      explanation: 'LCD = 12. 1/3 = 4/12 and 1/4 = 3/12. So 4/12 + 3/12 = **7/12**.' },
    { id: 'q24', lesson: 'lesson6', difficulty: 'hard',
      question: 'Anis has 3/4 of a ribbon. She uses 1/3 of the ribbon. How much ribbon is left?',
      options: ['A) 2/12', 'B) 5/12', 'C) 7/12', 'D) 3/12'], answer: 'B',
      hint: 'Subtract: 3/4 − 1/3. Find the LCD of 4 and 3 first.',
      explanation: 'LCD = 12. 3/4 = 9/12, 1/3 = 4/12. 9/12 − 4/12 = **5/12** of ribbon remaining.' }
  ];

  function getQuestionById(id) {
    return QUIZ_QUESTIONS.find(function (q) { return q.id === id; }) || null;
  }

  function getQuestionsByLesson(lessonId) {
    return QUIZ_QUESTIONS.filter(function (q) { return q.lesson === lessonId; });
  }

  function getRandomQuestions(lessonId, count) {
    count = count || 4;
    var pool = lessonId ? getQuestionsByLesson(lessonId) : QUIZ_QUESTIONS.slice();
    var shuffled = pool.slice().sort(function () { return Math.random() - 0.5; });
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function checkAnswer(questionId, selectedOption) {
    var q = getQuestionById(questionId);
    if (!q) return { valid: false, correct: false };
    var selected = selectedOption.trim().toUpperCase().charAt(0);
    var correct = selected === q.answer;
    return { valid: true, correct: correct, question: q };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // rewards
  // ═══════════════════════════════════════════════════════════════════════════

  var BADGES = [
    { id: 'first_star',        name: 'First Star ⭐',           desc: 'Completed your first question correctly!', condition: function (s) { return s.stars >= 1;  } },
    { id: 'rising_math',       name: 'Rising Mathematician 🚀', desc: 'Earned 5 stars!',                          condition: function (s) { return s.stars >= 5;  } },
    { id: 'fraction_explorer', name: 'Fraction Explorer 🔭',    desc: 'Earned 10 stars!',                         condition: function (s) { return s.stars >= 10; } },
    { id: 'math_champion',     name: 'Mathematics Champion 🏆', desc: 'Earned 20 stars!',                         condition: function (s) { return s.stars >= 20; } }
  ];

  function createProgress() {
    return { points: 0, stars: 0, completedQuestions: [], badges: [] };
  }

  function checkNewBadges(oldProgress, newProgress) {
    var oldBadges = oldProgress.badges || [];
    return BADGES.filter(function (b) {
      return !oldBadges.includes(b.id) && b.condition(newProgress);
    });
  }

  function awardCorrectAnswer(progress, questionId) {
    if (progress.completedQuestions.includes(questionId)) {
      return { progress: progress, newPoints: 0, newStars: 0, alreadyDone: true, newBadges: [] };
    }
    var updated = {
      points: progress.points + 10,
      stars:  progress.stars  + 1,
      completedQuestions: progress.completedQuestions.concat([questionId]),
      badges: progress.badges ? progress.badges.slice() : []
    };
    var newBadges = checkNewBadges(progress, updated);
    updated.badges = updated.badges.concat(newBadges.map(function (b) { return b.id; }));
    return { progress: updated, newPoints: 10, newStars: 1, alreadyDone: false, newBadges: newBadges };
  }

  function getMasteryLevel(stars) {
    if (stars >= 20) return { level: 'Mathematics Champion', emoji: '🏆' };
    if (stars >= 10) return { level: 'Fraction Explorer',    emoji: '🔭' };
    if (stars >= 5)  return { level: 'Rising Mathematician', emoji: '🚀' };
    if (stars >= 1)  return { level: 'Star Learner',         emoji: '⭐' };
    return { level: 'New Learner', emoji: '📚' };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // chatbotEngine
  // ═══════════════════════════════════════════════════════════════════════════

  var INTENTS = {
    GREETING: [/\b(hi|hello|hey|good\s+(morning|afternoon|evening)|assalamualaikum|salam)\b/i, /^\/start\b/i],
    QUIZ:     [/\b(quiz|test|practis|practice|challenge|soalan)\b/i],
    PROGRESS: [/\b(progress|point|star|badge|score|result|achievement)\b/i, /how many (stars?|points?)/i],
    HELP:     [/\b(help|menu|home|restart|reset|start over|main menu|back)\b/i, /^\/help\b/i],
    TOPICS:   [/\b(topics?|lessons?|subjects?|show topics?|choose topic)\b/i, /^\/topics?\b/i],
    LESSON:   [/\b(learn|teach|explain|what is|tell me|show me|fraction|numerator|denominator|proper|improper|equivalent|compar|add(ing)?|subtract)\b/i],
    ANSWER:   [/^\s*[a-dA-D]\s*[).:]?\s*$/, /^(answer is|i (choose|pick|select|think))\s+[a-dA-D]\b/i],
    NEXT:     [/^\s*(next|continue|skip|proceed)\s*$/i],
    HINT:     [/^\s*hint\s*$/i],
    WHATSAPP: [/\b(teacher|cikgu|whatsapp|wa|contact|human|real person|help me|stuck)\b/i],
    HOMEWORK: [/\b(do (my |the )?homework|answer (for )?me|solve (my |this )?assignment|cheat)\b/i],
    YES:      [/^\s*(yes|yeah|yep|sure|ok|okay|yup|alright|lets? go|ready|ya)\s*$/i],
    NO:       [/^\s*(no|nope|nah|not now|later|skip)\s*$/i]
  };

  function detectIntent(text) {
    var t = text.trim();
    for (var name in INTENTS) {
      if (Object.prototype.hasOwnProperty.call(INTENTS, name)) {
        var patterns = INTENTS[name];
        if (patterns.some(function (p) { return p.test(t); })) return name;
      }
    }
    return 'UNKNOWN';
  }

  function createSession(nickname) {
    return {
      nickname: (nickname || '').trim().slice(0, 20),
      state: 'IDLE',
      currentLesson: null,
      quiz: { questions: [], index: 0, attemptCount: 0, active: false },
      progress: createProgress(),
      unknownStreak: 0
    };
  }

  function processMessage(session, rawText) {
    var text = String(rawText || '').trim();
    if (!text) {
      return reply(session,
        '❓ Please type a message so I can help you!\n\nTry saying *hello*, asking about *fractions*, or typing *quiz*.', []);
    }

    var intent = detectIntent(text);

    if (intent === 'HELP')     return handleHelp(session);
    if (intent === 'WHATSAPP') return handleWhatsApp(session);
    if (intent === 'HOMEWORK') return handleHomework(session);
    if (intent === 'PROGRESS') return handleProgress(session);
    if (intent === 'TOPICS')   return showTopicMenu(session);

    if (session.state === 'QUIZ' && session.quiz.active) {
      if (intent === 'HINT') return giveHint(session);
      if (intent === 'NEXT') return nextQuizQuestion(session);
      if (/\b(quit|stop|end quiz|exit quiz)\b/i.test(text)) return endQuiz(session, true);
      var answerLetter = extractAnswerLetter(text);
      if (answerLetter) return handleQuizAnswer(session, answerLetter);
      return reply(session,
        '🎯 We are in a quiz! Please choose *A*, *B*, *C*, or *D*, or tap a button below.',
        currentQuizButtons(session));
    }

    if (intent === 'GREETING') return handleGreeting(session);
    if (intent === 'QUIZ')     return startQuiz(session, text);
    if (intent === 'LESSON')   return handleLesson(session, text);

    if (intent === 'YES') return showTopicMenu(session);
    if (intent === 'NO') {
      return reply(session,
        "No worries! 😊 Take your time. Type *help* whenever you're ready.",
        [{ label: '📚 Topics', value: 'topics' }, { label: '🎯 Quiz', value: 'quiz' }]);
    }

    var lessonMatch = text.match(/^lesson([1-6])$/i);
    if (lessonMatch) {
      var lesson = getLessonById('lesson' + lessonMatch[1]);
      if (lesson) return presentLesson(session, lesson);
    }

    return handleUnknown(session, text);
  }

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleGreeting(session) {
    var name = session.nickname ? ', *' + session.nickname + '*' : '';
    session.state = 'IDLE';
    return reply(session,
      '👋 Hi there' + name + '! I\'m *CIKGU AI*, your friendly Maths learning assistant! 🤖✨\n\nI\'m here to help you master *Year 4 Fractions*.\n\nWhat would you like to do today?',
      topicButtons());
  }

  function handleHelp(session) {
    session.state = 'IDLE';
    if (session.quiz.active) session.quiz.active = false;
    return reply(session,
      '🏠 *Main Menu*\n\n📚 *Learn* — Six Fractions lessons\n🎯 *Quiz* — Practise with questions\n📊 *Progress* — See your points & stars\n👩‍🏫 *Teacher* — Contact via WhatsApp\n\nChoose a topic or type what you need!',
      topicButtons());
  }

  function handleWhatsApp(session) {
    return reply(session,
      '👩‍🏫 *Need more help?*\n\nYou can reach your teacher directly on WhatsApp:\n👉 *+601158921344*\n\nTap the button below or save the number in your phone!',
      [
        { label: '💬 WhatsApp Teacher', value: 'https://wa.me/601158921344' },
        { label: '🏠 Main Menu',        value: 'home' }
      ]);
  }

  function handleHomework(session) {
    return reply(session,
      '😊 I\'m happy to help you *understand* your homework!\n\nLet\'s work through the steps together rather than just giving you the answer — that way you will really learn it! 🌟\n\nWhich topic is your homework about?',
      topicButtons());
  }

  function handleProgress(session) {
    var p = session.progress;
    var mastery = getMasteryLevel(p.stars);
    var badgeList = p.badges && p.badges.length > 0 ? p.badges.join(' ') : 'No badges yet — keep going! 💪';
    return reply(session,
      '📊 *Your Learning Progress*\n\n⭐ Stars: *' + p.stars + '*\n🏆 Points: *' + p.points + '*\n✅ Questions done: *' + p.completedQuestions.length + '* / 24\n🎯 Level: *' + mastery.emoji + ' ' + mastery.level + '*\n\n🏅 *Badges:* ' + badgeList,
      [
        { label: '📚 Keep Learning', value: 'topics' },
        { label: '🎯 Take a Quiz',   value: 'quiz' }
      ]);
  }

  function handleLesson(session, text) {
    var lesson = getLessonByKeyword(text);
    if (lesson) return presentLesson(session, lesson);
    return showTopicMenu(session);
  }

  function presentLesson(session, lesson) {
    session.state = 'LESSON';
    session.currentLesson = lesson.id;
    var steps = lesson.stepByStep.map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n');
    var text =
      lesson.icon + ' *Lesson: ' + lesson.title + '*\n\n' +
      '🎯 _Objective:_ ' + lesson.objective + '\n\n' +
      '📖 *Concept:*\n' + lesson.concept + '\n\n' +
      '📌 *Example:*\n' + lesson.example.text + '\n' +
      'Fraction: *' + lesson.example.fraction + '*\n' + lesson.example.explanation + '\n\n' +
      '🪜 *Steps:*\n' + steps + '\n\n' +
      '✏️ *Quick Check:* ' + lesson.check;
    return reply(session, text, [
      { label: '🎯 Quiz on ' + lesson.title, value: 'quiz ' + lesson.id },
      { label: '📚 Other Topics',            value: 'topics' },
      { label: '📊 My Progress',             value: 'progress' }
    ]);
  }

  function showTopicMenu(session) {
    session.state = 'AWAITING_TOPIC';
    var list = LESSONS.map(function (l, i) { return l.icon + ' *' + (i + 1) + '. ' + l.title + '*'; }).join('\n');
    var buttons = LESSONS.map(function (l) { return { label: l.icon + ' ' + l.title, value: l.id }; });
    buttons.push({ label: '🎯 Random Quiz', value: 'quiz' });
    return reply(session,
      '📚 *Year 4 Fractions — Choose a Lesson:*\n\n' + list + '\n\nTap a button or type a topic name!',
      buttons);
  }

  function startQuiz(session, text) {
    var questions;
    var match = text.match(/lesson([1-6])/i);
    if (match) {
      questions = getQuestionsByLesson('lesson' + match[1]);
    } else {
      var lesson = getLessonByKeyword(text);
      questions = lesson ? getQuestionsByLesson(lesson.id) : getRandomQuestions(null, 6);
    }
    if (!questions || questions.length === 0) questions = getRandomQuestions(null, 6);
    questions = questions.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 6);
    session.state = 'QUIZ';
    session.quiz  = { questions: questions, index: 0, attemptCount: 0, active: true };
    return serveQuestion(session, true);
  }

  function serveQuestion(session, isFirst) {
    var quiz = session.quiz;
    if (quiz.index >= quiz.questions.length) return endQuiz(session);
    quiz.attemptCount = 0;
    var q      = quiz.questions[quiz.index];
    var header = isFirst ? '🎯 *Quiz Time! Let\'s go!*\n\n' : '➡️ *Next Question:*\n\n';
    var optButtons = q.options.map(function (o) { return { label: o, value: o.charAt(0).toUpperCase() }; });
    optButtons.push({ label: '💡 Hint', value: 'hint' });
    return reply(session,
      header + '*Question ' + (quiz.index + 1) + ' of ' + quiz.questions.length + '* (' + q.difficulty + ')\n\n' + q.question + '\n\n' + q.options.join('\n'),
      optButtons);
  }

  function nextQuizQuestion(session) { return serveQuestion(session, false); }

  function handleQuizAnswer(session, letter) {
    var quiz = session.quiz;
    if (!quiz.active || quiz.index >= quiz.questions.length) {
      return reply(session, "There's no active quiz. Type *quiz* to start one!", []);
    }
    var q = quiz.questions[quiz.index];
    var result = checkAnswer(q.id, letter);
    quiz.attemptCount++;

    if (result.correct) {
      var award = awardCorrectAnswer(session.progress, q.id);
      session.progress = award.progress;
      quiz.index++;
      var rewardLine = award.alreadyDone
        ? '_(already completed — no extra points)_'
        : 'You earned *+10 points* and *1 star ⭐*!';
      var badgeLine = award.newBadges.length > 0
        ? '\n\n🏅 *New Badge: ' + award.newBadges[0].name + '*\n' + award.newBadges[0].desc
        : '';
      var hasNext = quiz.index < quiz.questions.length;
      return reply(session,
        '✅ *Excellent! That\'s correct!* 🎉\n\n📖 ' + result.question.explanation + '\n\n' + rewardLine + badgeLine + '\n\n⭐ Stars: ' + session.progress.stars + ' | 🏆 Points: ' + session.progress.points,
        hasNext
          ? [{ label: '➡️ Next Question', value: 'next' }]
          : [{ label: '🏁 See Results',   value: 'next' }]);
    }

    if (quiz.attemptCount === 1) {
      return reply(session,
        '💛 Good try! That\'s not quite right.\n\n💡 *Hint:* ' + result.question.hint + '\n\nHave another go — choose *A*, *B*, *C*, or *D*:',
        q.options.map(function (o) { return { label: o, value: o.charAt(0).toUpperCase() }; }));
    }

    quiz.index++;
    var hasNext2 = quiz.index < quiz.questions.length;
    return reply(session,
      '😊 No worries! The correct answer was *' + result.question.answer + '*.\n\n📖 ' + result.question.explanation,
      hasNext2
        ? [{ label: '➡️ Next Question', value: 'next' }]
        : [{ label: '🏁 See Results',   value: 'next' }]);
  }

  function giveHint(session) {
    var quiz = session.quiz;
    if (!quiz.active || quiz.index >= quiz.questions.length) {
      return reply(session, 'No active question. Type *quiz* to start! 😊', []);
    }
    var q = quiz.questions[quiz.index];
    return reply(session,
      '💡 *Hint:* ' + q.hint,
      q.options.map(function (o) { return { label: o, value: o.charAt(0).toUpperCase() }; }));
  }

  function endQuiz(session, aborted) {
    var quiz = session.quiz;
    quiz.active   = false;
    session.state = 'IDLE';
    var correct = 0;
    for (var i = 0; i < quiz.index; i++) {
      if (session.progress.completedQuestions.includes(quiz.questions[i].id)) correct++;
    }
    var total = quiz.index;
    var pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    var feedback;
    if (aborted)         feedback = 'Quiz ended early. Come back any time! 😊';
    else if (pct === 100) feedback = '🌟 *PERFECT SCORE!* You are amazing!';
    else if (pct >= 70)   feedback = '🎉 *Great job!* You\'re doing really well!';
    else if (pct >= 50)   feedback = '👍 *Good effort!* Review the lessons and try again!';
    else                  feedback = '💪 *Keep practising!* Every attempt makes you better!';
    return reply(session,
      '🏁 *Quiz Complete!*\n\n✅ Correct: ' + correct + ' / ' + total + '\n📊 Score: ' + pct + '%\n⭐ Total Stars: ' + session.progress.stars + '\n🏆 Total Points: ' + session.progress.points + '\n\n' + feedback,
      [
        { label: '🔄 Try Again',   value: 'quiz'     },
        { label: '📚 Learn More',  value: 'topics'   },
        { label: '📊 My Progress', value: 'progress' }
      ]);
  }

  function handleUnknown(session, text) {
    var nextStreak = (session.unknownStreak || 0) + 1;
    if (nextStreak >= 2) {
      return reply(session,
        '😅 I\'m still having trouble understanding that.\n\nYou can always contact your teacher on *WhatsApp: +601158921344* for extra help!\n\nOr return to the main menu:',
        [
          { label: '🏠 Main Menu',        value: 'home' },
          { label: '💬 WhatsApp Teacher', value: 'https://wa.me/601158921344' }
        ]);
    }
    var result = reply(session,
      '🤔 Oops! I didn\'t quite catch that. Try asking another way, or choose a topic below! 😊',
      topicButtons());
    result.session.unknownStreak = nextStreak;
    return result;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  function extractAnswerLetter(text) {
    var m = text.trim().match(/^([a-dA-D])[).:\s]?$/) ||
            text.match(/\b(answer is|i choose|i pick|i select)\s+([a-dA-D])\b/i);
    if (!m) return null;
    return (m[2] || m[1]).toUpperCase();
  }

  function currentQuizButtons(session) {
    var quiz = session.quiz;
    if (!quiz.active || quiz.index >= quiz.questions.length) return [];
    var q = quiz.questions[quiz.index];
    var btns = q.options.map(function (o) { return { label: o, value: o.charAt(0).toUpperCase() }; });
    btns.push({ label: '💡 Hint', value: 'hint' });
    return btns;
  }

  function topicButtons() {
    return [
      { label: '🍕 Intro to Fractions',    value: 'lesson1'  },
      { label: '🔢 Numerator/Denominator', value: 'lesson2'  },
      { label: '⚖️ Proper & Improper',     value: 'lesson3'  },
      { label: '🟰 Equivalent Fractions',  value: 'lesson4'  },
      { label: '📊 Comparing Fractions',   value: 'lesson5'  },
      { label: '➕ Add & Subtract',        value: 'lesson6'  },
      { label: '🎯 Take a Quiz',           value: 'quiz'     },
      { label: '📊 My Progress',           value: 'progress' }
    ];
  }

  function reply(session, text, buttons) {
    session.unknownStreak = 0;
    return { session: session, response: text, buttons: buttons || [] };
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // Public API
  // ═══════════════════════════════════════════════════════════════════════════

  global.CikguEngine = { createSession: createSession, processMessage: processMessage };

}(window));
