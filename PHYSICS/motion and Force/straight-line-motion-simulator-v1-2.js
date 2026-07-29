(function () {
  'use strict';

  var lab = window.ExamateLab;
  var root = document.getElementById('straight-line-motion-root');
  if (!lab || !root || lab.labType !== 'STRAIGHT_LINE_MOTION_SIMULATOR') return;
  if (root.dataset.slmV12 === '1') return;
  root.dataset.slmV12 = '1';

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function number(value, fallback) {
    value = Number(value);
    return Number.isFinite(value) ? value : (fallback == null ? 0 : fallback);
  }

  function round(value) {
    return Math.round((number(value) + Number.EPSILON) * 100) / 100;
  }

  function fmt(value, signed) {
    value = round(value);
    if (!Number.isFinite(value)) return '?';
    return (signed && value > 0 ? '+' : '') + String(value);
  }

  function targetSymbol(s) {
    var map = {
      speed: 'speed', distance: 'd', time: 't', velocity: 'v', displacement: 'Δx',
      xf: 'x', dx: 'Δx', a: 'a', v: 'v', u: 'u'
    };
    return map[s.target] || s.target || '?';
  }

  function targetUnit(s) {
    return s.unit || '';
  }

  function displayCards(s) {
    var cards = [];
    (s.givens || []).forEach(function (g) {
      cards.push({
        symbol: g.symbol,
        value: String(g.value),
        unit: g.unit || '',
        isTarget: false
      });
    });
    cards.push({
      symbol: targetSymbol(s),
      value: '?',
      unit: targetUnit(s),
      isTarget: true
    });
    return cards;
  }

  function objectSvg(type) {
    if (type === 'train') {
      return '<g class="slm-v12-object">' +
        '<rect x="-52" y="-32" width="104" height="43" rx="10" fill="#60a5fa" stroke="#172033" stroke-width="3"/>' +
        '<rect x="-38" y="-23" width="26" height="18" rx="4" fill="#dbeafe" stroke="#1e3a8a" stroke-width="2"/>' +
        '<rect x="-3" y="-23" width="26" height="18" rx="4" fill="#dbeafe" stroke="#1e3a8a" stroke-width="2"/>' +
        '<path d="M52-25 L70-10 L52 11Z" fill="#3b82f6" stroke="#172033" stroke-width="3"/>' +
        '<circle cx="-31" cy="15" r="10" fill="#172033"/><circle cx="31" cy="15" r="10" fill="#172033"/>' +
        '<circle cx="-31" cy="15" r="4" fill="#cbd5e1"/><circle cx="31" cy="15" r="4" fill="#cbd5e1"/>' +
        '</g>';
    }
    if (type === 'runner') {
      return '<g class="slm-v12-object" fill="none" stroke="#172033" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="0" cy="-38" r="11" fill="#f59e0b" stroke-width="3"/>' +
        '<path d="M0-26 L-8 8 L17 28 M-5-5 L-31 12 M-5-5 L24-15 M-8 8 L-33 35"/>' +
        '<path d="M-4-23 L12-8" stroke="#2563eb" stroke-width="10"/>' +
        '</g>';
    }
    return '<g class="slm-v12-object">' +
      '<rect x="-42" y="-29" width="84" height="32" rx="9" fill="#60a5fa" stroke="#172033" stroke-width="3"/>' +
      '<path d="M-25-29 L-9-50 H23 L37-29" fill="#dbeafe" stroke="#172033" stroke-width="3"/>' +
      '<circle cx="-26" cy="9" r="12" fill="#172033"/><circle cx="27" cy="9" r="12" fill="#172033"/>' +
      '<circle cx="-26" cy="9" r="4" fill="#cbd5e1"/><circle cx="27" cy="9" r="4" fill="#cbd5e1"/>' +
      '</g>';
  }

  function badgeRow(cards) {
    var count = Math.max(1, cards.length);
    var gap = 12;
    var left = 50;
    var totalWidth = 700;
    var width = (totalWidth - gap * (count - 1)) / count;
    return cards.map(function (card, index) {
      var x = left + index * (width + gap);
      var cls = card.isTarget ? ' target' : '';
      var value = card.value + (card.unit ? ' ' + card.unit : '');
      return '<g class="slm-v12-badge' + cls + '">' +
        '<rect x="' + x + '" y="24" width="' + width + '" height="62" rx="15"/>' +
        '<text x="' + (x + width / 2) + '" y="50" text-anchor="middle" class="symbol">' + esc(card.symbol) + '</text>' +
        '<text x="' + (x + width / 2) + '" y="73" text-anchor="middle" class="value">' + esc(value) + '</text>' +
        '</g>';
    }).join('');
  }

  function motionVisual(s) {
    var m = s.motion || {};
    var x0 = number(m.x0, 0);
    var xf = number(m.xf, x0 + number(m.dx, 0));
    var u = number(m.u, 0);
    var a = number(m.a, 0);
    var duration = Math.max(0, number(m.t, 0));
    var turnTime = null;
    var turnPosition = null;

    if (Math.abs(a) > 1e-9 && duration > 0) {
      var candidate = -u / a;
      if (candidate > 1e-6 && candidate < duration - 1e-6) {
        turnTime = candidate;
        turnPosition = x0 + u * candidate + 0.5 * a * candidate * candidate;
      }
    }

    var values = [x0, xf];
    if (turnPosition != null) values.push(turnPosition);
    var min = Math.min.apply(Math, values);
    var max = Math.max.apply(Math, values);
    var span = Math.max(8, max - min);
    min -= Math.max(3, span * 0.16);
    max += Math.max(3, span * 0.16);

    function mapX(position) {
      return 90 + (position - min) / (max - min) * 620;
    }

    var startX = mapX(x0);
    var endX = mapX(xf);
    var turnX = turnPosition == null ? null : mapX(turnPosition);
    var movementValues;
    var keyTimes;
    if (turnX != null) {
      movementValues = startX + ' 235;' + turnX + ' 235;' + endX + ' 235;' + endX + ' 235;' + startX + ' 235';
      keyTimes = '0;0.42;0.68;0.82;1';
    } else {
      movementValues = startX + ' 235;' + endX + ' 235;' + endX + ' 235;' + startX + ' 235';
      keyTimes = '0;0.58;0.78;1';
    }

    var startLabel = 'Start x = ' + fmt(x0, true) + ' m';
    var endLabel = 'End';
    var givenSymbols = {};
    (s.givens || []).forEach(function (g) { givenSymbols[g.symbol] = true; });
    if (givenSymbols.x) endLabel = 'End x = ' + fmt(xf, true) + ' m';
    else if (givenSymbols['Δx']) endLabel = 'End · Δx = ' + fmt(number(m.dx), true) + ' m';
    else if (s.target === 'xf') endLabel = 'End x = ?';
    else if (s.target === 'dx' || s.target === 'displacement') endLabel = 'End · Δx = ?';

    var turning = '';
    if (turnX != null) {
      turning = '<line x1="' + turnX + '" y1="182" x2="' + turnX + '" y2="273" class="turn-line"/>' +
        '<circle cx="' + turnX + '" cy="205" r="7" class="turn-dot"/>' +
        '<text x="' + turnX + '" y="169" text-anchor="middle" class="turn-text">หยุดชั่วขณะแล้วกลับทิศ / Turns</text>';
    }

    return '<svg class="slm-v12-svg" viewBox="0 0 800 350" role="img" aria-label="Accurate straight-line motion diagram">' +
      '<defs>' +
        '<marker id="slm-v12-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="#2563eb"/></marker>' +
      '</defs>' +
      badgeRow(displayCards(s)) +
      '<rect x="35" y="214" width="730" height="63" rx="24" class="road"/>' +
      '<line x1="70" y1="246" x2="730" y2="246" class="road-mark"/>' +
      '<line x1="90" y1="311" x2="710" y2="311" class="positive-axis" marker-end="url(#slm-v12-arrow)"/>' +
      '<text x="400" y="338" text-anchor="middle" class="axis-text">ทิศบวก / Positive direction</text>' +
      '<line x1="' + startX + '" y1="195" x2="' + endX + '" y2="195" class="net-arrow" marker-end="url(#slm-v12-arrow)"/>' +
      '<circle cx="' + startX + '" cy="195" r="6" class="start-dot"/>' +
      '<text x="' + startX + '" y="184" text-anchor="middle" class="point-text">' + esc(startLabel) + '</text>' +
      '<text x="' + endX + '" y="292" text-anchor="middle" class="point-text">' + esc(endLabel) + '</text>' +
      turning +
      '<g transform="translate(' + startX + ' 235)">' + objectSvg(s.object) +
        '<animateTransform attributeName="transform" type="translate" values="' + movementValues + '" keyTimes="' + keyTimes + '" dur="5.2s" repeatCount="indefinite"/>' +
      '</g>' +
      '<text x="400" y="122" text-anchor="middle" class="motion-note">ภาพแสดงทิศและการกลับทิศตามเครื่องหมายของปริมาณ / The motion follows the signs</text>' +
      '</svg>';
  }

  function refreshVisual() {
    var s = typeof lab.current === 'function' ? lab.current() : null;
    var visual = document.getElementById('slm-motion-visual');
    if (!s || !visual || (typeof lab.getScore === 'function' && lab.getScore() >= 25)) return;
    visual.innerHTML = motionVisual(s);
  }

  var style = document.createElement('style');
  style.id = 'slm-v12-style';
  style.textContent =
    '#straight-line-motion-root .slm-v12-svg{width:100%;height:auto;max-height:440px;display:block}' +
    '#straight-line-motion-root .slm-v12-svg text{font-family:K2D,sans-serif}' +
    '#straight-line-motion-root .slm-v12-badge rect{fill:#fff;stroke:#bfdbfe;stroke-width:2}' +
    '#straight-line-motion-root .slm-v12-badge.target rect{fill:#fff7ed;stroke:#fb923c;stroke-width:3;stroke-dasharray:7 5}' +
    '#straight-line-motion-root .slm-v12-badge .symbol{font-size:17px;font-weight:1000;fill:#334155}' +
    '#straight-line-motion-root .slm-v12-badge .value{font-size:16px;font-weight:900;fill:#1d4ed8}' +
    '#straight-line-motion-root .slm-v12-badge.target .value{font-size:22px;fill:#c2410c}' +
    '#straight-line-motion-root .slm-v12-svg .road{fill:#dbeafe;stroke:#60a5fa;stroke-width:2}' +
    '#straight-line-motion-root .slm-v12-svg .road-mark{stroke:#fff;stroke-width:5;stroke-dasharray:25 18}' +
    '#straight-line-motion-root .slm-v12-svg .positive-axis{stroke:#2563eb;stroke-width:4}' +
    '#straight-line-motion-root .slm-v12-svg .axis-text{font-size:18px;font-weight:1000;fill:#1d4ed8}' +
    '#straight-line-motion-root .slm-v12-svg .net-arrow{stroke:#0f766e;stroke-width:5}' +
    '#straight-line-motion-root .slm-v12-svg .start-dot{fill:#0f766e}' +
    '#straight-line-motion-root .slm-v12-svg .point-text{font-size:14px;font-weight:900;fill:#334155}' +
    '#straight-line-motion-root .slm-v12-svg .turn-line{stroke:#f59e0b;stroke-width:3;stroke-dasharray:7 6}' +
    '#straight-line-motion-root .slm-v12-svg .turn-dot{fill:#f59e0b;stroke:#92400e;stroke-width:2}' +
    '#straight-line-motion-root .slm-v12-svg .turn-text{font-size:14px;font-weight:1000;fill:#92400e}' +
    '#straight-line-motion-root .slm-v12-svg .motion-note{font-size:16px;font-weight:900;fill:#0f2f75}' +
    '@media(max-width:520px){#straight-line-motion-root .slm-v12-badge .symbol{font-size:14px}#straight-line-motion-root .slm-v12-badge .value{font-size:13px}#straight-line-motion-root .slm-v12-svg .point-text{font-size:12px}#straight-line-motion-root .slm-v12-svg .motion-note{font-size:13px}}';
  root.appendChild(style);

  var originalRender = lab.render;
  lab.render = function () {
    var result = originalRender.apply(this, arguments);
    refreshVisual();
    return result;
  };

  lab.version = '1.2.0';
  root.dataset.slmVersion = lab.version;
  var kicker = root.querySelector('.slm-kicker');
  if (kicker) kicker.textContent = '🚗 STRAIGHT-LINE MOTION · V1.2 · TARGET 25 POINTS';
  refreshVisual();

  try {
    document.dispatchEvent(new CustomEvent('examate-lab-ready', {
      detail: { labType: lab.labType, version: lab.version }
    }));
  } catch (error) {}
})();
