// ============================================================
//  GAME STATE
// ============================================================
let state = {
  playerName: '',
  grade: 5,
  questions: [],
  currentQ: 0,
  score: 0,
  correctCount: 0,
  wrongCount: 0,
  bonusTotal: 0,
  timeLeft: 30,
  timerInterval: null,
  results: [],        // 'correct' | 'wrong' per question
  answered: false,
  prevScreen: 'welcome',
};

const TIMER_MAX = 30;
const TIMER_CIRCUMFERENCE = 2 * Math.PI * 22; // 138.23

// ============================================================
//  SCREEN MANAGEMENT
// ============================================================
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-' + id).classList.add('active');
}

function goToGrade() {
  const nameInput = document.getElementById('playerNameInput');
  const name = nameInput ? nameInput.value.trim() : state.playerName;
  if (!name) {
    showScreen('welcome');
    document.getElementById('playerNameInput').focus();
    shakeEl(document.getElementById('playerNameInput'));
    return;
  }
  state.playerName = name;
  startGame(5); // only grade 5 for now
}

function shakeEl(el) {
  el.style.animation = 'none';
  el.style.borderColor = 'var(--red-light)';
  el.offsetHeight; // reflow
  el.style.animation = 'shakeInput 0.4s ease';
  setTimeout(() => { el.style.borderColor = ''; el.style.animation = ''; }, 600);
}

function showHighScores(from) {
  state.prevScreen = from;
  renderHighScores();
  showScreen('highscores');
}

function backFromHighScores() {
  showScreen(state.prevScreen);
}

// ============================================================
//  GAME FLOW
// ============================================================
function startGame(grade) {
  state.grade = grade;
  state.questions = prepareQuestions(grade);
  state.currentQ = 0;
  state.score = 0;
  state.correctCount = 0;
  state.wrongCount = 0;
  state.bonusTotal = 0;
  state.results = [];
  state.answered = false;

  document.getElementById('tbPlayer').textContent =
    state.playerName.length > 8 ? state.playerName.slice(0,7)+'…' : state.playerName;

  buildProgressDots();
  showScreen('game');
  loadQuestion();
}

function buildProgressDots() {
  const row = document.getElementById('progressRow');
  row.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const d = document.createElement('div');
    d.className = 'progress-dot' + (i === 0 ? ' current' : '');
    d.id = 'dot-' + i;
    row.appendChild(d);
  }
}

function updateProgressDot(idx, result) {
  const d = document.getElementById('dot-' + idx);
  if (!d) return;
  d.classList.remove('current');
  d.classList.add(result === 'correct' ? 'done-correct' : 'done-wrong');
  const next = document.getElementById('dot-' + (idx + 1));
  if (next) next.classList.add('current');
}

function loadQuestion() {
  stopTimer();
  state.answered = false;

  const q = state.questions[state.currentQ];
  document.getElementById('tbQuestion').textContent = (state.currentQ + 1) + '/10';
  document.getElementById('tbScore').textContent = state.score;
  const questionEl = document.getElementById('questionText');
  questionEl.textContent = q.text;
  // Hebrew Unicode block: \u0590–\u05FF. RTL so ? appears on the left; pure math stays LTR.
  questionEl.style.direction = /[\u0590-\u05FF]/.test(q.text) ? 'rtl' : 'ltr';

  // Reset ball — clear all inline styles so CSS class takes over
  const ball = document.getElementById('ball');
  ball.getAnimations().forEach(a => a.cancel());
  ball.className = 'ball';
  ball.style.cssText = '';

  if (q.type === 'kick') {
    document.getElementById('goalKickSection').style.display = 'block';
    document.getElementById('openAnswerSection').style.display = 'none';
    document.getElementById('qTypeBadge').textContent = '⚽ בעיטה לשער';
    document.getElementById('qTypeBadge').className = 'question-type-badge badge-kick';

    const zones = ['tl','tr','bl','br'];
    zones.forEach((z, i) => {
      const el = document.getElementById('zone-' + z);
      el.textContent = q.answers[i];
      el.className = 'goal-zone';
      el.style.pointerEvents = 'auto';
    });
  } else {
    document.getElementById('goalKickSection').style.display = 'none';
    document.getElementById('openAnswerSection').style.display = 'block';
    document.getElementById('qTypeBadge').textContent = '✏️ תשובה חופשית';
    document.getElementById('qTypeBadge').className = 'question-type-badge badge-open';
    const inp = document.getElementById('openAnswerInput');
    inp.value = '';
    inp.disabled = false;
    setTimeout(() => inp.focus(), 100);
  }

  startTimer();
}

