# 🐞 CTFL Quest

A visual, gamified study app for the **ISTQB® Certified Tester Foundation Level (CTFL) v4.0.1** exam.
Built with React + TypeScript + Vite. No backend: progress is saved in your browser.

## Run it

```bash
npm install
npm run dev        # opens http://localhost:5173
```

Other scripts: `npm run build` (type-check + production build), `npm run preview`, `npm run typecheck`.

## What's inside

| Area | What it does |
|---|---|
| 🏠 **Home** | Metro-line journey through the 6 chapters, predicted exam score, weak spots, due flashcards |
| 📖 **Learn** | Interactive "scenes" for every learning objective — EP/BVA playgrounds, decision-table builder, state-transition explorer, statement/branch coverage lab, estimation calculators, risk matrix, testing quadrants… Each has a story, a memory hook, an exam trap and a recall check. **Recall mode** blurs details so you must remember them first |
| 🧠 **Mind Map** | The whole syllabus on one screen; bubble size = exam weight |
| 🎯 **Practice** | All official ISTQB questions: Sample Exams **A, B, C, D** (40 each) + the additional questions of set A, with official explanations. Daily 10, weak spots, per-LO drills, combos & XP |
| 🎓 **Mock Exam** | 40 questions, 60 min (+25% non-native option), pass at 26/40 (65%). Randomized with the real chapter distribution (8·6·4·11·9·2) or any official set in order |
| 🃏 **Flashcards** | Every syllabus keyword + key lists, with Leitner spaced repetition |
| 🕹️ **Arcade** | Drag-and-drop sorting and sequencing games |
| 🏆 **Trophies** | 12 levels (Bug Spotter → Foundation Legend), badges, streaks, daily goal, export/import progress |

### Why it's built this way (learning science)
- **Retrieval practice** and **spaced repetition** have the strongest evidence → recall checks, recall mode, flashcards, weak-spot re-drills.
- **Visuals help most when paired with active recall** → every diagram is interactive and followed by a check.
- **Interleaving** → Daily 10 and mock exams mix chapters like the real exam.
- **Gamification**: streaks drive habit; XP is earned for *correct* answers, not time spent.

## Keyboard shortcuts
- Practice: `A`–`E` / `1`–`5` select, `Enter` submit / next
- Lessons: `←` `→` change scene
- Flashcards: `Space` flip, `1`–`4` grade

## Content sources
Syllabus content and sample questions come from the ISTQB® CTFL v4.0.1 syllabus and Sample Exams A–D (in `docs/`), © ISTQB®, used for personal, non-commercial study. Lessons, mnemonics and diagrams are original.

## Publish on GitHub Pages

Deployment is automated by [.github/workflows/deploy.yml](.github/workflows/deploy.yml): every push to `main` type-checks, builds, and publishes `dist/` to GitHub Pages.

One-time setup:
1. Push this repo to GitHub (branch `main`).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Push (or run the workflow manually from the **Actions** tab). The site appears at `https://<your-user>.github.io/foundation-study/`.

Notes:
- `vite.config.ts` uses `base: './'`, so the build works under any repo name; the app uses hash routes (`#/learn/...`), so deep links work on Pages without extra config.
- Run `npm install` once while online and commit `package-lock.json` — the workflow then uses `npm ci` for reproducible builds.
- Progress is stored in each visitor's browser (localStorage); nothing is sent to a server.
