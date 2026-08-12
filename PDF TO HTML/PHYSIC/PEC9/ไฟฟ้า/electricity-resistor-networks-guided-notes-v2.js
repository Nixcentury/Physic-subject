/* Guided Notes v2: Resistor Networks / การต่อตัวต้านทาน
   Extends v1 to 11 spacious pages.
   Key revision: page 6 pairs short circuit with open circuit; page 7 separates
   and proves voltage division and current division before later special networks. */
const resistorGuidedV2Style=document.createElement('style');
resistorGuidedV2Style.textContent=String.raw`
.resistor-guided-v1 .rg-state-card{border:1.5px solid var(--navy);background:#fff;padding:2.6mm}
.resistor-guided-v1 .rg-state-card .state-name{font-size:12px;font-weight:900;color:var(--navy);margin-bottom:1mm}
.resistor-guided-v1 .rg-state-card .state-eq{font-size:13px;font-weight:800;text-align:center;padding:1.8mm;background:#f8fafc;border:1px solid #cbd5e1;margin:1.6mm 0}
.resistor-guided-v1 .rg-proof-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.7mm;min-height:0}
.resistor-guided-v1 .rg-proof-card{border:1.5px solid var(--navy);background:#fff;padding:2.8mm;display:flex;flex-direction:column;gap:1.5mm}
.resistor-guided-v1 .rg-proof-card .proof-head{font-size:11px;font-weight:900;color:var(--navy)}
.resistor-guided-v1 .rg-proof-line{border-left:3px solid #94a3b8;background:#f8fafc;padding:1.7mm 2.2mm;font-size:9.5px;line-height:1.4}
.resistor-guided-v1 .rg-proof-final{border:1.5px solid var(--navy);padding:2mm;text-align:center;font-size:12px;font-weight:850;background:#fff}
@media(max-width:720px){.resistor-guided-v1 .rg-proof-grid{grid-template-columns:1fr}}
`;
document.head.appendChild(resistorGuidedV2Style);

const rgPageV2=(n,total,title,sub,body)=>String.raw`
<section class="sheet lesson-sheet lesson-guided resistor-guided-v1" id="lesson-resistor-networks-${n}" data-topic="resistor-networks" aria-label="${title}">
 <div class="topline"><div class="topic">การต่อตัวต้านทาน / Resistor Networks</div><div class="qno">Guided Notes ${n}/${total}</div></div>
 <div class="rg-body">
  <div class="rg-hero"><div class="rg-kicker">RESISTOR NETWORKS • CONCEPT ${n}</div><div class="rg-title">${title}</div><div class="rg-sub">${sub}</div></div>
  ${body}
 </div>
 <div class="footer"><span>PEC9 Electricity • Guided Notes</span><span>Resistor Networks • ${n}/${total}</span></div>
</section>`;

const openCircuitSvg=String.raw`<svg viewBox="0 0 720 260" role="img" aria-label="Open circuit with a broken path">
<g fill="none" stroke="#111827" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
 <line x1="90" y1="130" x2="235" y2="130"/>
 <rect x="235" y="100" width="150" height="60" rx="4"/>
 <line x1="385" y1="130" x2="480" y2="130"/>
 <line x1="480" y1="130" x2="540" y2="85"/>
 <line x1="570" y1="130" x2="630" y2="130"/>
 <circle cx="550" cy="130" r="5" fill="#111827"/>
 <circle cx="570" cy="130" r="5" fill="#111827"/>
</g>
<g fill="#111827" font-family="Arial,sans-serif"><text x="310" y="137" text-anchor="middle" font-size="20" font-weight="700">R</text><text x="555" y="63" text-anchor="middle" font-size="16">break / จุดขาด</text><text x="360" y="210" text-anchor="middle" font-size="18" font-weight="700">R_open → ∞  →  I → 0</text></g>
</svg>`;

