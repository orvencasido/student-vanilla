// Quest flow controller
// Steps: camera → reading → preview → (upload modal) → quiz → done

const QUESTIONS = [
  {
    exercise: 'EXERCISE 1',
    question: 'Who are the two best friends in the Story?',
    choices: ['Squirrel and Puppy', 'Cat and Donkey', 'Turtle and Rabbit'],
    answer: 'Squirrel and Puppy',
  },
  {
    exercise: 'EXERCISE 2',
    question: 'Who saved the squirrel?',
    choices: ['Puppy', 'Cat', 'Rabbit', 'Turtle'],
    answer: 'Puppy',
  },
  {
    exercise: 'EXERCISE 3',
    question: 'Where did the squirrel fall?',
    choices: ['In the river', 'In the rain water', 'From a tree', 'In the mud'],
    answer: 'In the rain water',
  },
];

let mediaStream = null;
let currentQuestion = 0;
let selectedAnswer = null;
let correctCount = 0;

// ─── Utilities ────────────────────────────────────────
function showStep(id) {
  document.querySelectorAll('.quest-step').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function stopStream() {
  if (mediaStream) {
    mediaStream.getTracks().forEach(t => t.stop());
    mediaStream = null;
  }
}

// ─── STEP 1: Camera Check ─────────────────────────────
async function initCameraCheck() {
  try {
    mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const preview = document.getElementById('camera-preview');
    preview.srcObject = mediaStream;
  } catch (err) {
    alert('Please allow camera and microphone access to continue.');
    console.error(err);
  }
}

document.getElementById('btn-camera-start').addEventListener('click', () => {
  // Start reading step — reuse same stream
  const readingCam = document.getElementById('reading-camera');
  if (mediaStream) readingCam.srcObject = mediaStream;
  showStep('step-reading');
});

// ─── STEP 2: Reading ──────────────────────────────────
document.getElementById('btn-reading-done').addEventListener('click', () => {
  // Mirror stream to preview
  const previewVid = document.getElementById('preview-video');
  if (mediaStream) previewVid.srcObject = mediaStream;
  showStep('step-preview');
});

// ─── STEP 3: Preview ──────────────────────────────────
document.getElementById('btn-start-over').addEventListener('click', () => {
  // Restart from camera check
  currentQuestion = 0;
  correctCount = 0;
  selectedAnswer = null;
  const preview = document.getElementById('camera-preview');
  if (mediaStream) preview.srcObject = mediaStream;
  showStep('step-camera');
});

document.getElementById('btn-im-done').addEventListener('click', () => {
  // Show upload modal
  document.getElementById('upload-modal').classList.remove('hidden');
});

// ─── UPLOAD MODAL ─────────────────────────────────────
document.getElementById('btn-upload-cancel').addEventListener('click', () => {
  document.getElementById('upload-modal').classList.add('hidden');
});

document.getElementById('btn-upload-confirm').addEventListener('click', () => {
  document.getElementById('upload-modal').classList.add('hidden');
  stopStream(); // Stop camera/mic after upload
  startQuiz();
  showStep('step-quiz');
});

// ─── STEP 4: Quiz ─────────────────────────────────────
function startQuiz() {
  currentQuestion = 0;
  correctCount = 0;
  renderQuestion();
}

function renderQuestion() {
  const q = QUESTIONS[currentQuestion];
  selectedAnswer = null;

  // Exercise label
  document.getElementById('quiz-exercise-label').textContent = q.exercise;

  // Progress fill
  const pct = (currentQuestion / QUESTIONS.length) * 100;
  document.getElementById('quiz-progress-fill').style.width = pct + '%';

  // Dots
  const dotsEl = document.getElementById('quiz-dots');
  dotsEl.innerHTML = '';
  QUESTIONS.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'quiz-dot' + (i < currentQuestion ? ' answered' : '');
    dotsEl.appendChild(dot);
  });

  // Question text
  document.getElementById('quiz-question').textContent = q.question;

  // Choices
  const choicesEl = document.getElementById('quiz-choices');
  choicesEl.innerHTML = '';
  q.choices.forEach(choice => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn';
    btn.textContent = choice;
    btn.addEventListener('click', () => {
      document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedAnswer = choice;
    });
    choicesEl.appendChild(btn);
  });
}

document.getElementById('btn-quiz-next').addEventListener('click', () => {
  if (!selectedAnswer) {
    // Gentle shake if nothing selected
    const choicesEl = document.getElementById('quiz-choices');
    choicesEl.style.transform = 'translateX(-8px)';
    setTimeout(() => choicesEl.style.transform = 'translateX(8px)', 80);
    setTimeout(() => choicesEl.style.transform = '', 160);
    return;
  }

  if (selectedAnswer === QUESTIONS[currentQuestion].answer) {
    correctCount++;
  }

  currentQuestion++;

  if (currentQuestion < QUESTIONS.length) {
    renderQuestion();
  } else {
    // Show done
    document.getElementById('done-score').textContent = correctCount + '/' + QUESTIONS.length;
    showStep('step-done');
  }
});

// ─── STEP 5: Done ─────────────────────────────────────
document.getElementById('btn-restart').addEventListener('click', () => {
  currentQuestion = 0;
  correctCount = 0;
  selectedAnswer = null;

  // Restart stream
  initCameraCheck().then(() => {
    const preview = document.getElementById('camera-preview');
    if (mediaStream) preview.srcObject = mediaStream;
    showStep('step-camera');
  });
});

document.getElementById('btn-turn-in').addEventListener('click', () => {
  window.location.href = '/dashboard.html';
});

// ─── Init ─────────────────────────────────────────────
initCameraCheck();
