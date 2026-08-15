const DATA_URL = './data/tcas-programs.json';
const STORAGE_KEY = 'kru-nix-tcas-learning-plan-v1';
const ROUND_URL = 'https://my-tcas.s3.ap-southeast-1.amazonaws.com/mytcas/rounds/';
const ROUND_REQUEST_TIMEOUT = 15000;
const roundRequests = new Map();

const state = {
  rows: [],
  fields: [],
  groups: [],
  programsByField: new Map(),
  programById: new Map(),
  choices: [null, null, null, null],
  targets: [],
  activeRank: 0,
  pickerRank: 0,
  universityQuery: '',
  typeFilter: ''
};

const els = {};

document.addEventListener('DOMContentLoaded', init);
window.addEventListener('message', handleLmsRoundResponse);

async function init() {
  cacheElements();
  bindEvents();
  restorePlan();
  renderChoices();
  renderTargets();

  try {
    const response = await fetch(DATA_URL, { cache: 'force-cache' });
    if (!response.ok) throw new Error(`โหลดฐานข้อมูลไม่สำเร็จ (${response.status})`);
    state.rows = await response.json();
    buildIndexes();
    renderChoices();
    updateDataStatus();
  } catch (error) {
    showDataError(error);
  }
}

function cacheElements() {
  [
    'data-status', 'choice-grid', 'choice-template', 'selection-summary',
    'explore-button', 'clear-plan', 'target-section', 'target-list',
    'results-section', 'results-subtitle', 'results-count', 'rank-tabs',
    'university-search', 'program-type-filter', 'university-list', 'empty-state',
    'field-dialog', 'picker-rank-label', 'field-search', 'group-filter', 'field-list',
    'program-dialog', 'program-title', 'program-content', 'close-program'
  ].forEach(id => { els[toCamel(id)] = document.getElementById(id); });
}

function bindEvents() {
  els.exploreButton.addEventListener('click', explorePrograms);
  els.clearPlan.addEventListener('click', clearPlan);
  els.fieldSearch.addEventListener('input', renderFieldOptions);
  els.groupFilter.addEventListener('change', renderFieldOptions);
  els.universitySearch.addEventListener('input', event => {
    state.universityQuery = event.target.value.trim();
    renderUniversityResults();
  });
  els.programTypeFilter.addEventListener('change', event => {
    state.typeFilter = event.target.value;
    renderUniversityResults();
  });
  els.closeProgram.addEventListener('click', () => els.programDialog.close());
  els.programDialog.addEventListener('click', event => {
    if (event.target === els.programDialog) els.programDialog.close();
  });
  els.fieldDialog.addEventListener('click', event => {
    if (event.target === els.fieldDialog) els.fieldDialog.close();
  });
}

function buildIndexes() {
  const groupMap = new Map();
  const fieldMap = new Map();

  state.rows.forEach(row => {
    if (!row || !row.program_id) return;
    const fieldKey = makeFieldKey(row);
    const groupId = String(row.group_field_id || 'other');

    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, {
        id: groupId,
        nameTh: cleanText(row.group_field_th) || 'กลุ่มอื่น ๆ',
        count: 0
      });
    }
    groupMap.get(groupId).count += 1;

    if (!fieldMap.has(fieldKey)) {
      fieldMap.set(fieldKey, {
        key: fieldKey,
        groupId,
        fieldId: String(row.field_id || ''),
        nameTh: cleanText(row.field_name_th) || cleanText(row.field_name_en) || 'ไม่ระบุสาขา',
        nameEn: cleanText(row.field_name_en),
        groupTh: cleanText(row.group_field_th) || 'กลุ่มอื่น ๆ',
        count: 0
      });
    }
    fieldMap.get(fieldKey).count += 1;

    if (!state.programsByField.has(fieldKey)) state.programsByField.set(fieldKey, []);
    state.programsByField.get(fieldKey).push(row);

    if (!state.programById.has(String(row.program_id))) {
      state.programById.set(String(row.program_id), row);
    }
  });

  state.groups = [...groupMap.values()].sort(sortThaiBy('nameTh'));
  state.fields = [...fieldMap.values()].sort((a, b) => {
    const groupOrder = a.groupTh.localeCompare(b.groupTh, 'th');
    return groupOrder || a.nameTh.localeCompare(b.nameTh, 'th');
  });

  populateGroupFilter();
  sanitizeRestoredPlan();
  populateProgramTypeFilter();
}

