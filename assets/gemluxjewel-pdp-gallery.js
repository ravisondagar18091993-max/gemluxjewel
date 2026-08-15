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

  function getSlides(gallery) {
    return Array.prototype.slice.call(gallery.querySelectorAll('[data-pdp-media-slide]'));
  }

  function getThumbs(gallery) {
    return Array.prototype.slice.call(
      gallery.querySelectorAll('[data-pdp-media-thumbs] .gemluxjewel-pdp-media__thumb')
    );
  }

  function getThumbMetrics(gallery) {
    var styles = window.getComputedStyle(gallery);
    var size = parseFloat(styles.getPropertyValue('--pdp-media-thumb-size')) || 72;
    var gap = parseFloat(styles.getPropertyValue('--pdp-media-thumb-gap')) || 10;
    return { size: size, gap: gap, step: size + gap };
  }

  function getScrollTargetForIndex(index, thumbsLength, step) {
    var visibleCount = Math.min(VISIBLE_THUMBS, thumbsLength);
    var maxScroll = Math.max(0, (thumbsLength - visibleCount) * step);

    if (thumbsLength <= visibleCount) return 0;
    if (index <= 0) return 0;
    if (index >= thumbsLength - 1) return maxScroll;

    var maxOffset = thumbsLength - visibleCount;
    var offset = Math.min(index - 1, maxOffset);
    return offset * step;
  }

  function initGallery(root) {
    var gallery = (root || document).querySelector('[data-gemluxjewel-pdp-media]');
    if (!gallery || gallery.dataset.gemluxjewelPdpMediaReady === 'true') return;
    gallery.dataset.gemluxjewelPdpMediaReady = 'true';

    var prevBtn = gallery.querySelector('[data-pdp-media-prev]');
    var nextBtn = gallery.querySelector('[data-pdp-media-next]');
    var autoplayBtn = gallery.querySelector('[data-pdp-media-autoplay]');
    var thumbsWrap = gallery.querySelector('[data-pdp-media-thumbs]');
    var stage = gallery.querySelector('.gemluxjewel-pdp-media__stage');

    var slides = getSlides(gallery);
    if (!slides.length) return;

    var current = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (current < 0) current = 0;

    var autoplayTimer = null;
    var autoplayEnabled = slides.length > 1;

    function syncThumbViewport() {
      if (!thumbsWrap) return;

      var thumbs = getThumbs(gallery);
      var metrics = getThumbMetrics(gallery);
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
      var counter = gallery.querySelector('[data-pdp-media-counter]');
      if (!counter) return;
      counter.textContent = index + 1 + ' / ' + getSlides(gallery).length;
    }

    function scrollThumbIntoView(index, behavior) {
      if (!thumbsWrap) return;

      var thumbs = getThumbs(gallery);
      if (!thumbs.length || index < 0 || index >= thumbs.length) return;

      var metrics = getThumbMetrics(gallery);
      var scrollBehavior = behavior || 'smooth';
      var scrollTarget = getScrollTargetForIndex(index, thumbs.length, metrics.step);

      if (isDesktopThumbs()) {
        thumbsWrap.scrollTo({ top: scrollTarget, behavior: scrollBehavior });
        return;
      }

      thumbsWrap.scrollTo({ left: scrollTarget, behavior: scrollBehavior });
    }

    function setActiveThumb(index) {
      getThumbs(gallery).forEach(function (thumb) {
        var thumbIndex = parseInt(thumb.getAttribute('data-pdp-media-index'), 10);
        var isActive = thumbIndex === index;
        thumb.classList.toggle('is-active', isActive);
        thumb.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    function setAutoplayUi(playing) {
      if (!autoplayBtn) return;
      autoplayBtn.classList.toggle('is-playing', playing);
      autoplayBtn.classList.toggle('is-paused', !playing);
      autoplayBtn.setAttribute('aria-pressed', playing ? 'true' : 'false');
      autoplayBtn.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    }

    function getSlideVideo(slide) {
      if (!slide || slide.getAttribute('data-media-type') !== 'video') return null;
      return slide.querySelector('video');
    }

    function updateVideoControls(index) {
      if (!autoplayBtn) return;

      var slide = slides[index];
      var video = getSlideVideo(slide);
      autoplayBtn.hidden = !video;

      if (!video) return;

      setAutoplayUi(!video.paused);
    }

    function bindVideoEvents(slide) {
      var video = getSlideVideo(slide);
      if (!video || video.dataset.gemluxjewelPdpVideoBound === 'true') return;

      video.dataset.gemluxjewelPdpVideoBound = 'true';
      video.addEventListener('play', function () {
        if (slides[current] === slide) setAutoplayUi(true);
      });
      video.addEventListener('pause', function () {
        if (slides[current] === slide) setAutoplayUi(false);
      });
      video.addEventListener('ended', function () {
        if (slides[current] === slide) setAutoplayUi(false);
      });
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        window.clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function startAutoplay() {
      stopAutoplay();
      slides = getSlides(gallery);
      if (!autoplayEnabled || slides.length <= 1) return;
      autoplayTimer = window.setInterval(function () {
        goTo(current + 1, { fromAutoplay: true });
      }, AUTOPLAY_MS);
    }

    function goTo(index, options) {
      options = options || {};
      slides = getSlides(gallery);
      if (!slides.length) return;

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

      setActiveThumb(current);
      updateCounter(current);
      scrollThumbIntoView(current, options.fromAutoplay ? 'auto' : 'smooth');
      bindVideoEvents(slides[current]);
      updateVideoControls(current);

      var activeType = slides[current].getAttribute('data-media-type');
      if (activeType === 'video' || activeType === 'external_video') {
        stopAutoplay();
      } else if (!options.fromAutoplay && autoplayEnabled && (!autoplayBtn || autoplayBtn.hidden)) {
        startAutoplay();
      }
    }

    gallery.addEventListener('click', function (event) {
      var thumb = event.target.closest('.gemluxjewel-pdp-media__thumb');
      if (thumb && gallery.contains(thumb)) {
        var index = parseInt(thumb.getAttribute('data-pdp-media-index'), 10);
        if (!isNaN(index)) {
          stopAutoplay();
          goTo(index);
          if (!autoplayBtn || autoplayBtn.hidden) startAutoplay();
        }
        return;
      }

      if (event.target.closest('[data-pdp-media-prev]')) {
        stopAutoplay();
        goTo(current - 1);
        if (!autoplayBtn || autoplayBtn.hidden) startAutoplay();
        return;
      }

      if (event.target.closest('[data-pdp-media-next]')) {
        stopAutoplay();
        goTo(current + 1);
        if (!autoplayBtn || autoplayBtn.hidden) startAutoplay();
      }
    });

    if (autoplayBtn) {
      autoplayBtn.addEventListener('click', function () {
        var video = getSlideVideo(slides[current]);
        if (!video) return;

        if (video.paused) {
          video.play();
          setAutoplayUi(true);
        } else {
          video.pause();
          setAutoplayUi(false);
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
          if (!autoplayBtn || autoplayBtn.hidden) startAutoplay();
        },
        { passive: true }
      );
    }

    updateCounter(current);
    syncThumbViewport();
    setActiveThumb(current);
    scrollThumbIntoView(current, 'auto');
    slides.forEach(bindVideoEvents);
    updateVideoControls(current);
    startAutoplay();

    window.addEventListener('resize', function () {
      syncThumbViewport();
      scrollThumbIntoView(current, 'auto');
    });
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
