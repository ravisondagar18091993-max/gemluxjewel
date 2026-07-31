document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-Gemluxjewel-hero]').forEach((hero) => {
    const slides = hero.querySelectorAll('[data-Gemluxjewel-hero-slide]');
    const previewEl = hero.querySelector('[data-Gemluxjewel-hero-preview]');
    const preview = previewEl && previewEl.tagName === 'IMG' ? previewEl : null;
    const progress = hero.querySelector('[data-Gemluxjewel-hero-progress]');
    if (!slides.length) return;

    const duration = parseInt(hero.dataset.autoplay || '5000', 10);
    let current = 0;
    let timer;

    const show = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      if (preview && slides[index]) {
        const img = slides[index].querySelector('img');
        if (img) preview.src = img.currentSrc || img.src;
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