function populateGroupFilter() {
  const current = els.groupFilter.value;
  els.groupFilter.replaceChildren(new Option('ทุกกลุ่มสาขา', ''));
  state.groups.forEach(group => {
    els.groupFilter.add(new Option(`${shorten(group.nameTh, 82)} (${group.count.toLocaleString('th-TH')})`, group.id));
  });
  els.groupFilter.value = current;
}

function populateProgramTypeFilter() {
  const types = new Map();
  state.rows.forEach(row => {
    const id = String(row.program_type_id || '');
    const name = cleanText(row.program_type_name_th) || id;
    if (id && name) types.set(id, name);
  });
  [...types.entries()].sort((a, b) => a[1].localeCompare(b[1], 'th')).forEach(([id, name]) => {
    els.programTypeFilter.add(new Option(name, id));
  });
}

function renderChoices() {
  els.choiceGrid.replaceChildren();
  state.choices.forEach((choice, rank) => {
    const fragment = els.choiceTemplate.content.cloneNode(true);
    const card = fragment.querySelector('.choice-card');
    const rankBadge = fragment.querySelector('.rank-badge');
    const kicker = fragment.querySelector('.choice-kicker');
    const title = fragment.querySelector('.choice-title');
    const group = fragment.querySelector('.choice-group');
    const button = fragment.querySelector('.choice-button');

    rankBadge.textContent = rank + 1;
    kicker.textContent = `อันดับ ${rank + 1} · RANK ${rank + 1}`;
    button.dataset.rank = rank;
    button.addEventListener('click', () => openFieldPicker(rank));

    if (choice) {
      card.classList.add('has-value');
      title.textContent = choice.nameTh;
      group.textContent = choice.groupTh;
      button.textContent = 'เปลี่ยน';
    } else {
      title.textContent = 'เลือกสาขา';
      group.textContent = rank === 0 ? 'เริ่มจากสาขาที่สนใจมากที่สุด' : 'ไม่บังคับให้เลือกครบ 4 อันดับ';
      button.textContent = 'เลือก';
    }

    els.choiceGrid.append(fragment);
  });

  const selectedCount = state.choices.filter(Boolean).length;
  els.selectionSummary.textContent = selectedCount
    ? `เลือกแล้ว ${selectedCount}/4 อันดับ · ระบบจะค้นหาหลักสูตรที่ตรงกับแต่ละสาขา`
    : 'ยังไม่ได้เลือกสาขา';
  els.exploreButton.disabled = !selectedCount || !state.rows.length;
}

function openFieldPicker(rank) {
  if (!state.fields.length) return;
  state.pickerRank = rank;
  els.pickerRankLabel.textContent = `อันดับ ${rank + 1}`;
  els.fieldSearch.value = '';
  els.groupFilter.value = state.choices[rank]?.groupId || '';
  renderFieldOptions();
  els.fieldDialog.showModal();
  setTimeout(() => els.fieldSearch.focus(), 80);
}

