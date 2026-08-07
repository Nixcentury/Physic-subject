/*
 * Examate Bridge for GitHub Pages
 * ใช้บน GitHub Pages เพื่อคุยกับ Apps Script backend
 */
(function () {
  const DEFAULTS = {
    appUrl: '',
    tokenKey: 'examate_api_token',
    userKey: 'examate_api_user',
    autoSaveDelayMs: 900,
    autoSaveIntervalMs: 20000
  };

  const state = {
    appUrl: '',
    quizId: '',
    saveTimer: null,
    attached: false
  };

  function configure(options) {
    options = options || {};
    state.appUrl = options.appUrl || state.appUrl || window.EXAMATE_API_URL || '';
    state.quizId = options.quizId || state.quizId || guessQuizId();
    return api;
  }

  function guessQuizId() {
    const meta = document.querySelector('meta[name="examate-quiz-id"]');
    if (meta && meta.content) return meta.content.trim();
    const file = decodeURIComponent(location.pathname.split('/').pop() || '').replace(/\.html?$/i, '');
    return file || document.title || 'unknown-quiz';
  }

  function getToken() {
    return sessionStorage.getItem(DEFAULTS.tokenKey) || localStorage.getItem(DEFAULTS.tokenKey) || '';
  }

  function getUser() {
    try {
      return JSON.parse(sessionStorage.getItem(DEFAULTS.userKey) || localStorage.getItem(DEFAULTS.userKey) || 'null');
    } catch (err) {
      return null;
    }
  }

  function setSession(data, remember) {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(DEFAULTS.tokenKey, data.token);
    storage.setItem(DEFAULTS.userKey, JSON.stringify({
      studentID: data.studentID || data.studentId,
      studentId: data.studentID || data.studentId,
      name: data.name,
      role: data.role || 'STUDENT'
    }));
  }

  async function request(action, data) {
    if (!state.appUrl) throw new Error('ยังไม่ได้ตั้งค่า EXAMATE_API_URL');
    const body = Object.assign({}, data || {}, { action: action });

    const res = await fetch(state.appUrl, {
      method: 'POST',
      // ไม่ตั้ง application/json เพื่อลดโอกาส preflight
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(body),
      redirect: 'follow'
    });

    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error('API response is not JSON: ' + text.slice(0, 200));
    }
  }

  async function login(username, password, remember) {
    const data = await request('login', { username: username, password: password });
    if (data && data.status === 'success' && data.token) {
      setSession(data, !!remember);
    }
    return data;
  }

  function logout() {
    const token = getToken();
    sessionStorage.removeItem(DEFAULTS.tokenKey);
    sessionStorage.removeItem(DEFAULTS.userKey);
    localStorage.removeItem(DEFAULTS.tokenKey);
    localStorage.removeItem(DEFAULTS.userKey);
    if (token) request('logout', { token: token }).catch(function () {});
  }

  function getSitemap() {
    return request('getSitemap', { token: getToken() });
  }

  function loadProgress(quizId) {
    return request('loadProgress', { token: getToken(), quizId: quizId || state.quizId });
  }

  function readLabPayload() {
    if (!window.ExamateLab) throw new Error('ไม่พบ window.ExamateLab ในหน้านี้');

    if (typeof window.ExamateLab.getSavePayload === 'function') {
      return window.ExamateLab.getSavePayload();
    }

    if (typeof window.ExamateLab.getPercent === 'function') {
      return {
        type: 'LAB',
        percent: window.ExamateLab.getPercent(),
        snapshot: window.ExamateLab.state || null
      };
    }

    throw new Error('Lab นี้ยังไม่มี getSavePayload() หรือ getPercent()');
  }

  async function saveProgress(quizId, payload) {
    const qid = quizId || state.quizId;
    const data = payload || readLabPayload();
    const percent = Number(data.percent || 0);
    return request('saveProgress', {
      token: getToken(),
      quizId: qid,
      payload: data,
      percent: percent
    });
  }

  async function restoreIntoLab(quizId) {
    if (!window.ExamateLab || typeof window.ExamateLab.restore !== 'function') return null;
    const data = await loadProgress(quizId || state.quizId);
    if (data && data.status === 'success' && data.progressData) {
      window.ExamateLab.restore(data.progressData);
    }
    return data;
  }

  function attachToLab(options) {
    configure(options || {});
    if (state.attached) return api;
    state.attached = true;

    installFloatingSaveButton();

    document.addEventListener('examate-lab-change', scheduleSave);
    document.addEventListener('change', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('[id$="root"], .factor-lab-v2, body')) {
        scheduleSave();
      }
    }, true);
    document.addEventListener('input', function (ev) {
      if (ev.target && ev.target.matches && ev.target.matches('input, textarea, math-field, select')) {
        scheduleSave();
      }
    }, true);

    setInterval(function () {
      if (getToken() && window.ExamateLab) saveProgress().catch(showStatusError);
    }, DEFAULTS.autoSaveIntervalMs);

    if (getToken()) {
      setTimeout(function () {
        restoreIntoLab().catch(showStatusError);
      }, 400);
    }

    return api;
  }

  function scheduleSave() {
    clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(function () {
      if (!getToken() || !window.ExamateLab) return;
      saveProgress().then(function (res) {
        if (res && res.status === 'success') showStatus('Saved ' + (res.percent || 0) + '%');
        else showStatusError(res && res.message ? res.message : 'save_failed');
      }).catch(showStatusError);
    }, DEFAULTS.autoSaveDelayMs);
  }

  function installFloatingSaveButton() {
    if (document.getElementById('examate-save-widget')) return;
    const box = document.createElement('div');
    box.id = 'examate-save-widget';
    box.innerHTML = '<button type="button" id="examate-save-now">☁️ Save</button><span id="examate-save-status">Ready</span>';
    box.style.cssText = 'position:fixed;right:14px;bottom:14px;z-index:99999;display:flex;gap:8px;align-items:center;padding:8px 10px;border:1px solid #bfdbfe;border-radius:999px;background:rgba(255,255,255,.94);box-shadow:0 10px 30px rgba(15,23,42,.16);font:700 13px system-ui,sans-serif;color:#1e3a8a;';
    box.querySelector('button').style.cssText = 'border:0;border-radius:999px;padding:8px 12px;background:#2563eb;color:white;font-weight:900;cursor:pointer;';
    document.body.appendChild(box);

    document.getElementById('examate-save-now').onclick = function () {
      if (!getToken()) {
        showStatusError('Please login at portal first');
        return;
      }
      saveProgress().then(function (res) {
        if (res && res.status === 'success') showStatus('Saved ' + (res.percent || 0) + '%');
        else showStatusError(res && res.message ? res.message : 'save_failed');
      }).catch(showStatusError);
    };
  }

  function showStatus(text) {
    const el = document.getElementById('examate-save-status');
    if (el) {
      el.textContent = text;
      el.style.color = '#166534';
    }
  }

  function showStatusError(err) {
    const msg = err && err.message ? err.message : String(err || 'error');
    const el = document.getElementById('examate-save-status');
    if (el) {
      el.textContent = msg;
      el.style.color = '#991b1b';
    }
    console.warn('[ExamateBridge]', msg);
  }

  const api = {
    configure: configure,
    login: login,
    logout: logout,
    getUser: getUser,
    getToken: getToken,
    getSitemap: getSitemap,
    loadProgress: loadProgress,
    saveProgress: saveProgress,
    restoreIntoLab: restoreIntoLab,
    attachToLab: attachToLab,
    request: request
  };

  window.ExamateBridge = api;
})();
