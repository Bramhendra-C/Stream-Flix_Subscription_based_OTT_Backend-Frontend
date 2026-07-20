// If already logged in as admin, skip straight to the admin panel
if (isAdminLoggedIn()) {
  window.location.href = 'admin.html';
}

document.getElementById('adminLoginForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('adminEmail').value.trim();
  const password = document.getElementById('adminPassword').value;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    setAdminLoggedIn();
    showToast('Welcome, admin.');
    setTimeout(() => window.location.href = 'admin.html', 400);
  } else {
    showToast('Incorrect admin email or password.', true);
  }
});
