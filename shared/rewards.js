'use strict';

const BADGES = [
  { id: 'first_star',       name: 'First Star ⭐',        desc: 'Completed your first question correctly!',    condition: s => s.stars >= 1  },
  { id: 'rising_math',      name: 'Rising Mathematician 🚀', desc: 'Earned 5 stars!',                          condition: s => s.stars >= 5  },
  { id: 'fraction_explorer',name: 'Fraction Explorer 🔭', desc: 'Earned 10 stars!',                            condition: s => s.stars >= 10 },
  { id: 'math_champion',    name: 'Mathematics Champion 🏆', desc: 'Earned 20 stars!',                         condition: s => s.stars >= 20 }
];

function createProgress() {
  return { points: 0, stars: 0, completedQuestions: [], badges: [] };
}

function awardCorrectAnswer(progress, questionId) {
  if (progress.completedQuestions.includes(questionId)) {
    return { progress, newPoints: 0, newStars: 0, alreadyDone: true, newBadges: [] };
  }
  const updated = {
    ...progress,
    points: progress.points + 10,
    stars: progress.stars + 1,
    completedQuestions: [...progress.completedQuestions, questionId]
  };
  const newBadges = checkNewBadges(progress, updated);
  updated.badges = [...(progress.badges || []), ...newBadges.map(b => b.id)];
  return { progress: updated, newPoints: 10, newStars: 1, alreadyDone: false, newBadges };
}

function checkNewBadges(oldProgress, newProgress) {
  const oldBadges = oldProgress.badges || [];
  return BADGES.filter(b => !oldBadges.includes(b.id) && b.condition(newProgress));
}

function getMasteryLevel(stars) {
  if (stars >= 20) return { level: 'Mathematics Champion', emoji: '🏆', color: '#FFCB45' };
  if (stars >= 10) return { level: 'Fraction Explorer', emoji: '🔭', color: '#49C98C' };
  if (stars >= 5)  return { level: 'Rising Mathematician', emoji: '🚀', color: '#3478F6' };
  if (stars >= 1)  return { level: 'Star Learner', emoji: '⭐', color: '#3478F6' };
  return { level: 'New Learner', emoji: '📚', color: '#57606a' };
}

if (typeof module !== 'undefined') {
  module.exports = { BADGES, createProgress, awardCorrectAnswer, checkNewBadges, getMasteryLevel };
}
