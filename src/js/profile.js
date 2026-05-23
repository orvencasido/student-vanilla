import '../css/shared.css';
import '../css/profile.css';
import { initCommonPage, getSessionUser, saveSessionUser, syncStudentPlaceholders } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize common page properties (requires auth and privacy agreement)
  initCommonPage('profile', true);

  // Profile View Elements
  const btnEditProfile = document.getElementById('btn-edit-profile');
  const btnCancelProfile = document.getElementById('btn-cancel-profile');
  const profileDisplayMode = document.getElementById('profile-display-mode');
  const profileEditForm = document.getElementById('profile-edit-form');

  // Input Fields
  const editName = document.getElementById('edit-name');
  const editEmail = document.getElementById('edit-email');
  const editSection = document.getElementById('edit-section');

  // Display Fields
  const displayEmail = document.getElementById('profile-display-email');
  const displaySection = document.getElementById('profile-display-section');
  const displayLogin = document.getElementById('profile-display-login');
  const profileNameEl = document.querySelector('.profile-name');
  const profileGradeEl = document.querySelector('.profile-grade-tag');

  // Load initial student details in Profile page elements
  function loadProfileDetails() {
    const user = getSessionUser();
    
    // Set display text fields
    if (profileNameEl) profileNameEl.textContent = user.name;
    if (profileGradeEl) profileGradeEl.textContent = `${user.grade} Student ${user.level}`;
    if (displayEmail) displayEmail.textContent = user.email;
    if (displaySection) displaySection.textContent = user.section;
    if (displayLogin) displayLogin.textContent = user.lastLogin;

    // Prefill form inputs
    if (editName) editName.value = user.name;
    if (editEmail) editEmail.value = user.email;
    if (editSection) editSection.value = user.section;
  }

  loadProfileDetails();

  // Toggle Forms Event Listeners
  if (btnEditProfile) {
    btnEditProfile.addEventListener('click', () => {
      profileDisplayMode.classList.add('d-none');
      profileEditForm.classList.remove('d-none');
      btnEditProfile.classList.add('d-none');
    });
  }

  if (btnCancelProfile) {
    btnCancelProfile.addEventListener('click', () => {
      profileDisplayMode.classList.remove('d-none');
      profileEditForm.classList.add('d-none');
      btnEditProfile.classList.remove('d-none');
    });
  }

  if (profileEditForm) {
    profileEditForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const newName = editName.value.trim();
      const newEmail = editEmail.value.trim();
      const newSection = editSection.value.trim();

      if (newName && newEmail && newSection) {
        const user = getSessionUser();
        user.name = newName;
        user.email = newEmail;
        user.section = newSection;
        
        // Save back to session database
        saveSessionUser(user);
        
        // Sync labels immediately across page
        syncStudentPlaceholders();
        loadProfileDetails();
        
        // Return to display mode
        profileDisplayMode.classList.remove('d-none');
        profileEditForm.classList.add('d-none');
        btnEditProfile.classList.remove('d-none');

        alert('Profile saved successfully! 🎉');
      }
    });
  }
});
