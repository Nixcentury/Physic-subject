(function(){
  'use strict';
  var lab=window.ExamateLab;
  if(!lab||lab.labType!=='DIRECT_CURRENT_CIRCUITS_DRAG_DROP_QUIZ')return;
  var originalResolve=lab.resolve;
  lab.resolve=function(){
    originalResolve.apply(this,arguments);
    var next=document.getElementById('dcc-next-btn');
    if(next&&this.done())next.disabled=false;
  };
  var originalCheck=lab.checkCurrent;
  lab.checkCurrent=function(){
    var result=originalCheck.apply(this,arguments);
    if(result&&result.ok&&this.complete())this.summary();
    return result;
  };
  lab.resolve();
})();
