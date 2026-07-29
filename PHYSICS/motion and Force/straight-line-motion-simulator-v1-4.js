(function () {
  'use strict';

  var lab = window.ExamateLab;
  var root = document.getElementById('straight-line-motion-root');
  if (!lab || !root || lab.labType !== 'STRAIGHT_LINE_MOTION_SIMULATOR') return;
  if (root.dataset.slmV14 === '1') return;
  root.dataset.slmV14 = '1';

  var style = document.createElement('style');
  style.id = 'slm-v14-style';
  style.textContent =
    '#straight-line-motion-root{font-size:20px!important}' +
    '#straight-line-motion-root .slm-card{padding:36px!important}' +
    '#straight-line-motion-root .slm-section-title h3{font-size:clamp(30px,3vw,40px)!important}' +
    '#straight-line-motion-root .slm-section-title small{font-size:21px!important}' +
    '#straight-line-motion-root .slm-workspace{grid-template-columns:1fr!important;gap:22px!important}' +
    '#straight-line-motion-root .slm-motion-visual{min-height:470px!important;padding:18px!important}' +
    '#straight-line-motion-root .slm-motion-visual svg{width:100%!important;max-height:500px!important}' +
    '#straight-line-motion-root .slm-problem-panel{padding:24px!important;gap:18px!important}' +
    '#straight-line-motion-root .slm-panel-title{font-size:25px!important}' +
    '#straight-line-motion-root .slm-givens{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}' +
    '#straight-line-motion-root .slm-given-card{min-height:112px!important;padding:16px!important}' +
    '#straight-line-motion-root .slm-given-label{font-size:17px!important}' +
    '#straight-line-motion-root .slm-given-label small{font-size:15px!important}' +
    '#straight-line-motion-root .slm-given-card strong{font-size:30px!important}' +
    '#straight-line-motion-root .slm-given-card em{font-size:18px!important}' +
    '#straight-line-motion-root .slm-target-box{font-size:29px!important;padding:18px 20px!important}' +
    '#straight-line-motion-root .slm-target-box span{font-size:20px!important}' +
    '#straight-line-motion-root .slm-answer-label{font-size:22px!important}' +
    '#straight-line-motion-root .slm-answer-row input{font-size:36px!important;padding:18px 20px!important}' +
    '#straight-line-motion-root .slm-answer-unit{font-size:25px!important;min-width:110px!important;padding:18px 15px!important}' +
    '#straight-line-motion-root .slm-answer-note{font-size:16px!important}' +
    '#straight-line-motion-root .slm-feedback{font-size:21px!important;padding:18px 20px!important}' +
    '#straight-line-motion-root .slm-btn{font-size:19px!important;padding:13px 21px!important}' +
    '#straight-line-motion-root .slm-v12-badge .symbol{font-size:20px!important}' +
    '#straight-line-motion-root .slm-v12-badge .value{font-size:20px!important}' +
    '#straight-line-motion-root .slm-v12-badge.target .value{font-size:27px!important}' +
    '#straight-line-motion-root .slm-v12-svg .motion-note{font-size:20px!important}' +
    '#straight-line-motion-root .slm-v12-svg .point-text{font-size:17px!important}' +
    '#straight-line-motion-root .slm-v12-svg .axis-text{font-size:21px!important}' +
    '#straight-line-motion-root .slm-v12-svg .turn-text{font-size:17px!important}' +
    '@media(max-width:900px){' +
      '#straight-line-motion-root .slm-card{padding:26px!important}' +
      '#straight-line-motion-root .slm-givens{grid-template-columns:repeat(2,minmax(0,1fr))!important}' +
      '#straight-line-motion-root .slm-motion-visual{min-height:390px!important}' +
    '}' +
    '@media(max-width:560px){' +
      '#straight-line-motion-root{font-size:18px!important}' +
      '#straight-line-motion-root .slm-card{padding:18px!important}' +
      '#straight-line-motion-root .slm-givens{grid-template-columns:1fr!important}' +
      '#straight-line-motion-root .slm-motion-visual{min-height:300px!important;padding:8px!important}' +
      '#straight-line-motion-root .slm-given-card strong{font-size:26px!important}' +
      '#straight-line-motion-root .slm-target-box{font-size:25px!important}' +
      '#straight-line-motion-root .slm-answer-row input{font-size:31px!important}' +
    '}';
  root.appendChild(style);

  lab.version = '1.4.0';
  root.dataset.slmVersion = lab.version;
  var kicker = root.querySelector('.slm-kicker');
  if (kicker) kicker.textContent = '🚗 STRAIGHT-LINE MOTION · V1.4 · TARGET 25 POINTS';

  try {
    document.dispatchEvent(new CustomEvent('examate-lab-ready', {
      detail: { labType: lab.labType, version: lab.version }
    }));
  } catch (error) {}
})();
