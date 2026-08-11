/* Continuity guided notes + Q53-Q60 detailed solutions.
   Loaded by solids-and-fluids-kru-kird-bilingual.html before const topics=[ ... ] */

const continuitySolutions = {
  '17.4.2-1': String.raw`<div class="solution-step"><div class="solution-th"><b>1. ใช้สมการความต่อเนื่อง</b> สำหรับน้ำซึ่งถือว่าอัดตัวไม่ได้ ปริมาตรที่ไหลผ่านแต่ละหน้าตัดต่อหนึ่งหน่วยเวลาเท่ากัน</div><div class="solution-en"><b>1. Apply the continuity equation.</b> For incompressible water, the same volume passes each cross-section per unit time.</div></div><div class="solution-eq">\[A_Av_A=A_Bv_B\]</div><div class="solution-step"><div class="solution-th"><b>2. หน้าตัดเป็นวงกลม</b> โดย \(A=\pi D^2/4\) จึงตัดตัวประกอบ \(\pi/4\) ได้</div><div class="solution-en"><b>2. The cross-sections are circular.</b> Since \(A=\pi D^2/4\), the common factor \(\pi/4\) cancels.</div></div><div class="solution-eq">\[D_A^2v_A=D_B^2v_B\]</div><div class="solution-eq">\[(8)^2(5)=(4)^2v_B\]</div><div class="solution-eq">\[320=16v_B\quad\Rightarrow\quad v_B=20\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th"><b>จุดสำคัญ:</b> เส้นผ่านศูนย์กลางลดเหลือครึ่งหนึ่ง ทำให้พื้นที่เหลือ \(1/4\) ไม่ใช่ \(1/2\) ดังนั้นอัตราเร็วจึงเพิ่มเป็น 4 เท่า</div><div class="solution-en"><b>Key idea:</b> Halving the diameter quarters the area, so the speed becomes four times as large.</div></div><div class="solution-final"><div><b>ตอบ</b> ข้อ 3: \(20\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 3, \(20\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-2': String.raw`<div class="solution-step"><div class="solution-th"><b>1. อ่านข้อมูลจากรูปและแปลงหน่วย</b> \(D_1=20\,\mathrm{cm}=0.20\,\mathrm m\), \(D_2=3\,\mathrm{cm}=0.030\,\mathrm m\)</div><div class="solution-en"><b>1. Read the diameters from the diagram and convert to SI.</b></div></div><div class="solution-step"><div class="solution-th"><b>2. ใช้อัตราการไหลเชิงมวล</b> เมื่อ \(\dot m=50\,\mathrm{kg/s}\) และ \(\rho=1000\,\mathrm{kg/m^3}\)</div><div class="solution-en"><b>2. Use mass flow rate.</b> Here \(\dot m=50\,\mathrm{kg/s}\) and \(\rho=1000\,\mathrm{kg/m^3}\).</div></div><div class="solution-eq">\[\dot m=\rho Av\quad\Rightarrow\quad v=\frac{\dot m}{\rho A}\]</div><div class="solution-step"><div class="solution-th"><b>3. จุด 1:</b> \(r_1=0.10\,\mathrm m\) จึงมี \(A_1=\pi(0.10)^2=0.01\pi\,\mathrm{m^2}\)</div><div class="solution-en"><b>3. At point 1:</b> \(r_1=0.10\,\mathrm m\), so \(A_1=0.01\pi\,\mathrm{m^2}\).</div></div><div class="solution-eq">\[v_1=\frac{50}{(1000)(0.01\pi)}=\frac5\pi\approx1.59\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th"><b>4. จุด 2:</b> \(r_2=0.015\,\mathrm m\), ดังนั้น \(A_2=\pi(0.015)^2=2.25\times10^{-4}\pi\,\mathrm{m^2}\)</div><div class="solution-en"><b>4. At point 2:</b> \(r_2=0.015\,\mathrm m\), so \(A_2=2.25\times10^{-4}\pi\,\mathrm{m^2}\).</div></div><div class="solution-eq">\[v_2=\frac{50}{(1000)(2.25\times10^{-4}\pi)}\approx70.74\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th"><b>5. โจทย์ถามผลต่างของอัตราเร็ว</b></div><div class="solution-en"><b>5. The question asks for the difference in speeds.</b></div></div><div class="solution-eq">\[\Delta v=v_2-v_1=70.74-1.59\approx69.1\,\mathrm{m/s}\]</div><div class="solution-final"><div><b>ตอบ</b> ข้อ 4: \(69.1\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 4, \(69.1\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-3': String.raw`<div class="solution-step"><div class="solution-th"><b>1. ใช้สมการความต่อเนื่อง</b></div><div class="solution-en"><b>1. Apply continuity.</b></div></div><div class="solution-eq">\[A_1v_1=A_2v_2\]</div><div class="solution-step"><div class="solution-th"><b>2. ระวังพื้นที่ยกกำลังสองของเส้นผ่านศูนย์กลาง</b> เมื่อ \(D_2=\tfrac12D_1\)</div><div class="solution-en"><b>2. Remember that area depends on diameter squared.</b> If \(D_2=\tfrac12D_1\),</div></div><div class="solution-eq">\[A_2=\left(\frac{D_2}{D_1}\right)^2A_1=\left(\frac12\right)^2A_1=\frac14A_1\]</div><div class="solution-eq">\[A_1(4.0)=\frac14A_1v_2\]</div><div class="solution-eq">\[v_2=16\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th"><b>กับดักที่พบบ่อย:</b> \(D\to D/2\) ไม่ได้ทำให้ \(A\to A/2\) แต่ทำให้ \(A\to A/4\)</div><div class="solution-en"><b>Common trap:</b> \(D\to D/2\) gives \(A\to A/4\), not \(A/2\).</div></div><div class="solution-final"><div><b>ตอบ</b> ข้อ 4: \(16\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 4, \(16\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-4': String.raw`<div class="solution-step"><div class="solution-th"><b>1. คำว่า “อัดตัวไม่ได้” เป็นกุญแจสำคัญ</b> ความหนาแน่นของของไหลจึงคงที่ตลอดท่อ</div><div class="solution-en"><b>1. “Incompressible” is the key condition.</b> The fluid density remains constant along the tube.</div></div><div class="solution-eq">\[\rho_A=\rho_B\]</div><div class="solution-step"><div class="solution-th">ดังนั้นข้อความ <b>ข้อ 2 ถูกต้อง</b></div><div class="solution-en">Therefore <b>statement 2 is correct.</b></div></div><div class="solution-step"><div class="solution-th"><b>2. ตรวจตัวเลือกอื่นด้วยสมการความต่อเนื่อง:</b> การไหลคงตัวมี \(Q_A=Q_B\) และ \(A_Av_A=A_Bv_B\)</div><div class="solution-en"><b>2. Check the other choices using continuity:</b> steady flow has \(Q_A=Q_B\) and \(A_Av_A=A_Bv_B\).</div></div><div class="solution-eq">\[A_A=10A_B\quad\Rightarrow\quad 10A_Bv_A=A_Bv_B\quad\Rightarrow\quad v_B=10v_A\]</div><div class="solution-step"><div class="solution-th">จึงไม่ใช่ว่าอัตราการไหลที่ B มากกว่า 10 เท่า และอัตราเร็วที่ A กับ B ก็ไม่เท่ากัน</div><div class="solution-en">Thus the volume flow rate is not ten times larger at B, and the two speeds are not equal.</div></div><div class="solution-final"><div><b>ตอบ</b> ข้อ 2: ความหนาแน่นที่ A และ B เท่ากัน</div><div class="solution-final-en"><b>Answer:</b> Choice 2: the densities at A and B are equal.</div></div>`,
  '17.4.2-5': String.raw`<div class="solution-step"><div class="solution-th"><b>1. ใช้สมการความต่อเนื่องสำหรับหน้าตัดวงกลม</b></div><div class="solution-en"><b>1. Apply continuity to circular cross-sections.</b></div></div><div class="solution-eq">\[A_Av_A=A_Bv_B\quad\Rightarrow\quad r_A^2v_A=r_B^2v_B\]</div><div class="solution-step"><div class="solution-th"><b>2. แทน \(r_A=2r_B\) และ \(v_A=5\,\mathrm{m/s}\)</b></div><div class="solution-en"><b>2. Substitute \(r_A=2r_B\) and \(v_A=5\,\mathrm{m/s}\).</b></div></div><div class="solution-eq">\[(2r_B)^2(5)=r_B^2v_B\]</div><div class="solution-eq">\[4r_B^2(5)=r_B^2v_B\quad\Rightarrow\quad v_B=20\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th"><b>จุดสำคัญ:</b> รัศมีมากเป็น 2 เท่า หมายถึงพื้นที่มากเป็น \(2^2=4\) เท่า</div><div class="solution-en"><b>Key idea:</b> Doubling the radius makes the cross-sectional area four times larger.</div></div><div class="solution-final"><div><b>ตอบ</b> ข้อ 2: \(20\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 2, \(20\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-6': String.raw`<div class="solution-step"><div class="solution-th"><b>1. ใช้ความสัมพันธ์ของอัตราการไหลเชิงปริมาตร</b></div><div class="solution-en"><b>1. Use the volume-flow relation.</b></div></div><div class="solution-eq">\[Q=Av\quad\Rightarrow\quad v=\frac QA\]</div><div class="solution-step"><div class="solution-th"><b>2. แปลง \(60\,\mathrm{L/min}\) เป็น \(\mathrm{m^3/s}\)</b> โดย \(1\,\mathrm L=10^{-3}\,\mathrm{m^3}\)</div><div class="solution-en"><b>2. Convert \(60\,\mathrm{L/min}\) to \(\mathrm{m^3/s}\).</b></div></div><div class="solution-eq">\[Q=\frac{60\times10^{-3}}{60}=1.0\times10^{-3}\,\mathrm{m^3/s}\]</div><div class="solution-step"><div class="solution-th"><b>3. หาเนื้อที่หน้าตัด</b> \(D=2.0\,\mathrm{cm}\Rightarrow r=1.0\,\mathrm{cm}=1.0\times10^{-2}\,\mathrm m\)</div><div class="solution-en"><b>3. Find the cross-sectional area.</b> \(D=2.0\,\mathrm{cm}\Rightarrow r=1.0\times10^{-2}\,\mathrm m\).</div></div><div class="solution-eq">\[A=\pi r^2=\pi(10^{-2})^2=\pi\times10^{-4}\,\mathrm{m^2}\]</div><div class="solution-eq">\[v=\frac{10^{-3}}{\pi\times10^{-4}}=\frac{10}{\pi}\,\mathrm{m/s}\approx3.18\,\mathrm{m/s}\]</div><div class="solution-final"><div><b>ตอบ</b> ข้อ 1: \(10/\pi\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 1, \(10/\pi\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-7': String.raw`<div class="solution-step"><div class="solution-th"><b>1. เปลี่ยนอัตราส่วนรัศมีเป็นอัตราส่วนพื้นที่</b></div><div class="solution-en"><b>1. Convert the radius ratio to an area ratio.</b></div></div><div class="solution-eq">\[r_A=2r_B\quad\Rightarrow\quad A_A=4A_B\]</div><div class="solution-step"><div class="solution-th"><b>2. ใช้สมการความต่อเนื่อง</b> โดยรู้ว่า \(v_B=20\,\mathrm{m/s}\)</div><div class="solution-en"><b>2. Apply continuity</b> with \(v_B=20\,\mathrm{m/s}\).</div></div><div class="solution-eq">\[A_Av_A=A_Bv_B\]</div><div class="solution-eq">\[4A_Bv_A=A_B(20)\]</div><div class="solution-eq">\[4v_A=20\quad\Rightarrow\quad v_A=5\,\mathrm{m/s}\]</div><div class="solution-step"><div class="solution-th">ข้อนี้เป็นแนวคิดย้อนกลับของข้อก่อน: ท่อ A กว้างกว่า 4 เท่าในเชิงพื้นที่ จึงมีอัตราเร็วเพียง \(1/4\) ของท่อ B</div><div class="solution-en">This reverses the previous idea: pipe A has four times the area, so its speed is one quarter of the speed in B.</div></div><div class="solution-final"><div><b>ตอบ</b> ข้อ 1: \(5\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 1, \(5\,\mathrm{m/s}\).</div></div>`,
  '17.4.2-8': String.raw`<div class="solution-step"><div class="solution-th"><b>1. เลือกข้อมูลที่จำเป็น</b> โจทย์ให้อัตราการไหลเชิงปริมาตร \(Q\) มาแล้ว จึงหาอัตราเร็วที่หัวฉีดได้โดยตรงจาก \(Q=Av\) ไม่จำเป็นต้องหาอัตราเร็วในสายขนาด \(6.0\,\mathrm{cm}\) ก่อน</div><div class="solution-en"><b>1. Select only the needed data.</b> Because \(Q\) is already given, the nozzle speed follows directly from \(Q=Av\); the speed in the \(6.0\,\mathrm{cm}\) hose is not needed.</div></div><div class="solution-eq">\[Q=Av\quad\Rightarrow\quad v=\frac QA\]</div><div class="solution-step"><div class="solution-th"><b>2. หาพื้นที่หน้าตัดหัวฉีด</b> \(D=2.0\,\mathrm{cm}\Rightarrow r=1.0\,\mathrm{cm}=1.0\times10^{-2}\,\mathrm m\)</div><div class="solution-en"><b>2. Find the nozzle cross-sectional area.</b></div></div><div class="solution-eq">\[A=\pi r^2=\pi(1.0\times10^{-2})^2=\pi\times10^{-4}\,\mathrm{m^2}\]</div><div class="solution-step"><div class="solution-th"><b>3. แทนค่า \(Q=0.020\,\mathrm{m^3/s}\)</b></div><div class="solution-en"><b>3. Substitute \(Q=0.020\,\mathrm{m^3/s}\).</b></div></div><div class="solution-eq">\[v=\frac{0.020}{\pi\times10^{-4}}=\frac{200}{\pi}\,\mathrm{m/s}\approx63.7\,\mathrm{m/s}\]</div><div class="solution-final"><div><b>ตอบ</b> ข้อ 4: \(200/\pi\,\mathrm{m/s}\)</div><div class="solution-final-en"><b>Answer:</b> Choice 4, \(200/\pi\,\mathrm{m/s}\).</div></div>`
};

for (const q of Q) {
  if (continuitySolutions[q.source_id]) q.solution = continuitySolutions[q.source_id];
  if (q.source_id === '17.4.2-2') {
    q.img = '17.4.2-2-simplified.svg';
    q.size = 'xxl';
  }
}

window.__initContinuityLesson = function () {
  const placeholder = document.getElementById('lesson-continuity');
  if (!placeholder) {
    console.warn('Continuity lesson placeholder not found.');
    return;
  }

  const style = document.createElement('style');
  style.textContent = String.raw`
    .toolbar .lesson-btn{background:#dcfce7;color:#14532d}
    .toolbar .lesson-btn.off{background:#e2e8f0;color:#334155}
    .continuity-guide{grid-template-rows:auto minmax(0,1fr) auto!important;gap:3mm!important}
    .continuity-guide .lesson-body{min-height:0;display:grid;grid-template-rows:auto auto minmax(0,1fr);gap:3mm}
    .continuity-guide .lesson-title{border:1.5px solid var(--navy);padding:3mm 4mm;background:#f8fafc}
    .continuity-guide .lesson-title h1{margin:0;font-size:19px;line-height:1.18;color:var(--navy)}
    .continuity-guide .lesson-title .en-title{margin-top:1mm;color:#475569;font-size:11px;font-weight:600}
    .guide-card{border:1.4px solid var(--navy);background:#fff;padding:3.2mm;min-height:0}
    .guide-card h2{margin:0 0 2mm;font-size:14px;color:var(--navy)}
    .guide-card .en-note{display:block;margin-top:.7mm;color:#64748b;font-size:9.5px;font-weight:400}
    .guide-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:3mm}
    .guide-svg{width:100%;height:auto;max-height:74mm;display:block}
    .guide-prompt{margin:1.6mm 0;font-size:11.3px;line-height:1.55}
    .guide-prompt .en-line{display:block;color:#64748b;font-size:9.5px;margin-top:.4mm}
    .fill{display:inline-flex;align-items:flex-end;justify-content:center;min-width:28mm;min-height:6mm;border-bottom:1.4px solid #334155;padding:0 1.5mm;vertical-align:baseline}
    .fill.wide{min-width:48mm}.fill.short{min-width:17mm}
    .guided-answer{visibility:hidden;font-weight:750;color:#0f172a}
    body.show-lessons .guided-answer,body.print-answers .guided-answer{visibility:visible}
    body.print-questions .guided-answer{visibility:hidden!important}
    .formula-stack{display:grid;gap:1.7mm;margin-top:2mm}
    .formula-row{display:grid;grid-template-columns:28mm 1fr;align-items:center;gap:2mm;border-left:2.5px solid #94a3b8;background:#f8fafc;padding:1.6mm 2.2mm;min-height:11mm}
    .formula-row .step{font-size:9.5px;font-weight:800;color:#475569}
    .formula-fill{min-height:8mm;border-bottom:1.2px solid #64748b;text-align:center;font-size:12px;padding-bottom:.6mm}
    .definition-box{border:1px solid #94a3b8;background:#f8fafc;padding:2.4mm}
    .definition-box strong{color:#0f172a}
    .note-box{border:1.2px dashed #94a3b8;min-height:24mm;padding:2.5mm;background:repeating-linear-gradient(to bottom,#fff 0,#fff 7mm,#e2e8f0 7.2mm,#fff 7.4mm)}
    .note-box .note-label{display:inline-block;background:#fff;padding-right:2mm;font-size:9.5px;font-weight:800;color:#64748b}
    .final-law{border:1.8px solid var(--navy);background:#eef2f7;padding:2.6mm;text-align:center;font-size:13px;font-weight:800}
    .symbol-strip{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm;margin-top:2mm}
    .symbol-item{border:1px solid #cbd5e1;padding:2mm;text-align:center;background:#fff}
    .symbol-item b{font-size:13px}.symbol-item small{display:block;color:#64748b;font-size:8.7px;margin-top:.5mm}
    .mass-flow-rule{padding:3mm;border:1.5px solid var(--navy);background:#f8fafc;text-align:center;font-size:12px;line-height:1.6}
    .continuity-columns{display:grid;grid-template-columns:1fr 1fr;gap:3mm;align-items:start}
    .continuity-guide .footer{align-self:end}
    @media(max-width:720px){.guide-grid-2,.continuity-columns{grid-template-columns:1fr}.continuity-guide{height:auto!important;min-height:297mm}.guide-svg{max-height:none}}
    @media print{
      .continuity-guide{height:297mm!important}
      .guide-card{padding:2.8mm}
      .guide-prompt{font-size:10.8px}
      .guide-prompt .en-line{font-size:9px}
      .guided-answer{visibility:hidden}
      body.print-answers .guided-answer{visibility:visible!important}
      body.print-questions .guided-answer{visibility:hidden!important}
    }
  `;
  document.head.appendChild(style);

  const toolbar = document.querySelector('.toolbar');
  if (toolbar && !document.getElementById('showLessonsBtn')) {
    const showBtn = document.createElement('button');
    showBtn.id = 'showLessonsBtn';
    showBtn.type = 'button';
    showBtn.className = 'lesson-btn';
    showBtn.textContent = 'เปิดเนื้อหา / Show Lesson';
    const hideBtn = document.createElement('button');
    hideBtn.id = 'hideLessonsBtn';
    hideBtn.type = 'button';
    hideBtn.className = 'lesson-btn off';
    hideBtn.textContent = 'ปิดเนื้อหา / Hide Lesson';
    toolbar.append(showBtn, hideBtn);
    showBtn.addEventListener('click', () => document.body.classList.add('show-lessons'));
    hideBtn.addEventListener('click', () => document.body.classList.remove('show-lessons'));
  }

  const page1 = String.raw`
  <section class="sheet lesson-sheet continuity-guide" id="lesson-continuity-1">
    <div class="topline"><div class="topic">สมการความต่อเนื่อง / Continuity Equation</div><div class="qno">GUIDED NOTES 1/3</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>1. การวัดอัตราการไหล</h1><div class="en-title">Measuring Volume Flow Rate and Mass Flow Rate</div></div>
      <div class="guide-grid-2">
        <div class="guide-card">
          <h2>สถานการณ์ทดลอง <span class="en-note">A simple measurement</span></h2>
          <svg class="guide-svg" viewBox="0 0 540 310" role="img" aria-label="Water from a faucet collected in a container during time t, with volume and mass measured">
            <defs><marker id="arr1" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0 L8 4 L0 8 Z" fill="#334155"/></marker></defs>
            <rect x="40" y="24" width="150" height="28" rx="12" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
            <rect x="165" y="40" width="30" height="70" rx="8" fill="#cbd5e1" stroke="#334155" stroke-width="3"/>
            <path d="M180 108 C180 132 208 126 208 150" fill="none" stroke="#0ea5e9" stroke-width="11" stroke-linecap="round"/>
            <path d="M208 150 C208 172 208 188 208 207" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linecap="round" marker-end="url(#arr1)"/>
            <path d="M120 188 L305 188 L286 276 L139 276 Z" fill="#f8fafc" stroke="#334155" stroke-width="3"/>
            <path d="M135 228 L292 228 L286 276 L139 276 Z" fill="#bae6fd" opacity=".8"/>
            <line x1="147" y1="215" x2="165" y2="215" stroke="#64748b" stroke-width="2"/><line x1="144" y1="238" x2="165" y2="238" stroke="#64748b" stroke-width="2"/><line x1="141" y1="260" x2="165" y2="260" stroke="#64748b" stroke-width="2"/>
            <text x="365" y="70" font-size="25" font-weight="700" fill="#0f172a">เวลา / time = t</text>
            <text x="350" y="150" font-size="25" font-weight="700" fill="#0f172a">ปริมาตร / volume = V̄</text>
            <rect x="345" y="192" width="160" height="65" rx="8" fill="#fff" stroke="#334155" stroke-width="3"/>
            <text x="425" y="220" text-anchor="middle" font-size="19" fill="#475569">เครื่องชั่ง / scale</text>
            <text x="425" y="247" text-anchor="middle" font-size="24" font-weight="700" fill="#0f172a">mass = m</text>
            <line x1="302" y1="250" x2="345" y2="225" stroke="#64748b" stroke-width="2" marker-end="url(#arr1)"/>
          </svg>
          <div class="symbol-strip">
            <div class="symbol-item"><b>\(\bar V\)</b><small>ปริมาตร / volume</small></div>
            <div class="symbol-item"><b>\(t\)</b><small>เวลา / time</small></div>
            <div class="symbol-item"><b>\(m\)</b><small>มวล / mass</small></div>
          </div>
        </div>
        <div class="guide-card">
          <h2>นิยามจากสิ่งที่วัดได้ <span class="en-note">Definitions from measurement</span></h2>
          <div class="guide-prompt">อัตราการไหลเชิงปริมาตร คือ ปริมาตรของของไหลที่ไหลผ่านต่อ <span class="fill"><span class="guided-answer">หนึ่งหน่วยเวลา</span></span><span class="en-line">Volume flow rate is the volume of fluid passing per <span class="fill"><span class="guided-answer">unit time</span></span>.</span></div>
          <div class="formula-stack">
            <div class="formula-row"><div class="step">จดสูตร / Formula</div><div class="formula-fill"><span class="guided-answer">\(Q=\dfrac{\bar V}{t}\)</span></div></div>
            <div class="formula-row"><div class="step">หน่วย / Unit</div><div class="formula-fill"><span class="guided-answer">\(\mathrm{m^3/s}\)</span></div></div>
          </div>
          <div class="guide-prompt" style="margin-top:3mm">อัตราการไหลเชิงมวล คือ มวลของของไหลที่ไหลผ่านต่อ <span class="fill"><span class="guided-answer">หนึ่งหน่วยเวลา</span></span><span class="en-line">Mass flow rate is the mass of fluid passing per <span class="fill"><span class="guided-answer">unit time</span></span>.</span></div>
          <div class="formula-stack">
            <div class="formula-row"><div class="step">จดสูตร / Formula</div><div class="formula-fill"><span class="guided-answer">\(\dot m=\dfrac{m}{t}\)</span></div></div>
            <div class="formula-row"><div class="step">หน่วย / Unit</div><div class="formula-fill"><span class="guided-answer">\(\mathrm{kg/s}\)</span></div></div>
          </div>
        </div>
      </div>
      <div class="guide-card">
        <h2>เชื่อมอัตราการไหลเชิงมวลกับอัตราการไหลเชิงปริมาตร <span class="en-note">Relating mass flow rate to volume flow rate</span></h2>
        <div class="formula-stack">
          <div class="formula-row"><div class="step">เริ่มจาก / Start</div><div class="formula-fill"><span class="guided-answer">\(\rho=\dfrac{m}{\bar V}\)</span></div></div>
          <div class="formula-row"><div class="step">จัดรูป / Rearrange</div><div class="formula-fill"><span class="guided-answer">\(m=\rho\bar V\)</span></div></div>
          <div class="formula-row"><div class="step">หารด้วย \(t\)</div><div class="formula-fill"><span class="guided-answer">\(\dfrac{m}{t}=\rho\dfrac{\bar V}{t}\)</span></div></div>
          <div class="formula-row"><div class="step">แทนนิยาม / Substitute</div><div class="formula-fill"><span class="guided-answer">\(\dot m=\rho Q\)</span></div></div>
        </div>
        <div class="final-law" style="margin-top:2.5mm"><span class="guided-answer">\(\boxed{\dot m=\rho Q}\)</span></div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Continuity Equation</span><span>1 / 3</span></div>
  </section>`;

  const page2 = String.raw`
  <section class="sheet lesson-sheet continuity-guide" id="lesson-continuity-2">
    <div class="topline"><div class="topic">สมการความต่อเนื่อง / Continuity Equation</div><div class="qno">GUIDED NOTES 2/3</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>2. จากปริมาตรของของไหลสู่ \(Q=Av\)</h1><div class="en-title">From Fluid Volume to \(Q=Av\)</div></div>
      <div class="guide-card">
        <h2>พิจารณาของไหลในท่อหน้าตัด \(A\) <span class="en-note">Consider fluid in a tube of cross-sectional area \(A\)</span></h2>
        <svg class="guide-svg" viewBox="0 0 820 300" role="img" aria-label="Fluid in a straight tube with cross-sectional area A moving distance s during time t">
          <defs><marker id="arr2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#334155"/></marker></defs>
          <rect x="85" y="72" width="645" height="156" rx="16" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
          <rect x="155" y="76" width="355" height="148" fill="#bae6fd" opacity=".85"/>
          <ellipse cx="155" cy="150" rx="28" ry="74" fill="#e0f2fe" stroke="#0369a1" stroke-width="4"/>
          <ellipse cx="510" cy="150" rx="28" ry="74" fill="#e0f2fe" stroke="#0369a1" stroke-width="4" stroke-dasharray="8 6"/>
          <line x1="155" y1="46" x2="510" y2="46" stroke="#334155" stroke-width="3" marker-end="url(#arr2)"/>
          <text x="332" y="35" text-anchor="middle" font-size="27" font-weight="700" fill="#0f172a">ระยะทาง / distance = s</text>
          <line x1="118" y1="150" x2="69" y2="150" stroke="#334155" stroke-width="3" marker-end="url(#arr2)"/>
          <text x="38" y="122" text-anchor="middle" font-size="26" font-weight="700" fill="#0f172a">A</text>
          <text x="618" y="124" font-size="26" font-weight="700" fill="#0f172a">เวลา / time = t</text>
          <text x="618" y="165" font-size="23" fill="#475569">ของไหลส่วนที่ผ่าน</text>
          <text x="618" y="194" font-size="21" fill="#64748b">fluid volume passing</text>
          <path d="M548 252 L665 252" stroke="#334155" stroke-width="3" marker-end="url(#arr2)"/>
          <text x="606" y="282" text-anchor="middle" font-size="19" fill="#475569">ทิศการไหล / flow direction</text>
        </svg>
      </div>
      <div class="continuity-columns">
        <div class="guide-card">
          <h2>เริ่มจากเรขาคณิต <span class="en-note">Start from geometry</span></h2>
          <div class="guide-prompt">ของไหลส่วนที่เคลื่อนผ่านมีรูปทรงปริซึม: ปริมาตร = พื้นที่หน้าตัด × ระยะทาง<span class="en-line">The passing fluid forms a prism: volume = cross-sectional area × distance.</span></div>
          <div class="formula-stack">
            <div class="formula-row"><div class="step">ปริมาตร / Volume</div><div class="formula-fill"><span class="guided-answer">\(\bar V=As\)</span></div></div>
            <div class="formula-row"><div class="step">จากกล่อง 1</div><div class="formula-fill"><span class="guided-answer">\(Q=\dfrac{\bar V}{t}\)</span></div></div>
            <div class="formula-row"><div class="step">แทน \(\bar V=As\)</div><div class="formula-fill"><span class="guided-answer">\(Q=\dfrac{As}{t}=A\dfrac{s}{t}\)</span></div></div>
            <div class="formula-row"><div class="step">นิยามอัตราเร็ว</div><div class="formula-fill"><span class="guided-answer">\(\dfrac{s}{t}=v\)</span></div></div>
          </div>
          <div class="final-law" style="margin-top:2.5mm"><span class="guided-answer">\(\boxed{Q=Av}\)</span></div>
        </div>
        <div class="guide-card">
          <h2>มวลของของไหลส่วนเดียวกัน <span class="en-note">Mass of the same fluid segment</span></h2>
          <div class="guide-prompt">ใช้ \(m=\rho\bar V\) กับปริมาตร \(\bar V=As\)<span class="en-line">Use \(m=\rho\bar V\) with \(\bar V=As\).</span></div>
          <div class="formula-stack">
            <div class="formula-row"><div class="step">มวล / Mass</div><div class="formula-fill"><span class="guided-answer">\(m=\rho As\)</span></div></div>
            <div class="formula-row"><div class="step">หารด้วย \(t\)</div><div class="formula-fill"><span class="guided-answer">\(\dfrac{m}{t}=\rho A\dfrac{s}{t}\)</span></div></div>
            <div class="formula-row"><div class="step">แทนนิยาม</div><div class="formula-fill"><span class="guided-answer">\(\dot m=\rho Av\)</span></div></div>
          </div>
          <div class="final-law" style="margin-top:2.5mm"><span class="guided-answer">\(\boxed{\dot m=\rho Av}\)</span></div>
          <div class="definition-box" style="margin-top:3mm"><strong>สังเกต / Notice:</strong> สูตรทั้งสองเกิดจากปริมาตรเรขาคณิตเดียวกัน \(\bar V=As\)<span class="en-note">Both flow relations come from the same geometric volume \(\bar V=As\).</span></div>
        </div>
      </div>
      <div class="note-box"><span class="note-label">บันทึกเพิ่มเติมจากครู / Additional teacher notes</span></div>
    </div>
    <div class="footer"><span>Guided Notes — Continuity Equation</span><span>2 / 3</span></div>
  </section>`;

  const page3 = String.raw`
  <section class="sheet lesson-sheet continuity-guide" id="lesson-continuity-3">
    <div class="topline"><div class="topic">สมการความต่อเนื่อง / Continuity Equation</div><div class="qno">GUIDED NOTES 3/3</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>3. กฎของการไหลแบบต่อเนื่อง</h1><div class="en-title">The Continuity Law</div></div>
      <div class="guide-card">
        <h2>ของไหลผ่านท่อที่รูปร่างเปลี่ยนไป <span class="en-note">Flow through a tube with changing cross-section</span></h2>
        <svg class="guide-svg" viewBox="0 0 900 330" role="img" aria-label="Curved tube with three cross-sectional regions A1, A2 and A3 and flow speeds v1, v2 and v3">
          <defs><marker id="arr3" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
          <path d="M70 110 C210 50 300 65 405 120 C520 180 610 230 825 160" fill="none" stroke="#cbd5e1" stroke-width="112" stroke-linecap="round"/>
          <path d="M70 110 C210 50 300 65 405 120 C520 180 610 230 825 160" fill="none" stroke="#e0f2fe" stroke-width="88" stroke-linecap="round"/>
          <path d="M82 110 C225 53 305 75 410 125 C520 178 620 220 808 164" fill="none" stroke="#0284c7" stroke-width="4" stroke-dasharray="10 8" marker-end="url(#arr3)"/>
          <ellipse cx="184" cy="78" rx="18" ry="58" transform="rotate(72 184 78)" fill="#fff" fill-opacity=".75" stroke="#0f172a" stroke-width="3"/>
          <ellipse cx="446" cy="142" rx="15" ry="43" transform="rotate(-57 446 142)" fill="#fff" fill-opacity=".75" stroke="#0f172a" stroke-width="3"/>
          <ellipse cx="696" cy="200" rx="18" ry="54" transform="rotate(73 696 200)" fill="#fff" fill-opacity=".75" stroke="#0f172a" stroke-width="3"/>
          <text x="125" y="34" font-size="24" font-weight="700" fill="#0f172a">A₁</text><text x="205" y="30" font-size="21" fill="#475569">v₁</text>
          <text x="438" y="70" font-size="24" font-weight="700" fill="#0f172a">A₂</text><text x="492" y="105" font-size="21" fill="#475569">v₂</text>
          <text x="688" y="278" font-size="24" font-weight="700" fill="#0f172a">A₃</text><text x="748" y="250" font-size="21" fill="#475569">v₃</text>
          <text x="65" y="300" font-size="20" fill="#64748b">ตำแหน่ง 1 / Region 1</text><text x="356" y="300" font-size="20" fill="#64748b">ตำแหน่ง 2 / Region 2</text><text x="666" y="300" font-size="20" fill="#64748b">ตำแหน่ง 3 / Region 3</text>
        </svg>
      </div>
      <div class="guide-card">
        <h2>เติมกฎสำคัญก่อน <span class="en-note">State the key law first</span></h2>
        <div class="mass-flow-rule">ในการไหลแบบต่อเนื่อง อัตราการไหลเชิงมวลที่ทุกบริเวณมีค่า <span class="fill wide"><span class="guided-answer">เท่ากัน</span></span><br><span style="color:#64748b;font-size:10px">For continuous steady flow, the mass flow rate at every region is <span class="fill wide"><span class="guided-answer">equal</span></span>.</span></div>
        <div class="formula-stack" style="margin-top:2.5mm">
          <div class="formula-row"><div class="step">กฎ / Law</div><div class="formula-fill"><span class="guided-answer">\(\dot m_1=\dot m_2=\dot m_3=\cdots\)</span></div></div>
          <div class="formula-row"><div class="step">ใช้ \(\dot m=\rho Av\)</div><div class="formula-fill"><span class="guided-answer">\(\rho_1A_1v_1=\rho_2A_2v_2=\rho_3A_3v_3=\cdots\)</span></div></div>
        </div>
        <div class="final-law" style="margin-top:2.5mm"><span class="guided-answer">\(\boxed{\rho_1A_1v_1=\rho_2A_2v_2=\rho_3A_3v_3=\cdots}\)</span></div>
      </div>
      <div class="guide-grid-2">
        <div class="guide-card">
          <h2>กรณีของไหลอัดตัวไม่ได้ <span class="en-note">Incompressible fluid</span></h2>
          <div class="guide-prompt">ความหนาแน่นของของไหลคงที่ตลอดการไหล<span class="en-line">The fluid density remains constant along the flow.</span></div>
          <div class="formula-stack">
            <div class="formula-row"><div class="step">ความหนาแน่น</div><div class="formula-fill"><span class="guided-answer">\(\rho_1=\rho_2=\rho_3=\rho\)</span></div></div>
            <div class="formula-row"><div class="step">ตัด \(\rho\)</div><div class="formula-fill"><span class="guided-answer">\(A_1v_1=A_2v_2=A_3v_3=\cdots\)</span></div></div>
          </div>
          <div class="final-law" style="margin-top:2.5mm"><span class="guided-answer">\(\boxed{A_1v_1=A_2v_2=A_3v_3=\cdots}\)</span></div>
        </div>
        <div class="note-box"><span class="note-label">สรุปจากครู / Teacher summary</span></div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Continuity Equation • ต่อไปทำข้อ 53–60 / Next: Q53–Q60</span><span>3 / 3</span></div>
  </section>`;

  const holder = document.createElement('div');
  holder.innerHTML = page1 + page2 + page3;
  const fragment = document.createDocumentFragment();
  while (holder.firstChild) fragment.appendChild(holder.firstChild);
  placeholder.replaceWith(fragment);
};
