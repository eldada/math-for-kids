// ============================================================
//  RACING GAME
// ============================================================

const RACING_LS_KEY  = 'mathKidsRacingScores_v1';
const RACING_Q_TOTAL = 10;
const CORRECT_COL    = '#27ae60';
const WRONG_COL      = '#c0392b';

let rState = {
  playerName:    '',
  questions:     [],
  currentQ:      0,
  score:         0,
  correctCount:  0,
  wrongCount:    0,
  bonusTotal:    0,
  carLane:       1,       // rendered lane 0=left 1=center 2=right
  carLaneTarget: 1,       // target lane (smooth slide)
  carX:          0,       // computed px per frame
  blockY:        -80,     // current Y of answer blocks
  blockSpeed:    1.2,
  phase:         'scrolling', // 'scrolling'|'result'|'done'
  resultCorrect: null,
  roadOffset:    0,
  animId:        null,
  answered:      false,
  switchedEarly: false,   // moved to correct lane before 40% travel → bonus
  blockEvalY:    0,       // Y position where blocks hit the car
};

let racingCanvas, racingCtx, canvasW, canvasH;
let touchStartX = 0;

// ============================================================
//  QUESTION GENERATION  (simple arithmetic, whole numbers ≤10)
// ============================================================
function generateRacingQuestions() {
  const ops    = ['+', '-', '×', '÷'];
  const result = [];
  const used   = new Set();

  while (result.length < RACING_Q_TOTAL) {
    const op = ops[Math.floor(Math.random() * ops.length)];
    let a, b, answer;

    if (op === '+') {
      a = rRand(1, 10); b = rRand(1, 10); answer = a + b;
    } else if (op === '-') {
      a = rRand(2, 10); b = rRand(1, a);  answer = a - b;
    } else if (op === '×') {
      a = rRand(1, 10); b = rRand(1, 10); answer = a * b;
    } else {
      b = rRand(2, 10); answer = rRand(1, 10); a = b * answer;
    }

    const text = `${a} ${op} ${b} = ?`;
    if (used.has(text)) continue;
    used.add(text);

    // Two unique wrong answers
    const wrong = [];
    const seen  = new Set([answer]);
    let tries   = 0;
    while (wrong.length < 2 && tries < 40) {
      tries++;
      const delta = rRand(1, 6) * (Math.random() < 0.5 ? 1 : -1);
      const w     = answer + delta;
      if (w >= 0 && !seen.has(w)) { seen.add(w); wrong.push(w); }
    }
    if (wrong.length < 2) continue;

    const correctLane = rRand(0, 2);
    const others      = [0, 1, 2].filter(l => l !== correctLane);
    const answers     = [null, null, null];
    answers[correctLane] = answer;
    answers[others[0]]   = wrong[0];
    answers[others[1]]   = wrong[1];

    result.push({ text, answer, correctLane, answers });
  }
  return result;
}

function rRand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ============================================================
//  START / STOP
// ============================================================
function startRacingGame() {
  // Merge player name from welcome screen
  const nameInput = document.getElementById('playerNameInput');
  if (nameInput && nameInput.value.trim()) state.playerName = nameInput.value.trim();
  rState.playerName = state.playerName || 'שחקן';

  // Reset state
  Object.assign(rState, {
    questions:     generateRacingQuestions(),
    currentQ:      0,
    score:         0,
    correctCount:  0,
    wrongCount:    0,
    bonusTotal:    0,
    carLane:       1,
    carLaneTarget: 1,
    phase:         'scrolling',
    roadOffset:    0,
    animId:        null,
    answered:      false,
  });

  document.getElementById('r-player').textContent =
    rState.playerName.length > 8 ? rState.playerName.slice(0, 7) + '…' : rState.playerName;
  document.getElementById('r-score').textContent  = '0';
  document.getElementById('r-qnum').textContent   = '1/' + RACING_Q_TOTAL;

  showScreen('racing');

  // Setup canvas after screen is visible so dimensions are correct
  requestAnimationFrame(() => {
    setupRacingCanvas();
    setupRacingInput();
    rState.carX = canvasW / 2;  // center lane
    loadRacingQuestion();
  });
}

