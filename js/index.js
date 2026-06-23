/**
 * PakSigns - Pakistan Traffic Signs Learning App
 * Core Application Logic & State Controller
 */

// Global App State
const state = {
  signs: [],              // Loaded sign records from db.json
  scenarios: [],          // Loaded rule scenarios for traffic rules challenge
  bookmarks: [],          // Stored bookmarked sign IDs
  weakSigns: [],          // Stored IDs of signs answered incorrectly
  stats: {
    testsTaken: 0,
    averageScore: 0,
    correctCount: 0,
    totalQuestionsAnswered: 0
  },
  currentView: 'dashboard',
  languageMode: 'english', // 'english' or 'urdu'
  currentTheme: 'light',

  // Study Panel State
  studyMode: 'grid', // 'grid' or 'flashcards'
  searchTimeout: null,
  flashcard: {
    pool: [],
    currentIndex: 0,
    isFlipped: false,
    touchStartX: 0,
    touchEndX: 0
  },

  // Quiz Session State
  quiz: {
    active: false,
    pool: [],
    currentIndex: 0,
    score: 0,
    answers: [], // Tracks user choice, correctness, and sign detail
    timer: null,
    timeLeft: 45,
    userSelectedThisRound: false,
    strictMode: false,
    feedbackMode: 'practice', // 'practice' or 'exam'
    failedDueToStrict: false
  },

  // Traffic Rules Challenge Game State
  game: {
    active: false,
    currentIndex: 0,
    score: 0,
    userSelectedThisRound: false
  }
};

// Localized Interface Translations Dictionary
const translations = {
  english: {
    "dash-welcome-title": "Ready for your License Test?",
    "dash-welcome-sub": "Learn Pakistani traffic signs, test your knowledge, and track your readiness.",
    "dash-stat-progress-label": "Overall Progress",
    "dash-stat-score-label": "Last Quiz Score",
    "btn-dash-start-study": "Start Learning",
    "btn-dash-rules-label": "Traffic Rules Challenge",
    "btn-dash-visualizer-label": "Road Visualizer",
    "btn-dash-mock-test": "Take Mock Test",
    "search-input-placeholder": "Search signs...",
    "chip-all": "All",
    "chip-mandatory": "Mandatory",
    "chip-warning": "Warning",
    "chip-informative": "Informatory",
    "chip-road-marking": "Road Marking",
    "chip-weak": "Need Practice",
    "flashcard-hint-text": "Tap Card to Reveal Meaning",
    "btn-flash-prev": "Prev",
    "btn-flash-next": "Next",
    "visualizer-header-title": "Road Marking Visualizer",
    "visualizer-header-desc": "Tap on any highlighted portion of the road to read the official traffic rule.",
    "visualizer-rule-title-default": "Select a Road Area",
    "game-title": "Traffic Rules Challenge",
    "game-subtitle": "Solve traffic scenarios to build safe road maneuvers and coordination skills.",
    "quiz-setup-title": "E-Sign Mock Test Setup",
    "quiz-setup-desc": "Simulate the official computerized driving license exams.",
    "lbl-quiz-categories": "Select Categories",
    "opt-cat-mandatory": "Mandatory",
    "opt-cat-warning": "Warning",
    "opt-cat-informative": "Informatory",
    "opt-cat-marking": "Road Marking",
    "lbl-quiz-length": "Number of Questions",
    "opt-len-10": "10 Signs",
    "opt-len-20": "20 Signs",
    "lbl-quiz-modes": "License Exam Modes",
    "opt-mode-strict": "Strict DLIMS Mode",
    "opt-mode-strict-sub": "Failing any Mandatory sign immediately fails the test.",
    "opt-feedback-practice": "Practice Mode (Instant Feedback)",
    "opt-feedback-exam": "Exam Mode (Results at End Only)",
    "btn-start-mock-test": "Start Mock Test",
    "quiz-question-instruction": "What does this sign mean?",
    "quiz-review-title": "Review Answers",
    "bookmarks-title": "Saved Signs",
    "bookmarks-desc": "Revise your starred signs for focused preparation.",
    "bookmarks-empty-text": "No saved signs yet. Star signs in the study guide to show them here.",
    "nav-label-home": "Home",
    "nav-label-study": "Study",
    "nav-label-test": "Test",
    "nav-label-saved": "Saved",
    "onboarding-welcome-title": "Welcome to PakSigns",
    "onboarding-welcome-desc": "Please choose your preferred driving learning language."
  },
  urdu: {
    "dash-welcome-title": "کیا آپ لائسنس ٹیسٹ کے لیے تیار ہیں؟",
    "dash-welcome-sub": "پاکستانی ٹریفک قوانین سیکھیں، اپنے علم کی جانچ کریں اور اپنی تیاری کو بہتر کریں۔",
    "dash-stat-progress-label": "مجموعی پیشرفت",
    "dash-stat-score-label": "آخری کوئز اسکور",
    "btn-dash-start-study": "سیکھنا شروع کریں",
    "btn-dash-rules-label": "ٹریفک قوانین کا چیلنج",
    "btn-dash-visualizer-label": "انٹرایکٹو روڈ گائیڈ",
    "btn-dash-mock-test": "امتحان شروع کریں",
    "search-input-placeholder": "اشارے تلاش کریں...",
    "chip-all": "تمام",
    "chip-mandatory": "لازمی اشارے",
    "chip-warning": "انتباہی اشارے",
    "chip-informative": "معلوماتی اشارے",
    "chip-road-marking": "سڑک کی نشانیاں",
    "chip-weak": "مشق کی ضرورت ہے",
    "flashcard-hint-text": "معنی دیکھنے کے لیے کارڈ پر ٹیپ کریں",
    "btn-flash-prev": "پیچھے",
    "btn-flash-next": "آگے",
    "visualizer-header-title": "روڈ مارکنگ گائیڈ",
    "visualizer-header-desc": "سرکاری ٹریفک قوانین پڑھنے کے لیے سڑک کے کسی بھی نمایاں حصے پر ٹیپ کریں۔",
    "visualizer-rule-title-default": "سڑک کا ایک حصہ منتخب کریں",
    "game-title": "ٹریفک قوانین کا چیلنج",
    "game-subtitle": "ٹریفک کے منظر نامے حل کر کے محفوظ ڈرائیونگ اور رائٹ آف وے کے قوانین سیکھیں۔",
    "quiz-setup-title": "ای سائن ٹیسٹ کی تیاری",
    "quiz-setup-desc": "سرکاری کمپیوٹرائزڈ ڈرائیونگ لائسنس امتحانات کی مشق کریں۔",
    "lbl-quiz-categories": "اقسام منتخب کریں",
    "opt-cat-mandatory": "لازمی اشارے",
    "opt-cat-warning": "انتباہی اشارے",
    "opt-cat-informative": "معلوماتی اشارے",
    "opt-cat-marking": "سڑک کی نشانیاں",
    "lbl-quiz-length": "سوالات کی تعداد",
    "opt-len-10": "10 سوالات",
    "opt-len-20": "20 سوالات",
    "lbl-quiz-modes": "امتحانی موڈ",
    "opt-mode-strict": "سخت DLIMS موڈ",
    "opt-mode-strict-sub": "کسی بھی لازمی اشارے کا غلط جواب دینے پر ٹیسٹ فیل ہو جائے گا۔",
    "opt-feedback-practice": "پریکٹس موڈ (فوری جواب)",
    "opt-feedback-exam": "امتحانی موڈ (صرف آخر میں نتیجہ)",
    "btn-start-mock-test": "ٹیسٹ شروع کریں",
    "quiz-question-instruction": "اس اشارے کا کیا مطلب ہے؟",
    "quiz-review-title": "جوابات کا جائزہ لیں",
    "bookmarks-title": "محفوظ کردہ اشارے",
    "bookmarks-desc": "بہتر تیاری کے لیے اپنے پسندیدہ اشاروں کا جائزہ لیں۔",
    "bookmarks-empty-text": "ابھی تک کوئی محفوظ کردہ اشارے نہیں ہیں۔ اشاروں کو محفوظ کرنے کے لیے اسٹار بٹن دبائیں۔",
    "nav-label-home": "ہوم",
    "nav-label-study": "مطالعہ",
    "nav-label-test": "ٹیسٹ",
    "nav-label-saved": "محفوظ",
    "onboarding-welcome-title": "پاک سائن میں خوش آمدید",
    "onboarding-welcome-desc": "ڈرائیونگ سیکھنے کے لیے براہ کرم اپنی پسندیدہ زبان کا انتخاب کریں۔"
  }
};

