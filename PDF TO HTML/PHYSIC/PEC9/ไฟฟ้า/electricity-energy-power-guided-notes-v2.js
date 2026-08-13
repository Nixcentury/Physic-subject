/* Guided Notes v2: Electrical Energy and Power / พลังงานและกำลังไฟฟ้า
   Clean MathJax structure: answer slots are never placed inside \(...\) or \[...\].
   Uses E for energy to avoid confusion between the energy variable W and watt (W).
*/
const guidedLessonStyle=document.createElement('style');
guidedLessonStyle.textContent=String.raw`
.lesson-guided.energy-power-v2{grid-template-rows:auto minmax(0,1fr) auto}
.energy-power-v2 .lesson-guided-body{min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:2.4mm}
.energy-power-v2 .lesson-hero{border-bottom:2px solid var(--navy);padding:1mm 0 2.2mm;background:#fff}
.energy-power-v2 .lesson-kicker{font-size:8.5px;font-weight:800;letter-spacing:.04em;color:#64748b;text-transform:uppercase}
.energy-power-v2 .lesson-title{font-size:18px;line-height:1.16;font-weight:800;color:var(--navy);margin-top:.7mm}
.energy-power-v2 .lesson-subtitle{font-size:9.2px;color:#475569;margin-top:.6mm}
.energy-power-v2 .lesson-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:2.4mm}
.energy-power-v2 .lesson-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2mm}
.energy-power-v2 .lesson-card{border:1px solid #cbd5e1;background:#fff;padding:2.6mm;min-width:0}
.energy-power-v2 .lesson-card.soft{background:#f8fafc}
.energy-power-v2 .lesson-card-title{font-size:10.8px;font-weight:800;color:var(--navy);margin-bottom:1.1mm}
.energy-power-v2 .lesson-th{font-size:10.3px;font-weight:550;line-height:1.42}
.energy-power-v2 .lesson-en{font-size:8.7px;color:#475569;line-height:1.34;margin-top:.7mm}
.energy-power-v2 .lesson-note{font-size:8.3px;color:#64748b;line-height:1.35}
.energy-power-v2 .lesson-slot{--slot-w:24mm;display:inline-grid;place-items:center;min-width:var(--slot-w);height:1.55em;border-bottom:1.2px solid #334155;vertical-align:baseline;margin:0 .35mm}
.energy-power-v2 .lesson-fill{visibility:hidden;font-weight:800;color:#0f172a}
.show-answers .energy-power-v2 .lesson-fill{visibility:visible}
.energy-power-v2 .guided-equation{display:flex;align-items:center;justify-content:center;gap:1.2mm;flex-wrap:wrap;min-height:12mm;padding:1.7mm 2mm;background:#f8fafc;border:1px solid #cbd5e1;font-size:12px;font-weight:750}
.energy-power-v2 .guided-equation.key{border:1.5px solid var(--navy);background:#fff;font-size:13px}
.energy-power-v2 .guided-equation .arrow{color:#475569;font-weight:800;padding:0 .6mm}
.energy-power-v2 .rating-layout{display:grid;grid-template-columns:55mm 1fr;gap:3mm;align-items:stretch}
.energy-power-v2 .rating-visual{border:1px solid #cbd5e1;background:#f8fafc;padding:2mm;display:grid;place-items:center;min-height:45mm}
.energy-power-v2 .rating-visual svg{width:100%;height:100%;max-height:46mm}
.energy-power-v2 .meaning-list{display:grid;gap:1.5mm}
.energy-power-v2 .meaning-row{display:grid;grid-template-columns:26mm 1fr;gap:2mm;align-items:start;padding:1.4mm 0;border-bottom:1px dotted #cbd5e1}
.energy-power-v2 .meaning-row:last-child{border-bottom:0}
.energy-power-v2 .meaning-key{font-size:9.4px;font-weight:800;color:var(--navy)}
.energy-power-v2 .meaning-text{font-size:9.6px;line-height:1.38}
.energy-power-v2 .unit-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:1.8mm}
.energy-power-v2 .unit-cell{border-left:3px solid #94a3b8;background:#f8fafc;padding:1.8mm 2mm;text-align:center}
.energy-power-v2 .unit-cell b{display:block;color:var(--navy);font-size:10px}
.energy-power-v2 .unit-cell span{display:block;color:#475569;font-size:8.4px;margin-top:.5mm}
.energy-power-v2 .example-box{border:1.2px solid var(--navy);padding:2.4mm;background:#fff}
.energy-power-v2 .example-head{font-size:10.3px;font-weight:800;color:var(--navy);margin-bottom:1mm}
.energy-power-v2 .example-work{font-size:9.5px;line-height:1.45}
.energy-power-v2 .definition-row{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm}
.energy-power-v2 .definition-card{border-top:3px solid #64748b;background:#f8fafc;padding:2.3mm;text-align:center}
.energy-power-v2 .definition-card b{font-size:10.2px;color:var(--navy)}
.energy-power-v2 .definition-card .def-eq{font-size:12px;margin:1.3mm 0}
.energy-power-v2 .definition-card small{display:block;color:#64748b;font-size:8px;line-height:1.3}
.energy-power-v2 .derive-stack{display:grid;gap:1.8mm}
.energy-power-v2 .derive-line{display:grid;grid-template-columns:28mm 8mm 1fr;gap:1mm;align-items:center;border-bottom:1px solid #e2e8f0;padding:1.5mm 1mm}
.energy-power-v2 .derive-line:last-child{border-bottom:0}
.energy-power-v2 .derive-label{font-size:9px;font-weight:800;color:#475569}
.energy-power-v2 .derive-arrow{text-align:center;font-size:16px;font-weight:800;color:#64748b}
.energy-power-v2 .derive-main{font-size:10.3px;font-weight:650}
.energy-power-v2 .formula-row{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm}
.energy-power-v2 .formula-card{border:1px solid #cbd5e1;background:#fff;padding:2.8mm;text-align:center}
.energy-power-v2 .formula-card .given{font-size:8.3px;color:#64748b}
.energy-power-v2 .formula-card .formula{font-size:14px;font-weight:800;color:var(--navy);margin:1.1mm 0}
.energy-power-v2 .formula-card .why{font-size:8.5px;color:#475569;line-height:1.35;border-top:1px dotted #cbd5e1;padding-top:1mm}
.energy-power-v2 .summary-bar{border:1.5px solid var(--navy);background:#f8fafc;padding:2.3mm;text-align:center;font-size:13.5px;font-weight:800}
.energy-power-v2 .choice-table{width:100%;border-collapse:collapse;font-size:9.2px}
.energy-power-v2 .choice-table th,.energy-power-v2 .choice-table td{border-bottom:1px solid #cbd5e1;padding:1.5mm 2mm;text-align:left}
.energy-power-v2 .choice-table th{background:#f8fafc;color:var(--navy);font-weight:800}
.energy-power-v2 .closing-link{font-size:9.2px;text-align:center;color:#334155;padding:1.5mm;border-top:1px solid #cbd5e1}

/* Energy-power solution cleanup: fewer nested boxes and better print readability. */
#topic-energy-power .solution-step{border:0!important;border-left:2.5px solid #cbd5e1!important;background:#fff!important;padding:1.2mm 2mm!important;margin:0 0 1.2mm!important}
#topic-energy-power .solution-equation{margin:1mm 0!important;padding:1.3mm 1.8mm!important;border-left:3px solid var(--navy)!important;background:#f8fafc!important;text-align:center!important}
#topic-energy-power .solution-final{margin-top:1.2mm!important;padding:1.5mm 2mm!important;border:1.3px solid var(--navy)!important;background:#eef2f7!important;font-weight:800!important}
#topic-energy-power .source-correction{margin-top:1mm!important;padding:1.2mm 1.6mm!important}
#topic-energy-power .answer-layer{padding:4mm 5mm!important}

@media(max-width:720px){
  .energy-power-v2 .rating-layout,.energy-power-v2 .lesson-grid-2,.energy-power-v2 .lesson-grid-3,.energy-power-v2 .definition-row,.energy-power-v2 .formula-row{grid-template-columns:1fr}
  .energy-power-v2 .unit-strip{grid-template-columns:1fr}
  .energy-power-v2 .derive-line{grid-template-columns:1fr;text-align:center}
  .energy-power-v2 .derive-arrow{transform:rotate(90deg)}
  .lesson-guided.energy-power-v2{height:auto!important}
  .energy-power-v2 .lesson-guided-body{overflow:visible}
}
@media print{
  body.print-answers .energy-power-v2 .lesson-fill{visibility:visible!important}
  body.print-questions .energy-power-v2 .lesson-fill{visibility:hidden!important}
  .energy-power-v2 .lesson-guided-body{overflow:hidden!important}
  #topic-energy-power .solution-equation .mjx-container{font-size:88%!important}
}
`;
document.head.appendChild(guidedLessonStyle);

