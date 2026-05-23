import '../css/shared.css';
import '../css/dashboard.css';
import { initCommonPage } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize common page properties (requires auth and privacy agreement)
  initCommonPage('dashboard', true);


  // Quest Simulator (Modal Triggers)
  const btnStartQuest = document.getElementById('btn-start-quest');
  const btnFinishQuest = document.getElementById('btn-finish-quest');
  let questModalInstance = null;

  if (btnStartQuest) {
    btnStartQuest.addEventListener('click', () => {
      const modalEl = document.getElementById('questModal');
      if (modalEl && window.bootstrap) {
        questModalInstance = new window.bootstrap.Modal(modalEl);
        questModalInstance.show();
      }
    });
  }

  if (btnFinishQuest) {
    btnFinishQuest.addEventListener('click', () => {
      // Unlocks Book 2 row on the dashboard view
      const book2Row = document.querySelector('.locked-book');
      if (book2Row) {
        book2Row.classList.remove('locked-book');
        book2Row.classList.add('active-book');
        
        const book2Title = book2Row.querySelector('.book-title');
        if (book2Title) book2Title.classList.remove('text-muted');

        const book2Number = book2Row.querySelector('.book-number');
        if (book2Number) book2Number.classList.remove('text-muted');

        const lockIcon = book2Row.querySelector('.lock-icon');
        if (lockIcon) {
          lockIcon.remove();
          
          const newBtn = document.createElement('button');
          newBtn.className = 'btn btn-start-quest font-bold py-2 px-4 rounded-pill';
          newBtn.innerHTML = '<i class="bi bi-stars me-1"></i> Start Quest';
          newBtn.addEventListener('click', () => {
            alert('Starting Book 2 Quest! Yay!');
          });
          book2Row.appendChild(newBtn);
        }
      }

      // Hide modal
      if (questModalInstance) {
        questModalInstance.hide();
      }

      // Save quest completed state in localStorage
      localStorage.setItem('book1Completed', 'true');

      // Update journey progress if on dashboard
      const progressBar = document.querySelector('.progress-bar');
      if (progressBar) {
        progressBar.style.width = '50%';
        progressBar.textContent = 'Book 1 & 2 of 4 Completed';
        progressBar.classList.replace('bg-success', 'bg-info');
      }

      const completedBadge = document.querySelector('.progress-section .badge');
      if (completedBadge) {
        completedBadge.textContent = '50% Completed';
        completedBadge.classList.replace('bg-primary', 'bg-success');
      }

      const totalWordsRead = document.querySelector('.display-5.text-success');
      if (totalWordsRead) {
        totalWordsRead.textContent = '720';
      }

      alert('Great job reading! Book 1 completed and Book 2 is now unlocked! 🌟');
    });
  }

  // Restore state if Book 1 was previously completed
  if (localStorage.getItem('book1Completed') === 'true') {
    // Trigger completion unlocks immediately
    const book2Row = document.querySelector('.locked-book');
    if (book2Row) {
      book2Row.classList.remove('locked-book');
      book2Row.classList.add('active-book');
      
      const book2Title = book2Row.querySelector('.book-title');
      if (book2Title) book2Title.classList.remove('text-muted');

      const book2Number = book2Row.querySelector('.book-number');
      if (book2Number) book2Number.classList.remove('text-muted');

      const lockIcon = book2Row.querySelector('.lock-icon');
      if (lockIcon) {
        lockIcon.remove();
        const newBtn = document.createElement('button');
        newBtn.className = 'btn btn-start-quest font-bold py-2 px-4 rounded-pill';
        newBtn.innerHTML = '<i class="bi bi-stars me-1"></i> Start Quest';
        book2Row.appendChild(newBtn);
      }
    }
  }
});