function renderFieldOptions() {
  const query = normalize(els.fieldSearch.value);
  const groupId = els.groupFilter.value;
  const selectedKeys = new Set(state.choices.filter(Boolean).map(item => item.key));

  const matches = state.fields.filter(field => {
    const matchesGroup = !groupId || field.groupId === groupId;
    const haystack = normalize(`${field.nameTh} ${field.nameEn} ${field.groupTh}`);
    return matchesGroup && (!query || haystack.includes(query));
  });

  els.fieldList.replaceChildren();
  matches.slice(0, 160).forEach(field => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'field-option';
    button.disabled = selectedKeys.has(field.key) && state.choices[state.pickerRank]?.key !== field.key;
    button.innerHTML = `
      <span>
        <strong>${escapeHtml(field.nameTh)}</strong>
        <small>${escapeHtml(field.nameEn || field.groupTh)} · ${escapeHtml(shorten(field.groupTh, 72))}</small>
      </span>
      <span class="option-count">${field.count.toLocaleString('th-TH')} รายการ</span>
    `;
    button.addEventListener('click', () => selectField(field));
    els.fieldList.append(button);
  });

  if (!matches.length) {
    const message = document.createElement('div');
    message.className = 'empty-state';
    message.innerHTML = '<span>🔎</span><strong>ไม่พบชื่อสาขานี้</strong><p>ลองใช้คำค้นที่สั้นลงหรือเปลี่ยนกลุ่มสาขา</p>';
    els.fieldList.append(message);
  }
}

function selectField(field) {
  state.choices[state.pickerRank] = { ...field };
  state.activeRank = state.pickerRank;
  savePlan();
  renderChoices();
  els.fieldDialog.close();
  if (!els.resultsSection.classList.contains('is-hidden')) explorePrograms();
}

function clearPlan() {
  if (!state.choices.some(Boolean) && !state.targets.length) return;
  if (!window.confirm('ล้างสาขาและหลักสูตรเป้าหมายทั้งหมดหรือไม่?')) return;
  state.choices = [null, null, null, null];
  state.targets = [];
  state.activeRank = 0;
  savePlan();
  renderChoices();
  renderTargets();
  els.resultsSection.classList.add('is-hidden');
}

