/* Guided Notes: Resistor Networks / การต่อตัวต้านทาน
   Nine spacious A4 lesson pages before Q36-Q72.
   Concept flow: measure -> remember -> reduce -> special networks.
   Uses the existing lessonSlot()/slotMath() helpers from energy-power guided notes. */
const resistorGuidedStyle=document.createElement('style');
resistorGuidedStyle.textContent=String.raw`
.lesson-guided.resistor-guided-v1{grid-template-rows:auto minmax(0,1fr) auto}
.resistor-guided-v1 .rg-body{min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:2.6mm}
.resistor-guided-v1 .rg-hero{border-bottom:2px solid var(--navy);padding:1mm 0 2.2mm}
.resistor-guided-v1 .rg-kicker{font-size:8.5px;font-weight:800;letter-spacing:.05em;color:#64748b;text-transform:uppercase}
.resistor-guided-v1 .rg-title{font-size:18px;line-height:1.15;font-weight:800;color:var(--navy);margin-top:.7mm}
.resistor-guided-v1 .rg-sub{font-size:9px;line-height:1.35;color:#475569;margin-top:.6mm}
.resistor-guided-v1 .rg-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:2.7mm;min-height:0}
.resistor-guided-v1 .rg-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2mm}
.resistor-guided-v1 .rg-card{border:1px solid #cbd5e1;background:#fff;padding:2.8mm;min-width:0}
.resistor-guided-v1 .rg-card.soft{background:#f8fafc}
.resistor-guided-v1 .rg-card.key{border:1.5px solid var(--navy)}
.resistor-guided-v1 .rg-card-title{font-size:10.8px;font-weight:800;color:var(--navy);margin-bottom:1.2mm}
.resistor-guided-v1 .rg-th{font-size:10.2px;line-height:1.43;font-weight:550}
.resistor-guided-v1 .rg-en{font-size:8.7px;line-height:1.34;color:#475569;margin-top:.6mm}
.resistor-guided-v1 .rg-note{font-size:8.3px;line-height:1.35;color:#64748b}
.resistor-guided-v1 .rg-visual{border:1px solid #cbd5e1;background:#fff;padding:2mm;display:grid;place-items:center;min-height:52mm}
.resistor-guided-v1 .rg-visual svg{width:100%;height:auto;max-height:58mm;display:block}
.resistor-guided-v1 .rg-equation{display:flex;align-items:center;justify-content:center;gap:1.2mm;flex-wrap:wrap;min-height:11mm;padding:1.7mm 2mm;border:1px solid #cbd5e1;background:#f8fafc;font-size:11.5px;font-weight:750}
.resistor-guided-v1 .rg-equation.key{border:1.5px solid var(--navy);background:#fff;font-size:13px}
.resistor-guided-v1 .rg-memory{border:2px solid var(--navy);padding:3.2mm;background:#fff;text-align:center}
.resistor-guided-v1 .rg-memory .big{font-size:19px;line-height:1.25;font-weight:900;color:var(--navy)}
.resistor-guided-v1 .rg-memory .small{font-size:9px;color:#475569;margin-top:1mm}
.resistor-guided-v1 .rg-derive{display:grid;gap:1.3mm}
.resistor-guided-v1 .rg-step{border-left:3px solid #94a3b8;background:#f8fafc;padding:1.8mm 2.4mm}
.resistor-guided-v1 .rg-step b{display:block;color:var(--navy);font-size:9.8px;margin-bottom:.5mm}
.resistor-guided-v1 .rg-step span{font-size:9.2px;line-height:1.35}
.resistor-guided-v1 .rg-formula-table{width:100%;border-collapse:collapse;font-size:9.2px}
.resistor-guided-v1 .rg-formula-table th,.resistor-guided-v1 .rg-formula-table td{border-bottom:1px solid #cbd5e1;padding:1.7mm 2mm;vertical-align:top}
.resistor-guided-v1 .rg-formula-table th{background:#f8fafc;color:var(--navy);font-weight:800}
.resistor-guided-v1 .rg-callout{border:1.5px solid var(--navy);background:#eef2f7;padding:2.4mm;font-size:9.5px;line-height:1.4}
.resistor-guided-v1 .rg-trap{border-left:4px solid #64748b;background:#f8fafc;padding:2.2mm 2.5mm;font-size:9.3px;line-height:1.4}
.resistor-guided-v1 .rg-flow{display:flex;align-items:center;justify-content:center;gap:1.4mm;flex-wrap:wrap;font-size:10px;font-weight:800}
.resistor-guided-v1 .rg-flow span{border:1px solid #cbd5e1;background:#fff;padding:1.6mm 2.2mm}
.resistor-guided-v1 .rg-flow i{font-style:normal;color:#64748b}
.resistor-guided-v1 .rg-summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.4mm}
.resistor-guided-v1 .rg-summary-cell{border:1px solid #cbd5e1;background:#fff;padding:2.4mm}
.resistor-guided-v1 .rg-summary-cell b{display:block;color:var(--navy);font-size:10px;margin-bottom:.8mm}
.resistor-guided-v1 .rg-summary-cell div{font-size:9.3px;line-height:1.38}
.resistor-guided-v1 .rg-decision{display:grid;gap:1.7mm}
.resistor-guided-v1 .rg-decision-row{display:grid;grid-template-columns:42mm 10mm 1fr;gap:1.5mm;align-items:center;border-bottom:1px dotted #cbd5e1;padding:1.2mm 0}
.resistor-guided-v1 .rg-decision-row b{font-size:9.5px;color:var(--navy)}
.resistor-guided-v1 .rg-decision-row span{font-size:9px}
.resistor-guided-v1 .rg-decision-row .arr{text-align:center;font-weight:900;color:#64748b}
@media(max-width:720px){
 .resistor-guided-v1 .rg-grid-2,.resistor-guided-v1 .rg-grid-3,.resistor-guided-v1 .rg-summary-grid{grid-template-columns:1fr}
 .resistor-guided-v1 .rg-decision-row{grid-template-columns:1fr}
 .resistor-guided-v1 .rg-decision-row .arr{transform:rotate(90deg)}
 .lesson-guided.resistor-guided-v1{height:auto!important}
 .resistor-guided-v1 .rg-body{overflow:visible}
}
@media print{
 body.print-answers .resistor-guided-v1 .lesson-fill{visibility:visible!important}
 body.print-questions .resistor-guided-v1 .lesson-fill{visibility:hidden!important}
 .resistor-guided-v1 .rg-body{overflow:hidden!important}
}
`;
document.head.appendChild(resistorGuidedStyle);

