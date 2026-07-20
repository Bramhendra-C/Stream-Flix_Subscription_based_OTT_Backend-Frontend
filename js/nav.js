/* ============ StreamFlix — public site header ============
   Call renderHeader('movies') on each user-facing page with the active nav key:
   'movies' | 'plans' | null
   This is the USER panel — it has no link to the Admin Panel; that lives
   entirely under /admin with its own login (see renderAdminHeader below).
*/
function renderHeader(active, basePath = ''){
  const mount = document.getElementById('site-header');
  if (!mount) return;
  const user = getSession();

  mount.innerHTML = `
    <header>
      <a class="logo" href="${basePath}index.html"><span class="reel"></span>STREAMFLIX</a>
      <nav class="mainnav">
        <a href="${basePath}index.html" class="${active==='movies' ? 'active':''}">Browse</a>
        <a href="${basePath}plans.html" class="${active==='plans' ? 'active':''}">Plans</a>
      </nav>
      <div class="header-right">
        ${user
          ? `<div class="userchip"><b>${esc(user.name)}</b><span class="badge">${esc(user.subscriptionType)}</span></div>
             <button class="btn btn-sm" id="logoutBtn">Log out</button>`
          : `<a class="btn btn-gold btn-sm" href="${basePath}login.html">Log in</a>`
        }
      </div>
    </header>
  `;

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn){
    logoutBtn.addEventListener('click', () => {
      clearSession();
      showToast('Signed out.');
      setTimeout(() => window.location.href = basePath + 'index.html', 400);
    });
  }
}

function renderFooter(){
  const mount = document.getElementById('site-footer');
  if (!mount) return;
  mount.innerHTML = `@StreamFlix &nbsp;·&nbsp; <a href="${window.location.pathname.includes('/admin/') ? '' : 'admin/'}admin-login.html" style="color:var(--muted);">Admin login</a>`;
}

/* ============ StreamFlix — admin-only header ============
   Completely separate from the public site header/session.
   activeTab: 'movies' | 'subscriptions' | 'users' | null (null = landing page)
*/
function renderAdminHeader(activeTab){
  const mount = document.getElementById('site-header');
  if (!mount) return;
  mount.innerHTML = `
    <header>
      <a class="logo" href="admin.html"><span class="reel"></span>STREAMFLIX <span style="color:var(--muted); font-size:16px; margin-left:6px;">/ admin</span></a>
      <nav class="mainnav">
        <a href="admin-movies.html" class="${activeTab==='movies' ? 'active':''}">Movies</a>
        <a href="admin-subscriptions.html" class="${activeTab==='subscriptions' ? 'active':''}">Subscriptions</a>
        <a href="admin-users.html" class="${activeTab==='users' ? 'active':''}">Users</a>
      </nav>
      <div class="header-right">
        <a class="btn btn-ghost btn-sm" href="../index.html">View site</a>
        <button class="btn btn-sm" id="adminLogoutBtn">Log out</button>
      </div>
    </header>
  `;
  document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    clearAdminLoggedIn();
    showToast('Signed out of admin.');
    setTimeout(() => window.location.href = 'admin-login.html', 400);
  });
}