function stopRacingGame() {
  if (rState.animId) { cancelAnimationFrame(rState.animId); rState.animId = null; }
  document.removeEventListener('keydown', racingKeyHandler);
  window.removeEventListener('resize', resizeRacingCanvas);
}

// ============================================================
//  CANVAS SETUP
// ============================================================
function setupRacingCanvas() {
  racingCanvas = document.getElementById('racingCanvas');
  racingCtx    = racingCanvas.getContext('2d');
  resizeRacingCanvas();
  window.addEventListener('resize', resizeRacingCanvas);
}

function resizeRacingCanvas() {
  if (!racingCanvas) return;
  const hud      = document.getElementById('racing-hud');
  const controls = document.getElementById('racing-controls');
  const hudH     = hud      ? hud.getBoundingClientRect().height      : 80;
  const ctrlH    = controls ? controls.getBoundingClientRect().height  : 70;

  canvasW = Math.min(window.innerWidth, 600);
  canvasH = Math.max(window.innerHeight - hudH - ctrlH - 8, 280);

  racingCanvas.width  = canvasW;
  racingCanvas.height = canvasH;

  // Recalculate carX for new width
  const laneW = canvasW / 3;
  rState.carX = rState.carLane * laneW + laneW / 2;
}

// ============================================================
//  LOAD QUESTION
// ============================================================
function loadRacingQuestion() {
  if (rState.currentQ >= RACING_Q_TOTAL) { endRacingGame(); return; }

  const q = rState.questions[rState.currentQ];
  document.getElementById('r-question').textContent = q.text;
  document.getElementById('r-qnum').textContent = (rState.currentQ + 1) + '/' + RACING_Q_TOTAL;

  rState.blockY        = -blockH();
  rState.answered      = false;
  rState.switchedEarly = false;
  rState.phase         = 'scrolling';
  rState.blockEvalY    = canvasH * 0.74; // where blocks collide with car
  rState.blockSpeed    = 1.2 + rState.currentQ * 0.04; // gets faster each question

  if (!rState.animId) {
    rState.animId = requestAnimationFrame(racingLoop);
  }
}

function blockH()  { return Math.min(58, canvasH * 0.11); }
function blockW()  { return Math.min(76, canvasW / 3 - 18); }
function laneW()   { return canvasW / 3; }
function laneX(l)  { return l * laneW() + laneW() / 2; }  // center X of lane l

// ============================================================
//  GAME LOOP
// ============================================================
function racingLoop() {
  if (rState.phase === 'done') return;

  rState.roadOffset = (rState.roadOffset + rState.blockSpeed) % 60;

  if (rState.phase === 'scrolling') {
    rState.blockY += rState.blockSpeed;

    // Check early-switch bonus: player in correct lane before 40% of travel
    const q = rState.questions[rState.currentQ];
    if (!rState.switchedEarly && rState.carLane === q.correctLane &&
        rState.blockY < rState.blockEvalY * 0.40) {
      rState.switchedEarly = true;
    }

    // Evaluate on collision
    if (!rState.answered && rState.blockY >= rState.blockEvalY) {
      rState.answered    = true;
      rState.keysEnabled = false;
      handleRacingAnswer(rState.carLane === q.correctLane);
    }
  } else if (rState.phase === 'result') {
    rState.blockY += rState.blockSpeed;
  }

  drawRacing();
  rState.animId = requestAnimationFrame(racingLoop);
}

// ============================================================
//  DRAW
// ============================================================
function drawRacing() {
  const ctx = racingCtx;
  const W = canvasW, H = canvasH;
  const q = rState.questions[rState.currentQ];

  // Background
  ctx.fillStyle = '#16213e';
  ctx.fillRect(0, 0, W, H);

  drawRoad(ctx, W, H);
  drawAnswerBlocks(ctx, W, H, q);
  drawCar(ctx, W, H);

  if (rState.phase === 'result') drawResultFlash(ctx, W, H);
}