const rgPage=(n,title,sub,body)=>String.raw`
<section class="sheet lesson-sheet lesson-guided resistor-guided-v1" id="lesson-resistor-networks-${n}" data-topic="resistor-networks" aria-label="${title}">
 <div class="topline"><div class="topic">การต่อตัวต้านทาน / Resistor Networks</div><div class="qno">Guided Notes ${n}/9</div></div>
 <div class="rg-body">
  <div class="rg-hero"><div class="rg-kicker">RESISTOR NETWORKS • CONCEPT ${n}</div><div class="rg-title">${title}</div><div class="rg-sub">${sub}</div></div>
  ${body}
 </div>
 <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Resistor Networks • ${n}/9</span></div>
</section>`;

const seriesMeterSvg=String.raw`<svg viewBox="0 0 720 290" role="img" aria-label="Three resistors in series with ammeters at several positions">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<line x1="80" y1="70" x2="155" y2="70"/><circle cx="190" cy="70" r="30"/><line x1="220" y1="70" x2="270" y2="70"/>
<rect x="270" y="45" width="90" height="50" rx="4"/><line x1="360" y1="70" x2="390" y2="70"/><circle cx="425" cy="70" r="30"/><line x1="455" y1="70" x2="485" y2="70"/>
<rect x="485" y="45" width="90" height="50" rx="4"/><line x1="575" y1="70" x2="610" y2="70"/><circle cx="645" cy="70" r="30"/>
<line x1="675" y1="70" x2="690" y2="70"/><line x1="690" y1="70" x2="690" y2="230"/><line x1="690" y1="230" x2="455" y2="230"/>
<rect x="365" y="205" width="90" height="50" rx="4"/><line x1="365" y1="230" x2="255" y2="230"/><circle cx="220" cy="230" r="30"/><line x1="190" y1="230" x2="80" y2="230"/><line x1="80" y1="230" x2="80" y2="168"/>
<line x1="80" y1="132" x2="80" y2="70"/><line x1="58" y1="132" x2="102" y2="132"/><line x1="68" y1="168" x2="92" y2="168"/>
</g>
<g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="190" y="77" text-anchor="middle" font-size="19">A₁</text><text x="425" y="77" text-anchor="middle" font-size="19">A₂</text><text x="645" y="77" text-anchor="middle" font-size="19">A₃</text><text x="220" y="237" text-anchor="middle" font-size="18">Aₜ</text><text x="315" y="77" text-anchor="middle" font-size="17">R₁</text><text x="530" y="77" text-anchor="middle" font-size="17">R₂</text><text x="410" y="237" text-anchor="middle" font-size="17">R₃</text></g>
<g fill="#475569" font-family="Arial,sans-serif" font-size="15"><text x="355" y="285" text-anchor="middle">one path • no junction / ทางเดินเดียว ไม่มีจุดแยก</text></g></svg>`;

const seriesVoltSvg=String.raw`<svg viewBox="0 0 720 330" role="img" aria-label="Three series resistors with voltmeters across each resistor and across the whole bank">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<line x1="70" y1="100" x2="130" y2="100"/><rect x="130" y="75" width="110" height="50" rx="4"/><line x1="240" y1="100" x2="305" y2="100"/><rect x="305" y="75" width="110" height="50" rx="4"/><line x1="415" y1="100" x2="480" y2="100"/><rect x="480" y="75" width="110" height="50" rx="4"/><line x1="590" y1="100" x2="650" y2="100"/>
<line x1="70" y1="100" x2="70" y2="285"/><line x1="650" y1="100" x2="650" y2="285"/><line x1="70" y1="285" x2="330" y2="285"/><line x1="390" y1="285" x2="650" y2="285"/><circle cx="360" cy="285" r="30"/>
<line x1="130" y1="100" x2="130" y2="175"/><line x1="240" y1="100" x2="240" y2="175"/><line x1="130" y1="175" x2="160" y2="175"/><line x1="210" y1="175" x2="240" y2="175"/><circle cx="185" cy="175" r="25"/>
<line x1="305" y1="100" x2="305" y2="175"/><line x1="415" y1="100" x2="415" y2="175"/><line x1="305" y1="175" x2="335" y2="175"/><line x1="385" y1="175" x2="415" y2="175"/><circle cx="360" cy="175" r="25"/>
<line x1="480" y1="100" x2="480" y2="175"/><line x1="590" y1="100" x2="590" y2="175"/><line x1="480" y1="175" x2="510" y2="175"/><line x1="560" y1="175" x2="590" y2="175"/><circle cx="535" cy="175" r="25"/>
</g>
<g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="185" y="107" text-anchor="middle" font-size="17">R₁</text><text x="360" y="107" text-anchor="middle" font-size="17">R₂</text><text x="535" y="107" text-anchor="middle" font-size="17">R₃</text><text x="185" y="181" text-anchor="middle" font-size="17">V₁</text><text x="360" y="181" text-anchor="middle" font-size="17">V₂</text><text x="535" y="181" text-anchor="middle" font-size="17">V₃</text><text x="360" y="292" text-anchor="middle" font-size="17">Vₜ</text></g></svg>`;

