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

  const currentDot = dotsNav.querySelector('.current-slide');
  let nextDot = currentDot.nextElementSibling;

  if (!nextDot) nextDot = dots[0];

  const [currentPos] = currentSlide.style.left.split('px');
  const [nextPos] = nextSlide.style.left.split('px');

  if (Number(currentPos) > Number(nextPos)) {
    nextSlide.style.left =
      Number(currentPos) + currentSlide.getBoundingClientRect().width + 'px';

    updateDots(
      dots[slides.indexOf(currentSlide)],
      dots[slides.indexOf(nextSlide)]
    );
  } else {
    updateDots(currentDot, nextDot);
  }

  moveSlides(currentSlide, nextSlide);
};

prevBtn.onclick = () => {
  const currentSlide = track.querySelector('.current-slide');
  let prevSlide = currentSlide.previousElementSibling;

  if (!prevSlide) prevSlide = slides[slides.length - 1];
  
  const currentDot = dotsNav.querySelector('.current-slide');
  let prevDot = currentDot.previousElementSibling;
  
  if (!prevDot) prevDot = dots[dots.length - 1];

  const [currentPos] = currentSlide.style.left.split('px');
  const [prevPos] = prevSlide.style.left.split('px');

  if (Number(currentPos) < Number(prevPos)) {
    prevSlide.style.left =
      Number(currentPos) - currentSlide.getBoundingClientRect().width + 'px';

    updateDots(
      dots[slides.indexOf(currentSlide)],
      dots[slides.indexOf(prevSlide)]
    );
  } else {
    updateDots(currentDot, prevDot);
  }

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
  track.style.transition = 'transform 1s ease-in-out';

  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
  if (!targetDot) return;
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};
