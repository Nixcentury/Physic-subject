/* Bernoulli guided notes v1 — energy-first derivation.
   Replaces the Bernoulli lesson placeholder after the base document has rendered.
   Uses the existing Show/Hide Answers controls: hidden answers keep their physical space. */
(function(){
  const placeholder=document.getElementById('lesson-bernoulli-torricelli-lift');
  if(!placeholder){console.warn('Bernoulli lesson placeholder not found.');return;}

  /* Keep the main toolbar compact: Guided Notes use the existing answer controls. */
  document.getElementById('showLessonsBtn')?.remove();
  document.getElementById('hideLessonsBtn')?.remove();

  const style=document.createElement('style');
  style.textContent=String.raw`
    .bernoulli-guide{grid-template-rows:auto minmax(0,1fr) auto!important;gap:3mm!important}
    .bernoulli-guide .lesson-body{min-height:0;display:grid;grid-template-rows:auto minmax(0,1fr);gap:3mm}
    .bernoulli-guide .lesson-title{border:1.5px solid var(--navy);padding:3mm 4mm;background:#f8fafc}
    .bernoulli-guide .lesson-title h1{margin:0;font-size:18px;line-height:1.18;color:var(--navy)}
    .bernoulli-guide .lesson-title .en-title{margin-top:1mm;color:#475569;font-size:10.5px;font-weight:600}
    .bn-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:3mm;min-height:0}
    .bn-card{border:1.4px solid var(--navy);background:#fff;padding:3mm;min-height:0}
    .bn-card h2{margin:0 0 1.6mm;font-size:13.5px;color:var(--navy);line-height:1.25}
    .bn-card h3{margin:2mm 0 1mm;font-size:11.5px;color:#334155}
    .bn-en{display:block;margin-top:.5mm;color:#64748b;font-size:9px;font-weight:400;line-height:1.4}
    .bn-svg{display:block;width:100%;height:auto;max-height:72mm;margin:1mm auto 2mm}
    .bn-prompt{margin:1.5mm 0;font-size:10.7px;line-height:1.48}
    .bn-callout{margin-top:2mm;padding:2.2mm 2.6mm;border-left:3px solid #475569;background:#f8fafc;font-size:10.2px;line-height:1.48}
    .bn-warning{border-left-color:#b45309;background:#fffbeb}
    .bn-check{border-left-color:#047857;background:#ecfdf5}
    .bn-eq{margin:1.2mm 0;padding:1mm 1.5mm;border-left:2.5px solid #94a3b8;background:#f8fafc;text-align:center;font-size:11.2px;min-height:9mm}
    .bn-derive{display:grid;gap:1.2mm;margin-top:1.5mm}
    .bn-row{display:grid;grid-template-columns:25mm 1fr;align-items:center;gap:2mm;min-height:11mm;padding:1.3mm 1.8mm;border:1px solid #e2e8f0;background:#fff}
    .bn-step{font-size:9px;font-weight:800;color:#475569}
    .bn-formula{text-align:center;font-size:10.8px}
    .bn-three{display:grid;grid-template-columns:repeat(3,1fr);gap:2mm}
    .bn-energy{border:1.2px solid #94a3b8;padding:2.2mm;text-align:center;background:#fff;min-height:34mm}
    .bn-energy .symbol{font-size:14px;font-weight:800;color:var(--navy);margin-bottom:1mm}
    .bn-energy .meaning{font-size:9.5px;line-height:1.4}
    .bn-flow-chain{display:flex;align-items:center;justify-content:center;gap:2mm;flex-wrap:wrap;margin:2mm 0}
    .bn-chip{border:1.2px solid #64748b;border-radius:999px;padding:1.2mm 2.5mm;background:#fff;font-weight:750;font-size:9.8px}
    .bn-arrow{font-weight:900;color:#475569}
    .fill{display:inline-flex;align-items:flex-end;justify-content:center;min-width:25mm;min-height:6mm;border-bottom:1.3px solid #334155;padding:0 1.2mm;vertical-align:baseline}
    .fill.wide{min-width:48mm}.fill.short{min-width:15mm}
    .guided-answer{visibility:hidden;font-weight:750;color:#0f172a}
    .guided-answer-block{visibility:hidden;min-height:inherit}
    body.show-answers .guided-answer,body.print-answers .guided-answer,
    body.show-answers .guided-answer-block,body.print-answers .guided-answer-block{visibility:visible!important}
    body.print-questions .guided-answer,body.print-questions .guided-answer-block{visibility:hidden!important}
    .bn-fixed-answer{min-height:17mm;border:1px dashed #94a3b8;padding:2mm 2.5mm;background:#fff}
    @media(max-width:720px){.bn-grid-2,.bn-three{grid-template-columns:1fr}.bn-row{grid-template-columns:1fr}.bn-step{text-align:center}}
    @media print{
      .bernoulli-guide .lesson-title h1{font-size:16px}.bn-card{padding:2.4mm}.bn-svg{max-height:60mm}
      .bn-prompt,.bn-callout{font-size:9.2px}.bn-en{font-size:8px}.bn-eq,.bn-formula{font-size:9.5px}
    }
  `;
  document.head.appendChild(style);

  const page1=String.raw`
  <section class="sheet lesson-sheet bernoulli-guide" id="lesson-bernoulli-1" data-topic="bernoulli-torricelli-lift">
    <div class="topline"><div class="topic">แบร์นูลลี ทอริเชลลี และแรงยก / Bernoulli, Torricelli and Lift</div><div class="qno">GUIDED NOTES 1/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>1. พลังงานไม่เพิ่มขึ้นเอง: ก่อนใช้สูตร ลองถามว่า “พลังงานมาจากไหน?”</h1><div class="en-title">Energy does not appear for free: before using a formula, ask where the energy comes from.</div></div>
      <div class="bn-grid-2">
        <div class="bn-card">
          <h2>ฉุกคิด A — ท่อขนาดเดิม แต่ยกสูงขึ้น <span class="bn-en">Same pipe diameter, but the outlet is higher</span></h2>
          <svg class="bn-svg" viewBox="0 0 640 360" role="img" aria-label="Same-diameter pipe rising from point A to higher point B">
            <defs><marker id="bnA1" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
            <path d="M70 250 H275 Q330 250 330 195 V120 Q330 80 380 80 H565" fill="none" stroke="#cbd5e1" stroke-width="72" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M70 250 H275 Q330 250 330 195 V120 Q330 80 380 80 H565" fill="none" stroke="#64748b" stroke-width="4"/>
            <line x1="110" y1="250" x2="210" y2="250" stroke="#0f172a" stroke-width="5" marker-end="url(#bnA1)"/>
            <line x1="430" y1="80" x2="530" y2="80" stroke="#0f172a" stroke-width="5" marker-end="url(#bnA1)"/>
            <text x="70" y="315" font-size="28" font-weight="700" fill="#0f172a">A</text>
            <text x="548" y="54" font-size="28" font-weight="700" fill="#0f172a">B</text>
            <line x1="585" y1="250" x2="585" y2="80" stroke="#475569" stroke-width="3" marker-end="url(#bnA1)"/>
            <text x="594" y="175" font-size="24" fill="#475569">Δh &gt; 0</text>
            <rect x="200" y="292" width="235" height="42" rx="18" fill="#fff7ed" stroke="#b45309" stroke-width="2"/>
            <text x="318" y="320" text-anchor="middle" font-size="19" font-weight="700" fill="#92400e">NO PUMP BETWEEN A AND B</text>
          </svg>
          <div class="bn-prompt">ถ้าเราต้องการให้จุด B <b>สูงกว่าเดิม</b> แต่ไม่ยอมให้ความดันหรือความเร็วลดลงเลย พลังงานศักย์ที่เพิ่มขึ้นจะมาจากไหน?<span class="bn-en">If B is higher while pressure and speed are not allowed to decrease, where could the extra gravitational potential energy come from?</span></div>
          <div class="bn-fixed-answer"><div class="guided-answer-block"><b>คำตอบ:</b> ต้องมีงานจากภายนอก เช่น ปั๊ม เพิ่มพลังงานให้ระบบ มิฉะนั้นพลังงานที่เพิ่มในรูป \(mgh\) ต้องแลกมาจากพลังงานรูปอื่น เช่น ความดันหรือพลังงานจลน์ที่ลดลง.<span class="bn-en"><b>Answer:</b> External work such as a pump is required unless another energy term decreases.</span></div></div>
          <div class="bn-callout bn-warning"><b>ระวัง:</b> “ไม่มีปั๊ม” ไม่ได้แปลว่าน้ำขึ้นที่สูงไม่ได้เสมอไป — น้ำยังขึ้นได้ถ้าความดันหรือความเร็วลดลงพอ. ประเด็นคือ <b>พลังงานไม่เพิ่มฟรี</b>.</div>
        </div>
        <div class="bn-card">
          <h2>ฉุกคิด B — ท่อเท่าเดิม จะทำให้น้ำเร็วขึ้นอย่างไร? <span class="bn-en">Same pipe size: how can the flow become faster?</span></h2>
          <svg class="bn-svg" viewBox="0 0 640 360" role="img" aria-label="Same-diameter horizontal pipe before and after a pump increases the system flow rate">
            <defs><marker id="bnA2" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
            <text x="42" y="64" font-size="22" font-weight="700" fill="#334155">BEFORE</text>
            <rect x="105" y="42" width="460" height="70" rx="35" fill="#f8fafc" stroke="#64748b" stroke-width="4"/>
            <line x1="175" y1="77" x2="290" y2="77" stroke="#64748b" stroke-width="5" marker-end="url(#bnA2)"/>
            <text x="345" y="85" font-size="22" fill="#475569">Q₁ , v₁</text>
            <text x="42" y="213" font-size="22" font-weight="700" fill="#334155">AFTER</text>
            <rect x="105" y="190" width="460" height="70" rx="35" fill="#f8fafc" stroke="#64748b" stroke-width="4"/>
            <rect x="272" y="168" width="116" height="114" rx="20" fill="#ecfdf5" stroke="#047857" stroke-width="4"/>
            <circle cx="330" cy="225" r="30" fill="#fff" stroke="#047857" stroke-width="4"/>
            <path d="M330 200 L343 225 L330 250 L317 225 Z" fill="#047857"/>
            <text x="330" y="305" text-anchor="middle" font-size="20" font-weight="700" fill="#047857">PUMP</text>
            <line x1="130" y1="225" x2="250" y2="225" stroke="#0f172a" stroke-width="6" marker-end="url(#bnA2)"/>
            <line x1="410" y1="225" x2="540" y2="225" stroke="#0f172a" stroke-width="6" marker-end="url(#bnA2)"/>
            <text x="430" y="166" font-size="22" fill="#0f172a">Q₂ &gt; Q₁</text>
            <text x="430" y="330" font-size="22" fill="#0f172a">v₂ &gt; v₁</text>
          </svg>
          <div class="bn-prompt">หน้าตัด \(A\) เท่าเดิมตลอดท่อ ถ้าต้องการให้การไหลทั้งระบบเร็วขึ้นจากเดิม เราต้องเพิ่มอะไร?<span class="bn-en">With the same cross-sectional area, what must change to make the whole steady flow faster than before?</span></div>
          <div class="bn-eq">\[Q=Av\quad\Rightarrow\quad A\text{ คงที่: }Q\uparrow\;\Rightarrow\;v\uparrow\]</div>
          <div class="bn-fixed-answer"><div class="guided-answer-block"><b>คำตอบ:</b> เพิ่มความต่างความดันหรือใช้ปั๊มเพิ่มพลังงานให้ระบบ ทำให้ \(Q\) ของสภาวะการไหลใหม่มากขึ้น และเพราะ \(A\) เท่าเดิมจึงได้ \(v\) มากขึ้น.<span class="bn-en"><b>Answer:</b> Increase the pressure difference or use a pump so the new steady-flow rate is larger.</span></div></div>
          <div class="bn-callout bn-check"><b>Continuity check:</b> ในสภาวะคงตัว ถ้าท่อ A และ B มีพื้นที่เท่ากัน \(A_A=A_B\) จะได้ \(v_A=v_B\). ปั๊มไม่ได้ทำให้ “หลังปั๊มเร็วกว่าเฉพาะจุด” แต่ทำให้ <b>ทั้งระบบเข้าสู่สภาวะใหม่ที่อัตราการไหลสูงขึ้น</b>.</div>
        </div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Bernoulli from Energy Conservation</span><span>1 / 4</span></div>
  </section>`;

  const page2=String.raw`
  <section class="sheet lesson-sheet bernoulli-guide" id="lesson-bernoulli-2" data-topic="bernoulli-torricelli-lift">
    <div class="topline"><div class="topic">แบร์นูลลี ทอริเชลลี และแรงยก / Bernoulli, Torricelli and Lift</div><div class="qno">GUIDED NOTES 2/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>2. งานจากความดันมาจากไหน? พิสูจน์ \(W=P\Delta V\) จาก \(W=F\Delta x\)</h1><div class="en-title">Where does pressure work come from? Derive \(W=P\Delta V\) from ordinary mechanical work.</div></div>
      <div class="bn-grid-2">
        <div class="bn-card">
          <h2>มองของไหลเป็นก้อนเล็กในท่อตรง <span class="bn-en">A small fluid slice in a straight tube</span></h2>
          <svg class="bn-svg" viewBox="0 0 700 390" role="img" aria-label="Pressure force on a fluid slice of area A moving distance delta x and sweeping volume delta V">
            <defs><marker id="bnA3" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
            <rect x="70" y="100" width="560" height="170" rx="18" fill="#f8fafc" stroke="#64748b" stroke-width="4"/>
            <rect x="190" y="100" width="145" height="170" fill="#dbeafe" stroke="#2563eb" stroke-width="3"/>
            <rect x="335" y="100" width="125" height="170" fill="#ecfdf5" stroke="#047857" stroke-width="3" stroke-dasharray="10 8"/>
            <line x1="95" y1="185" x2="175" y2="185" stroke="#0f172a" stroke-width="7" marker-end="url(#bnA3)"/>
            <text x="95" y="155" font-size="25" font-weight="700" fill="#0f172a">F = PA</text>
            <line x1="335" y1="310" x2="460" y2="310" stroke="#0f172a" stroke-width="4" marker-end="url(#bnA3)"/>
            <text x="397" y="345" text-anchor="middle" font-size="24" fill="#0f172a">Δx</text>
            <line x1="165" y1="88" x2="165" y2="282" stroke="#475569" stroke-width="3"/>
            <text x="120" y="75" font-size="23" fill="#475569">area A</text>
            <text x="397" y="190" text-anchor="middle" font-size="26" font-weight="700" fill="#047857">ΔV = AΔx</text>
            <text x="260" y="190" text-anchor="middle" font-size="24" font-weight="700" fill="#1d4ed8">fluid slice</text>
          </svg>
          <div class="bn-prompt">เริ่มจากนิยามความดันและงานที่เรารู้จักอยู่แล้ว<span class="bn-en">Start only from the familiar definitions of pressure and work.</span></div>
          <div class="bn-derive">
            <div class="bn-row"><div class="bn-step">STEP 1</div><div class="bn-formula">\(P=\dfrac{F}{A}\quad\Rightarrow\quad F=\)<span class="fill"><span class="guided-answer">\(PA\)</span></span></div></div>
            <div class="bn-row"><div class="bn-step">STEP 2</div><div class="bn-formula">\(W=F\Delta x=(PA)\Delta x=P(A\Delta x)\)</div></div>
            <div class="bn-row"><div class="bn-step">STEP 3</div><div class="bn-formula">\(A\Delta x=\)<span class="fill"><span class="guided-answer">\(\Delta V\)</span></span> \(\Rightarrow\quad \boxed{W=P\Delta V}\)</div></div>
          </div>
          <div class="bn-callout"><b>ไม่ใช่สูตรใหม่ลอย ๆ:</b> \(P\Delta V\) ก็คือ \(F\Delta x\) เดิม เพียงเขียนแรงเป็น \(F=PA\) และปริมาตรที่ถูกผลักเป็น \(\Delta V=A\Delta x\).</div>
        </div>
        <div class="bn-card">
          <h2>ตรวจหน่วย: ทำไม \(P\Delta V\) จึงเป็นพลังงาน? <span class="bn-en">Unit check: why is \(P\Delta V\) an energy?</span></h2>
          <div class="bn-eq">\[P\Delta V=\left(\frac{N}{m^2}\right)(m^3)=N\,m=J\]</div>
          <div class="bn-prompt">ดังนั้นความดันสามารถทำงานเพื่อเปลี่ยนพลังงานจลน์หรือพลังงานศักย์ของของไหลได้.<span class="bn-en">Pressure can therefore do work and change the fluid's kinetic or gravitational potential energy.</span></div>
          <h3>เมื่อของไหลไหลจาก A ไป B</h3>
          <svg class="bn-svg" viewBox="0 0 700 300" role="img" aria-label="Pressure at A pushes a fluid parcel forward while pressure at B pushes backward">
            <defs><marker id="bnA4" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
            <path d="M70 190 C220 190 260 190 350 150 C455 105 510 105 625 105" fill="none" stroke="#dbeafe" stroke-width="92" stroke-linecap="round"/>
            <path d="M70 190 C220 190 260 190 350 150 C455 105 510 105 625 105" fill="none" stroke="#64748b" stroke-width="4"/>
            <line x1="70" y1="190" x2="160" y2="190" stroke="#0f172a" stroke-width="7" marker-end="url(#bnA4)"/>
            <line x1="625" y1="105" x2="540" y2="105" stroke="#991b1b" stroke-width="7" marker-end="url(#bnA4)"/>
            <text x="80" y="155" font-size="24" font-weight="700" fill="#0f172a">PₐAₐ →</text>
            <text x="500" y="72" font-size="24" font-weight="700" fill="#991b1b">← PᵦAᵦ</text>
            <text x="78" y="250" font-size="25" font-weight="700" fill="#0f172a">A</text>
            <text x="610" y="165" font-size="25" font-weight="700" fill="#0f172a">B</text>
          </svg>
          <div class="bn-prompt">ด้าน A ผลักของไหลไปข้างหน้า → งานเป็นบวก ส่วนด้าน B ต้านการเคลื่อนที่ → งานเป็นลบ.<span class="bn-en">Pressure at A does positive work; pressure at B does negative work.</span></div>
          <div class="bn-eq">\[W_{\rm pressure}=P_A\Delta V-P_B\Delta V\]</div>
          <div class="bn-fixed-answer"><div class="guided-answer-block"><b>ใจความ:</b> ความต่างความดันไม่ใช่แค่ “แรงดัน” แต่เป็นแหล่งของ <b>งานสุทธิ</b> ที่สามารถเปลี่ยน \(K\) และ \(U_g\) ของของไหลได้.</div></div>
        </div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Pressure Work</span><span>2 / 4</span></div>
  </section>`;

  const page3=String.raw`
  <section class="sheet lesson-sheet bernoulli-guide" id="lesson-bernoulli-3" data-topic="bernoulli-torricelli-lift">
    <div class="topline"><div class="topic">แบร์นูลลี ทอริเชลลี และแรงยก / Bernoulli, Torricelli and Lift</div><div class="qno">GUIDED NOTES 3/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>3. จากกฎอนุรักษ์พลังงาน → สมการแบร์นูลลี</h1><div class="en-title">From conservation of energy to Bernoulli's equation</div></div>
      <div class="bn-grid-2">
        <div class="bn-card">
          <h2>ก้อนของไหลเดียวกันเคลื่อนจาก A ไป B <span class="bn-en">Follow the same small fluid volume from A to B</span></h2>
          <svg class="bn-svg" viewBox="0 0 720 350" role="img" aria-label="Fluid moving from lower point A to higher point B with pressure speed and height labels">
            <defs><marker id="bnA5" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker></defs>
            <path d="M70 255 C200 255 275 250 345 195 C430 130 505 95 650 95" fill="none" stroke="#dbeafe" stroke-width="100" stroke-linecap="round"/>
            <path d="M70 255 C200 255 275 250 345 195 C430 130 505 95 650 95" fill="none" stroke="#64748b" stroke-width="4"/>
            <line x1="100" y1="255" x2="185" y2="255" stroke="#0f172a" stroke-width="6" marker-end="url(#bnA5)"/>
            <line x1="515" y1="95" x2="610" y2="95" stroke="#0f172a" stroke-width="6" marker-end="url(#bnA5)"/>
            <text x="78" y="325" font-size="25" font-weight="700" fill="#0f172a">A: Pₐ, vₐ, hₐ</text>
            <text x="465" y="52" font-size="25" font-weight="700" fill="#0f172a">B: Pᵦ, vᵦ, hᵦ</text>
            <line x1="675" y1="255" x2="675" y2="95" stroke="#475569" stroke-width="3" marker-end="url(#bnA5)"/>
            <text x="684" y="180" font-size="22" fill="#475569">hᵦ−hₐ</text>
          </svg>
          <div class="bn-prompt">ให้ปริมาตรก้อนของไหลเท่ากับ \(\Delta V\) และมวลเท่ากับ \(m\). งานสุทธิจากความดันเปลี่ยนพลังงานกลของก้อนนี้.<span class="bn-en">Let the parcel volume be \(\Delta V\) and mass be \(m\). Net pressure work changes its mechanical energy.</span></div>
          <div class="bn-eq">\[W_{\rm pressure}=\Delta K+\Delta U_g\]</div>
          <div class="bn-eq">\[(P_A-P_B)\Delta V=\frac12m(v_B^2-v_A^2)+mg(h_B-h_A)\]</div>
          <div class="bn-callout bn-check"><b>นี่คือจุดตั้งต้นจริง:</b> งานจากความดันที่ A และ B แลกเปลี่ยนกับพลังงานจลน์และพลังงานศักย์โน้มถ่วง.</div>
        </div>
        <div class="bn-card">
          <h2>จัดรูปทีละบรรทัด <span class="bn-en">Rearrange step by step</span></h2>
          <div class="bn-derive">
            <div class="bn-row"><div class="bn-step">START</div><div class="bn-formula">\((P_A-P_B)\Delta V=\frac12m(v_B^2-v_A^2)+mg(h_B-h_A)\)</div></div>
            <div class="bn-row"><div class="bn-step">MOVE TERMS</div><div class="bn-formula guided-answer">\(P_A\Delta V+\frac12mv_A^2+mgh_A=P_B\Delta V+\frac12mv_B^2+mgh_B\)</div></div>
            <div class="bn-row"><div class="bn-step">÷ \(\Delta V\)</div><div class="bn-formula guided-answer">\(P_A+\frac12\frac{m}{\Delta V}v_A^2+\frac{m}{\Delta V}gh_A=P_B+\frac12\frac{m}{\Delta V}v_B^2+\frac{m}{\Delta V}gh_B\)</div></div>
            <div class="bn-row"><div class="bn-step">USE DENSITY</div><div class="bn-formula">\(\rho=\)<span class="fill short"><span class="guided-answer">\(\dfrac{m}{\Delta V}\)</span></span></div></div>
            <div class="bn-row"><div class="bn-step">BERNOULLI</div><div class="bn-formula guided-answer">\[\boxed{P_A+\frac12\rho v_A^2+\rho gh_A=P_B+\frac12\rho v_B^2+\rho gh_B}\]</div></div>
          </div>
          <div class="bn-callout"><b>เงื่อนไขของรูปพื้นฐานนี้:</b> การไหลคงตัว, ของไหลอัดตัวไม่ได้, ความหนืดน้อยมาก/ละเลยการสูญเสีย, พิจารณาตามเส้นการไหล และ <b>ไม่มีปั๊มหรือกังหันคั่นระหว่าง A กับ B</b>.<span class="bn-en">Steady, incompressible, negligible viscous losses, along a streamline, and no pump/turbine between the two points.</span></div>
          <div class="bn-fixed-answer"><div class="guided-answer-block">เขียนแบบจำง่าย: \[\boxed{P+\frac12\rho v^2+\rho gh=\text{constant}}\]</div></div>
        </div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Bernoulli Derivation</span><span>3 / 4</span></div>
  </section>`;

  const page4=String.raw`
  <section class="sheet lesson-sheet bernoulli-guide" id="lesson-bernoulli-4" data-topic="bernoulli-torricelli-lift">
    <div class="topline"><div class="topic">แบร์นูลลี ทอริเชลลี และแรงยก / Bernoulli, Torricelli and Lift</div><div class="qno">GUIDED NOTES 4/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title"><h1>4. อ่านสมการให้เป็น “การแลกพลังงาน” ไม่ใช่สูตรสามพจน์</h1><div class="en-title">Read Bernoulli as an energy trade-off, not as three unrelated terms.</div></div>
      <div class="bn-card">
        <h2>แต่ละพจน์คือพลังงานต่อหนึ่งหน่วยปริมาตร <span class="bn-en">Each term is an energy per unit volume</span></h2>
        <div class="bn-three">
          <div class="bn-energy"><div class="symbol">\(P\)</div><div class="meaning"><span class="guided-answer"><b>พลังงานจากความดันต่อปริมาตร</b><br>pressure-work energy per volume</span></div></div>
          <div class="bn-energy"><div class="symbol">\(\frac12\rho v^2\)</div><div class="meaning"><span class="guided-answer"><b>พลังงานจลน์ต่อปริมาตร</b><br>kinetic energy per volume</span></div></div>
          <div class="bn-energy"><div class="symbol">\(\rho gh\)</div><div class="meaning"><span class="guided-answer"><b>พลังงานศักย์โน้มถ่วงต่อปริมาตร</b><br>gravitational energy per volume</span></div></div>
        </div>
      </div>
      <div class="bn-grid-2">
        <div class="bn-card">
          <h2>กรณีพิเศษที่ควรเห็นทันที <span class="bn-en">Special cases to recognize immediately</span></h2>
          <div class="bn-prompt"><b>1) ท่อแนวนอน:</b> \(h_A=h_B\) จึงตัดพจน์ <span class="fill short"><span class="guided-answer">\(\rho gh\)</span></span></div>
          <div class="bn-eq">\[P_A+\frac12\rho v_A^2=P_B+\frac12\rho v_B^2\]</div>
          <div class="bn-prompt">ดังนั้นที่ระดับเดียวกัน ถ้า \(v\uparrow\) แล้ว \(P\) ต้อง <span class="fill short"><span class="guided-answer">ลดลง</span></span>.</div>
          <div class="bn-prompt"><b>2) ถังเปิดกับรูเล็ก:</b> ทั้งสองจุดสัมผัสบรรยากาศจึง \(P_A=P_B\), และถังใหญ่ทำให้ \(v_A\approx0\).</div>
          <div class="bn-fixed-answer"><div class="guided-answer-block">เหลือ \[\rho gh=\frac12\rho v^2\quad\Rightarrow\quad\boxed{v=\sqrt{2gh}}\] ซึ่งคือกฎของทอริเชลลี / Torricelli's law.</div></div>
        </div>
        <div class="bn-card">
          <h2>Continuity + Bernoulli ใช้คู่กันอย่างไร? <span class="bn-en">How continuity and Bernoulli work together</span></h2>
          <div class="bn-eq">\[A_1v_1=A_2v_2\]</div>
          <div class="bn-flow-chain">
            <span class="bn-chip">\(A\downarrow\)</span><span class="bn-arrow">→</span>
            <span class="bn-chip guided-answer">\(v\uparrow\)</span><span class="bn-arrow">→</span>
            <span class="bn-chip guided-answer">\(P\downarrow\) (same height)</span>
          </div>
          <div class="bn-prompt">โจทย์ท่อเปลี่ยนขนาดจึงมักทำสองขั้น: <b>Continuity หา \(v\)</b> ก่อน แล้ว <b>Bernoulli หา \(P\)</b>.</div>
          <div class="bn-callout bn-warning"><b>ถ้ามีปั๊มคั่นกลาง:</b> ห้ามใช้ \(P+\frac12\rho v^2+\rho gh=\text{constant}\) ข้ามปั๊มตรง ๆ เพราะปั๊มเพิ่มพลังงานจากภายนอก ต้องเพิ่มพจน์งาน/พลังงานของปั๊มในสมดุล.<span class="bn-en">Across a pump, the simple constant form is incomplete because external work is added.</span></div>
          <div class="bn-fixed-answer"><div class="guided-answer-block"><b>Strategy:</b> เลือก A และ B → ตรวจว่าพจน์ใดเท่ากัน/เป็นศูนย์ → ใช้ Continuity ถ้าต้องหาอัตราเร็ว → ใช้ Bernoulli → ตรวจทิศทางการแลกพลังงานว่สมเหตุผลหรือไม่.</div></div>
        </div>
      </div>
    </div>
    <div class="footer"><span>Guided Notes — Energy Trade-offs and Special Cases</span><span>4 / 4</span></div>
  </section>`;

  const holder=document.createElement('div');
  holder.innerHTML=page1+page2+page3+page4;
  const fragment=document.createDocumentFragment();
  while(holder.firstChild)fragment.appendChild(holder.firstChild);
  placeholder.replaceWith(fragment);

  const typeset=()=>{if(window.MathJax?.typesetPromise)window.MathJax.typesetPromise().catch(()=>{});};
  typeset();
  setTimeout(typeset,350);
})();
