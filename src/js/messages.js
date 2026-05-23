import '../css/shared.css';
import '../css/messages.css';
import { initCommonPage } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize common page properties (requires auth and privacy agreement)
  initCommonPage('messages', true);

  // Tooltip & Speech Synthesis Elements
  const wordTooltipBox = document.getElementById('word-tooltip-box');
  const tooltipText = document.getElementById('tooltip-text');
  const btnSpeakWord = document.getElementById('btn-speak-word');
  const btnCloseTooltip = document.getElementById('btn-close-tooltip');
  const wordGroups = document.querySelectorAll('.word-group');
  
  let activeWord = null;

  function positionTooltip(element) {
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Position the speech tooltip box centered above the clicked element
    const tooltipHeight = 110; 
    const top = rect.top + scrollTop - tooltipHeight;
    const left = rect.left + scrollLeft - 10;
    
    wordTooltipBox.style.top = `${top}px`;
    wordTooltipBox.style.left = `${left}px`;
    wordTooltipBox.classList.remove('d-none');
  }

  function hideTooltip() {
    wordTooltipBox.classList.add('d-none');
    activeWord = null;
  }

  wordGroups.forEach(wg => {
    wg.addEventListener('click', (e) => {
      e.stopPropagation();
      activeWord = wg;
      const tipText = wg.getAttribute('data-tip');
      tooltipText.textContent = tipText;
      positionTooltip(wg);
    });
  });

  if (btnCloseTooltip) {
    btnCloseTooltip.addEventListener('click', (e) => {
      e.stopPropagation();
      hideTooltip();
    });
  }

  // Pronunciation Audio (Web Speech Synthesis)
  if (btnSpeakWord) {
    btnSpeakWord.addEventListener('click', (e) => {
      e.stopPropagation();
      if (activeWord) {
        // Strip custom assessment punctuation if any, speak normal word
        let textToSpeak = activeWord.textContent;
        if (textToSpeak.toLowerCase().includes('once there were')) {
          textToSpeak = 'Once there were two friends a';
        }

        if (window.speechSynthesis) {
          window.speechSynthesis.cancel(); // cancel current speech
          
          const utterance = new SpeechSynthesisUtterance(textToSpeak);
          utterance.rate = 0.8; // child-friendly reading speed
          utterance.pitch = 1.2; // friendly voice pitch
          window.speechSynthesis.speak(utterance);
        }
      }
    });
  }

  // Clicking outside tooltip will dismiss it
  document.addEventListener('click', () => {
    hideTooltip();
  });

  if (wordTooltipBox) {
    wordTooltipBox.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
});
