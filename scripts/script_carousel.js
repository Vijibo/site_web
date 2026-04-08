/* ============================================
   SCRIPT CAROUSEL + MODAL — Victor Ji
   ============================================ */

let slideIndex = 0;
const slides = document.querySelectorAll('.carousel-item');
const inner  = document.querySelector('.carousel-inner');
const total  = slides.length;

// ── Carousel principal ──
function showSlide(index) {
  slideIndex = ((index % total) + total) % total;
  inner.style.transform = `translateX(${-slideIndex * 100}%)`;
  setInlineMeta(slideIndex);
}

function nextSlide() { showSlide(slideIndex + 1); }
function prevSlide() { showSlide(slideIndex - 1); }

// Auto-avance
let autoPlay = setInterval(nextSlide, 4000);
function resetAuto() {
  clearInterval(autoPlay);
  autoPlay = setInterval(nextSlide, 4000);
}

// ── Modal ──
const modal     = document.getElementById('photo-modal');
const modalImg  = document.getElementById('modal-img');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
const modalClose = document.getElementById('modal-close');
const modalCount = document.getElementById('modal-count');
const modalMeta = document.getElementById('modal-meta');
const inlineMeta = document.getElementById('photo-meta-inline');
let modalIndex  = 0;

const allImgs = Array.from(document.querySelectorAll('.carousel-item img'));

function setInlineMeta(index) {
  const img = allImgs[((index % total) + total) % total];
  if (!img || !inlineMeta) return;
  const gear = img.dataset.gear || 'Sony A6000 · Réglages à compléter';
  const place = img.dataset.place || 'Lieu à compléter';
  inlineMeta.textContent = `${gear} · ${place}`;
}

function openModal(index) {
  modalIndex = ((index % total) + total) % total;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  updateModal();
}

function closeModal() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function updateModal(direction = 0) {
  const img = allImgs[modalIndex];
  if (!img) return;
  const gear = img.dataset.gear || 'Sony A6000 · Réglages à compléter';
  const place = img.dataset.place || 'Lieu à compléter';
  const metaText = `${gear} · ${place}`;

  // Animation de transition
  modalImg.style.transition = 'none';
  modalImg.style.transform  = direction === 1 ? 'translateX(40px)' : direction === -1 ? 'translateX(-40px)' : 'translateX(0)';
  modalImg.style.opacity    = direction !== 0 ? '0' : '1';

  requestAnimationFrame(() => {
    modalImg.src = img.src;
    modalImg.alt = img.alt;
    modalImg.style.transition = 'transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease';
    requestAnimationFrame(() => {
      modalImg.style.transform = 'translateX(0)';
      modalImg.style.opacity   = '1';
    });
  });

  if (modalCount) modalCount.textContent = `${modalIndex + 1} / ${total}`;
  if (modalMeta) modalMeta.textContent = metaText;
  if (inlineMeta) inlineMeta.textContent = metaText;
}

function modalNextImg() {
  modalIndex = (modalIndex + 1) % total;
  updateModal(1);
}
function modalPrevImg() {
  modalIndex = ((modalIndex - 1) + total) % total;
  updateModal(-1);
}

// Clics sur les images du carousel → ouvre la modal
allImgs.forEach((img, i) => {
  img.addEventListener('click', () => openModal(i));
});

// Boutons modal
modalPrev  && modalPrev.addEventListener('click',  e => { e.stopPropagation(); modalPrevImg(); });
modalNext  && modalNext.addEventListener('click',  e => { e.stopPropagation(); modalNextImg(); });
modalClose && modalClose.addEventListener('click', closeModal);

// Clic fond → ferme
modal && modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Clavier
document.addEventListener('keydown', e => {
  if (!modal || !modal.classList.contains('active')) return;
  if (e.key === 'ArrowRight') modalNextImg();
  if (e.key === 'ArrowLeft')  modalPrevImg();
  if (e.key === 'Escape')     closeModal();
});

// Swipe tactile modal
let touchStartX = 0;
modal && modal.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
modal && modal.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(dx) > 40) { dx < 0 ? modalNextImg() : modalPrevImg(); }
});

// Swipe carousel
let carouselTouchX = 0;
inner && inner.addEventListener('touchstart', e => { carouselTouchX = e.touches[0].clientX; });
inner && inner.addEventListener('touchend',   e => {
  const dx = e.changedTouches[0].clientX - carouselTouchX;
  if (Math.abs(dx) > 40) { dx < 0 ? nextSlide() : prevSlide(); resetAuto(); }
});

showSlide(0);
updateModal(0);