const resistorNetworkLessonPagesV2=group=>{
 const oldPages=resistorNetworkLessonPages(group);
 const firstFive=oldPages.slice(0,5).map(p=>p.replaceAll('/9','/11'));
 const page6=rgPageV2(6,11,'วงจรลัดและวงจรเปิด / Short circuit and open circuit','เปรียบเทียบสองกรณีสุดขั้วก่อนทำโจทย์: ลวดที่เกือบไม่มีความต้านทาน กับทางเดินที่ขาดจนกระแสผ่านไม่ได้ / Compare the two limiting cases: an almost-zero-resistance path and a broken path.',String.raw`
<div class="rg-grid-2">
 <div class="rg-state-card"><div class="state-name">Short circuit / วงจรลัด</div><div class="rg-visual">${shortSvg}</div><div class="rg-th">ลวดอุดมคติมี \(R\approx0\). จุดทั้งสองที่เชื่อมด้วยลวดจึงแทบมีศักย์เท่ากัน ถ้าลวดคร่อมตัวต้านทานทั้งสองปลาย ตัวต้านทานนั้นถูก bypass.</div><div class="rg-en">An ideal wire has nearly zero resistance. A resistor bridged by that wire is bypassed because its two terminals are at essentially the same potential.</div><div class="state-eq">\[\Delta V_R\approx0\Rightarrow I_R=\frac{\Delta V_R}{R}\approx0\]</div><div class="rg-trap">สำหรับการลดรูป: ลวดลัดทำให้ปลายทั้งสองเป็น <b>node เดียวกัน</b>.</div></div>
 <div class="rg-state-card"><div class="state-name">Open circuit / วงจรเปิด (วงจรขาด)</div><div class="rg-visual">${openCircuitSvg}</div><div class="rg-th">เมื่อทางเดินขาด กระแสไม่สามารถไหลข้ามช่องว่างได้ ในแบบจำลองอุดมคติให้มองว่าความต้านทานของจุดขาดมีค่ามากมากจนเข้าใกล้อนันต์</div><div class="rg-en">A broken path cannot carry current. In the ideal model, the resistance of the break tends to infinity.</div><div class="state-eq">\[R_{\rm open}\to\infty\Rightarrow I=\frac{V}{R_{\rm open}}\to0\]</div><div class="rg-trap">ถ้าจุดขาดอยู่ในทางเดินอนุกรมเพียงทางเดียว กระแสของทางเดินนั้นเป็นศูนย์ทั้งหมด แต่ <b>แรงดันคร่อมจุดขาดอาจไม่เป็นศูนย์</b>.</div></div>
</div>
<div class="rg-memory"><div class="big" style="font-size:17px">SHORT: \(R\to0\) &nbsp; • &nbsp; OPEN: \(R\to\infty\)</div><div class="small">Short circuit merges nodes; open circuit breaks a current path.</div></div>`);

 const page7=rgPageV2(7,11,'พิสูจน์กฎการแบ่งแรงดันและกระแส / Deriving voltage and current division','แยกพิสูจน์สองกรณีให้ชัด: อนุกรมแบ่งแรงดันด้วย R ส่วนขนานแบ่งกระแสด้วย G / Derive the two rules separately: series voltage division uses R; parallel current division uses G.',String.raw`
<div class="rg-proof-grid">
 <div class="rg-proof-card"><div class="proof-head">A. Voltage divider — อนุกรม</div><div class="rg-th">กระแสในอนุกรมเท่ากันทุกตัว ให้กระแสเดียวกันเป็น \(I\)</div><div class="rg-proof-line"><b>1.</b> ที่ตัวที่ \(k\): \(V_k=IR_k\)</div><div class="rg-proof-line"><b>2.</b> ทั้งชุด: \(V_T=I(R_1+R_2+\cdots+R_n)=I\sum R\)</div><div class="rg-proof-line"><b>3.</b> หารสองสมการ: \(\dfrac{V_k}{V_T}=\dfrac{IR_k}{I\sum R}\)</div><div class="rg-proof-line"><b>4.</b> ตัด \(I\) ออก</div><div class="rg-proof-final">\[\boxed{V_k=V_T\frac{R_k}{\sum R}}\]</div><div class="rg-note">Resistance มากกว่า → รับส่วนแบ่งแรงดันมากกว่า เพราะกระแสเดียวกันไหลผ่าน.</div></div>
 <div class="rg-proof-card"><div class="proof-head">B. Current divider — ขนาน</div><div class="rg-th">แรงดันในขนานเท่ากันทุกแขนง ให้แรงดันร่วมเป็น \(V\) และใช้ \(G=1/R\)</div><div class="rg-proof-line"><b>1.</b> แขนงที่ \(k\): \(I_k=\dfrac{V}{R_k}=VG_k\)</div><div class="rg-proof-line"><b>2.</b> กระแสรวม: \(I_T=V(G_1+G_2+\cdots+G_n)=V\sum G\)</div><div class="rg-proof-line"><b>3.</b> หารสองสมการ: \(\dfrac{I_k}{I_T}=\dfrac{VG_k}{V\sum G}\)</div><div class="rg-proof-line"><b>4.</b> ตัด \(V\) ออก</div><div class="rg-proof-final">\[\boxed{I_k=I_T\frac{G_k}{\sum G}}\]</div><div class="rg-note">Conductance มากกว่า → กระแสผ่านแขนงนั้นมากกว่า.</div></div>
</div>
<div class="rg-grid-2"><div class="rg-card soft"><div class="rg-card-title">Current divider ในรูป R / Resistance form</div><div class="rg-equation">\[\boxed{I_k=I_T\frac{1/R_k}{\sum(1/R)}}\]</div></div><div class="rg-card soft"><div class="rg-card-title">กรณีขนาน 2 แขนง / Two branches</div><div class="rg-equation">\[I_1=I_T\frac{R_2}{R_1+R_2},\qquad I_2=I_T\frac{R_1}{R_1+R_2}\]</div><div class="rg-note">รูป “ไขว้ R” เป็นเพียงผลจากสูตรทั่วไป ไม่ใช่กฎใหม่ที่แยกออกมา.</div></div></div>
<div class="rg-memory"><div class="big" style="font-size:17px">Voltage division → use \(R\) &nbsp; • &nbsp; Current division → use \(G\)</div></div>`);

 const page8=rgPageV2(8,11,'การย้ายและวาดวงจรใหม่ / Circuit rearrangement and redrawing','ย้ายตำแหน่งบนกระดาษได้ ตราบใดที่ “คู่โหนดของอุปกรณ์ทุกตัว” ไม่เปลี่ยน / Geometry may change, but electrical connectivity must not.',String.raw`
<div class="rg-visual">${rearrangeSvg}</div>
<div class="rg-grid-2"><div class="rg-card key"><div class="rg-card-title">กฎทอง / Golden rule</div><div class="rg-memory"><div class="big" style="font-size:16px">ย้ายรูปได้ — ห้ามเปลี่ยน NODE</div><div class="small">You may redraw geometry, but you must preserve electrical connectivity.</div></div><div class="rg-th" style="margin-top:2mm">ก่อนวาดใหม่ ให้ตั้งชื่อโหนด A, B, C, … แล้วจดว่าตัวต้านทานแต่ละตัวต่อระหว่างโหนดคู่ใด</div></div><div class="rg-card"><div class="rg-card-title">ขั้นตอนมาตรฐาน / Standard method</div><div class="rg-derive"><div class="rg-step"><b>1. Label nodes</b><span>ลากตามลวดที่ไม่มีอุปกรณ์คั่น จุดทั้งหมดนั้นคือ node เดียวกัน</span></div><div class="rg-step"><b>2. Make a node-pair list</b><span>เช่น \(R_1:A\!\leftrightarrow\!B\), \(R_2:A\!\leftrightarrow\!C\)</span></div><div class="rg-step"><b>3. Redraw</b><span>วาดให้ series/parallel มองง่ายขึ้น โดยรักษาคู่โหนดเดิม</span></div><div class="rg-step"><b>4. Reduce</b><span>ยุบเฉพาะกลุ่มที่เป็นอนุกรมหรือขนานจริง</span></div></div></div></div>
<div class="rg-trap"><b>ข้อห้าม:</b> เส้นไขว้ไม่ได้แปลว่าเชื่อมกันเสมอ ต้องดู “จุดดำ/จุดต่อ” และการลากเส้นในรูปต้นฉบับก่อน.</div>`);

 const page9=rgPageV2(9,11,'สะพานวีตสโตน / Wheatstone Bridge','ถ้าสะพานสมดุล จุดกึ่งกลางสองฝั่งมีศักย์เท่ากัน จึงไม่มีกระแสผ่านแขนกลาง / At balance the two midpoints are equipotential.',String.raw`
<div class="rg-grid-2"><div class="rg-visual">${wheatstoneSvg}</div><div class="rg-card key"><div class="rg-card-title">เงื่อนไขสมดุล / Balance condition</div><div class="rg-equation key">\[\boxed{\frac{R_1}{R_2}=\frac{R_3}{R_4}}\]</div><div class="rg-th">เมื่อสมดุล: \(V_C=V_D\) ดังนั้นแรงดันคร่อมกัลวานอมิเตอร์หรือแขนกลางเป็นศูนย์</div><div class="rg-equation">\[\Delta V_{CD}=0\Rightarrow I_G=0\]</div><div class="rg-en">At balance, the midpoint potentials are equal, so no current flows through the bridge branch.</div></div></div>
<div class="rg-flow"><span>ตรวจอัตราส่วน</span><i>→</i><span>ถ้าสมดุล: ตัดแขนกลาง</span><i>→</i><span>รวมแต่ละแขนอนุกรม</span><i>→</i><span>สองแขนขนาน</span></div>
<div class="rg-equation">\[R_{AB}=(R_1+R_2)\parallel(R_3+R_4)\qquad\text{(เมื่อสมดุลเท่านั้น)}\]</div>
<div class="rg-trap">ถ้าอัตราส่วนไม่เท่ากัน <b>ห้ามตัดแขนกลาง</b>. ต้องใช้ Kirchhoff หรือการแปลงเครือข่ายที่เหมาะสม.</div>`);

 const page10=rgPageV2(10,11,'เดลตาเป็นวาย / Delta to Wye (Δ→Y)','เครื่องมือเพิ่มเติมสำหรับวงจรที่ยุบ series/parallel ตรง ๆ ไม่ได้ / An extension method for networks that cannot be reduced directly.',String.raw`
<div class="rg-grid-2"><div class="rg-visual">${deltaYSvg}</div><div class="rg-card key"><div class="rg-card-title">\(\Delta\rightarrow Y\) (Extension)</div><div class="rg-th">ให้ \(S=R_{AB}+R_{BC}+R_{CA}\). แขน Y ที่ต่อกับจุดใด เท่ากับผลคูณของตัวต้านทานเดลตาสองตัวที่ติดจุดนั้น หารด้วยผลรวมทั้งสาม</div><div class="rg-en">Let \(S=R_{AB}+R_{BC}+R_{CA}\). Each Y arm equals the product of the two delta resistors touching that terminal divided by the total delta sum.</div><div class="rg-equation">\[R_A=\frac{R_{AB}R_{CA}}{S}\]</div><div class="rg-equation">\[R_B=\frac{R_{AB}R_{BC}}{S}\]</div><div class="rg-equation">\[R_C=\frac{R_{BC}R_{CA}}{S}\]</div></div></div>
<div class="rg-callout"><b>ใช้เมื่อไร?</b> ใช้เมื่อหา node แล้วก็ยังไม่มีคู่อนุกรม/ขนานตรง ๆ และวงจรมีส่วนสามเหลี่ยมที่เหมาะกับการแปลง. อย่าใช้ \(\Delta\to Y\) ถ้ายุบแบบธรรมดาได้ง่ายกว่า.</div>`);

 const page11=rgPageV2(11,11,'สรุปเลือกเครื่องมือแก้วงจร / Resistor-network strategy map','ปิดบทด้วยลำดับคิดเดียวที่ใช้ได้ตั้งแต่วงจรง่ายจนถึงวงจรพิเศษ / One decision sequence from basic to advanced networks.',String.raw`
<div class="rg-card soft"><div class="rg-card-title">Decision map — เริ่มจาก topology ก่อนสูตร</div><div class="rg-decision"><div class="rg-decision-row"><b>1. หา node</b><div class="arr">→</div><span>ลากตามลวดที่ไม่มีอุปกรณ์คั่น จุดทั้งหมดคือ node เดียวกัน</span></div><div class="rg-decision-row"><b>2. ตรวจ short / open</b><div class="arr">→</div><span>Short: รวม node • Open: ตัดทางกระแสของแขนงนั้น</span></div><div class="rg-decision-row"><b>3. Series / Parallel?</b><div class="arr">→</div><span>ยุบทีละก้อน แล้วกลับมาดู topology ใหม่ทุกครั้ง</span></div><div class="rg-decision-row"><b>4. รูปหลอกตา?</b><div class="arr">→</div><span>วาดใหม่โดยรักษาคู่ node ของอุปกรณ์ทุกตัว</span></div><div class="rg-decision-row"><b>5. Bridge สมดุล?</b><div class="arr">→</div><span>ใช้ equal potential แล้วตัดแขนกลาง</span></div><div class="rg-decision-row"><b>6. ยังยุบไม่ได้?</b><div class="arr">→</div><span>ใช้ Kirchhoff หรือ \(\Delta\rightarrow Y\) ตามความเหมาะสม</span></div></div></div>
<div class="rg-summary-grid"><div class="rg-summary-cell"><b>Series</b><div>\(I\) เท่า • \(V\) แบ่ง • \(R_{eq}=\sum R\)<br>\(V_k=V_T R_k/\sum R\)</div></div><div class="rg-summary-cell"><b>Parallel</b><div>\(V\) เท่า • \(I\) แบ่ง • \(G_{eq}=\sum G\)<br>\(I_k=I_T G_k/\sum G\)</div></div><div class="rg-summary-cell"><b>Short circuit</b><div>\(R\to0\) • รวม node • อุปกรณ์ที่ถูกลัดมี \(\Delta V\approx0\)</div></div><div class="rg-summary-cell"><b>Open circuit</b><div>\(R\to\infty\) • กระแสแขนง \(I\to0\) • แรงดันคร่อมจุดขาดอาจไม่เป็นศูนย์</div></div></div>
<div class="rg-memory"><div class="big" style="font-size:16px">NODE → SHORT/OPEN → REDUCE → REDRAW → BRIDGE → Δ-Y</div><div class="small">ถ้าลำดับนี้ชัด การลดรูปจะไม่ใช่การเดาจากหน้าตาของรูป</div></div>`);
 return [...firstFive,page6,page7,page8,page9,page10,page11];
};

const lessonPagesForGroupExtendedV2=group=>group.key==='resistor-networks'?resistorNetworkLessonPagesV2(group):lessonPagesForGroupExtended(group);