function drawRoad(ctx, W, H) {
  // Asphalt lanes with subtle gradient
  const gradient = ctx.createLinearGradient(0, 0, W, 0);
  gradient.addColorStop(0,    '#1c2a40');
  gradient.addColorStop(0.33, '#1e2e44');
  gradient.addColorStop(0.66, '#1e2e44');
  gradient.addColorStop(1,    '#1c2a40');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, W, H);

  // Lane edge lines (solid white)
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth   = 3;
  ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(1, 0);   ctx.lineTo(1, H);   ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W-1, 0); ctx.lineTo(W-1, H); ctx.stroke();

  // Dashed lane dividers (animated)
  ctx.strokeStyle  = 'rgba(255,255,255,0.55)';
  ctx.lineWidth    = 2.5;
  ctx.setLineDash([32, 26]);
  ctx.lineDashOffset = -rState.roadOffset;

  for (let lane = 1; lane < 3; lane++) {
    const x = lane * laneW();
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
  }
  ctx.setLineDash([]);
}

function drawAnswerBlocks(ctx, W, H, q) {
  const bW = blockW(), bH = blockH();
  const by = rState.blockY;

  for (let lane = 0; lane < 3; lane++) {
    const cx = laneX(lane);
    const bx = cx - bW / 2;
    const ty = by - bH / 2; // top-left Y

    // Choose color based on phase
    let bgColor, borderColor;
    if (rState.phase === 'result') {
      if (lane === q.correctLane) {
        bgColor = CORRECT_COL; borderColor = '#2ecc71';
      } else if (lane === rState.carLane) {
        bgColor = WRONG_COL;   borderColor = '#e74c3c';
      } else {
        bgColor = 'rgba(60,60,80,0.7)'; borderColor = 'rgba(255,255,255,0.3)';
      }
    } else {
      // Colorful during scrolling
      const hues  = [200, 280, 30];
      bgColor     = `hsla(${hues[lane]}, 65%, 38%, 0.92)`;
      borderColor = `hsla(${hues[lane]}, 80%, 70%, 0.9)`;
    }

    // Draw block
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)';
    ctx.shadowBlur  = 10;
    roundRectPath(ctx, bx, ty, bW, bH, 10);
    ctx.fillStyle   = bgColor;
    ctx.fill();
    ctx.restore();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth   = 2;
    roundRectPath(ctx, bx, ty, bW, bH, 10);
    ctx.stroke();

    // Answer number
    const fontSize = Math.round(bH * 0.52);
    ctx.fillStyle      = '#ffffff';
    ctx.font           = `900 ${fontSize}px Arial, sans-serif`;
    ctx.textAlign      = 'center';
    ctx.textBaseline   = 'middle';
    ctx.shadowColor    = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur     = 4;
    ctx.fillText(String(q.answers[lane]), cx, by);
    ctx.shadowBlur     = 0;
  }
}

