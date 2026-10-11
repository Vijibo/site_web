/* ============================================
   SCRIPT GLOBAL — Victor Ji Portfolio
   ============================================ */

// ── Curseur personnalisé ──
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.className  = 'cursor-dot';
ring.className = 'cursor-ring';
document.body.appendChild(dot);
document.body.appendChild(ring);

let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

const clickableSelector = 'a, button, [data-cursor], [role="button"], summary';

function setCursorInteractive(on) {
  dot.style.width  = on ? '12px' : '8px';
  dot.style.height = on ? '12px' : '8px';
  ring.style.width  = on ? '48px' : '32px';
  ring.style.height = on ? '48px' : '32px';
  ring.style.borderColor = on ? 'rgba(228,235,244,0.9)' : 'rgba(228,235,244,0.65)';
}

document.addEventListener('mouseover', e => {
  if (e.target.closest(clickableSelector)) setCursorInteractive(true);
});
document.addEventListener('mouseout', e => {
  if (e.target.closest(clickableSelector)) setCursorInteractive(false);
});

// ── Œil — suit la souris ──
const pupil   = document.querySelector('.iris');
const eyeBall = document.querySelector('.eyeBall');

if (pupil && eyeBall) {
  document.addEventListener('mousemove', e => {
    const eyeRect = eyeBall.getBoundingClientRect();
    const pupilStyle = getComputedStyle(pupil);
    const borders = getComputedStyle(eyeBall);
    const pupilWidth = pupil.offsetWidth +
      parseFloat(pupilStyle.borderLeftWidth) + parseFloat(pupilStyle.borderRightWidth);
    const pupilHeight = pupil.offsetHeight +
      parseFloat(pupilStyle.borderTopWidth) + parseFloat(pupilStyle.borderBottomWidth);
    const maxX = Math.max(0, eyeRect.width / 2 -
      parseFloat(borders.borderLeftWidth) - pupilWidth / 2 - 1);
    const maxY = Math.max(0, eyeRect.height / 2 -
      parseFloat(borders.borderTopWidth) - pupilHeight / 2 - 1);
    const dx = e.clientX - (eyeRect.left + eyeRect.width / 2);
    const dy = e.clientY - (eyeRect.top + eyeRect.height / 2);
    const distance = Math.hypot(dx, dy);
    const maxDistance = Math.min(maxX, maxY);
    const scale = distance > maxDistance ? maxDistance / distance : 1;

    pupil.style.setProperty('--iris-x', `${dx * scale}px`);
    pupil.style.setProperty('--iris-y', `${dy * scale}px`);
  });
}

// ── Fonds d’écran par période (auto) + cycle manuel (œil) ──
// Fichiers : nuit_profonde | matin | journee | soir
// 22h–06h nuit_profonde | 06h–11h matin | 11h–17h journee | 17h–22h soir
const WALL_ORDER = ['nuit_profonde', 'matin', 'journee', 'soir'];
const WALL_URL = {
  nuit_profonde: "url('images/nuit_profonde.jpg')",
  matin:         "url('images/matin.jpg')",
  journee:       "url('images/journee.jpg')",
  soir:          "url('images/soir.jpg')",
};
const IRIS = {
  nuit_profonde: { bg: '#dce4ee', border: 'rgba(214,223,234,0.45)' },
  matin:         { bg: '#d3dde9', border: 'rgba(202,214,228,0.45)' },
  journee:       { bg: '#e2e9f1', border: 'rgba(222,232,242,0.45)' },
  soir:          { bg: '#d8d0c8', border: 'rgba(210,198,184,0.45)' },
};

const LEGACY_WALL_KEYS = { c: 'nuit_profonde', a: 'matin', b: 'journee', d: 'soir' };

function migrateWallpaperStorage() {
  const f = localStorage.getItem('wallpaperForced');
  if (f && LEGACY_WALL_KEYS[f]) {
    localStorage.setItem('wallpaperForced', LEGACY_WALL_KEYS[f]);
  }
}
migrateWallpaperStorage();

function slotFromClock() {
  const h = new Date().getHours();
  if (h >= 22 || h < 6) return 'nuit_profonde';
  if (h < 11) return 'matin';
  if (h < 17) return 'journee';
  return 'soir';
}

function getActiveWallKey() {
  const forced = localStorage.getItem('wallpaperForced');
  if (forced && forced !== 'auto' && WALL_ORDER.includes(forced)) return forced;
  return slotFromClock();
}