// Road Marking Rule Data Repository
const roadRules = {
  'solid-line': {
    title: {
      english: 'Solid White Line',
      urdu: 'سفید مسلسل لائن'
    },
    desc: {
      english: 'Double or single solid white lines mean lane changing and overtaking are strictly prohibited. You must stay in your lane.',
      urdu: 'مسلسل سفید لائن کا مطلب ہے کہ لین تبدیل کرنا اور اوور ٹیک کرنا سخت ممنوع ہے۔ آپ کو اپنی لین میں رہنا ہوگا اور اس لکیر کو پار نہیں کرنا۔'
    }
  },
  'broken-line': {
    title: {
      english: 'Broken White Line',
      urdu: 'ٹوٹی ہوئی سفید لائن'
    },
    desc: {
      english: 'Broken white lines separate lanes. You are permitted to cross these lines to change lanes or overtake, provided it is safe to do so.',
      urdu: 'ٹیوٹی ہوئی سفید لکیریں لین کو الگ کرتی ہیں۔ اگر محفوظ ہو تو آپ لین تبدیل کرنے یا اوور ٹیک کرنے کے لیے ان لکیروں کو پار کر سکتے ہیں۔'
    }
  },
  'zebra-crossing': {
    title: {
      english: 'Zebra Crossing',
      urdu: 'زیبرا کراسنگ'
    },
    desc: {
      english: 'Zebra crossings indicate pedestrian crossing paths. Drivers are legally required to yield and stop to let pedestrians cross safely.',
      urdu: 'زیبرا کراسنگ پیدل چلنے والوں کے سڑک پار کرنے کا راستہ ہے۔ قانون کے مطابق ڈرائیورز کے لیے ضروری ہے کہ وہ پیدل چلنے والوں کو راستہ دینے کے لیے گاڑی روکیں۔'
    }
  },
  'box-junction': {
    title: {
      english: 'Yellow Box Junction',
      urdu: 'پیلا بکس چوک'
    },
    desc: {
      english: 'You must not enter the yellow box junction unless your exit lane is completely clear. Do not block the intersection.',
      urdu: 'آپ کو اس وقت تک پیلے رنگ کے بکس چوک میں داخل نہیں ہونا چاہیے جب تک کہ آپ کا باہر نکلنے کا راستہ مکمل طور پر صاف نہ ہو۔ چوک کو بلاک مت کریں۔'
    }
  },
  'yellow-curb': {
    title: {
      english: 'Yellow Curb Line',
      urdu: 'پیلی کنارہ لکیر'
    },
    desc: {
      english: 'A solid yellow curb line means parking, waiting, or loading/unloading vehicles is prohibited at any time along this stretch of road.',
      urdu: 'پکی پیلی کنارے کی لکیر کا مطلب ہے کہ سڑک کے اس حصے پر کسی بھی وقت گاڑی کھڑی کرنا، انتظار کرنا، یا سامان لوڈ/ان لوڈ کرنا ممنوع ہے۔'
    }
  }
};

// Speech Synthesis Voices Cache
let voices = [];
function loadVoices() {
  if ('speechSynthesis' in window) {
    voices = window.speechSynthesis.getVoices();
  }
}
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

// Fallback sign and scenario catalogs
const fallbackSigns = [
  { "id": 1, "category": "mandatory", "img": "compulsory/Compulsory_Sign.png", "ur": "ٹریکٹر کا داخلہ ممنوع ہے", "en": "Tractors are not allowed to enter" },
  { "id": 2, "category": "warning", "img": "warning/Precautionary_Sign.png", "ur": "دہری سڑک ختم ہے", "en": "The dual road ends" },
  { "id": 3, "category": "mandatory", "img": "compulsory/Speed_Limit.png", "ur": "حد رفتار 30 کلومیٹر فی گھنٹہ ہے", "en": "Speed limit is 30 km/h" },
  { "id": 4, "category": "mandatory", "img": "compulsory/Motorcycle_Entry_Is_Prohibited.png", "ur": "موٹر سائیکلوں کا داخلہ ممنوع ہے", "en": "Entry for motorcycles is prohibited" },
  { "id": 5, "category": "mandatory", "img": "compulsory/Turn_Left.png", "ur": "بائیں مڑ جائیں", "en": "Turn left" }
];

const fallbackScenarios = [
  {
    "id": 1,
    "question_en": "Vehicle A is inside the roundabout, and Vehicle B is waiting to enter. Who has the right of way?",
    "question_ur": "گاڑی A گول چکر کے اندر ہے اور گاڑی B داخل ہونے کا انتظار کر رہی ہے۔ پہلے گزرنے کا حق کس کا ہے؟",
    "options": [
      { "en": "Vehicle A has priority.", "ur": "گاڑی A کو پہل حاصل ہے۔", "correct": true },
      { "en": "Vehicle B has priority.", "ur": "گاڑی B کو پہل حاصل ہے۔", "correct": false }
    ]
  }
];

// ==========================================================================
// 1. Initialization & Data Hydration
// ==========================================================================

document.addEventListener('DOMContentLoaded', async () => {
  initializeTheme();
  loadBookmarks();
  loadWeakSigns();
  loadStats();
  setupEventListeners();

  await fetchAppDatabase(); // Await database completion before languages or view calculations
  initializeLanguage();
  updateDashboardStats();

  // Initialize Hash-based Routing Engine
  window.addEventListener('hashchange', handleRouting);
  handleRouting();

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('Service Worker registered successfully with scope:', reg.scope))
        .catch((err) => console.warn('Service Worker registration failed:', err));
    });
  }
});

/**
 * Fetch sign database and scenarios. Safely checks root and subdirectory paths.
 */
async function fetchAppDatabase() {
  try {
    let response = await fetch('js/db.json');
    if (!response.ok) {
      response = await fetch('db.json');
    }
    if (!response.ok) throw new Error('Database path lookup failed');
    const data = await response.json();
    state.signs = data.signs || fallbackSigns;
    state.scenarios = data.scenarios || fallbackScenarios;
    console.log('App database hydrated.');
  } catch (error) {
    console.warn('Fallback routing enabled due to database fetch error:', error);
    state.signs = fallbackSigns;
    state.scenarios = fallbackScenarios;
  }
}

// ==========================================================================
// 2. Dynamic Settings & Localization Translation Engine
// ==========================================================================

function initializeTheme() {
  const savedTheme = localStorage.getItem('paksign-theme') || 'light';
  state.currentTheme = savedTheme;
  document.body.className = `m3-theme-${savedTheme}`;
}

