# Y10 / M.3 Cambridge IGCSE Physics 0625: Electricity Revision Studio

A standalone two-pane bilingual (TH/EN) examination revision resource for the Cambridge IGCSE Physics 0625 syllabus for examinations in **2026–2028**, sections **4.2 Electrical Quantities** and **4.3 Electric Circuits**.

## Open

On GitHub Pages after merge/deployment:
https://nixcentury.github.io/Physic-subject/Y10-IGCSE/electricity-revision.html

## Features

- 12 topic missions covering 4.2.1–4.2.5 and 4.3.1–4.3.3
- 46 original questions: 33 Core and 13 Supplement, individually tier-labelled
- Cambridge-inspired short answer, single-answer MCQ, numeric and tap/drag questions
- Every question has **its own specific bilingual reference guide** and a different fully worked *similar* example, shown in the parallel reading pane
- Immediate bilingual feedback with reasoning and model solutions
- Responsive layout for iPad, stylus drawing scratchpad, arithmetic calculator and six recall flashcards per mission
- 26 independently drawn SVG circuit-symbol examples and multiple circuit/graph diagrams
- Local browser progress saving; no login, tracking or server-side student data
- Core-only mode is the default; Supplement is optional and deliberately separate

This resource is independent and is **not affiliated with or endorsed by Cambridge International**. None of the questions are reproduced from Cambridge past papers.

## Files
- `electricity-revision.html`: semantic page structure, bilingual and level controls
- `electricity-revision.css`: responsive dual-panel layout, diagrams, iPad styling
- `electricity-revision.js`: original question bank, answer key, explanations, SVGs, paired reading guides, localStorage, scratchpad and flashcards

## QA record

- Confirmed that **all 46 question IDs** are unique, each has a syllabus tier, answer key, English prompt/solution and Thai prompt/solution, and every MCQ/drag item has four options.
- Confirmed all 46 questions have distinct, relevant question-specific reading guidance and analogous worked examples.
- JavaScript parser check passed, and **95 mocked runtime render scenarios** spanning all missions, modes and questions passed.
- Checked syllabus scope and Supplement labels against the Cambridge 0625 (2026–2028) syllabus, subject content pp. 28–31 and electrical-symbol list p. 49.
- Live manual desktop/iPad browser testing remains recommended after publication, especially touch drag/drop, drawing and screen layout. A mock DOM is not a substitute for a full browser.

Source syllabus: https://www.cambridgeinternational.org/Images/697209-2026-2028-syllabus.pdf
