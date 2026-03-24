// ============================================================
//  STATIC QUESTION BANKS
// ============================================================
const QUESTIONS = {
  5: [
    // --- FRACTIONS (10) ---
    { type:'kick', text:'½ + ¼ = ?',                   answers:['¾','⅔','1','½'],          correct:0 },
    { type:'kick', text:'¾ − ¼ = ?',                   answers:['½','¼','1','⅔'],          correct:0 },
    { type:'kick', text:'⅔ + ⅙ = ?',                   answers:['⅚','⅔','½','1'],          correct:0 },
    { type:'kick', text:'1 − ⅜ = ?',                   answers:['⅝','⅜','¾','½'],          correct:0 },
    { type:'kick', text:'¼ − ⅛ = ?',                   answers:['⅛','⅜','¾','⅝'],          correct:0 },
    { type:'kick', text:'½ + ⅓ = ?',                   answers:['⅚','⅔','¾','¼'],          correct:0 },
    { type:'kick', text:'¾ + ⅛ = ?',                   answers:['⅞','⅝','1','½'],          correct:0 },
    { type:'kick', text:'⅔ − ⅓ = ?',                   answers:['⅓','⅔','½','¼'],          correct:0 },
    { type:'kick', text:'⅝ − ⅛ = ?',                   answers:['½','¼','¾','⅜'],          correct:0 },
    { type:'kick', text:'1 − ¼ = ?',                   answers:['¾','½','⅔','⅘'],          correct:0 },
    // --- PERCENTAGES (8) ---
    { type:'kick', text:'50% מ־80 = ?',                answers:['40','50','60','30'],       correct:0 },
    { type:'kick', text:'25% מ־120 = ?',               answers:['30','25','40','35'],       correct:0 },
    { type:'kick', text:'10% מ־350 = ?',               answers:['35','30','25','40'],       correct:0 },
    { type:'kick', text:'75% מ־200 = ?',               answers:['150','175','100','125'],   correct:0 },
    { type:'kick', text:'20% מ־60 = ?',                answers:['12','15','10','18'],       correct:0 },
    { type:'kick', text:'50% מ־150 = ?',               answers:['75','70','80','50'],       correct:0 },
    { type:'kick', text:'25% מ־40 = ?',                answers:['10','8','12','15'],        correct:0 },
    { type:'kick', text:'10% מ־90 = ?',                answers:['9','8','10','11'],         correct:0 },
    // --- DECIMALS (8) ---
    { type:'kick', text:'0.4 × 5 = ?',                 answers:['2','2.5','1.5','3'],      correct:0 },
    { type:'kick', text:'1.2 × 3 = ?',                 answers:['3.6','3.2','4.2','2.6'],  correct:0 },
    { type:'kick', text:'0.6 × 0.5 = ?',               answers:['0.3','0.6','0.25','0.4'], correct:0 },
    { type:'kick', text:'0.1 × 1 = ?',                 answers:['0.1','0.3','1','0.5'],    correct:0 },
    { type:'kick', text:'0.3 × 5 = ?',                 answers:['1.5','1','2','0.8'],      correct:0 },
    { type:'kick', text:'0.8 × 4 = ?',                 answers:['3.2','2.8','4','3.6'],    correct:0 },
    { type:'kick', text:'2.5 × 2 = ?',                 answers:['5','4','4.5','6'],        correct:0 },
    { type:'kick', text:'0.7 × 6 = ?',                 answers:['4.2','3.6','4.8','5'],    correct:0 },
    // --- AREA / PERIMETER (6) ---
    { type:'open', text:'מלבן שרוחבו 6 ואורכו 9 — מה השטח?',   correct:54 },
    { type:'open', text:'מלבן שרוחבו 4 ואורכו 7 — מה ההיקף?',  correct:22 },
    { type:'kick', text:'ריבוע עם צלע 5 — מה שטחו?',            answers:['25','20','30','10'],  correct:0 },
    { type:'kick', text:'מלבן אורך 8, רוחב 5 — מה שטחו?',       answers:['40','35','45','13'],  correct:0 },
    { type:'open', text:'ריבוע עם צלע 7 — מה היקפו?',           correct:28 },
    { type:'open', text:'מלבן שרוחבו 3 ואורכו 11 — מה ההיקף?', correct:28 },
    // --- WORD PROBLEMS (12) ---
    { type:'kick', text:'הקבוצה שיחקה 20 משחקים וניצחה ב-¾ מהם. כמה ניצחונות?',    answers:['15','10','14','12'], correct:0 },
    { type:'open', text:'במגרש יש 48 שחקנים. ⅓ מהם שחקני הגנה. כמה שחקני הגנה?',  correct:16 },
    { type:'kick', text:'כרטיס עלה 80 ₪ ויש הנחה של 25%. כמה משלמים?',              answers:['60','65','55','70'], correct:0 },
    { type:'open', text:'אוהד הגיע ל-12 משחקים בחצי עונה. כמה יגיע בעונה שלמה?',  correct:24 },
    { type:'kick', text:'הפסקה אחת במשחק היא 15 דקות. כמה דקות 4 הפסקות?',         answers:['60','45','75','50'], correct:0 },
    { type:'open', text:'שחקן כיוון 5 מהלכות ל-30 שערים. כמה שערים בממוצע לכל מהלכה?', correct:6 },
    { type:'kick', text:'הקבוצה שיחקה 24 משחקים וניצחה ב-½ מהם. כמה ניצחונות?',    answers:['12','8','16','10'], correct:0 },
    { type:'open', text:'במגרש יש 36 שחקנים. ¼ מהם שחקני שער. כמה שחקני שער?',     correct:9 },
    { type:'kick', text:'כרטיס עלה 60 ₪ ויש הנחה של 50%. כמה משלמים?',              answers:['30','20','40','25'], correct:0 },
    { type:'open', text:'שחקן רץ 8 ק"מ ביום במשך 5 ימים. כמה ק"מ סה"כ?',           correct:40 },
    { type:'kick', text:'ב-90 דקות משחק חלקו שווה לשתי מחציות. כמה דקות כל מחצית?', answers:['45','40','50','30'], correct:0 },
    { type:'open', text:'קבוצה קנתה 6 כדורים ב-120 ₪ כל אחד. כמה שילמה בסך הכל?', correct:720 },
  ]
  // Grade 6 commented out — to be re-enabled later
  // ,6: [
  //   // --- COMPLEX FRACTIONS ---
  //   { type:'kick', text:'¾ ÷ ½ = ?',                   answers:['1½','¾','2','⅔'],       correct:0 },
  //   { type:'kick', text:'⅔ × ¾ = ?',                   answers:['½','⅔','¼','⅜'],        correct:0 },
  //   { type:'kick', text:'⅚ ÷ ⅓ = ?',                   answers:['2½','1⅔','3','2'],       correct:0 },
  //   { type:'open', text:'3/4 + 2/3 = ? (הקלד כמספר עשרוני; עיגול לשתי ספרות)', correct:1.42 },
  //   // --- RATIOS ---
  //   { type:'kick', text:'2:3 = 8:?',                   answers:['12','10','6','9'],       correct:0 },
  //   { type:'kick', text:'5:4 = 15:?',                  answers:['12','16','10','20'],     correct:0 },
  //   { type:'kick', text:'יחס בנים לבנות הוא 3:2. יש 30 תלמידים. כמה בנות?', answers:['12','15','10','18'], correct:0 },
  //   // --- EQUATIONS ---
  //   { type:'kick', text:'3x + 5 = 20,  x = ?',         answers:['5','3','7','4'],         correct:0 },
  //   { type:'kick', text:'2x − 4 = 10,  x = ?',         answers:['7','6','8','5'],         correct:0 },
  //   { type:'open', text:'4x + 3 = 19.  מצא x.',        correct:4 },
  //   { type:'open', text:'5x − 10 = 15. מצא x.',        correct:5 },
  //   // --- AREA (TRIANGLE, CIRCLE) ---
  //   { type:'kick', text:'משולש עם בסיס 10 וגובה 6 — שטח = ?', answers:['30','60','40','15'], correct:0 },
  //   { type:'open', text:'עיגול עם רדיוס 7 — שטח ≈ ? (π≈3.14, עיגול לשלם)', correct:154 },
  //   { type:'kick', text:'ריבוע עם אלכסון — שטח המשולש שנוצר בחצי הוא 18. מה שטח הריבוע?', answers:['36','18','72','24'], correct:0 },
  //   // --- WORD PROBLEMS ---
  //   { type:'kick', text:'כדורגלן רץ 12 ק"מ ב-60 דקות. מהירותו בק"מ/שעה?', answers:['12','10','15','8'], correct:0 },
  //   { type:'open', text:'קבוצה ניצחה 18 וקשרה 6 מתוך 30 משחקים. כמה הפסדים?', correct:6 },
  //   { type:'kick', text:"מגרש מלבני: אורך 105 מ', רוחב 68 מ'. היקף = ?", answers:['346','400','336','373'], correct:0 },
  //   { type:'open', text:'במגרש: ¾ מהשחקנים מתאמנים. אם מתאמנים 18, כמה בסך הכל?', correct:24 },
  //   { type:'kick', text:'שחקן נכון ל-40% מהבעיטות. בעט 25 פעמים. כמה נכון?', answers:['10','12','8','15'], correct:0 },
  //   { type:'open', text:"גובה הוא 1.78 מ'. מה זה בס\"מ?", correct:178 },
  // ]
};

