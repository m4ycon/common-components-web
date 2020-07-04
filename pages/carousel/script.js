const track = document.querySelector('.track');
const slides = Array.from(track.children);

const nextBtn = document.querySelector('.carousel-btn-right');
const prevBtn = document.querySelector('.carousel-btn-left');

const dotsNav = document.querySelector('.nav');
const dots = Array.from(dotsNav.children);

const setSlidePosition = (slide, index) => {
  const slideWidth = slide.getBoundingClientRect().width;
  slide.style.left = slideWidth * index + 'px';
};

slides.map(setSlidePosition);

window.onresize = () => {
  slides.map(setSlidePosition);

  const currentSlide = track.querySelector('.current-slide');
  const amountToMove = currentSlide.style.left;

  track.style.transform = `translateX(-${amountToMove})`;
  track.style.transition = '';
};

nextBtn.onclick = () => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;

  const currentDot = dotsNav.querySelector('.current-slide');
  const nextDot = currentDot.nextElementSibling;

  moveSlides(currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
};

prevBtn.onclick = () => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;

  const currentDot = dotsNav.querySelector('.current-slide');
  const prevDot = currentDot.previousElementSibling;

  moveSlides(currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
};

dotsNav.onclick = event => {
  const currentDot = dotsNav.querySelector('.current-slide');
  const targetDot = event.target.closest('button');
  if (!targetDot) return;

  const currentSlide = track.querySelector('.current-slide');
  const indexDot = dots.indexOf(targetDot);
  const targetSlide = slides[indexDot];

  moveSlides(currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
};

const moveSlides = (currentSlide, targetSlide) => {
  if (!targetSlide) return;

  const amountToMove = targetSlide.style.left;
  track.style.transform = `translateX(-${amountToMove})`;
  track.style.transition = 'transform 1s ease-in-out';

  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
  if (!targetDot) return;
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};
