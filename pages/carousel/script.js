const track = document.querySelector('.track');
let slides = Array.from(track.children);

const dotsNav = document.querySelector('.nav');
let dots = Array.from(dotsNav.children);

const nextBtn = document.querySelector('.carousel-btn-right');
const prevBtn = document.querySelector('.carousel-btn-left');

let changeSlideEvent = true;
const scrollingTimeS = 2;
const scrollingTimeMs = scrollingTimeS * 1000;

const getSlideStyleLeft = index =>
  Number(slides[index].style.left.split('px')[0]);

const getSlideWidth = () => slides[0].getBoundingClientRect().width;

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
  if (!changeSlideEvent) return;

  const currentSlide = track.querySelector('.current-slide');
  let nextSlide = currentSlide.nextElementSibling;

  if (!nextSlide) {
    // infinity effect
    nextSlide = slides[0];
    const rearrangementInitialPos =
      getSlideStyleLeft(slides.indexOf(currentSlide)) + getSlideWidth();
    nextSlide.style.left = rearrangementInitialPos + 'px';

    moveSlides(currentSlide, nextSlide);

    // changing position of all slides, but not the last
    for (let i = 1; i < slides.length - 1; i++) {
      slides[i].style.left =
        getSlideStyleLeft(slides.length - 1) + getSlideWidth() * (i + 1) + 'px';
    }

    // changing the last with a timer to not disturb the user
    setTimeout(() => {
      slides[slides.length - 1].style.left =
        getSlideStyleLeft(slides.length - 2) + getSlideWidth() + 'px';
    }, scrollingTimeMs);
  } else {
    moveSlides(currentSlide, nextSlide);
  }

  updateDots(
    dots[slides.indexOf(currentSlide)],
    dots[slides.indexOf(nextSlide)]
  );

  changeSlideEvent = false;
  setTimeout(() => changeSlideEvent = true, scrollingTimeMs);
};

prevBtn.onclick = () => {
  if (!changeSlideEvent) return;

  const currentSlide = track.querySelector('.current-slide');
  let prevSlide = currentSlide.previousElementSibling;

  if (!prevSlide) {
    // infinity effect
    prevSlide = slides[slides.length - 1];
    const rearrangementInitialPos = getSlideStyleLeft(0) - getSlideWidth();
    prevSlide.style.left = rearrangementInitialPos + 'px';

    moveSlides(currentSlide, prevSlide);

    // changing position of all slides, but not the first
    for (let i = slides.length - 1; i > 0; i--) {
      slides[i].style.left =
        getSlideStyleLeft(0) - getSlideWidth() * (slides.length - i) + 'px';
    }

    // changing the first with a timer to not disturb the user
    setTimeout(() => {
      slides[0].style.left = getSlideStyleLeft(1) - getSlideWidth() + 'px';
    }, scrollingTimeMs);
  } else {
    moveSlides(currentSlide, prevSlide);
  }

  updateDots(
    dots[slides.indexOf(currentSlide)],
    dots[slides.indexOf(prevSlide)]
  );

  changeSlideEvent = false;
  setTimeout(() => changeSlideEvent = true, scrollingTimeMs);
};

dotsNav.onclick = event => {
  if (!changeSlideEvent) return;

  const currentDot = dotsNav.querySelector('.current-slide');
  const targetDot = event.target.closest('button');
  if (!targetDot) return;

  const currentSlide = track.querySelector('.current-slide');
  const indexDot = dots.indexOf(targetDot);
  const targetSlide = slides[indexDot];

  moveSlides(currentSlide, targetSlide);
  updateDots(currentDot, targetDot);

  changeSlideEvent = false;
  setTimeout(() => changeSlideEvent = true, scrollingTimeMs);
};

const moveSlides = (currentSlide, targetSlide) => {
  const amountToMove = getSlideStyleLeft(slides.indexOf(targetSlide));
  track.style.transform = `translateX(${-amountToMove}px)`;
  track.style.transition = `transform ${scrollingTimeS}s ease-in-out`;

  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
};

const updateDots = (currentDot, targetDot) => {
  if (!targetDot) return;
  currentDot.classList.remove('current-slide');
  targetDot.classList.add('current-slide');
};

setInterval(() => nextBtn.click(), 12000);