// ============================================================
//  TIMER
// ============================================================
function startTimer() {
  state.timeLeft = TIMER_MAX;
  updateTimerUI();
  state.timerInterval = setInterval(() => {
    state.timeLeft--;
    updateTimerUI();
    if (state.timeLeft <= 0) {
      stopTimer();
      handleTimeout();
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(state.timerInterval);
  state.timerInterval = null;
}

function updateTimerUI() {
  const t = state.timeLeft;
  document.getElementById('timerText').textContent = t;
  const ring = document.getElementById('timerRing');
  const offset = TIMER_CIRCUMFERENCE * (1 - t / TIMER_MAX);
  ring.style.strokeDashoffset = offset;
  if (t <= 8) {
    ring.classList.add('urgent');
    document.getElementById('timerText').style.color = 'var(--red-light)';
  } else {
    ring.classList.remove('urgent');
    document.getElementById('timerText').style.color = '';
  }
}

function handleTimeout() {
  if (state.answered) return;
  state.answered = true;
  const q = state.questions[state.currentQ];
  if (q.type === 'kick') {
    disableZones();
    const zones = ['tl','tr','bl','br'];
    document.getElementById('zone-' + zones[q.correct]).classList.add('correct');
  } else {
    document.getElementById('openAnswerInput').disabled = true;
  }
  showFeedback(false, '⏱️ אוי! נגמר הזמן', 0);
  state.results.push('wrong');
  state.wrongCount++;
  updateProgressDot(state.currentQ, 'wrong');
  setTimeout(nextQuestion, 3500);
}

// ============================================================
//  KICK LOGIC
// ============================================================
const ZONE_IDX = { tl:0, tr:1, bl:2, br:3 };

function animateBallToZone(zone) {
  const ball      = document.getElementById('ball');
  const zoneEl    = document.getElementById('zone-' + zone);
  const container = document.getElementById('goalKickSection'); // position:relative, no backdrop-filter

  const cbRect   = container.getBoundingClientRect();
  const ballRect = ball.getBoundingClientRect();
  const zoneRect = zoneEl.getBoundingClientRect();

  // All coords relative to #goalKickSection (the actual containing block for position:absolute)
  const startX = ballRect.left - cbRect.left + ballRect.width  / 2;
  const startY = ballRect.top  - cbRect.top  + ballRect.height / 2;
  const endX   = zoneRect.left - cbRect.left + zoneRect.width  / 2;
  const endY   = zoneRect.top  - cbRect.top  + zoneRect.height / 2;

  const midX = (startX + endX) / 2;
  const midY = Math.min(startY, endY) - 60;
  const rotateDir = endX < startX ? -360 : 360;

  ball.getAnimations().forEach(a => a.cancel());
  ball.style.cssText =
    `position:absolute; left:${startX}px; top:${startY}px;` +
    ` transform:translate(-50%,-50%); width:52px; height:52px;` +
    ` font-size:44px; pointer-events:none; z-index:20;`;

  ball.animate([
    { left: startX+'px', top: startY+'px', transform: 'translate(-50%,-50%) scale(1) rotate(0deg)' },
    { left: midX+'px',   top: midY+'px',   transform: `translate(-50%,-50%) scale(1.3) rotate(${rotateDir/2}deg)`, offset: 0.38 },
    { left: endX+'px',   top: endY+'px',   transform: `translate(-50%,-50%) scale(0.9) rotate(${rotateDir}deg)` }
  ], { duration: 650, fill: 'forwards', easing: 'cubic-bezier(0.2,0,0.8,1)' });
}

function kickZone(zone) {
  if (state.answered) return;
  state.answered = true;
  stopTimer();
  disableZones();

  const q = state.questions[state.currentQ];
  const clickedIdx = ZONE_IDX[zone];
  const isCorrect  = (clickedIdx === q.correct);

  animateBallToZone(zone);

  setTimeout(() => {
    document.getElementById('zone-' + zone).classList.add(isCorrect ? 'correct' : 'wrong');
    if (!isCorrect) {
      const zones = ['tl','tr','bl','br'];
      document.getElementById('zone-' + zones[q.correct]).classList.add('correct');
    }
  }, 500);

  if (isCorrect) {
    const bonus  = calcBonus(state.timeLeft);
    const points = 10 + bonus;
    state.score += points;
    state.correctCount++;
    state.bonusTotal += bonus;
    state.results.push('correct');
    updateProgressDot(state.currentQ, 'correct');
    showFeedback(true, bonus > 0 ? `+${points} נקודות! (בונוס מהירות +${bonus})` : `+10 נקודות!`, points);
    launchConfetti();
    setTimeout(nextQuestion, 2000);
  } else {
    state.wrongCount++;
    state.results.push('wrong');
    updateProgressDot(state.currentQ, 'wrong');
    showFeedback(false, `התשובה הנכונה: ${q.answers[q.correct]}`, 0);
    setTimeout(nextQuestion, 3500);
  }

  document.getElementById('tbScore').textContent = state.score;
}

function disableZones() {
  ['tl','tr','bl','br'].forEach(z => {
    document.getElementById('zone-' + z).style.pointerEvents = 'none';
  });
}

function calcBonus(timeLeft) {
  if (timeLeft >= 25) return 5;
  if (timeLeft >= 18) return 3;
  if (timeLeft >= 10) return 1;
  return 0;
}

// ============================================================
//  OPEN ANSWER
// ============================================================
function submitOpenAnswer() {
  if (state.answered) return;
  const inp = document.getElementById('openAnswerInput');
  const val = parseFloat(inp.value);
  if (isNaN(val)) { shakeEl(inp); return; }

  state.answered = true;
  stopTimer();
  inp.disabled = true;

  const q = state.questions[state.currentQ];
  const isCorrect = Math.abs(val - q.correct) < 0.1;

  if (isCorrect) {
    const bonus  = calcBonus(state.timeLeft);
    const points = 10 + bonus;
    state.score += points;
    state.correctCount++;
    state.bonusTotal += bonus;
    state.results.push('correct');
    updateProgressDot(state.currentQ, 'correct');
    showFeedback(true, bonus > 0 ? `+${points} נקודות! (בונוס מהירות +${bonus})` : `+10 נקודות!`, points);
    launchConfetti();
    setTimeout(nextQuestion, 2000);
  } else {
    state.wrongCount++;
    state.results.push('wrong');
    updateProgressDot(state.currentQ, 'wrong');
    showFeedback(false, `התשובה הנכונה: ${q.correct}`, 0);
    setTimeout(nextQuestion, 3500);
  }

  document.getElementById('tbScore').textContent = state.score;
}

// ============================================================
//  NEXT QUESTION / END GAME
// ============================================================
function nextQuestion() {
  state.currentQ++;
  if (state.currentQ >= 10) {
    endGame();
  } else {
    loadQuestion();
  }
}

function endGame() {
  stopTimer();
  const entry = saveScore();
  showEndScreen(entry.isNew);
}

// ============================================================
//  FEEDBACK
// ============================================================
function showFeedback(isGoal, subText) {
  const overlay = document.getElementById('feedbackOverlay');
  const word    = document.getElementById('feedbackWord');
  const sub     = document.getElementById('feedbackSub');

  overlay.className = 'feedback-overlay';
  void overlay.offsetWidth;

  if (isGoal) {
    word.textContent = 'גוooOOOOL! ⚽';
    word.className   = 'feedback-word goal-word';
    overlay.classList.add('show-goal');
  } else {
    word.textContent = 'נבלם! ✗';
    word.className   = 'feedback-word save-word';
    overlay.classList.add('show-save');
  }
  sub.textContent = subText;
  sub.style.opacity = '0';
  void sub.offsetWidth;
  sub.style.opacity = '';
}

// ============================================================
//  CONFETTI
// ============================================================
const CONFETTI_COLORS = ['#f5c518','#39ff14','#ff6b6b','#64dfdf','#ffffff','#ff9f1c'];

function launchConfetti() {
  const container = document.getElementById('confettiContainer');
  container.innerHTML = '';
  for (let i = 0; i < 55; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left       = Math.random() * 100 + 'vw';
    piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    piece.style.width      = (6 + Math.random() * 8) + 'px';
    piece.style.height     = (6 + Math.random() * 8) + 'px';
    piece.style.borderRadius       = Math.random() > 0.5 ? '50%' : '2px';
    piece.style.animationDuration  = (1.2 + Math.random() * 1.4) + 's';
    piece.style.animationDelay     = (Math.random() * 0.4) + 's';
    container.appendChild(piece);
  }
  setTimeout(() => { container.innerHTML = ''; }, 3000);
}

// ============================================================
//  END SCREEN
// ============================================================
function showEndScreen(isNewRecord) {
  const pct = Math.round((state.correctCount / 10) * 100);
  let emoji = '⚽', title = 'סיום מחזור!';
  if (pct === 100)     { emoji = '🏆'; title = 'מושלם! 100%!'; }
  else if (pct >= 80)  { emoji = '🌟'; title = 'מצוין! כדורגלן אמיתי!'; }
  else if (pct >= 60)  { emoji = '👍'; title = 'כל הכבוד!'; }
  else if (pct >= 40)  { emoji = '💪'; title = 'טוב, אפשר להשתפר!'; }
  else                 { emoji = '😓'; title = 'תתאמן עוד קצת!'; }

  document.getElementById('endEmoji').textContent = emoji;
  document.getElementById('endTitle').textContent = title;
  document.getElementById('endScore').textContent = state.score;

  document.getElementById('scoreBreakdown').innerHTML = `
    <div class="breakdown-item">
      <div class="breakdown-num" style="color:#39ff14">${state.correctCount}</div>
      <div class="breakdown-label">נכון ✓</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num" style="color:var(--red-light)">${state.wrongCount}</div>
      <div class="breakdown-label">טעות ✗</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num">${pct}%</div>
      <div class="breakdown-label">אחוז הצלחה</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num">${state.bonusTotal}</div>
      <div class="breakdown-label">בונוס מהירות</div>
    </div>
  `;

  document.getElementById('newRecordBanner').style.display = isNewRecord ? 'block' : 'none';
  if (pct >= 80) launchConfetti();

  showScreen('end');
}

// ============================================================
//  HIGH SCORES (localStorage)
// ============================================================
const LS_KEY = 'mathKidsHighScores_v2';

function getScores() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; }
  catch { return []; }
}

function saveScores(scores) {
  localStorage.setItem(LS_KEY, JSON.stringify(scores));
}

function saveScore() {
  const scores = getScores();
  const entry = {
    name:    state.playerName,
    score:   state.score,
    grade:   state.grade,
    date:    new Date().toLocaleDateString('he-IL'),
    correct: state.correctCount,
  };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  saveScores(top10);

  const prevBest = scores.filter(s => s.name === entry.name && s.score > entry.score);
  entry.isNew = prevBest.length === 0 && top10.some(s => s.score === entry.score && s.name === entry.name);
  return entry;
}

function renderHighScores() {
  const scores    = getScores();
  const container = document.getElementById('highScoresContent');
  if (scores.length === 0) {
    container.innerHTML = '<div class="no-scores">עדיין אין שיאים. שחק ובנה שיא! ⚽</div>';
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  let html = `<table class="scores-table">
    <thead><tr>
      <th>מקום</th><th>שם</th><th>ניקוד</th><th>כיתה</th><th>תאריך</th>
    </tr></thead><tbody>`;
  scores.forEach((s, i) => {
    const cls   = i === 0 ? ' class="top-1"' : '';
    const medal = medals[i] || (i + 1);
    html += `<tr${cls}>
      <td><span class="rank-medal">${medal}</span></td>
      <td>${escHtml(s.name)}</td>
      <td><strong>${s.score}</strong></td>
      <td>כיתה ${s.grade === 5 ? 'ה\'' : 'ו\''}</td>
      <td>${escHtml(s.date)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function clearScores() {
  if (confirm('האם למחוק את כל השיאים?')) {
    localStorage.removeItem(LS_KEY);
    renderHighScores();
  }
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
//  EVENT LISTENERS  (DOM must be ready)
// ============================================================
document.getElementById('openAnswerInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') submitOpenAnswer();
});

document.getElementById('playerNameInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') goToGrade();
});