function applyWallpaper() {
  const key = getActiveWallKey();
  document.body.style.backgroundImage = WALL_URL[key];
  document.body.classList.remove(
    'wallpaper-nuit_profonde', 'wallpaper-matin', 'wallpaper-journee', 'wallpaper-soir'
  );
  document.body.classList.add('wallpaper-' + key);
  const iris = IRIS[key];
  if (pupil) pupil.style.background = iris.bg;
  if (eyeBall) eyeBall.style.borderColor = iris.border;
}

applyWallpaper();

const nightBtn = document.getElementById('night_mode');
if (nightBtn) {
  nightBtn.setAttribute('title', 'Fond automatique selon l’heure — cliquer pour forcer : nuit → matin → journée → soir → auto');
  nightBtn.setAttribute('aria-label', 'Changer le fond d’écran');
  nightBtn.addEventListener('click', () => {
    let f = localStorage.getItem('wallpaperForced') || 'auto';
    if (f === 'auto') {
      localStorage.setItem('wallpaperForced', 'nuit_profonde');
    } else {
      const i = WALL_ORDER.indexOf(f);
      if (i === -1 || i === 3) {
        localStorage.setItem('wallpaperForced', 'auto');
      } else {
        localStorage.setItem('wallpaperForced', WALL_ORDER[i + 1]);
      }
    }
    applyWallpaper();
  });
}

setInterval(applyWallpaper, 60 * 1000);

// ── Navbar mobile ──
const hamMenu       = document.querySelector('.ham-menu');
const fullscreenMenu = document.querySelector('.fullscreen-menu');

function openMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.setAttribute('aria-hidden', 'false');
  fullscreenMenu.classList.add('active');
  hamMenu && hamMenu.classList.add('active');
  hamMenu && hamMenu.setAttribute('aria-expanded', 'true');
  hamMenu && hamMenu.setAttribute('aria-label', 'Fermer le menu');
}

function closeMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.classList.remove('active');
  fullscreenMenu.setAttribute('aria-hidden', 'true');
  hamMenu && hamMenu.classList.remove('active');
  hamMenu && hamMenu.setAttribute('aria-expanded', 'false');
  hamMenu && hamMenu.setAttribute('aria-label', 'Ouvrir le menu');
}

hamMenu && hamMenu.setAttribute('aria-expanded', 'false');
hamMenu && hamMenu.addEventListener('click', () => {
  if (fullscreenMenu && fullscreenMenu.classList.contains('active')) {
    closeMenu();
  } else {
    openMenu();
  }
});
fullscreenMenu && fullscreenMenu.addEventListener('click', e => {
  if (e.target === fullscreenMenu) closeMenu();
});
fullscreenMenu && fullscreenMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// Fermer sur Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMenu();
});

// ── Scroll reveal ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ── Lien actif navbar ──
const navLinks = document.querySelectorAll('.nav-top-right a, .fullscreen-menu a');
const currentPage = window.location.pathname.split('/').pop();
navLinks.forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