function toggleTheme() {
  state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
  document.body.className = `m3-theme-${state.currentTheme}`;
  localStorage.setItem('paksign-theme', state.currentTheme);
}

function initializeLanguage() {
  const savedLang = localStorage.getItem('paksign-lang');
  if (!savedLang) {
    document.getElementById('language-onboarding-modal').classList.remove('hidden');
  } else {
    setLanguageMode(savedLang);
  }
}

/**
 * Set target language parameters and translate visible static UI components
 */
function setLanguageMode(mode) {
  state.languageMode = mode;
  localStorage.setItem('paksign-lang', mode);

  const html = document.documentElement;

  if (mode === 'urdu') {
    html.setAttribute('dir', 'rtl');
    html.setAttribute('lang', 'ur');
  } else {
    html.setAttribute('dir', 'ltr');
    html.setAttribute('lang', 'en');
  }

  // Update text values of dynamic translation keys
  const langPack = translations[mode];
  if (langPack) {
    Object.keys(langPack).forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        if (element.tagName === 'INPUT') {
          element.placeholder = langPack[id];
        } else {
          element.innerText = langPack[id];
        }
      }
    });
  }

  // Update layouts depending on current view context
  if (state.currentView === 'study') {
    renderStudySigns();
  } else if (state.currentView === 'bookmarks') {
    renderBookmarks();
  } else if (state.currentView === 'rules-game' && state.game.active) {
    renderGameScenario();
  }
}

function toggleLanguageMode() {
  const nextMode = state.languageMode === 'english' ? 'urdu' : 'english';
  setLanguageMode(nextMode);
}

// ==========================================================================
// 3. Routing & View Switch Controllers (URL Router Guard)
// ==========================================================================

function handleRouting() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  const validViews = ['dashboard', 'study', 'quiz', 'bookmarks', 'road-visualizer', 'rules-game'];

  if (validViews.includes(hash)) {
    if (state.currentView === hash) return;
    switchView(hash, false);
  } else {
    switchView('dashboard', true);
  }
}

function switchView(viewId, updateHash = true) {
  // Exit guard checks for active simulations
  if (state.quiz.active && viewId !== 'quiz') {
    const confirmLeave = confirm(state.languageMode === 'urdu' 
      ? "کیا آپ واقعی ٹیسٹ چھوڑنا چاہتے ہیں؟ آپ کا حاصل کردہ ریکارڈ ختم ہو جائے گا۔"
      : "Are you sure you want to exit the test? Progress will be lost.");
    if (!confirmLeave) {
      // Revert URL hash state if the transition is canceled without triggers
      window.removeEventListener('hashchange', handleRouting);
      window.location.hash = '#quiz';
      setTimeout(() => {
        window.addEventListener('hashchange', handleRouting);
      }, 50);
      return;
    }
    resetQuizState();
  }

  if (state.game.active && viewId !== 'rules-game') {
    const confirmLeave = confirm(state.languageMode === 'urdu'
      ? "کیا آپ واقعی ٹریفک چیلنج چھوڑنا چاہتے ہیں؟"
      : "Are you sure you want to leave the rules challenge?");
    if (!confirmLeave) {
      window.removeEventListener('hashchange', handleRouting);
      window.location.hash = '#rules-game';
      setTimeout(() => {
        window.addEventListener('hashchange', handleRouting);
      }, 50);
      return;
    }
    state.game.active = false;
  }

  state.currentView = viewId;

  if (updateHash) {
    window.location.hash = '#' + viewId;
  }

  document.querySelectorAll('.app-view').forEach(view => view.classList.remove('active'));

  let targetViewDomId = `view-${viewId}`;
  if (viewId === 'quiz') {
    targetViewDomId = state.quiz.active ? 'view-quiz-active' : 'view-quiz-setup';
  } else if (viewId === 'rules-game') {
    targetViewDomId = 'view-rules-game';
  }

  const targetView = document.getElementById(targetViewDomId);
  if (targetView) targetView.classList.add('active');

  document.querySelectorAll('.nav-item').forEach(item => {
    const isActive = item.getAttribute('href') === `#${viewId}`;
    item.classList.toggle('active', isActive);
    if (isActive) {
      item.setAttribute('aria-current', 'page');
    } else {
      item.removeAttribute('aria-current');
    }
  });

  if (viewId === 'dashboard') {
    updateDashboardStats();
  } else if (viewId === 'bookmarks') {
    renderBookmarks();
  } else if (viewId === 'study') {
    renderStudySigns();
  }
}

// ==========================================================================
// 4. Study Directory Module
// ==========================================================================

function renderStudySigns() {
  const container = document.getElementById('study-signs-container');
  if (!container) return;

  const searchQuery = document.getElementById('search-input').value.toLowerCase().trim();
  const activeCategory = document.querySelector('.m3-chip.active').dataset.category;

  const searchTerms = searchQuery.split(/\s+/).filter(t => t.length > 0);

  const filtered = state.signs.filter(sign => {
    const matchesSearch = searchTerms.every(term =>
      sign.en.toLowerCase().includes(term) || sign.ur.includes(term)
    );

    let matchesCategory = false;
    if (activeCategory === 'all') {
      matchesCategory = true;
    } else if (activeCategory === 'weak') {
      matchesCategory = state.weakSigns.includes(sign.id);
    } else {
      matchesCategory = sign.category === activeCategory;
    }

    return matchesSearch && matchesCategory;
  });

  state.flashcard.pool = filtered;
  if (state.studyMode === 'flashcards') {
    initFlashcards();
    return;
  }

  container.innerHTML = '';

  if (filtered.length === 0) {
    const emptyMsg = state.languageMode === 'urdu' ? 'کوئی اشارہ تلاش کے مطابق نہیں ملا۔' : 'No signs match your search settings.';
    container.innerHTML = `<p class="empty-state">${emptyMsg}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  filtered.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'm3-card';

    const isBookmarked = state.bookmarks.includes(sign.id);
    const bookmarkIcon = isBookmarked ? '#icon-bookmark-filled' : '#icon-bookmark';
    const needsPractice = state.weakSigns.includes(sign.id);

    const titleText = state.languageMode === 'urdu' ? sign.ur : sign.en;
    const practiceLabel = state.languageMode === 'urdu' ? 'مشق کی ضرورت ہے' : 'Need Practice';

    card.innerHTML = `
      <div class="sign-card-image-box">
        <img src="assets/${sign.img}" alt="${sign.en}" loading="lazy" onerror="this.src='https://placehold.co/120x120?text=Sign'">
      </div>
      <div class="sign-card-content">
        <div>
          <div class="sign-card-title-en" style="text-align: inherit;">${titleText}</div>
        </div>
        <div class="card-actions-row">
          <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-start;">
            <span class="m3-category-badge">${sign.category.replace('_', ' ')}</span>
            ${needsPractice ? `<span class="m3-category-badge" style="background-color: var(--error-container); color: var(--on-error-container); border: 1px solid var(--error);">${practiceLabel}</span>` : ''}
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="m3-icon-button speak-btn" data-id="${sign.id}" title="Read Aloud" aria-label="Read title out loud">
              <svg class="m3-icon"><use href="#icon-volume"></use></svg>
            </button>
            <button class="m3-icon-button bookmark-btn" data-id="${sign.id}" title="Save Sign" aria-label="Bookmark sign">
              <svg class="m3-icon"><use href="${bookmarkIcon}"></use></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  container.appendChild(fragment);
}

/**
 * Speech Synthesis with Voice Cache Support
 */
function speakSignText(sign) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();

    const text = state.languageMode === 'urdu' ? sign.ur : sign.en;
    const utterance = new SpeechSynthesisUtterance(text);

    let preferredVoice = null;
    if (state.languageMode === 'urdu') {
      utterance.lang = 'ur-PK';
      preferredVoice = voices.find(v => v.lang.startsWith('ur') || v.lang.startsWith('pa'));
    } else {
      utterance.lang = 'en-US';
      preferredVoice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('en-US'));
    }

    if (preferredVoice) utterance.voice = preferredVoice;
    window.speechSynthesis.speak(utterance);
  } else {
    alert(state.languageMode === 'urdu' ? 'اس براؤزر پر آڈیو کی سہولت موجود نہیں ہے۔' : 'Text-to-speech is not supported on this browser.');
  }
}

