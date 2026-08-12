/* Runtime/style fix for resistor-network guided-note answer slots.
   The shared lessonSlot()/slotMath() helper comes from the energy guided notes,
   but its original CSS is scoped to .energy-power-v2. */
const resistorGuidedSlotFix=document.createElement('style');
resistorGuidedSlotFix.textContent=String.raw`
.resistor-guided-v1 .lesson-slot{--slot-w:24mm;display:inline-grid;place-items:center;min-width:var(--slot-w);height:1.55em;border-bottom:1.2px solid #334155;vertical-align:baseline;margin:0 .35mm}
.resistor-guided-v1 .lesson-fill{visibility:hidden;font-weight:800;color:#0f172a}
.show-answers .resistor-guided-v1 .lesson-fill{visibility:visible}
@media print{
 body.print-answers .resistor-guided-v1 .lesson-fill{visibility:visible!important}
 body.print-questions .resistor-guided-v1 .lesson-fill{visibility:hidden!important}
}
`;
document.head.appendChild(resistorGuidedSlotFix);
