document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gemluxjewel-hero]').forEach((hero) => {
    const slides = hero.querySelectorAll('[data-gemluxjewel-hero-slide]');
    const contentInner = hero.querySelector('[data-gemluxjewel-hero-content]');
    const prefixEl = hero.querySelector('[data-gemluxjewel-hero-prefix]');
    const titleEl = hero.querySelector('[data-gemluxjewel-hero-title]');
    const textEl = hero.querySelector('[data-gemluxjewel-hero-text]');
    const buttonWrap = hero.querySelector('[data-gemluxjewel-hero-button]');
    const prevBtn = hero.querySelector('[data-gemluxjewel-hero-prev]');
    const nextBtn = hero.querySelector('[data-gemluxjewel-hero-next]');
    if (!slides.length) return;

    const duration = parseInt(hero.dataset.autoplay || '5000', 10);
    const fadeMs = 500;
    let current = 0;
    let timer;
    let isAnimating = false;

    const syncVideos = (index) => {
      slides.forEach((slide, i) => {
        const video = slide.querySelector('video');
        if (!video) return;

        if (i === index) {
          video.currentTime = 0;
          const playPromise = video.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
        } else {
          video.pause();
        }
      });
    };

    const applyActiveContent = (slide) => {
      if (!slide) return;

      if (prefixEl) prefixEl.textContent = slide.dataset.slidePrefix || '';
      if (titleEl) titleEl.textContent = slide.dataset.slideHeading || '';
      if (textEl) textEl.textContent = slide.dataset.slideText || '';

      if (buttonWrap) {
        const link = buttonWrap.querySelector('.gemluxjewel-btn');
        if (link) {
          const label = slide.dataset.slideButtonLabel || '';
          const href = slide.dataset.slideButtonLink || '#';
          const arrow = link.querySelector('.gemluxjewel-btn__arrow');

          link.href = href;
          Array.from(link.childNodes).forEach((node) => {
            if (node !== arrow) node.remove();
          });
          if (arrow) {
            link.insertBefore(document.createTextNode(`${label} `), arrow);
          } else {
            link.textContent = label;
          }
        }
      }
    };

    const updateSlides = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      syncVideos(index);
      applyActiveContent(slides[index]);
    };

    const show = (index) => {
      if (isAnimating || index === current) return;
      isAnimating = true;
      current = index;

      if (contentInner) contentInner.classList.add('is-fading');

      window.setTimeout(() => {
        updateSlides(index);
        if (contentInner) contentInner.classList.remove('is-fading');
        isAnimating = false;
      }, fadeMs);
    };

    const next = () => {
      show((current + 1) % slides.length);
    };

    const prev = () => {
      show((current - 1 + slides.length) % slides.length);
    };

    const startAutoplay = () => {
      if (slides.length <= 1) return;
      clearInterval(timer);
      timer = setInterval(next, duration);
    };

    const stopAutoplay = () => {
      clearInterval(timer);
    };

    updateSlides(0);
    startAutoplay();

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoplay();
        next();
        startAutoplay();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoplay();
        prev();
        startAutoplay();
      });
    }

    hero.addEventListener('mouseenter', stopAutoplay);
    hero.addEventListener('mouseleave', startAutoplay);
  });
});