const parallelVoltSvg=String.raw`<svg viewBox="0 0 720 330" role="img" aria-label="Three parallel resistors with voltmeters across the branches and the supply">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<line x1="90" y1="55" x2="630" y2="55"/><line x1="90" y1="270" x2="630" y2="270"/>
<line x1="180" y1="55" x2="180" y2="105"/><rect x="150" y="105" width="60" height="80" rx="4"/><line x1="180" y1="185" x2="180" y2="270"/>
<line x1="360" y1="55" x2="360" y2="105"/><rect x="330" y="105" width="60" height="80" rx="4"/><line x1="360" y1="185" x2="360" y2="270"/>
<line x1="540" y1="55" x2="540" y2="105"/><rect x="510" y="105" width="60" height="80" rx="4"/><line x1="540" y1="185" x2="540" y2="270"/>
<line x1="130" y1="55" x2="130" y2="135"/><circle cx="130" cy="160" r="25"/><line x1="130" y1="185" x2="130" y2="270"/>
<line x1="310" y1="55" x2="310" y2="135"/><circle cx="310" cy="160" r="25"/><line x1="310" y1="185" x2="310" y2="270"/>
<line x1="490" y1="55" x2="490" y2="135"/><circle cx="490" cy="160" r="25"/><line x1="490" y1="185" x2="490" y2="270"/>
<line x1="630" y1="55" x2="680" y2="55"/><line x1="680" y1="55" x2="680" y2="135"/><circle cx="680" cy="160" r="25"/><line x1="680" y1="185" x2="680" y2="270"/><line x1="680" y1="270" x2="630" y2="270"/>
</g>
<g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="180" y="151" text-anchor="middle" font-size="16">R₁</text><text x="360" y="151" text-anchor="middle" font-size="16">R₂</text><text x="540" y="151" text-anchor="middle" font-size="16">R₃</text><text x="130" y="166" text-anchor="middle" font-size="16">V₁</text><text x="310" y="166" text-anchor="middle" font-size="16">V₂</text><text x="490" y="166" text-anchor="middle" font-size="16">V₃</text><text x="680" y="166" text-anchor="middle" font-size="15">Vₜ</text></g></svg>`;

const parallelCurrentSvg=String.raw`<svg viewBox="0 0 720 330" role="img" aria-label="Three parallel resistors with branch ammeters and a total-current ammeter">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<line x1="75" y1="55" x2="135" y2="55"/><circle cx="170" cy="55" r="30"/><line x1="200" y1="55" x2="640" y2="55"/><line x1="75" y1="270" x2="640" y2="270"/><line x1="75" y1="55" x2="75" y2="270"/>
<line x1="250" y1="55" x2="250" y2="95"/><circle cx="250" cy="125" r="27"/><line x1="250" y1="152" x2="250" y2="175"/><rect x="220" y="175" width="60" height="70" rx="4"/><line x1="250" y1="245" x2="250" y2="270"/>
<line x1="420" y1="55" x2="420" y2="95"/><circle cx="420" cy="125" r="27"/><line x1="420" y1="152" x2="420" y2="175"/><rect x="390" y="175" width="60" height="70" rx="4"/><line x1="420" y1="245" x2="420" y2="270"/>
<line x1="590" y1="55" x2="590" y2="95"/><circle cx="590" cy="125" r="27"/><line x1="590" y1="152" x2="590" y2="175"/><rect x="560" y="175" width="60" height="70" rx="4"/><line x1="590" y1="245" x2="590" y2="270"/>
</g>
<g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="170" y="62" text-anchor="middle" font-size="17">Aₜ</text><text x="250" y="132" text-anchor="middle" font-size="16">A₁</text><text x="420" y="132" text-anchor="middle" font-size="16">A₂</text><text x="590" y="132" text-anchor="middle" font-size="16">A₃</text><text x="250" y="215" text-anchor="middle" font-size="16">R₁</text><text x="420" y="215" text-anchor="middle" font-size="16">R₂</text><text x="590" y="215" text-anchor="middle" font-size="16">R₃</text></g></svg>`;

const shortSvg=String.raw`<svg viewBox="0 0 720 260" role="img" aria-label="Resistor bypassed by an ideal wire">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><line x1="90" y1="130" x2="220" y2="130"/><rect x="220" y="100" width="160" height="60" rx="4"/><line x1="380" y1="130" x2="520" y2="130"/><line x1="220" y1="130" x2="220" y2="55"/><line x1="220" y1="55" x2="520" y2="55"/><line x1="520" y1="55" x2="520" y2="130"/><circle cx="220" cy="130" r="7" fill="#111827"/><circle cx="520" cy="130" r="7" fill="#111827"/></g><g fill="#111827" font-family="Arial,sans-serif"><text x="300" y="137" text-anchor="middle" font-size="20" font-weight="700">R</text><text x="370" y="43" text-anchor="middle" font-size="16">ideal wire / ลวดอุดมคติ</text><text x="370" y="205" text-anchor="middle" font-size="18" font-weight="700">ΔV across R = 0  →  I_R = 0</text></g></svg>`;

