import '../css/shared.css';
import '../css/agreement.css';
import { checkAuth } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check auth but do not require privacy agreement yet (since this is the page to agree)
  const isAuthenticated = checkAuth(false);
  if (!isAuthenticated) return;

  const btnAgree = document.getElementById('btn-agree');
  const btnDisagree = document.getElementById('btn-disagree');

  if (btnAgree) {
    btnAgree.addEventListener('click', () => {
      localStorage.setItem('agreedToPrivacy', 'true');
      window.location.href = '/dashboard.html';
    });
  }

  if (btnDisagree) {
    btnDisagree.addEventListener('click', () => {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('agreedToPrivacy');
      
      // Redirect back to login with a warning query param
      window.location.href = '/index.html?error=consent_required';
    });
  }
});
