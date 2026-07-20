renderHeader(null);
renderFooter();

// If already logged in, bounce to home
if (getSession()) {
  window.location.href = 'index.html';
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  if (!email || !password){
    showToast('Enter email and password.', true);
    return;
  }
  try{
    const q = `/users/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
    const user = await apiRequest(q, { method: 'POST' });
    setSession(user);
    showToast(`Welcome back, ${user.name}.`);
    setTimeout(() => window.location.href = 'index.html', 500);
  }catch(err){
    showApiError(err);
  }
});