function toggleStudyMode() {
  const gridContainer = document.getElementById('study-signs-container');
  const flashcardContainer = document.getElementById('study-flashcards-container');
  const viewModeIcon = document.getElementById('study-mode-icon');

  if (state.studyMode === 'grid') {
    state.studyMode = 'flashcards';
    gridContainer.classList.add('hidden');
    flashcardContainer.classList.remove('hidden');
    viewModeIcon.querySelector('use').setAttribute('href', '#icon-book');
    initFlashcards();
  } else {
    state.studyMode = 'grid';
    gridContainer.classList.remove('hidden');
    flashcardContainer.classList.add('hidden');
    viewModeIcon.querySelector('use').setAttribute('href', '#icon-flashcards');
    renderStudySigns();
  }
}

function initFlashcards() {
  state.flashcard.currentIndex = 0;
  state.flashcard.isFlipped = false;

  const cardElement = document.getElementById('flashcard-element');
  if (cardElement) cardElement.classList.remove('flipped');

  updateFlashcardUI();
}

function updateFlashcardUI() {
  const pool = state.flashcard.pool;
  const currentCard = document.getElementById('flashcard-element');
  const countLabel = document.getElementById('flashcard-counter');

  if (!currentCard) return;

  if (pool.length === 0) {
    currentCard.classList.add('hidden');
    countLabel.innerText = "0 of 0";
    return;
  }

  currentCard.classList.remove('hidden');
  const sign = pool[state.flashcard.currentIndex];

  document.getElementById('flashcard-img').src = `assets/${sign.img}`;
  document.getElementById('flashcard-text').innerText = state.languageMode === 'urdu' ? sign.ur : sign.en;
  document.getElementById('flashcard-category').innerText = sign.category.replace('_', ' ');

  const isBookmarked = state.bookmarks.includes(sign.id);
  const bookmarkIconRef = isBookmarked ? '#icon-bookmark-filled' : '#icon-bookmark';
  document.getElementById('flashcard-bookmark-btn').querySelector('use').setAttribute('href', bookmarkIconRef);

  countLabel.innerText = `${state.flashcard.currentIndex + 1} of ${pool.length}`;
}

function handleFlashcardNavigation(direction) {
  const pool = state.flashcard.pool;
  if (pool.length === 0) return;

  const cardElement = document.getElementById('flashcard-element');
  cardElement.classList.remove('flipped');
  state.flashcard.isFlipped = false;

  setTimeout(() => {
    if (direction === 'next') {
      state.flashcard.currentIndex = (state.flashcard.currentIndex + 1) % pool.length;
    } else {
      state.flashcard.currentIndex = (state.flashcard.currentIndex - 1 + pool.length) % pool.length;
    }
    updateFlashcardUI();
  }, 150);
}

// ==========================================================================
// 5. Bookmarks Module
// ==========================================================================

function loadBookmarks() {
  state.bookmarks = JSON.parse(localStorage.getItem('paksign-bookmarks')) || [];
}

function toggleBookmark(id) {
  const index = state.bookmarks.indexOf(id);
  if (index === -1) {
    state.bookmarks.push(id);
  } else {
    state.bookmarks.splice(index, 1);
  }
  localStorage.setItem('paksign-bookmarks', JSON.stringify(state.bookmarks));

  if (state.currentView === 'study') {
    if (state.studyMode === 'flashcards') {
      updateFlashcardUI();
    } else {
      renderStudySigns();
    }
  }
  if (state.currentView === 'bookmarks') renderBookmarks();
}

