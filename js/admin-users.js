requireAdmin();
renderAdminHeader('users');
document.getElementById('site-footer').innerHTML = `StreamFlix Admin &nbsp;·&nbsp; API base: <span class="mono">${esc(getApiBase())}</span>`;

const emptyUser = { name:'', email:'', password:'', phoneNumber:'', subscriptionType:'FREE', subscriptionActive:true };
let users = [];
let editing = null;

async function loadUsers(){
  const wrap = document.getElementById('userTableWrap');
  wrap.innerHTML = `<div class="empty">Loading users…</div>`;
  try{
    users = await apiRequest('/users') || [];
    document.getElementById('userCount').textContent = `${users.length} user${users.length===1?'':'s'}`;
    renderTable();
  }catch(err){
    showApiError(err);
    wrap.innerHTML = `<div class="error-banner">Could not load users. Check the API base URL from the Admin landing page.</div>`;
  }
}

function renderTable(){
  const wrap = document.getElementById('userTableWrap');
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Plan</th><th>Active</th><th></th></tr></thead>
    <tbody>
      ${users.map(u => `<tr>
        <td class="mono">${u.id}</td><td>${esc(u.name)}</td><td>${esc(u.email)}</td><td>${esc(u.phoneNumber||'')}</td>
        <td><span class="badge">${esc(u.subscriptionType)}</span></td><td>${u.subscriptionActive ? 'Yes' : 'No'}</td>
        <td><div class="row-actions">
          <button class="btn btn-danger btn-sm" data-delete="${u.id}">Delete</button>
        </div></td>
      </tr>`).join('') || `<tr><td colspan="7" style="text-align:center;color:var(--muted);padding:24px;">No users yet.</td></tr>`}
    </tbody>
  </table></div>`;

  wrap.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteUser(btn.dataset.delete));
  });
}

async function deleteUser(id){
  if (!confirm('Delete this user? This cannot be undone.')) return;
  try{
    await apiRequest(`/users/${id}`, { method:'DELETE' });
    showToast('User deleted.');
    loadUsers();
  }catch(err){ showApiError(err); }
}

function openForm(data, isNew){
  editing = { data: data ? {...data} : {...emptyUser}, isNew };
  const d = editing.data;
  document.getElementById('formMount').innerHTML = `
    <div class="overlay" id="formOverlay">
      <div class="modal">
        <button class="modal-close" id="closeFormBtn">✕</button>
        <div class="modal-body">
          <h2 class="display" style="font-size:26px;">${isNew ? 'Add user' : 'Edit user'}</h2>
          <form id="userForm">
            <div class="form-grid">
              <div class="field"><label>Name</label><input data-field="name" value="${esc(d.name||'')}"/></div>
              <div class="field"><label>Email</label><input type="email" data-field="email" value="${esc(d.email||'')}"/></div>
              <div class="field"><label>Password</label><input type="text" data-field="password" value="${esc(d.password||'')}"/></div>
              <div class="field"><label>Phone</label><input data-field="phoneNumber" value="${esc(d.phoneNumber||'')}"/></div>
              <div class="field"><label>Subscription type</label>
                <select data-field="subscriptionType">
                  ${['FREE','BASIC','PREMIUM'].map(p => `<option value="${p}" ${d.subscriptionType===p?'selected':''}>${p}</option>`).join('')}
                </select>
              </div>
              <div class="checkfield" style="grid-column:1/-1;">
                <input type="checkbox" id="activeCheck" ${d.subscriptionActive ? 'checked' : ''}/>
                <label for="activeCheck">Subscription active</label>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn btn-gold">${isNew ? 'Create' : 'Save changes'}</button>
              <button type="button" class="btn btn-ghost" id="cancelFormBtn">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  document.getElementById('closeFormBtn').addEventListener('click', closeForm);
  document.getElementById('cancelFormBtn').addEventListener('click', closeForm);
  document.getElementById('formOverlay').addEventListener('click', (e) => { if (e.target.id === 'formOverlay') closeForm(); });
  document.getElementById('userForm').addEventListener('submit', submitForm);
}

function closeForm(){
  document.getElementById('formMount').innerHTML = '';
  editing = null;
}

async function submitForm(e){
  e.preventDefault();
  const form = e.target;
  form.querySelectorAll('[data-field]').forEach(input => { editing.data[input.dataset.field] = input.value; });
  editing.data.subscriptionActive = document.getElementById('activeCheck').checked;
  const payload = editing.data;
  try{
    if (editing.isNew){
      await apiRequest('/users/register', { method:'POST', body: JSON.stringify(payload) });
      showToast('User added.');
    } else {
      await apiRequest(`/users/${payload.id}`, { method:'PUT', body: JSON.stringify(payload) });
      showToast('User updated.');
    }
    closeForm();
    loadUsers();
  }catch(err){ showApiError(err); }
}

document.getElementById('addUserBtn').addEventListener('click', () => openForm(null, true));

loadUsers();