function explorePrograms() {
  const firstSelected = state.choices.findIndex(Boolean);
  if (firstSelected < 0) return;
  if (!state.choices[state.activeRank]) state.activeRank = firstSelected;
  state.universityQuery = '';
  state.typeFilter = '';
  els.universitySearch.value = '';
  els.programTypeFilter.value = '';
  renderRankTabs();
  renderUniversityResults();
  els.resultsSection.classList.remove('is-hidden');
  els.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function renderRankTabs() {
  els.rankTabs.replaceChildren();
  state.choices.forEach((choice, rank) => {
    if (!choice) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `rank-tab${rank === state.activeRank ? ' is-active' : ''}`;
    button.role = 'tab';
    button.ariaSelected = String(rank === state.activeRank);
    button.textContent = `${rank + 1}. ${choice.nameTh}`;
    button.addEventListener('click', () => {
      state.activeRank = rank;
      renderRankTabs();
      renderUniversityResults();
    });
    els.rankTabs.append(button);
  });
}

function renderUniversityResults() {
  const choice = state.choices[state.activeRank];
  if (!choice) return;
  const sourceRows = state.programsByField.get(choice.key) || [];
  const programMap = new Map();

  sourceRows.forEach(row => {
    const id = String(row.program_id);
    if (!programMap.has(id)) programMap.set(id, row);
  });

  let programs = [...programMap.values()];
  const query = normalize(state.universityQuery);
  if (query) {
    programs = programs.filter(row => normalize([
      row.university_name_th, row.university_name_en, row.campus_name_th,
      row.faculty_name_th, row.program_name_th, row.program_name_en
    ].join(' ')).includes(query));
  }
  if (state.typeFilter) {
    programs = programs.filter(row => String(row.program_type_id || '') === state.typeFilter);
  }

  const universityMap = new Map();
  programs.forEach(row => {
    const key = `${row.university_id}|${row.campus_id}`;
    if (!universityMap.has(key)) {
      universityMap.set(key, {
        key,
        nameTh: cleanText(row.university_name_th) || cleanText(row.university_name_en),
        nameEn: cleanText(row.university_name_en),
        campusTh: cleanText(row.campus_name_th),
        programs: []
      });
    }
    universityMap.get(key).programs.push(row);
  });

  const universities = [...universityMap.values()].sort(sortThaiBy('nameTh'));
  els.resultsSubtitle.textContent = `อันดับ ${state.activeRank + 1}: ${choice.nameTh}`;
  els.resultsCount.textContent = `${programs.length.toLocaleString('th-TH')} หลักสูตร · ${universities.length.toLocaleString('th-TH')} มหาวิทยาลัย/วิทยาเขต`;
  els.universityList.replaceChildren();
  els.emptyState.classList.toggle('is-hidden', universities.length > 0);

  universities.forEach(university => {
    const article = document.createElement('article');
    article.className = 'university-card';
    const programRows = university.programs.sort((a, b) => cleanText(a.program_name_th).localeCompare(cleanText(b.program_name_th), 'th'));
    article.innerHTML = `
      <button class="university-summary" type="button" aria-expanded="false">
        <span class="university-icon" aria-hidden="true">🎓</span>
        <span>
          <strong class="university-name">${escapeHtml(university.nameTh)}</strong>
          <small class="university-meta">${escapeHtml(university.campusTh || university.nameEn || 'วิทยาเขตหลัก')}</small>
        </span>
        <span class="program-count">${programRows.length} หลักสูตร</span>
      </button>
      <div class="program-list"></div>
    `;

    const summaryButton = article.querySelector('.university-summary');
    const list = article.querySelector('.program-list');
    summaryButton.addEventListener('click', () => {
      const isOpen = article.classList.toggle('is-open');
      summaryButton.setAttribute('aria-expanded', String(isOpen));
    });

    programRows.forEach(row => {
      const program = document.createElement('div');
      program.className = 'program-row';
      program.innerHTML = `
        <span>
          <strong>${escapeHtml(cleanText(row.program_name_th) || cleanText(row.program_name_en))}</strong>
          <small>${escapeHtml(cleanText(row.faculty_name_th))} · ${escapeHtml(cleanText(row.program_type_name_th) || 'ไม่ระบุประเภท')}</small>
        </span>
        <button class="detail-button" type="button">ดูรายละเอียด</button>
      `;
      program.querySelector('button').addEventListener('click', () => openProgram(row));
      list.append(program);
    });

    els.universityList.append(article);
  });
}

function openProgram(row) {
  const programId = String(row.program_id);
  const isTarget = state.targets.some(target => target.programId === programId);
  const acceptance = Number(row.major_acceptance_number) || Number(row.number_acceptance_mko2) || 0;
  const roundUrl = `${ROUND_URL}${encodeURIComponent(programId)}.json`;

  els.programTitle.textContent = cleanText(row.program_name_th) || 'รายละเอียดหลักสูตร';
  els.programContent.innerHTML = `
    <section class="program-hero">
      <h3>${escapeHtml(cleanText(row.program_name_th) || cleanText(row.program_name_en))}</h3>
      <p>${escapeHtml(cleanText(row.program_name_en))}</p>
      <p><strong>${escapeHtml(cleanText(row.university_name_th))}</strong> · ${escapeHtml(cleanText(row.campus_name_th))}</p>
      <p>${escapeHtml(cleanText(row.faculty_name_th))}</p>
      <div class="detail-grid">
        <div class="detail-cell"><small>รหัสหลักสูตร</small><strong>${escapeHtml(programId)}</strong></div>
        <div class="detail-cell"><small>ประเภทหลักสูตร</small><strong>${escapeHtml(cleanText(row.program_type_name_th) || '-')}</strong></div>
        <div class="detail-cell"><small>จำนวนรับระดับหลักสูตร</small><strong>${acceptance ? `${acceptance.toLocaleString('th-TH')} คน` : 'ไม่ระบุ'}</strong></div>
        <div class="detail-cell"><small>เงินเดือนมัธยฐาน</small><strong>${escapeHtml(cleanText(row.median_salary) === '0' ? 'ไม่ระบุ' : cleanText(row.median_salary))}</strong></div>
      </div>
    </section>
    <section class="detail-block">
      <h4>💰 ค่าเล่าเรียนโดยประมาณ</h4>
      <p>${escapeHtml(cleanZero(row.cost))}</p>
    </section>
    <section class="detail-block">
      <h4>📊 ข้อมูลประกอบการตัดสินใจ</h4>
      <p>อัตราจบ: ${escapeHtml(cleanZero(row.graduate_rate))}\nอัตราการมีงานทำ: ${escapeHtml(cleanZero(row.employment_rate))}</p>
    </section>
    <section class="detail-block">
      <h4>📅 รอบรับสมัครและเกณฑ์</h4>
      <div id="rounds-container" class="rounds-container" aria-live="polite">
        <div class="rounds-status"><span class="rounds-spinner" aria-hidden="true"></span>กำลังอ่านข้อมูลรอบจาก MyTCAS…</div>
      </div>
      <a class="round-source-link" href="${roundUrl}" target="_blank" rel="noopener">เปิดข้อมูลต้นทาง ↗</a>
    </section>
    <div class="program-actions">
      <button class="button ${isTarget ? 'button-danger' : 'button-success'}" id="toggle-target" type="button">
        ${isTarget ? 'นำออกจากเป้าหมาย' : '⭐ เพิ่มเป็นหลักสูตรเป้าหมาย'}
      </button>
      <button class="button button-ghost" id="close-program-secondary" type="button">ปิด</button>
    </div>
  `;

  els.programContent.querySelector('#toggle-target').addEventListener('click', () => {
    toggleTarget(row);
    els.programDialog.close();
  });
  els.programContent.querySelector('#close-program-secondary').addEventListener('click', () => els.programDialog.close());
  els.programDialog.showModal();
  loadProgramRounds(programId, roundUrl);
}

async function loadProgramRounds(programId, roundUrl) {
  const container = document.getElementById('rounds-container');
  if (!container) return;

  try {
    const payload = await requestRoundsFromLms(programId);
    if (!payload || payload.success === false) {
      throw new Error(payload?.message || 'ไม่สามารถอ่านข้อมูลรอบได้');
    }
    renderProgramRounds(container, Array.isArray(payload.rounds) ? payload.rounds : []);
  } catch (error) {
    const isEmbedded = window.parent !== window;
    container.innerHTML = `
      <div class="rounds-empty">
        <strong>${isEmbedded ? 'ยังโหลดข้อมูลรอบไม่สำเร็จ' : 'ข้อมูลรอบจะแสดงเมื่อเปิดผ่าน LMS'}</strong>
        <span>${escapeHtml(error?.message || 'กรุณาลองใหม่อีกครั้ง')}</span>
        ${isEmbedded ? '<button type="button" class="round-retry-button">ลองโหลดอีกครั้ง</button>' : ''}
      </div>
    `;
    const retry = container.querySelector('.round-retry-button');
    if (retry) retry.addEventListener('click', () => {
      container.innerHTML = '<div class="rounds-status"><span class="rounds-spinner" aria-hidden="true"></span>กำลังอ่านข้อมูลรอบจาก MyTCAS…</div>';
      loadProgramRounds(programId, roundUrl);
    });
  }
}

function requestRoundsFromLms(programId) {
  if (window.parent === window) {
    return Promise.reject(new Error('โปรดเปิดจากแท็บแผนการเรียนใน LMS'));
  }

  const requestId = `tcas-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      roundRequests.delete(requestId);
      reject(new Error('ใช้เวลาโหลดนานเกินไป กรุณาลองใหม่'));
    }, ROUND_REQUEST_TIMEOUT);

    roundRequests.set(requestId, { resolve, reject, timer });
    window.parent.postMessage({
      type: 'KRU_NIX_TCAS_ROUNDS_REQUEST',
      requestId,
      programId
    }, '*');
  });
}

function handleLmsRoundResponse(event) {
  if (event.source !== window.parent) return;
  const data = event.data || {};
  if (data.type !== 'KRU_NIX_TCAS_ROUNDS_RESPONSE' || !data.requestId) return;

  const pending = roundRequests.get(data.requestId);
  if (!pending) return;
  window.clearTimeout(pending.timer);
  roundRequests.delete(data.requestId);

  if (data.error) pending.reject(new Error(data.error));
  else pending.resolve(data.payload);
}

function renderProgramRounds(container, rounds) {
  if (!rounds.length) {
    container.innerHTML = `
      <div class="rounds-empty">
        <strong>ยังไม่พบข้อมูลรอบรับสมัคร</strong>
        <span>มหาวิทยาลัยอาจยังไม่ประกาศ หรือหลักสูตรนี้ไม่มีข้อมูลในปีปัจจุบัน</span>
      </div>
    `;
    return;
  }

  container.innerHTML = rounds.map((round, index) => {
    const scoreConditions = Object.entries(round.scoreConditions || {});
    const weights = Object.entries(round.scores || {});
    const detailParts = [round.description, round.condition].filter(Boolean);
    const folioText = round.folio?.criteria || '';
    const closedDate = formatThaiDate(round.folio?.closedDate);
    const link = safeExternalUrl(round.link);
    const seats = Number(round.receiveStudentNumber || 0);

    return `
      <article class="round-card">
        <header class="round-card-head">
          <div>
            <span class="round-badge">${escapeHtml(round.roundLabel || `รอบ ${index + 1}`)}</span>
            <h5>${escapeHtml(round.projectName || 'โครงการรับสมัคร')}</h5>
          </div>
          <div class="round-seat"><small>จำนวนรับ</small><strong>${seats > 0 ? `${seats.toLocaleString('th-TH')} คน` : 'ไม่ระบุ'}</strong></div>
        </header>
        ${closedDate ? `<p class="round-deadline">⏳ ปิดรับสมัคร ${escapeHtml(closedDate)}</p>` : ''}
        ${scoreConditions.length ? `
          <div class="round-subsection">
            <strong>เกณฑ์ขั้นต่ำ</strong>
            <div class="score-chip-list">${scoreConditions.map(([key, value]) => `<span>${escapeHtml(formatScoreName(key))} ≥ ${escapeHtml(value)}</span>`).join('')}</div>
          </div>
        ` : ''}
        ${weights.length ? `
          <div class="round-subsection">
            <strong>สัดส่วนคะแนน</strong>
            <div class="score-chip-list is-weight">${weights.map(([key, value]) => `<span>${escapeHtml(formatScoreName(key))} ${escapeHtml(value)}%</span>`).join('')}</div>
          </div>
        ` : ''}
        ${folioText ? `<details><summary>เกณฑ์แฟ้มสะสมผลงาน</summary><p>${formatMultiline(folioText)}</p></details>` : ''}
        ${detailParts.length ? `<details><summary>คุณสมบัติและเงื่อนไขเพิ่มเติม</summary><p>${formatMultiline(detailParts.join('\n\n'))}</p></details>` : ''}
        ${round.interviewDate || round.interviewLocation ? `<details><summary>ข้อมูลสัมภาษณ์</summary><p>${formatMultiline([round.interviewDate, round.interviewTime, round.interviewLocation].filter(Boolean).join('\n'))}</p></details>` : ''}
        ${link ? `<a class="round-apply-link" href="${escapeHtml(link)}" target="_blank" rel="noopener">ไปยังหน้ารับสมัคร ↗</a>` : ''}
      </article>
    `;
  }).join('');
}

function formatScoreName(key) {
  const raw = cleanText(key).replace(/^min_/, '');
  const known = {
    gpax: 'GPAX', total_score: 'คะแนนรวม', tgat: 'TGAT', tpat: 'TPAT',
    cal_type: 'รูปแบบคำนวณ', cal_score_sum: 'คะแนนรวมที่ใช้',
    cal_subject_name: 'วิชาเลือกคำนวณ', subject_names: 'รายวิชา', score_minimum: 'คะแนนขั้นต่ำ'
  };
  if (known[raw]) return known[raw];
  if (/^a_lv_/.test(raw)) return `A-Level ${raw.replace('a_lv_', '')}`;
  if (/^tgat_/.test(raw)) return `TGAT ${raw.replace('tgat_', '')}`;
  if (/^tpat_/.test(raw)) return `TPAT ${raw.replace('tpat_', '')}`;
  return raw.replaceAll('_', ' ').toUpperCase();
}

function formatThaiDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return cleanText(value);
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'long' }).format(date);
}

function safeExternalUrl(value) {
  const text = cleanText(value);
  if (!text) return '';
  const candidate = /^www\./i.test(text) ? `https://${text}` : text;
  try {
    const url = new URL(candidate);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (_) {
    return '';
  }
}

function formatMultiline(value) {
  return escapeHtml(shorten(value, 7000)).replace(/\n/g, '<br>');
}

function toggleTarget(row) {
  const programId = String(row.program_id);
  const index = state.targets.findIndex(target => target.programId === programId);
  if (index >= 0) {
    state.targets.splice(index, 1);
  } else {
    state.targets.push({
      programId,
      rank: state.activeRank,
      programName: cleanText(row.program_name_th) || cleanText(row.program_name_en),
      universityName: cleanText(row.university_name_th) || cleanText(row.university_name_en)
    });
  }
  savePlan();
  renderTargets();
}

function renderTargets() {
  els.targetSection.classList.toggle('is-hidden', !state.targets.length);
  els.targetList.replaceChildren();
  state.targets.forEach(target => {
    const pill = document.createElement('div');
    pill.className = 'target-pill';
    pill.innerHTML = `<span>⭐ <strong>${escapeHtml(target.universityName)}</strong> · ${escapeHtml(target.programName)}</span><button type="button" aria-label="ลบเป้าหมาย">×</button>`;
    pill.querySelector('button').addEventListener('click', () => {
      state.targets = state.targets.filter(item => item.programId !== target.programId);
      savePlan();
      renderTargets();
    });
    els.targetList.append(pill);
  });
}

function updateDataStatus() {
  const universities = new Set(state.rows.map(row => row.university_id)).size;
  const programs = new Set(state.rows.map(row => row.program_id)).size;
  els.dataStatus.innerHTML = `
    <span class="status-dot"></span>
    <div>
      <strong>ฐานข้อมูลพร้อมใช้งาน</strong>
      <small>${universities.toLocaleString('th-TH')} มหาวิทยาลัย · ${programs.toLocaleString('th-TH')} หลักสูตร · ${state.fields.length.toLocaleString('th-TH')} หมวดสาขา</small>
    </div>
  `;
}

function showDataError(error) {
  els.dataStatus.innerHTML = `
    <span class="status-dot is-error"></span>
    <div><strong>เปิดฐานข้อมูลไม่สำเร็จ</strong><small>${escapeHtml(error.message || String(error))}</small></div>
  `;
}

function restorePlan() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return;
    if (Array.isArray(saved.choices)) state.choices = [...saved.choices.slice(0, 4), null, null, null, null].slice(0, 4);
    if (Array.isArray(saved.targets)) state.targets = saved.targets.slice(0, 30);
  } catch (_) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function sanitizeRestoredPlan() {
  const validFields = new Map(state.fields.map(field => [field.key, field]));
  state.choices = state.choices.map(choice => choice?.key && validFields.has(choice.key) ? { ...validFields.get(choice.key) } : null);
  state.targets = state.targets.filter(target => target?.programId && state.programById.has(String(target.programId)));
  savePlan();
  renderTargets();
}

function savePlan() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    version: 1,
    choices: state.choices,
    targets: state.targets,
    updatedAt: new Date().toISOString()
  }));
}

function makeFieldKey(row) {
  return `${String(row.group_field_id || 'other')}_${String(row.field_id || 'unknown')}`;
}

function cleanText(value) {
  return value == null ? '' : String(value).trim();
}

function cleanZero(value) {
  const text = cleanText(value);
  return !text || text === '0' ? 'ไม่ระบุในฐานข้อมูล' : text;
}

function normalize(value) {
  return cleanText(value).toLocaleLowerCase('th').replace(/\s+/g, ' ');
}

function shorten(value, max) {
  const text = cleanText(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function sortThaiBy(property) {
  return (a, b) => cleanText(a[property]).localeCompare(cleanText(b[property]), 'th');
}

function toCamel(value) {
  return value.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

function escapeHtml(value) {
  return cleanText(value).replace(/[&<>'"]/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  })[char]);
}
