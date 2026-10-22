'use strict';

const LESSONS = [
  {
    id: 'lesson1',
    title: 'Introduction to Fractions',
    icon: '🍕',
    objective: 'Understand what a fraction is and how it represents equal parts of a whole.',
    concept: `A fraction shows how many equal parts of a whole you have.\n\nImagine a pizza cut into 4 equal slices. If you eat 1 slice, you have eaten 1 out of 4 equal parts — that is written as **1/4** (one-quarter).`,
    example: {
      text: 'A chocolate bar is divided into 8 equal pieces. Mia eats 3 pieces.',
      fraction: '3/8',
      visual: { shaded: 3, total: 8, shape: 'bar' },
      explanation: 'Mia ate 3 out of 8 equal pieces, so she ate **3/8** of the chocolate bar.'
    },
    stepByStep: [
      'Count the TOTAL equal parts → this is the bottom number (denominator).',
      'Count the SHADED or chosen parts → this is the top number (numerator).',
      'Write it as: numerator / denominator.'
    ],
    check: 'A cake is cut into 6 equal slices. Tom eats 2 slices. What fraction did Tom eat?',
    checkAnswer: '2/6',
    checkHint: 'Tom ate 2 out of 6 slices.',
    topic: 'fractions'
  },
  {
    id: 'lesson2',
    title: 'Numerators and Denominators',
    icon: '🔢',
    objective: 'Identify and explain the numerator and denominator in any fraction.',
    concept: `Every fraction has two parts:\n\n• **Numerator** (top number) — how many parts you have.\n• **Denominator** (bottom number) — the total number of equal parts the whole is divided into.\n\nIn the fraction **3/5**, the numerator is **3** and the denominator is **5**.`,
    example: {
      text: 'Look at the fraction 2/7.',
      fraction: '2/7',
      visual: { shaded: 2, total: 7, shape: 'bar' },
      explanation: 'Numerator = **2** (you have 2 parts). Denominator = **7** (the whole is divided into 7 equal parts).'
    },
    stepByStep: [
      'The TOP number is the NUMERATOR — it tells you how many parts you have.',
      'The BOTTOM number is the DENOMINATOR — it tells you how many equal parts make the whole.',
      'Remember: denominator = down (bottom)!'
    ],
    check: 'In the fraction 5/9, what is the numerator and what is the denominator?',
    checkAnswer: 'numerator 5 denominator 9',
    checkHint: 'The numerator is on top (5) and the denominator is on the bottom (9).',
    topic: 'fractions'
  },
  {
    id: 'lesson3',
    title: 'Proper and Improper Fractions',
    icon: '⚖️',
    objective: 'Tell the difference between proper fractions and improper fractions.',
    concept: `**Proper fraction**: The numerator is SMALLER than the denominator.\nExample: **3/4** → 3 < 4 ✅ (less than one whole)\n\n**Improper fraction**: The numerator is EQUAL TO or GREATER THAN the denominator.\nExample: **5/3** → 5 > 3 ✅ (more than one whole)\n\nAn improper fraction like **6/4** can also be written as a mixed number: **1 and 2/4**.`,
    example: {
      text: 'Which is proper and which is improper?',
      fraction: '3/4 vs 7/4',
      visual: { shaded: 3, total: 4, shape: 'circle' },
      explanation: '3/4 is proper (3 < 4). 7/4 is improper (7 > 4) — it equals 1 and 3/4.'
    },
    stepByStep: [
      'Look at the numerator and denominator.',
      'If numerator < denominator → PROPER fraction (less than 1 whole).',
      'If numerator ≥ denominator → IMPROPER fraction (1 whole or more).',
      'Improper fractions can be converted to mixed numbers.'
    ],
    check: 'Is 7/5 a proper or improper fraction?',
    checkAnswer: 'improper',
    checkHint: 'Compare the top number (7) with the bottom number (5). Which is bigger?',
    topic: 'fractions'
  },
  {
    id: 'lesson4',
    title: 'Equivalent Fractions',
    icon: '🟰',
    objective: 'Find and create equivalent fractions using multiplication and division.',
    concept: `**Equivalent fractions** are different fractions that represent the SAME amount.\n\nExample: **1/2 = 2/4 = 4/8** — all equal the same amount, like half a pizza.\n\nTo find an equivalent fraction, multiply or divide BOTH the numerator and denominator by the SAME number.`,
    example: {
      text: 'Find two fractions equivalent to 1/3.',
      fraction: '1/3',
      visual: { shaded: 1, total: 3, shape: 'bar' },
      explanation: '1/3 × 2/2 = 2/6 ✅ and 1/3 × 3/3 = 3/9 ✅. All three are equal!'
    },
    stepByStep: [
      'Choose a number to multiply (e.g. 2).',
      'Multiply the NUMERATOR by that number: 1 × 2 = 2.',
      'Multiply the DENOMINATOR by the SAME number: 3 × 2 = 6.',
      'Result: 1/3 = 2/6 ✅'
    ],
    check: 'Find a fraction equivalent to 2/5 by multiplying by 3.',
    checkAnswer: '6/15',
    checkHint: 'Multiply both top and bottom by 3: 2×3=? and 5×3=?',
    topic: 'fractions'
  },
  {
    id: 'lesson5',
    title: 'Comparing and Ordering Fractions',
    icon: '📊',
    objective: 'Compare fractions using <, >, or = and arrange them in order.',
    concept: `To compare fractions with the **same denominator**, compare the numerators.\nExample: **3/8 < 5/8** because 3 < 5.\n\nTo compare fractions with **different denominators**, first find a common denominator.\nExample: Compare **1/2** and **1/3**.\n1/2 = 3/6 and 1/3 = 2/6 → so **1/2 > 1/3**.`,
    example: {
      text: 'Which is bigger: 3/4 or 5/8?',
      fraction: '3/4 vs 5/8',
      visual: { shaded: 6, total: 8, shape: 'bar' },
      explanation: '3/4 = 6/8 and 5/8 = 5/8. Since 6 > 5, we know **3/4 > 5/8**.'
    },
    stepByStep: [
      'Check if denominators are the same.',
      'If different, find the Lowest Common Denominator (LCD).',
      'Convert both fractions to equivalent fractions with the LCD.',
      'Compare the numerators — the bigger numerator is the bigger fraction.'
    ],
    check: 'Which is bigger: 2/3 or 3/4?',
    checkAnswer: '3/4',
    checkHint: 'Convert to the same denominator: 2/3 = 8/12 and 3/4 = 9/12.',
    topic: 'fractions'
  },
  {
    id: 'lesson6',
    title: 'Adding and Subtracting Fractions',
    icon: '➕',
    objective: 'Add and subtract fractions with the same and different denominators.',
    concept: `**Same denominators**: Add or subtract the numerators only. Keep the denominator.\nExample: **2/7 + 3/7 = 5/7**\n\n**Different denominators**: First find the LCD, convert, then add/subtract.\nExample: **1/4 + 1/2 = 1/4 + 2/4 = 3/4**`,
    example: {
      text: 'Calculate: 1/3 + 1/6',
      fraction: '1/3 + 1/6',
      visual: { shaded: 3, total: 6, shape: 'bar' },
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
    checkAnswer: '4/8',
    checkHint: 'Same denominator! Just add the numerators: 3 + 1 = ?',
    topic: 'fractions'
  }
];

const TOPIC_KEYWORDS = {
  fractions: ['fraction', 'fractions', 'pecahan', 'numerator', 'denominator', 'proper', 'improper', 'equivalent', 'compare', 'add', 'subtract', 'numerators', 'denominators'],
  lesson1: ['introduction', 'intro', 'what is', 'basic', 'pizza', 'part', 'parts', 'whole'],
  lesson2: ['numerator', 'denominator', 'top number', 'bottom number'],
  lesson3: ['proper', 'improper', 'mixed number', 'greater than'],
  lesson4: ['equivalent', 'same amount', 'equal fraction'],
  lesson5: ['compare', 'order', 'bigger', 'smaller', 'greater', 'less'],
  lesson6: ['add', 'subtract', 'plus', 'minus', 'addition', 'subtraction', 'sum']
};

function getLessonById(id) {
  return LESSONS.find(l => l.id === id) || null;
}

function getLessonByKeyword(text) {
  const lower = text.toLowerCase();
  for (const [key, words] of Object.entries(TOPIC_KEYWORDS)) {
    if (key.startsWith('lesson') && words.some(w => lower.includes(w))) {
      return getLessonById(key);
    }
  }
  return null;
}

function getAllLessons() {
  return LESSONS;
}

if (typeof module !== 'undefined') {
  module.exports = { LESSONS, TOPIC_KEYWORDS, getLessonById, getLessonByKeyword, getAllLessons };
}
