import '../css/shared.css';
import '../css/journey.css';
import { initCommonPage } from './shared.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize common page properties (requires auth and privacy agreement)
  initCommonPage('journey', true);
});