// ============================================================
//  HELPERS
// ============================================================
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function rnd(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr)      { return arr[Math.floor(Math.random() * arr.length)]; }

function makeKick(text, correct, wrongs) {
  const correctStr = String(correct);
  const wrongStrs  = [...new Set(wrongs.map(String).filter(v => v !== correctStr && Number(v) > 0))].slice(0, 3);
  if (wrongStrs.length < 3) return null;
  const answers = shuffleArray([correctStr, ...wrongStrs]);
  return { type:'kick', text, answers, correct: answers.indexOf(correctStr) };
}

function makeOpen(text, correct) { return { type:'open', text, correct }; }

// ============================================================
//  DYNAMIC QUESTION GENERATORS
// ============================================================
function genGrade5Questions() {
  const qs = [];

  // Percentages (10 / 20 / 25 / 50 / 75 %)
  [[10,50],[10,80],[10,200],[20,50],[20,80],[20,150],[25,60],[25,80],[25,120],[25,200],
   [50,60],[50,90],[50,140],[75,80],[75,120],[75,200],[10,350],[20,300],
   [10,150],[10,400],[20,200],[20,250],[25,160],[25,240],[50,180],[50,220],
   [75,160],[75,240],[10,500],[20,400],[25,320],[50,260],[75,280],[10,700],[20,450],[25,400]
  ].forEach(([pct, num]) => {
    const ans = pct * num / 100;
    const q = makeKick(`${pct}% מ-${num} = ?`, ans, [ans+10, ans-10, ans+5, ans+15, ans*2].filter(v=>v>0));
    if (q) qs.push(q);
  });

  // Decimal × integer
  [[0.2,5],[0.3,4],[0.4,5],[0.5,6],[0.5,14],[0.6,5],[0.7,4],[0.8,5],[1.2,3],[1.5,4],
   [2.5,4],[0.3,9],[1.2,5],[0.6,8],[1.5,6],
   [0.2,8],[0.4,7],[0.5,9],[0.7,6],[0.8,7],[0.9,5],[1.1,4],[1.4,5],[2.5,6],[3.5,4],
   [0.3,7],[1.2,6],[0.6,9],[1.5,8],[2.5,8]
  ].forEach(([a,b]) => {
    const ans = Math.round(a*b*100)/100;
    const q = makeKick(`${a} × ${b} = ?`, ans, [Math.round((ans+0.5)*10)/10, Math.round((ans+1)*10)/10, Math.round((ans-0.5)*10)/10].filter(v=>v>0));
    if (q) qs.push(q);
  });

  // Rectangle area (open)
  for (let i = 0; i < 16; i++) {
    const w = rnd(3,12), h = rnd(3,12);
    qs.push(makeOpen(`מלבן: אורך ${h} ס"מ, רוחב ${w} ס"מ — מה השטח?`, w*h));
  }

  // Rectangle perimeter (open)
  for (let i = 0; i < 12; i++) {
    const w = rnd(3,12), h = rnd(3,12);
    qs.push(makeOpen(`מלבן: אורך ${h} ס"מ, רוחב ${w} ס"מ — מה ההיקף?`, 2*(w+h)));
  }

  // Square area (kick)
  for (let s = 2; s <= 21; s++) {
    const area = s*s;
    const q = makeKick(`ריבוע עם צלע ${s} — מה שטחו?`, area, [s*4, area+s, area-s+1, s*(s+2)].filter(v=>v>0&&v!==area));
    if (q) qs.push(q);
  }

  // Soccer word problems — fraction of matches won
  [[1,2,20],[1,2,16],[3,4,20],[3,4,16],[2,3,12],[2,3,18],[1,4,20],[1,3,15],[3,5,20],[2,5,15],
   [1,2,24],[1,2,18],[3,4,24],[3,4,28],[2,3,24],[2,3,30],[1,4,24],[1,3,18],[3,5,25],[2,5,20],
  ].forEach(([n,d,total]) => {
    const ans = total*n/d;
    if (!Number.isInteger(ans)) return;
    const q = makeKick(`קבוצה שיחקה ${total} משחקים וניצחה ב-${n}/${d} מהם. כמה ניצחונות?`, ans, [ans+d, ans-d, total-ans, ans+2*d].filter(v=>v>0&&v!==ans&&v<=total));
    if (q) qs.push(q);
  });

  // Multiplication word problems (players × goals)
  for (let i = 0; i < 20; i++) {
    const players = rnd(2,9), goals = rnd(2,8);
    const total = players*goals;
    const q = makeKick(`${players} שחקנים, כל אחד כבש ${goals} שערים. סה"כ שערים?`, total, [total+players, total-goals, total+goals, players+goals].filter(v=>v>0&&v!==total));
    if (q) qs.push(q);
  }

  // Division word problems
  for (let i = 0; i < 16; i++) {
    const groups = pick([2,3,4,5]), each = rnd(3,10);
    const total = groups*each;
    qs.push(makeOpen(`${total} כרטיסים מחולקים שווה בשווה ל-${groups} קבוצות. כמה לכל קבוצה?`, each));
  }

  return qs.filter(Boolean);
}