function renderBookmarks() {
  const container = document.getElementById('bookmarks-container');
  const emptyState = document.getElementById('bookmarks-empty-state');
  if (!container || !emptyState) return;

  const savedSigns = state.signs.filter(sign => state.bookmarks.includes(sign.id));

  if (savedSigns.length === 0) {
    container.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  container.classList.remove('hidden');
  emptyState.classList.add('hidden');
  container.innerHTML = '';

  savedSigns.forEach(sign => {
    const card = document.createElement('div');
    card.className = 'm3-card';

    const displayTitle = state.languageMode === 'urdu' ? sign.ur : sign.en;

    card.innerHTML = `
      <div class="sign-card-image-box">
        <img src="assets/${sign.img}" alt="${sign.en}" onerror="this.src='https://placehold.co/120x120?text=Sign'">
      </div>
      <div class="sign-card-content">
        <div>
          <div class="sign-card-title-en" style="text-align: inherit;">${displayTitle}</div>
        </div>
        <div class="card-actions-row">
          <span class="m3-category-badge">${sign.category.replace('_', ' ')}</span>
          <button class="m3-icon-button bookmark-btn" data-id="${sign.id}" aria-label="Remove bookmark">
            <svg class="m3-icon"><use href="#icon-bookmark-filled"></use></svg>
          </button>
        </div>
      </div>
    `;

    card.querySelector('.bookmark-btn').addEventListener('click', () => {
      toggleBookmark(sign.id);
    });

    container.appendChild(card);
  });
}

// ==========================================================================
// 6. Interactive Road Visualizer
// ==========================================================================

function openRoadVisualizer() {
  switchView('road-visualizer');
  closeVisualizerInfo();
}

function showVisualizerRule(areaKey) {
  const rule = roadRules[areaKey];
  if (!rule) return;

  document.querySelectorAll('.interactive-road-mark').forEach(elem => {
    elem.classList.toggle('highlighted', elem.dataset.rule === areaKey);
  });

  const titleEl = document.getElementById('visualizer-rule-title');
  const descEl = document.getElementById('visualizer-rule-desc');

  if (state.languageMode === 'urdu') {
    titleEl.innerText = rule.title.urdu;
    descEl.innerText = rule.desc.urdu;
    descEl.style.textAlign = 'right';
  } else {
    titleEl.innerText = rule.title.english;
    descEl.innerText = rule.desc.english;
    descEl.style.textAlign = 'left';
  }

  const board = document.getElementById('visualizer-info-board');
  board.classList.remove('hidden');
}

function closeVisualizerInfo() {
  document.querySelectorAll('.interactive-road-mark').forEach(elem => {
    elem.classList.remove('highlighted');
  });
  document.getElementById('visualizer-info-board').classList.add('hidden');
}

// ==========================================================================
// 7. Traffic Rules Challenge (Scenario Game)
// ==========================================================================

function startRulesGame() {
  state.game.active = true;
  state.game.currentIndex = 0;
  state.game.score = 0;

  document.getElementById('game-active-container').classList.remove('hidden');
  document.getElementById('game-results-container').classList.add('hidden');

  switchView('rules-game');
  renderGameScenario();
}

function drawScenarioVisuals(scenarioId, canvas) {
  canvas.innerHTML = '';

  const baseRoadHtml = `
    <rect x="0" y="0" width="200" height="120" fill="#2c3e50" />
    <line x1="0" y1="10" x2="200" y2="10" stroke="#bdc3c7" stroke-width="4" />
    <line x1="0" y1="110" x2="200" y2="110" stroke="#bdc3c7" stroke-width="4" />
  `;

  if (scenarioId === 1) {
    canvas.innerHTML = `
      <rect x="0" y="0" width="200" height="120" fill="#2c3e50" />
      <circle cx="100" cy="60" r="45" stroke="#ffffff" stroke-width="2" fill="none" />
      <circle cx="100" cy="60" r="24" fill="#27ae60" stroke="#f1c40f" stroke-width="2" />
      <line x1="100" y1="0" x2="100" y2="15" stroke="#ffffff" stroke-width="2" stroke-dasharray="3,3" />
      <line x1="100" y1="105" x2="100" y2="120" stroke="#ffffff" stroke-width="2" stroke-dasharray="3,3" />
      <rect x="110" y="32" width="14" height="8" rx="2" fill="#e74c3c" transform="rotate(-30 110 32)" />
      <text x="115" y="36" fill="#ffffff" font-size="6" font-weight="bold">A</text>
      <rect x="93" y="102" width="14" height="8" rx="2" fill="#3498db" transform="rotate(-90 93 102)" />
      <text x="96" y="105" fill="#ffffff" font-size="6" font-weight="bold">B</text>
      <path d="M125 50 A 30 30 0 0 1 100 90" fill="none" stroke="#2ecc71" stroke-width="2" stroke-dasharray="2,2" />
    `;
  } else if (scenarioId === 2) {
    canvas.innerHTML = `
      <rect x="0" y="0" width="200" height="120" fill="#2c3e50" />
      <rect x="75" y="0" width="50" height="120" fill="#2c3e50" />
      <rect x="75" y="35" width="50" height="50" fill="rgba(241, 196, 15, 0.15)" stroke="#f1c40f" stroke-width="2" />
      <line x1="75" y1="35" x2="125" y2="85" stroke="#f1c40f" stroke-width="1.5" />
      <line x1="75" y1="85" x2="125" y2="35" stroke="#f1c40f" stroke-width="1.5" />
      <line x1="95" y1="35" x2="125" y2="65" stroke="#f1c40f" stroke-width="1" />
      <line x1="75" y1="55" x2="105" y2="85" stroke="#f1c40f" stroke-width="1" />
      <rect x="145" y="52" width="16" height="10" rx="2" fill="#95a5a6" />
      <rect x="127" y="52" width="16" height="10" rx="2" fill="#7f8c8d" />
      <rect x="52" y="52" width="16" height="10" rx="2" fill="#e74c3c" />
      <text x="60" y="59" fill="#ffffff" font-size="6" font-weight="bold">A</text>
      <line x1="0" y1="57" x2="75" y2="57" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,4" />
      <line x1="125" y1="57" x2="200" y2="57" stroke="#ffffff" stroke-width="1" stroke-dasharray="4,4" />
    `;
  } else if (scenarioId === 3) {
    canvas.innerHTML = `
      ${baseRoadHtml}
      <line x1="0" y1="58" x2="200" y2="58" stroke="#ffffff" stroke-width="1.5" />
      <line x1="0" y1="62" x2="200" y2="62" stroke="#ffffff" stroke-width="1.5" />
      <rect x="110" y="25" width="22" height="12" rx="1" fill="#f39c12" />
      <rect x="132" y="27" width="6" height="8" rx="1" fill="#d35400" />
      <rect x="50" y="75" width="16" height="9" rx="2" fill="#e74c3c" />
      <text x="58" y="81" fill="#ffffff" font-size="6" font-weight="bold">A</text>
      <path d="M 66 79 Q 90 70 100 45" fill="none" stroke="#e74c3c" stroke-width="2" stroke-dasharray="3,3" />
      <circle cx="95" cy="55" r="7" fill="#e74c3c" />
      <text x="95" y="58" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">!</text>
    `;
  } else if (scenarioId === 4) {
    canvas.innerHTML = `
      <rect x="0" y="0" width="200" height="120" fill="#34495e" />
      <line x1="0" y1="60" x2="200" y2="60" stroke="#7f8c8d" stroke-width="2" stroke-dasharray="10,15" />
      <rect x="0" y="0" width="200" height="120" fill="rgba(236, 240, 241, 0.45)" />
      <rect x="40" y="70" width="20" height="11" rx="2" fill="#2980b9" />
      <polygon points="60,71 110,62 110,90 60,80" fill="rgba(241, 196, 15, 0.35)" />
      <ellipse cx="140" cy="60" rx="60" ry="40" fill="rgba(236,240,241, 0.5)" filter="blur(8px)" />
    `;
  } else if (scenarioId === 5) {
    canvas.innerHTML = `
      <rect x="0" y="0" width="200" height="120" fill="#2c3e50" />
      <rect x="75" y="0" width="50" height="120" fill="#2c3e50" />
      <rect x="0" y="35" width="200" height="50" fill="#2c3e50" />
      <rect x="0" y="31" width="75" height="4" fill="#7f8c8d" />
      <rect x="125" y="31" width="75" height="4" fill="#7f8c8d" />
      <rect x="0" y="85" width="75" height="4" fill="#7f8c8d" />
      <rect x="125" y="85" width="75" height="4" fill="#7f8c8d" />
      <rect x="35" y="55" width="16" height="10" rx="2" fill="#e74c3c" />
      <text x="43" y="62" fill="#ffffff" font-size="6" font-weight="bold" text-anchor="middle">A</text>
      <rect x="95" y="94" width="10" height="16" rx="2" fill="#3498db" />
      <text x="100" y="104" fill="#ffffff" font-size="6" font-weight="bold" text-anchor="middle">B</text>
    `;
  }
}

function renderGameScenario() {
  state.game.userSelectedThisRound = false;
  document.getElementById('game-explanation-board').classList.add('hidden');

  const currentScenario = state.scenarios[state.game.currentIndex];
  const canvas = document.getElementById('game-graphics-canvas');

  drawScenarioVisuals(currentScenario.id, canvas);

  const scenarioTotal = state.scenarios.length;
  const progressText = state.languageMode === 'urdu'
    ? `سوال نمبر ${state.game.currentIndex + 1} از ${scenarioTotal}`
    : `Scenario ${state.game.currentIndex + 1} of ${scenarioTotal}`;
  const scoreText = state.languageMode === 'urdu'
    ? `اسکور: ${state.game.score}`
    : `Score: ${state.game.score}`;

  document.getElementById('game-question-counter').innerText = progressText;
  document.getElementById('game-score-counter').innerText = scoreText;

  const questionText = state.languageMode === 'urdu' ? currentScenario.question_ur : currentScenario.question_en;
  document.getElementById('game-scenario-question').innerText = questionText;

  const container = document.getElementById('game-options-grid');
  container.innerHTML = '';

  currentScenario.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'm3-option-button';
    btn.innerText = state.languageMode === 'urdu' ? opt.ur : opt.en;

    btn.addEventListener('click', () => handleGameSelection(btn, opt, currentScenario));
    container.appendChild(btn);
  });
}

