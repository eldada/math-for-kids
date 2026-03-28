# מתמטיקה בשביל כיפון ⚽🏎️ — Math for Kids

A Hebrew-language browser game for 5th–6th grade students. Choose between two game modes: a soccer penalty-kick game or a math racing game.

## Demo

Open `index.html` directly in any modern browser — no build step, no server required.

---

## Game modes

### ⚽ Soccer (כדורגל מתמטי)

Math questions for Grade 5: fractions, percentages, decimals, area & perimeter, word problems.

1. Enter your name and pick **Soccer** from the mode select screen.
2. Each round has **10 questions** drawn randomly from the question bank.
3. Two question types:
   - **Kick (בעיטה לשער)** — choose the correct answer by clicking one of the four goal zones; the ball flies to your chosen zone.
   - **Open answer (תשובה חופשית)** — type the answer and press Enter or click Send.
4. You have **30 seconds** per question.

**Scoring**

| Event | Points |
|---|---|
| Correct answer | +10 |
| Speed bonus — ≥ 25 s remaining | +5 |
| Speed bonus — ≥ 18 s remaining | +3 |
| Speed bonus — ≥ 10 s remaining | +1 |
| **Max per question** | **15** |
| **Max total (10 questions)** | **150** |

---

### 🏎️ Racing (מירוץ מתמטי)

Fast-paced arithmetic: addition, subtraction, multiplication, and division with whole numbers up to 10.

1. Enter your name and pick **Racing** from the mode select screen.
2. Each round has **10 questions**.
3. Three answer blocks scroll down from the top of the road — one per lane.
4. Steer your car into the lane with the correct answer before the blocks reach you:
   - **Arrow keys** (← →) on desktop
   - **On-screen buttons** or **swipe left/right** on mobile
5. Speed increases with each question.

**Scoring**

| Event | Points |
|---|---|
| Correct answer | +10 |
| Early switch bonus — correct lane before 40% travel | +5 |
| **Max per question** | **15** |
| **Max total (10 questions)** | **150** |

---

## High scores

Each game mode has its own top-10 leaderboard saved in `localStorage`:

| Mode | Key |
|---|---|
| Soccer | `mathKidsHighScores_v2` |
| Racing | `mathKidsRacingScores_v1` |

---

## Project structure

```
index.html      — single-page app shell (welcome, mode select, soccer, racing, end screens)
style.css       — all styles (no framework)
app.js          — soccer game logic, animation, scoring, high scores, screen management
racing.js       — racing game engine (canvas rendering, input, scoring, high scores)
questions.js    — static question bank + dynamic question generators (soccer)
favicon.svg     — soccer ball favicon
```

## Technical notes

- Pure HTML / CSS / JavaScript — zero dependencies.
- **Soccer**: ball animation uses the **Web Animations API** (`element.animate()`). `backdrop-filter` on the card creates a containing block for positioned elements; the ball animation uses `position:absolute` relative to `#goalKickSection` to avoid this.
- **Racing**: rendered with **HTML5 Canvas** (`requestAnimationFrame` game loop). Road scroll is achieved by animating a `lineDashOffset` on the lane dividers. The car smoothly interpolates toward the target lane each frame.
- RTL layout (`dir="rtl"`) with per-element LTR override for math expressions.
- Both modes share the global `showScreen()`, `showFeedback()`, and `launchConfetti()` helpers from `app.js`.

## License

MIT
