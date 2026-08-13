/* Runtime/style fix for resistor-network guided notes.
   Uses the existing global Show Answers / Hide Answers controls.
   In student mode, answer/explanation content is hidden with its original space preserved
   so the printed/on-screen boxes remain available for handwritten notes. */
const resistorGuidedSlotFix=document.createElement('style');
resistorGuidedSlotFix.textContent=String.raw`
/* Existing fill-in slots */
.resistor-guided-v1 .lesson-slot{--slot-w:24mm;display:inline-grid;place-items:center;min-width:var(--slot-w);height:1.55em;border-bottom:1.2px solid #334155;vertical-align:baseline;margin:0 .35mm}
.resistor-guided-v1 .lesson-fill{visibility:hidden;font-weight:800;color:#0f172a}
.show-answers .resistor-guided-v1 .lesson-fill{visibility:visible}

/*
  Guided-note reveal system.
  Keep headings, diagrams, borders, card heights and writing space visible.
  Hide only the teaching content that students are meant to complete/record.
*/
body:not(.show-answers) .resistor-guided-v1 .rg-th,
body:not(.show-answers) .resistor-guided-v1 .rg-en,
body:not(.show-answers) .resistor-guided-v1 .rg-note,
body:not(.show-answers) .resistor-guided-v1 .rg-step span,
body:not(.show-answers) .resistor-guided-v1 .rg-summary-cell div,
body:not(.show-answers) .resistor-guided-v1 .rg-decision-row span{
  visibility:hidden;
}

/* Keep the equation / reminder / proof boxes themselves, but blank their contents. */
body:not(.show-answers) .resistor-guided-v1 .rg-equation,
body:not(.show-answers) .resistor-guided-v1 .state-eq,
body:not(.show-answers) .resistor-guided-v1 .rg-proof-line,
body:not(.show-answers) .resistor-guided-v1 .rg-proof-final,
body:not(.show-answers) .resistor-guided-v1 .rg-callout,
body:not(.show-answers) .resistor-guided-v1 .rg-trap,
body:not(.show-answers) .resistor-guided-v1 .rg-flow span,
body:not(.show-answers) .resistor-guided-v1 .rg-formula-table td{
  color:transparent!important;
}

body:not(.show-answers) .resistor-guided-v1 .rg-memory .big,
body:not(.show-answers) .resistor-guided-v1 .rg-memory .small{
  color:transparent!important;
}

/* MathJax follows currentColor; this makes formulas disappear while their boxes keep the same size. */
body:not(.show-answers) .resistor-guided-v1 .rg-equation mjx-container,
body:not(.show-answers) .resistor-guided-v1 .state-eq mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-proof-line mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-proof-final mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-callout mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-trap mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-memory mjx-container,
body:not(.show-answers) .resistor-guided-v1 .rg-formula-table td mjx-container{
  color:transparent!important;
}

/* Teacher / answer mode */
.show-answers .resistor-guided-v1 .rg-th,
.show-answers .resistor-guided-v1 .rg-en,
.show-answers .resistor-guided-v1 .rg-note,
.show-answers .resistor-guided-v1 .rg-step span,
.show-answers .resistor-guided-v1 .rg-summary-cell div,
.show-answers .resistor-guided-v1 .rg-decision-row span{
  visibility:visible!important;
}
.show-answers .resistor-guided-v1 .rg-equation,
.show-answers .resistor-guided-v1 .state-eq,
.show-answers .resistor-guided-v1 .rg-proof-line,
.show-answers .resistor-guided-v1 .rg-proof-final,
.show-answers .resistor-guided-v1 .rg-callout,
.show-answers .resistor-guided-v1 .rg-trap,
.show-answers .resistor-guided-v1 .rg-flow span,
.show-answers .resistor-guided-v1 .rg-formula-table td,
.show-answers .resistor-guided-v1 .rg-memory .big,
.show-answers .resistor-guided-v1 .rg-memory .small,
.show-answers .resistor-guided-v1 mjx-container{
  color:inherit!important;
}

@media print{
  /* Print with Answers = fill the same reserved spaces. */
  body.print-answers .resistor-guided-v1 .lesson-fill{visibility:visible!important}
  body.print-answers .resistor-guided-v1 .rg-th,
  body.print-answers .resistor-guided-v1 .rg-en,
  body.print-answers .resistor-guided-v1 .rg-note,
  body.print-answers .resistor-guided-v1 .rg-step span,
  body.print-answers .resistor-guided-v1 .rg-summary-cell div,
  body.print-answers .resistor-guided-v1 .rg-decision-row span{visibility:visible!important}
  body.print-answers .resistor-guided-v1 .rg-equation,
  body.print-answers .resistor-guided-v1 .state-eq,
  body.print-answers .resistor-guided-v1 .rg-proof-line,
  body.print-answers .resistor-guided-v1 .rg-proof-final,
  body.print-answers .resistor-guided-v1 .rg-callout,
  body.print-answers .resistor-guided-v1 .rg-trap,
  body.print-answers .resistor-guided-v1 .rg-flow span,
  body.print-answers .resistor-guided-v1 .rg-formula-table td,
  body.print-answers .resistor-guided-v1 .rg-memory .big,
  body.print-answers .resistor-guided-v1 .rg-memory .small,
  body.print-answers .resistor-guided-v1 mjx-container{color:inherit!important}

  /* Print Questions = keep every box/height, but leave the teaching content blank for notes. */
  body.print-questions .resistor-guided-v1 .lesson-fill{visibility:hidden!important}
  body.print-questions .resistor-guided-v1 .rg-th,
  body.print-questions .resistor-guided-v1 .rg-en,
  body.print-questions .resistor-guided-v1 .rg-note,
  body.print-questions .resistor-guided-v1 .rg-step span,
  body.print-questions .resistor-guided-v1 .rg-summary-cell div,
  body.print-questions .resistor-guided-v1 .rg-decision-row span{visibility:hidden!important}
  body.print-questions .resistor-guided-v1 .rg-equation,
  body.print-questions .resistor-guided-v1 .state-eq,
  body.print-questions .resistor-guided-v1 .rg-proof-line,
  body.print-questions .resistor-guided-v1 .rg-proof-final,
  body.print-questions .resistor-guided-v1 .rg-callout,
  body.print-questions .resistor-guided-v1 .rg-trap,
  body.print-questions .resistor-guided-v1 .rg-flow span,
  body.print-questions .resistor-guided-v1 .rg-formula-table td,
  body.print-questions .resistor-guided-v1 .rg-memory .big,
  body.print-questions .resistor-guided-v1 .rg-memory .small,
  body.print-questions .resistor-guided-v1 mjx-container{color:transparent!important}
}
`;
document.head.appendChild(resistorGuidedSlotFix);