function handleGameSelection(buttonElement, chosenOption, scenario) {
  if (state.game.userSelectedThisRound) return;
  state.game.userSelectedThisRound = true;

  const isCorrect = chosenOption.correct === true;
  const explanationBoard = document.getElementById('game-explanation-board');
  const verdictTitle = document.getElementById('game-verdict-title');
  const verdictDesc = document.getElementById('game-verdict-desc');

  if (isCorrect) {
    state.game.score++;
    buttonElement.classList.add('correct');
    verdictTitle.innerText = state.languageMode === 'urdu' ? "درست جواب!" : "Correct Answer!";
    verdictTitle.style.color = "var(--success)";
  } else {
    buttonElement.classList.add('incorrect');
    verdictTitle.innerText = state.languageMode === 'urdu' ? "غلط جواب!" : "Incorrect Answer!";
    verdictTitle.style.color = "var(--error)";

    const buttons = document.querySelectorAll('#game-options-grid .m3-option-button');
    buttons.forEach(btn => {
      const associatedOption = scenario.options.find(o => (state.languageMode === 'urdu' ? o.ur : o.en) === btn.innerText);
      if (associatedOption && associatedOption.correct) {
        btn.classList.add('correct');
      }
    });
  }

  const correctOpt = scenario.options.find(o => o.correct);
  verdictDesc.innerText = state.languageMode === 'urdu' ? correctOpt.ur : correctOpt.en;
  explanationBoard.classList.remove('hidden');
}

function advanceGame() {
  state.game.currentIndex++;
  if (state.game.currentIndex < state.scenarios.length) {
    renderGameScenario();
  } else {
    finishRulesGame();
  }
}

function finishRulesGame() {
  document.getElementById('game-active-container').classList.add('hidden');
  const resultsContainer = document.getElementById('game-results-container');
  resultsContainer.classList.remove('hidden');

  const total = state.scenarios.length;
  const percentage = Math.round((state.game.score / total) * 100);

  document.getElementById('game-percentage').innerText = `${percentage}%`;
  document.getElementById('game-fraction-score').innerText = `${state.game.score} / ${total}`;

  const statusEl = document.getElementById('game-results-status');
  const verdictEl = document.getElementById('game-verdict-text');

  if (percentage >= 80) {
    statusEl.innerText = state.languageMode === 'urdu' ? "کامیاب" : "Passed / Complete";
    statusEl.style.color = "var(--success)";
    verdictEl.innerText = state.languageMode === 'urdu'
      ? "شاندار! آپ سڑک کے قوانین اور ڈرائیونگ کے اصولوں سے بخوبی واقف ہیں۔"
      : "Excellent work! You demonstrated highly proficient coordination and understanding of road maneuvers.";
  } else {
    statusEl.innerText = state.languageMode === 'urdu' ? "ناکام" : "Failed / Practice Needed";
    statusEl.style.color = "var(--error)";
    verdictEl.innerText = state.languageMode === 'urdu'
      ? "ٹریفک قوانین میں مہارت حاصل کرنے کے لیے دوبارہ کوشش کریں۔ مشق کامیابی کی چابی ہے۔"
      : "Make sure to review critical roundabout and lane discipline rules. Try again to boost your score.";
  }
}

// ==========================================================================
// 8. E-Sign Mock Test Simulator Engine
// ==========================================================================

function startQuiz(categories, length, strictMode, feedbackMode) {
  let eligiblePool = state.signs.filter(s => categories.includes(s.category));

  if (eligiblePool.length < 4) {
    const errorMsg = state.languageMode === 'urdu'
      ? "براہ کرم ایسے زمرے منتخب کریں جن میں کل 4 سے زیادہ اشارے موجود ہوں۔"
      : "Please select categories containing more than 4 traffic signs altogether.";
    alert(errorMsg);
    return;
  }

  eligiblePool = shuffleArray(eligiblePool);
  state.quiz.pool = eligiblePool.slice(0, Math.min(length, eligiblePool.length));

  // Preload asset images to prevent visual flicker on layout transition
  preloadSignImages(state.quiz.pool);

  state.quiz.active = true;
  state.quiz.currentIndex = 0;
  state.quiz.score = 0;
  state.quiz.answers = [];
  state.quiz.strictMode = strictMode;
  state.quiz.feedbackMode = feedbackMode;
  state.quiz.failedDueToStrict = false;

  switchView('quiz');
  loadQuestion();
}

function preloadSignImages(signsArray) {
  signsArray.forEach(sign => {
    const img = new Image();
    img.src = `assets/${sign.img}`;
  });
}

function loadQuestion() {
  state.quiz.userSelectedThisRound = false;
  const currentSign = state.quiz.pool[state.quiz.currentIndex];

  const nextBtn = document.getElementById('btn-quiz-next-question');
  if (nextBtn) nextBtn.classList.add('hidden');

  const total = state.quiz.pool.length;
  document.getElementById('quiz-question-counter').innerText = state.languageMode === 'urdu'
    ? `سوال نمبر ${state.quiz.currentIndex + 1} از ${total}`
    : `Question ${state.quiz.currentIndex + 1} of ${total}`;

  document.getElementById('quiz-progress-bar').style.width = `${((state.quiz.currentIndex + 1) / total) * 100}%`;
  document.getElementById('quiz-sign-image').src = `assets/${currentSign.img}`;

  // Generate plausible dynamic distractors from the same category
  let sameCategoryDistractors = state.signs.filter(s => s.id !== currentSign.id && s.category === currentSign.category);
  if (sameCategoryDistractors.length < 3) {
    sameCategoryDistractors = state.signs.filter(s => s.id !== currentSign.id);
  }
  const selectedDistractors = shuffleArray(sameCategoryDistractors).slice(0, 3);
  const choices = shuffleArray([currentSign, ...selectedDistractors]);

  const container = document.getElementById('quiz-options-grid');
  container.innerHTML = '';

  choices.forEach(option => {
    const btn = document.createElement('button');
    btn.className = 'm3-option-button';
    btn.innerText = state.languageMode === 'urdu' ? option.ur : option.en;

    btn.addEventListener('click', () => handleOptionSelected(btn, option, currentSign));
    container.appendChild(btn);
  });

  startTimer();
}

function handleOptionSelected(buttonElement, chosenSign, correctSign) {
  if (state.quiz.userSelectedThisRound) return;
  state.quiz.userSelectedThisRound = true;
  clearInterval(state.quiz.timer);

  const isCorrect = chosenSign.id === correctSign.id;

  if (isCorrect) {
    state.quiz.score++;
  } else {
    if (state.quiz.strictMode && correctSign.category === 'mandatory') {
      state.quiz.failedDueToStrict = true;
    }
    recordWeakSign(correctSign.id);
  }

  state.quiz.answers.push({
    sign: correctSign,
    userSelection: chosenSign,
    isCorrect: isCorrect,
    timedOut: false
  });

  const allButtons = document.querySelectorAll('.m3-option-button');

  if (state.quiz.feedbackMode === 'practice') {
    allButtons.forEach(btn => btn.disabled = true);

    if (isCorrect) {
      buttonElement.classList.add('correct');
    } else {
      buttonElement.classList.add('incorrect');
      allButtons.forEach(btn => {
        const correctText = state.languageMode === 'urdu' ? correctSign.ur : correctSign.en;
        if (btn.innerText === correctText) {
          btn.classList.add('correct');
        }
      });
    }

    const nextBtn = document.getElementById('btn-quiz-next-question');
    if (nextBtn) nextBtn.classList.remove('hidden');

    // DLIMS Strict Mode rule check: Instantly route to results on Mandatory mistake in practice
    if (state.quiz.failedDueToStrict) {
      nextBtn.innerText = state.languageMode === 'urdu' ? "نتیجہ دیکھیں (امتحان ختم)" : "View Results (Exam Terminated)";
    } else {
      nextBtn.innerText = state.languageMode === 'urdu' ? "اگلا سوال" : "Next Question";
    }
  } else {
    // Exam mode triggers
    allButtons.forEach(btn => btn.disabled = true);
    buttonElement.style.border = "2px solid var(--primary)";

    setTimeout(() => {
      if (state.quiz.strictMode && state.quiz.failedDueToStrict) {
        finishQuiz(); // Exit instantly in exam mode
      } else {
        goToNextQuestion();
      }
    }, 600);
  }
}

