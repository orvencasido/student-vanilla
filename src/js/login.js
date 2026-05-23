import '../css/shared.css';
import '../css/login.css';
import { saveSessionUser } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const loginAlert = document.getElementById('login-alert');

  // Check if they are already logged in and agreed
  const user = localStorage.getItem('currentUser');
  const agreed = localStorage.getItem('agreedToPrivacy') === 'true';
  if (user && agreed) {
    window.location.href = '/dashboard.html';
    return;
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      loginAlert.classList.add('d-none');
      
      const email = document.getElementById('login-email').value.trim();
      const password = document.getElementById('login-password').value;

      if (!email || !password) {
        loginAlert.textContent = 'Please enter both your email and password!';
        loginAlert.classList.remove('d-none');
        return;
      }

      if (!email.includes('@') || !email.includes('.')) {
        loginAlert.textContent = 'Please enter a valid email address!';
        loginAlert.classList.remove('d-none');
        return;
      }

      // Initialize session user state
      const initialUserObj = {
        name: 'Kai Adamson',
        email: email,
        section: 'Mabini',
        grade: 'Grade 4',
        level: 'LEVEL 1 READING EXPLORER',
        lastLogin: new Date().toLocaleDateString()
      };

      saveSessionUser(initialUserObj);

      // Redirect to Safety & Privacy Page
      window.location.href = '/agreement.html';
    });
  }
});
