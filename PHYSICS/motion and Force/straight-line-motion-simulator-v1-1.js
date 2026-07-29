(function(){
'use strict';
var lab=window.ExamateLab;
var root=document.getElementById('straight-line-motion-root');
if(!lab||!root||lab.labType!=='STRAIGHT_LINE_MOTION_SIMULATOR')return;
function mapGiven(s){var m={};(s.givens||[]).forEach(function(g){m[g.symbol]=g;});return m;}
function fmt(v){v=Number(v);if(!Number.isFinite(v))return'?';v=Math.round((v+Number.EPSILON)*100)/100;return(v>0?'+':'')+String(v);}
function refresh(){
var s=lab.current&&lab.current();
var svg=document.querySelector('#slm-motion-visual svg');
if(!s||!svg)return;
var g=mapGiven(s),m=s.motion||{},groups=svg.querySelectorAll('.slm-motion-label');
var t;
if(groups[0]){t=groups[0].querySelector('text');if(t)t.textContent='u = '+(g.u?fmt(m.u)+' m/s':'?');}
if(groups[1]){t=groups[1].querySelector('text');if(t)t.textContent='a = '+(g.a?fmt(m.a)+' m/s²':'?');}
if(groups[2]){t=groups[2].querySelector('text');if(t)t.textContent='v = '+((g.v||g.velocity||g.speed)?fmt(m.v)+' m/s':'?');}
var c=svg.querySelector('text[x="400"][y="125"]');
if(!c)return;
var time=g.t?g.t.value+' s':'?';
if(g.d)c.textContent='d = '+g.d.value+' m · t = '+time;
else if(g['Δx'])c.textContent='Δx = '+g['Δx'].value+' m · t = '+time;
else if(g['x₀']||g.x)c.textContent='x₀ = '+(g['x₀']?g['x₀'].value+' m':'?')+' · x = '+(g.x?g.x.value+' m':'?')+' · t = '+time;
else c.textContent='Δx = ? · t = '+time;
}
var original=lab.render;
lab.render=function(){var r=original.apply(this,arguments);refresh();return r;};
lab.version='1.1.0';
refresh();
try{document.dispatchEvent(new CustomEvent('examate-lab-ready',{detail:{labType:lab.labType,version:lab.version}}));}catch(error){}
})();