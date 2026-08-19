/* Liquid Pressure Guided Notes — page 2/4.
   Inserts after Guided Notes 1/4 and keeps the same fixed-space Show/Hide Answers behavior. */
(function(){
  const page1=document.getElementById('lesson-liquid-pressure-1');
  if(!page1){console.warn('Liquid-pressure Guided Notes 1/4 not found.');return;}
  if(document.getElementById('lesson-liquid-pressure-2')) return;

  const style=document.createElement('style');
  style.textContent=String.raw`
    .lp2-column-wrap{display:grid;grid-template-columns:1.05fr .95fr;gap:3mm;min-height:0}
    .lp2-card{border:1.4px solid var(--navy);background:#fff;padding:3mm;min-height:0}
    .lp2-card h2{margin:0 0 1.6mm;font-size:13.4px;color:var(--navy);line-height:1.25}
    .lp2-card h3{margin:2mm 0 1mm;font-size:11.3px;color:#334155}
    .lp2-en{display:block;margin-top:.5mm;color:#64748b;font-size:9px;font-weight:400;line-height:1.4}
    .lp2-svg{display:block;width:100%;height:auto;max-height:76mm;margin:1mm auto 2mm}
    .lp2-prompt{margin:1.3mm 0;font-size:10.6px;line-height:1.5}
    .lp2-chain{display:grid;gap:1.15mm;margin-top:1.5mm}
    .lp2-row{display:grid;grid-template-columns:31mm 1fr;align-items:center;gap:2mm;min-height:10.5mm;padding:1.25mm 1.7mm;border:1px solid #e2e8f0;background:#fff}
    .lp2-step{font-size:8.9px;font-weight:800;color:#475569;line-height:1.3}
    .lp2-formula{text-align:center;font-size:10.8px;line-height:1.4}
    .lp2-final{margin-top:2mm;padding:2.4mm;border:1.7px solid var(--navy);background:#f8fafc;text-align:center;font-size:14px;font-weight:850}
    .lp2-callout{margin-top:2mm;padding:2.1mm 2.6mm;border-left:3px solid #475569;background:#f8fafc;font-size:10.1px;line-height:1.48}
    .lp2-check{border-left-color:#047857;background:#ecfdf5}
    .lp2-warning{border-left-color:#b45309;background:#fffbeb}
    .lp2-fixed-answer{min-height:17mm;border:1px dashed #94a3b8;padding:2mm 2.5mm;background:#fff;font-size:10px;line-height:1.45}
    .lp2-props{display:grid;grid-template-columns:repeat(3,1fr);gap:1.8mm;margin-top:2mm}
    .lp2-prop{border:1px solid #cbd5e1;padding:2mm;text-align:center;background:#fff;min-height:24mm}
    .lp2-prop b{display:block;font-size:12.5px;color:var(--navy);margin-bottom:.7mm}
    .lp2-prop small{display:block;font-size:8.6px;line-height:1.35;color:#64748b}
    .lp2-mini-example{margin-top:2mm;border:1px solid #cbd5e1;background:#fff;padding:2.2mm 2.6mm;font-size:9.8px;line-height:1.48}
    .lp2-mini-example .calc{text-align:center;font-size:10.6px;margin-top:1mm}
    @media(max-width:720px){.lp2-column-wrap,.lp2-props{grid-template-columns:1fr}.lp2-row{grid-template-columns:1fr}.lp2-step{text-align:center}.lp2-svg{max-height:none}}
    @media print{
      #lesson-liquid-pressure-2{height:297mm!important}
      .lp2-card{padding:2.4mm}.lp2-svg{max-height:68mm}
      .lp2-prompt,.lp2-callout,.lp2-fixed-answer,.lp2-mini-example{font-size:9.1px}
      .lp2-en{font-size:8px}.lp2-formula{font-size:9.6px}.lp2-final{font-size:12px}
    }
  `;
  document.head.appendChild(style);

  const page2=String.raw`
  <section class="sheet lesson-sheet liquid-pressure-guide" id="lesson-liquid-pressure-2" data-topic="liquid-pressure">
    <div class="topline"><div class="topic">ความดันในของเหลว / Pressure in Liquids</div><div class="qno">GUIDED NOTES 2/4</div></div>
    <div class="lesson-body">
      <div class="lesson-title">
        <h1>2. สร้าง \(P_g=\rho gh\) จาก “น้ำหนักของแท่งของเหลว”</h1>
        <div class="en-title">Build \(P_g=\rho gh\) from the weight of a liquid column.</div>
      </div>

      <div class="lp2-column-wrap">
        <div class="lp2-card">
          <h2>ฉุกคิด — อะไรกดจุดที่อยู่ลึกลงไป? <span class="lp2-en">What produces the extra pressure deeper in a liquid?</span></h2>
          <svg class="lp2-svg" viewBox="0 0 700 430" role="img" aria-label="A vertical liquid column of cross-sectional area A and height h above a small horizontal surface">
            <defs>
              <marker id="lp2arr" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0 0 L9 4.5 L0 9 Z" fill="#0f172a"/></marker>
            </defs>
            <rect x="210" y="55" width="280" height="285" fill="#e0f2fe" stroke="#334155" stroke-width="4"/>
            <line x1="210" y1="55" x2="490" y2="55" stroke="#0284c7" stroke-width="5"/>
            <text x="510" y="64" font-size="20" fill="#475569">surface</text>
            <line x1="210" y1="340" x2="490" y2="340" stroke="#0f172a" stroke-width="6"/>
            <text x="350" y="373" text-anchor="middle" font-size="21" font-weight="700" fill="#0f172a">area A</text>
            <line x1="150" y1="58" x2="150" y2="337" stroke="#475569" stroke-width="3"/>
            <line x1="137" y1="58" x2="163" y2="58" stroke="#475569" stroke-width="3"/>
            <line x1="137" y1="337" x2="163" y2="337" stroke="#475569" stroke-width="3"/>
            <text x="115" y="205" text-anchor="middle" font-size="26" font-weight="700" fill="#475569">h</text>
            <line x1="350" y1="120" x2="350" y2="290" stroke="#0f172a" stroke-width="7" marker-end="url(#lp2arr)"/>
            <text x="374" y="210" font-size="25" font-weight="700" fill="#0f172a">W = mg</text>
            <rect x="235" y="387" width="230" height="34" rx="15" fill="#ecfdf5" stroke="#047857" stroke-width="2"/>
            <text x="350" y="410" text-anchor="middle" font-size="17" font-weight="700" fill="#047857">consider this liquid column</text>
          </svg>
          <div class="lp2-prompt">ถ้าเรามองเฉพาะแท่งของเหลวเหนือพื้นที่ \(A\) สูง \(h\) แรงที่ทำให้ความดันด้านล่างเพิ่มขึ้นมาจาก <span class="fill wide"><span class="guided-answer">น้ำหนักของแท่งของเหลว</span></span><span class="lp2-en">For a liquid column of area \(A\) and height \(h\), the pressure increase at the bottom comes from the <span class="fill wide"><span class="guided-answer">weight of the liquid column</span></span>.</span></div>
          <div class="lp2-fixed-answer"><div class="guided-answer-block"><b>ภาพที่ควรจำ / Mental model:</b> จุดที่ลึกกว่ามีของเหลวอยู่เหนือมันมากกว่า จึงต้องรองรับน้ำหนักของของเหลวมากกว่า และความดันจึงมากขึ้น.<span class="lp2-en">A deeper point has more liquid above it, so the liquid must support more weight and the pressure is greater.</span></div></div>
        </div>

        <div class="lp2-card">
          <h2>สร้างสมการทีละบรรทัด <span class="lp2-en">Derive the equation step by step</span></h2>
          <div class="lp2-prompt">เริ่มจากเรขาคณิตและนิยามที่เรารู้อยู่แล้ว ไม่ต้องท่อง \(\rho gh\) ล่วงหน้า.<span class="lp2-en">Start from geometry and definitions we already know; do not memorise \(\rho gh\) first.</span></div>
          <div class="lp2-chain">
            <div class="lp2-row"><div class="lp2-step">1. ปริมาตร<br>Volume</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle V=Ah\)</span></div></div>
            <div class="lp2-row"><div class="lp2-step">2. จาก \(\rho=m/V\)<br>Density</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle m=\rho V=\rho Ah\)</span></div></div>
            <div class="lp2-row"><div class="lp2-step">3. น้ำหนัก<br>Weight</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle W=mg=\rho Ahg\)</span></div></div>
            <div class="lp2-row"><div class="lp2-step">4. แรงที่กดพื้นที่ \(A\)<br>Force</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle F=W=\rho Ahg\)</span></div></div>
            <div class="lp2-row"><div class="lp2-step">5. ใช้ \(P=F/A\)<br>Pressure</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle P_g=\frac{F}{A}=\frac{\rho Ahg}{A}\)</span></div></div>
            <div class="lp2-row"><div class="lp2-step">6. ตัด \(A\)<br>Cancel \(A\)</div><div class="lp2-formula"><span class="guided-answer">\(\displaystyle P_g=\rho gh\)</span></div></div>
          </div>
          <div class="lp2-final"><span class="guided-answer">\(\boxed{P_g=\rho gh}\)</span></div>
          <div class="lp2-callout lp2-check"><b>สังเกต:</b> พื้นที่ \(A\) ถูกตัดออกไปเองระหว่างการพิสูจน์ นี่คือเบาะแสสำคัญว่า ความดันที่ความลึกหนึ่งไม่ได้ขึ้นกับว่าถังกว้างหรือแคบแค่ไหน.<span class="lp2-en"><b>Notice:</b> The area \(A\) cancels naturally. This hints that pressure at a given depth does not depend on the container width.</span></div>
        </div>
      </div>

      <div class="lp2-card">
        <h2>อ่านความหมายจากสมการ ไม่ใช่แค่จำสูตร <span class="lp2-en">Read the physics from the equation, not just the symbols</span></h2>
        <div class="lp2-props">
          <div class="lp2-prop"><b>\(P_g\propto h\)</b><small>ยิ่งลึก ความดันเกจยิ่งมาก<br><span class="guided-answer">deeper → greater gauge pressure</span></small></div>
          <div class="lp2-prop"><b>\(P_g\propto \rho\)</b><small>ของเหลวหนาแน่นกว่ากดมากกว่า ที่ความลึกเท่ากัน<br><span class="guided-answer">denser liquid → greater pressure at the same depth</span></small></div>
          <div class="lp2-prop"><b>ไม่เห็น \(A\)</b><small>ความดันไม่ขึ้นกับพื้นที่หน้าตัดของถังโดยตรง<br><span class="guided-answer">pressure does not directly depend on tank cross-sectional area</span></small></div>
        </div>
        <div class="lp2-prompt"><b>ฉุกคิด B:</b> ถัง A กว้างกว่าถัง B มาก แต่ใส่น้ำชนิดเดียวกันและมีระดับน้ำสูงเท่ากัน ความดันเกจที่ก้นถังใดมากกว่า?<span class="lp2-en"><b>Think B:</b> Tank A is much wider than Tank B, but both contain the same liquid to the same depth. Which bottom has greater gauge pressure?</span></div>
        <div class="lp2-fixed-answer"><div class="guided-answer-block"><b>คำตอบ / Answer:</b> เท่ากัน เพราะ \(\rho\), \(g\) และ \(h\) เท่ากัน ดังนั้น \(P_{g,A}=P_{g,B}\). ปริมาณน้ำทั้งหมดต่างกันได้ แต่ความดันที่ความลึกเท่ากันยังเท่ากัน.<span class="lp2-en">They are equal because \(\rho\), \(g\), and \(h\) are the same. The total amount of water may differ, but the pressure at the same depth is equal.</span></div></div>
        <div class="lp2-mini-example"><b>เช็กตัวเลขเร็ว ๆ / Quick numerical check:</b> น้ำ \(\rho=1000\,\mathrm{kg/m^3}\), \(g=10\,\mathrm{m/s^2}\), ลึก \(2.0\,\mathrm m\).<div class="calc"><span class="guided-answer">\(P_g=(1000)(10)(2.0)=2.0\times10^4\,\mathrm{Pa}\)</span></div><span class="lp2-en">This is gauge pressure caused by the liquid column only. Atmospheric pressure will be added later when absolute pressure is required.</span></div>
        <div class="lp2-callout lp2-warning"><b>คำที่ต้องแยกให้ชัด:</b> สูตรนี้ให้ <b>ความดันเกจจากของเหลว</b> \(P_g\). ยังไม่ใช่ความดันสัมบูรณ์ ถ้าโจทย์ถาม absolute pressure เราจะรวมความดันบรรยากาศในหน้า 4/4.<span class="lp2-en">This equation gives the liquid's <b>gauge pressure</b>. Absolute pressure will include atmospheric pressure later.</span></div>
      </div>
    </div>
    <div class="footer"><span>KRU KIRD • Guided Notes</span><span>Pressure in Liquids • 2/4</span></div>
  </section>`;

  page1.insertAdjacentHTML('afterend',page2);
  const inserted=document.getElementById('lesson-liquid-pressure-2');
  if(window.MathJax?.typesetPromise && inserted){window.MathJax.typesetPromise([inserted]).catch(()=>{});}
})();
