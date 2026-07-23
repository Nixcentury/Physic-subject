(function () {
  'use strict';

  var BASE = 'https://nixcentury.github.io/Physic-subject/PHYSICS/ELECTRICIRY/';
  var root = document.getElementById('dc-circuit-quiz-root');
  if (!root || root.dataset.dccValidatedLoader === '1') return;
  root.dataset.dccValidatedLoader = '1';

  function showLoadError(message) {
    var box = document.getElementById('dcc-feedback');
    if (box) {
      box.className = 'dcc-feedback show bad';
      box.textContent = '⚠️ ' + message;
    }
    ['dcc-check-btn', 'dcc-clear-btn', 'dcc-next-btn'].forEach(function (id) {
      var button = document.getElementById(id);
      if (button) button.disabled = true;
    });
  }

  function loadScript(url, onload) {
    var script = document.createElement('script');
    script.src = url;
    script.async = false;
    script.onload = onload || function () {};
    script.onerror = function () { showLoadError('โหลดไฟล์กิจกรรมไม่สำเร็จ กรุณารีเฟรชหน้าอีกครั้ง'); };
    (document.head || document.documentElement).appendChild(script);
  }

  loadScript(BASE + 'direct-current-circuits-drag-drop-quiz-bank-v5-1.js?v=0.5.1', function () {
    loadScript(BASE + 'direct-current-circuits-drag-drop-quiz-simulator-v5-2.js?v=0.6.0');
  });
})();