const rearrangeSvg=String.raw`<svg viewBox="0 0 760 330" role="img" aria-label="Circuit redrawing that preserves node pairs">
<g font-family="Arial,sans-serif" fill="#111827"><text x="180" y="28" text-anchor="middle" font-size="18" font-weight="700">Before / ก่อนจัดรูป</text><text x="580" y="28" text-anchor="middle" font-size="18" font-weight="700">Same nodes / หลังจัดรูป</text></g>
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
<circle cx="70" cy="160" r="7" fill="#111827"/><circle cx="300" cy="160" r="7" fill="#111827"/><circle cx="185" cy="85" r="7" fill="#111827"/>
<line x1="70" y1="160" x2="110" y2="160"/><rect x="110" y="135" width="105" height="50" rx="4"/><line x1="215" y1="160" x2="300" y2="160"/>
<line x1="70" y1="160" x2="70" y2="85"/><line x1="70" y1="85" x2="130" y2="85"/><rect x="130" y="60" width="110" height="50" rx="4"/><line x1="240" y1="85" x2="300" y2="85"/><line x1="300" y1="85" x2="300" y2="160"/>
<line x1="185" y1="85" x2="185" y2="235"/><rect x="155" y="185" width="60" height="100" rx="4"/><line x1="185" y1="285" x2="300" y2="285"/><line x1="300" y1="285" x2="300" y2="160"/>
<circle cx="470" cy="75" r="7" fill="#111827"/><circle cx="690" cy="75" r="7" fill="#111827"/><line x1="470" y1="75" x2="510" y2="75"/><rect x="510" y="50" width="140" height="50" rx="4"/><line x1="650" y1="75" x2="690" y2="75"/>
<line x1="470" y1="75" x2="470" y2="165"/><line x1="470" y1="165" x2="510" y2="165"/><rect x="510" y="140" width="140" height="50" rx="4"/><line x1="650" y1="165" x2="690" y2="165"/><line x1="690" y1="165" x2="690" y2="75"/>
<line x1="470" y1="165" x2="470" y2="255"/><line x1="470" y1="255" x2="510" y2="255"/><rect x="510" y="230" width="140" height="50" rx="4"/><line x1="650" y1="255" x2="690" y2="255"/><line x1="690" y1="255" x2="690" y2="165"/>
</g><g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="162" y="167" text-anchor="middle">R₁</text><text x="185" y="92" text-anchor="middle">R₂</text><text x="185" y="242" text-anchor="middle">R₃</text><text x="580" y="82" text-anchor="middle">R₁</text><text x="580" y="172" text-anchor="middle">R₂</text><text x="580" y="262" text-anchor="middle">R₃</text><text x="55" y="180">A</text><text x="305" y="180">B</text><text x="455" y="95">A</text><text x="695" y="95">B</text></g></svg>`;

const wheatstoneSvg=String.raw`<svg viewBox="0 0 720 330" role="img" aria-label="Wheatstone bridge">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="80" cy="165" r="7" fill="#111827"/><circle cx="640" cy="165" r="7" fill="#111827"/><circle cx="360" cy="55" r="7" fill="#111827"/><circle cx="360" cy="275" r="7" fill="#111827"/><line x1="80" y1="165" x2="195" y2="105"/><rect x="195" y="78" width="120" height="54" rx="4" transform="rotate(-22 255 105)"/><line x1="315" y1="78" x2="360" y2="55"/><line x1="360" y1="55" x2="405" y2="78"/><rect x="405" y="78" width="120" height="54" rx="4" transform="rotate(22 465 105)"/><line x1="525" y1="105" x2="640" y2="165"/><line x1="80" y1="165" x2="195" y2="225"/><rect x="195" y="198" width="120" height="54" rx="4" transform="rotate(22 255 225)"/><line x1="315" y1="252" x2="360" y2="275"/><line x1="360" y1="275" x2="405" y2="252"/><rect x="405" y="198" width="120" height="54" rx="4" transform="rotate(-22 465 225)"/><line x1="525" y1="225" x2="640" y2="165"/><line x1="360" y1="55" x2="360" y2="130"/><circle cx="360" cy="165" r="35"/><line x1="360" y1="200" x2="360" y2="275"/></g><g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="80" y="190">A</text><text x="645" y="190">B</text><text x="345" y="45">C</text><text x="345" y="310">D</text><text x="255" y="105" text-anchor="middle">R₁</text><text x="465" y="105" text-anchor="middle">R₂</text><text x="255" y="235" text-anchor="middle">R₃</text><text x="465" y="235" text-anchor="middle">R₄</text><text x="360" y="172" text-anchor="middle">G</text></g></svg>`;

