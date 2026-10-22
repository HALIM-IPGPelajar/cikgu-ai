'use strict';

const QUIZ_QUESTIONS = [
  // ── LESSON 1: Introduction to Fractions ──────────────────────────────────
  {
    id: 'q01', lesson: 'lesson1', difficulty: 'easy',
    question: 'A pizza is cut into 4 equal slices. Aiman eats 1 slice. What fraction of the pizza did Aiman eat?',
    options: ['A) 1/4', 'B) 1/3', 'C) 4/1', 'D) 3/4'],
    answer: 'A',
    hint: 'Aiman ate 1 slice out of 4 equal slices total.',
    explanation: '1 slice out of 4 equal slices = **1/4**. The numerator (1) shows how many he ate, and the denominator (4) shows the total slices.'
  },
  {
    id: 'q02', lesson: 'lesson1', difficulty: 'easy',
    question: 'A cake is cut into 8 equal pieces. Siti eats 3 pieces. What fraction did Siti eat?',
    options: ['A) 8/3', 'B) 3/5', 'C) 3/8', 'D) 5/8'],
    answer: 'C',
    hint: 'Siti ate 3 pieces out of 8 total pieces.',
    explanation: 'Siti ate 3 out of 8 equal pieces = **3/8**. Numerator = 3 (pieces eaten), Denominator = 8 (total pieces).'
  },
  {
    id: 'q03', lesson: 'lesson1', difficulty: 'medium',
    question: 'A chocolate bar has 10 equal squares. Lina eats 4 squares. Which fraction shows the part Lina did NOT eat?',
    options: ['A) 4/10', 'B) 6/10', 'C) 10/6', 'D) 4/6'],
    answer: 'B',
    hint: 'Lina ate 4 squares. How many squares were left uneaten?',
    explanation: 'Lina ate 4 squares, so 10 − 4 = 6 squares were NOT eaten. The fraction is **6/10**.'
  },
  {
    id: 'q04', lesson: 'lesson1', difficulty: 'hard',
    question: 'A fruit basket has 12 fruits. 5 are mangoes. What fraction of the fruits are NOT mangoes?',
    options: ['A) 5/12', 'B) 7/5', 'C) 7/12', 'D) 5/7'],
    answer: 'C',
    hint: 'First find how many fruits are NOT mangoes: 12 − 5 = ?',
    explanation: '12 − 5 = 7 fruits are not mangoes. Fraction = **7/12**.'
  },

  // ── LESSON 2: Numerators and Denominators ────────────────────────────────
  {
    id: 'q05', lesson: 'lesson2', difficulty: 'easy',
    question: 'In the fraction 3/7, what is the denominator?',
    options: ['A) 3', 'B) 7', 'C) 10', 'D) 4'],
    answer: 'B',
    hint: 'The denominator is the bottom number of the fraction.',
    explanation: 'In **3/7**, the number **7** is at the bottom — that is the denominator. It tells us the whole is divided into 7 equal parts.'
  },
  {
    id: 'q06', lesson: 'lesson2', difficulty: 'easy',
    question: 'In the fraction 5/9, what is the numerator?',
    options: ['A) 9', 'B) 4', 'C) 14', 'D) 5'],
    answer: 'D',
    hint: 'The numerator is the top number of the fraction.',
    explanation: 'In **5/9**, the number **5** is on top — that is the numerator. It tells us we have 5 parts.'
  },
  {
    id: 'q07', lesson: 'lesson2', difficulty: 'medium',
    question: 'A fraction has numerator 4 and denominator 9. Which fraction is this?',
    options: ['A) 9/4', 'B) 4/9', 'C) 4/4', 'D) 9/9'],
    answer: 'B',
    hint: 'Numerator goes on TOP, denominator goes on the BOTTOM.',
    explanation: 'Numerator (4) on top, Denominator (9) on bottom = **4/9**.'
  },
  {
    id: 'q08', lesson: 'lesson2', difficulty: 'hard',
    question: 'A fraction has denominator 6. The numerator is 2 less than the denominator. What is the fraction?',
    options: ['A) 2/6', 'B) 6/4', 'C) 4/6', 'D) 6/2'],
    answer: 'C',
    hint: 'Calculate: denominator − 2 = numerator. So 6 − 2 = ?',
    explanation: 'Denominator = 6. Numerator = 6 − 2 = 4. The fraction is **4/6**.'
  },

  // ── LESSON 3: Proper and Improper Fractions ──────────────────────────────
  {
    id: 'q09', lesson: 'lesson3', difficulty: 'easy',
    question: 'Which of these is a proper fraction?',
    options: ['A) 7/4', 'B) 5/5', 'C) 3/8', 'D) 9/6'],
    answer: 'C',
    hint: 'A proper fraction has a numerator SMALLER than the denominator.',
    explanation: '**3/8**: 3 < 8, so it is a proper fraction. The others (7/4, 5/5, 9/6) have numerators ≥ denominators — those are improper.'
  },
  {
    id: 'q10', lesson: 'lesson3', difficulty: 'easy',
    question: 'Which of these is an improper fraction?',
    options: ['A) 1/3', 'B) 2/5', 'C) 3/4', 'D) 8/5'],
    answer: 'D',
    hint: 'An improper fraction has a numerator GREATER THAN or EQUAL to the denominator.',
    explanation: '**8/5**: 8 > 5, so it is an improper fraction. The others all have numerators smaller than their denominators.'
  },
  {
    id: 'q11', lesson: 'lesson3', difficulty: 'medium',
    question: 'Convert the improper fraction 9/4 into a mixed number.',
    options: ['A) 2 and 1/4', 'B) 1 and 3/4', 'C) 2 and 2/4', 'D) 3 and 1/4'],
    answer: 'A',
    hint: 'Divide 9 ÷ 4. What is the whole number part and the remainder?',
    explanation: '9 ÷ 4 = 2 remainder 1. So 9/4 = **2 and 1/4**.'
  },
  {
    id: 'q12', lesson: 'lesson3', difficulty: 'hard',
    question: 'Convert the mixed number 3 and 2/5 into an improper fraction.',
    options: ['A) 17/5', 'B) 5/17', 'C) 13/5', 'D) 15/5'],
    answer: 'A',
    hint: 'Multiply the whole number by the denominator, then add the numerator: (3 × 5) + 2 = ?',
    explanation: '(3 × 5) + 2 = 15 + 2 = 17. The improper fraction is **17/5**.'
  },

  // ── LESSON 4: Equivalent Fractions ──────────────────────────────────────
  {
    id: 'q13', lesson: 'lesson4', difficulty: 'easy',
    question: 'Which fraction is equivalent to 1/2?',
    options: ['A) 1/4', 'B) 2/6', 'C) 3/6', 'D) 2/8'],
    answer: 'C',
    hint: 'Multiply both 1 and 2 by the same number. Try multiplying by 3.',
    explanation: '1/2 × 3/3 = **3/6**. Both fractions represent exactly half.'
  },
  {
    id: 'q14', lesson: 'lesson4', difficulty: 'easy',
    question: 'Which fraction is equivalent to 2/3?',
    options: ['A) 4/9', 'B) 6/9', 'C) 3/6', 'D) 4/6'],
    answer: 'D',
    hint: 'Multiply numerator and denominator of 2/3 by the same number.',
    explanation: '2/3 × 2/2 = **4/6**. Both 2/3 and 4/6 represent the same amount.'
  },
  {
    id: 'q15', lesson: 'lesson4', difficulty: 'medium',
    question: 'Complete the equivalent fraction: 3/4 = ?/12',
    options: ['A) 6', 'B) 8', 'C) 9', 'D) 12'],
    answer: 'C',
    hint: 'What did we multiply 4 by to get 12? Multiply the numerator by the same number.',
    explanation: '4 × 3 = 12, so we multiply numerator 3 × 3 = **9**. Therefore 3/4 = 9/12.'
  },
  {
    id: 'q16', lesson: 'lesson4', difficulty: 'hard',
    question: 'Simplify the fraction 12/16 to its simplest form.',
    options: ['A) 6/8', 'B) 3/4', 'C) 4/5', 'D) 2/3'],
    answer: 'B',
    hint: 'Find the largest number that divides both 12 and 16 exactly (HCF).',
    explanation: 'HCF of 12 and 16 is 4. 12 ÷ 4 = 3 and 16 ÷ 4 = 4. Simplest form = **3/4**.'
  },

  // ── LESSON 5: Comparing and Ordering Fractions ───────────────────────────
  {
    id: 'q17', lesson: 'lesson5', difficulty: 'easy',
    question: 'Which fraction is bigger: 3/8 or 5/8?',
    options: ['A) 3/8', 'B) 5/8', 'C) They are equal', 'D) Cannot compare'],
    answer: 'B',
    hint: 'The denominators are the same. Compare the numerators.',
    explanation: 'Same denominator (8). Compare numerators: 5 > 3. So **5/8 > 3/8**.'
  },
  {
    id: 'q18', lesson: 'lesson5', difficulty: 'easy',
    question: 'Arrange these fractions from smallest to largest: 1/4, 1/2, 1/8',
    options: ['A) 1/2, 1/4, 1/8', 'B) 1/8, 1/4, 1/2', 'C) 1/4, 1/8, 1/2', 'D) 1/2, 1/8, 1/4'],
    answer: 'B',
    hint: 'All numerators are 1. A bigger denominator means a SMALLER piece.',
    explanation: 'With the same numerator (1): bigger denominator = smaller fraction. So: **1/8 < 1/4 < 1/2**.'
  },
  {
    id: 'q19', lesson: 'lesson5', difficulty: 'medium',
    question: 'Which is greater: 2/3 or 3/5?',
    options: ['A) 2/3', 'B) 3/5', 'C) They are equal', 'D) Cannot compare'],
    answer: 'A',
    hint: 'Find the LCD of 3 and 5, then convert both fractions.',
    explanation: 'LCD = 15. 2/3 = 10/15 and 3/5 = 9/15. Since 10 > 9, **2/3 > 3/5**.'
  },
  {
    id: 'q20', lesson: 'lesson5', difficulty: 'hard',
    question: 'Arrange from smallest to largest: 5/6, 3/4, 7/12',
    options: ['A) 3/4, 7/12, 5/6', 'B) 5/6, 3/4, 7/12', 'C) 7/12, 3/4, 5/6', 'D) 7/12, 5/6, 3/4'],
    answer: 'C',
    hint: 'Find the LCD of 6, 4, and 12. Then convert all fractions.',
    explanation: 'LCD = 12. 5/6 = 10/12, 3/4 = 9/12, 7/12 = 7/12. Order: 7/12 < 9/12 < 10/12 = **7/12 < 3/4 < 5/6**.'
  },

  // ── LESSON 6: Adding and Subtracting Fractions ───────────────────────────
  {
    id: 'q21', lesson: 'lesson6', difficulty: 'easy',
    question: 'Calculate: 2/9 + 4/9',
    options: ['A) 6/18', 'B) 6/9', 'C) 2/9', 'D) 8/9'],
    answer: 'B',
    hint: 'Same denominator! Just add the numerators and keep the denominator.',
    explanation: '2/9 + 4/9 = (2+4)/9 = **6/9**. Same denominator, so just add the numerators.'
  },
  {
    id: 'q22', lesson: 'lesson6', difficulty: 'easy',
    question: 'Calculate: 7/10 − 3/10',
    options: ['A) 10/10', 'B) 4/20', 'C) 4/10', 'D) 3/10'],
    answer: 'C',
    hint: 'Same denominator! Subtract the numerators and keep the denominator.',
    explanation: '7/10 − 3/10 = (7−3)/10 = **4/10**.'
  },
  {
    id: 'q23', lesson: 'lesson6', difficulty: 'medium',
    question: 'Calculate: 1/3 + 1/4',
    options: ['A) 2/7', 'B) 2/12', 'C) 7/12', 'D) 5/12'],
    answer: 'C',
    hint: 'Different denominators! Find the LCD of 3 and 4, then convert.',
    explanation: 'LCD = 12. 1/3 = 4/12 and 1/4 = 3/12. So 4/12 + 3/12 = **7/12**.'
  },
  {
    id: 'q24', lesson: 'lesson6', difficulty: 'hard',
    question: 'Anis has 3/4 of a ribbon. She uses 1/3 of the ribbon. How much ribbon is left?',
    options: ['A) 2/12', 'B) 5/12', 'C) 7/12', 'D) 3/12'],
    answer: 'B',
    hint: 'Subtract: 3/4 − 1/3. Find the LCD of 4 and 3 first.',
    explanation: 'LCD = 12. 3/4 = 9/12, 1/3 = 4/12. 9/12 − 4/12 = **5/12** of ribbon remaining.'
  }
];

function getQuestionById(id) {
  return QUIZ_QUESTIONS.find(q => q.id === id) || null;
}

function getQuestionsByLesson(lessonId) {
  return QUIZ_QUESTIONS.filter(q => q.lesson === lessonId);
}

function getRandomQuestions(lessonId, count = 4) {
  const pool = lessonId ? getQuestionsByLesson(lessonId) : [...QUIZ_QUESTIONS];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function checkAnswer(questionId, selectedOption) {
  const q = getQuestionById(questionId);
  if (!q) return { valid: false, correct: false };
  const selected = selectedOption.trim().toUpperCase().charAt(0);
  const correct = selected === q.answer;
  return { valid: true, correct, question: q };
}

if (typeof module !== 'undefined') {
  module.exports = { QUIZ_QUESTIONS, getQuestionById, getQuestionsByLesson, getRandomQuestions, checkAnswer };
}
