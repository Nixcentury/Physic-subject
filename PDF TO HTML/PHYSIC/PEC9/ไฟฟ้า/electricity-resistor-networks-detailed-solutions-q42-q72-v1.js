/* Detailed bilingual solutions for PEC9 Electricity Q42-Q72.
   Inject after D is defined and before topics=[...]. */
const rnStep=(label,th,en,eq='')=>`<div class="solution-step"><div class="solution-label">${label}</div><div class="solution-th">${th}</div><div class="solution-en">${en}</div>${eq?`<div class="solution-equation">${eq}</div>`:''}</div>`;
const rnSol=(steps,final)=>steps.join('')+`<div class="solution-final">${final}</div>`;
Object.assign(D,{
42:rnSol([
  rnStep('อ่านเป็นตัวแบ่งแรงดัน / Read as a voltage divider','ตัวต้านทานอยู่ในแขนอนุกรมเดียวกัน จึงมีกระแสเท่ากัน และแรงดันแบ่งตามสัดส่วนความต้านทาน','The resistors are in one series path, so the same current flows through them and the voltage divides in proportion to resistance.',`\\[\\frac{V_{AB}}{V_{\\rm total}}=\\frac{R_{AB}}{R_1+R_{AB}}\\]`),
  rnStep('จัดรูปหา \\(R_1\\) / Rearrange for \\(R_1\\)','แทนค่าความต่างศักย์รวม ความต่างศักย์ระหว่าง A-B และตัวต้านทานที่กำหนดจากรูป แล้วแก้สมการ','Substitute the total voltage, the required A-B voltage, and the known resistor from the diagram, then solve.',`\\[R_1=R_{AB}\\left(\\frac{V_{\\rm total}}{V_{AB}}-1\\right)=15\\,\\Omega\\]`)
],`ตอบ \\(R_1=15\\,\\Omega\\)<br>Final answer: \\(15\\,\\Omega\\)`),
43:rnSol([
  rnStep('ก. ความต้านทานรวม / A. Equivalent resistance','ตัวต้านทาน \\(3\\,\\Omega\\) และ \\(6\\,\\Omega\\) ต่อขนาน','The \\(3\\,\\Omega\\) and \\(6\\,\\Omega\\) resistors are in parallel.',`\\[\\frac1{R_{\\rm eq}}=\\frac13+\\frac16=\\frac12\\Rightarrow R_{\\rm eq}=2\\,\\Omega\\]`),
  rnStep('ข.-ค. แรงดันในวงจรขนาน / B-C. Parallel voltage','วงจรขนานมีความต่างศักย์คร่อมทุกแขนงเท่ากับความต่างศักย์รวม','Every branch in a parallel circuit has the same potential difference as the supply.',`\\[V_{\\rm total}=V_1=V_2=36\\,\\mathrm V\\]`),
  rnStep('ง. กระแสแต่ละแขนง / D. Branch currents','ใช้กฎของโอห์มกับแต่ละแขนง และตรวจด้วยกฎกระแสที่จุดแยก','Apply Ohm’s law to each branch and check with current conservation.',`\\[I_1=\\frac{36}{3}=12\\,\\mathrm A,\\qquad I_2=\\frac{36}{6}=6\\,\\mathrm A\\]\\[I_{\\rm total}=12+6=18\\,\\mathrm A\\]`)
],`ตอบ \\(R_{\\rm eq}=2\\,\\Omega\\), \\(V_{\\rm total}=V_1=V_2=36\\,\\mathrm V\\), \\(I_1=12\\,\\mathrm A\\), \\(I_2=6\\,\\mathrm A\\)`),
44:rnSol([
  rnStep('ลดวงจรขนาน / Reduce the parallel network','หาความต้านทานสมมูลจากแขนงที่ต่อคร่อมโหนดเดียวกันในรูป','Combine the branches that connect across the same two nodes in the diagram.',`\\[\\frac1{R_{\\rm eq}}=\\sum_k\\frac1{R_k}\\Rightarrow R_{\\rm eq}=4\\,\\Omega\\]`),
  rnStep('หาความต่างศักย์รวม / Find total potential difference','เมื่อได้ความต้านทานรวมแล้ว ใช้กระแสรวมที่ระบุในรูปกับกฎของโอห์ม','After finding the equivalent resistance, use the total current shown in the diagram and Ohm’s law.',`\\[V_{\\rm total}=I_{\\rm total}R_{\\rm eq}=12\\,\\mathrm V\\]`)
],`ตอบ \\(R_{\\rm eq}=4\\,\\Omega\\), \\(V_{\\rm total}=12\\,\\mathrm V\\)`),
45:rnSol([
  rnStep('หาความต้านทานรวม / Equivalent resistance','ตัวต้านทาน \\(3\\,\\Omega\\) และ \\(4\\,\\Omega\\) ต่อขนาน','The \\(3\\,\\Omega\\) and \\(4\\,\\Omega\\) resistors are in parallel.',`\\[R_{\\rm eq}=\\frac{(3)(4)}{3+4}=\\frac{12}{7}\\,\\Omega\\]`),
  rnStep('หาแรงดันคร่อมวงจรขนาน / Find the common voltage','กระแสรวมเท่ากับ \\(3.5\\,\\mathrm A\\)','The total current is \\(3.5\\,\\mathrm A\\).',`\\[V=I_{\\rm total}R_{\\rm eq}=3.5\\left(\\frac{12}{7}\\right)=6\\,\\mathrm V\\]`),
  rnStep('หากระแสแต่ละแขนง / Branch currents','ใช้ \\(I=V/R\\) ซึ่งแรงดันทั้งสองแขนงเท่ากัน','Use \\(I=V/R\\); both branches have the same voltage.',`\\[I_{3\\Omega}=\\frac63=2\\,\\mathrm A,\\qquad I_{4\\Omega}=\\frac64=1.5\\,\\mathrm A\\]`)
],`ตอบ ผ่าน \\(3\\,\\Omega=2\\,\\mathrm A\\), ผ่าน \\(4\\,\\Omega=1.5\\,\\mathrm A\\)`),
46:rnSol([
  rnStep('แรงดันคร่อมแขนงเท่ากัน / Same branch voltage','เมื่อกระแสผ่าน \\(3\\,\\Omega\\) เป็น \\(10\\,\\mathrm A\\) หาแรงดันร่วมก่อน','Use the \\(3\\,\\Omega\\) branch to find the common parallel voltage.',`\\[V=(10)(3)=30\\,\\mathrm V\\]`),
  rnStep('กระแสผ่าน \\(6\\,\\Omega\\) / Current through \\(6\\,\\Omega\\)','แขนง \\(6\\,\\Omega\\) มีแรงดันเท่ากัน \\(30\\,\\mathrm V\\)','The \\(6\\,\\Omega\\) branch also has \\(30\\,\\mathrm V\\) across it.',`\\[I=\\frac{30}{6}=5\\,\\mathrm A\\]`)
],`ตอบ \\(5\\,\\mathrm A\\) / Final answer: \\(5\\,\\mathrm A\\)`),
47:rnSol([
  rnStep('หาแรงดันร่วม / Find the common voltage','ใช้แขนง \\(4\\,\\Omega\\) ที่มีกระแส \\(15\\,\\mathrm A\\)','Use the \\(4\\,\\Omega\\) branch carrying \\(15\\,\\mathrm A\\).',`\\[V=(15)(4)=60\\,\\mathrm V\\]`),
  rnStep('หากระแสแขนงอื่น / Other branch current','จากค่าความต้านทานในรูป แขนงอีกด้านมีกระแส \\(5\\,\\mathrm A\\)','Using the other branch resistance shown in the diagram gives \\(5\\,\\mathrm A\\).',`\\[I_{\\rm other}=5\\,\\mathrm A\\]`),
  rnStep('รวมกระแสที่จุดแยก / Apply junction rule','กระแสรวมเท่ากับผลรวมกระแสทุกแขนง','The total current equals the sum of the branch currents.',`\\[I_{\\rm total}=15+5=20\\,\\mathrm A\\]`)
],`ตอบ \\(20\\,\\mathrm A\\) / Final answer: \\(20\\,\\mathrm A\\)`),
48:rnSol([
  rnStep('หาแรงดันจากแขนง \\(3\\,\\Omega\\) / Find the common voltage','ทราบ \\(I=4\\,\\mathrm A\\) ผ่าน \\(3\\,\\Omega\\)','The \\(3\\,\\Omega\\) branch carries \\(4\\,\\mathrm A\\).',`\\[V=IR=(4)(3)=12\\,\\mathrm V\\]`),
  rnStep('หากระแสทุกแขนง / Find all branch currents','วงจรขนานทุกแขนงมีแรงดัน \\(12\\,\\mathrm V\\)','Every parallel branch has \\(12\\,\\mathrm V\\) across it.',`\\[I_{2\\Omega}=6\\,\\mathrm A,\\quad I_{3\\Omega}=4\\,\\mathrm A,\\quad I_{4\\Omega}=3\\,\\mathrm A\\]`),
  rnStep('รวมกระแส / Add currents','ใช้การอนุรักษ์ประจุที่จุดแยก','Use current conservation at the junction.',`\\[I_{\\rm total}=6+4+3=13\\,\\mathrm A\\]`)
],`ตอบ \\(13\\,\\mathrm A\\) / Final answer: \\(13\\,\\mathrm A\\)`),
49:rnSol([
  rnStep('อ่านโหนดก่อน / Identify the nodes first','เส้นลวดที่ต่อถึงกันโดยไม่มีอุปกรณ์คั่นถือเป็นโหนดเดียวกัน จึงวาดวงจรใหม่ให้เห็นอนุกรมและขนานชัดเจน','Wire-connected points with no component between them are the same node. Redraw the circuit before reducing it.'),
  rnStep('ยุบวงจรทีละชั้น / Reduce step by step','เริ่มจากกลุ่มที่ต่อขนานหรืออนุกรมอย่างชัดเจนที่สุด แล้วแทนด้วยตัวต้านทานสมมูล ทำซ้ำจนเหลือ A-B เพียงตัวเดียว','Start with the clearest series/parallel group, replace it by its equivalent, and repeat until one A-B resistance remains.',`\\[R_{\\rm eq}=6\\,\\Omega\\]`)
],`ตอบ \\(6\\,\\Omega\\) / Final answer: \\(6\\,\\Omega\\)`),
50:rnSol([
  rnStep('วาดวงจรใหม่ตามโหนด / Redraw by nodes','อย่าตัดสินจากตำแหน่งบนกระดาษ ให้ดูว่าปลายของตัวต้านทานแต่ละตัวต่อกับโหนด X และ Y ใด','Do not judge by the drawing position; determine which nodes each resistor actually connects to.'),
  rnStep('รวมอนุกรม-ขนาน / Combine series and parallel groups','ลดกลุ่มย่อยจากด้านในออกมาทีละกลุ่ม แล้วรวมความต้านทานที่เหลือ','Reduce inner groups one at a time, then combine the remaining resistances.',`\\[R_{XY}=8\\,\\Omega\\]`)
],`ตอบ \\(8\\,\\Omega\\) / Final answer: \\(8\\,\\Omega\\)`),
51:rnSol([
  rnStep('ค่ามากที่สุด / Maximum','ต้องให้กระแสผ่านตัวต้านทานทั้ง 20 ตัวต่อเนื่องกัน จึงต่ออนุกรมทั้งหมด','To maximize resistance, connect all 20 resistors in series.',`\\[R_{\\max}=20(1)=20\\,\\Omega\\]`),
  rnStep('ค่าน้อยที่สุด / Minimum','ต้องสร้างทางเดินขนานมากที่สุด จึงต่อทั้ง 20 ตัวขนานกัน','To minimize resistance, connect all 20 identical resistors in parallel.',`\\[R_{\\min}=\\frac{1\\,\\Omega}{20}=0.05\\,\\Omega\\]`)
],`ตอบ มากที่สุด \\(20\\,\\Omega\\); น้อยที่สุด \\(0.05\\,\\Omega\\)`),
52:rnSol([
  rnStep('เริ่มจากตัวที่รู้ V และ R / Start from the known V and R','คร่อมตัวต้านทาน \\(4\\,\\Omega\\) มี \\(8\\,\\mathrm V\\)','The \\(4\\,\\Omega\\) resistor has \\(8\\,\\mathrm V\\) across it.',`\\[I_{4\\Omega}=\\frac84=2.0\\,\\mathrm A\\]`),
  rnStep('ไล่กระแสผ่านจุดแยก / Work through the junctions','ใช้แรงดันเท่ากันในแขนขนานและใช้ \\(I_{\\rm in}=I_{\\rm out}\\) ที่ทุกจุดแยกตามรูป','Use equal voltage across parallel branches and current conservation at each junction in the diagram.',`\\[I_{10\\Omega}=1.2\\,\\mathrm A,\\qquad I_{7\\Omega}=I_{8\\Omega}=0.8\\,\\mathrm A\\]`),
  rnStep('เหตุผลที่ 7Ω และ 8Ω กระแสเท่ากัน / Why 7Ω and 8Ω carry the same current','สองตัวนี้อยู่ในเส้นทางอนุกรมเดียวกันหลังจากจัดรูปโหนด จึงไม่มีกระแสแยกระหว่างกลาง','They lie on the same series path after identifying the nodes, so no current splits between them.')
],`ตอบ \\(I_{7\\Omega}=I_{8\\Omega}=0.8\\,\\mathrm A\\), \\(I_{10\\Omega}=1.2\\,\\mathrm A\\), \\(I_{4\\Omega}=2.0\\,\\mathrm A\\)`),
53:rnSol([
  rnStep('ยุบวงจรส่วนที่ไม่ใช่ 1Ω ก่อน / Reduce the surrounding network first','หาความต้านทานสมมูลของกลุ่มอนุกรม-ขนานที่อยู่รอบตัวต้านทาน \\(1.0\\,\\Omega\\) เพื่อให้เห็นแรงดันหรือกระแสของแขนงนี้','Reduce the series/parallel network surrounding the \\(1.0\\,\\Omega\\) resistor so the branch voltage or current becomes accessible.'),
  rnStep('ย้อนกลับหากระแสแขนง / Back-substitute to the branch','เมื่อทราบแรงดันคร่อมแขนงของ \\(1.0\\,\\Omega\\) แล้ว ใช้กฎของโอห์ม','After finding the voltage across the \\(1.0\\,\\Omega\\) branch, apply Ohm’s law.',`\\[I_{1\\Omega}=\\frac{V_{1\\Omega}}{1.0\\,\\Omega}=0.25\\,\\mathrm A\\]`)
],`ตอบ ข้อ ข: \\(0.25\\,\\mathrm A\\) / Final answer: Choice B, \\(0.25\\,\\mathrm A\\)`),
54:rnSol([
  rnStep('ใช้กฎกระแสที่จุดแยก / Apply the junction rule','เริ่มจากกระแสที่กำหนดในรูป แล้วไล่ตามจุดแยกทีละจุด กระแสที่ไหลเข้าเท่ากับกระแสที่ไหลออก','Start from the given current and move junction by junction; current entering each junction equals current leaving it.'),
  rnStep('ใช้สมบัติแขนงที่เท่ากัน / Use equal branch conditions','จากการต่อในรูป แขนงของ \\(R_2,R_3,R_4\\) ได้เงื่อนไขเดียวกัน จึงมีกระแสเท่ากัน','The connections of \\(R_2,R_3,R_4\\) impose the same branch condition, so they carry equal currents.',`\\[I_{R_2}=I_{R_3}=I_{R_4}=4\\,\\mathrm A\\]`)
],`ตอบ \\(I_{R_2}=I_{R_3}=I_{R_4}=4\\,\\mathrm A\\)`),
55:rnSol([
  rnStep('แยกส่วนของวงจร / Separate the relevant sections','พิจารณาแรงดันตกคร่อมแต่ละส่วนจากกระแสและความต้านทานที่กำหนดในรูป','Use the currents and resistances shown in the diagram to evaluate each required voltage drop.'),
  rnStep('ใช้กฎของโอห์ม / Apply Ohm’s law','คำนวณทีละตำแหน่งด้วย \\(V=IR\\) โดยระวังว่าอุปกรณ์ที่คร่อมโหนดเดียวกันมีแรงดันเท่ากัน','Calculate each location using \\(V=IR\\), remembering that components across the same two nodes share the same voltage.',`\\[V_1=9\\,\\mathrm V,\\qquad V_2=24\\,\\mathrm V\\]`)
],`ตอบ \\(V_1=9\\,\\mathrm V\\), \\(V_2=24\\,\\mathrm V\\)`),
56:rnSol([
  rnStep('ก. ไม่มีโหลด / A. No load','ตัวแบ่งศักย์เป็น \\(1\\,\\mathrm{k\\Omega}\\) อนุกรมกับ \\(2\\,\\mathrm{k\\Omega}\\) ต่อกับแหล่งจ่าย \\(9\\,\\mathrm V\\)','The unloaded divider is \\(1\\,\\mathrm{k\\Omega}\\) in series with \\(2\\,\\mathrm{k\\Omega}\\) across \\(9\\,\\mathrm V\\).',`\\[V_{ab}=9\\frac{2}{1+2}=6\\,\\mathrm V\\]`),
  rnStep('ข. โหลด 2 kΩ / B. 2 kΩ load','โหลด \\(2\\,\\mathrm{k\\Omega}\\) ขนานกับตัวต้านทานล่าง \\(2\\,\\mathrm{k\\Omega}\\) จึงได้ \\(R_{\\rm lower}=1\\,\\mathrm{k\\Omega}\\)','The \\(2\\,\\mathrm{k\\Omega}\\) load is parallel with the lower \\(2\\,\\mathrm{k\\Omega}\\) resistor, giving \\(1\\,\\mathrm{k\\Omega}\\).',`\\[V_{ab}=9\\frac{1}{1+1}=4.5\\,\\mathrm V\\]`),
  rnStep('ค. โหลด 1 MΩ / C. 1 MΩ load','เพราะ \\(1\\,\\mathrm{M\\Omega}\\gg2\\,\\mathrm{k\\Omega}\\) ผลขนานแทบไม่เปลี่ยนจาก \\(2\\,\\mathrm{k\\Omega}\\)','Because \\(1\\,\\mathrm{M\\Omega}\\gg2\\,\\mathrm{k\\Omega}\\), the parallel equivalent remains almost \\(2\\,\\mathrm{k\\Omega}\\).',`\\[2\\,\\mathrm{k\\Omega}\\parallel1\\,\\mathrm{M\\Omega}\\approx1.996\\,\\mathrm{k\\Omega}\\Rightarrow V_{ab}\\approx6.0\\,\\mathrm V\\]`)
],`ตอบ ก. \\(6\\,\\mathrm V\\) ข. \\(4.5\\,\\mathrm V\\) ค. ประมาณ \\(6\\,\\mathrm V\\)`),
57:rnSol([
  rnStep('อ่านโหนด / Identify nodes','ทำเครื่องหมาย A, B และโหนดภายในก่อน แล้วจัดกลุ่มตัวต้านทานที่คร่อมโหนดคู่เดียวกันเป็นขนาน','Mark A, B, and the internal nodes first; resistors connected across the same node pair are parallel.'),
  rnStep('ลดรูปทีละชั้น / Reduce in stages','ยุบกลุ่มขนานก่อน จากนั้นบวกส่วนที่เป็นอนุกรม และทำซ้ำจนเหลือความต้านทานเดียวระหว่าง A-B','Reduce parallel groups first, add series sections next, and repeat until only one A-B resistance remains.',`\\[R_{AB}=1.5\\,\\Omega\\]`)
],`ตอบ \\(1.5\\,\\Omega\\) / Final answer: \\(1.5\\,\\Omega\\)`),
58:rnSol([
  rnStep('จัดรูปวงจรตามการเชื่อมต่อ / Redraw by connectivity','เส้นลวดที่ไม่มีตัวต้านทานคั่นทำให้จุดนั้นเป็นโหนดเดียวกัน การวาดใหม่ช่วยมองเห็นกลุ่มขนานที่ซ่อนอยู่','Uninterrupted wires define the same node. Redrawing exposes hidden parallel groups.'),
  rnStep('ใช้สูตรอนุกรมและขนาน / Apply series-parallel rules','ลดวงจรจากส่วนในออกมาจนเหลือ A-B เพียงตัวเดียว','Reduce the network from the inside outward until one A-B resistor remains.',`\\[R_{AB}=3.75\\,\\Omega\\]`)
],`ตอบ \\(3.75\\,\\Omega\\) / Final answer: \\(3.75\\,\\Omega\\)`),
59:rnSol([
  rnStep('หาแขนงที่เป็นอนุกรมจริง / Find true series branches','ตัวต้านทานจะเป็นอนุกรมกันเมื่อจุดต่อระหว่างกันไม่มีแขนงอื่นแยกออก','Resistors are truly in series only when their common junction has no other branch.'),
  rnStep('รวมกับแขนงขนาน / Combine with parallel branches','หลังรวมอนุกรมแล้ว จึงหาค่าขนานระหว่างแขนงที่คร่อม A-B เดียวกัน','After combining series elements, take the parallel equivalent of branches spanning the same A-B nodes.',`\\[R_{AB}=3\\,\\Omega\\]`)
],`ตอบ \\(3\\,\\Omega\\) / Final answer: \\(3\\,\\Omega\\)`),
60:rnSol([
  rnStep('มองวงจรจาก A ไป B / Trace paths from A to B','แยกเส้นทางกระแสอิสระแต่ละเส้นและหาความต้านทานรวมของแต่ละเส้นก่อน','Identify each independent A-B current path and find the resistance of each path.'),
  rnStep('นำเส้นทางมาขนานกัน / Put the paths in parallel','เมื่อแต่ละเส้นทางเริ่มและจบที่ A-B เดียวกัน จึงใช้สูตรขนาน','Because the paths share the same endpoints A and B, combine them in parallel.',`\\[R_{AB}=1.5\\,\\Omega\\]`)
],`ตอบ \\(1.5\\,\\Omega\\) / Final answer: \\(1.5\\,\\Omega\\)`),
61:rnSol([
  rnStep('ตรวจสายลัดและโหนดร่วม / Check wires and common nodes','ส่วนที่ถูกคร่อมด้วยลวดความต้านทานเป็นศูนย์จะไม่มีผลต่อความต้านทานสมมูล ให้จัดโหนดใหม่ก่อน','Any section bypassed by an ideal wire does not affect the equivalent resistance; identify the nodes first.'),
  rnStep('ลดวงจรที่เหลือ / Reduce the remaining network','รวมอนุกรมและขนานตามโหนดที่ได้หลังจัดรูป','Combine the remaining series and parallel sections according to the redrawn nodes.',`\\[R_{AB}=6\\,\\Omega\\]`)
],`ตอบ \\(6\\,\\Omega\\) / Final answer: \\(6\\,\\Omega\\)`),
62:rnSol([
  rnStep('เริ่มจากกลุ่มสมมาตร / Start with the symmetric group','วงจรมีส่วนที่ซ้ำกัน จึงลดรูปส่วนที่มีโครงสร้างเหมือนกันก่อน จะทำให้จำนวนแขนงลดลงมาก','The circuit contains repeated structure; reduce identical sections first to simplify the network.'),
  rnStep('รวมค่าที่เหลือ / Combine the reduced sections','ใช้สูตรอนุกรมและขนานจนเหลือความต้านทานระหว่าง A-B เพียงค่าเดียว','Apply series and parallel rules until only one A-B resistance remains.',`\\[R_{AB}=1\\,\\Omega\\]`)
],`ตอบ \\(1\\,\\Omega\\) / Final answer: \\(1\\,\\Omega\\)`),
63:rnSol([
  rnStep('ใช้สมมาตร / Use symmetry','ตัวต้านทานทุกตัวมีค่า \\(2\\,\\Omega\\) จึงตรวจจุดที่มีศักย์เท่ากันจากสมมาตรของวงจร แล้วรวมหรือแยกโหนดได้โดยไม่เปลี่ยนกระแสภายนอก','All resistors are \\(2\\,\\Omega\\), so symmetry identifies equal-potential nodes that can be used to simplify the network.'),
  rnStep('ลดรูปหลังใช้สมมาตร / Reduce after symmetry','เมื่อจัดรูปใหม่แล้ว กลุ่มที่เหลือเป็นอนุกรม-ขนานธรรมดา','After the symmetry reduction, the remaining groups are ordinary series/parallel combinations.',`\\[R_{AB}=3\\,\\Omega\\]`)
],`ตอบ \\(3\\,\\Omega\\) / Final answer: \\(3\\,\\Omega\\)`),
64:rnSol([
  rnStep('เขียนทุกค่าด้วย \\(R\\) / Keep the calculation symbolic','วงจรนี้ต้องการคำตอบเป็นเท่าของ \\(R\\) จึงไม่ควรแทนตัวเลข ให้รวมอนุกรมและขนานโดยคง \\(R\\) ไว้','The answer is required as a multiple of \\(R\\), so keep the reduction symbolic.'),
  rnStep('ลดวงจรตามโหนด x-y / Reduce between x and y','ยุบกลุ่มที่คร่อมโหนดเดียวกันก่อน แล้วรวมส่วนอนุกรมที่เกิดขึ้น','Combine same-node parallel groups first, then add the series sections that result.',`\\[R_{xy}=2R\\]`)
],`ตอบ \\(2R\\) / Final answer: \\(2R\\)`),
65:rnSol([
  rnStep('ระวังเส้นลวดไขว้ / Check crossings and junctions','พิจารณาว่าจุดไขว้ในรูปมีจุดเชื่อมหรือไม่ แล้วตั้งชื่อโหนด x-y และโหนดภายใน','Determine whether crossings are electrically connected, then label x, y, and internal nodes.'),
  rnStep('วาดใหม่และยุบ / Redraw and reduce','เมื่อวาดตามโหนดจริง จะเห็นชุดอนุกรม-ขนานที่ลดได้ตามลำดับ','A node-based redraw reveals the series/parallel groups that can be reduced successively.',`\\[R_{xy}=10\\,\\Omega\\]`)
],`ตอบ \\(10\\,\\Omega\\) / Final answer: \\(10\\,\\Omega\\)`),
66:rnSol([
  rnStep('ตรวจสะพานสมดุล / Test bridge balance','เปรียบเทียบอัตราส่วนตัวต้านทานสองแขนของสะพานตามค่าที่ให้ในรูป ถ้าอัตราส่วนเท่ากัน จุดกึ่งกลางทั้งสองมีศักย์เท่ากัน','Compare the resistance ratios of the two bridge arms. Equal ratios mean the two midpoints are at the same potential.',`\\[\\frac{R_1}{R_2}=\\frac{R_4}{R_5}\\Rightarrow I_{\\rm bridge}=0\\]`),
  rnStep('ตัดแขนกลางแล้วลดรูป / Remove the zero-current bridge branch','เมื่อไม่มีกระแสผ่านแขนกลาง สามารถละแขนนั้นแล้วรวมแต่ละแขนอนุกรม จากนั้นนำสองแขนมาขนาน','With zero bridge current, omit the middle branch, add each side in series, then place the two sides in parallel.',`\\[R_{AB}=100\\,\\Omega\\]`)
],`ตอบ \\(100\\,\\Omega\\) / Final answer: \\(100\\,\\Omega\\)`),
67:rnSol([
  rnStep('ตรวจอัตราส่วนสะพาน / Check bridge ratios','ใช้เงื่อนไขสะพานสมดุลกับค่าที่ระบุในรูป เพื่อดูว่ากระแสผ่านแขนกลางเป็นศูนย์หรือไม่','Use the bridge-balance condition with the resistor values shown to test the middle branch.'),
  rnStep('ลดเป็นสองแขนขนาน / Reduce to two parallel arms','หลังจัดการแขนกลางแล้ว รวมตัวต้านทานบนแต่ละแขนแบบอนุกรมและนำแขนทั้งสองมาขนาน','After handling the bridge branch, add the resistors on each arm in series and combine the two arms in parallel.',`\\[R_{AB}=2.5\\,\\Omega\\]`)
],`ตอบ \\(2.5\\,\\Omega\\) / Final answer: \\(2.5\\,\\Omega\\)`),
68:rnSol([
  rnStep('วิเคราะห์สะพานก่อน / Analyse the bridge first','อย่ารีบจับคู่ตัวต้านทานจากตำแหน่งบนรูป ให้ตรวจโหนดและอัตราส่วนของแขนสะพาน','Do not combine resistors merely by visual position; inspect nodes and bridge-arm ratios first.'),
  rnStep('ลดรูปตามเงื่อนไขของสะพาน / Reduce using the bridge condition','เมื่อจัดรูปสะพานแล้วจึงใช้อนุกรม-ขนานกับกลุ่มที่เหลือ','After simplifying the bridge condition, apply ordinary series/parallel reduction.',`\\[R_{AB}=\\frac{40}{3}\\,\\Omega\\approx13.33\\,\\Omega\\]`)
],`ตอบ \\(\\dfrac{40}{3}\\,\\Omega\\)`),
69:rnSol([
  rnStep('มองโหนด x-y และสมมาตร / Identify x-y nodes and symmetry','วงจรที่วาดเป็นรูปเรขาคณิตอาจซ่อนจุดศักย์เท่ากัน ใช้สมมาตรช่วยรวมโหนดที่เทียบเท่ากัน','A geometric drawing can hide equal-potential points; use symmetry to identify equivalent nodes.'),
  rnStep('ยุบวงจรหลังจัดโหนด / Reduce after relabelling nodes','เมื่อวาดวงจรใหม่ตามโหนด จะเหลืออนุกรม-ขนานที่คำนวณตรงไปตรงมา','After redrawing by nodes, the remaining network reduces by standard series/parallel rules.',`\\[R_{xy}=200\\,\\Omega\\]`)
],`ตอบ \\(200\\,\\Omega\\) / Final answer: \\(200\\,\\Omega\\)`),
70:rnSol([
  rnStep('โวลต์มิเตอร์อ่านศูนย์หมายถึงอะไร / Meaning of a zero voltmeter reading','กระแสผ่านโวลต์มิเตอร์อุดมคติเป็นศูนย์ และเมื่ออ่าน \\(0\\,\\mathrm V\\) จุดที่ต่อโวลต์มิเตอร์ทั้งสองมีศักย์เท่ากัน จึงเป็นสะพานสมดุล','An ideal voltmeter draws no current; a zero reading means its two terminals are at equal potential, so the bridge is balanced.'),
  rnStep('ใช้เงื่อนไขสะพานสมดุล / Apply the balance condition','ตั้งอัตราส่วนตัวต้านทานสองแขนจากค่าที่กำหนดในรูป แล้วแก้หา \\(R\\)','Set the resistance ratios of the two arms equal using the values in the diagram and solve for \\(R\\).',`\\[\\frac{R_1}{R_2}=\\frac{R_3}{R}\\Rightarrow R=6\\,\\Omega\\]`)
],`ตอบ \\(R=6\\,\\Omega\\) / Final answer: \\(6\\,\\Omega\\)`),
71:rnSol([
  rnStep('วงจรไม่ลดด้วยอนุกรม-ขนานตรง ๆ / Not directly series-parallel','ส่วนสามเหลี่ยมในรูปเป็นเดลตา จึงแปลง \\(\\Delta\\to Y\\) ก่อน','The triangular part is a delta network, so first convert \\(\\Delta\\to Y\\).'),
  rnStep('สูตรแปลงเดลตาเป็นวาย / Delta-to-wye formulas','ตัวต้านทานวายที่ต่อกับแต่ละจุด เท่ากับผลคูณของตัวต้านทานเดลตาสองตัวที่ติดจุดนั้น หารด้วยผลรวมเดลตาทั้งสาม','Each wye resistor equals the product of the two adjacent delta resistors divided by the sum of all three delta resistors.',`\\[R_A=\\frac{R_{AB}R_{AC}}{R_{AB}+R_{BC}+R_{CA}},\\quad R_B=\\frac{R_{AB}R_{BC}}{\\Sigma R_\\Delta},\\quad R_C=\\frac{R_{AC}R_{BC}}{\\Sigma R_\\Delta}\\]`),
  rnStep('ลดวงจรหลังแปลง / Reduce after conversion','แทนค่าจากรูปแล้ว วงจรที่เหลือเป็นอนุกรมและขนานธรรมดา','Substituting the diagram values converts the remaining network to ordinary series/parallel groups.',`\\[R_{AB}=2.6\\,\\Omega\\]`)
],`ตอบ \\(2.6\\,\\Omega\\) / Final answer: \\(2.6\\,\\Omega\\)`),
72:rnSol([
  rnStep('ใช้สมมาตรของตัวต้านทานเท่ากัน / Use symmetry of equal resistors','ตัวต้านทานทุกตัวเป็น \\(30\\,\\Omega\\) จึงหาคู่โหนดที่มีศักย์เท่ากันจากสมมาตรของวงจรได้','All resistors are \\(30\\,\\Omega\\), so symmetry reveals pairs of equal-potential nodes.'),
  rnStep('รวมโหนดศักย์เท่ากัน / Merge equal-potential nodes','เมื่อรวมโหนดที่ศักย์เท่ากันแล้ว ตัวต้านทานบางตัวกลายเป็นขนานหรืออนุกรมอย่างชัดเจน จึงยุบทีละชั้น','After merging equal-potential nodes, several resistors become clear series or parallel groups and can be reduced step by step.'),
  rnStep('ตรวจค่าความต้านทานสุดท้าย / Final equivalent','ผลจากการลดรูปทั้งวงจรระหว่าง A-B','The fully reduced A-B network is',`\\[R_{AB}=100\\,\\Omega\\]`)
],`ตอบ \\(100\\,\\Omega\\) / Final answer: \\(100\\,\\Omega\\)`)
});