const deltaYSvg=String.raw`<svg viewBox="0 0 760 330" role="img" aria-label="Delta to wye resistor transformation">
<g font-family="Arial,sans-serif" fill="#111827"><text x="190" y="30" text-anchor="middle" font-size="19" font-weight="700">Δ network</text><text x="570" y="30" text-anchor="middle" font-size="19" font-weight="700">Y network</text><text x="380" y="175" text-anchor="middle" font-size="30" font-weight="800">→</text></g>
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><circle cx="190" cy="60" r="7" fill="#111827"/><circle cx="75" cy="260" r="7" fill="#111827"/><circle cx="305" cy="260" r="7" fill="#111827"/><line x1="190" y1="60" x2="150" y2="130"/><rect x="118" y="128" width="105" height="48" rx="4" transform="rotate(-60 170 152)"/><line x1="125" y1="175" x2="75" y2="260"/><line x1="190" y1="60" x2="230" y2="130"/><rect x="198" y="128" width="105" height="48" rx="4" transform="rotate(60 250 152)"/><line x1="255" y1="175" x2="305" y2="260"/><line x1="75" y1="260" x2="135" y2="260"/><rect x="135" y="236" width="110" height="48" rx="4"/><line x1="245" y1="260" x2="305" y2="260"/>
<circle cx="570" cy="165" r="8" fill="#111827"/><circle cx="570" cy="60" r="7" fill="#111827"/><circle cx="455" cy="260" r="7" fill="#111827"/><circle cx="685" cy="260" r="7" fill="#111827"/><line x1="570" y1="165" x2="570" y2="135"/><rect x="545" y="85" width="50" height="70" rx="4"/><line x1="570" y1="85" x2="570" y2="60"/><line x1="570" y1="165" x2="535" y2="195"/><rect x="480" y="190" width="85" height="48" rx="4" transform="rotate(-40 522 214)"/><line x1="490" y1="230" x2="455" y2="260"/><line x1="570" y1="165" x2="605" y2="195"/><rect x="575" y="190" width="85" height="48" rx="4" transform="rotate(40 617 214)"/><line x1="650" y1="230" x2="685" y2="260"/></g>
<g fill="#111827" font-family="Arial,sans-serif" font-weight="700"><text x="190" y="52" text-anchor="middle">A</text><text x="60" y="285">B</text><text x="310" y="285">C</text><text x="120" y="155">RAB</text><text x="265" y="155">RCA</text><text x="190" y="252" text-anchor="middle">RBC</text><text x="570" y="52" text-anchor="middle">A</text><text x="440" y="285">B</text><text x="690" y="285">C</text><text x="610" y="122">RA</text><text x="500" y="220">RB</text><text x="635" y="220">RC</text></g></svg>`;