function handleTimeout() {
  state.quiz.userSelectedThisRound = true;
  clearInterval(state.quiz.timer);

  const currentSign = state.quiz.pool[state.quiz.currentIndex];

  recordWeakSign(currentSign.id);
  if (state.quiz.strictMode && currentSign.category === 'mandatory') {
    state.quiz.failedDueToStrict = true;
  }

  state.quiz.answers.push({
    sign: currentSign,
    userSelection: null,
    isCorrect: false,
    timedOut: true
  });

  document.querySelectorAll('.m3-option-button').forEach(btn => btn.disabled = true);

  if (state.quiz.feedbackMode === 'practice') {
    const alertMsg = state.languageMode === 'urdu' ? "اس سوال کے لیے وقت ختم ہو گیا ہے!" : "Time is up for this question!";
    alert(alertMsg);
    const nextBtn = document.getElementById('btn-quiz-next-question');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      if (state.quiz.failedDueToStrict) {
        nextBtn.innerText = state.languageMode === 'urdu' ? "نتیجہ دیکھیں (امتحان ختم)" : "View Results (Exam Terminated)";
      } else {
        nextBtn.innerText = state.languageMode === 'urdu' ? "اگلا سوال" : "Next Question";
      }
    }
  } else {
    setTimeout(() => {
      if (state.quiz.strictMode && state.quiz.failedDueToStrict) {
        finishQuiz();
      } else {
        goToNextQuestion();
      }
    }, 600);
  }
}

function goToNextQuestion() {
  if (state.quiz.strictMode && state.quiz.failedDueToStrict) {
    finishQuiz();
    return;
  }

  state.quiz.currentIndex++;
  if (state.quiz.currentIndex < state.quiz.pool.length) {
    loadQuestion();
  } else {
    finishQuiz();
  }
}

function startTimer() {
  clearInterval(state.quiz.timer);
  state.quiz.timeLeft = 45;
  const textEl = document.getElementById('quiz-timer-text');
  textEl.innerText = `${state.quiz.timeLeft}s`;

  state.quiz.timer = setInterval(() => {
    state.quiz.timeLeft--;
    textEl.innerText = `${state.quiz.timeLeft}s`;

    if (state.quiz.timeLeft <= 0) {
      handleTimeout();
    }
  }, 1000);
}

function finishQuiz() {
  state.quiz.active = false;
  clearInterval(state.quiz.timer);

  const total = state.quiz.pool.length;
  const percentage = Math.round((state.quiz.score / total) * 100);

  document.getElementById('result-percentage').innerText = `${percentage}%`;
  document.getElementById('result-fraction-score').innerText = `${state.quiz.score} / ${total}`;
  document.getElementById('result-correct-count').innerText = `${state.quiz.score} ${state.languageMode === 'urdu' ? 'درست' : 'Correct'}`;
  document.getElementById('result-incorrect-count').innerText = `${total - state.quiz.score} ${state.languageMode === 'urdu' ? 'غلط' : 'Incorrect'}`;

  let passed = percentage >= 80;
  let ruleViolationMessage = '';

  if (state.quiz.strictMode && state.quiz.failedDueToStrict) {
    passed = false;
    ruleViolationMessage = state.languageMode === 'urdu'
      ? " (لازمی اشارے کا غلط جواب دینے کی وجہ سے ناکام)"
      : " (Failed due to incorrect Mandatory sign answer)";
  }

  const statusEl = document.getElementById('result-status-message');
  const verdictEl = document.getElementById('result-verdict-text');

  if (passed) {
    statusEl.innerText = state.languageMode === 'urdu' ? "کامیاب" : "Passed!";
    statusEl.style.color = "var(--success)";
    verdictEl.innerText = state.languageMode === 'urdu'
      ? `آپ نے فرضی ٹیسٹ ${percentage}% اسکور کے ساتھ پاس کر لیا ہے۔ آپ آفیشل ای سائن امتحان کے لیے بالکل تیار ہیں!`
      : `You passed the mock test with a score of ${percentage}%. You are ready for the official E-Sign exam!`;
  } else {
    statusEl.innerText = state.languageMode === 'urdu' ? "ناکام" : "Failed";
    statusEl.style.color = "var(--error)";
    verdictEl.innerText = state.languageMode === 'urdu'
      ? `آپ کا سکور ${percentage}% رہا${ruleViolationMessage}۔ آفیشل لائسنس ٹیسٹ پاس کرنے کے لیے کم از کم 80٪ سکور لازمی ہے۔`
      : `You scored ${percentage}%${ruleViolationMessage}. You need at least 80% to pass the official license test. Keep practicing!`;
  }

  saveQuizStats(state.quiz.score, total);
  renderQuizReview();
  switchView('quiz-results');
}

function resetQuizState() {
  state.quiz.active = false;
  clearInterval(state.quiz.timer);
  state.quiz.pool = [];
  state.quiz.answers = [];
  state.quiz.failedDueToStrict = false;
}

function renderQuizReview() {
  const container = document.getElementById('quiz-review-list');
  if (!container) return;

  container.innerHTML = '';

  state.quiz.answers.forEach((ans, index) => {
    const item = document.createElement('div');
    item.className = 'review-card';

    let answerStatusHtml = '';
    const userSelectionText = ans.userSelection ? (state.languageMode === 'urdu' ? ans.userSelection.ur : ans.userSelection.en) : 'None';
    const correctText = state.languageMode === 'urdu' ? ans.sign.ur : ans.sign.en;

    if (ans.timedOut) {
      const timeoutLabel = state.languageMode === 'urdu' ? 'وقت ختم ہو گیا' : 'Timed Out';
      answerStatusHtml = `<span style="color:var(--error); font-weight:700;">${timeoutLabel}</span>`;
    } else {
      answerStatusHtml = `
        <div class="review-choices">
          <div class="review-choice ${ans.isCorrect ? 'selected' : ''}" style="color:${ans.isCorrect ? 'var(--success)' : 'var(--error)'}">
            <strong>${state.languageMode === 'urdu' ? 'آپ کا انتخاب' : 'Your Selection'}:</strong> ${userSelectionText}
          </div>
          ${!ans.isCorrect ? `
          <div class="review-choice" style="color:var(--success)">
            <strong>${state.languageMode === 'urdu' ? 'درست جواب' : 'Correct Answer'}:</strong> ${correctText}
          </div>` : ''}
        </div>
      `;
    }

    item.innerHTML = `
      <div class="review-img-box">
        <img src="assets/${ans.sign.img}" alt="${ans.sign.en}">
      </div>
      <div class="review-details">
        <div style="font-weight:700;">${state.languageMode === 'urdu' ? 'سوال نمبر' : 'Question'} ${index + 1}</div>
        ${answerStatusHtml}
      </div>
    `;

    container.appendChild(item);
  });
}

// ==========================================================================
// 9. Stats & Spaced Repetition Logic
// ==========================================================================

function loadStats() {
  const saved = localStorage.getItem('paksign-stats');
  if (saved) {
    state.stats = JSON.parse(saved);
  }
}

function saveQuizStats(score, total) {
  state.stats.testsTaken++;
  state.stats.totalQuestionsAnswered += total;
  state.stats.correctCount += score;
  state.stats.averageScore = Math.round((state.stats.correctCount / state.stats.totalQuestionsAnswered) * 100);

  localStorage.setItem('paksign-stats', JSON.stringify(state.stats));
  localStorage.setItem('paksign-last-score', `${score}/${total}`);
}

