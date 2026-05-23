// Shared JavaScript Utilities for ReadBloom

// Default student state if not initialized
const DEFAULT_USER = {
  name: 'Kai Adamson',
  email: 'adamson@read.bloom',
  section: 'Mabini',
  grade: 'Grade 4',
  level: 'LEVEL 1 READING EXPLORER',
  lastLogin: '4/19/2026'
};

// Get current session data
export function getSessionUser() {
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) {
    // If not found and we are on a protected page, redirect will handle it.
    // Initialize with default for convenience
    localStorage.setItem('currentUser', JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  }
  return JSON.parse(userStr);
}

// Update current session data
export function saveSessionUser(userObj) {
  localStorage.setItem('currentUser', JSON.stringify(userObj));
}

// Check session authentication and privacy agreement
export function checkAuth(requiresPrivacy = true) {
  const user = localStorage.getItem('currentUser');
  const agreed = localStorage.getItem('agreedToPrivacy') === 'true';

  if (!user) {
    window.location.href = '/index.html';
    return false;
  }

  if (requiresPrivacy && !agreed) {
    window.location.href = '/agreement.html';
    return false;
  }

  return true;
}

// Synchronize all student labels and values on the page
export function syncStudentPlaceholders() {
  const user = getSessionUser();
  const firstName = user.name.split(' ')[0];

  // Update names
  document.querySelectorAll('.student-name-placeholder').forEach(el => {
    el.textContent = firstName;
  });

  // Update levels
  document.querySelectorAll('.student-level-placeholder').forEach(el => {
    el.textContent = user.level;
  });

  // Update general full name
  document.querySelectorAll('.student-fullname-placeholder').forEach(el => {
    el.textContent = user.name;
  });
}

// Initialize sidebar navigation buttons
export function initSidebar(activePageId) {
  const sidebarBtns = document.querySelectorAll('.nav-item-btn');
  
  sidebarBtns.forEach(btn => {
    const pageTarget = btn.getAttribute('data-page');
    
    // Set active class
    if (pageTarget === activePageId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }

    // Attach navigation link redirect
    btn.addEventListener('click', () => {
      if (pageTarget === 'dashboard') {
        window.location.href = '/dashboard.html';
      } else if (pageTarget === 'journey') {
        window.location.href = '/journey.html';
      } else if (pageTarget === 'messages') {
        window.location.href = '/messages.html';
      } else if (pageTarget === 'profile') {
        window.location.href = '/profile.html';
      }
    });
  });
}

// Initialize common page hooks
export function initCommonPage(activePageId, requiresPrivacy = true) {
  // 1. Check auth
  if (checkAuth(requiresPrivacy)) {
    // 2. Sync elements
    syncStudentPlaceholders();
    // 3. Init sidebar
    initSidebar(activePageId);
  }
}

// Logout command
export function handleLogout() {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('agreedToPrivacy');
  window.location.href = '/index.html';
}

// Attach logout button listener if present
document.addEventListener('DOMContentLoaded', () => {
  const btnLogout = document.getElementById('btn-logout');
  if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
      e.preventDefault();
      handleLogout();
    });
  }
});
