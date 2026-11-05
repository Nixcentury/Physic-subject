# Y10 / M.3 Cambridge IGCSE Physics 0625: Electricity Revision Studio

A standalone two-pane bilingual (TH/EN) examination revision resource for the Cambridge IGCSE Physics 0625 syllabus for examinations in **2026–2028**, sections **4.2 Electrical Quantities** and **4.3 Electric Circuits**.

## Open

On GitHub Pages after merge/deployment:
https://nixcentury.github.io/Physic-subject/Y10-IGCSE/electricity-revision.html

## Features

- 12 topic missions covering 4.2.1–4.2.5 and 4.3.1–4.3.3
- 46 original questions: 33 Core and 13 Supplement, individually tier-labelled
- Cambridge-inspired short answer, single-answer MCQ, numeric and tap/drag questions
- Each of the 12 missions has a **continuous, bilingual textbook-style revision article**, rather than a checklist or question-by-question notes. Its explanation covers the concepts, methods, units, diagrams and examples needed for all questions in that mission.
- Every one of the 46 questions also has a **different fully worked similar example**, with a contextual solving method, in the same reading pane. Buttons jump between the full article and the active question’s example.
- Immediate bilingual feedback with reasoning and model solutions
- Responsive layout for iPad, stylus drawing scratchpad, arithmetic calculator and six recall flashcards per mission
- 26 independently drawn SVG circuit-symbol examples and multiple circuit/graph diagrams
- Local browser progress saving; no login, tracking or server-side student data
- Core-only mode is the default; Supplement is optional and deliberately separate

This resource is independent and is **not affiliated with or endorsed by Cambridge International**. None of the questions are reproduced from Cambridge past papers.

## Files
- `electricity-revision.html`: semantic page structure, bilingual and level controls
- `electricity-revision.css`: responsive dual-panel layout, diagrams, iPad styling
- `electricity-revision.js`: original question bank, answer key, continuous mission articles (35 Core + 14 Supplement paragraphs), 46 analogous worked examples, explanations, SVGs, localStorage, scratchpad and flashcards

## QA record

- Confirmed that **all 46 question IDs** are unique, each has a syllabus tier, answer key, English prompt/solution and Thai prompt/solution, and every MCQ/drag item has four options.
- Verified **12 complete TH/EN prose articles** covering all 46 question targets, with 35 Core and 14 additional Supplement paragraphs. Core-only mode omits Supplement paragraphs.
- Verified all 46 questions retain their own solving guidance and analogous worked examples, separate from the article; the article stays unchanged when advancing through questions in the same mission.
- JavaScript parser check passed; **285 simulated render scenarios** across 3 language settings, 3 syllabus levels and all missions/questions passed. In addition, **46 on-submit solution checks** and **570 article/example jump interactions** passed in the mocked DOM.
- Checked syllabus scope and Supplement labels against the Cambridge 0625 (2026–2028) syllabus, subject content pp. 28–31 and electrical-symbol list p. 49.
- Live manual desktop/iPad browser testing remains recommended after publication, especially touch drag/drop, drawing and screen layout. A mock DOM is not a substitute for a full browser.

Source syllabus: https://www.cambridgeinternational.org/Images/697209-2026-2028-syllabus.pdf
