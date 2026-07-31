document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-gemluxjewel-hero]').forEach((hero) => {
    const slides = hero.querySelectorAll('[data-gemluxjewel-hero-slide]');
    const preview = hero.querySelector('[data-gemluxjewel-hero-preview]');
    const previewLabel = hero.querySelector('[data-gemluxjewel-hero-preview-label]');
    const previewDesc = hero.querySelector('[data-gemluxjewel-hero-preview-desc]');
    const prefixEl = hero.querySelector('[data-gemluxjewel-hero-prefix]');
    const titleEl = hero.querySelector('[data-gemluxjewel-hero-title]');
    const textEl = hero.querySelector('[data-gemluxjewel-hero-text]');
    const buttonWrap = hero.querySelector('[data-gemluxjewel-hero-button]');
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

    const getPreviewSrc = (slide) => {
      if (!slide) return '';
      if (slide.dataset.previewSrc) return slide.dataset.previewSrc;
      const img = slide.querySelector('img');
      return img ? img.currentSrc || img.src : '';
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
          link.childNodes.forEach((node) => {
            if (node !== arrow) link.removeChild(node);
          });
          if (arrow) {
            link.insertBefore(document.createTextNode(`${label} `), arrow);
          } else {
            link.textContent = label;
          }
        }
      }
    };

    const applyNextPreview = (index) => {
      if (!preview && !previewLabel && !previewDesc) return;

      const nextIndex = (index + 1) % slides.length;
      const nextSlide = slides[nextIndex];
      const nextSrc = getPreviewSrc(nextSlide);

      if (preview && nextSrc) {
        preview.src = nextSrc;
      }

      if (previewLabel) previewLabel.textContent = nextSlide.dataset.slidePrefix || '';
      if (previewDesc) previewDesc.textContent = nextSlide.dataset.slideHeading || '';
    };

    const show = (index) => {
      slides.forEach((slide, i) => slide.classList.toggle('is-active', i === index));
      syncVideos(index);
      applyActiveContent(slides[index]);
      applyNextPreview(index);

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
    if (slides.length > 1) {
      timer = setInterval(next, duration);

      hero.addEventListener('mouseenter', () => clearInterval(timer));
      hero.addEventListener('mouseleave', () => {
        timer = setInterval(next, duration);
      });
    }
  });
});