// Grade 6 generator commented out — re-enable with grade 6 support
/* function genGrade6Questions() {
  const qs = [];

  // Ratios a:b = c:?
  for (let i = 0; i < 20; i++) {
    const a = rnd(1,5), b = rnd(2,7), mult = rnd(2,5);
    const c = a*mult, ans = b*mult;
    if (c===a || ans===b) continue;
    const q = makeKick(`${a}:${b} = ${c}:?`, ans, [ans+b, ans-b, ans+a, ans+2*b].filter(v=>v>0&&v!==ans));
    if (q) qs.push(q);
  }

  // Linear equations ax+b=c
  for (let i = 0; i < 18; i++) {
    const a = rnd(2,6), x = rnd(1,9), b = rnd(1,15);
    const c = a*x + b;
    const q = makeKick(`${a}x + ${b} = ${c},  x = ?`, x, [x+1, x+2, x-1, x+3].filter(v=>v>0&&v!==x));
    if (q) qs.push(q);
  }

  // Linear equations ax-b=c
  for (let i = 0; i < 12; i++) {
    const a = rnd(2,6), x = rnd(2,9), b = rnd(1,10);
    const c = a*x - b;
    if (c <= 0) continue;
    const q = makeKick(`${a}x − ${b} = ${c},  x = ?`, x, [x+1, x-1, x+2, x-2].filter(v=>v>0&&v!==x));
    if (q) qs.push(q);
  }

  // Open equations
  for (let i = 0; i < 8; i++) {
    const a = rnd(2,5), x = rnd(1,9), b = rnd(1,12);
    const c = a*x + b;
    qs.push(makeOpen(`${a}x + ${b} = ${c}. מצא x.`, x));
  }

  // Triangle area (base always even so result is integer)
  for (let i = 0; i < 14; i++) {
    const base = rnd(2,12)*2, h = rnd(2,12);
    const area = base*h/2;
    const q = makeKick(`משולש: בסיס ${base}, גובה ${h} — שטח = ?`, area, [base*h, area+h, area+base/2, area-h].filter(v=>v>0&&v!==area));
    if (q) qs.push(q);
  }

  // Circle area π≈3.14
  for (let r = 2; r <= 10; r++) {
    const area = Math.round(3.14*r*r);
    qs.push(makeOpen(`עיגול עם רדיוס ${r} — שטח ≈ ? (π≈3.14, עיגול לשלם)`, area));
  }

  // Advanced percentages
  [[30,80],[30,120],[30,200],[40,75],[40,120],[60,150],[35,60],[15,80],[45,200],[20,350],[60,80],[70,200]].forEach(([pct,num]) => {
    const ans = pct*num/100;
    if (!Number.isInteger(ans)) return;
    const q = makeKick(`${pct}% מ-${num} = ?`, ans, [ans+num*0.1, ans-num*0.1, num-ans, ans+num*0.05].map(v=>Math.round(v)).filter(v=>v>0&&v!==ans));
    if (q) qs.push(q);
  });

  // Soccer speed/distance word problems
  [[10,60],[12,30],[8,90],[15,60],[10,90],[12,60],[6,30]].forEach(([speed,mins]) => {
    const dist = Math.round(speed*mins/60*10)/10;
    const q = makeKick(`שחקן רץ ${speed} קמ"ש במשך ${mins} דקות. כמה ק"מ רץ?`, dist, [Math.round((dist+1)*10)/10, Math.round((dist+2)*10)/10, Math.round((dist-1)*10)/10].filter(v=>v>0&&v!==dist));
    if (q) qs.push(q);
  });

  return qs.filter(Boolean);
}
// End of genGrade6Questions — commented out above
*/

// ============================================================
//  QUESTION PREPARATION  (combines static + generated, picks 10)
// ============================================================
function prepareQuestions(grade) {
  const staticRaw = QUESTIONS[grade].map(q => ({ ...q }));
  const generated = genGrade5Questions(); // only grade 5 for now
  const combined  = shuffleArray([...staticRaw, ...generated]);

  // Shuffle answer options so the correct answer isn't always at index 0
  combined.forEach(q => {
    if (q.type === 'kick') {
      const correctAns = q.answers[q.correct];
      const shuffled   = shuffleArray([...q.answers]);
      q.answers = shuffled;
      q.correct = shuffled.indexOf(correctAns);
    }
  });

  return combined.slice(0, 10);
}
