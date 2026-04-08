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
    const r  = eyeBall.getBoundingClientRect();
    const cx = r.left + r.width  / 2;
    const cy = r.top  + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const angle = Math.atan2(dy, dx);
    const dist  = Math.min(Math.hypot(dx, dy), 10);
    pupil.style.transform = `translate(${dist * Math.cos(angle) - 8}px, ${dist * Math.sin(angle) - 8}px)`;
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

// ── Navbar mobile — plein écran ──
const hamMenu       = document.querySelector('.ham-menu');
const fullscreenMenu = document.querySelector('.fullscreen-menu');
const menuClose     = document.querySelector('.menu-close');

function openMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.style.display = 'flex';
  requestAnimationFrame(() => fullscreenMenu.classList.add('active'));
  hamMenu && hamMenu.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  if (!fullscreenMenu) return;
  fullscreenMenu.classList.remove('active');
  hamMenu && hamMenu.classList.remove('active');
  document.body.style.overflow = '';
  // reset animations
  setTimeout(() => {
    fullscreenMenu.style.display = 'none';
    fullscreenMenu.querySelectorAll('li a').forEach(a => {
      a.style.animation = 'none';
      a.style.opacity   = '0';
      a.style.transform = 'translateY(60px)';
      requestAnimationFrame(() => {
        a.style.animation = '';
      });
    });
    const line = fullscreenMenu.querySelector('.menu-accent-line');
    if (line) { line.style.animation = 'none'; requestAnimationFrame(() => line.style.animation = ''); }
  }, 400);
}

hamMenu    && hamMenu.addEventListener('click', openMenu);
menuClose  && menuClose.addEventListener('click', closeMenu);
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
const navLinks = document.querySelectorAll('.nav-top-right a');
const currentPage = window.location.pathname.split('/').pop();
navLinks.forEach(a => {
  if (a.getAttribute('href') === currentPage) a.classList.add('active');
});

function formatAudioTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

const musicPlayers = document.querySelectorAll('.music-player');

