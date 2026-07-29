(function () {
  'use strict';

  var lab = window.ExamateLab;
  var root = document.getElementById('straight-line-motion-root');
  if (!lab || !root || lab.labType !== 'STRAIGHT_LINE_MOTION_SIMULATOR') return;
  if (root.dataset.slmV13 === '1') return;
  root.dataset.slmV13 = '1';

  var formulaChip = document.getElementById('slm-formula-chip');
  if (formulaChip) formulaChip.style.display = 'none';

  var originalFeedback = lab.feedback;
  lab.feedback = function (message, tone) {
    message = String(message || '')
      .replace(/และใช้สูตร[^·]+·/g, 'และตรวจความหมายของปริมาณอีกครั้ง ·')
      .replace(/and use the formula[^·]+·/gi, 'and check the quantities again ·');
    return originalFeedback.call(this, message, tone);
  };

  var originalRender = lab.render;
  lab.render = function () {
    var result = originalRender.apply(this, arguments);
    var chip = document.getElementById('slm-formula-chip');
    if (chip) chip.style.display = 'none';
    return result;
  };

  lab.version = '1.3.0';
  root.dataset.slmVersion = lab.version;
  var kicker = root.querySelector('.slm-kicker');
  if (kicker) kicker.textContent = '🚗 STRAIGHT-LINE MOTION · V1.3 · TARGET 25 POINTS';

  try {
    document.dispatchEvent(new CustomEvent('examate-lab-ready', {
      detail: { labType: lab.labType, version: lab.version }
    }));
  } catch (error) {}
})();
