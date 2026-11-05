# Y10 / M.3 Cambridge IGCSE Physics 0625: Electricity Revision Studio

A standalone two-pane bilingual (TH/EN) examination revision resource for the Cambridge IGCSE Physics 0625 syllabus for examinations in **2026–2028**, sections **4.2 Electrical Quantities** and **4.3 Electric Circuits**.

## Open

On GitHub Pages after merge/deployment:
https://nixcentury.github.io/Physic-subject/Y10-IGCSE/electricity-revision.html

## School Term 2 assessment alignment (November 2026)

The revision page now starts in **School Quiz 1 · Electrical Quantities** mode. This selection is based on the school Term 2 timetable provided by the teacher, not on access to the exact Quiz 1 paper.

- **School Quiz 1: 20 questions in 7 focused missions.** Weeks 1–2: resistance R = V/I and circuit measurements (ammeter series, voltmeter parallel), I–V characteristics for ohmic resistors, filament lamps and diodes, and electrical power/energy. The published school timetable labels Quiz 1 *Electrical Quantities*. Although series/parallel begins in Week 2, the quiz itself does not explicitly say that series/parallel is assessed, so it is not part of the default focused quiz mode.
- **Week 3: 22 questions in 6 missions.** Series/parallel circuits, current/p.d., combined resistance, plus **Planning an Experiment: Resistance vs Wire Length**: variables, suitable measurement range, controlled conditions, apparatus, repeated measurements, plots, hazards and precautions.
- **Full Cambridge: 56 questions in 13 missions.** Retains the complete previous Core/Supplement curriculum and the new experimental planning extension. The Core/Extended selector is shown only in this mode.
- The school-taught diode I–V graph questions and parallel-resistance calculations remain visible in their respective school modes even though parts are classified as Cambridge Supplement.
- All three modes preserve bilingual continuous reference articles, a closely related worked example for every question, on-submit solutions, calculator, scratchpad and exit flashcards.
- Stored answers are separated in the new local progress namespace (v5) because option positions have changed with added questions; no previously saved data is deleted.

## Features

- 13 topic missions covering 4.2.1–4.2.5, 4.3.1–4.3.3, plus a practical planning skills mission
- 56 original questions, individually Core/Supplement tier-labelled, with scoped school-assessment sets
- Cambridge-inspired short answer, single-answer MCQ, numeric and tap/drag questions
- Each of the 13 missions has a **continuous, bilingual textbook-style revision article**, rather than a checklist or question-by-question notes. Its explanation covers the concepts, methods, units, diagrams and examples needed for all questions in that mission.
- Every one of the 56 questions also has a **different fully worked similar example**, with a contextual solving method, in the same reading pane. Buttons jump between the full article and the active question’s example.
- Immediate bilingual feedback with reasoning and model solutions
- Responsive layout for iPad, stylus drawing scratchpad, arithmetic calculator and six recall flashcards per mission
- 26 independently drawn SVG circuit-symbol examples and multiple circuit/graph diagrams
- Local browser progress saving; no login, tracking or server-side student data
- School Quiz 1 is the default; the full Cambridge mode retains optional Core-only and Supplement levels

This resource is independent and is **not affiliated with or endorsed by Cambridge International**. None of the questions are reproduced from Cambridge past papers.

## Files
- `electricity-revision.html`: semantic page structure, bilingual and level controls
- `electricity-revision.css`: responsive dual-panel layout, diagrams, iPad styling
- `electricity-revision.js`: original question bank, answer key, continuous mission articles (40 Core + 14 Supplement paragraphs), 56 analogous worked examples, explanations, SVGs, localStorage, scratchpad and flashcards

## QA record

- Revised school-mode counts: Quiz 1 = 20 questions / 7 missions; Week 3 = 22 / 6; Full Cambridge = 56 / 13 (with Core/Supplement filtering).
- Checked additional wire-planning questions have bilingual guidance, model solutions and analogous examples.
- Mode-specific articles and circuit symbol atlases hide off-topic material in the focused school quiz mode.



- Confirmed that **all 56 question IDs** are unique, each has a syllabus tier, answer key, English prompt/solution and Thai prompt/solution, and every MCQ/drag item has four options.
- Verified **13 complete TH/EN prose articles** covering all 56 question targets, with 40 Core and 14 additional Supplement paragraphs. Core-only mode omits Supplement paragraphs.
- Verified all 56 questions retain their own solving guidance and analogous worked examples, separate from the article; the article stays unchanged when advancing through questions in the same mission.
- JavaScript parser check passed; **285 simulated render scenarios** (earlier release baseline) across 3 language settings, 3 syllabus levels and all missions/questions passed. In addition, **46 on-submit solution checks** (earlier release baseline) and **570 article/example jump interactions** passed in the mocked DOM.
- Checked syllabus scope and Supplement labels against the Cambridge 0625 (2026–2028) syllabus, subject content pp. 28–31 and electrical-symbol list p. 49.
- Live manual desktop/iPad browser testing remains recommended after publication, especially touch drag/drop, drawing and screen layout. A mock DOM is not a substitute for a full browser.

Source syllabus: https://www.cambridgeinternational.org/Images/697209-2026-2028-syllabus.pdf
