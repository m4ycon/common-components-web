const track = document.querySelector('.track');
let slides = Array.from(track.children);

const dotsNav = document.querySelector('.nav');
let dots = Array.from(dotsNav.children);

const nextBtn = document.querySelector('.carousel-btn-right');
const prevBtn = document.querySelector('.carousel-btn-left');

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
  let nextSlide = currentSlide.nextElementSibling;
  if (!nextSlide) nextSlide = slides[0];

  changeAbsolutePosSlideAndUpdateDots(currentSlide, nextSlide, 'right');
  moveSlides(currentSlide, nextSlide);
};

prevBtn.onclick = () => {
  const currentSlide = track.querySelector('.current-slide');
  let prevSlide = currentSlide.previousElementSibling;
  if (!prevSlide) prevSlide = slides[slides.length - 1];

  changeAbsolutePosSlideAndUpdateDots(currentSlide, prevSlide, 'left');
  moveSlides(currentSlide, prevSlide);
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
  const amountToMove = targetSlide.style.left;
  track.style.transform = `translateX(${-amountToMove.split('px')[0]}px)`;
  track.style.transition = 'transform 2s ease-in-out';

  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
  if (!targetDot) return;
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};

const changeAbsolutePosSlideAndUpdateDots = (
  currentSlide,
  targetSlide,
  direction
) => {
  const [currentPos] = currentSlide.style.left.split('px');
  const [targetPos] = targetSlide.style.left.split('px');

  if (Number(currentPos) > Number(targetPos) && direction === 'right') {
    targetSlide.style.left =
      Number(currentPos) + currentSlide.getBoundingClientRect().width + 'px';
  }

  if (Number(currentPos) < Number(targetPos) && direction === 'left') {
    targetSlide.style.left =
      Number(currentPos) - currentSlide.getBoundingClientRect().width + 'px';
  }

  updateDots(
    dots[slides.indexOf(currentSlide)],
    dots[slides.indexOf(targetSlide)]
  );
};

setInterval(() => {
  nextBtn.click();
}, 7000);
