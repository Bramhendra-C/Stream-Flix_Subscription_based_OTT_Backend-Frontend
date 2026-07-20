renderHeader(null);
renderFooter();

if (getSession()) {
  window.location.href = 'index.html';
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: document.getElementById('password').value,
    phoneNumber: document.getElementById('phoneNumber').value.trim(),
    subscriptionType: 'FREE',
    subscriptionActive: true
  };
  if (!payload.name || !payload.email || !payload.password){
    showToast('Name, email and password are required.', true);
    return;
  }
  try{
    const user = await apiRequest('/users/register', { method: 'POST', body: JSON.stringify(payload) });
    setSession(user);
    showToast(`Account created. Welcome, ${user.name}.`);
    setTimeout(() => window.location.href = 'index.html', 500);
  }catch(err){
    showApiError(err);
  }
});