const resistorNetworkLessonPages=group=>[
rgPage(1,'อนุกรม: กระแสเท่ากันตลอดเส้นทาง / Series: the same current everywhere','ใช้แอมมิเตอร์หลายตำแหน่งเพื่อ “เห็น” ว่าทางเดินเดียวทำให้กระแสเท่ากัน / Use ammeters at several positions to make the same-current rule visible.',String.raw`
<div class="rg-visual">${seriesMeterSvg}</div>
<div class="rg-grid-2"><div class="rg-card"><div class="rg-card-title">กล่อง 1 — แอมมิเตอร์บอกอะไร? / What do the ammeters show?</div><div class="rg-th">วงจรมีทางเดินกระแสเพียงเส้นเดียว ไม่มีจุดแยก ดังนั้นประจุที่ผ่าน \(R_1\) ต้องผ่าน \(R_2\) และ \(R_3\) ต่อเนื่องกัน</div><div class="rg-en">There is only one current path and no junction, so the same charge flow passes successively through all three resistors.</div></div><div class="rg-card soft"><div class="rg-card-title">เติมให้ครบ / Complete</div><div class="rg-equation key"><span>\(I_{\rm total}=\)</span>${slotMath('I_1','16mm')}<span>\(=\)</span>${slotMath('I_2','16mm')}<span>\(=\)</span>${slotMath('I_3','16mm')}</div><div class="rg-note">แอมมิเตอร์ต่อ “อนุกรม” กับทางเดินที่ต้องการวัด / An ammeter is placed in series with the path being measured.</div></div></div>
<div class="rg-callout"><b>เหตุผล ไม่ใช่แค่สูตร / Reason, not just a formula:</b> ถ้ากระแสที่จุดหนึ่งมากกว่าอีกจุดหนึ่ง ประจุจะต้องสะสมอยู่ระหว่างสองจุดนั้น แต่ในสภาวะคงตัวไม่มีการสะสมประจุต่อเนื่อง จึงได้กระแสเท่ากันตลอดทางเดินเดียว</div>`),
rgPage(2,'อนุกรม: แรงดันถูกแบ่ง / Series: voltage is divided','ใช้โวลต์มิเตอร์คร่อมตัวต้านทานแต่ละตัว แล้วเทียบกับแรงดันรวม / Measure each voltage drop and compare with the total.',String.raw`
<div class="rg-visual">${seriesVoltSvg}</div>
<div class="rg-grid-2"><div class="rg-card"><div class="rg-card-title">กล่อง 2 — วัดแรงดันทีละช่วง / Measure each drop</div><div class="rg-th">โวลต์มิเตอร์วัดความต่างศักย์ “ระหว่างสองจุด” จึงต้องต่อคร่อมอุปกรณ์ เมื่อเดินครบหนึ่งรอบ พลังงานต่อประจุที่แหล่งจ่ายให้ต้องเท่ากับผลรวมพลังงานต่อประจุที่สูญเสียในตัวต้านทาน</div><div class="rg-en">A voltmeter measures the potential difference between two points, so it is connected across a component. Around the loop, the supply p.d. equals the sum of resistor drops.</div></div><div class="rg-card soft"><div class="rg-card-title">เติมให้ครบ / Complete</div><div class="rg-equation key"><span>\(V_{\rm total}=\)</span>${slotMath('V_1+V_2+V_3','46mm')}</div><div class="rg-note">โวลต์มิเตอร์ต่อขนานกับส่วนที่ต้องการวัด / A voltmeter is connected in parallel across the part being measured.</div></div></div>
<div class="rg-derive"><div class="rg-step"><b>จากกฎของโอห์ม / From Ohm’s law</b><span>เพราะกระแสอนุกรมเท่ากัน: \(V_1=IR_1,\;V_2=IR_2,\;V_3=IR_3\)</span></div><div class="rg-step"><b>จึงแบ่งตาม R / Therefore voltage divides in proportion to R</b><span>\(V_1:V_2:V_3=R_1:R_2:R_3\)</span></div></div>`),
rgPage(3,'จำอนุกรมให้ขึ้นใจ: I เท่า — V แบ่ง / Series memory: same I — split V','กล่อง 3 เป็นหน้าจำ + พิสูจน์สูตรจากสิ่งที่วัดได้ / A memory page plus a short derivation from the measured rules.',String.raw`
<div class="rg-memory"><div class="big">SERIES: \(I\) SAME • \(V\) SPLITS</div><div class="small">อนุกรม: กระแสเท่ากันทุกตัว • ความต่างศักย์แบ่งกันตามความต้านทาน</div></div>
<div class="rg-grid-2"><div class="rg-card key"><div class="rg-card-title">ความต้านทานสมมูล / Equivalent resistance</div><div class="rg-derive"><div class="rg-step"><b>1</b><span>\(V_{\rm total}=V_1+V_2+V_3\)</span></div><div class="rg-step"><b>2</b><span>\(I R_{\rm eq}=IR_1+IR_2+IR_3\)</span></div><div class="rg-step"><b>3</b><span>ตัด \(I\): \(\boxed{R_{\rm eq}=R_1+R_2+R_3}\)</span></div></div></div><div class="rg-card"><div class="rg-card-title">Voltage divider แบบทั่วไป</div><div class="rg-equation">\[\boxed{V_k=V_{\rm total}\frac{R_k}{R_1+R_2+\cdots+R_n}}\]</div><div class="rg-th">ตัวที่ \(R\) มากกว่า จะรับส่วนแบ่งแรงดันมากกว่า เมื่อกระแสเดียวกันไหลผ่าน</div><div class="rg-en">With the same current, a larger resistance gets a larger voltage drop.</div></div></div>
<div class="rg-trap"><b>ห้ามจำสลับ:</b> อนุกรมไม่ได้หมายความว่าแรงดันเท่ากัน แต่หมายความว่า <b>กระแสเท่ากัน</b>. แรงดันจะเท่ากันก็ต่อเมื่อค่าความต้านทานเท่ากันด้วย</div>`),
rgPage(4,'ขนาน: แรงดันเท่ากัน — กระแสถูกแบ่ง / Parallel: same voltage — current splits','กล่อง 4–5 ใช้มิเตอร์ให้เห็นกฎของวงจรขนานก่อนเขียนสูตร / Use meters to see the rules before writing formulas.',String.raw`
<div class="rg-grid-2"><div class="rg-card"><div class="rg-card-title">กล่อง 4 — โวลต์มิเตอร์ / Voltmeter</div><div class="rg-visual">${parallelVoltSvg}</div><div class="rg-equation key"><span>\(V_{\rm total}=\)</span>${slotMath('V_1','15mm')}<span>\(=\)</span>${slotMath('V_2','15mm')}<span>\(=\)</span>${slotMath('V_3','15mm')}</div><div class="rg-note">ทุกแขนงคร่อมโหนดต้น–ปลายคู่เดียวกัน / Every branch spans the same two nodes.</div></div><div class="rg-card"><div class="rg-card-title">กล่อง 5 — แอมมิเตอร์ / Ammeter</div><div class="rg-visual">${parallelCurrentSvg}</div><div class="rg-equation key"><span>\(I_{\rm total}=\)</span>${slotMath('I_1+I_2+I_3','42mm')}</div><div class="rg-note">กระแสแบ่งที่จุดร่วมและกลับมารวมกันอีกครั้ง / Current splits at a junction and recombines later.</div></div></div>
<div class="rg-callout"><b>อ่านด้วย node:</b> “ขนาน” ไม่ได้แปลว่าเส้นวาดขนานกันบนกระดาษ แต่แปลว่าอุปกรณ์มีปลายทั้งสองต่อกับ <b>โหนดคู่เดียวกัน</b>.</div>`),
rgPage(5,'จำขนานให้ขึ้นใจ + ใช้ความนำ G / Parallel memory + conductance G','กล่อง 6: V เท่า — I แบ่ง และใช้ \(G=1/R\) ทำให้สูตรขนานกลายเป็นการบวกตรง ๆ.',String.raw`
<div class="rg-memory"><div class="big">PARALLEL: \(V\) SAME • \(I\) SPLITS</div><div class="small">ขนาน: ความต่างศักย์เท่ากันทุกแขนง • กระแสรวมเท่ากับผลรวมกระแสแขนง</div></div>
<div class="rg-grid-2"><div class="rg-card key"><div class="rg-card-title">พิสูจน์ด้วย R / Derive with resistance</div><div class="rg-derive"><div class="rg-step"><b>1</b><span>\(I_{\rm total}=I_1+I_2+I_3\)</span></div><div class="rg-step"><b>2</b><span>\(\dfrac{V}{R_{\rm eq}}=\dfrac{V}{R_1}+\dfrac{V}{R_2}+\dfrac{V}{R_3}\)</span></div><div class="rg-step"><b>3</b><span>\(\boxed{\dfrac1{R_{\rm eq}}=\dfrac1{R_1}+\dfrac1{R_2}+\dfrac1{R_3}}\)</span></div></div></div><div class="rg-card"><div class="rg-card-title">เปลี่ยนมุมมองเป็น G / Use conductance</div><div class="rg-equation key">\[\boxed{G\equiv\frac1R}\]</div><div class="rg-equation">\[\boxed{G_{\rm eq}=G_1+G_2+G_3+\cdots}\]</div><div class="rg-th">หน่วยของความนำคือซีเมนส์ \(\mathrm S\). ยิ่ง \(G\) มาก ยิ่งยอมให้กระแสไหลง่าย</div><div class="rg-en">Conductance is measured in siemens (S). Larger G means an easier current path.</div></div></div>
<div class="rg-grid-3"><div class="rg-card soft"><div class="rg-card-title">จำเร็ว / Quick check</div><div class="rg-th">ขนานแล้ว \(R_{\rm eq}\) ต้องน้อยกว่าตัวที่น้อยที่สุด</div></div><div class="rg-card soft"><div class="rg-card-title">ตัวเท่ากัน n ตัว</div><div class="rg-equation">\(R_{\rm eq}=R/n\)</div></div><div class="rg-card soft"><div class="rg-card-title">มุมมอง G</div><div class="rg-equation">\(G_{\rm eq}=\sum G\)</div></div></div>`),
rgPage(6,'วงจรลัด + กฎการแบ่งแรงดันและกระแส / Short circuits + divider rules','กล่อง 7–8: ก่อนใช้สูตร ต้องรู้ว่า node ไหนถูกลวดรวมเข้าด้วยกัน แล้วจึงใช้ R หรือ G แบ่งแรงดัน/กระแส.',String.raw`
<div class="rg-grid-2"><div class="rg-card"><div class="rg-card-title">กล่อง 7 — Short circuit / วงจรลัด</div><div class="rg-visual">${shortSvg}</div><div class="rg-th">ลวดอุดมคติมีความต้านทานประมาณศูนย์ จุดบนลวดเดียวกันจึงมีศักย์เท่ากัน ถ้าลวดคร่อมตัวต้านทานทั้งสองปลาย จะได้ \(\Delta V_R=0\) และตัวต้านทานนั้นถูก bypass.</div><div class="rg-en">An ideal wire has nearly zero resistance, so points on the same wire are equipotential. A resistor bridged by an ideal wire has zero p.d. and is bypassed.</div></div><div class="rg-card key"><div class="rg-card-title">กล่อง 8 — Divider rules แบบทั่วไป</div><table class="rg-formula-table"><tr><th>สิ่งที่แบ่ง</th><th>สูตรทั่วไป</th></tr><tr><td>Voltage<br><small>อนุกรม</small></td><td>\(\displaystyle \boxed{V_k=V_T\frac{R_k}{\sum R}}\)</td></tr><tr><td>Current<br><small>ขนาน, รูป R</small></td><td>\(\displaystyle \boxed{I_k=I_T\frac{1/R_k}{\sum(1/R)}}\)</td></tr><tr><td>Current<br><small>ขนาน, รูป G</small></td><td>\(\displaystyle \boxed{I_k=I_T\frac{G_k}{\sum G}}\)</td></tr></table><div class="rg-trap">จำ pattern: <b>Voltage division ใช้ R ตรง ๆ</b> • <b>Current division ใช้ G ตรง ๆ</b>.</div></div></div>
<div class="rg-callout">สำหรับขนานสองแขนง: \(I_1=I_T\dfrac{R_2}{R_1+R_2}\) และ \(I_2=I_T\dfrac{R_1}{R_1+R_2}\). กระแสจึงมากในแขนงที่ความต้านทานน้อยกว่า.</div>`),
rgPage(7,'การย้ายและวาดวงจรใหม่ / Circuit rearrangement and redrawing','กล่อง 9: ย้ายตำแหน่งบนกระดาษได้ ตราบใดที่ “คู่โหนดของอุปกรณ์ทุกตัว” ไม่เปลี่ยน.',String.raw`
<div class="rg-visual">${rearrangeSvg}</div>
<div class="rg-grid-2"><div class="rg-card key"><div class="rg-card-title">กฎทอง / Golden rule</div><div class="rg-memory"><div class="big" style="font-size:16px">ย้ายรูปได้ — ห้ามเปลี่ยน NODE</div><div class="small">You may redraw geometry, but you must preserve electrical connectivity.</div></div><div class="rg-th" style="margin-top:2mm">ก่อนวาดใหม่ ให้ตั้งชื่อโหนด A, B, C, … แล้วจดว่าตัวต้านทานแต่ละตัวต่อระหว่างโหนดคู่ใด</div></div><div class="rg-card"><div class="rg-card-title">ขั้นตอนมาตรฐาน / Standard method</div><div class="rg-derive"><div class="rg-step"><b>1. Label nodes</b><span>ลากตามลวดที่ไม่มีอุปกรณ์คั่น จุดทั้งหมดนั้นคือ node เดียวกัน</span></div><div class="rg-step"><b>2. Make a node-pair list</b><span>เช่น \(R_1:A\!\leftrightarrow\!B\), \(R_2:A\!\leftrightarrow\!C\)</span></div><div class="rg-step"><b>3. Redraw</b><span>วาดให้ series/parallel มองง่ายขึ้น โดยรักษาคู่โหนดเดิม</span></div><div class="rg-step"><b>4. Reduce</b><span>ยุบเฉพาะกลุ่มที่เป็นอนุกรมหรือขนานจริง</span></div></div></div></div>
<div class="rg-trap"><b>ข้อห้าม:</b> เส้นไขว้ไม่ได้แปลว่าเชื่อมกันเสมอ ต้องดู “จุดดำ/จุดต่อ” และการลากเส้นในรูปต้นฉบับก่อน.</div>`),
rgPage(8,'สะพานวีตสโตน / Wheatstone Bridge','กล่อง 10: ถ้าสะพานสมดุล จุดกึ่งกลางสองฝั่งมีศักย์เท่ากัน จึงไม่มีกระแสผ่านแขนกลาง.',String.raw`
<div class="rg-grid-2"><div class="rg-visual">${wheatstoneSvg}</div><div class="rg-card key"><div class="rg-card-title">เงื่อนไขสมดุล / Balance condition</div><div class="rg-equation key">\[\boxed{\frac{R_1}{R_2}=\frac{R_3}{R_4}}\]</div><div class="rg-th">เมื่อสมดุล: \(V_C=V_D\) ดังนั้นแรงดันคร่อมกัลวานอมิเตอร์หรือแขนกลางเป็นศูนย์</div><div class="rg-equation">\[\Delta V_{CD}=0\Rightarrow I_G=0\]</div><div class="rg-en">At balance, the midpoint potentials are equal, so no current flows through the bridge branch.</div></div></div>
<div class="rg-flow"><span>ตรวจอัตราส่วน / check ratios</span><i>→</i><span>ถ้าสมดุล: ตัดแขนกลาง</span><i>→</i><span>รวมแต่ละแขนแบบอนุกรม</span><i>→</i><span>นำสองแขนมาขนาน</span></div>
<div class="rg-equation">\[R_{AB}=(R_1+R_2)\parallel(R_3+R_4)\qquad\text{(เมื่อสะพานสมดุล / when balanced)}\]</div>
<div class="rg-trap">ถ้าอัตราส่วนไม่เท่ากัน <b>ห้ามตัดแขนกลาง</b>. ต้องใช้วิธีวิเคราะห์วงจรอื่น เช่น Kirchhoff หรือการแปลงเครือข่ายที่เหมาะสม.</div>`),
rgPage(9,'เดลตาเป็นวาย + แผนเลือกวิธี / Δ→Y + strategy map','กล่อง 11 เป็นเครื่องมือเพิ่มเติมสำหรับวงจรที่ยุบ series/parallel ตรง ๆ ไม่ได้ แล้วปิดท้ายด้วยแผนเลือกวิธีทั้งบท.',String.raw`
<div class="rg-grid-2"><div class="rg-visual">${deltaYSvg}</div><div class="rg-card key"><div class="rg-card-title">กล่อง 11 — \(\Delta\rightarrow Y\) (Extension)</div><div class="rg-th">ให้ \(S=R_{AB}+R_{BC}+R_{CA}\). ตัวต้านทานแขน Y ที่ต่อกับจุดใด เท่ากับ “ผลคูณของตัวต้านทานเดลตาสองตัวที่ติดจุดนั้น” หารด้วยผลรวมทั้งสาม</div><div class="rg-en">Let \(S=R_{AB}+R_{BC}+R_{CA}\). Each Y arm equals the product of the two delta resistors touching that terminal, divided by the total delta sum.</div><div class="rg-equation">\[R_A=\frac{R_{AB}R_{CA}}{S}\]</div><div class="rg-equation">\[R_B=\frac{R_{AB}R_{BC}}{S}\]</div><div class="rg-equation">\[R_C=\frac{R_{BC}R_{CA}}{S}\]</div></div></div>
<div class="rg-card soft"><div class="rg-card-title">สรุปเลือกเครื่องมือ / Decision map</div><div class="rg-decision"><div class="rg-decision-row"><b>1. เห็นวงจร</b><div class="arr">→</div><span>หา node และตรวจ short circuit ก่อน</span></div><div class="rg-decision-row"><b>2. มี series/parallel ชัด?</b><div class="arr">→</div><span>ยุบทีละก้อน แล้วดูวงจรใหม่</span></div><div class="rg-decision-row"><b>3. รูปหลอกตา?</b><div class="arr">→</div><span>วาดใหม่โดยรักษาคู่ node</span></div><div class="rg-decision-row"><b>4. Bridge สมดุล?</b><div class="arr">→</div><span>ใช้ equal potential แล้วตัดแขนกลาง</span></div><div class="rg-decision-row"><b>5. ยังยุบไม่ได้?</b><div class="arr">→</div><span>ใช้ Kirchhoff หรือ \(\Delta\rightarrow Y\) ตามความเหมาะสม</span></div></div></div>
<div class="rg-summary-grid"><div class="rg-summary-cell"><b>จำอนุกรม / Series</b><div>\(I\) เท่า • \(V\) แบ่ง • \(R_{eq}=\sum R\) • voltage divider ใช้ R</div></div><div class="rg-summary-cell"><b>จำขนาน / Parallel</b><div>\(V\) เท่า • \(I\) แบ่ง • \(G_{eq}=\sum G\) • current divider ใช้ G</div></div></div>`)
].join('');

const lessonPagesForGroupExtended=group=>group.key==='resistor-networks'?resistorNetworkLessonPages(group):lessonPagesForGroup(group);
