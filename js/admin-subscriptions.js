requireAdmin();
renderAdminHeader('subscriptions');
document.getElementById('site-footer').innerHTML = `StreamFlix Admin &nbsp;·&nbsp; API base: <span class="mono">${esc(getApiBase())}</span>`;

const emptySub = { planType:'FREE', price:0, durationDays:30, description:'' };
let subs = [];
let editing = null;

async function loadSubs(){
  const wrap = document.getElementById('subTableWrap');
  wrap.innerHTML = `<div class="empty">Loading plans…</div>`;
  try{
    subs = await apiRequest('/subscriptions') || [];
    document.getElementById('subCount').textContent = `${subs.length} plan${subs.length===1?'':'s'}`;
    renderTable();
  }catch(err){
    showApiError(err);
    wrap.innerHTML = `<div class="error-banner">Could not load plans. Check the API base URL from the Admin landing page.</div>`;
  }
}

function renderTable(){
  const wrap = document.getElementById('subTableWrap');
  wrap.innerHTML = `<div class="table-wrap"><table>
    <thead><tr><th>ID</th><th>Plan type</th><th>Price</th><th>Duration (days)</th><th>Description</th><th></th></tr></thead>
    <tbody>
      ${subs.map(s => `<tr>
        <td class="mono">${s.id}</td><td><span class="badge">${esc(s.planType)}</span></td><td>₹${s.price}</td><td>${s.durationDays}</td><td>${esc(s.description||'')}</td>
        <td><div class="row-actions">
          <button class="btn btn-sm" data-edit="${s.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-delete="${s.id}">Delete</button>
        </div></td>
      </tr>`).join('') || `<tr><td colspan="6" style="text-align:center;color:var(--muted);padding:24px;">No plans yet.</td></tr>`}
    </tbody>
  </table></div>`;

  wrap.querySelectorAll('[data-edit]').forEach(btn => {
    btn.addEventListener('click', () => openForm(subs.find(s => s.id == btn.dataset.edit), false));
  });
  wrap.querySelectorAll('[data-delete]').forEach(btn => {
    btn.addEventListener('click', () => deleteSub(btn.dataset.delete));
  });
}

async function deleteSub(id){
  if (!confirm('Delete this plan? This cannot be undone.')) return;
  try{
    await apiRequest(`/subscriptions/${id}`, { method:'DELETE' });
    showToast('Plan deleted.');
    loadSubs();
  }catch(err){ showApiError(err); }
}

function openForm(data, isNew){
  editing = { data: data ? {...data} : {...emptySub}, isNew };
  const d = editing.data;
  document.getElementById('formMount').innerHTML = `
    <div class="overlay" id="formOverlay">
      <div class="modal">
        <button class="modal-close" id="closeFormBtn">✕</button>
        <div class="modal-body">
          <h2 class="display" style="font-size:26px;">${isNew ? 'Add plan' : 'Edit plan'}</h2>
          <form id="subForm">
            <div class="form-grid">
              <div class="field"><label>Plan type</label>
                <select data-field="planType">
                  ${['FREE','BASIC','PREMIUM'].map(p => `<option value="${p}" ${d.planType===p?'selected':''}>${p}</option>`).join('')}
                </select>
              </div>
              <div class="field"><label>Price (₹)</label><input type="number" step="any" data-field="price" value="${esc(d.price ?? '')}"/></div>
              <div class="field"><label>Duration (days)</label><input type="number" data-field="durationDays" value="${esc(d.durationDays ?? '')}"/></div>
              <div class="field" style="grid-column:1/-1;"><label>Description</label><textarea data-field="description">${esc(d.description||'')}</textarea></div>
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
  document.getElementById('subForm').addEventListener('submit', submitForm);
}

function closeForm(){
  document.getElementById('formMount').innerHTML = '';
  editing = null;
}

async function submitForm(e){
  e.preventDefault();
  e.target.querySelectorAll('[data-field]').forEach(input => { editing.data[input.dataset.field] = input.value; });
  const payload = { ...editing.data, price: Number(editing.data.price), durationDays: Number(editing.data.durationDays) };
  try{
    if (editing.isNew){
      await apiRequest('/subscriptions', { method:'POST', body: JSON.stringify(payload) });
      showToast('Plan added.');
    } else {
      await apiRequest(`/subscriptions/${payload.id}`, { method:'PUT', body: JSON.stringify(payload) });
      showToast('Plan updated.');
    }
    closeForm();
    loadSubs();
  }catch(err){ showApiError(err); }
}

document.getElementById('addSubBtn').addEventListener('click', () => openForm(null, true));

loadSubs();
