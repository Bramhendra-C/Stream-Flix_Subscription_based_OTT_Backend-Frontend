/* ============ StreamFlix — shared API & session helpers ============
   Loaded on every page before the page's own script.
   Uses sessionStorage to remember the API base URL and logged-in user
   across pages (it's a multi-page site, so something has to carry state
   between full page loads). Cleared when the browser tab closes.
*/

const DEFAULT_API_BASE = 'http://3.106.197.78:8080';

function getApiBase(){
  return sessionStorage.getItem('sf_api_base') || DEFAULT_API_BASE;
}
function setApiBase(url){
  sessionStorage.setItem('sf_api_base', url.replace(/\/$/, ''));
}

function getSession(){
  const raw = sessionStorage.getItem('sf_user');
  return raw ? JSON.parse(raw) : null;
}
function setSession(user){
  sessionStorage.setItem('sf_user', JSON.stringify(user));
}
function clearSession(){
  sessionStorage.removeItem('sf_user');
}

/* ---- Admin panel access (separate from regular user login) ----
   This is a client-side-only gate — it hides the admin pages from casual
   visitors, but it is NOT real security: your backend has no auth/roles,
   so anyone who calls the REST endpoints directly (curl, Postman) can still
   read/write everything. Add real auth on the backend before relying on this. */
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'admin123';

function isAdminLoggedIn(){
  return sessionStorage.getItem('sf_is_admin') === 'true';
}
function setAdminLoggedIn(){
  sessionStorage.setItem('sf_is_admin', 'true');
}
function clearAdminLoggedIn(){
  sessionStorage.removeItem('sf_is_admin');
}
/* Call at the top of every admin page's script. Redirects away if not logged in. */
function requireAdmin(basePath = ''){
  if (!isAdminLoggedIn()){
    window.location.href = basePath + 'admin-login.html';
  }
}

/* Core fetch wrapper. path is relative, e.g. '/movies' */
async function apiRequest(path, opts = {}){
  const url = getApiBase() + path;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...opts
  });
  if (!res.ok){
    let detail = '';
    try{ detail = await res.text(); }catch(e){}
    throw new Error(`${res.status} ${res.statusText}${detail ? ' — ' + detail.slice(0,200) : ''}`);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function esc(s){
  return (s ?? '').toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function qs(name){
  return new URLSearchParams(window.location.search).get(name);
}

function showToast(msg, isError = false){
  const el = document.createElement('div');
  el.className = 'toast' + (isError ? ' error' : '');
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}
function showApiError(err){
  console.error(err);
  showToast();
  showToast(err && err.message ? 'Invalid credentials!... - ' + err.message : 'Could not reach the server.', true);
}

function planRank(p){ return { FREE:0, BASIC:1, PREMIUM:3 }[p] ?? 1; }

function userCanWatch(movie, user){
  if (!movie.requiredPlan || movie.requiredPlan === 'FREE') return true;
  if (!user) return false;
  if (!user.subscriptionActive) return false;
  return planRank(user.subscriptionType) >= planRank(movie.requiredPlan);
}

/* Renders a small "API settings" bar (base URL field) that pages can drop in.
   Call renderSettingsBar('#settings-bar') after DOM is ready. */
function renderSettingsBar(containerSelector){
  const el = document.querySelector(containerSelector);
  if (!el) return;
  el.innerHTML = `
    <span>API base:</span>
    <input id="apiBaseInput" value="${esc(getApiBase())}" />
    <button class="btn btn-sm btn-ghost" id="apiBaseSaveBtn">Save</button>
  `;
  document.getElementById('apiBaseSaveBtn').addEventListener('click', () => {
    const val = document.getElementById('apiBaseInput').value.trim();
    if (val){
      setApiBase(val);
      showToast('API base URL saved. Reloading…');
      setTimeout(() => window.location.reload(), 600);
    }
  });
}
