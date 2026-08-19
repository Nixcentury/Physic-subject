/* Liquid Pressure Guided Notes v1 — page 1/4.
   Replaces the liquid-pressure lesson placeholder after the base document has rendered.
   Uses the existing Show/Hide Answers controls. Hidden answers keep their physical space. */
(function(){
  const placeholder=document.getElementById('lesson-liquid-pressure');
  if(!placeholder){console.warn('Liquid-pressure lesson placeholder not found.');return;}

  /* Keep the toolbar compact: use the existing Show/Hide Answers controls. */
  document.getElementById('showLessonsBtn')?.remove();
  document.getElementById('hideLessonsBtn')?.remove();

  const style=document.createElement('style');
  style.textContent=String.raw`
    .liquid-pressure-guide{grid-template-rows:auto minmax(0,1fr) auto!important;gap:3mm!important}
    .liquid-pressure-guide .lesson-body{min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:3mm}
    .liquid-pressure-guide .lesson-title{border:1.5px solid var(--navy);padding:3mm 4mm;background:#f8fafc}
    .liquid-pressure-guide .lesson-title h1{margin:0;font-size:18px;line-height:1.18;color:var(--navy)}
    .liquid-pressure-guide .lesson-title .en-title{margin-top:1mm;color:#475569;font-size:10.5px;font-weight:600;line-height:1.35}
    .lp-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:3mm;min-height:0}
    .lp-card{border:1.4px solid var(--navy);background:#fff;padding:3mm;min-height:0}
    .lp-card h2{margin:0 0 1.7mm;font-size:13.5px;color:var(--navy);line-height:1.25}
    .lp-card h3{margin:2mm 0 1mm;font-size:11.4px;color:#334155}
    .lp-en{display:block;margin-top:.5mm;color:#64748b;font-size:9px;font-weight:400;line-height:1.4}
    .lp-svg{display:block;width:100%;height:auto;max-height:58mm;margin:1mm auto 2mm}
    .lp-prompt{margin:1.4mm 0;font-size:10.7px;line-height:1.5}
    .lp-callout{margin-top:2mm;padding:2.1mm 2.6mm;border-left:3px solid #475569;background:#f8fafc;font-size:10.1px;line-height:1.48}
    .lp-warning{border-left-color:#b45309;background:#fffbeb}
    .lp-check{border-left-color:#047857;background:#ecfdf5}
    .lp-derive{display:grid;gap:1.2mm;margin-top:1.5mm}
    .lp-row{display:grid;grid-template-columns:28mm 1fr;align-items:center;gap:2mm;min-height:11mm;padding:1.3mm 1.8mm;border:1px solid #e2e8f0;background:#fff}
    .lp-step{font-size:9px;font-weight:800;color:#475569;line-height:1.3}
    .lp-formula{text-align:center;font-size:10.8px;line-height:1.4}
    .lp-final{margin-top:2mm;padding:2.2mm;border:1.6px solid var(--navy);background:#f8fafc;text-align:center;font-size:13px;font-weight:800}
    .lp-fixed-answer{min-height:16mm;border:1px dashed #94a3b8;padding:2mm 2.5mm;background:#fff;font-size:10.1px;line-height:1.45}
    .lp-symbols{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5mm;margin-top:1.8mm}
    .lp-symbol{border:1px solid #cbd5e1;padding:1.5mm;text-align:center;background:#fff;min-height:16mm}
    .lp-symbol b{display:block;font-size:11px;color:var(--navy)}
    .lp-symbol small{display:block;color:#64748b;font-size:8.4px;line-height:1.35;margin-top:.5mm}
    .fill{display:inline-flex;align-items:flex-end;justify-content:center;min-width:25mm;min-height:6mm;border-bottom:1.3px solid #334155;padding:0 1.2mm;vertical-align:baseline}
    .fill.short{min-width:15mm}.fill.wide{min-width:42mm}
    .guided-answer{visibility:hidden;font-weight:750;color:#0f172a}
    .guided-answer-block{visibility:hidden;min-height:inherit}
    body.show-answers .guided-answer,body.print-answers .guided-answer,
    body.show-answers .guided-answer-block,body.print-answers .guided-answer-block{visibility:visible!important}
    body.print-questions .guided-answer,body.print-questions .guided-answer-block{visibility:hidden!important}
    @media(max-width:720px){
      .lp-grid-2,.lp-symbols{grid-template-columns:1fr}
      .lp-row{grid-template-columns:1fr}.lp-step{text-align:center}
      .liquid-pressure-guide{height:auto!important;min-height:297mm}
      .lp-svg{max-height:none}
    }
    @media print{
      .liquid-pressure-guide{height:297mm!important}
      .liquid-pressure-guide .lesson-title h1{font-size:16px}
      .lp-card{padding:2.4mm}.lp-svg{max-height:52mm}
      .lp-prompt,.lp-callout,.lp-fixed-answer{font-size:9.2px}.lp-en{font-size:8px}
      .lp-formula{font-size:9.6px}
      .guided-answer,.guided-answer-block{visibility:hidden}
      body.print-answers .guided-answer,body.print-answers .guided-answer-block{visibility:visible!important}
      body.print-questions .guided-answer,body.print-questions .guided-answer-block{visibility:hidden!important}
    }
  `;
  document.head.appendChild(style);

  const page1=String.raw`
  <section class="sheet lesson-sheet liquid-pressure-guide" id="lesson-liquid-pressure-1" data-topic="liquid-pressure">
    <div class="topline"><div class="topic">ความดันในของเหลว / Pressure in Liquids</div><div class="qno">GUIDED NOTES 1/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title">
        <h1>1. “แรงเท่ากัน” ไม่ได้แปลว่า “กดเท่ากัน” — เราจึงต้องมีปริมาณที่เรียกว่า ความดัน</h1>
        <div class="en-title">The same force does not necessarily mean the same pressing effect — this motivates the idea of pressure.</div>
      </div>

      <div class="lp-grid-2">
        <div class="lp-card">
          <h2>ฉุกคิด A — แรงเท่ากัน แต่พื้นที่ไม่เท่ากัน <span class="lp-en">Same force, different contact areas</span></h2>
          <svg class="lp-svg" viewBox="0 0 760 330" role="img" aria-label="Two blocks pressed downward by the same force, one with large contact area and one with small contact area">
            <defs>
              <marker id="lpArrow1" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker>
            </defs>
            <line x1="35" y1="270" x2="725" y2="270" stroke="#64748b" stroke-width="5"/>
            <rect x="80" y="175" width="250" height="90" rx="8" fill="#e2e8f0" stroke="#334155" stroke-width="4"/>
            <rect x="505" y="175" width="90" height="90" rx="8" fill="#e2e8f0" stroke="#334155" stroke-width="4"/>
            <line x1="205" y1="50" x2="205" y2="155" stroke="#0f172a" stroke-width="7" marker-end="url(#lpArrow1)"/>
            <line x1="550" y1="50" x2="550" y2="155" stroke="#0f172a" stroke-width="7" marker-end="url(#lpArrow1)"/>
            <text x="205" y="38" text-anchor="middle" font-size="25" font-weight="700" fill="#0f172a">F</text>
            <text x="550" y="38" text-anchor="middle" font-size="25" font-weight="700" fill="#0f172a">F</text>
            <line x1="95" y1="300" x2="315" y2="300" stroke="#475569" stroke-width="3"/>
            <line x1="515" y1="300" x2="585" y2="300" stroke="#475569" stroke-width="3"/>
            <text x="205" y="326" text-anchor="middle" font-size="20" fill="#475569">พื้นที่มาก / larger A</text>
            <text x="550" y="326" text-anchor="middle" font-size="20" fill="#475569">พื้นที่น้อย / smaller A</text>
          </svg>
          <div class="lp-prompt">ทั้งสองกรณีถูกกดด้วยแรง \(F\) เท่ากัน แต่กรณีใดมีผลของการกด “เข้มข้นกว่า” ต่อพื้นที่หนึ่งหน่วย?<span class="lp-en">Both are pushed with the same force \(F\). Which case produces a more concentrated pressing effect per unit area?</span></div>
          <div class="lp-fixed-answer"><div class="guided-answer-block"><b>คำตอบ / Answer:</b> ด้านที่มีพื้นที่สัมผัสน้อยกว่า เพราะแรงเท่าเดิมถูกกระจายบนพื้นที่ที่เล็กกว่า จึงเกิดความดันมากกว่า.<span class="lp-en">The smaller contact area has the greater pressure because the same force is distributed over less area.</span></div></div>
          <div class="lp-callout lp-check"><b>แนวคิดสำคัญ:</b> ถ้าจะเปรียบเทียบว่า “กดมากแค่ไหน” เราไม่ควรดูแรงอย่างเดียว แต่ต้องดูด้วยว่าแรงนั้นกระจายบนพื้นที่เท่าใด.<span class="lp-en">To compare pressing effects, force alone is not enough; the area matters too.</span></div>
        </div>

        <div class="lp-card">
          <h2>สร้างนิยามของความดัน <span class="lp-en">Build the definition of pressure</span></h2>
          <div class="lp-prompt">เราต้องการปริมาณที่บอก <b>แรงตั้งฉากต่อหนึ่งหน่วยพื้นที่</b> จึงนิยาม “ความดัน” ว่า<span class="lp-en">We want a quantity that measures normal force per unit area, so pressure is defined as</span></div>
          <div class="lp-derive">
            <div class="lp-row"><div class="lp-step">ชื่อปริมาณ<br>Quantity</div><div class="lp-formula">ความดัน / Pressure = <span class="fill wide"><span class="guided-answer">แรงตั้งฉากต่อพื้นที่หนึ่งหน่วย</span></span></div></div>
            <div class="lp-row"><div class="lp-step">สมการ<br>Equation</div><div class="lp-formula"><span class="guided-answer">\(\displaystyle P=\frac{F}{A}\)</span></div></div>
            <div class="lp-row"><div class="lp-step">หน่วย SI<br>SI unit</div><div class="lp-formula"><span class="guided-answer">\(\displaystyle \frac{\mathrm N}{\mathrm{m^2}}=\mathrm{Pa}\)</span></div></div>
          </div>
          <div class="lp-final"><span class="guided-answer">\(\boxed{P=\dfrac{F}{A}}\)</span></div>
          <div class="lp-symbols">
            <div class="lp-symbol"><b>\(P\)</b><small>ความดัน / pressure<br>หน่วย Pa</small></div>
            <div class="lp-symbol"><b>\(F\)</b><small>แรงตั้งฉาก / normal force<br>หน่วย N</small></div>
            <div class="lp-symbol"><b>\(A\)</b><small>พื้นที่ / area<br>หน่วย m²</small></div>
          </div>
          <div class="lp-callout lp-warning"><b>ระวัง:</b> ความดันไม่ใช่แรง. ความดันบอกว่าแรงถูกกระจายบนพื้นที่อย่างไร ส่วนแรงมีหน่วยเป็น N แต่ความดันมีหน่วยเป็น Pa.<span class="lp-en"><b>Careful:</b> Pressure is not force. Pressure describes force per area; force is measured in N, pressure in Pa.</span></div>
        </div>
      </div>

      <div class="lp-grid-2">
        <div class="lp-card">
          <h2>ของเหลวที่อยู่นิ่งก็ดันผิวรอบตัว <span class="lp-en">A fluid at rest pushes on surrounding surfaces</span></h2>
          <svg class="lp-svg" viewBox="0 0 760 300" role="img" aria-label="Water in a container exerting normal forces on the bottom and side walls">
            <defs>
              <marker id="lpArrow2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker>
            </defs>
            <path d="M130 45 V245 H630 V45" fill="none" stroke="#334155" stroke-width="7" stroke-linecap="round"/>
            <rect x="137" y="95" width="486" height="143" fill="#e0f2fe"/>
            <line x1="250" y1="214" x2="250" y2="270" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="385" y1="214" x2="385" y2="270" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="520" y1="214" x2="520" y2="270" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="155" y1="145" x2="90" y2="145" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="155" y1="205" x2="90" y2="205" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="605" y1="145" x2="670" y2="145" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <line x1="605" y1="205" x2="670" y2="205" stroke="#0f172a" stroke-width="6" marker-end="url(#lpArrow2)"/>
            <text x="380" y="82" text-anchor="middle" font-size="22" font-weight="700" fill="#0369a1">ของเหลวอยู่นิ่ง / fluid at rest</text>
          </svg>
          <div class="lp-prompt">ลูกศรแทนแรงที่ของเหลวกระทำต่อผิวภาชนะ สังเกตว่าทิศของแรงที่แต่ละจุดเป็นอย่างไรเมื่อเทียบกับผิว?<span class="lp-en">The arrows show forces exerted by the fluid. How is each force directed relative to the surface?</span></div>
          <div class="lp-fixed-answer"><div class="guided-answer-block"><b>เติม / Fill:</b> แรงเนื่องจากความดันกระทำ <span class="fill"><span class="guided-answer">ตั้งฉากกับผิว</span></span><span class="lp-en">Pressure force acts <b>normal (perpendicular) to the surface</b>.</span></div></div>
        </div>

        <div class="lp-card">
          <h2>ฉุกคิด B — จุดไหนน่าจะมีความดันมากกว่า? <span class="lp-en">Which point should have the greater pressure?</span></h2>
          <svg class="lp-svg" viewBox="0 0 760 300" role="img" aria-label="Three points A, B and C inside water, where B and C are at the same depth and deeper than A">
            <path d="M120 35 V260 H640 V35" fill="none" stroke="#334155" stroke-width="7" stroke-linecap="round"/>
            <rect x="127" y="80" width="506" height="173" fill="#e0f2fe"/>
            <line x1="127" y1="80" x2="633" y2="80" stroke="#0284c7" stroke-width="4"/>
            <circle cx="260" cy="130" r="10" fill="#0f172a"/><text x="282" y="138" font-size="25" font-weight="700" fill="#0f172a">A</text>
            <circle cx="255" cy="215" r="10" fill="#0f172a"/><text x="277" y="223" font-size="25" font-weight="700" fill="#0f172a">B</text>
            <circle cx="500" cy="215" r="10" fill="#0f172a"/><text x="522" y="223" font-size="25" font-weight="700" fill="#0f172a">C</text>
            <line x1="190" y1="130" x2="190" y2="215" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
            <text x="150" y="180" font-size="19" fill="#475569">ลึกขึ้น</text>
            <line x1="235" y1="235" x2="520" y2="235" stroke="#64748b" stroke-width="3" stroke-dasharray="8 7"/>
            <text x="380" y="285" text-anchor="middle" font-size="18" fill="#475569">B และ C อยู่ระดับเดียวกัน / same depth</text>
          </svg>
          <div class="lp-prompt">ก่อนเห็นสูตรของความดันในของเหลว ลองคาดเดา: \(P_A\) เทียบกับ \(P_B\) เป็นอย่างไร และ \(P_B\) เทียบกับ \(P_C\) เป็นอย่างไร?<span class="lp-en">Before seeing the hydrostatic-pressure equation, predict how \(P_A\) compares with \(P_B\), and how \(P_B\) compares with \(P_C\).</span></div>
          <div class="lp-fixed-answer"><div class="guided-answer-block"><b>คาดการณ์ / Prediction:</b> จุดที่ลึกกว่าน่าจะมีความดันมากกว่า จึงคาดว่า <b>\(P_B&gt;P_A\)</b> และเพราะ B กับ C ลึกเท่ากันจึงคาดว่า <b>\(P_B=P_C\)</b>.<span class="lp-en">A deeper point should have greater pressure, while points at the same depth should have the same pressure. We will prove this from \(P=\rho gh\) on the next pages.</span></div></div>
          <div class="lp-callout"><b>อย่าเพิ่งจำสูตร:</b> ตอนนี้ให้เก็บคำถามนี้ไว้ก่อน — <b>ทำไมความลึกจึงเกี่ยวกับความดัน?</b> หน้า 2 เราจะสร้างสมการจากน้ำหนึ่งแท่งและน้ำหนักของมันเอง.<span class="lp-en">Do not memorize a formula yet. On page 2 we will derive the relation from the weight of a column of liquid.</span></div>
        </div>
      </div>
    </div>
    <div class="footer"><span>KRU KIRD • Guided Notes</span><span>ก่อนข้อ 15–25 / Before Q15–Q25</span></div>
  </section>`;

  const template=document.createElement('template');
  template.innerHTML=page1.trim();
  const pageNode=template.content.firstElementChild;
  placeholder.replaceWith(pageNode);

  const typeset=()=>{
    if(window.MathJax && typeof window.MathJax.typesetPromise==='function'){
      window.MathJax.typesetPromise([pageNode]).catch(err=>console.warn('Liquid-pressure MathJax typeset failed:',err));
    }
  };
  typeset();
  setTimeout(typeset,250);
})();
