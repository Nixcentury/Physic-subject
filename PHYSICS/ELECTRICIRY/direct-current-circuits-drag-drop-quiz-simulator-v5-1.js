(function () {
  'use strict';

  var ROOT = 'dc-circuit-quiz-root';
  var LETTERS = ['A', 'B', 'C', 'D'];
  var TOTAL = 25;
  var RULES = { symbol_to_device: 5, device_to_symbol: 5, multi: 8, meter: 5, repair: 2 };

  var BANK_PACKAGE = window.DCC_QUIZ_BANK_V5 || { components: {}, questions: [] };
  var C = BANK_PACKAGE.components || {};
  var BANK = Array.isArray(BANK_PACKAGE.questions) ? BANK_PACKAGE.questions : [];

  function el(id) { return document.getElementById(id); }
  function cp(value) { return JSON.parse(JSON.stringify(value)); }
  function esc(value) { return String(value == null ? '' : value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;'); }
  function parse(value) { if (!value) return null; if (typeof value === 'object') return value; try { return JSON.parse(value); } catch (error) { return null; } }
  function sd(value) { value = Number(value); if (!Number.isFinite(value)) value = Date.now(); return (Math.abs(Math.floor(value)) || 1) >>> 0; }
  function rnd(value) { var a = sd(value); return function () { a += 0x6D2B79F5; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  function sh(array, random) { array = array.slice(); for (var i = array.length - 1; i > 0; i--) { var j = Math.floor(random() * (i + 1)); var temp = array[i]; array[i] = array[j]; array[j] = temp; } return array; }
  function hash(value) { var h = 2166136261; value = String(value); for (var i = 0; i < value.length; i++) { h ^= value.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
  function find(id) { for (var i = 0; i < BANK.length; i++) if (BANK[i].id === id) return BANK[i]; return null; }
  function svg(id, label) { return '<svg viewBox="0 0 180 110" role="img" aria-label="' + esc(label || '') + '"><use href="#' + esc(id) + '"></use></svg>'; }
  function blank() { return { seed: null, currentIndex: 0, currentQuestionId: null, selectedQuestionIds: [], questionOrder: [], optionOrders: {}, selectedOption: null, answers: {}, solved: {}, failed: {}, revealed: {}, completed: {}, checked: {}, scores: {}, heartsRemaining: {}, attemptsByQuestion: {}, wrongAttempts: 0, score: 0, feedback: '' }; }
  function group(filter) { return BANK.filter(filter); }
  function take(pool, count, random) { return sh(pool, random).slice(0, count); }

  function validateBank() {
    var errors = [];
    var ids = {};
    if (BANK.length !== 50) errors.push('Question bank must contain exactly 50 records; found ' + BANK.length + '.');

    BANK.forEach(function (q, index) {
      var tag = q && q.id ? q.id : 'record ' + (index + 1);
      if (!q || !q.id) { errors.push(tag + ': missing id.'); return; }
      if (ids[q.id]) errors.push(q.id + ': duplicate id.');
      ids[q.id] = true;
      if (!Array.isArray(q.choices) || q.choices.length !== 4) errors.push(q.id + ': choices must contain 4 records.');
      if (Array.isArray(q.choices) && new Set(q.choices).size !== q.choices.length) errors.push(q.id + ': choices contain duplicates.');
      (q.choices || []).forEach(function (component) { if (!C[component]) errors.push(q.id + ': unknown choice ' + component + '.'); });

      if (q.type === 'symbol_to_device' || q.type === 'device_to_symbol') {
        if (!C[q.component]) errors.push(q.id + ': unknown answer component.');
        if (!Array.isArray(q.choices) || q.choices.indexOf(q.component) < 0) errors.push(q.id + ': correct answer is absent from choices.');
      } else if (q.type === 'circuit_slots') {
        if (!Array.isArray(q.slots) || q.slots.length < 2) errors.push(q.id + ': circuit question needs at least 2 slots.');
        var slotIds = {};
        (q.slots || []).forEach(function (slot) {
          if (!slot.id || slotIds[slot.id]) errors.push(q.id + ': duplicate or missing slot id.');
          slotIds[slot.id] = true;
          if (!C[slot.answer]) errors.push(q.id + ': unknown slot answer ' + slot.answer + '.');
          if (!Array.isArray(q.choices) || q.choices.indexOf(slot.answer) < 0) errors.push(q.id + ': slot answer ' + slot.answer + ' is absent from choices.');
          if (!Number.isFinite(Number(slot.x)) || !Number.isFinite(Number(slot.y))) errors.push(q.id + ': slot coordinates are invalid.');
        });
      } else {
        errors.push(q.id + ': unsupported question type.');
      }
    });

    if (group(function (q) { return q.type === 'symbol_to_device'; }).length < RULES.symbol_to_device) errors.push('Not enough symbol-to-device questions.');
    if (group(function (q) { return q.type === 'device_to_symbol'; }).length < RULES.device_to_symbol) errors.push('Not enough device-to-symbol questions.');
    if (group(function (q) { return q.category === 'multi'; }).length < RULES.multi) errors.push('Not enough multi-slot questions.');
    if (group(function (q) { return q.category === 'meter'; }).length < RULES.meter) errors.push('Not enough meter questions.');
    if (group(function (q) { return q.category === 'repair'; }).length < RULES.repair) errors.push('Not enough repair questions.');
    return errors;
  }

  function buildSelection(seedValue) {
    var random = rnd(seedValue);
    var selected = [];
    selected = selected.concat(take(group(function (q) { return q.type === 'symbol_to_device'; }), RULES.symbol_to_device, random));
    selected = selected.concat(take(group(function (q) { return q.type === 'device_to_symbol'; }), RULES.device_to_symbol, random));
    selected = selected.concat(take(group(function (q) { return q.category === 'multi'; }), RULES.multi, random));
    selected = selected.concat(take(group(function (q) { return q.category === 'meter'; }), RULES.meter, random));
    selected = selected.concat(take(group(function (q) { return q.category === 'repair'; }), RULES.repair, random));
    return sh(selected.map(function (q) { return q.id; }), random);
  }

  function sourceVertical() {
    return '<line x1="90" y1="55" x2="90" y2="145" class="dcc-wire"/><line x1="90" y1="195" x2="90" y2="305" class="dcc-wire"/><line x1="57" y1="155" x2="123" y2="155" class="dcc-wire"/><line x1="72" y1="185" x2="108" y2="185" class="dcc-wire"/>';
  }

  function wrongMeters(template) {
    if (template === 'branch_meter') return '<text x="188" y="116" class="dcc-ghost-wrong">V ?</text><text x="426" y="43" class="dcc-ghost-wrong">A ?</text>';
    return '<text x="438" y="304" class="dcc-ghost-wrong">V ?</text><text x="364" y="43" class="dcc-ghost-wrong">A ?</text>';
  }

  function meterSvg(component, repair) {
    return '<svg viewBox="0 0 700 360" aria-hidden="true">' +
      '<path class="dcc-wire" d="M90 75V145M90 195V285H400M520 285H610V105H470M300 105H90V75M300 105V35H340M430 35H470V105"/>' +
      '<line x1="58" y1="155" x2="122" y2="155" class="dcc-wire"/><line x1="72" y1="185" x2="108" y2="185" class="dcc-wire"/>' +
      '<use href="#' + component + '" x="300" y="50" width="170" height="110"></use>' +
      '<circle class="dcc-node" cx="300" cy="105" r="6"/><circle class="dcc-node" cx="470" cy="105" r="6"/>' +
      repair + '</svg>';
  }

  function branchSvg(lower, repair) {
    var upperWire = lower ? 'M90 105H360M530 105H610' : 'M90 105H140M260 105H360M530 105H610M360 105V35H400M490 35H530V105';
    var lowerWire = lower ? 'M90 255H140M260 255H360M530 255H610M360 255V325H400M490 325H530V255' : 'M90 255H360M530 255H610';
    return '<svg viewBox="0 0 700 360" aria-hidden="true">' +
      '<path class="dcc-wire" d="M90 55V145M90 195V305M610 105V255' + upperWire + lowerWire + '"/>' +
      '<line x1="58" y1="155" x2="122" y2="155" class="dcc-wire"/><line x1="72" y1="185" x2="108" y2="185" class="dcc-wire"/>' +
      '<use href="#dcc-s-lamp" x="360" y="50" width="170" height="110"></use><use href="#dcc-s-lamp" x="360" y="200" width="170" height="110"></use>' +
      '<circle class="dcc-node" cx="360" cy="105" r="6"/><circle class="dcc-node" cx="530" cy="105" r="6"/><circle class="dcc-node" cx="360" cy="255" r="6"/><circle class="dcc-node" cx="530" cy="255" r="6"/>' + repair + '</svg>';
  }

  function sourceMeterSvg() {
    return '<svg viewBox="0 0 700 360" aria-hidden="true">' +
      '<path class="dcc-wire" d="M90 90H280M395 90H610V285H520M400 285H300M130 285H90V90M280 90V35H315M360 35H395V90"/>' +
      '<line x1="300" y1="58" x2="300" y2="122" class="dcc-wire"/><line x1="325" y1="72" x2="325" y2="108" class="dcc-wire"/><line x1="350" y1="58" x2="350" y2="122" class="dcc-wire"/><line x1="375" y1="72" x2="375" y2="108" class="dcc-wire"/>' +
      '<use href="#dcc-s-lamp" x="130" y="230" width="170" height="110"></use>' +
      '<circle class="dcc-node" cx="280" cy="90" r="6"/><circle class="dcc-node" cx="395" cy="90" r="6"/></svg>';
  }

  function circuitSvg(q) {
    var repair = q.repair ? wrongMeters(q.template) : '';
    if (q.template === 'loop3') return '<svg viewBox="0 0 700 360" aria-hidden="true"><path class="dcc-wire" d="M70 70H275M425 70H630V285H600M480 285H220M100 285H70V70"/></svg>';
    if (q.template === 'parallel3') return '<svg viewBox="0 0 700 360" aria-hidden="true"><path class="dcc-wire" d="M90 55V120M90 240V305M90 95H340M472 95H650M90 265H340M472 265H650M650 95V265"/></svg>';
    if (q.template === 'meter_lamp') return meterSvg('dcc-s-lamp', repair);
    if (q.template === 'meter_resistor') return meterSvg('dcc-s-resistor', repair);
    if (q.template === 'meter_motor') return meterSvg('dcc-s-motor', repair);
    if (q.template === 'branch_meter') return branchSvg(false, repair);
    if (q.template === 'branch_meter_lower') return branchSvg(true, repair);
    if (q.template === 'source_meter') return sourceMeterSvg();
    return '<svg viewBox="0 0 700 360" aria-hidden="true"><text x="350" y="180" text-anchor="middle" class="dcc-fixed-label">Circuit template unavailable</text></svg>';
  }

  window.ExamateLab = {
    version: '0.5.1',
    bankVersion: BANK_PACKAGE.version || 'ROUND5.1-BANK-50-SELECT-25-VALIDATED',
    labType: 'DIRECT_CURRENT_CIRCUITS_DRAG_DROP_QUIZ',
    timer: null,
    config: { totalSteps: TOTAL, maxScore: TOTAL, heartsPerQuestion: 2, currentStep: 0, wrongAttempts: 0 },
    state: blank(),

    init: function () {
      if (!el(ROOT)) return;
      var errors = validateBank();
      if (errors.length) {
        console.error('[DCC Quiz] Invalid question bank', errors);
        this.disableForBankError(errors);
        return;
      }
      this.bindSingleSlot();
      this.make(Date.now());
      el(ROOT).dataset.examateReady = '1';
      try { document.dispatchEvent(new CustomEvent('examate-lab-ready', { detail: { labType: this.labType, version: this.version } })); } catch (error) {}
    },

    disableForBankError: function (errors) {
      var zone = el('dcc-question-zone');
      if (zone) zone.innerHTML = '<div class="dcc-question-text">ไม่สามารถเริ่มกิจกรรมได้ เนื่องจากฐานข้อมูลโจทย์ไม่สมบูรณ์<span class="en">The activity could not start because the question bank is invalid.</span></div>';
      ['dcc-check-btn', 'dcc-clear-btn', 'dcc-next-btn'].forEach(function (id) { if (el(id)) el(id).disabled = true; });
      this.fb('⚠️ ตรวจพบข้อผิดพลาดในฐานข้อมูล ' + errors.length + ' รายการ กรุณาแจ้งผู้สอน', 'bad');
    },

    make: function (seedValue) {
      this.stopTimer();
      var seedNumber = sd(seedValue);
      var order = buildSelection(seedNumber);
      var state = blank();
      state.seed = seedNumber;
      state.questionOrder = order;
      state.selectedQuestionIds = order.slice();
      state.currentQuestionId = order[0];
      for (var i = 0; i < order.length; i++) {
        var q = find(order[i]);
        state.optionOrders[q.id] = sh(q.choices, rnd(seedNumber ^ hash(q.id)));
        state.heartsRemaining[q.id] = 2;
        state.scores[q.id] = 0;
      }
      this.state = state;
      this.config.currentStep = 0;
      this.config.wrongAttempts = 0;
      this.render();
      this.fb('🎯 สุ่ม 25 ข้อจากฐาน 50 ข้อ โดยคุมสัดส่วนข้อเดี่ยวและวงจรประยุกต์', '');
      this.change();
    },

    current: function () { return find(this.state.currentQuestionId); },
    isCircuit: function (q) { return q && q.type === 'circuit_slots'; },

    bindSingleSlot: function () {
      var self = this;
      var slot = el('dcc-answer-slot');
      if (!slot || slot.dataset.bound) return;
      slot.dataset.bound = '1';
      slot.addEventListener('dragover', function (event) { var q = self.current(); if (self.isCircuit(q) || self.done()) return; event.preventDefault(); slot.classList.add('is-over'); });
      slot.addEventListener('dragleave', function () { slot.classList.remove('is-over'); });
      slot.addEventListener('drop', function (event) { var q = self.current(); if (self.isCircuit(q) || self.done()) return; event.preventDefault(); slot.classList.remove('is-over'); var component = event.dataTransfer ? event.dataTransfer.getData('text/plain') : ''; if (component) self.place(component, 'main'); });
      slot.addEventListener('click', function () { var q = self.current(); if (!self.isCircuit(q) && !self.done() && self.state.selectedOption) self.place(self.state.selectedOption, 'main'); });
      slot.addEventListener('keydown', function (event) { var q = self.current(); if ((event.key === 'Enter' || event.key === ' ') && !self.isCircuit(q) && !self.done() && self.state.selectedOption) { event.preventDefault(); self.place(self.state.selectedOption, 'main'); } });
    },

    bindCircuitSlots: function () {
      var self = this;
      el(ROOT).querySelectorAll('.dcc-circuit-slot').forEach(function (slot) {
        slot.addEventListener('dragover', function (event) { if (self.done()) return; event.preventDefault(); slot.classList.add('is-over'); });
        slot.addEventListener('dragleave', function () { slot.classList.remove('is-over'); });
        slot.addEventListener('drop', function (event) { if (self.done()) return; event.preventDefault(); slot.classList.remove('is-over'); var component = event.dataTransfer ? event.dataTransfer.getData('text/plain') : ''; if (component) self.place(component, slot.dataset.slotId); });
        slot.addEventListener('click', function () { if (!self.done() && self.state.selectedOption) self.place(self.state.selectedOption, slot.dataset.slotId); });
        slot.addEventListener('keydown', function (event) { if ((event.key === 'Enter' || event.key === ' ') && !self.done() && self.state.selectedOption) { event.preventDefault(); self.place(self.state.selectedOption, slot.dataset.slotId); } });
      });
    },

    bindOptions: function () {
      var self = this;
      el(ROOT).querySelectorAll('.dcc-option').forEach(function (option) {
        function pick() { if (self.done()) return; self.state.selectedOption = option.dataset.componentId; self.mark(self.state.selectedOption); self.fb('เลือกแล้ว ลากหรือแตะช่องที่ต้องการวาง', ''); self.change(); }
        option.draggable = !self.done();
        option.addEventListener('dragstart', function (event) { if (self.done()) { event.preventDefault(); return; } pick(); if (event.dataTransfer) { event.dataTransfer.setData('text/plain', option.dataset.componentId); event.dataTransfer.effectAllowed = 'copy'; } });
        option.addEventListener('click', pick);
        option.addEventListener('keydown', function (event) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pick(); } });
      });
    },

    render: function () {
      var q = this.current();
      if (!q) return;
      var circuit = this.isCircuit(q);
      var zone = el('dcc-question-zone');
      var wrap = el('dcc-single-answer-wrap');
      wrap.style.display = circuit ? 'none' : 'block';
      zone.classList.toggle('circuit-zone', circuit);
      el('dcc-question-heading').textContent = circuit ? (q.category === 'repair' ? 'แก้ไขวงจร / Repair circuit' : 'เติมวงจรหลายช่อง / Multi-slot circuit') : (q.type === 'symbol_to_device' ? 'สัญลักษณ์ → อุปกรณ์' : 'อุปกรณ์ → สัญลักษณ์');
      el('dcc-question-subheading').textContent = circuit ? 'ต้องวางให้ถูกครบทุกช่องจึงได้คะแนน' : 'ลากคำตอบที่ตรงกันลงในช่อง';
      if (circuit) {
        zone.innerHTML = this.renderCircuit(q);
      } else {
        var component = C[q.component];
        var symbolPrompt = q.type === 'symbol_to_device';
        zone.innerHTML = '<div class="dcc-question-prompt"><span class="dcc-type-pill">' + (symbolPrompt ? 'SYMBOL → COMPONENT' : 'COMPONENT → SYMBOL') + '</span><div class="dcc-question-visual">' + svg(symbolPrompt ? component.s : component.d, 'Question visual') + '</div><div class="dcc-question-text">' + (symbolPrompt ? 'สัญลักษณ์นี้แทนอุปกรณ์ใด?' : 'อุปกรณ์นี้ใช้สัญลักษณ์ใดในแผนภาพวงจร?') + '<span class="en">' + (symbolPrompt ? 'Which component does this circuit symbol represent?' : 'Which circuit symbol represents this component?') + '</span></div></div>';
      }
      this.renderOptions();
      if (circuit) this.bindCircuitSlots(); else this.renderSingleSlot();
      this.hearts();
      this.update();
      this.resolve();
    },

    renderCircuit: function (q) {
      var answers = this.state.answers[q.id] && typeof this.state.answers[q.id] === 'object' ? this.state.answers[q.id] : {};
      var reveal = !!this.state.revealed[q.id];
      var solved = !!this.state.solved[q.id];
      var slots = '';
      for (var i = 0; i < q.slots.length; i++) {
        var slot = q.slots[i];
        var cid = reveal ? slot.answer : answers[slot.id];
        var cls = 'dcc-circuit-slot' + (slot.vertical ? ' is-vertical' : '');
        if (cid) cls += ' is-filled';
        if (solved) cls += ' is-correct';
        if (reveal && !solved) cls += ' is-revealed';
        slots += '<div class="' + cls + '" data-slot-id="' + esc(slot.id) + '" tabindex="0" role="button" aria-label="' + esc(slot.label) + '" style="left:' + Number(slot.x) + '%;top:' + Number(slot.y) + '%">' + (cid && C[cid] ? svg(C[cid].s, C[cid].en) : '<span class="slot-empty">วางที่นี่<br>Drop here</span>') + '<span class="slot-label">' + esc(slot.label) + '</span></div>';
      }
      return '<div class="dcc-circuit-question"><span class="dcc-type-pill">' + (q.category === 'repair' ? 'REPAIR CIRCUIT' : 'MULTI-SLOT CIRCUIT') + '</span><div class="dcc-circuit-instruction">' + esc(q.promptTh) + '<span class="en">' + esc(q.promptEn) + '</span></div><div class="dcc-circuit-board">' + circuitSvg(q) + slots + '</div><div class="dcc-circuit-key"><span>ถูกครบทุกช่อง = 1 คะแนน</span><span>All slots correct = 1 point</span></div></div>';
    },

    renderOptions: function () {
      var q = this.current();
      var order = this.state.optionOrders[q.id] || [];
      var html = '';
      var circuit = this.isCircuit(q);
      for (var i = 0; i < order.length; i++) {
        var component = C[order[i]];
        var visual = circuit ? component.s : (q.type === 'symbol_to_device' ? component.d : component.s);
        html += '<div class="dcc-option" tabindex="0" role="button" data-component-id="' + esc(order[i]) + '">' + svg(visual, 'Choice ' + LETTERS[i]) + '<span class="dcc-option-letter">' + LETTERS[i] + '</span>' + (circuit ? '<span class="dcc-option-name">' + esc(component.th) + '<br>' + esc(component.en) + '</span>' : '<span class="dcc-option-caption">ลากหรือแตะ / Drag or tap</span>') + '</div>';
      }
      el('dcc-options-zone').classList.toggle('circuit-mode', circuit);
      el('dcc-options-zone').innerHTML = html;
      this.bindOptions();
      this.mark(this.state.selectedOption || '');
    },

    mark: function (component) { el(ROOT).querySelectorAll('.dcc-option').forEach(function (option) { option.classList.toggle('is-selected', option.dataset.componentId === component); }); },

    place: function (component, slot) {
      if (this.done() || !C[component]) return;
      var q = this.current();
      if (this.isCircuit(q)) {
        if (!this.state.answers[q.id] || typeof this.state.answers[q.id] !== 'object') this.state.answers[q.id] = {};
        this.state.answers[q.id][slot] = component;
      } else {
        this.state.answers[q.id] = component;
      }
      this.state.selectedOption = component;
      this.render();
      this.fb(this.isCircuit(q) ? 'วางคำตอบแล้ว ตรวจตำแหน่งอื่นให้ครบก่อนกดตรวจ' : 'วางคำตอบแล้ว กดตรวจคำตอบได้เลย', '');
      this.change();
    },

    renderSingleSlot: function () {
      var slot = el('dcc-answer-slot');
      var q = this.current();
      var cid = this.state.answers[q.id];
      var done = this.done();
      if (this.state.revealed[q.id]) cid = q.component;
      slot.classList.toggle('is-locked', done);
      if (!cid || !C[cid]) {
        slot.classList.remove('is-filled');
        slot.innerHTML = '<div class="dcc-dropzone-placeholder">ลากตัวเลือกมาวางที่นี่<br>หรือแตะตัวเลือกแล้วแตะช่องนี้</div>';
        return;
      }
      slot.classList.add('is-filled');
      slot.innerHTML = '<div class="dcc-placed-chip">' + svg(q.type === 'symbol_to_device' ? C[cid].d : C[cid].s, 'Placed answer') + '<small>' + (done ? 'บันทึกคำตอบแล้ว / Answer locked' : 'แตะตัวเลือกอื่นเพื่อเปลี่ยนคำตอบ') + '</small></div>';
    },

    hearts: function () {
      var box = el('dcc-hearts');
      var n = this.state.heartsRemaining[this.state.currentQuestionId];
      if (typeof n !== 'number') n = 2;
      box.innerHTML = '<span class="dcc-heart' + (n > 0 ? '' : ' empty') + '">❤️</span><span class="dcc-heart' + (n > 1 ? '' : ' empty') + '">❤️</span>';
      box.setAttribute('aria-label', n + ' hearts remaining');
    },

    checkCurrent: function () {
      var q = this.current();
      if (!q) return { ok: false };
      if (this.done()) return { ok: !!this.state.solved[q.id] };

      var correct = 0;
      var total = 1;
      var filled = 0;
      if (this.isCircuit(q)) {
        var answers = this.state.answers[q.id] || {};
        total = q.slots.length;
        for (var i = 0; i < q.slots.length; i++) {
          var slot = q.slots[i];
          if (answers[slot.id]) filled++;
          if (answers[slot.id] === slot.answer) correct++;
        }
        if (filled < total) {
          this.fb('กรุณาวางคำตอบให้ครบทุกช่องก่อนตรวจ (' + filled + '/' + total + ') — ยังไม่เสียหัวใจ', 'bad');
          return { ok: false, reason: 'INCOMPLETE', filledSlots: filled, totalSlots: total };
        }
      } else {
        if (!this.state.answers[q.id]) {
          this.fb('กรุณาวางคำตอบในช่องก่อนตรวจ — ยังไม่เสียหัวใจ', 'bad');
          return { ok: false, reason: 'EMPTY' };
        }
        filled = 1;
        correct = this.state.answers[q.id] === q.component ? 1 : 0;
      }

      this.state.checked[q.id] = true;
      this.state.attemptsByQuestion[q.id] = (this.state.attemptsByQuestion[q.id] || 0) + 1;
      var ok = correct === total;
      if (ok) {
        this.state.solved[q.id] = true;
        this.state.completed[q.id] = true;
        this.state.scores[q.id] = 1;
        this.score();
        this.render();
        this.fb(this.isCircuit(q) ? '✅ ถูกครบ ' + correct + '/' + total + ' ตำแหน่ง ได้ 1 คะแนน กด “ข้อถัดไป”' : '✅ ถูกต้อง ได้ 1 คะแนน กด “ข้อถัดไป”', 'good');
      } else {
        this.state.scores[q.id] = 0;
        var n = Math.max(0, this.state.heartsRemaining[q.id] - 1);
        this.state.heartsRemaining[q.id] = n;
        this.state.wrongAttempts++;
        this.config.wrongAttempts = this.state.wrongAttempts;
        if (n > 0) {
          this.hearts();
          this.update();
          this.fb(this.isCircuit(q) ? '❌ ถูก ' + correct + '/' + total + ' ตำแหน่ง เหลืออีก ' + n + ' หัวใจ แต่ยังไม่บอกว่าช่องใดผิด' : '❌ ยังไม่ถูก เหลืออีก ' + n + ' หัวใจ ลองอีกครั้ง', 'bad');
        } else {
          this.state.failed[q.id] = true;
          this.state.revealed[q.id] = true;
          this.state.completed[q.id] = true;
          this.score();
          this.render();
          this.fb('💔 หัวใจหมด ข้อนี้ได้ 0 คะแนน กำลังแสดงคำตอบที่ถูกและเปลี่ยนข้อ', 'bad');
          this.autoNext();
        }
      }
      this.change();
      return { ok: ok, correctSlots: correct, totalSlots: total, completed: this.done(), heartsRemaining: this.state.heartsRemaining[q.id], score: this.getScore() };
    },

    checkOne: function () { return this.checkCurrent(); },
    checkAll: function () { return this.checkCurrent(); },
    autoNext: function () { var self = this; this.stopTimer(); this.timer = setTimeout(function () { self.timer = null; if (self.state.currentIndex < TOTAL - 1) self.nextQuestion(true); else self.summary(); }, 2200); },
    stopTimer: function () { if (this.timer) { clearTimeout(this.timer); this.timer = null; } },

    resolve: function () {
      var q = this.current();
      var done = this.done();
      var card = el('dcc-question-card');
      card.classList.toggle('is-solved', done && !!this.state.solved[q.id]);
      card.classList.toggle('is-failed', done && !!this.state.failed[q.id]);
      el('dcc-check-btn').disabled = done;
      el('dcc-clear-btn').disabled = done;
      el('dcc-next-btn').disabled = !done || this.complete();
      var correctIds = {};
      if (this.isCircuit(q)) { for (var i = 0; i < q.slots.length; i++) correctIds[q.slots[i].answer] = true; } else { correctIds[q.component] = true; }
      el(ROOT).querySelectorAll('.dcc-option').forEach(function (option) { option.classList.toggle('is-locked', done); option.draggable = !done; option.classList.toggle('is-correct', done && !!correctIds[option.dataset.componentId]); });
    },

    done: function () { return !!this.state.completed[this.state.currentQuestionId]; },
    complete: function () { return this.completedCount() >= TOTAL; },
    clearCurrent: function () { if (this.done()) return; delete this.state.answers[this.state.currentQuestionId]; this.state.selectedOption = null; this.render(); this.fb('ล้างคำตอบของข้อนี้แล้ว', ''); this.change(); },

    nextQuestion: function (force) {
      if (!force && !this.done()) { this.fb('ต้องตอบให้ถูกหรือใช้หัวใจครบก่อนจึงเปลี่ยนข้อได้', 'bad'); return false; }
      if (this.state.currentIndex >= TOTAL - 1) { this.summary(); return false; }
      this.stopTimer();
      this.state.currentIndex++;
      this.state.currentQuestionId = this.state.questionOrder[this.state.currentIndex];
      this.state.selectedOption = null;
      this.render();
      this.fb('ข้อที่ ' + (this.state.currentIndex + 1) + ': ตรวจชนิดโจทย์และวางคำตอบให้ครบ', '');
      this.change();
      return true;
    },

    summary: function () {
      this.stopTimer();
      this.update();
      var self = this;
      var failed = Object.keys(this.state.failed).filter(function (id) { return !!self.state.failed[id]; }).length;
      this.fb('🏁 ทำครบ ' + TOTAL + ' ข้อแล้ว คะแนน ' + this.getScore() + '/' + TOTAL + ' · ตอบถูก ' + this.solvedCount() + ' ข้อ · หัวใจหมด ' + failed + ' ข้อ', this.getScore() === TOTAL ? 'good' : '');
      this.change();
    },

    resetAll: function () { if (window.confirm('เริ่มใหม่ทั้งหมดและสุ่มชุดโจทย์ 25 ข้อใหม่?')) this.make(Date.now() + Math.floor(Math.random() * 100000)); },
    completedCount: function () { var self = this; return Object.keys(this.state.completed).filter(function (id) { return !!self.state.completed[id]; }).length; },
    solvedCount: function () { var self = this; return Object.keys(this.state.solved).filter(function (id) { return !!self.state.solved[id]; }).length; },
    score: function () { var total = 0; var scores = this.state.scores; Object.keys(scores).forEach(function (id) { total += Number(scores[id] || 0); }); this.state.score = total; return total; },
    getScore: function () { return Number(this.state.score || 0); },
    getPercent: function () { return Math.round(this.completedCount() / TOTAL * 100); },

    update: function () {
      var completed = this.completedCount();
      var percent = this.getPercent();
      this.config.currentStep = completed;
      el('dcc-progress-bar').style.width = percent + '%';
      el('dcc-progress-text').textContent = 'ความคืบหน้า / Progress: ' + completed + '/' + TOTAL;
      el('dcc-percent-text').textContent = percent + '%';
      el('dcc-score-text').textContent = this.getScore() + '/' + TOTAL;
      el('dcc-question-counter').textContent = (this.state.currentIndex + 1) + '/' + TOTAL;
      el('dcc-question-number').textContent = String(this.state.currentIndex + 1);
    },

    fb: function (message, tone) { this.state.feedback = String(message || ''); var box = el('dcc-feedback'); if (!box) return; box.className = 'dcc-feedback show' + (tone ? ' ' + tone : ''); box.textContent = this.state.feedback; },
    change: function () { try { document.dispatchEvent(new CustomEvent('examate-lab-change', { detail: { labType: this.labType, version: this.version, percent: this.getPercent(), score: this.getScore() } })); } catch (error) {} },

    getSavePayload: function () {
      return {
        type: 'LAB', labType: this.labType, version: this.version, quizVersion: this.version, bankVersion: this.bankVersion,
        currentStep: this.config.currentStep, totalSteps: TOTAL, percent: this.getPercent(), score: this.getScore(), maxScore: TOTAL,
        wrongAttempts: this.state.wrongAttempts, seed: this.state.seed, currentIndex: this.state.currentIndex, currentQuestionId: this.state.currentQuestionId,
        selectedQuestionIds: cp(this.state.selectedQuestionIds), questionOrder: cp(this.state.questionOrder), optionOrders: cp(this.state.optionOrders),
        selectedOption: this.state.selectedOption, answers: cp(this.state.answers), solved: cp(this.state.solved), failed: cp(this.state.failed), revealed: cp(this.state.revealed),
        completed: cp(this.state.completed), checked: cp(this.state.checked), scores: cp(this.state.scores), heartsRemaining: cp(this.state.heartsRemaining),
        attemptsByQuestion: cp(this.state.attemptsByQuestion), feedback: this.state.feedback, savedAt: new Date().toISOString()
      };
    },

    restore: function (data) {
      data = parse(data);
      if (!data) return false;
      var order = Array.isArray(data.questionOrder) ? data.questionOrder : [];
      var valid = order.length === TOTAL && order.every(function (id) { return !!find(id); });
      if (!valid) {
        this.make(data.seed || Date.now());
        this.fb('ℹ️ สถานะจากฐานเก่าไม่ตรงกับชุดสุ่ม 25 ข้อ จึงเริ่มชุดใหม่', '');
        return true;
      }
      this.stopTimer();
      var state = blank();
      state.seed = sd(data.seed);
      state.questionOrder = order.slice();
      state.selectedQuestionIds = Array.isArray(data.selectedQuestionIds) ? data.selectedQuestionIds.slice() : order.slice();
      state.currentIndex = Math.max(0, Math.min(TOTAL - 1, Math.floor(Number(data.currentIndex) || 0)));
      state.currentQuestionId = order[state.currentIndex];
      state.optionOrders = data.optionOrders && typeof data.optionOrders === 'object' ? cp(data.optionOrders) : {};
      for (var i = 0; i < TOTAL; i++) {
        var q = find(order[i]);
        if (!Array.isArray(state.optionOrders[q.id]) || state.optionOrders[q.id].length !== 4) state.optionOrders[q.id] = sh(q.choices, rnd(state.seed ^ hash(q.id)));
      }
      state.selectedOption = data.selectedOption || null;
      state.answers = data.answers && typeof data.answers === 'object' ? cp(data.answers) : {};
      state.solved = data.solved && typeof data.solved === 'object' ? cp(data.solved) : {};
      state.failed = data.failed && typeof data.failed === 'object' ? cp(data.failed) : {};
      state.revealed = data.revealed && typeof data.revealed === 'object' ? cp(data.revealed) : {};
      state.completed = data.completed && typeof data.completed === 'object' ? cp(data.completed) : {};
      state.checked = data.checked && typeof data.checked === 'object' ? cp(data.checked) : {};
      state.scores = data.scores && typeof data.scores === 'object' ? cp(data.scores) : {};
      state.heartsRemaining = data.heartsRemaining && typeof data.heartsRemaining === 'object' ? cp(data.heartsRemaining) : {};
      state.attemptsByQuestion = data.attemptsByQuestion && typeof data.attemptsByQuestion === 'object' ? cp(data.attemptsByQuestion) : {};
      state.wrongAttempts = Number(data.wrongAttempts || 0);
      state.feedback = String(data.feedback || '');
      for (var j = 0; j < TOTAL; j++) {
        if (typeof state.heartsRemaining[order[j]] !== 'number') state.heartsRemaining[order[j]] = 2;
        state.heartsRemaining[order[j]] = Math.max(0, Math.min(2, Number(state.heartsRemaining[order[j]]) || 0));
        if (typeof state.scores[order[j]] !== 'number') state.scores[order[j]] = 0;
        state.scores[order[j]] = state.scores[order[j]] === 1 ? 1 : 0;
      }
      this.state = state;
      this.config.wrongAttempts = state.wrongAttempts;
      this.score();
      this.render();
      if (this.complete()) this.summary();
      else {
        this.fb('✅ โหลดสถานะกลับมาแล้ว ทำต่อจากข้อเดิมได้เลย', 'good');
        if (state.failed[state.currentQuestionId] && state.currentIndex < TOTAL - 1) this.autoNext();
      }
      return true;
    }
  };

  var labApi = window.ExamateLab;
  labApi.init();

  // Cloud restore may arrive several seconds after this Lab script has loaded.
  // Keep a lightweight receiver alive while this exact Lab instance is active.
  function consumePendingSave() {
    if (window.ExamateLab !== labApi || !el(ROOT)) return false;

    var pending = parse(window.pendingLabSave);
    if (!pending) return false;

    // Do not let this Lab consume a save that belongs to another Lab engine.
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
    var incoming = detail && detail.data ? detail.data : null;
    if (incoming) window.pendingLabSave = incoming;
    consumePendingSave();
  }

  consumePendingSave();
  setTimeout(consumePendingSave, 250);
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