function drawCar(ctx, W, H) {
  // Smooth lane-change animation
  const targetX = laneX(rState.carLaneTarget);
  rState.carX  += (targetX - rState.carX) * 0.18;
  if (Math.abs(rState.carX - targetX) < 0.5) rState.carX = targetX;

  const cx  = rState.carX;
  const cy  = H * 0.82;
  const lw  = laneW();
  const cw  = Math.min(lw * 0.52, 62);   // body width
  const ch  = cw * 1.85;                  // body height

  // Shadow beneath car
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.beginPath();
  ctx.ellipse(cx + 4, cy + ch * 0.52, cw * 0.42, ch * 0.09, 0, 0, Math.PI * 2);
  ctx.fill();

  // Car body color: green on correct answer, red on wrong, orange normally
  let bodyColor = '#e67e22';
  if (rState.phase === 'result') bodyColor = rState.resultCorrect ? '#27ae60' : '#c0392b';

  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur  = 12;

  // Main body
  roundRectPath(ctx, cx - cw/2, cy - ch/2, cw, ch, cw * 0.22);
  ctx.fillStyle = bodyColor;
  ctx.fill();

  // Body shine stripe
  ctx.fillStyle = 'rgba(255,255,255,0.12)';
  roundRectPath(ctx, cx - cw * 0.2, cy - ch * 0.48, cw * 0.4, ch * 0.96, cw * 0.18);
  ctx.fill();

  ctx.restore();

  // Front windshield (top of car = front, car drives upward)
  ctx.fillStyle = 'rgba(140,220,255,0.75)';
  roundRectPath(ctx, cx - cw * 0.28, cy - ch * 0.44, cw * 0.56, ch * 0.21, 5);
  ctx.fill();

  // Rear window
  ctx.fillStyle = 'rgba(140,220,255,0.5)';
  roundRectPath(ctx, cx - cw * 0.22, cy + ch * 0.2, cw * 0.44, ch * 0.13, 4);
  ctx.fill();

  // Racing stripe
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  roundRectPath(ctx, cx - cw * 0.06, cy - ch * 0.46, cw * 0.12, ch * 0.92, 3);
  ctx.fill();

  // Wheels (4 corners)
  const wr = cw * 0.19, wh = wr * 1.6;
  ctx.fillStyle = '#1a1a1a';
  const wheelPositions = [
    [cx - cw * 0.54, cy - ch * 0.30],
    [cx + cw * 0.36, cy - ch * 0.30],
    [cx - cw * 0.54, cy + ch * 0.16],
    [cx + cw * 0.36, cy + ch * 0.16],
  ];
  wheelPositions.forEach(([wx, wy]) => {
    ctx.save();
    ctx.shadowBlur = 5; ctx.shadowColor = 'rgba(0,0,0,0.6)';
    roundRectPath(ctx, wx, wy, wr, wh, 3);
    ctx.fill();
    ctx.restore();
    ctx.fillStyle = '#444';
    roundRectPath(ctx, wx + wr*0.2, wy + wh*0.2, wr*0.6, wh*0.6, 2);
    ctx.fill();
    ctx.fillStyle = '#1a1a1a';
  });

  // Headlights (at top = front)
  ctx.fillStyle = 'rgba(255,245,180,0.9)';
  ctx.beginPath(); ctx.ellipse(cx - cw*0.22, cy - ch*0.47, cw*0.09, cw*0.07, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + cw*0.22, cy - ch*0.47, cw*0.09, cw*0.07, 0, 0, Math.PI*2); ctx.fill();

  // Taillights (at bottom = rear)
  ctx.fillStyle = 'rgba(255,60,60,0.85)';
  ctx.beginPath(); ctx.ellipse(cx - cw*0.22, cy + ch*0.47, cw*0.09, cw*0.06, 0, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(cx + cw*0.22, cy + ch*0.47, cw*0.09, cw*0.06, 0, 0, Math.PI*2); ctx.fill();
}

function drawResultFlash(ctx, W, H) {
  ctx.fillStyle = rState.resultCorrect
    ? 'rgba(39,174,96,0.18)'
    : 'rgba(192,57,43,0.18)';
  ctx.fillRect(0, 0, W, H);
}

function roundRectPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ============================================================
//  ANSWER HANDLING
// ============================================================
function handleRacingAnswer(isCorrect) {
  rState.resultCorrect = isCorrect;
  rState.phase = 'result';

  const q = rState.questions[rState.currentQ];

  if (isCorrect) {
    const bonus  = rState.switchedEarly ? 5 : 0;
    const points = 10 + bonus;
    rState.score        += points;
    rState.correctCount++;
    rState.bonusTotal   += bonus;
    document.getElementById('r-score').textContent = rState.score;
    showRacingFeedback(true, bonus > 0 ? `+${points} נקודות! בונוס מוקדם 🚀` : '+10 נקודות!');
    launchConfetti();
  } else {
    rState.wrongCount++;
    showRacingFeedback(false, `התשובה הנכונה: ${q.answer}`);
  }

  const delay = isCorrect ? 1800 : 2400;
  setTimeout(() => {
    rState.currentQ++;
    if (rState.currentQ >= RACING_Q_TOTAL) {
      rState.phase = 'done';
      cancelAnimationFrame(rState.animId);
      rState.animId  = null;
      endRacingGame();
    } else {
      rState.keysEnabled = true;
      loadRacingQuestion();
    }
  }, delay);
}

// ============================================================
//  RACING FEEDBACK  (reuses soccer overlay with racing text)
// ============================================================
function showRacingFeedback(isCorrect, subText) {
  const overlay = document.getElementById('feedbackOverlay');
  const word    = document.getElementById('feedbackWord');
  const sub     = document.getElementById('feedbackSub');

  overlay.className = 'feedback-overlay';
  void overlay.offsetWidth; // force reflow to restart animation

  if (isCorrect) {
    word.textContent = 'מדויק! 💨';
    word.className   = 'feedback-word goal-word';
    overlay.classList.add('show-goal');
  } else {
    word.textContent = 'נתיב שגוי! 🛑';
    word.className   = 'feedback-word save-word';
    overlay.classList.add('show-save');
  }
  sub.textContent   = subText;
  sub.style.opacity = '0';
  void sub.offsetWidth;
  sub.style.opacity = '';
}

// ============================================================
//  QUIT
// ============================================================
function quitRacingGame() {
  if (!confirm('לצאת מהמירוץ ולחזור לתפריט?')) return;
  stopRacingGame();
  showScreen('welcome');
}

// ============================================================
//  INPUT
// ============================================================
rState.keysEnabled = true;

function racingKeyHandler(e) {
  if (!rState.keysEnabled) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); racingMoveLeft(); }
  if (e.key === 'ArrowRight') { e.preventDefault(); racingMoveRight(); }
}