// ── Langue (FR / EN) ──
const I18N = {
  fr: {
    'title.home': 'Développement logiciel | Portfolio',
    'title.projects': 'Projets scolaires | Portfolio',
    'title.resources': 'Sélection culturelle | Portfolio',
    'title.about': 'Parcours et compétences | Portfolio',
    'meta.home': 'Portfolio en informatique : projets, compétences et parcours à Sorbonne Université.',
    'meta.projects': 'Projets en informatique : développement logiciel, algorithmique et simulation.',
    'meta.resources': 'Sélection de films, séries, mangas et manhwas à redécouvrir.',
    'meta.about': 'Parcours, formation et compétences en informatique à Sorbonne Université.',
    'nav.home': 'Accueil',
    'nav.projects': 'Projet',
    'nav.resources': 'Ressources',
    'nav.about': 'À propos',
    'home.tag': 'Étudiant en informatique',
    'home.bio': "Je ne sais pas quoi dire d'autre...",
    'home.headline': 'Bienvenue',
    'home.weirdSite': 'Site web bizarre à ne surtout pas consulter : <a href="https://zepha.cyou" target="_blank" rel="noopener noreferrer">zepha.cyou</a>',
    'home.btn.github': 'GitHub',
    'home.btn.linkedin': 'LinkedIn',
    'home.btn.contact': 'Contact',
    'home.stats.languages': 'Langages utilisés',
    'home.stats.projects': 'Projets réalisés',
    'home.stats.degree': 'Licence Informatique',
    'home.stats.grad': 'Diplôme prévu',
    'projects.title': 'Projets <span class="accent">scolaires</span>',
    'projects.subtitle': 'C’était sympa… je suppose.',
    'projects.filter.label': 'Filtrer les projets par langage',
    'projects.filter.all': 'Tous',
    'projects.filter.count': '{count} projets',
    'projects.filter.count.one': '{count} projet',
    'projects.p1.title': 'Prédiction',
    'projects.p1.desc': "Algorithmes KNN et classification bayésienne pour prédire la qualité carbone des sources d'énergie. Données open source RTE & Météo France.",
    'projects.p2.title': 'Automate',
    'projects.p2.desc': 'Étude des automates et des graphes, avec des algorithmes et des visualisations autour de problèmes de mathématiques discrètes.',
    'projects.p3.title': 'Écosystème',
    'projects.p3.desc': "Simulation en C d'un écosystème proies-prédateurs, avec modélisation des interactions entre espèces.",
    'projects.p4.title': 'SDC',
    'projects.p4.desc': "Simulateur de processeur en C capable d'exécuter un langage assembleur personnalisé.",
    'projects.p5.title': 'Fractale',
    'projects.p5.desc': 'Visualisation interactive de la fractale de Mandelbrot en Java. Zoom, déplacement, thèmes de couleurs, export PNG/JPEG/BMP.',
    'projects.p6.title': 'Jeu de la vie',
    'projects.p6.desc': 'Simulation du jeu de la vie de Conway, avec grille interactive, contrôle de la vitesse et motifs prédéfinis.',
    'resources.title': 'Sélection <span class="accent">culturelle</span>',
    'resources.subtitle': 'Quelques films, séries, animes, mangas et manhwas que j’ai aimés.',
    'resources.screen.title': 'Films',
    'resources.series.title': 'Séries',
    'resources.anime.title': 'Anime',
    'resources.childhood.title': 'Dessins animés & enfance',
    'resources.screen.1.t': 'Interstellar',
    'resources.screen.1.d': 'Visuellement incroyable, un très beau mélange de science et d’émotion.',
    'resources.screen.2.t': 'Whiplash',
    'resources.screen.2.d': 'Intense du début à la fin, avec une mise en scène remarquable.',
    'resources.screen.3.t': 'Dark (série)',
    'resources.screen.3.d': 'Un scénario dense et intelligent qui demande de rester attentif.',
    'resources.screen.4.t': 'Arcane (série)',
    'resources.screen.4.d': 'Une direction artistique remarquable et une narration solide.',
    'resources.manga.title': 'Mangas & manhwas',
    'resources.manhwa.title': 'Manhwas',
    'resources.manga.1.t': 'Sousou no Frieren',
    'resources.manga.1.d': 'Une œuvre profonde et émouvante, qui célèbre la mémoire, le temps et les liens humains.',
    'resources.manga.2.t': 'Jumyou wo Kaitotte Moratta. Ichinen ni Tsuki, Ichimanen de.',
    'resources.manga.2.d': 'Une histoire intime et ambitieuse, avec une atmosphère singulière et une vraie richesse émotionnelle.',
    'resources.manga.3.t': 'Le Prix du reste de ma vie',
    'resources.manga.3.d': 'Un titre fort et sensible, qui laisse une impression durable par sa réflexion sur le choix et la vie.',
    'resources.manga.4.t': 'The Horizon',
    'resources.manga.4.d': 'Un univers captivant, entre atmosphère, tension et réflexion sur le monde.',
    'resources.music.title': 'Musique',
    'resources.music.thanks': 'Merci à Mostafa Alagamy d’avoir créé Metrolist et de l’avoir rendu open source.',
    'resources.music.description': 'J’écoute un peu de tout, dans différentes langues, mais surtout en français et en anglais.',
    'resources.music.nowPlaying': 'En ce moment : Me & U — Tems',
    'resources.finance.title': 'Stratégie financière',
    'resources.finance.description': 'Pour l’instant : PEA · DCA · ETF monde.',
    'about.skills': 'Compétences',
    'about.quick': 'En quelques mots',
    'about.f1.l': 'Basé à',
    'about.f1.v': 'Paris, France',
    'about.f2.l': 'Formation',
    'about.f2.v': 'Licence Info · Sorbonne',
    'about.f3.l': 'Intérêt actuel',
    'about.f3.v': 'Algorithmique, développement web et qualité logicielle',
    'about.f4.l': 'Méthode',
    'about.f4.v': 'Une approche pragmatique, avec le souci du détail',
    'about.f5.l': 'Appareil photo',
    'about.f5.v': 'Sony A6000',
    'about.f6.l': 'Objectif',
    'about.f6.v': 'Participer à des projets utiles et concrets',
    'about.tools': 'Outils & logiciels',
    'about.credits.title': 'Crédits & mentions légales',
    'about.credits.1': 'Style : Glassmorphism · Police : Syne (Google Fonts)',
    'about.credits.2': 'Appareil photo : Sony A6000',
    'about.credits.3': "Les icônes et technologies présentées sont la propriété de leurs détenteurs respectifs, utilisées à des fins d'identification uniquement.",
    'about.credits.ai': 'Ce site a été réalisé avec l’aide de l’IA.',
    'footer.copy': '© 2025 · Tous droits réservés',
    'footer.updated': 'Mis à jour le'
  },
  en: {
    'title.home': 'Software development | Portfolio',
    'title.projects': 'School projects | Portfolio',
    'title.resources': 'Culture picks | Portfolio',
    'title.about': 'Background and skills | Portfolio',
    'meta.home': 'Computer science portfolio: projects, skills, and studies at Sorbonne University.',
    'meta.projects': 'Computer science projects in software development, algorithms, and simulation.',
    'meta.resources': 'A selection of films, series, manga, and manhwa to rediscover.',
    'meta.about': 'Background, education, and computer science skills at Sorbonne University.',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.resources': 'Resources',
    'nav.about': 'About',
    'home.tag': 'Computer science student',
    'home.bio': "I don't know what else to say...",
    'home.headline': 'Welcome',
    'home.weirdSite': 'A strange website you should definitely not visit: <a href="https://zepha.cyou" target="_blank" rel="noopener noreferrer">zepha.cyou</a>',
    'home.btn.github': 'GitHub',
    'home.btn.linkedin': 'LinkedIn',
    'home.btn.contact': 'Contact',
    'home.stats.languages': 'Languages used',
    'home.stats.projects': 'Completed projects',
    'home.stats.degree': 'Computer Science degree',
    'home.stats.grad': 'Expected graduation',
    'projects.title': 'School <span class="accent">projects</span>',
    'projects.subtitle': 'It was fun… I guess.',
    'projects.filter.label': 'Filter projects by language',
    'projects.filter.all': 'All',
    'projects.filter.count': '{count} projects',
    'projects.filter.count.one': '{count} project',
    'projects.p1.title': 'Prediction',
    'projects.p1.desc': 'KNN algorithms and Bayesian classification to predict the carbon quality of energy sources. Open-source data from RTE & Meteo France.',
    'projects.p2.title': 'Automata',
    'projects.p2.desc': 'Exploring automata and graphs through algorithms and visualizations for discrete mathematics problems.',
    'projects.p3.title': 'Ecosystem',
    'projects.p3.desc': 'A predator-prey ecosystem simulation in C, modeling interactions between species.',
    'projects.p4.title': 'CPU Simulator',
    'projects.p4.desc': 'A processor simulator in C that can run a custom assembly language.',
    'projects.p5.title': 'Fractal',
    'projects.p5.desc': 'Interactive Mandelbrot fractal visualization in Java. Zoom, pan, color themes, and PNG/JPEG/BMP export.',
    'projects.p6.title': 'Game of Life',
    'projects.p6.desc': "A simulation of Conway's Game of Life, with an interactive grid, speed controls, and preset patterns.",
    'resources.title': 'Culture <span class="accent">picks</span>',
    'resources.subtitle': 'A few films, series, anime, manga, and manhwa that I have enjoyed.',
    'resources.screen.title': 'Films',
    'resources.series.title': 'Series',
    'resources.anime.title': 'Anime',
    'resources.childhood.title': 'Cartoons & childhood',
    'resources.screen.1.t': 'Interstellar',
    'resources.screen.1.d': 'Visually stunning, great blend of science and emotion.',
    'resources.screen.2.t': 'Whiplash',
    'resources.screen.2.d': 'Intense from start to finish, very sharp direction.',
    'resources.screen.3.t': 'Dark (series)',
    'resources.screen.3.d': 'Dense and intelligent writing, requires attention.',
    'resources.screen.4.t': 'Arcane (series)',
    'resources.screen.4.d': 'Top-tier art direction and strong storytelling.',
    'resources.manga.title': 'Manga & manhwa',
    'resources.manhwa.title': 'Manhwa',
    'resources.manga.1.t': 'Sousou no Frieren',
    'resources.manga.1.d': 'A deeply moving work that explores memory, time, and human connection.',
    'resources.manga.2.t': 'Jumyou wo Kaitotte Moratta. Ichinen ni Tsuki, Ichimanen de.',
    'resources.manga.2.d': 'A personal and ambitious story with a unique atmosphere and strong emotional depth.',
    'resources.manga.3.t': 'The Price of the Rest of My Life',
    'resources.manga.3.d': 'A moving and reflective title that lingers through its ideas on choice and life.',
    'resources.manga.4.t': 'The Horizon',
    'resources.manga.4.d': 'A captivating world, with atmosphere, tension, and thoughtful reflection.',
    'resources.music.title': 'Music',
    'resources.music.thanks': 'Thanks to Mostafa Alagamy for creating Metrolist and making it open source.',
    'resources.music.description': 'I listen to a bit of everything in different languages, but mostly in French and English.',
    'resources.music.nowPlaying': 'Listening now: Me & U — Tems',
    'resources.finance.title': 'Financial strategy',
    'resources.finance.description': 'For now: PEA · DCA · global ETF.',
    'about.skills': 'Skills',
    'about.quick': 'In a few words',
    'about.f1.l': 'Based in',
    'about.f1.v': 'Paris, France',
    'about.f2.l': 'Education',
    'about.f2.v': 'CS degree · Sorbonne',
    'about.f3.l': 'Current interest',
    'about.f3.v': 'Algorithms, web development, and software quality',
    'about.f4.l': 'Method',
    'about.f4.v': 'A practical approach with an eye for detail',
    'about.f5.l': 'Camera',
    'about.f5.v': 'Sony A6000',
    'about.f6.l': 'Focus',
    'about.f6.v': 'Contributing to useful, practical projects',
    'about.tools': 'Tools & software',
    'about.credits.title': 'Credits & legal notice',
    'about.credits.1': 'Style: Glassmorphism · Font: Syne (Google Fonts)',
    'about.credits.2': 'Camera: Sony A6000',
    'about.credits.3': 'The logos and technologies shown are owned by their respective holders and used for identification purposes only.',
    'about.credits.ai': 'This site was created with the help of AI.',
    'footer.copy': '© 2025 · All rights reserved',
    'footer.updated': 'Updated on'
  }
};

