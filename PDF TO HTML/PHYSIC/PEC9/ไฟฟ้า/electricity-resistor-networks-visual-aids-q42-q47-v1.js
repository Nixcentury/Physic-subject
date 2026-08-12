/* Visual-aid patch for PEC9 Electricity Q42-Q47.
   Adds simplified inline SVGs before the existing detailed solutions.
   These drawings emphasize nodes, equal branch voltage, and current splitting. */
(function(){
  const style=document.createElement('style');
  style.textContent=`
    .rn-visual-aid{margin:0 0 1.6mm;padding:1.8mm;border:1.2px solid #64748b;background:#f8fafc}
    .rn-visual-head{font-weight:800;color:#0f172a;margin-bottom:.8mm;font-size:9.7px}
    .rn-visual-sub{font-size:8.2px;color:#64748b;margin-top:.7mm;line-height:1.3}
    .rn-visual-aid svg{display:block;width:100%;height:auto;max-height:40mm;background:#fff;border:1px solid #cbd5e1}
    .rn-wire{stroke:#0f172a;stroke-width:2.1;fill:none;stroke-linecap:round;stroke-linejoin:round}
    .rn-res{stroke:#0f172a;stroke-width:2;fill:#fff}
    .rn-node{fill:#0f172a}
    .rn-txt{font:600 11px Arial,sans-serif;fill:#0f172a}
    .rn-small{font:600 9px Arial,sans-serif;fill:#475569}
    .rn-arrow{stroke:#475569;stroke-width:1.4;fill:none;marker-end:url(#rnArrow)}
  `;
  document.head.appendChild(style);

  const defs=`<defs><marker id="rnArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill="#475569"/></marker></defs>`;
  const box=(title,svg,sub)=>`<div class="rn-visual-aid"><div class="rn-visual-head">${title}</div>${svg}<div class="rn-visual-sub">${sub}</div></div>`;
  const resistor=(x,y,w=54,h=18)=>`<rect class="rn-res" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`;
  const dot=(x,y)=>`<circle class="rn-node" cx="${x}" cy="${y}" r="3"/>`;

  const q42=`<svg viewBox="0 0 440 145" role="img" aria-label="Simplified voltage divider">
    ${defs}
    <line class="rn-wire" x1="35" y1="72" x2="90" y2="72"/>
    ${resistor(90,63,85,18)}<text class="rn-txt" x="132" y="56" text-anchor="middle">R₁</text>
    <line class="rn-wire" x1="175" y1="72" x2="235" y2="72"/>${dot(235,72)}<text class="rn-txt" x="235" y="94" text-anchor="middle">A</text>
    ${resistor(235,63,95,18)}<text class="rn-txt" x="282" y="56" text-anchor="middle">RAB</text>
    <line class="rn-wire" x1="330" y1="72" x2="405" y2="72"/>${dot(405,72)}<text class="rn-txt" x="405" y="94" text-anchor="middle">B</text>
    <line class="rn-arrow" x1="45" y1="30" x2="395" y2="30"/><text class="rn-small" x="220" y="22" text-anchor="middle">Vtotal</text>
    <line class="rn-arrow" x1="245" y1="118" x2="395" y2="118"/><text class="rn-small" x="320" y="137" text-anchor="middle">VAB</text>
    <text class="rn-small" x="215" y="84" text-anchor="middle">same I</text>
  </svg>`;

  const q43=`<svg viewBox="0 0 440 175" role="img" aria-label="Two resistors in parallel">
    ${defs}
    <line class="rn-wire" x1="55" y1="35" x2="55" y2="140"/><line class="rn-wire" x1="385" y1="35" x2="385" y2="140"/>
    ${dot(55,87)}${dot(385,87)}
    <line class="rn-wire" x1="55" y1="58" x2="145" y2="58"/>${resistor(145,49,110,18)}<line class="rn-wire" x1="255" y1="58" x2="385" y2="58"/><text class="rn-txt" x="200" y="42" text-anchor="middle">3 Ω</text>
    <line class="rn-wire" x1="55" y1="118" x2="145" y2="118"/>${resistor(145,109,110,18)}<line class="rn-wire" x1="255" y1="118" x2="385" y2="118"/><text class="rn-txt" x="200" y="102" text-anchor="middle">6 Ω</text>
    <line class="rn-arrow" x1="15" y1="87" x2="48" y2="87"/><text class="rn-small" x="18" y="75">Itotal</text>
    <text class="rn-small" x="320" y="31">V1 = V2 = Vtotal = 36 V</text>
    <text class="rn-small" x="275" y="53">I1 = 12 A</text><text class="rn-small" x="275" y="113">I2 = 6 A</text>
  </svg>`;

  const q45=`<svg viewBox="0 0 440 170" role="img" aria-label="Current division in two parallel resistors">
    ${defs}
    <line class="rn-wire" x1="55" y1="35" x2="55" y2="135"/><line class="rn-wire" x1="385" y1="35" x2="385" y2="135"/>
    <line class="rn-wire" x1="55" y1="58" x2="145" y2="58"/>${resistor(145,49,110,18)}<line class="rn-wire" x1="255" y1="58" x2="385" y2="58"/><text class="rn-txt" x="200" y="42" text-anchor="middle">3 Ω</text>
    <line class="rn-wire" x1="55" y1="115" x2="145" y2="115"/>${resistor(145,106,110,18)}<line class="rn-wire" x1="255" y1="115" x2="385" y2="115"/><text class="rn-txt" x="200" y="99" text-anchor="middle">4 Ω</text>
    <line class="rn-arrow" x1="15" y1="85" x2="48" y2="85"/><text class="rn-small" x="18" y="73">3.5 A</text>
    <text class="rn-small" x="276" y="53">2 A</text><text class="rn-small" x="276" y="110">1.5 A</text>
    <text class="rn-small" x="220" y="153" text-anchor="middle">same voltage across both branches</text>
  </svg>`;

  const q46=`<svg viewBox="0 0 440 170" role="img" aria-label="Parallel branches with known current through 3 ohm resistor">
    ${defs}
    <line class="rn-wire" x1="55" y1="35" x2="55" y2="135"/><line class="rn-wire" x1="385" y1="35" x2="385" y2="135"/>
    <line class="rn-wire" x1="55" y1="58" x2="145" y2="58"/>${resistor(145,49,110,18)}<line class="rn-wire" x1="255" y1="58" x2="385" y2="58"/><text class="rn-txt" x="200" y="42" text-anchor="middle">3 Ω</text><text class="rn-small" x="278" y="53">10 A</text>
    <line class="rn-wire" x1="55" y1="115" x2="145" y2="115"/>${resistor(145,106,110,18)}<line class="rn-wire" x1="255" y1="115" x2="385" y2="115"/><text class="rn-txt" x="200" y="99" text-anchor="middle">6 Ω</text><text class="rn-small" x="278" y="110">?</text>
    <text class="rn-small" x="220" y="153" text-anchor="middle">V = (10 A)(3 Ω) = 30 V on both branches</text>
  </svg>`;

  const q47=`<svg viewBox="0 0 440 175" role="img" aria-label="Parallel current split with one known branch current">
    ${defs}
    <line class="rn-wire" x1="55" y1="35" x2="55" y2="140"/><line class="rn-wire" x1="385" y1="35" x2="385" y2="140"/>
    <line class="rn-wire" x1="55" y1="58" x2="145" y2="58"/>${resistor(145,49,110,18)}<line class="rn-wire" x1="255" y1="58" x2="385" y2="58"/><text class="rn-txt" x="200" y="42" text-anchor="middle">4 Ω</text><text class="rn-small" x="278" y="53">15 A</text>
    <line class="rn-wire" x1="55" y1="118" x2="145" y2="118"/>${resistor(145,109,110,18)}<line class="rn-wire" x1="255" y1="118" x2="385" y2="118"/><text class="rn-txt" x="200" y="102" text-anchor="middle">Rother (from figure)</text><text class="rn-small" x="278" y="113">5 A</text>
    <line class="rn-arrow" x1="15" y1="87" x2="48" y2="87"/><text class="rn-small" x="10" y="73">Itotal = ?</text>
    <text class="rn-small" x="220" y="158" text-anchor="middle">junction rule: Itotal = 15 A + 5 A</text>
  </svg>`;

  D[42]=box('วาดใหม่ก่อนคิด: ตัวแบ่งแรงดัน / Redraw first: voltage divider',q42,'อนุกรม: กระแสเท่ากัน จึงแบ่งแรงดันตามความต้านทาน / Series: same current, so voltage divides in proportion to resistance.')+D[42];
  D[43]=box('วาดใหม่ให้เห็นโหนดร่วม / Redraw to expose the common nodes',q43,'ขนาน: ปลายทั้งสองของทุกแขนงต่ออยู่กับโหนดคู่เดียวกัน จึงมีแรงดันเท่ากัน / Parallel branches share the same two nodes, so their voltages are equal.')+D[43];
  D[45]=box('ภาพช่วยคิดกระแสแบ่ง / Current-divider visual',q45,'ความต้านทานน้อยกว่าจะรับกระแสมากกว่า แต่แรงดันคร่อมเท่ากัน / The lower-resistance branch carries more current, while both branches have the same voltage.')+D[45];
  D[46]=box('เริ่มจากแขนงที่รู้ I และ R / Start from the branch with known I and R',q46,'หาแรงดันร่วมจากแขนง 3 Ω ก่อน แล้วใช้แรงดันเดียวกันกับแขนง 6 Ω / Find the common voltage from the 3 Ω branch, then apply it to the 6 Ω branch.')+D[46];
  D[47]=box('วาดจุดแยกกระแสให้ชัด / Make the current split explicit',q47,'เมื่อหากระแสแขนงที่เหลือได้แล้ว ใช้กฎที่จุดแยก: กระแสเข้า = ผลรวมกระแสออก / After finding the other branch current, use the junction rule: current in = sum of currents out.')+D[47];
})();
