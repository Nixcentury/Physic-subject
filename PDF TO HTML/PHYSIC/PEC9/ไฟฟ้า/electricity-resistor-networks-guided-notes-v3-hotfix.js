/* Hotfix v3: restore resistor guided notes content while keeping the new open-circuit
   and divider-derivation pages. v2 defined the new helpers correctly, but its page
   builder treated the legacy lesson HTML string as an array and crashed at runtime. */

const rnExtractLegacyPages=(html)=>html.match(/<section class="sheet lesson-sheet lesson-guided resistor-guided-v1"[\s\S]*?<\/section>/g)||[];
const rnRenumberLegacy=(html,from,to,total=11)=>html
  .replaceAll(`lesson-resistor-networks-${from}`,`lesson-resistor-networks-${to}`)
  .replaceAll(`CONCEPT ${from}`,`CONCEPT ${to}`)
  .replaceAll(`Guided Notes ${from}/9`,`Guided Notes ${to}/${total}`)
  .replaceAll(`Resistor Networks • ${from}/9`,`Resistor Networks • ${to}/${total}`)
  .replaceAll('/9',`/${total}`);

const resistorNetworkLessonPagesV3=group=>{
  const legacyHtml=resistorNetworkLessonPages(group);
  const legacy=rnExtractLegacyPages(legacyHtml);
  if(legacy.length<9) return legacyHtml;

  const firstFive=legacy.slice(0,5).map(p=>p.replaceAll('/9','/11'));

  const page6=rgPageV2(6,11,
    'วงจรลัดและวงจรเปิด / Short circuit and open circuit',
    'เปรียบเทียบสองกรณีสุดขั้ว: ทางเดินที่ความต้านทานเกือบศูนย์ กับทางเดินที่ขาดจนกระแสไหลไม่ได้ / Compare the two limiting cases: an almost-zero-resistance path and a broken path.',
    String.raw`
<div class="rg-grid-2">
 <div class="rg-state-card">
  <div class="state-name">Short circuit / วงจรลัด</div>
  <div class="rg-visual">${shortSvg}</div>
  <div class="rg-th">ลวดอุดมคติมี \(R\approx0\) จุดที่เชื่อมด้วยลวดจึงเป็นโหนดศักย์เดียวกัน ถ้าลวดคร่อมตัวต้านทานทั้งสองปลาย ตัวต้านทานนั้นถูก bypass.</div>
  <div class="rg-en">An ideal wire has nearly zero resistance. A resistor bridged by that wire is bypassed because its terminals are at the same potential.</div>
  <div class="state-eq">\[\Delta V_R\approx0\Rightarrow I_R=\frac{\Delta V_R}{R}\approx0\]</div>
  <div class="rg-trap">สำหรับการลดรูป: <b>short circuit รวมโหนด</b> / a short circuit merges nodes.</div>
 </div>
 <div class="rg-state-card">
  <div class="state-name">Open circuit / วงจรเปิด (วงจรขาด)</div>
  <div class="rg-visual">${openCircuitSvg}</div>
  <div class="rg-th">เมื่อทางเดินขาด กระแสไม่สามารถไหลข้ามช่องว่างได้ ในแบบจำลองอุดมคติถือว่าความต้านทานของจุดขาดเข้าใกล้อนันต์</div>
  <div class="rg-en">A broken path cannot carry current. Ideally, the resistance of the break tends to infinity.</div>
  <div class="state-eq">\[R_{\rm open}\to\infty\Rightarrow I=\frac{V}{R_{\rm open}}\to0\]</div>
  <div class="rg-trap">กระแสผ่านทางขาดเป็นศูนย์ แต่ <b>แรงดันคร่อมจุดขาดอาจไม่เป็นศูนย์</b>.</div>
 </div>
</div>
<div class="rg-memory"><div class="big" style="font-size:17px">SHORT: \(R\to0\) &nbsp; • &nbsp; OPEN: \(R\to\infty\)</div><div class="small">Short merges nodes; open breaks a current path.</div></div>`);

  const page7=rgPageV2(7,11,
    'พิสูจน์กฎการแบ่งแรงดันและกระแส / Deriving voltage and current division',
    'แยกพิสูจน์สองกรณี: อนุกรมแบ่งแรงดันด้วย R ส่วนขนานแบ่งกระแสด้วย G / Derive the rules separately: series voltage division uses R; parallel current division uses G.',
    String.raw`
<div class="rg-proof-grid">
 <div class="rg-proof-card">
  <div class="proof-head">A. Voltage divider — อนุกรม</div>
  <div class="rg-th">กระแสอนุกรมเท่ากันทุกตัว ให้กระแสเป็น \(I\)</div>
  <div class="rg-proof-line"><b>1.</b> \(V_k=IR_k\)</div>
  <div class="rg-proof-line"><b>2.</b> \(V_T=I(R_1+R_2+\cdots+R_n)=I\sum R\)</div>
  <div class="rg-proof-line"><b>3.</b> \(\dfrac{V_k}{V_T}=\dfrac{IR_k}{I\sum R}\)</div>
  <div class="rg-proof-line"><b>4.</b> ตัด \(I\) ออก / cancel \(I\)</div>
  <div class="rg-proof-final">\[\boxed{V_k=V_T\frac{R_k}{\sum R}}\]</div>
  <div class="rg-note">ตัวที่ \(R\) มากกว่า รับส่วนแบ่งแรงดันมากกว่า เมื่อกระแสเดียวกันไหลผ่าน</div>
 </div>
 <div class="rg-proof-card">
  <div class="proof-head">B. Current divider — ขนาน</div>
  <div class="rg-th">แรงดันขนานเท่ากันทุกแขนง ให้แรงดันร่วมเป็น \(V\) และใช้ \(G=1/R\)</div>
  <div class="rg-proof-line"><b>1.</b> \(I_k=\dfrac{V}{R_k}=VG_k\)</div>
  <div class="rg-proof-line"><b>2.</b> \(I_T=V(G_1+G_2+\cdots+G_n)=V\sum G\)</div>
  <div class="rg-proof-line"><b>3.</b> \(\dfrac{I_k}{I_T}=\dfrac{VG_k}{V\sum G}\)</div>
  <div class="rg-proof-line"><b>4.</b> ตัด \(V\) ออก / cancel \(V\)</div>
  <div class="rg-proof-final">\[\boxed{I_k=I_T\frac{G_k}{\sum G}}\]</div>
  <div class="rg-note">แขนงที่ \(G\) มากกว่า หรือ \(R\) น้อยกว่า จะมีกระแสมากกว่า</div>
 </div>
</div>
<div class="rg-grid-2">
 <div class="rg-card soft"><div class="rg-card-title">Current divider ในรูป R</div><div class="rg-equation">\[\boxed{I_k=I_T\frac{1/R_k}{\sum(1/R)}}\]</div></div>
 <div class="rg-card soft"><div class="rg-card-title">กรณี 2 แขนง / Two branches</div><div class="rg-equation">\[I_1=I_T\frac{R_2}{R_1+R_2},\qquad I_2=I_T\frac{R_1}{R_1+R_2}\]</div><div class="rg-note">รูปไขว้ R มาจากสูตรทั่วไปของ \(G\) ไม่ใช่สูตรใหม่ที่ต้องจำแยก</div></div>
</div>
<div class="rg-memory"><div class="big" style="font-size:17px">Voltage division → \(R\) &nbsp; • &nbsp; Current division → \(G\)</div></div>`);

  const page8=rnRenumberLegacy(legacy[6],7,8,11);
  const page9=rnRenumberLegacy(legacy[7],8,9,11);
  const page10=rnRenumberLegacy(legacy[8],9,10,11);

  const page11=rgPageV2(11,11,
    'สรุปเลือกเครื่องมือแก้วงจร / Resistor-network strategy map',
    'เริ่มจาก topology ก่อนสูตร แล้วเลือกเครื่องมือให้เหมาะกับวงจร / Start with topology before choosing formulas.',
    String.raw`
<div class="rg-card soft"><div class="rg-card-title">Decision map — ลำดับคิดมาตรฐาน</div>
 <div class="rg-decision">
  <div class="rg-decision-row"><b>1. หา node</b><div class="arr">→</div><span>ลวดต่อเนื่องที่ไม่มีอุปกรณ์คั่นคือ node เดียวกัน</span></div>
  <div class="rg-decision-row"><b>2. ตรวจ short / open</b><div class="arr">→</div><span>Short: รวม node • Open: ตัดทางกระแสของแขนงนั้น</span></div>
  <div class="rg-decision-row"><b>3. Series / Parallel?</b><div class="arr">→</div><span>ยุบทีละก้อน แล้วกลับมาดู topology ใหม่</span></div>
  <div class="rg-decision-row"><b>4. รูปหลอกตา?</b><div class="arr">→</div><span>วาดใหม่โดยรักษาคู่ node ของอุปกรณ์ทุกตัว</span></div>
  <div class="rg-decision-row"><b>5. Bridge สมดุล?</b><div class="arr">→</div><span>ใช้ equal potential แล้วตัดแขนกลาง</span></div>
  <div class="rg-decision-row"><b>6. ยังยุบไม่ได้?</b><div class="arr">→</div><span>ใช้ Kirchhoff หรือ \(\Delta\rightarrow Y\) ตามความเหมาะสม</span></div>
 </div>
</div>
<div class="rg-summary-grid">
 <div class="rg-summary-cell"><b>Series</b><div>\(I\) เท่า • \(V\) แบ่ง • \(R_{eq}=\sum R\)<br>\(V_k=V_T R_k/\sum R\)</div></div>
 <div class="rg-summary-cell"><b>Parallel</b><div>\(V\) เท่า • \(I\) แบ่ง • \(G_{eq}=\sum G\)<br>\(I_k=I_T G_k/\sum G\)</div></div>
 <div class="rg-summary-cell"><b>Short circuit</b><div>\(R\to0\) • รวม node • ตัวที่ถูก bypass มี \(\Delta V\approx0\)</div></div>
 <div class="rg-summary-cell"><b>Open circuit</b><div>\(R\to\infty\) • กระแสแขนง \(I\to0\) • แรงดันคร่อมจุดขาดอาจไม่เป็นศูนย์</div></div>
</div>
<div class="rg-memory"><div class="big" style="font-size:16px">NODE → SHORT/OPEN → REDUCE → REDRAW → BRIDGE → Δ-Y</div></div>`);

  return [...firstFive,page6,page7,page8,page9,page10,page11].join('');
};

const lessonPagesForGroupExtendedV3=group=>group.key==='resistor-networks'?resistorNetworkLessonPagesV3(group):lessonPagesForGroupExtended(group);
