/* Guided Notes: Electrical Energy and Power / พลังงานและกำลังไฟฟ้า
   Inject before `const groupedQuestions=`. The main loader also replaces the
   default one-page lesson placeholder with lessonPagesForGroup(group).
*/
const guidedLessonStyle=document.createElement('style');
guidedLessonStyle.textContent=String.raw`
.lesson-guided{grid-template-rows:auto minmax(0,1fr) auto}.lesson-guided-body{min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:2.2mm}.lesson-hero{border:1.4px solid var(--navy);padding:3mm;background:#fff}.lesson-kicker{font-size:9px;font-weight:800;letter-spacing:.02em;color:#64748b;text-transform:uppercase}.lesson-title{font-size:18px;line-height:1.15;font-weight:800;color:var(--navy);margin-top:.8mm}.lesson-subtitle{font-size:9.5px;color:#475569;margin-top:.8mm}.lesson-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:2.4mm}.lesson-grid-3{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2mm}.lesson-card{border:1.15px solid #94a3b8;background:#fff;padding:2.6mm;min-width:0}.lesson-card.soft{background:#f8fafc}.lesson-card strong{color:var(--navy)}.lesson-card-title{font-size:11px;font-weight:800;color:var(--navy);margin-bottom:1.2mm}.lesson-th{font-size:10.5px;font-weight:550;line-height:1.4}.lesson-en{font-size:8.8px;color:#475569;line-height:1.35;margin-top:.7mm;padding-top:.7mm;border-top:1px dotted #cbd5e1}.lesson-eq{margin:1mm 0;text-align:center;font-size:11px}.lesson-eq.big{font-size:14px;font-weight:800}.lesson-eqbox{border:1.4px solid var(--navy);background:#f8fafc;padding:2mm 2.5mm;text-align:center;font-size:13px;font-weight:800}.lesson-note{font-size:8.5px;color:#64748b;line-height:1.35}.lesson-slot{--slot-w:24mm;display:inline-grid;place-items:center;min-width:var(--slot-w);height:1.45em;border-bottom:1.2px solid #334155;vertical-align:baseline;margin:0 .4mm}.lesson-fill{visibility:hidden;font-weight:800;color:#0f172a}.show-answers .lesson-fill{visibility:visible}.lesson-arrow{font-weight:800;color:#334155}.rating-row{display:grid;grid-template-columns:58mm 1fr;gap:3mm;align-items:stretch}.rating-photo{border:1px solid #94a3b8;background:#fff;display:grid;place-items:center;min-height:48mm;overflow:hidden;position:relative}.rating-photo img{max-width:100%;max-height:52mm;object-fit:contain;display:block}.rating-photo-fallback{display:none;padding:5mm;text-align:center;font-size:10px;color:#64748b}.rating-photo.image-failed img{display:none}.rating-photo.image-failed .rating-photo-fallback{display:block}.rating-caption{font-size:8px;color:#64748b;margin-top:.7mm}.unit-path{border:1.2px solid #94a3b8;padding:2.4mm;background:#fff}.unit-path .path-head{font-size:10.5px;font-weight:800;color:var(--navy)}.unit-path .path-main{margin-top:1.2mm;text-align:center;font-size:11px;font-weight:750}.example-box{border:1.2px solid var(--navy);padding:2.5mm;background:#fff}.example-head{display:flex;justify-content:space-between;gap:4mm;align-items:baseline;margin-bottom:1mm}.example-head b{font-size:10.5px;color:var(--navy)}.example-head span{font-size:8px;color:#64748b}.example-work{font-size:9.8px;line-height:1.48}.circuit-stage{border:1.2px solid #94a3b8;background:#fff;padding:2mm;height:50mm;display:grid;place-items:center}.circuit-stage svg{width:100%;height:100%}.review-row{display:grid;grid-template-columns:1fr 1fr;gap:2.2mm}.review-mini{border:1px solid #cbd5e1;background:#fff;padding:2.3mm}.review-mini h3{font-size:10.5px;margin:0 0 1mm;color:var(--navy)}.review-mini .thline{font-size:9.7px;font-weight:550}.review-mini .enline{font-size:8.1px;color:#64748b;margin-top:.6mm}.derive-box{border:1.4px solid var(--navy);background:#f8fafc;padding:2.8mm}.derive-title{font-size:11px;font-weight:800;color:var(--navy);margin-bottom:1.2mm}.derive-flow{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5mm;align-items:stretch}.derive-step{border:1px solid #cbd5e1;background:#fff;padding:1.8mm;text-align:center;font-size:9.4px;display:grid;place-items:center;min-height:21mm}.formula-choice{display:grid;grid-template-columns:repeat(3,1fr);gap:2.2mm}.formula-card{border:1.3px solid #64748b;background:#fff;padding:3mm;text-align:center}.formula-card .given{font-size:8.7px;color:#64748b;margin-bottom:1mm}.formula-card .formula{font-size:14px;font-weight:800;color:var(--navy)}.formula-derive{border-top:1px dotted #94a3b8;margin-top:1.5mm;padding-top:1.5mm;font-size:9px;line-height:1.45}.formula-summary{border:1.6px solid var(--navy);padding:3mm;background:#f8fafc;text-align:center;font-size:14px;font-weight:800}.closing-link{font-size:9.5px;text-align:center;color:#334155}.lesson-badge{display:inline-block;border:1px solid #94a3b8;border-radius:999px;padding:.7mm 2mm;font-size:8px;font-weight:800;color:#475569;background:#fff}
@media(max-width:720px){.rating-row,.lesson-grid-2,.lesson-grid-3,.review-row,.formula-choice{grid-template-columns:1fr}.derive-flow{grid-template-columns:1fr 1fr}.lesson-guided{height:auto!important}.lesson-guided-body{overflow:visible}.circuit-stage{height:54mm}}
@media print{body.print-answers .lesson-fill{visibility:visible!important}body.print-questions .lesson-fill{visibility:hidden!important}.lesson-guided-body{overflow:hidden!important}}
`;
document.head.appendChild(guidedLessonStyle);