function racingMoveLeft() {
  if (!rState.keysEnabled) return;
  const next = Math.max(0, rState.carLaneTarget - 1);
  rState.carLaneTarget = next;
  rState.carLane       = next;
  checkEarlySwitch(next);
  flashLaneBtn('btn-left');
}

function racingMoveRight() {
  if (!rState.keysEnabled) return;
  const next = Math.min(2, rState.carLaneTarget + 1);
  rState.carLaneTarget = next;
  rState.carLane       = next;
  checkEarlySwitch(next);
  flashLaneBtn('btn-right');
}

function checkEarlySwitch(lane) {
  if (rState.switchedEarly || rState.phase !== 'scrolling') return;
  const q = rState.questions[rState.currentQ];
  if (lane === q.correctLane && rState.blockY < rState.blockEvalY * 0.40) {
    rState.switchedEarly = true;
  }
}

function flashLaneBtn(id) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.classList.add('racing-btn-active');
  setTimeout(() => btn.classList.remove('racing-btn-active'), 200);
}

function setupRacingInput() {
  document.removeEventListener('keydown', racingKeyHandler);
  document.addEventListener('keydown', racingKeyHandler);
  rState.keysEnabled = true;

  // Touch swipe on canvas
  racingCanvas.addEventListener('touchstart', e => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  racingCanvas.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 28) {
      if (dx < 0) racingMoveLeft();
      else        racingMoveRight();
    }
  }, { passive: true });
}

// ============================================================
//  END GAME
// ============================================================
function endRacingGame() {
  stopRacingGame();
  const entry = saveRacingScore();
  showRacingEndScreen(entry.isNew);
}

