(function () {
  'use strict';

  var ROOT = 'straight-line-motion-root';
  var TOTAL = 25;
  var VERSION = '1.0.0';
  var LAB_TYPE = 'STRAIGHT_LINE_MOTION_SIMULATOR';
  var MODE_COUNTS = {
    speed: 3,
    velocity: 3,
    position: 3,
    acceleration: 4,
    suvat_displacement: 5,
    suvat_average: 4,
    suvat_no_time: 3
  };
  var MODE_LABELS = {
    speed: ['อัตราเร็ว', 'Speed'],
    velocity: ['ความเร็ว', 'Velocity'],
    position: ['ตำแหน่งและความเร็วคงที่', 'Position and constant velocity'],
    acceleration: ['ความเร่ง', 'Acceleration'],
    suvat_displacement: ['สมการการกระจัด', 'Displacement equation'],
    suvat_average: ['ความเร็วเฉลี่ยเมื่อความเร่งคงที่', 'Average velocity under constant acceleration'],
    suvat_no_time: ['สมการที่ไม่มีเวลา', 'Time-free equation']
  };

  function el(id) { return document.getElementById(id); }
  function clone(value) { return JSON.parse(JSON.stringify(value)); }
  function parse(value) {
    if (!value) return null;
    if (typeof value === 'object') return value;
    try { return JSON.parse(value); } catch (error) { return null; }
  }
  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }
  function seedNumber(value) {
    value = Number(value);
    if (!Number.isFinite(value)) value = Date.now();
    return (Math.abs(Math.floor(value)) || 1) >>> 0;
  }
  function randomFromSeed(value) {
    var state = seedNumber(value);
    return function () {
      state += 0x6D2B79F5;
      var t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(array, random) {
    array = array.slice();
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(random() * (i + 1));
      var temp = array[i]; array[i] = array[j]; array[j] = temp;
    }
    return array;
  }
  function pick(array, random) { return array[Math.floor(random() * array.length)]; }
  function round(value, places) {
    var p = Math.pow(10, places == null ? 2 : places);
    return Math.round((Number(value) + Number.EPSILON) * p) / p;
  }
  function signed(value) {
    value = Number(value);
    if (!Number.isFinite(value)) return '—';
    return (value > 0 ? '+' : '') + String(round(value, 2));
  }
  function formatValue(value) {
    value = Number(value);
    if (!Number.isFinite(value)) return '—';
    return String(round(value, 2));
  }
  function hash(value) {
    var h = 2166136261;
    value = String(value);
    for (var i = 0; i < value.length; i++) {
      h ^= value.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }
  function blankState() {
    return {
      seed: null,
      currentIndex: 0,
      currentScenarioId: null,
      scenarioOrder: [],
      scenarios: {},
      answers: {},
      solved: {},
      failed: {},
      revealed: {},
      completed: {},
      scores: {},
      heartsRemaining: {},
      attemptsByScenario: {},
      wrongAttempts: 0,
      feedback: ''
    };
  }

  function given(symbol, value, unit, labelTh, labelEn, useSign) {
    return {
      symbol: symbol,
      value: useSign ? signed(value) : formatValue(value),
      unit: unit || '',
      labelTh: labelTh,
      labelEn: labelEn
    };
  }

  function baseScenario(id, mode, random) {
    return {
      id: id,
      mode: mode,
      modeTh: MODE_LABELS[mode][0],
      modeEn: MODE_LABELS[mode][1],
      object: pick(['car', 'train', 'runner'], random),
      givens: [],
      target: '',
      targetTh: '',
      targetEn: '',
      unit: '',
      answer: 0,
      formula: '',
      explanationTh: '',
      explanationEn: '',
      motion: { u: 0, v: 0, a: 0, t: 1, dx: 1, x0: 0, xf: 1 }
    };
  }

  function makeSpeedScenario(id, random) {
    var s = baseScenario(id, 'speed', random);
    var speed = pick([2, 3, 4, 5, 6, 8, 10, 12, 15], random);
    var time = pick([2, 3, 4, 5, 6, 8, 10], random);
    var distance = speed * time;
    var target = pick(['speed', 'distance', 'time'], random);
    s.motion = { u: speed, v: speed, a: 0, t: time, dx: distance, x0: 0, xf: distance };
    s.formula = 'speed = distance ÷ time';
    if (target === 'speed') {
      s.givens = [given('d', distance, 'm', 'ระยะทาง', 'Distance'), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'speed'; s.targetTh = 'อัตราเร็ว'; s.targetEn = 'speed'; s.unit = 'm/s'; s.answer = speed;
      s.explanationTh = 'นำระยะทางทั้งหมดหารด้วยเวลาทั้งหมด';
      s.explanationEn = 'Divide the total distance by the total time.';
    } else if (target === 'distance') {
      s.givens = [given('speed', speed, 'm/s', 'อัตราเร็ว', 'Speed'), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'distance'; s.targetTh = 'ระยะทาง'; s.targetEn = 'distance'; s.unit = 'm'; s.answer = distance;
      s.explanationTh = 'ระยะทางเท่ากับอัตราเร็วคูณเวลา';
      s.explanationEn = 'Distance equals speed multiplied by time.';
    } else {
      s.givens = [given('d', distance, 'm', 'ระยะทาง', 'Distance'), given('speed', speed, 'm/s', 'อัตราเร็ว', 'Speed')];
      s.target = 'time'; s.targetTh = 'เวลา'; s.targetEn = 'time'; s.unit = 's'; s.answer = time;
      s.explanationTh = 'เวลาเท่ากับระยะทางหารด้วยอัตราเร็ว';
      s.explanationEn = 'Time equals distance divided by speed.';
    }
    return s;
  }

  function makeVelocityScenario(id, random) {
    var s = baseScenario(id, 'velocity', random);
    var direction = pick([-1, 1], random);
    var magnitude = pick([2, 3, 4, 5, 6, 8, 10], random);
    var velocity = direction * magnitude;
    var time = pick([2, 3, 4, 5, 6, 8], random);
    var displacement = velocity * time;
    var target = pick(['velocity', 'displacement', 'time'], random);
    s.motion = { u: velocity, v: velocity, a: 0, t: time, dx: displacement, x0: 0, xf: displacement };
    s.formula = 'velocity = displacement ÷ time';
    if (target === 'velocity') {
      s.givens = [given('Δx', displacement, 'm', 'การกระจัด', 'Displacement', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'velocity'; s.targetTh = 'ความเร็ว'; s.targetEn = 'velocity'; s.unit = 'm/s'; s.answer = velocity;
      s.explanationTh = 'ใช้การกระจัดที่มีเครื่องหมายหารด้วยเวลา';
      s.explanationEn = 'Divide signed displacement by time.';
    } else if (target === 'displacement') {
      s.givens = [given('v', velocity, 'm/s', 'ความเร็ว', 'Velocity', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'displacement'; s.targetTh = 'การกระจัด'; s.targetEn = 'displacement'; s.unit = 'm'; s.answer = displacement;
      s.explanationTh = 'การกระจัดเท่ากับความเร็วคูณเวลา';
      s.explanationEn = 'Displacement equals velocity multiplied by time.';
    } else {
      s.givens = [given('Δx', displacement, 'm', 'การกระจัด', 'Displacement', true), given('v', velocity, 'm/s', 'ความเร็ว', 'Velocity', true)];
      s.target = 'time'; s.targetTh = 'เวลา'; s.targetEn = 'time'; s.unit = 's'; s.answer = time;
      s.explanationTh = 'เวลาเป็นบวกเสมอ ใช้การกระจัดหารด้วยความเร็วที่มีเครื่องหมายเดียวกัน';
      s.explanationEn = 'Time is positive; divide displacement by velocity with matching signs.';
    }
    return s;
  }

  function makePositionScenario(id, random) {
    var s = baseScenario(id, 'position', random);
    var x0 = pick([-20, -15, -10, -5, 0, 5, 10, 15], random);
    var velocity = pick([-8, -6, -5, -4, -3, 3, 4, 5, 6, 8], random);
    var time = pick([2, 3, 4, 5, 6], random);
    var dx = velocity * time;
    var xf = x0 + dx;
    var target = pick(['xf', 'dx', 'velocity'], random);
    s.motion = { u: velocity, v: velocity, a: 0, t: time, dx: dx, x0: x0, xf: xf };
    s.formula = 'x = x₀ + vt';
    if (target === 'xf') {
      s.givens = [given('x₀', x0, 'm', 'ตำแหน่งเริ่มต้น', 'Initial position', true), given('v', velocity, 'm/s', 'ความเร็วคงที่', 'Constant velocity', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'xf'; s.targetTh = 'ตำแหน่งสุดท้าย'; s.targetEn = 'final position'; s.unit = 'm'; s.answer = xf;
      s.explanationTh = 'บวกการกระจัด vt เข้ากับตำแหน่งเริ่มต้น';
      s.explanationEn = 'Add the displacement vt to the initial position.';
    } else if (target === 'dx') {
      s.givens = [given('x₀', x0, 'm', 'ตำแหน่งเริ่มต้น', 'Initial position', true), given('x', xf, 'm', 'ตำแหน่งสุดท้าย', 'Final position', true)];
      s.target = 'dx'; s.targetTh = 'การกระจัด'; s.targetEn = 'displacement'; s.unit = 'm'; s.answer = dx;
      s.formula = 'Δx = x − x₀';
      s.explanationTh = 'ตำแหน่งสุดท้ายลบตำแหน่งเริ่มต้น';
      s.explanationEn = 'Subtract initial position from final position.';
    } else {
      s.givens = [given('x₀', x0, 'm', 'ตำแหน่งเริ่มต้น', 'Initial position', true), given('x', xf, 'm', 'ตำแหน่งสุดท้าย', 'Final position', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'velocity'; s.targetTh = 'ความเร็วคงที่'; s.targetEn = 'constant velocity'; s.unit = 'm/s'; s.answer = velocity;
      s.formula = 'v = (x − x₀) ÷ t';
      s.explanationTh = 'หาการกระจัดก่อน แล้วหารด้วยเวลา';
      s.explanationEn = 'Find displacement first, then divide by time.';
    }
    return s;
  }

  function makeAccelerationScenario(id, random) {
    var s = baseScenario(id, 'acceleration', random);
    var u = pick([-10, -8, -6, -4, -2, 0, 2, 4, 6, 8, 10], random);
    var a = pick([-4, -3, -2, -1, 1, 2, 3, 4], random);
    var time = pick([2, 3, 4, 5], random);
    var v = u + a * time;
    var dx = u * time + 0.5 * a * time * time;
    var target = pick(['a', 'v', 'u', 'time'], random);
    s.motion = { u: u, v: v, a: a, t: time, dx: dx, x0: 0, xf: dx };
    s.formula = 'v = u + at';
    if (target === 'a') {
      s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('v', v, 'm/s', 'ความเร็วปลาย', 'Final velocity', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'a'; s.targetTh = 'ความเร่ง'; s.targetEn = 'acceleration'; s.unit = 'm/s²'; s.answer = a;
      s.formula = 'a = (v − u) ÷ t';
      s.explanationTh = 'นำการเปลี่ยนความเร็วหารด้วยเวลา';
      s.explanationEn = 'Divide the change in velocity by time.';
    } else if (target === 'v') {
      s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('a', a, 'm/s²', 'ความเร่ง', 'Acceleration', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'v'; s.targetTh = 'ความเร็วปลาย'; s.targetEn = 'final velocity'; s.unit = 'm/s'; s.answer = v;
      s.explanationTh = 'ความเร็วปลายเท่ากับความเร็วต้นบวกการเปลี่ยนความเร็ว at';
      s.explanationEn = 'Final velocity equals initial velocity plus at.';
    } else if (target === 'u') {
      s.givens = [given('v', v, 'm/s', 'ความเร็วปลาย', 'Final velocity', true), given('a', a, 'm/s²', 'ความเร่ง', 'Acceleration', true), given('t', time, 's', 'เวลา', 'Time')];
      s.target = 'u'; s.targetTh = 'ความเร็วต้น'; s.targetEn = 'initial velocity'; s.unit = 'm/s'; s.answer = u;
      s.explanationTh = 'ย้าย at ไปอีกข้าง จึงได้ u = v − at';
      s.explanationEn = 'Rearrange to u = v − at.';
    } else {
      s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('v', v, 'm/s', 'ความเร็วปลาย', 'Final velocity', true), given('a', a, 'm/s²', 'ความเร่ง', 'Acceleration', true)];
      s.target = 'time'; s.targetTh = 'เวลา'; s.targetEn = 'time'; s.unit = 's'; s.answer = time;
      s.formula = 't = (v − u) ÷ a';
      s.explanationTh = 'เวลาเท่ากับการเปลี่ยนความเร็วหารด้วยความเร่ง';
      s.explanationEn = 'Time equals change in velocity divided by acceleration.';
    }
    return s;
  }

  function makeSuvatDisplacementScenario(id, random) {
    var s = baseScenario(id, 'suvat_displacement', random);
    var u = pick([-8, -6, -4, -2, 0, 2, 4, 6, 8], random);
    var a = pick([-4, -3, -2, -1, 1, 2, 3, 4], random);
    var time = pick([2, 3, 4, 5], random);
    var v = u + a * time;
    var dx = round(u * time + 0.5 * a * time * time, 2);
    s.motion = { u: u, v: v, a: a, t: time, dx: dx, x0: 0, xf: dx };
    s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('a', a, 'm/s²', 'ความเร่ง', 'Acceleration', true), given('t', time, 's', 'เวลา', 'Time')];
    s.target = 'dx'; s.targetTh = 'การกระจัด'; s.targetEn = 'displacement'; s.unit = 'm'; s.answer = dx;
    s.formula = 'Δx = ut + ½at²';
    s.explanationTh = 'แทนค่าความเร็วต้น ความเร่ง และเวลาลงในสมการการกระจัด';
    s.explanationEn = 'Substitute initial velocity, acceleration, and time into the displacement equation.';
    return s;
  }

  function makeSuvatAverageScenario(id, random) {
    var s = baseScenario(id, 'suvat_average', random);
    var u = pick([-8, -6, -4, -2, 0, 2, 4, 6, 8], random);
    var a = pick([-3, -2, -1, 1, 2, 3], random);
    var time = pick([2, 4, 6, 8], random);
    var v = u + a * time;
    var dx = round(((u + v) / 2) * time, 2);
    s.motion = { u: u, v: v, a: a, t: time, dx: dx, x0: 0, xf: dx };
    s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('v', v, 'm/s', 'ความเร็วปลาย', 'Final velocity', true), given('t', time, 's', 'เวลา', 'Time')];
    s.target = 'dx'; s.targetTh = 'การกระจัด'; s.targetEn = 'displacement'; s.unit = 'm'; s.answer = dx;
    s.formula = 'Δx = ((u + v) ÷ 2)t';
    s.explanationTh = 'หาความเร็วเฉลี่ยจากค่าเฉลี่ยของ u และ v แล้วคูณเวลา';
    s.explanationEn = 'Find average velocity from the mean of u and v, then multiply by time.';
    return s;
  }

  function makeSuvatNoTimeScenario(id, random) {
    var s = baseScenario(id, 'suvat_no_time', random);
    var u = pick([-8, -6, -4, -2, 0, 2, 4, 6, 8], random);
    var a = pick([-3, -2, -1, 1, 2, 3], random);
    var time = pick([2, 3, 4, 5], random);
    var v = u + a * time;
    var dx = round((v * v - u * u) / (2 * a), 2);
    s.motion = { u: u, v: v, a: a, t: time, dx: dx, x0: 0, xf: dx };
    s.givens = [given('u', u, 'm/s', 'ความเร็วต้น', 'Initial velocity', true), given('v', v, 'm/s', 'ความเร็วปลาย', 'Final velocity', true), given('a', a, 'm/s²', 'ความเร่ง', 'Acceleration', true)];
    s.target = 'dx'; s.targetTh = 'การกระจัด'; s.targetEn = 'displacement'; s.unit = 'm'; s.answer = dx;
    s.formula = 'v² = u² + 2aΔx';
    s.explanationTh = 'จัดรูปเป็น Δx = (v² − u²) ÷ 2a';
    s.explanationEn = 'Rearrange to Δx = (v² − u²) ÷ 2a.';
    return s;
  }

  function generateScenario(mode, id, seed) {
    var random = randomFromSeed(seed ^ hash(id + mode));
    if (mode === 'speed') return makeSpeedScenario(id, random);
    if (mode === 'velocity') return makeVelocityScenario(id, random);
    if (mode === 'position') return makePositionScenario(id, random);
    if (mode === 'acceleration') return makeAccelerationScenario(id, random);
    if (mode === 'suvat_displacement') return makeSuvatDisplacementScenario(id, random);
    if (mode === 'suvat_average') return makeSuvatAverageScenario(id, random);
    return makeSuvatNoTimeScenario(id, random);
  }

  function carSvg(x, y) {
    return '<g transform="translate(' + x + ' ' + y + ')">' +
      '<rect x="-38" y="-25" width="76" height="28" rx="8" fill="#60a5fa" stroke="#172033" stroke-width="3"/>' +
      '<path d="M-22-25 L-8-45 H22 L34-25" fill="#dbeafe" stroke="#172033" stroke-width="3"/>' +
      '<circle cx="-23" cy="8" r="11" fill="#172033"/><circle cx="24" cy="8" r="11" fill="#172033"/>' +
      '<circle cx="-23" cy="8" r="4" fill="#cbd5e1"/><circle cx="24" cy="8" r="4" fill="#cbd5e1"/>' +
      '</g>';
  }

  function motionSvg(scenario) {
    var m = scenario.motion || {};
    var dx = Number(m.dx || 0);
    var start = dx < 0 ? 630 : 170;
    var end = dx < 0 ? 170 : 630;
    if (Math.abs(dx) < 0.001) end = start + 1;
    var uText = signed(m.u) + ' m/s';
    var vText = signed(m.v) + ' m/s';
    var aText = signed(m.a) + ' m/s²';
    return '<svg viewBox="0 0 800 330" role="img" aria-label="Straight-line motion animation">' +
      '<defs><marker id="slm-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#2563eb"/></marker></defs>' +
      '<rect x="35" y="225" width="730" height="54" rx="22" fill="#dbeafe" stroke="#60a5fa" stroke-width="2"/>' +
      '<line x1="70" y1="252" x2="730" y2="252" stroke="#ffffff" stroke-width="5" stroke-dasharray="26 20"/>' +
      '<line x1="90" y1="302" x2="710" y2="302" stroke="#2563eb" stroke-width="4" marker-end="url(#slm-arrow)"/>' +
      '<text x="400" y="323" text-anchor="middle" font-size="18" font-weight="900" fill="#1d4ed8">ทิศบวก / Positive direction</text>' +
      '<line x1="' + start + '" y1="205" x2="' + end + '" y2="205" stroke="#0f766e" stroke-width="6" marker-end="url(#slm-arrow)"/>' +
      '<text x="' + start + '" y="188" text-anchor="middle" font-size="17" font-weight="900" fill="#334155">เริ่ม / Start</text>' +
      '<text x="' + end + '" y="188" text-anchor="middle" font-size="17" font-weight="900" fill="#334155">ปลาย / End</text>' +
      '<g transform="translate(' + start + ' 225)">' + carSvg(0, 0) +
      '<animateTransform attributeName="transform" type="translate" values="' + start + ' 225;' + end + ' 225;' + end + ' 225;' + start + ' 225" keyTimes="0;0.55;0.75;1" dur="4.8s" repeatCount="indefinite"/>' +
      '</g>' +
      '<g class="slm-motion-label"><rect x="70" y="28" width="205" height="60" rx="16"/><text x="172" y="52" text-anchor="middle">u = ' + esc(uText) + '</text><text x="172" y="76" text-anchor="middle">เริ่มต้น / Initial</text></g>' +
      '<g class="slm-motion-label"><rect x="298" y="28" width="205" height="60" rx="16"/><text x="400" y="52" text-anchor="middle">a = ' + esc(aText) + '</text><text x="400" y="76" text-anchor="middle">ความเร่ง / Acceleration</text></g>' +
      '<g class="slm-motion-label"><rect x="526" y="28" width="205" height="60" rx="16"/><text x="628" y="52" text-anchor="middle">v = ' + esc(vText) + '</text><text x="628" y="76" text-anchor="middle">ปลาย / Final</text></g>' +
      '<text x="400" y="125" text-anchor="middle" font-size="21" font-weight="900" fill="#0f2f75">Δx = ' + esc(signed(dx)) + ' m · t = ' + esc(formatValue(m.t)) + ' s</text>' +
      '</svg>';
  }

  window.ExamateLab = {
    version: VERSION,
    labType: LAB_TYPE,
    config: { totalSteps: TOTAL, maxScore: TOTAL, heartsPerQuestion: 2, currentStep: 0, wrongAttempts: 0 },
    state: blankState(),

    init: function () {
      if (!el(ROOT)) return;
      this.bindEvents();
      this.make(Date.now());
      el(ROOT).dataset.examateReady = '1';
      try { document.dispatchEvent(new CustomEvent('examate-lab-ready', { detail: { labType: this.labType, version: this.version } })); } catch (error) {}
    },

    bindEvents: function () {
      var input = el('slm-answer-input');
      if (input && !input.dataset.bound) {
        input.dataset.bound = '1';
        input.addEventListener('input', function () {
          var lab = window.ExamateLab;
          var id = lab.state.currentScenarioId;
          if (!id || lab.state.completed[id]) return;
          lab.state.answers[id] = input.value;
          lab.change();
        });
        input.addEventListener('keydown', function (event) {
          if (event.key === 'Enter') window.ExamateLab.checkCurrent();
        });
      }
    },

    make: function (seedValue) {
      var seed = seedNumber(seedValue);
      var random = randomFromSeed(seed);
      var schedule = [];
      Object.keys(MODE_COUNTS).forEach(function (mode) {
        for (var i = 0; i < MODE_COUNTS[mode]; i++) schedule.push(mode);
      });
      schedule = shuffle(schedule, random);
      var state = blankState();
      state.seed = seed;
      for (var q = 0; q < schedule.length; q++) {
        var id = 'SLM-' + String(q + 1).padStart(3, '0');
        state.scenarioOrder.push(id);
        state.scenarios[id] = generateScenario(schedule[q], id, seed + q * 101);
        state.heartsRemaining[id] = 2;
        state.scores[id] = 0;
        state.attemptsByScenario[id] = 0;
      }
      state.currentScenarioId = state.scenarioOrder[0];
      this.state = state;
      this.config.currentStep = 0;
      this.config.wrongAttempts = 0;
      this.render();
      this.feedback('🎯 เริ่มจาก 25 สถานการณ์ และทำต่อได้จนคะแนนครบ 25 = 100%', '');
      this.change();
    },

    appendExtraScenario: function () {
      var modes = Object.keys(MODE_COUNTS);
      var index = this.state.scenarioOrder.length;
      var random = randomFromSeed(this.state.seed ^ hash('extra-' + index));
      var previous = index > 0 ? this.state.scenarios[this.state.scenarioOrder[index - 1]].mode : '';
      var choices = modes.filter(function (mode) { return mode !== previous; });
      var mode = pick(choices, random);
      var id = 'SLM-' + String(index + 1).padStart(3, '0');
      this.state.scenarioOrder.push(id);
      this.state.scenarios[id] = generateScenario(mode, id, this.state.seed + index * 131);
      this.state.heartsRemaining[id] = 2;
      this.state.scores[id] = 0;
      this.state.attemptsByScenario[id] = 0;
      return id;
    },

    current: function () {
      return this.state.scenarios[this.state.currentScenarioId] || null;
    },

    completedCount: function () {
      var state = this.state;
      return state.scenarioOrder.reduce(function (sum, id) { return sum + (state.completed[id] ? 1 : 0); }, 0);
    },

    getScore: function () {
      var state = this.state;
      return Math.min(TOTAL, state.scenarioOrder.reduce(function (sum, id) { return sum + (state.scores[id] === 1 ? 1 : 0); }, 0));
    },

    getPercent: function () {
      return Math.min(100, Math.round(this.getScore() / TOTAL * 100));
    },

    render: function () {
      var s = this.current();
      if (!s) return;
      var id = s.id;
      var index = this.state.currentIndex;
      var solved = !!this.state.solved[id];
      var failed = !!this.state.failed[id];
      var completed = !!this.state.completed[id];
      var card = el('slm-question-card');
      card.className = 'slm-card' + (solved ? ' is-solved' : '') + (failed ? ' is-failed' : '');
      el('slm-question-number').textContent = String(index + 1);
      el('slm-question-heading').textContent = 'หาค่า ' + s.targetTh + ' / Find ' + s.targetEn;
      el('slm-question-subheading').textContent = s.modeTh + ' · ' + s.modeEn;
      el('slm-motion-visual').innerHTML = motionSvg(s);
      el('slm-givens').innerHTML = s.givens.map(function (g) {
        return '<div class="slm-given-card"><span class="slm-given-label">' + esc(g.labelTh) + '<small>' + esc(g.labelEn) + '</small></span><strong>' + esc(g.symbol) + ' = ' + esc(g.value) + ' <em>' + esc(g.unit) + '</em></strong></div>';
      }).join('');
      el('slm-target-text').innerHTML = 'จงหา <strong>' + esc(s.targetTh) + '</strong><span>Find <strong>' + esc(s.targetEn) + '</strong></span>';
      el('slm-formula-chip').textContent = s.formula;
      el('slm-answer-unit').textContent = s.unit;
      var input = el('slm-answer-input');
      input.value = this.state.answers[id] == null ? '' : this.state.answers[id];
      input.disabled = completed;
      el('slm-check-btn').disabled = completed || this.getScore() >= TOTAL;
      el('slm-clear-btn').disabled = completed || this.getScore() >= TOTAL;
      el('slm-next-btn').disabled = !completed || this.getScore() >= TOTAL;
      this.renderHearts();
      this.updateStatus();
      if (this.getScore() >= TOTAL) this.summary();
      else if (this.state.feedback) this.feedback(this.state.feedback, failed ? 'bad' : (solved ? 'good' : ''));
      else this.feedback('ใส่เฉพาะค่าตัวเลข เครื่องหมายบวกหรือลบมีความหมาย และหน่วยแสดงไว้แล้ว', '');
      if (!completed) setTimeout(function () { try { input.focus({ preventScroll: true }); } catch (error) {} }, 30);
    },

    renderHearts: function () {
      var id = this.state.currentScenarioId;
      var remaining = Number(this.state.heartsRemaining[id]);
      if (!Number.isFinite(remaining)) remaining = 2;
      var html = '';
      for (var i = 0; i < 2; i++) html += '<span class="slm-heart' + (i < remaining ? '' : ' empty') + '">❤</span>';
      el('slm-hearts').innerHTML = html;
      el('slm-hearts').setAttribute('aria-label', remaining + ' hearts');
    },

    updateStatus: function () {
      var score = this.getScore();
      var percent = this.getPercent();
      var currentNo = this.state.currentIndex + 1;
      var suffix = currentNo > TOTAL ? '/25+' : '/25';
      this.config.currentStep = this.completedCount();
      this.config.wrongAttempts = this.state.wrongAttempts;
      el('slm-question-counter').textContent = currentNo + suffix;
      el('slm-score-text').textContent = score + '/' + TOTAL;
      el('slm-progress-bar').style.width = percent + '%';
      el('slm-progress-text').textContent = 'คะแนนสะสม / Score progress: ' + score + '/' + TOTAL;
      el('slm-percent-text').textContent = percent + '%';
    },

    normalizeAnswer: function (value) {
      var cleaned = String(value == null ? '' : value).trim().replace(/−/g, '-').replace(/,/g, '.');
      if (!cleaned) return null;
      var number = Number(cleaned);
      return Number.isFinite(number) ? number : null;
    },

    isCorrect: function (student, correct) {
      var tolerance = Math.max(0.02, Math.abs(Number(correct)) * 0.002);
      return Math.abs(Number(student) - Number(correct)) <= tolerance;
    },

    checkCurrent: function () {
      var s = this.current();
      if (!s || this.state.completed[s.id] || this.getScore() >= TOTAL) return;
      var raw = el('slm-answer-input').value;
      var answer = this.normalizeAnswer(raw);
      if (answer == null) {
        this.feedback('⚠️ กรุณาใส่คำตอบเป็นตัวเลขก่อนตรวจ โดยยังไม่เสียหัวใจ', 'bad');
        return;
      }
      this.state.answers[s.id] = raw;
      if (this.isCorrect(answer, s.answer)) {
        this.state.solved[s.id] = true;
        this.state.completed[s.id] = true;
        this.state.scores[s.id] = 1;
        this.state.feedback = '✅ ถูกต้อง ' + s.targetTh + ' = ' + signed(s.answer) + ' ' + s.unit;
        this.render();
        this.change();
        return;
      }

      this.state.attemptsByScenario[s.id] = Number(this.state.attemptsByScenario[s.id] || 0) + 1;
      this.state.wrongAttempts += 1;
      this.state.heartsRemaining[s.id] = Math.max(0, Number(this.state.heartsRemaining[s.id] || 2) - 1);
      if (this.state.heartsRemaining[s.id] > 0) {
        this.state.feedback = 'ยังไม่ถูก ลองตรวจเครื่องหมายและใช้สูตร ' + s.formula + ' · เหลืออีก 1 โอกาส';
        this.render();
        this.change();
        return;
      }

      this.state.failed[s.id] = true;
      this.state.revealed[s.id] = true;
      this.state.completed[s.id] = true;
      this.state.scores[s.id] = 0;
      this.state.feedback = 'คำตอบคือ ' + signed(s.answer) + ' ' + s.unit + ' · ' + s.explanationTh + ' / ' + s.explanationEn;
      this.render();
      this.change();
    },

    clearCurrent: function () {
      var s = this.current();
      if (!s || this.state.completed[s.id] || this.getScore() >= TOTAL) return;
      this.state.answers[s.id] = '';
      el('slm-answer-input').value = '';
      this.feedback('ล้างคำตอบแล้ว ลองอ่านทิศบวกและค่าที่กำหนดอีกครั้ง', '');
      this.change();
    },

    nextQuestion: function () {
      var s = this.current();
      if (!s || !this.state.completed[s.id] || this.getScore() >= TOTAL) return;
      var nextIndex = this.state.currentIndex + 1;
      if (nextIndex >= this.state.scenarioOrder.length) this.appendExtraScenario();
      this.state.currentIndex = nextIndex;
      this.state.currentScenarioId = this.state.scenarioOrder[nextIndex];
      this.state.feedback = '';
      this.render();
      this.change();
    },

    feedback: function (message, tone) {
      this.state.feedback = String(message || '');
      var box = el('slm-feedback');
      if (!box) return;
      box.className = 'slm-feedback show' + (tone ? ' ' + tone : '');
      box.textContent = this.state.feedback;
    },

    summary: function () {
      var totalUsed = this.state.scenarioOrder.length;
      var failedCount = Object.keys(this.state.failed).filter(function (id) { return !!window.ExamateLab.state.failed[id]; }).length;
      el('slm-motion-visual').innerHTML = '<div class="slm-finish"><div class="slm-finish-icon">🏁</div><h3>ครบเป้าหมาย 25 คะแนนแล้ว</h3><p>Target reached: 25/25 points</p><strong>ใช้ทั้งหมด ' + totalUsed + ' สถานการณ์ · Failed ' + failedCount + '</strong></div>';
      el('slm-givens').innerHTML = '';
      el('slm-target-text').innerHTML = 'กิจกรรมเสร็จสมบูรณ์<span>Activity completed</span>';
      el('slm-formula-chip').textContent = 'Straight-line motion complete';
      el('slm-answer-input').disabled = true;
      el('slm-check-btn').disabled = true;
      el('slm-clear-btn').disabled = true;
      el('slm-next-btn').disabled = true;
      this.feedback('🎉 คะแนน 25/25 = 100% บันทึกผลสำเร็จแล้ว', 'good');
      this.updateStatus();
    },

    resetAll: function () {
      if (typeof window.confirm === 'function' && !window.confirm('เริ่มใหม่และล้างคะแนนทั้งหมดหรือไม่?')) return;
      this.make(Date.now());
    },

    change: function () {
      try {
        document.dispatchEvent(new CustomEvent('examate-lab-change', {
          detail: { labType: this.labType, version: this.version, percent: this.getPercent(), score: this.getScore() }
        }));
      } catch (error) {}
    },

    getSavePayload: function () {
      return {
        type: 'LAB',
        labType: this.labType,
        version: this.version,
        currentStep: this.config.currentStep,
        totalSteps: TOTAL,
        percent: this.getPercent(),
        score: this.getScore(),
        maxScore: TOTAL,
        wrongAttempts: this.state.wrongAttempts,
        seed: this.state.seed,
        currentIndex: this.state.currentIndex,
        currentScenarioId: this.state.currentScenarioId,
        scenarioOrder: clone(this.state.scenarioOrder),
        scenarios: clone(this.state.scenarios),
        answers: clone(this.state.answers),
        solved: clone(this.state.solved),
        failed: clone(this.state.failed),
        revealed: clone(this.state.revealed),
        completed: clone(this.state.completed),
        scores: clone(this.state.scores),
        heartsRemaining: clone(this.state.heartsRemaining),
        attemptsByScenario: clone(this.state.attemptsByScenario),
        feedback: this.state.feedback,
        finished: this.getScore() >= TOTAL,
        report: 'Straight-line motion: ' + this.getScore() + '/' + TOTAL,
        savedAt: new Date().toISOString()
      };
    },

    restore: function (data) {
      data = parse(data);
      if (!data) return false;
      if (data.labType && data.labType !== this.labType) return false;
      var order = Array.isArray(data.scenarioOrder) ? data.scenarioOrder : [];
      var scenarios = data.scenarios && typeof data.scenarios === 'object' ? data.scenarios : null;
      var valid = order.length >= TOTAL && scenarios && order.every(function (id) { return scenarios[id] && scenarios[id].id === id; });
      if (!valid) {
        this.make(data.seed || Date.now());
        this.feedback('ℹ️ สถานะเดิมไม่ครบสำหรับสร้างสถานการณ์กลับมา จึงเริ่มชุดใหม่', '');
        return true;
      }
      var state = blankState();
      state.seed = seedNumber(data.seed);
      state.scenarioOrder = order.slice();
      state.scenarios = clone(scenarios);
      state.currentIndex = Math.max(0, Math.min(order.length - 1, Math.floor(Number(data.currentIndex) || 0)));
      state.currentScenarioId = order[state.currentIndex];
      state.answers = data.answers && typeof data.answers === 'object' ? clone(data.answers) : {};
      state.solved = data.solved && typeof data.solved === 'object' ? clone(data.solved) : {};
      state.failed = data.failed && typeof data.failed === 'object' ? clone(data.failed) : {};
      state.revealed = data.revealed && typeof data.revealed === 'object' ? clone(data.revealed) : {};
      state.completed = data.completed && typeof data.completed === 'object' ? clone(data.completed) : {};
      state.scores = data.scores && typeof data.scores === 'object' ? clone(data.scores) : {};
      state.heartsRemaining = data.heartsRemaining && typeof data.heartsRemaining === 'object' ? clone(data.heartsRemaining) : {};
      state.attemptsByScenario = data.attemptsByScenario && typeof data.attemptsByScenario === 'object' ? clone(data.attemptsByScenario) : {};
      state.wrongAttempts = Number(data.wrongAttempts || 0);
      state.feedback = String(data.feedback || '');
      order.forEach(function (id) {
        if (typeof state.heartsRemaining[id] !== 'number') state.heartsRemaining[id] = 2;
        state.heartsRemaining[id] = Math.max(0, Math.min(2, Number(state.heartsRemaining[id]) || 0));
        state.scores[id] = state.scores[id] === 1 ? 1 : 0;
        if (typeof state.attemptsByScenario[id] !== 'number') state.attemptsByScenario[id] = 0;
      });
      this.state = state;
      this.config.wrongAttempts = state.wrongAttempts;
      this.render();
      if (this.getScore() >= TOTAL) this.summary();
      else this.feedback('✅ โหลดสถานะกลับมาแล้ว ทำต่อจากสถานการณ์เดิมได้เลย', 'good');
      return true;
    }
  };

  var labApi = window.ExamateLab;
  labApi.init();

  function consumePendingSave() {
    if (window.ExamateLab !== labApi || !el(ROOT)) return false;
    var pending = parse(window.pendingLabSave);
    if (!pending) return false;
    if (pending.labType && pending.labType !== labApi.labType) return false;
    var restored = labApi.restore(pending);
    if (restored) {
      window.pendingLabSave = null;
      return true;
    }
    return false;
  }

  function receiveRestoreRequest(event) {
    var detail = event && event.detail ? event.detail : null;
    var incoming = detail && Object.prototype.hasOwnProperty.call(detail, 'data') ? detail.data : detail;
    if (incoming) window.pendingLabSave = incoming;
    consumePendingSave();
  }

  function loadSavedStateFromLms() {
    var studentId = '';
    var quizId = '';
    try {
      studentId = (typeof getEffectiveStudentId === 'function')
        ? getEffectiveStudentId()
        : ((typeof userData !== 'undefined' && userData)
          ? (userData.studentID || userData.studentId || '')
          : (window.currentStudentId || window.studentId || ''));
      quizId = (typeof currentQuizId !== 'undefined' && currentQuizId)
        ? currentQuizId
        : (window.currentQuizId || window.quizId || '');
    } catch (identityError) {
      console.warn('[Straight-line Motion] Cannot resolve LMS identity', identityError);
      return;
    }
    if (!studentId || !quizId || typeof google === 'undefined' || !google.script || !google.script.run) return;
    google.script.run
      .withSuccessHandler(function (savedRaw) {
        var saved = parse(savedRaw);
        if (!saved || saved.type !== 'LAB') return;
        if (saved.labType && saved.labType !== labApi.labType) return;
        window.pendingLabSave = saved;
        consumePendingSave();
      })
      .withFailureHandler(function (error) {
        console.warn('[Straight-line Motion] SavedStates restore failed', error);
      })
      .loadProgressFromCloud(studentId, quizId);
  }

  consumePendingSave();
  setTimeout(consumePendingSave, 250);
  setTimeout(loadSavedStateFromLms, 100);
  document.addEventListener('examate-lab-restore-request', receiveRestoreRequest);

  var restoreWatcher = setInterval(function () {
    if (window.ExamateLab !== labApi || !el(ROOT)) {
      clearInterval(restoreWatcher);
      document.removeEventListener('examate-lab-restore-request', receiveRestoreRequest);
      return;
    }
    consumePendingSave();
  }, 500);
})();