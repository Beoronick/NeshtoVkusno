window.addEventListener('load', main, { once: true });

function main() {
  Array.from(document.querySelectorAll('.carousel')).forEach((c) => {
    const slides = Array.from(c.querySelectorAll('.carousel-slide'));
    const indicators = Array.from(
      c.querySelectorAll('.carousel-indicators > [data-slide-to]')
    );

    const slideDuration = Number(c.dataset.slideDuration) || 5000;

    let currentSlide = c.querySelector('.carousel-slide.active') || slides[0];
    currentSlide.classList.add('active');

    let index = slides.indexOf(currentSlide);
    let currentIndicator = indicators[index];
    currentIndicator?.classList.add('active');

    const pendingTimeouts = new Set();

    function slideLeft(el) {
      el.classList.add('slide-left');

      const handle = setTimeout(() => {
        el.classList.remove('slide-left');
        pendingTimeouts.delete(handle);
      }, 550);

      pendingTimeouts.add(handle);
    }

    function changeSlide() {
      currentSlide.classList.remove('active');
      currentIndicator?.classList.remove('active');

      slideLeft(currentSlide);

      if (++index >= slides.length) {
        index = 0;
      }

      currentSlide = slides[index];
      currentIndicator = indicators[index];

      slideLeft(currentSlide);

      currentSlide.classList.add('active');
      currentIndicator?.classList.add('active');
    }

    let intervalHandle = setInterval(changeSlide, slideDuration);

    c.querySelector('.carousel-indicators').addEventListener(
      'click',
      function (e) {
        if (pendingTimeouts.size !== 0) {
          return;
        }

        const slideTo = Number(e.target.dataset.slideTo);

        if (index === slideTo) {
          return;
        }

        if (!Number.isNaN(slideTo)) {
          clearInterval(intervalHandle);

          index = slideTo - 1;
          changeSlide();
          intervalHandle = setInterval(changeSlide, slideDuration);
        }
      }
    );
  });
}