musicPlayers.forEach(player => {
  const audio = player.querySelector('.music-source');
  const playBtn = player.querySelector('.music-play');
  const progress = player.querySelector('.music-progress');
  const timeCurrent = player.querySelector('.music-current');
  const timeDuration = player.querySelector('.music-duration');

  if (!audio || !playBtn || !progress || !timeCurrent || !timeDuration) return;

  const updateProgress = () => {
    const percent = audio.duration ? Math.min((audio.currentTime / audio.duration) * 100, 100) : 0;
    progress.style.setProperty('--progress-width', `${percent}%`);
    timeCurrent.textContent = formatAudioTime(audio.currentTime);
    progress.setAttribute('aria-valuenow', Math.round(percent));
  };

  audio.addEventListener('loadedmetadata', () => {
    timeDuration.textContent = formatAudioTime(audio.duration);
  });

  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', () => {
    playBtn.textContent = '▶';
    player.dataset.playing = 'false';
  });

  audio.addEventListener('play', () => {
    musicPlayers.forEach(otherPlayer => {
      const otherAudio = otherPlayer.querySelector('.music-source');
      const otherBtn = otherPlayer.querySelector('.music-play');
      if (otherAudio && otherAudio !== audio) {
        otherAudio.pause();
        otherBtn.textContent = '▶';
        otherPlayer.dataset.playing = 'false';
      }
    });
    playBtn.textContent = '❚❚';
    player.dataset.playing = 'true';
  });

  audio.addEventListener('pause', () => {
    playBtn.textContent = '▶';
    player.dataset.playing = 'false';
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  progress.addEventListener('click', event => {
    if (!audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const percent = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    audio.currentTime = percent * audio.duration;
    updateProgress();
  });
});

// ── Langue (FR / EN) ──
const I18N = {
  fr: {
    'title.home': 'Victor Ji',
    'title.projects': 'Victor Ji · Projets',
    'title.resources': 'Victor Ji · Ressources',
    'title.about': 'Victor Ji · À propos',
    'meta.home': 'Portfolio de Victor Ji — Étudiant en informatique à Sorbonne Université',
    'meta.projects': 'Projets — Victor Ji',
    'meta.resources': 'Ressources — Victor Ji',
    'meta.about': 'À propos — Victor Ji',
    'nav.home': 'Accueil',
    'nav.projects': 'Projet',
    'nav.resources': 'Ressources',
    'nav.about': 'À propos',
    'home.tag': 'Étudiant en informatique · Sorbonne Université',
    'home.bio': 'Je construis des choses avec du code — des algorithmes aux interfaces, de Python à JavaScript.',
    'home.btn.github': 'GitHub',
    'home.btn.linkedin': 'LinkedIn',
    'home.btn.contact': 'Contact',
    'home.scroll': 'Scroll',
    'home.stats.languages': 'Langages maîtrisés',
    'home.stats.projects': 'Projets réalisés',
    'home.stats.degree': 'Licence Informatique',
    'home.stats.grad': 'Diplomé prévu',
    'projects.title': 'Mes <span class="accent">Projets</span>',
    'projects.subtitle': 'Sélection de projets récents · disposition éditoriale pour mieux mettre en valeur chaque visuel',
    'projects.p1.title': 'Prédiction',
    'projects.p1.desc': "Algorithmes KNN et classification bayésienne pour prédire la qualité carbone des sources d'énergie. Données open source RTE & Météo France.",
    'projects.p2.title': 'Automate',
    'projects.p2.desc': 'Modélisation des propriétés des automates et graphes. Algorithmes et visualisations pour des problèmes de mathématiques discrètes.',
    'projects.p3.title': 'Écosystème',
    'projects.p3.desc': "Simulation d'un écosystème Proies-Prédateurs en C. Modélisation des interactions entre espèces et dynamiques écologiques.",
    'projects.p4.title': 'SDC',
    'projects.p4.desc': "Simulateur de CPU en C capable d'exécuter un langage assembleur personnalisé. Simule les aspects clés d'une architecture processeur.",
    'projects.p5.title': 'Fractale',
    'projects.p5.desc': 'Visualisation interactive de la fractale de Mandelbrot en Java. Zoom, déplacement, thèmes de couleurs, export PNG/JPEG/BMP.',
    'projects.p6.title': 'Jeu de la vie',
    'projects.p6.desc': 'Simulation mathématique de Conway (1970) avec grille interactive, contrôle de vitesse et motifs de départ.',
    'resources.title': 'Mes <span class="accent">Ressources</span>',
    'resources.subtitle': "Un coin plus personnel : ce que j'ecoute, regarde et lis en ce moment",
    'resources.music.title': 'Sons du moment',
    'resources.music.1.t': 'ODESZA - A Moment Apart',
    'resources.music.1.d': 'Bon pour coder le soir, ambiance calme mais motivee.',
    'resources.music.2.t': 'FKJ - Ylang Ylang',
    'resources.music.2.d': 'Parfait quand je dois rester concentre longtemps.',
    'resources.music.3.t': 'Nujabes - Feather',
    'resources.music.3.d': 'Un classique que je remets souvent en boucle.',
    'resources.music.4.t': 'The Weeknd - Is There Someone Else?',
    'resources.music.4.d': "Son plus rythme, utile quand je manque d'energie.",
    'resources.screen.title': 'Recommandations films & series',
    'resources.screen.1.t': 'Interstellar',
    'resources.screen.1.d': 'Visuellement incroyable, tres bon melange science et emotion.',
    'resources.screen.2.t': 'Whiplash',
    'resources.screen.2.d': 'Intense du debut a la fin, mise en scene ultra propre.',
    'resources.screen.3.t': 'Dark (serie)',
    'resources.screen.3.d': 'Scenario dense et intelligent, il faut rester attentif.',
    'resources.screen.4.t': 'Arcane (serie)',
    'resources.screen.4.d': 'Direction artistique top niveau, narration tres solide.',
    'resources.manga.title': 'Mangas que je recommande',
    'resources.manga.1.t': 'Vagabond',
    'resources.manga.1.d': 'Dessin exceptionnel et progression du personnage marquante.',
    'resources.manga.2.t': '20th Century Boys',
    'resources.manga.2.d': 'Suspense tres bien construit, impossible a lacher.',
    'resources.manga.3.t': 'Blue Period',
    'resources.manga.3.d': 'Super motivant, surtout sur la discipline et la creativite.',
    'resources.manga.4.t': 'Vinland Saga',
    'resources.manga.4.d': 'Evolution des personnages et themes tres forts.',
    'resources.note.title': 'Note perso',
    'resources.note.body': 'Cette page evolue regulierement selon mes decouvertes. Si tu veux, je peux aussi faire une version "top 3 du mois" plus concise.',
    'about.subtitle': 'Licence Informatique · 2023 – 2026',
    'about.skills': 'Compétences',
    'about.quick': 'En quelques mots',
    'about.f1.l': 'Basé à',
    'about.f1.v': 'Paris, France',
    'about.f2.l': 'Formation',
    'about.f2.v': 'Licence Info · Sorbonne',
    'about.f3.l': 'Intérêt actuel',
    'about.f3.v': 'Algo, dev web et qualité logicielle',
    'about.f4.l': 'Méthode',
    'about.f4.v': 'Pragmatique, propre, orientée résultat',
    'about.f5.l': 'Appareil photo',
    'about.f5.v': 'Sony A6000',
    'about.f6.l': 'Ce que je cherche',
    'about.f6.v': 'Des projets utiles avec un vrai impact',
    'about.tools': 'Outils & logiciels',
    'about.credits.title': 'Crédits & mentions légales',
    'about.credits.1': 'Style : Glassmorphism · Police : Syne (Google Fonts)',
    'about.credits.2': 'Appareil photo : Sony A6000',
    'about.credits.3': "Les icônes et technologies présentées sont la propriété de leurs détenteurs respectifs, utilisées à des fins d'identification uniquement.",
    'footer.copy': '© 2025 Victor Ji · Tous droits réservés',
    'footer.updated': 'Mis a jour le'
  },
  en: {
    'title.home': 'Victor Ji',
    'title.projects': 'Victor Ji · Projects',
    'title.resources': 'Victor Ji · Resources',
    'title.about': 'Victor Ji · About',
    'meta.home': 'Victor Ji portfolio — Computer science student at Sorbonne University',
    'meta.projects': 'Projects — Victor Ji',
    'meta.resources': 'Resources — Victor Ji',
    'meta.about': 'About — Victor Ji',
    'nav.home': 'Home',
    'nav.projects': 'Projects',
    'nav.resources': 'Resources',
    'nav.about': 'About',
    'home.tag': 'Computer science student · Sorbonne University',
    'home.bio': 'I build things with code — from algorithms to interfaces, from Python to JavaScript.',
    'home.btn.github': 'GitHub',
    'home.btn.linkedin': 'LinkedIn',
    'home.btn.contact': 'Contact',
    'home.scroll': 'Scroll',
    'home.stats.languages': 'Languages mastered',
    'home.stats.projects': 'Completed projects',
    'home.stats.degree': 'Computer Science degree',
    'home.stats.grad': 'Expected graduation',
    'projects.title': 'My <span class="accent">Projects</span>',
    'projects.subtitle': 'Recent projects selection · editorial layout to better highlight each visual',
    'projects.p1.title': 'Prediction',
    'projects.p1.desc': 'KNN algorithms and Bayesian classification to predict the carbon quality of energy sources. Open-source data from RTE & Meteo France.',
    'projects.p2.title': 'Automata',
    'projects.p2.desc': 'Modeling automata and graph properties. Algorithms and visualizations for discrete mathematics problems.',
    'projects.p3.title': 'Ecosystem',
    'projects.p3.desc': 'Predator-prey ecosystem simulation in C. Modeling interactions between species and ecological dynamics.',
    'projects.p4.title': 'CPU Simulator',
    'projects.p4.desc': 'CPU simulator in C capable of running a custom assembly language. Recreates key processor architecture behaviors.',
    'projects.p5.title': 'Fractal',
    'projects.p5.desc': 'Interactive Mandelbrot fractal visualization in Java. Zoom, pan, color themes, and PNG/JPEG/BMP export.',
    'projects.p6.title': 'Game of Life',
    'projects.p6.desc': 'Conway (1970) mathematical simulation with interactive grid, speed control, and starter patterns.',
    'resources.title': 'My <span class="accent">Resources</span>',
    'resources.subtitle': 'A more personal corner: what I listen to, watch, and read these days',
    'resources.music.title': 'Songs of the moment',
    'resources.music.1.t': 'ODESZA - A Moment Apart',
    'resources.music.1.d': 'Great for evening coding, calm but motivating.',
    'resources.music.2.t': 'FKJ - Ylang Ylang',
    'resources.music.2.d': 'Perfect when I need long focus sessions.',
    'resources.music.3.t': 'Nujabes - Feather',
    'resources.music.3.d': 'A classic I keep replaying.',
    'resources.music.4.t': 'The Weeknd - Is There Someone Else?',
    'resources.music.4.d': 'More energetic track when I need a boost.',
    'resources.screen.title': 'Film & series recommendations',
    'resources.screen.1.t': 'Interstellar',
    'resources.screen.1.d': 'Visually stunning, great blend of science and emotion.',
    'resources.screen.2.t': 'Whiplash',
    'resources.screen.2.d': 'Intense from start to finish, very sharp direction.',
    'resources.screen.3.t': 'Dark (series)',
    'resources.screen.3.d': 'Dense and intelligent writing, requires attention.',
    'resources.screen.4.t': 'Arcane (series)',
    'resources.screen.4.d': 'Top-tier art direction and strong storytelling.',
    'resources.manga.title': 'Manga recommendations',
    'resources.manga.1.t': 'Vagabond',
    'resources.manga.1.d': 'Outstanding art and strong character growth.',
    'resources.manga.2.t': '20th Century Boys',
    'resources.manga.2.d': 'Very well-built suspense, hard to put down.',
    'resources.manga.3.t': 'Blue Period',
    'resources.manga.3.d': 'Highly motivating, especially on discipline and creativity.',
    'resources.manga.4.t': 'Vinland Saga',
    'resources.manga.4.d': 'Powerful themes and character development.',
    'resources.note.title': 'Personal note',
    'resources.note.body': 'This page evolves regularly with my discoveries. If you want, I can also make a shorter "top 3 of the month" version.',
    'about.subtitle': 'Computer Science degree · 2023 – 2026',
    'about.skills': 'Skills',
    'about.quick': 'In a few words',
    'about.f1.l': 'Based in',
    'about.f1.v': 'Paris, France',
    'about.f2.l': 'Education',
    'about.f2.v': 'CS degree · Sorbonne',
    'about.f3.l': 'Current interest',
    'about.f3.v': 'Algorithms, web dev, and software quality',
    'about.f4.l': 'Method',
    'about.f4.v': 'Pragmatic, clean, result-oriented',
    'about.f5.l': 'Camera',
    'about.f5.v': 'Sony A6000',
    'about.f6.l': 'What I am looking for',
    'about.f6.v': 'Useful projects with real impact',
    'about.tools': 'Tools & software',
    'about.credits.title': 'Credits & legal notice',
    'about.credits.1': 'Style: Glassmorphism · Font: Syne (Google Fonts)',
    'about.credits.2': 'Camera: Sony A6000',
    'about.credits.3': 'The logos and technologies shown are owned by their respective holders and used for identification purposes only.',
    'footer.copy': '© 2025 Victor Ji · All rights reserved',
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