let currentLang = localStorage.getItem('siteLang') || 'fr';
if (!I18N[currentLang]) currentLang = 'fr';

function t(key) {
  return (I18N[currentLang] && I18N[currentLang][key]) || key;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (typeof value === 'string' && value.includes('<')) el.innerHTML = value;
    else el.textContent = value;
  });

  const bodyTitleKey = document.body.getAttribute('data-i18n-title');
  if (bodyTitleKey) document.title = t(bodyTitleKey);

  document.querySelectorAll('[data-i18n-content]').forEach(el => {
    const key = el.getAttribute('data-i18n-content');
    el.setAttribute('content', t(key));
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria-label');
    el.setAttribute('aria-label', t(key));
  });

  const switchLabel = currentLang === 'fr' ? 'EN' : 'FR';
  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.textContent = switchLabel;
    btn.setAttribute('aria-label', currentLang === 'fr' ? 'Switch to English' : 'Passer en français');
  });
}

function toggleLanguage() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('siteLang', currentLang);
  applyTranslations();
  injectLastUpdated();
  document.dispatchEvent(new Event('siteLanguageChanged'));
}

document.querySelectorAll('[data-lang-switch]').forEach(btn => {
  btn.addEventListener('click', () => {
    toggleLanguage();
    if (fullscreenMenu && fullscreenMenu.classList.contains('active')) closeMenu();
  });
});

// ── Derniere mise a jour (automatique) ──
function injectLastUpdated() {
  const footerTitle = document.querySelector('footer h5');
  if (!footerTitle) return;

  const raw = document.lastModified;
  if (!raw) return;

  const d = new Date(raw);
  if (Number.isNaN(d.getTime())) return;

  const locale = currentLang === 'en' ? 'en-GB' : 'fr-FR';
  const formatted = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(d);

  const oldSuffix = footerTitle.querySelector('.last-updated');
  if (oldSuffix) oldSuffix.remove();

  const suffix = document.createElement('span');
  suffix.className = 'last-updated';
  suffix.textContent = ` · ${t('footer.updated')} ${formatted}`;
  suffix.style.opacity = '0.9';
  footerTitle.appendChild(suffix);
}

applyTranslations();
injectLastUpdated();