const lessonSlot=(answer,width='24mm')=>`<span class="lesson-slot" style="--slot-w:${width}"><span class="lesson-fill">${answer}</span></span>`;
const slotMath=(tex,width='24mm')=>lessonSlot(String.raw`\(${tex}\)`,width);

const defaultLessonPage=group=>`
<section class="sheet lesson-sheet" id="lesson-${group.key}" data-topic="${group.key}" aria-label="หน้าสำหรับใบความรู้: ${group.title}">
  <div class="topline"><div class="topic">${group.title}</div><div class="qno">ใบความรู้ / Lesson</div></div>
  <div class="lesson-placeholder"><div><div class="lesson-placeholder-title">เว้นไว้สำหรับแทรกเนื้อหา</div><div class="lesson-placeholder-note">Reserved for lesson content</div></div></div>
  <div class="footer"><span>PEC9 Electricity • Lesson Placeholder</span><span>ก่อนข้อ ${group.start}–${group.end} / Before Q${group.start}–Q${group.end}</span></div>
</section>`;

const energyPowerLessonPages=group=>String.raw`
<section class="sheet lesson-sheet lesson-guided energy-power-v2" id="lesson-energy-power-1" data-topic="energy-power" aria-label="พลังงานไฟฟ้าและกำลังไฟฟ้า">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 1/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">CONCEPT 1 • POWER RATING → ENERGY</div>
      <div class="lesson-title">กำลังไฟฟ้าบอก “ใช้พลังงานเร็วแค่ไหน”</div>
      <div class="lesson-subtitle">Electrical power tells us how quickly energy is transferred or converted.</div>
    </div>

    <div class="rating-layout">
      <div class="rating-visual">
        <svg viewBox="0 0 260 190" role="img" aria-label="ตัวอย่างฉลากหลอดไฟ 9 วัตต์">
          <rect x="40" y="25" width="180" height="130" rx="10" fill="#fff" stroke="#0f172a" stroke-width="3"/>
          <text x="130" y="58" text-anchor="middle" font-size="16" font-family="Arial" font-weight="700" fill="#475569">LED LAMP</text>
          <text x="130" y="105" text-anchor="middle" font-size="42" font-family="Arial" font-weight="800" fill="#0f172a">9 W</text>
          <text x="130" y="135" text-anchor="middle" font-size="16" font-family="Arial" fill="#475569">220 V</text>
          <text x="130" y="178" text-anchor="middle" font-size="12" font-family="Arial" fill="#64748b">ตัวอย่างฉลาก / example rating</text>
        </svg>
      </div>
      <div class="lesson-card soft">
        <div class="lesson-card-title">อ่านฉลากให้เป็น / Read the rating</div>
        <div class="meaning-list">
          <div class="meaning-row"><div class="meaning-key">กำลัง / Power</div><div class="meaning-text">กำลังพิกัดของหลอดคือ ${slotMath(String.raw`9\,\mathrm W`,'22mm')}</div></div>
          <div class="meaning-row"><div class="meaning-key">ความหมาย</div><div class="meaning-text">\(9\,\mathrm W\) หมายถึงใช้หรือเปลี่ยนพลังงาน ${slotMath(String.raw`9\,\mathrm J`,'20mm')} ในเวลา ${slotMath(String.raw`1\,\mathrm s`,'18mm')}</div></div>
          <div class="meaning-row"><div class="meaning-key">หน่วย / Unit</div><div class="meaning-text">\(1\,\mathrm W=1\,\mathrm{J/s}\)</div></div>
        </div>
      </div>
    </div>

    <div class="guided-equation key">
      <span>\(P=\dfrac{E}{t}\)</span><span class="arrow">→</span><span>\(E=\)</span>${slotMath(String.raw`Pt`,'24mm')}
    </div>
    <div class="lesson-note">ใช้ \(E\) แทนพลังงาน เพื่อไม่ให้สับสนกับหน่วยวัตต์ \(\mathrm W\). / We use \(E\) for energy to avoid confusing it with watt, \(\mathrm W\).</div>

    <div class="unit-strip">
      <div class="unit-cell"><b>วัตต์ × วินาที</b><span>\(\mathrm W\times\mathrm s=\mathrm J\)</span></div>
      <div class="unit-cell"><b>กิโลวัตต์ × ชั่วโมง</b><span>\(\mathrm{kW}\times\mathrm h=\mathrm{kWh}\)</span></div>
      <div class="unit-cell"><b>1 ยูนิตไฟฟ้า</b><span>\(1\text{ unit}=1\,\mathrm{kWh}=3.6\times10^6\,\mathrm J\)</span></div>
    </div>

    <div class="lesson-grid-2">
      <div class="example-box">
        <div class="example-head">ตัวอย่าง A — พลังงานเป็นจูล / Energy in joules</div>
        <div class="example-work">หลอด \(9\,\mathrm W\) เปิด \(30\,\mathrm s\)</div>
        <div class="guided-equation"><span>\(E=Pt=(9)(30)=\)</span>${slotMath(String.raw`270\,\mathrm J`,'28mm')}</div>
      </div>
      <div class="example-box">
        <div class="example-head">ตัวอย่าง B — ยูนิตและค่าไฟ / Units and cost</div>
        <div class="example-work">เครื่อง \(1000\,\mathrm W=1\,\mathrm{kW}\) ใช้ \(3\,\mathrm h\)</div>
        <div class="guided-equation"><span>\(E=(1)(3)=\)</span>${slotMath(String.raw`3\,\mathrm{kWh}`,'29mm')}</div>
        <div class="lesson-th" style="margin-top:1.2mm">ถ้าหน่วยละ 4 บาท ค่าไฟ = ${lessonSlot('12 บาท / 12 baht','30mm')}</div>
      </div>
    </div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 1/3</span></div>
</section>

<section class="sheet lesson-sheet lesson-guided energy-power-v2" id="lesson-energy-power-2" data-topic="energy-power" aria-label="ที่มาของสมการกำลังไฟฟ้า P เท่ากับ VI">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 2/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">CONCEPT 2 • BUILD P = VI</div>
      <div class="lesson-title">สร้างสมการ \(P=VI\) จากนิยามเดิม</div>
      <div class="lesson-subtitle">Build electrical power from voltage, current and energy definitions.</div>
    </div>

    <div class="definition-row">
      <div class="definition-card"><b>ความต่างศักย์ / Voltage</b><div class="def-eq">\(V=\dfrac{E}{Q}\)</div><small>พลังงานต่อประจุ / energy per charge</small></div>
      <div class="definition-card"><b>กระแส / Current</b><div class="def-eq">\(I=\dfrac{Q}{t}\)</div><small>ประจุต่อเวลา / charge per time</small></div>
      <div class="definition-card"><b>กำลัง / Power</b><div class="def-eq">\(P=\dfrac{E}{t}\)</div><small>พลังงานต่อเวลา / energy per time</small></div>
    </div>

    <div class="lesson-card">
      <div class="lesson-card-title">ไล่ทีละขั้น / Derive step by step</div>
      <div class="derive-stack">
        <div class="derive-line"><div class="derive-label">จากแรงดัน</div><div class="derive-arrow">→</div><div class="derive-main">\(V=\dfrac{E}{Q}\Rightarrow E=\) ${slotMath(String.raw`VQ`,'22mm')}</div></div>
        <div class="derive-line"><div class="derive-label">แทนในกำลัง</div><div class="derive-arrow">→</div><div class="derive-main">\(P=\dfrac{E}{t}=\dfrac{VQ}{t}=V\left(\dfrac{Q}{t}\right)\)</div></div>
        <div class="derive-line"><div class="derive-label">ใช้ความหมายกระแส</div><div class="derive-arrow">→</div><div class="derive-main">\(\dfrac{Q}{t}=\) ${slotMath(String.raw`I`,'14mm')}</div></div>
      </div>
    </div>

    <div class="guided-equation key"><span>ดังนั้น / Therefore</span><span>\(P=\)</span>${slotMath(String.raw`VI`,'22mm')}</div>

    <div class="lesson-grid-2">
      <div class="lesson-card soft">
        <div class="lesson-card-title">ตรวจหน่วย / Unit check</div>
        <div class="lesson-th">\(\mathrm V\times\mathrm A=(\mathrm{J/C})(\mathrm{C/s})=\mathrm{J/s}=\mathrm W\)</div>
        <div class="lesson-en">Volt × ampere gives joule per second, which is watt.</div>
      </div>
      <div class="lesson-card soft">
        <div class="lesson-card-title">แยกความหมายให้ชัด / Keep the ideas separate</div>
        <div class="lesson-th">\(V\): พลังงานต่อประจุ<br>\(I\): ประจุต่อเวลา<br>\(P\): พลังงานต่อเวลา</div>
        <div class="lesson-en">Voltage is energy per charge; current is charge per time; power is energy per time.</div>
      </div>
    </div>

    <div class="example-box">
      <div class="example-head">ตัวอย่าง — หลอดไฟ / Example — lamp</div>
      <div class="example-work">หลอดต่อกับ \(220\,\mathrm V\) และมีกระแส \(0.10\,\mathrm A\)</div>
      <div class="guided-equation"><span>\(P=VI=(220)(0.10)=\)</span>${slotMath(String.raw`22\,\mathrm W`,'24mm')}</div>
    </div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 2/3</span></div>
</section>

<section class="sheet lesson-sheet lesson-guided energy-power-v2" id="lesson-energy-power-3" data-topic="energy-power" aria-label="การเลือกสูตรกำลังไฟฟ้า">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 3/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">CONCEPT 3 • CHOOSE THE RIGHT FORM</div>
      <div class="lesson-title">เลือกสูตรกำลังจากข้อมูลที่โจทย์ให้</div>
      <div class="lesson-subtitle">Start from \(P=VI\), then use Ohm’s law only when needed.</div>
    </div>

    <div class="summary-bar">\(\boxed{P=VI}\qquad \boxed{P=I^2R}\qquad \boxed{P=\dfrac{V^2}{R}}\)</div>

    <div class="formula-row">
      <div class="formula-card"><div class="given">รู้ \(V,I\) / Given \(V,I\)</div><div class="formula">\(P=VI\)</div><div class="why">ใช้ตรง ๆ / use directly</div></div>
      <div class="formula-card"><div class="given">รู้ \(I,R\) / Given \(I,R\)</div><div class="formula">\(P=I^2R\)</div><div class="why">\(P=VI=I(IR)=I^2R\)</div></div>
      <div class="formula-card"><div class="given">รู้ \(V,R\) / Given \(V,R\)</div><div class="formula">\(P=\dfrac{V^2}{R}\)</div><div class="why">\(P=VI=V\left(\dfrac VR\right)\)</div></div>
    </div>

    <table class="choice-table">
      <thead><tr><th>ข้อมูลที่มี / Given</th><th>สูตรที่สะดวก / Convenient relation</th><th>เหตุผล / Reason</th></tr></thead>
      <tbody>
        <tr><td>\(V,I\)</td><td>\(P=VI\)</td><td>ไม่ต้องจัดรูปเพิ่ม</td></tr>
        <tr><td>\(I,R\)</td><td>\(P=I^2R\)</td><td>แทน \(V=IR\)</td></tr>
        <tr><td>\(V,R\)</td><td>\(P=V^2/R\)</td><td>แทน \(I=V/R\)</td></tr>
      </tbody>
    </table>

    <div class="lesson-grid-2">
      <div class="lesson-card soft">
        <div class="lesson-card-title">จากกำลังกลับไปหาพลังงาน / Power → energy</div>
        <div class="guided-equation"><span>\(E=\)</span>${slotMath(String.raw`Pt`,'24mm')}</div>
        <div class="lesson-note">วัตต์กับวินาทีให้จูล; กิโลวัตต์กับชั่วโมงให้กิโลวัตต์ชั่วโมง</div>
      </div>
      <div class="lesson-card soft">
        <div class="lesson-card-title">ค่าไฟ / Electricity cost</div>
        <div class="lesson-th">พลังงานเป็น \(\mathrm{kWh}\) × ราคาต่อยูนิต</div>
        <div class="lesson-en">Energy in kWh × price per unit.</div>
      </div>
    </div>

    <div class="example-box">
      <div class="example-head">ตัวอย่าง — รู้ \(V,R\) / Example — given \(V,R\)</div>
      <div class="example-work">เครื่องใช้ต่อกับ \(220\,\mathrm V\) มีความต้านทาน \(48.4\,\Omega\)</div>
      <div class="guided-equation"><span>\(P=\dfrac{V^2}{R}=\dfrac{220^2}{48.4}=\)</span>${slotMath(String.raw`1000\,\mathrm W`,'28mm')}</div>
    </div>

    <div class="closing-link">ลำดับคิดที่ควรจำ: <b>ดูข้อมูล → เลือกสูตรกำลัง → ถ้าถามพลังงานใช้ \(E=Pt\) → ถ้าถามค่าไฟเปลี่ยนเป็น kWh</b><br>Think in this order: given quantities → power relation → energy with \(E=Pt\) → kWh for electricity cost.</div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 3/3</span></div>
</section>`;

const lessonPagesForGroup=group=>group.key==='energy-power'?energyPowerLessonPages(group):defaultLessonPage(group);