const lessonSlot=(answer,width='24mm')=>`<span class="lesson-slot" style="--slot-w:${width}"><span class="lesson-fill">${answer}</span></span>`;

const defaultLessonPage=group=>`
<section class="sheet lesson-sheet" id="lesson-${group.key}" data-topic="${group.key}" aria-label="หน้าสำหรับใบความรู้: ${group.title}">
  <div class="topline"><div class="topic">${group.title}</div><div class="qno">ใบความรู้ / Lesson</div></div>
  <div class="lesson-placeholder"><div><div class="lesson-placeholder-title">เว้นไว้สำหรับแทรกเนื้อหา</div><div class="lesson-placeholder-note">Reserved for lesson content</div></div></div>
  <div class="footer"><span>PEC9 Electricity • Lesson Placeholder</span><span>ก่อนข้อ ${group.start}–${group.end} / Before Q${group.start}–Q${group.end}</span></div>
</section>`;

const energyPowerLessonPages=group=>String.raw`
<section class="sheet lesson-sheet lesson-guided" id="lesson-energy-power-1" data-topic="energy-power" aria-label="พลังงานไฟฟ้าจากฉลากกำลัง">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 1/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">BOX 1 • READ THE RATING</div>
      <div class="lesson-title">จากฉลากกำลังไฟฟ้า → พลังงานไฟฟ้า</div>
      <div class="lesson-subtitle">From an appliance power rating to electrical energy</div>
    </div>

    <div class="rating-row">
      <div>
        <div class="rating-photo">
          <img src="https://www.thianthong.com/pub/media/_product_images/2022_9/FSL-LED-Bulb-9w-11w_Wwww.jpg" alt="ฉลาก/ภาพผลิตภัณฑ์หลอดไฟ LED FSL" onerror="this.parentElement.classList.add('image-failed')">
          <div class="rating-photo-fallback"><b>หลอดไฟ LED / LED bulb</b><br>พิจารณารุ่นพิกัด \(9\,\mathrm W\)<br>Use the \(9\,\mathrm W\) rating.</div>
        </div>
        <div class="rating-caption">ภาพอ้างอิงจากลิงก์ผลิตภัณฑ์ที่ใช้ในชั้นเรียน / Reference product image used in class</div>
      </div>
      <div class="lesson-card soft">
        <div class="lesson-card-title">อ่านค่าจากฉลาก / Read the label</div>
        <div class="lesson-th">พิจารณาหลอดรุ่น \(9\,\mathrm W\) กำลังพิกัดคือ \(P=${lessonSlot('\(9\,\mathrm W\)','22mm')}\)</div>
        <div class="lesson-en">For the \(9\,\mathrm W\) model, the rated power is \(P=${lessonSlot('\(9\,\mathrm W\)','22mm')}\).</div>
        <div class="lesson-th" style="margin-top:2mm">ความหมายของ \(9\,\mathrm W\): เครื่องเปลี่ยน/ใช้พลังงาน ${lessonSlot('\(9\,\mathrm J\)','20mm')} ในเวลา ${lessonSlot('\(1\,\mathrm s\)','18mm')}</div>
        <div class="lesson-en">A \(9\,\mathrm W\) rating means \(9\,\mathrm J\) of energy per \(1\,\mathrm s\).</div>
        <div class="lesson-eq big">\[1\,\mathrm W=1\,\mathrm{J/s}\]</div>
      </div>
    </div>

    <div class="lesson-eqbox">
      \[P=\frac{W}{t}\qquad\Longrightarrow\qquad W=${lessonSlot('\(Pt\)','25mm')}\]
    </div>
    <div class="lesson-note">ในหน้านี้ \(W\) เป็นตัวแปรแทนพลังงาน/งาน แต่ \(\mathrm W\) ตัวตั้งตรงเป็นหน่วยวัตต์ / Here \(W\) is an energy/work variable, while upright \(\mathrm W\) denotes watt.</div>

    <div class="lesson-grid-2">
      <div class="unit-path">
        <div class="path-head">ทางที่ 1: จูล / Joules</div>
        <div class="lesson-th">ใช้ \(P\) เป็นวัตต์ และ \(t\) เป็นวินาที</div>
        <div class="lesson-en">Use watts for \(P\) and seconds for \(t\).</div>
        <div class="path-main">\[\mathrm W\times\mathrm s=\mathrm J\]</div>
        <div class="lesson-th">ดังนั้น \(W\) มีหน่วย ${lessonSlot('\(\mathrm J\)','18mm')}</div>
      </div>
      <div class="unit-path">
        <div class="path-head">ทางที่ 2: ยูนิตไฟฟ้า / Electricity units</div>
        <div class="lesson-th">ใช้ \(P\) เป็นกิโลวัตต์ และ \(t\) เป็นชั่วโมง</div>
        <div class="lesson-en">Use kilowatts for \(P\) and hours for \(t\).</div>
        <div class="path-main">\[\mathrm{kW}\times\mathrm h=\mathrm{kWh}\]</div>
        <div class="lesson-th">${lessonSlot('\(1\text{ unit}=1\,\mathrm{kWh}\)','40mm')}</div>
        <div class="lesson-note">และ \(1\,\mathrm{kWh}=3.6\times10^6\,\mathrm J\)</div>
      </div>
    </div>

    <div class="lesson-grid-2">
      <div class="example-box">
        <div class="example-head"><b>ตัวอย่าง A — หน่วยจูล</b><span>Example A — joules</span></div>
        <div class="example-work">หลอด \(9\,\mathrm W\) เปิด \(30\,\mathrm s\)<br>
        \[W=Pt=(9)(30)=${lessonSlot('\(270\,\mathrm J\)','28mm')}\]</div>
      </div>
      <div class="example-box">
        <div class="example-head"><b>ตัวอย่าง B — ยูนิตและค่าไฟ</b><span>Example B — units & cost</span></div>
        <div class="example-work">เครื่อง \(1000\,\mathrm W=1\,\mathrm{kW}\) ใช้ \(3\,\mathrm h\)<br>
        \[W=(1)(3)=${lessonSlot('\(3\,\mathrm{kWh}=3\text{ units}\)','43mm')}\]
        ถ้าหน่วยละ \(4\) บาท: ค่าไฟ \(=3\times4=${lessonSlot('\(12\text{ บาท}\)','25mm')}\)</div>
      </div>
    </div>

    <div class="lesson-card soft">
      <div class="lesson-th"><strong>เชื่อมกับชีวิตจริง / Real-life link:</strong> พลังงานไฟฟ้าที่คิดเป็น \(\mathrm{kWh}\) หรือ “ยูนิต” คือปริมาณที่นำไปใช้คำนวณ ${lessonSlot('ค่าไฟฟ้า / electricity cost','43mm')}</div>
    </div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 1/3</span></div>
</section>

<section class="sheet lesson-sheet lesson-guided" id="lesson-energy-power-2" data-topic="energy-power" aria-label="ที่มาของกำลังไฟฟ้า P เท่ากับ VI">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 2/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">BOX 2 • WHERE DOES P COME FROM?</div>
      <div class="lesson-title">ที่มาของกำลังไฟฟ้า \(P=VI\)</div>
      <div class="lesson-subtitle">Review voltage, current and resistance, then build the power equation</div>
    </div>

    <div class="circuit-stage" aria-label="วงจรง่ายมี V I R">
      <svg viewBox="0 0 760 190" role="img" aria-label="Simple circuit showing voltage V, current I and resistor R">
        <defs><marker id="arrowI" markerWidth="9" markerHeight="9" refX="7" refY="3" orient="auto"><path d="M0,0 L0,6 L8,3 z" fill="#0f172a"/></marker></defs>
        <path d="M100 50 H300" stroke="#0f172a" stroke-width="5" fill="none"/>
        <path d="M460 50 H650 V150 H100 V50" stroke="#0f172a" stroke-width="5" fill="none"/>
        <rect x="300" y="34" width="160" height="32" rx="4" fill="#fff" stroke="#0f172a" stroke-width="4"/>
        <text x="380" y="56" text-anchor="middle" font-size="24" font-family="Arial" font-weight="700">R</text>
        <line x1="100" y1="92" x2="100" y2="132" stroke="#0f172a" stroke-width="5"/>
        <line x1="82" y1="103" x2="118" y2="103" stroke="#0f172a" stroke-width="5"/>
        <line x1="90" y1="120" x2="110" y2="120" stroke="#0f172a" stroke-width="5"/>
        <line x1="205" y1="50" x2="275" y2="50" stroke="#0f172a" stroke-width="4" marker-end="url(#arrowI)"/>
        <text x="235" y="33" text-anchor="middle" font-size="23" font-family="Arial" font-weight="700">I</text>
        <line x1="300" y1="92" x2="460" y2="92" stroke="#64748b" stroke-width="2"/>
        <line x1="300" y1="82" x2="300" y2="102" stroke="#64748b" stroke-width="2"/>
        <line x1="460" y1="82" x2="460" y2="102" stroke="#64748b" stroke-width="2"/>
        <text x="380" y="121" text-anchor="middle" font-size="23" font-family="Arial" font-weight="700" fill="#334155">V</text>
        <text x="555" y="178" text-anchor="middle" font-size="17" font-family="Arial" fill="#475569">V drives current I through resistance R</text>
      </svg>
    </div>

    <div class="review-row">
      <div class="review-mini">
        <h3>1. ความต่างศักย์ / Potential difference</h3>
        <div class="thline">\(1\,\mathrm V\) หมายถึงพลังงาน \(1\,\mathrm J\) ต่อประจุ \(1\,\mathrm C\)</div>
        <div class="enline">One volt means one joule of energy per coulomb of charge.</div>
        <div class="lesson-eq">\[V=\frac{E}{Q}\qquad 1\,\mathrm V=1\,\mathrm{J/C}\]</div>
        <div class="lesson-note">บางตำรา/ครูเขียน \(V=W/Q\) โดย \(W\) หมายถึงงานหรือพลังงาน / Some texts use \(V=W/Q\).</div>
      </div>
      <div class="review-mini">
        <h3>2. กระแสไฟฟ้า / Electric current</h3>
        <div class="thline">กระแสคือปริมาณประจุที่ผ่านหน้าตัดของตัวนำต่อเวลา</div>
        <div class="enline">Current is the amount of charge passing a cross-section per unit time.</div>
        <div class="lesson-eq">\[I=\frac{Q}{t}\qquad 1\,\mathrm A=1\,\mathrm{C/s}\]</div>
      </div>
    </div>

    <div class="review-row">
      <div class="review-mini">
        <h3>3. ความต้านทาน / Resistance</h3>
        <div class="thline">\(R\) เป็นสมบัติที่ต้านการไหลของกระแส หน่วยโอห์ม \(\Omega\)</div>
        <div class="enline">\(R\) describes resistance to current flow; its unit is the ohm.</div>
        <div class="lesson-eq">\[\boxed{V=IR}\]</div>
        <div class="thline">เมื่อ \(V\) เท่าเดิม: \(R\) มาก → \(I\) น้อย, \(R\) น้อย → \(I\) มาก</div>
        <div class="lesson-note">ความนำไฟฟ้า / Conductance: \(oxed{G=1/R}\), หน่วย \(\mathrm S\) (siemens)</div>
      </div>
      <div class="review-mini">
        <h3>4. กำลัง / Power</h3>
        <div class="thline">กำลังคืออัตราการเปลี่ยนหรือถ่ายโอนพลังงานต่อเวลา</div>
        <div class="enline">Power is the rate of energy transfer or conversion.</div>
        <div class="lesson-eq">\[P=\frac{E}{t}\qquad 1\,\mathrm W=1\,\mathrm{J/s}\]</div>
      </div>
    </div>

    <div class="derive-box">
      <div class="derive-title">สร้างสมการกำลังไฟฟ้า / Build the electrical-power equation</div>
      <div class="derive-flow">
        <div class="derive-step">\(V=\dfrac{E}{Q}\)<br>\(\Rightarrow E=${lessonSlot('\(VQ\)','21mm')}\)</div>
        <div class="derive-step">\(P=\dfrac{E}{t}\)<br>\(\Rightarrow P=\dfrac{VQ}{t}\)</div>
        <div class="derive-step">\(P=V\left(\dfrac{Q}{t}\right)\)<br>และ \(\dfrac Qt=${lessonSlot('\(I\)','13mm')}\)</div>
        <div class="derive-step" style="border-color:#0f172a;border-width:1.4px;font-size:12px;font-weight:800">\[\boxed{P=${lessonSlot('\(VI\)','20mm')}}\]</div>
      </div>
    </div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 2/3</span></div>
</section>

<section class="sheet lesson-sheet lesson-guided" id="lesson-energy-power-3" data-topic="energy-power" aria-label="จัดรูปสมการกำลังไฟฟ้า">
  <div class="topline"><div class="topic">พลังงานและกำลังไฟฟ้า / Electrical Energy and Power</div><div class="qno">Guided Notes 3/3</div></div>
  <div class="lesson-guided-body">
    <div class="lesson-hero">
      <div class="lesson-kicker">BOX 3 • REARRANGE THE POWER EQUATION</div>
      <div class="lesson-title">เลือกสูตรกำลังให้ตรงกับข้อมูล</div>
      <div class="lesson-subtitle">Use Ohm’s law to rewrite \(P=VI\)</div>
    </div>

    <div class="lesson-grid-2">
      <div class="lesson-card">
        <div class="lesson-card-title">เริ่มจาก / Start from</div>
        <div class="lesson-eq big">\[\boxed{P=VI}\]</div>
      </div>
      <div class="lesson-card">
        <div class="lesson-card-title">กฎของโอห์ม / Ohm’s law</div>
        <div class="lesson-eq big">\[\boxed{V=IR}\qquad I=\frac VR\]</div>
      </div>
    </div>

    <div class="formula-choice">
      <div class="formula-card">
        <div class="given">รู้ \(V,I\) / Given \(V,I\)</div>
        <div class="formula">\(P=VI\)</div>
        <div class="formula-derive">ใช้ได้โดยตรง / Use directly.</div>
      </div>
      <div class="formula-card">
        <div class="given">รู้ \(I,R\) / Given \(I,R\)</div>
        <div class="formula">\(P=${lessonSlot('\(I^2R\)','26mm')}\)</div>
        <div class="formula-derive">\[P=VI=I(IR)=I^2R\]</div>
      </div>
      <div class="formula-card">
        <div class="given">รู้ \(V,R\) / Given \(V,R\)</div>
        <div class="formula">\(P=${lessonSlot('\(V^2/R\)','30mm')}\)</div>
        <div class="formula-derive">\[P=VI=V\left(\frac VR\right)=\frac{V^2}{R}\]</div>
      </div>
    </div>

    <div class="formula-summary">
      \[\boxed{P=VI\qquad P=I^2R\qquad P=\frac{V^2}{R}}\]
    </div>

    <div class="lesson-card soft">
      <div class="lesson-card-title">เลือกจากข้อมูล ไม่ใช่จำแยกสามสูตร / Choose from the given quantities</div>
      <div class="lesson-grid-3">
        <div class="lesson-th" style="text-align:center">มี \(V,I\)<br><span class="lesson-arrow">→</span> \(P=VI\)</div>
        <div class="lesson-th" style="text-align:center">มี \(I,R\)<br><span class="lesson-arrow">→</span> \(P=I^2R\)</div>
        <div class="lesson-th" style="text-align:center">มี \(V,R\)<br><span class="lesson-arrow">→</span> \(P=V^2/R\)</div>
      </div>
    </div>

    <div class="lesson-eqbox">
      เมื่อได้กำลังแล้ว กลับไปหาพลังงานด้วย / Once power is known, return to energy with
      \[\boxed{W=Pt}\]
    </div>
    <div class="closing-link">จบแกนหลักของเรื่อง: ฉลากกำลัง → พลังงาน → ค่าไฟ → ที่มาของ \(P=VI\) → จัดรูปด้วยกฎของโอห์ม<br>Core chain complete: rating → energy → electricity cost → \(P=VI\) → Ohm’s-law forms.</div>
  </div>
  <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Energy & Power • 3/3</span></div>
</section>`;

const lessonPagesForGroup=group=>group.key==='energy-power'?energyPowerLessonPages(group):defaultLessonPage(group);
