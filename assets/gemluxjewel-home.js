document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gemluxjewel-hero]').forEach((hero) => {
    const slides = hero.querySelectorAll('[data-gemluxjewel-hero-slide]');
    const previewEl = hero.querySelector('[data-gemluxjewel-hero-preview]');
    const preview = previewEl && previewEl.tagName === 'IMG' ? previewEl : null;
    const progress = hero.querySelector('[data-gemluxjewel-hero-progress]');
    if (!slides.length) return;

    const duration = parseInt(hero.dataset.autoplay || '5000', 10);
    let current = 0;
    let timer;

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

    const show = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      syncVideos(index);

      if (preview && slides[index]) {
        const previewSrc = slides[index].dataset.previewSrc;
        if (previewSrc) {
          preview.src = previewSrc;
        } else {
          const img = slides[index].querySelector('img');
          if (img) preview.src = img.currentSrc || img.src;
        }
      }

      if (progress) {
        progress.style.transition = 'none';
        progress.style.width = '0%';
        requestAnimationFrame(() => {
          progress.style.transition = `width ${duration}ms linear`;
          progress.style.width = '100%';
        });
      }
    };

    const next = () => {
      current = (current + 1) % slides.length;
      show(current);
    };

    show(0);
    timer = setInterval(next, duration);

    hero.addEventListener('mouseenter', () => clearInterval(timer));
    hero.addEventListener('mouseleave', () => {
      timer = setInterval(next, duration);
    });
  });
});
