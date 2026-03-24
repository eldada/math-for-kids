# כדורגל מתמטי ⚽ — Math for Kids

A Hebrew-language browser game for 5th–6th grade students that turns math practice into a soccer penalty-kick experience.

## Demo

Open `index.html` directly in any modern browser — no build step, no server required.

## How to play

1. Enter your name on the welcome screen.
2. Each round has **10 questions** drawn randomly from the question bank.
3. Two question types:
   - **Kick (בעיטה לשער)** — choose the correct answer by clicking one of the four goal zones; the ball flies to your chosen zone.
   - **Open answer (תשובה חופשית)** — type the answer and press Enter or click Send.
4. You have **30 seconds** per question.

## Scoring

| Event | Points |
|---|---|
| Correct answer | +10 |
| Speed bonus — ≥ 25 s remaining | +5 |
| Speed bonus — ≥ 18 s remaining | +3 |
| Speed bonus — ≥ 10 s remaining | +1 |
| **Max per question** | **15** |
| **Max total (10 questions)** | **150** |

High scores are saved in `localStorage` (top 10 per browser).

## Topics covered (Grade 5)

- Fractions (addition & subtraction)
- Percentages
- Decimal multiplication
- Area & perimeter
- Word problems (Hebrew)

## Project structure

```
index.html      — single-page app shell
style.css       — all styles (no framework)
app.js          — game logic, animation, scoring, high scores
questions.js    — static question bank
favicon.svg     — soccer ball favicon
```

## Technical notes

- Pure HTML / CSS / JavaScript — zero dependencies.
- Ball animation uses the **Web Animations API** (`element.animate()`).
- `backdrop-filter` on the card creates a containing block for positioned elements; the ball animation uses `position:absolute` relative to `#goalKickSection` to avoid this.
- RTL layout (`dir="rtl"`) with per-element LTR override for math expressions.
- High scores stored in `localStorage` under the key `mathKidsHighScores_v2`.

## License

MIT
