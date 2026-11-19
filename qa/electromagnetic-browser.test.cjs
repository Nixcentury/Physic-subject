/* Browser-based pre-merge regression QA for Y10 Electromagnetic Effects.
   Execute: node qa/electromagnetic-browser.test.cjs
   Requires: playwright and installed Chromium, no remote site or credentials.
*/
"use strict";
const assert=require("node:assert/strict");
const {chromium}=require("playwright");
const http=require("node:http");
const fs=require("node:fs/promises");
const path=require("node:path");
const ROOT=path.resolve(__dirname,"..");
const HTML_PATH=path.join(ROOT,"Y10-IGCSE","electromagnetic-effects-standalone.html");
const OUT=path.resolve(ROOT,"qa-artifacts");
const dir=path.dirname(HTML_PATH);
const PAGE="/Y10-IGCSE/electromagnetic-effects-standalone.html";
const CASES=[
 {route:"orientation",answers:[0,1,0,0,0,0],cloze:["dot","cross","current"],cards:4},
 {route:"field",answers:[1,2,3,0,1,0,2,1],cloze:["circles","north","compass"],cards:6},
 {route:"motor-effect",answers:[1,2,0,3,1,2,2,0,3,1,2,0],cloze:["magneticforce","reversed","force"],cards:6},
 {route:"dc-motor",answers:[1,0,2,3,1,2,0,3],cloze:["turning","greater","splitring"],cards:6}
];
const failures=[],checkpoints=[];
async function run(name,fn){
 try{await fn();checkpoints.push("PASS "+name);console.log("PASS "+name)}
 catch(e){failures.push({name,error:String(e?.stack||e)});console.error("FAIL "+name+"\n"+e.stack)}
}
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,"http://localhost");
 if(url.pathname!==PAGE){res.writeHead(404);res.end("not found");return}
 const bytes=await fs.readFile(HTML_PATH);
 res.writeHead(200,{"Content-Type":"text/html; charset=utf-8","Content-Length":bytes.length,"Cache-Control":"no-store"});res.end(bytes)
});
const startServer=()=>new Promise(resolve=>server.listen(0,"127.0.0.1",resolve));
const stopServer=()=>new Promise(resolve=>server.close(resolve));
async function choosePage(page,id){await page.locator("#courseNav [data-lesson="+JSON.stringify(id)+"]").click();await assertVisible(page,"#mainPanel h2")}
async function mode(page,id){await page.locator('#viewNav [data-view="'+id+'"]').click()}
async function press(page,key,val){await page.locator('#mainPanel [data-'+key+'="'+val+'"]').first().click()}
async function assertVisible(page,selector){assert(await page.locator(selector).first().isVisible(),selector+" not visible")}
async function load(page,url){
 await page.goto(url,{waitUntil:"domcontentloaded"});
 await page.locator("#mainPanel h2").waitFor();
}
async function testResponsive(browser,url){
 const deviceSets=[["desktop",1440,900],["ipad",834,1194],["mobile",390,844]];
 for(const [name,width,height] of deviceSets){
  const ctx=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
  const page=await ctx.newPage();await page.route("https://cdn.jsdelivr.net/**",r=>r.abort());
  const errors=[];page.on("pageerror",e=>errors.push(e.message));
  await load(page,url);await choosePage(page,"dc-motor");await mode(page,"explore");
  await page.screenshot({path:path.join(OUT,"r03-"+name+".png"),fullPage:true,animations:"disabled"});
  const dim=await page.evaluate(()=>({doc:document.documentElement.scrollWidth,viewport:window.innerWidth,main:document.querySelector("main").getBoundingClientRect().width,svg:document.querySelector("#mainPanel svg")?.getBoundingClientRect().width}));
  assert(dim.doc<=dim.viewport+2,"horizontal overflow "+name+" "+JSON.stringify(dim));
  assert(dim.main>200&&dim.svg>100,"content hidden or too small "+name+" "+JSON.stringify(dim));
  assert.deepEqual(errors,[],"runtime errors "+name);
  await ctx.close();
 }
}
async function testExplorations(page){
 await choosePage(page,"field");await mode(page,"explore");
 await press(page,"field-scene","wire");await press(page,"direction","out");await press(page,"field-answer","left");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"direction","in");await press(page,"field-answer","right");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"field-scene","solenoid");await press(page,"field-answer","north");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"coil-sense","cw");await press(page,"field-answer","south");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"field-scene","relay");await press(page,"relay-state","on");await press(page,"field-answer","on");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"field-scene","speaker");await press(page,"speaker-phase","in");await press(page,"field-answer","left");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await choosePage(page,"motor-effect");await mode(page,"explore");
 await press(page,"motor-guess","down");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"motor-i","out");await press(page,"motor-guess","up");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"motor-mode","wire");await press(page,"motor-i","up");await press(page,"motor-b","left");
 await press(page,"motor-guess","out");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"motor-i","right");await press(page,"motor-b","right");await press(page,"motor-guess","zero");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"motor-mode","beam");await press(page,"motor-i","right");await press(page,"motor-b","up");
 await press(page,"motor-guess","out");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"motor-charge","negative");await press(page,"motor-guess","in");
 assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await choosePage(page,"dc-motor");await mode(page,"explore");
 assert.match(await page.locator("#mainPanel").innerText(),/SPLIT-RING COMMUTATOR/);
 await press(page,"dc-guess","clockwise");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"dc-step","next");await press(page,"dc-step","next");
 assert.match(await page.locator("#mainPanel").innerText(),/NEUTRAL: TORQUE = 0/);
 await press(page,"dc-guess","zero");assert.match(await page.locator("#mainPanel .feedback").last().innerText(),/Correct/);
 await press(page,"dc-step","next");assert.match(await page.locator("#mainPanel").innerText(),/COIL A CURRENT: IN/);
 await press(page,"dc-battery","reverse");assert.match(await page.locator("#mainPanel").innerText(),/ANTICLOCKWISE/);
 await press(page,"dc-turns","3");await press(page,"dc-current","2");await press(page,"dc-field","2");
 assert.match(await page.locator("#mainPanel").innerText(),/12×/);
 await page.screenshot({path:path.join(OUT,"r03-commutator-explore.png"),fullPage:true,animations:"disabled"});
}
async function finishCheck(page,caseInfo){
 await mode(page,"check");
 const total=caseInfo.answers.length;
 for(let i=0;i<total;i++){
  // Deliberately wrong on first question; retry correct, record attempt history.
  if(i===0){
    await press(page,"answer",(caseInfo.answers[0]+1)%4);await press(page,"action","submit");
    assert.match(await page.locator("#mainPanel .feedback").first().innerText(),/Not correct/);
    await press(page,"action","retry");
  }
  await press(page,"answer",caseInfo.answers[i]);
  await press(page,"action","submit");
  assert.match(await page.locator("#mainPanel .stat").innerText(),new RegExp("Best "+(i+1)+"/"+total+" marks"));
  if(i<total-1)await press(page,"page","1");
 }
 assert(await page.locator('#viewNav [data-view="exit"]').isEnabled(),"exit should unlock");
 await mode(page,"exit");
 for(let i=0;i<caseInfo.cards;i++){
   await press(page,"flash","flip");
   assert.match(await page.locator("#mainPanel").innerText(),new RegExp("Answers revealed "+(i+1)+"/"+caseInfo.cards));
   if(i<caseInfo.cards-1)await press(page,"flash","next");
 }
 await press(page,"flash","finish");
}
async function testAllLessonFlow(page){
 for(const item of CASES){
  await choosePage(page,item.route);
  await mode(page,"recall");
  for(let i=0;i<3;i++){await press(page,"term",item.cloze[i]);await press(page,"blank",i)}
  await press(page,"recall","check");
  assert.match(await page.locator("#mainPanel").innerText(),/Correct 3\/3/);
  await mode(page,"try");
  await press(page,"answer",(item.answers[0]+1)%4);await press(page,"action","practice");
  assert.match(await page.locator("#mainPanel .feedback").first().innerText(),/Not correct/);
  // Try should never affect grade.
  await mode(page,"check");
  assert.match(await page.locator("#mainPanel .stat").innerText(),/Recorded 0\//);
  await finishCheck(page,item);
  await page.reload({waitUntil:"domcontentloaded"});
  await choosePage(page,item.route);
  await mode(page,"check");
  assert.match(await page.locator("#mainPanel .stat").innerText(),new RegExp("Best "+item.answers.length+"/"+item.answers.length+" marks"));
 }
}
async function testTiers(page){
 await choosePage(page,"dc-motor");
 await page.locator("#level").selectOption("core");
 assert.equal(await page.locator("#mainPanel section").count(),5,"R03 Core should have 5 readings");
 await mode(page,"recall");
 assert(!(await page.locator("#mainPanel").innerText()).includes("split-ring"),"Core recall must hide commutator");
 await mode(page,"exit");
 assert(!(await page.locator("#mainPanel").innerText()).includes("split-ring"),"Core Exit must hide commutator");
 // Switch while the Exit deck is open.
 await page.locator("#level").selectOption("all");
 assert(!(await page.locator('#viewNav [data-view="exit"]').isDisabled()),"All exit remains unlocked when all eight answered");
 await mode(page,"recall");
 assert.match(await page.locator("#mainPanel").innerText(),/split-ring commutator/);
 await page.locator("#level").selectOption("core");
 await mode(page,"explore");
 assert(!(await page.locator("#mainPanel").innerText()).includes("SPLIT-RING COMMUTATOR"),"Core Explore hides commutator");
 await page.locator("#level").selectOption("all");
}
async function testPrinting(page){
 await choosePage(page,"dc-motor");
 await page.locator("#level").selectOption("all");
 await page.locator("#printQuestions").click();
 let html=await page.evaluate(()=>window.__printedHTML||"");
 assert.equal((html.match(/class="print-question"/g)||[]).length,8);
 assert(!(html.includes("SIMILAR WORKED EXAMPLE")),"printed question sheets must not include solutions");
 await page.locator("#printNotes").click();
 html=await page.evaluate(()=>window.__printedHTML||"");
 assert.equal((html.match(/class="print-question"/g)||[]).length,8);
 await page.locator("#level").selectOption("core");
 await page.locator("#printQuestions").click();
 html=await page.evaluate(()=>window.__printedHTML||"");
 assert.equal((html.match(/class="print-question"/g)||[]).length,5);
 await page.locator("#printNotes").click();
 html=await page.evaluate(()=>window.__printedHTML||"");
 assert.equal((html.match(/class="print-question"/g)||[]).length,5);
 assert(!html.includes("split-ring commutator"),"Core handout should not contain commutator explanation");
}
(async()=>{
 await fs.mkdir(OUT,{recursive:true});await startServer();
 let browser;
 try{
  browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
  const ctx=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await ctx.newPage();
  const pageErrors=[];page.on("pageerror",e=>pageErrors.push(e.stack||e.message));
  page.on("dialog",d=>d.accept());
  await page.route("https://cdn.jsdelivr.net/**",r=>r.abort());
  await page.addInitScript(()=>{
   window.print=()=>{window.__printedHTML=document.getElementById("printArea")?.innerHTML||""};
  });
  const url="http://127.0.0.1:"+server.address().port+PAGE;
  await run("Startup & no runtime errors",async()=>{await load(page,url);assert.equal(await page.locator('#courseNav [data-lesson]').count(),4);assert.equal(await page.locator('#courseNav .pending').count(),3);assert.deepEqual(pageErrors,[])});
  await run("Real clicking: fields, Fleming directions, charged beam & d.c. motor",()=>testExplorations(page));
  await run("Full actual UI flow: 34 MCQs, all Cloze, Try, Retry, Exit, reload",()=>testAllLessonFlow(page));
  await run("Core/Supplement switching, no content leak",()=>testTiers(page));
  await run("Print Learning vs Problems, Core vs all",()=>testPrinting(page));
  await run("Three viewport screenshots, no horizontal overflow or JS errors",()=>testResponsive(browser,url));
  await run("Global runtime error check",async()=>assert.deepEqual(pageErrors,[]));
  await ctx.close();
 }catch(e){failures.push({name:"Browser setup/execution",error:String(e.stack||e)})}
 finally{if(browser)await browser.close();await stopServer()}
 const report={timestamp:new Date().toISOString(),checks:checkpoints,failures};
 await fs.writeFile(path.join(OUT,"report.json"),JSON.stringify(report,null,2));
 console.log(JSON.stringify({completed:checkpoints.length,failed:failures.length,failures},null,2));
 if(failures.length)process.exitCode=1;
})().catch(e=>{console.error(e.stack);process.exitCode=1});