function updateDashboardStats() {
  const lastScore = localStorage.getItem('paksign-last-score') || '0/0';
  document.getElementById('stat-total-progress').innerText = `${state.stats.averageScore}%`;
  document.getElementById('stat-quiz-score').innerText = lastScore;
}

function loadWeakSigns() {
  state.weakSigns = JSON.parse(localStorage.getItem('paksign-weak-signs')) || [];
}

function recordWeakSign(id) {
  if (!state.weakSigns.includes(id)) {
    state.weakSigns.push(id);
    localStorage.setItem('paksign-weak-signs', JSON.stringify(state.weakSigns));
  }
}

// ==========================================================================
// 10. Event Binding & DOM Utility Hooks
// ==========================================================================

function setupEventListeners() {
  const infoToggle = document.getElementById('btn-info-toggle');
  const sidebar = document.getElementById('info-sidebar');
  const sidebarOverlay = document.getElementById('info-sidebar-overlay');
  const closeSidebarBtn = document.getElementById('btn-close-sidebar');

  if (infoToggle && sidebar && sidebarOverlay) {
    infoToggle.addEventListener('click', () => {
      sidebar.classList.add('active');
      sidebarOverlay.classList.remove('hidden');
    });

    const closeSidebar = () => {
      sidebar.classList.remove('active');
      sidebarOverlay.classList.add('hidden');
    };

    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    sidebarOverlay.addEventListener('click', closeSidebar);
  }

  document.getElementById('btn-onboard-en').addEventListener('click', () => {
    setLanguageMode('english');
    document.getElementById('language-onboarding-modal').classList.add('hidden');
  });

  document.getElementById('btn-onboard-ur').addEventListener('click', () => {
    setLanguageMode('urdu');
    document.getElementById('language-onboarding-modal').classList.add('hidden');
  });

  // Native Link Anchor event captures
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetHash = item.getAttribute('href');
      window.location.hash = targetHash;
    });
  });

  document.querySelectorAll('[data-target-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      switchView(btn.dataset.targetTab);
    });
  });

  document.getElementById('btn-language-toggle').addEventListener('click', toggleLanguageMode);
  document.getElementById('btn-theme-toggle').addEventListener('click', toggleTheme);

  // Debounced search on typing
  const searchQueryInput = document.getElementById('search-input');
  if (searchQueryInput) {
    searchQueryInput.addEventListener('input', () => {
      clearTimeout(state.searchTimeout);
      state.searchTimeout = setTimeout(() => {
        renderStudySigns();
      }, 200);
    });
  }

  document.getElementById('btn-toggle-view-mode').addEventListener('click', toggleStudyMode);

  // Accessible Flashcard Interaction via Touch Swipe, Tap, or Space/Enter keys
  const cardElement = document.getElementById('flashcard-element');
  if (cardElement) {
    const flipCard = () => {
      cardElement.classList.toggle('flipped');
      state.flashcard.isFlipped = !state.flashcard.isFlipped;
    };
    cardElement.addEventListener('click', flipCard);
    cardElement.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        flipCard();
      }
    });

    // Touch events for swiping flashcards on mobile
    cardElement.addEventListener('touchstart', (e) => {
      state.flashcard.touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    cardElement.addEventListener('touchend', (e) => {
      state.flashcard.touchEndX = e.changedTouches[0].screenX;
      handleSwipeGesture();
    }, { passive: true });
  }

  function handleSwipeGesture() {
    const threshold = 50; // Minimum swipe distance in pixels
    const deltaX = state.flashcard.touchEndX - state.flashcard.touchStartX;
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleFlashcardNavigation('prev'); // Swipe Right
      } else {
        handleFlashcardNavigation('next'); // Swipe Left
      }
    }
  }

  document.getElementById('btn-flash-prev').addEventListener('click', (e) => {
    e.stopPropagation();
    handleFlashcardNavigation('prev');
  });

  document.getElementById('btn-flash-next').addEventListener('click', (e) => {
    e.stopPropagation();
    handleFlashcardNavigation('next');
  });

  document.getElementById('flashcard-audio-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const sign = state.flashcard.pool[state.flashcard.currentIndex];
    speakSignText(sign);
  });

  document.getElementById('flashcard-bookmark-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    const sign = state.flashcard.pool[state.flashcard.currentIndex];
    toggleBookmark(sign.id);
  });

  document.getElementById('btn-dash-visualizer').addEventListener('click', (e) => {
    e.preventDefault();
    openRoadVisualizer();
  });
  document.getElementById('btn-visualizer-back').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('dashboard');
  });

  // Accessible Road Visualizer triggers
  document.querySelectorAll('.interactive-road-mark').forEach(area => {
    const triggerAction = () => showVisualizerRule(area.dataset.rule);
    area.addEventListener('click', triggerAction);
    area.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        triggerAction();
      }
    });
  });

  document.getElementById('btn-close-visualizer-info').addEventListener('click', closeVisualizerInfo);

  document.getElementById('btn-dash-rules-game').addEventListener('click', (e) => {
    e.preventDefault();
    startRulesGame();
  });
  document.getElementById('btn-rules-game-back').addEventListener('click', (e) => {
    e.preventDefault();
    switchView('dashboard');
  });
  document.getElementById('btn-game-next').addEventListener('click', advanceGame);
  document.getElementById('btn-retry-game').addEventListener('click', startRulesGame);
  document.getElementById('btn-exit-game').addEventListener('click', () => {
    state.game.active = false;
    switchView('dashboard');
  });

  document.querySelectorAll('#category-chips .m3-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#category-chips .m3-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      renderStudySigns();
    });
  });

  // Event Delegation optimized on Study Signs Container
  const studySignsContainer = document.getElementById('study-signs-container');
  if (studySignsContainer) {
    studySignsContainer.addEventListener('click', (e) => {
      const speakBtn = e.target.closest('.speak-btn');
      const bookmarkBtn = e.target.closest('.bookmark-btn');

      if (speakBtn) {
        e.stopPropagation();
        const id = parseInt(speakBtn.dataset.id, 10);
        const sign = state.signs.find(s => s.id === id);
        if (sign) speakSignText(sign);
      } else if (bookmarkBtn) {
        e.stopPropagation();
        const id = parseInt(bookmarkBtn.dataset.id, 10);
        toggleBookmark(id);
      }
    });
  }

  const configForm = document.getElementById('quiz-config-form');
  if (configForm) {
    configForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const checkedBoxes = configForm.querySelectorAll('input[name="quiz-cat"]:checked');
      const categories = Array.from(checkedBoxes).map(cb => cb.value);
      const length = parseInt(configForm.querySelector('input[name="quiz-length"]:checked').value, 10);
      const strictMode = document.getElementById('quiz-strict-mode').checked;
      const feedbackMode = configForm.querySelector('input[name="quiz-feedback"]:checked').value;

      if (categories.length === 0) {
        const warning = state.languageMode === 'urdu' ? "کم از کم ایک زمرہ منتخب کریں۔" : "Please select at least one traffic sign category.";
        alert(warning);
        return;
      }

      startQuiz(categories, length, strictMode, feedbackMode);
    });
  }

  document.getElementById('btn-quiz-next-question').addEventListener('click', () => {
    goToNextQuestion();
  });

  document.getElementById('btn-retry-quiz').addEventListener('click', () => {
    switchView('quiz');
  });

  document.getElementById('btn-back-to-home').addEventListener('click', () => {
    switchView('dashboard');
  });
}

/**
 * Helper to shuffle array elements randomly (Fisher-Yates)
 */
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}