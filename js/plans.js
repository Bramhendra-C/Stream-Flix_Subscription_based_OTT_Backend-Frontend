renderHeader('plans');
renderFooter();

async function loadPlans(){
  const el = document.getElementById('plansContent');
  el.innerHTML = `<div class="empty">Loading plans…</div>`;
  try{
    const subs = await apiRequest('/subscriptions') || [];
    document.getElementById('planCount').textContent = `${subs.length} plan${subs.length===1?'':'s'}`;
    renderPlans(subs);
  }catch(err){
    showApiError(err);
    el.innerHTML = `<div class="error-banner">Could not load plans. Check the API base URL in your API settings.</div>`;
  }
}

function renderPlans(subs){
  const el = document.getElementById('plansContent');
  const user = getSession();
  if (!subs.length){
    el.innerHTML = `<div class="empty">No plans yet. Add one from the Admin Panel.</div>`;
    return;
  }
  el.innerHTML = `<div class="ticket-row">${subs.map(s => `
    <div class="ticket">
      <div class="ticket-main">
        <div class="ticket-desc" style="margin-bottom:auto;">${esc(s.description || '')}</div>
        <button class="btn btn-gold btn-sm" style="align-self:flex-start;" onclick="choosePlan('${esc(s.planType)}')">
          ${user && user.subscriptionType === s.planType ? 'Current plan' : 'Choose plan'}
        </button>
      </div>
      <div class="ticket-stub">
        <div class="ticket-plan">${esc(s.planType)}</div>
        <div class="ticket-price mono">₹${s.price}</div>
        <div class="ticket-days">${s.durationDays} days</div>
      </div>
    </div>`).join('')}</div>`;
}

async function choosePlan(planType){
  const user = getSession();
  if (!user){
    showToast('Log in first to choose a plan.', true);
    setTimeout(() => window.location.href = 'login.html', 700);
    return;
  }
  try{
    const updated = { ...user, subscriptionType: planType, subscriptionActive: true };
    const saved = await apiRequest(`/users/${user.id}`, { method: 'PUT', body: JSON.stringify(updated) });
    setSession(saved);
    showToast(`You're now on the ${planType} plan.`);
    renderHeader('plans');
    loadPlans();
  }catch(err){
    showApiError(err);
  }
}

loadPlans();