function showRacingEndScreen(isNewRecord) {
  const pct = Math.round((rState.correctCount / RACING_Q_TOTAL) * 100);
  let emoji = '🏎️', title = 'סיום מירוץ!';
  if      (pct === 100) { emoji = '🏆'; title = 'מושלם! 100%!'; }
  else if (pct >= 80)   { emoji = '🥇'; title = 'נהג מצטיין!'; }
  else if (pct >= 60)   { emoji = '👍'; title = 'כל הכבוד!'; }
  else if (pct >= 40)   { emoji = '💪'; title = 'אפשר להשתפר!'; }
  else                  { emoji = '😓'; title = 'תתאמן עוד קצת!'; }

  document.getElementById('r-endEmoji').textContent = emoji;
  document.getElementById('r-endTitle').textContent = title;
  document.getElementById('r-endScore').textContent = rState.score;

  document.getElementById('r-scoreBreakdown').innerHTML = `
    <div class="breakdown-item">
      <div class="breakdown-num" style="color:#39ff14">${rState.correctCount}</div>
      <div class="breakdown-label">נכון ✓</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num" style="color:var(--red-light)">${rState.wrongCount}</div>
      <div class="breakdown-label">טעות ✗</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num">${pct}%</div>
      <div class="breakdown-label">אחוז הצלחה</div>
    </div>
    <div class="breakdown-item">
      <div class="breakdown-num">${rState.bonusTotal}</div>
      <div class="breakdown-label">בונוס מוקדם</div>
    </div>
  `;

  document.getElementById('r-newRecordBanner').style.display = isNewRecord ? 'block' : 'none';
  if (pct >= 80) launchConfetti();

  showScreen('racing-end');
}

// ============================================================
//  HIGH SCORES
// ============================================================
function getRacingScores() {
  try { return JSON.parse(localStorage.getItem(RACING_LS_KEY)) || []; }
  catch { return []; }
}

function saveRacingScore() {
  const scores = getRacingScores();
  const entry  = {
    name:    rState.playerName,
    score:   rState.score,
    date:    new Date().toLocaleDateString('he-IL'),
    correct: rState.correctCount,
  };
  scores.push(entry);
  scores.sort((a, b) => b.score - a.score);
  const top10 = scores.slice(0, 10);
  localStorage.setItem(RACING_LS_KEY, JSON.stringify(top10));

  const prevBest = scores.filter(s => s.name === entry.name && s.score > entry.score);
  entry.isNew = prevBest.length === 0 &&
    top10.some(s => s.score === entry.score && s.name === entry.name);
  return entry;
}

function showRacingHighScores(from) {
  state.prevScreen    = from;
  state.highScoreMode = 'racing';
  renderRacingHighScores();
  showScreen('highscores');
}

function renderRacingHighScores() {
  const scores    = getRacingScores();
  const container = document.getElementById('highScoresContent');
  document.getElementById('hsTitle').textContent = '🏎️ שיאי מירוץ';

  // Swap buttons
  document.getElementById('hsPlayBtn').textContent  = '🏎️ שחק מירוץ!';
  document.getElementById('hsPlayBtn').onclick      = () => startRacingGame();
  document.getElementById('hsClearBtn').onclick     = clearRacingScores;

  // Hide soccer legend, show racing legend
  document.getElementById('hsSoccerLegend').style.display  = 'none';
  document.getElementById('hsRacingLegend').style.display  = '';

  if (scores.length === 0) {
    container.innerHTML = '<div class="no-scores">עדיין אין שיאים. שחק ובנה שיא! 🏎️</div>';
    return;
  }
  const medals = ['🥇', '🥈', '🥉'];
  let html = `<table class="scores-table"><thead><tr>
    <th>מקום</th><th>שם</th><th>ניקוד</th><th>נכון</th><th>תאריך</th>
  </tr></thead><tbody>`;
  scores.forEach((s, i) => {
    const cls   = i === 0 ? ' class="top-1"' : '';
    const medal = medals[i] || (i + 1);
    html += `<tr${cls}>
      <td><span class="rank-medal">${medal}</span></td>
      <td>${escHtml(s.name)}</td>
      <td><strong>${s.score}</strong></td>
      <td>${s.correct}/${RACING_Q_TOTAL}</td>
      <td>${escHtml(s.date)}</td>
    </tr>`;
  });
  html += '</tbody></table>';
  container.innerHTML = html;
}

function clearRacingScores() {
  if (confirm('האם למחוק את כל שיאי המירוץ?')) {
    localStorage.removeItem(RACING_LS_KEY);
    renderRacingHighScores();
  }
}
