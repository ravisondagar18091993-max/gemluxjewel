(function () {
  var AUTOPLAY_MS = 5000;
  var VISIBLE_THUMBS = 4;

  function pauseSlideMedia(slide) {
    if (!slide) return;
    slide.querySelectorAll('video').forEach(function (video) {
      video.pause();
    });
  }

  function isDesktopThumbs() {
    return window.matchMedia('(min-width: 990px)').matches;
  }

  function initGallery(root) {
    var gallery = (root || document).querySelector('[data-gemluxjewel-pdp-media]');
    if (!gallery || gallery.dataset.gemluxjewelPdpMediaReady === 'true') return;
    gallery.dataset.gemluxjewelPdpMediaReady = 'true';

    var slides = Array.prototype.slice.call(gallery.querySelectorAll('[data-pdp-media-slide]'));
    var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('.gemluxjewel-pdp-media__thumb'));
    var prevBtn = gallery.querySelector('[data-pdp-media-prev]');
    var nextBtn = gallery.querySelector('[data-pdp-media-next]');
    var counter = gallery.querySelector('[data-pdp-media-counter]');
    var autoplayBtn = gallery.querySelector('[data-pdp-media-autoplay]');
    var thumbsWrap = gallery.querySelector('[data-pdp-media-thumbs]');
    var stage = gallery.querySelector('.gemluxjewel-pdp-media__stage');

    if (!slides.length) return;

    var current = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (current < 0) current = 0;

    var autoplayTimer = null;
    var autoplayEnabled = slides.length > 1;

    function getThumbMetrics() {
      var styles = window.getComputedStyle(gallery);
      var size = parseFloat(styles.getPropertyValue('--pdp-media-thumb-size')) || 72;
      var gap = parseFloat(styles.getPropertyValue('--pdp-media-thumb-gap')) || 10;
      return { size: size, gap: gap };
    }

    function syncThumbViewport() {
      if (!thumbsWrap) return;

      var metrics = getThumbMetrics();
      var visibleCount = Math.min(VISIBLE_THUMBS, thumbs.length);
      var viewportSize = visibleCount * metrics.size + Math.max(visibleCount - 1, 0) * metrics.gap;

      if (isDesktopThumbs()) {
        thumbsWrap.style.height = viewportSize + 'px';
        thumbsWrap.style.width = metrics.size + 'px';
      } else {
        thumbsWrap.style.height = metrics.size + 'px';
        thumbsWrap.style.width = viewportSize + 'px';
      }

      thumbsWrap.classList.toggle('is-short', thumbs.length <= VISIBLE_THUMBS);
    }

    function updateCounter(index) {
      if (!counter) return;
      counter.textContent = (index + 1) + ' / ' + slides.length;
    }

    function scrollThumbIntoView(index) {
      if (!thumbsWrap || !thumbs[index]) return;

      var thumb = thumbs[index];

      if (isDesktopThumbs()) {
        var viewport = thumbsWrap.clientHeight;
        var thumbTop = thumb.offsetTop;
        var thumbBottom = thumbTop + thumb.offsetHeight;
        var scrollTop = thumbsWrap.scrollTop;
        var scrollBottom = scrollTop + viewport;

        if (thumbTop < scrollTop) {
          thumbsWrap.scrollTo({ top: thumbTop, behavior: 'smooth' });
        } else if (thumbBottom > scrollBottom) {
          thumbsWrap.scrollTo({ top: thumbBottom - viewport, behavior: 'smooth' });
        }
      } else {
        var viewportWidth = thumbsWrap.clientWidth;
        var thumbLeft = thumb.offsetLeft;
        var thumbRight = thumbLeft + thumb.offsetWidth;
        var scrollLeft = thumbsWrap.scrollLeft;
        var scrollRight = scrollLeft + viewportWidth;

        if (thumbLeft < scrollLeft) {
          thumbsWrap.scrollTo({ left: thumbLeft, behavior: 'smooth' });
        } else if (thumbRight > scrollRight) {
          thumbsWrap.scrollTo({ left: thumbRight - viewportWidth, behavior: 'smooth' });
        }
      }
    }

    function setAutoplayUi(playing) {
      if (!autoplayBtn) return;
      autoplayBtn.classList.toggle('is-playing', playing);
      autoplayBtn.classList.toggle('is-paused', !playing);
      autoplayBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      autoplayBtn.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      if (!autoplayEnabled || slides.length <= 1) return;
      autoplayTimer = window.setInterval(function () {
        goTo(current + 1, { fromAutoplay: true });
      }, AUTOPLAY_MS);
    }

    function goTo(index, options) {
      options = options || {};
      var nextIndex = index;
      if (nextIndex < 0) nextIndex = slides.length - 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      if (nextIndex === current && !options.force) return;

      pauseSlideMedia(slides[current]);

      slides[current].classList.remove('is-active');
      slides[current].hidden = true;

      current = nextIndex;

      slides[current].classList.add('is-active');
      slides[current].hidden = false;

      thumbs.forEach(function (thumb, thumbIndex) {
        var isActive = thumbIndex === current;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });

      updateCounter(current);
      scrollThumbIntoView(current);

      var activeType = slides[current].getAttribute('data-media-type');
      if (activeType === 'video' || activeType === 'external_video') {
        stopAutoplay();
        setAutoplayUi(false);
      } else if (!options.fromAutoplay && autoplayEnabled && autoplayBtn && autoplayBtn.classList.contains('is-playing')) {
        startAutoplay();
      }
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var index = parseInt(thumb.getAttribute('data-pdp-media-index'), 10);
        if (!isNaN(index)) {
          stopAutoplay();
          goTo(index);
          if (autoplayBtn && autoplayBtn.classList.contains('is-playing')) startAutoplay();
        }
      });
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        stopAutoplay();
        goTo(current - 1);
        if (autoplayBtn && autoplayBtn.classList.contains('is-playing')) startAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        stopAutoplay();
        goTo(current + 1);
        if (autoplayBtn && autoplayBtn.classList.contains('is-playing')) startAutoplay();
      });
    }

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', function () {
        var playing = autoplayBtn.classList.contains('is-playing');
        if (playing) {
          stopAutoplay();
          setAutoplayUi(false);
        } else {
          setAutoplayUi(true);
          startAutoplay();
        }
      });
    }

    gallery.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        stopAutoplay();
        goTo(current - 1);
      }
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        stopAutoplay();
        goTo(current + 1);
      }
    });

    if (stage) {
      var touchStartX = 0;
      stage.addEventListener(
        'touchstart',
        function (event) {
          touchStartX = event.changedTouches[0].screenX;
        },
        { passive: true }
      );
      stage.addEventListener(
        'touchend',
        function (event) {
          var delta = event.changedTouches[0].screenX - touchStartX;
          if (Math.abs(delta) < 40) return;
          stopAutoplay();
          goTo(delta > 0 ? current - 1 : current + 1);
          if (autoplayBtn && autoplayBtn.classList.contains('is-playing')) startAutoplay();
        },
        { passive: true }
      );
    }

    updateCounter(current);
    syncThumbViewport();
    scrollThumbIntoView(current);
    setAutoplayUi(true);
    startAutoplay();

    window.addEventListener('resize', syncThumbViewport);
  }

  function init(root) {
    initGallery(root);
  }

  document.addEventListener('DOMContentLoaded', function () {
    init(document);
  });

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
