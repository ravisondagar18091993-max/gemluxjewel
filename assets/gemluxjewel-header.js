(function () {
  var headerSliderTimer = null;
  var closeAllMegaFn = null;

  function initGemluxjewelHeader() {
    var header = document.querySelector('[data-gemluxjewel-header]');
    if (!header) return;

    var mobileMenu = document.querySelector('[data-gemluxjewel-mobile-menu]');
    var burgerBtn = header.querySelector('[data-gemluxjewel-burger]');
    var closeBtn = mobileMenu && mobileMenu.querySelector('[data-gemluxjewel-menu-close]');
    var mobileLinks = mobileMenu && mobileMenu.querySelectorAll('[data-gemluxjewel-menu-close-on-click]');
    var mainBar = header.querySelector('[data-gemluxjewel-header-main]');

    if (header.dataset.gemluxjewelHeaderReady !== 'true') {
      function setHeaderOffset() {
        var height = header.offsetHeight;
        document.documentElement.style.setProperty('--gemluxjewel-header-height', height + 'px');
        document.documentElement.style.setProperty('--gemluxjewel-header-offset', height + 24 + 'px');
      }

      setHeaderOffset();
      window.addEventListener('resize', setHeaderOffset);

      var prevScroll = window.pageYOffset || document.documentElement.scrollTop;

      window.addEventListener('scroll', function () {
        if (closeAllMegaFn) closeAllMegaFn();

        if (mainBar && mainBar.classList.contains('is-mega-open')) return;
        var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (prevScroll > currentScroll || currentScroll === 0) {
          header.classList.remove('is-hidden');
        } else if (currentScroll > 120) {
          header.classList.add('is-hidden');
        }
        prevScroll = currentScroll;
      }, { passive: true });

      document.addEventListener('click', function (event) {
        if (!event.target.closest('[data-gemluxjewel-header]') && closeAllMegaFn) {
          closeAllMegaFn();
        }
      });

      function openMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.add('is-open');
        document.documentElement.classList.add('gemluxjewel-menu-open');
      }

      function closeMenu() {
        if (!mobileMenu) return;
        mobileMenu.classList.remove('is-open');
        document.documentElement.classList.remove('gemluxjewel-menu-open');
      }

      if (burgerBtn) burgerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openMenu();
      });

      if (closeBtn) closeBtn.addEventListener('click', closeMenu);

      if (mobileLinks) {
        mobileLinks.forEach(function (link) {
          link.addEventListener('click', closeMenu);
        });
      }

      initMegaMenu(header, mainBar);
      if (closeAllMegaFn) closeAllMegaFn();

      header.dataset.gemluxjewelHeaderReady = 'true';
    }

    initAnnouncementSlider(header);
  }

  function initMegaMenu(header, mainBar) {
    if (!mainBar) return;

    var megaItems = header.querySelectorAll('.gemluxjewel-header__nav-item.has-mega');
    if (!megaItems.length) return;

    var closeTimer = null;

    function closeAllMega() {
      megaItems.forEach(function (item) {
        item.classList.remove('is-mega-active');
      });
      mainBar.classList.remove('is-mega-open');
      document.documentElement.classList.remove('gemluxjewel-mega-open');

      var backdrop = header.querySelector('[data-gemluxjewel-mega-backdrop]');
      if (backdrop) backdrop.setAttribute('aria-hidden', 'true');
    }

    closeAllMegaFn = closeAllMega;

    function openMega(item) {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }

      megaItems.forEach(function (other) {
        if (other !== item) other.classList.remove('is-mega-active');
      });

      item.classList.add('is-mega-active');
      mainBar.classList.add('is-mega-open');
      document.documentElement.classList.add('gemluxjewel-mega-open');

      var backdrop = header.querySelector('[data-gemluxjewel-mega-backdrop]');
      if (backdrop) backdrop.setAttribute('aria-hidden', 'false');
    }

    function scheduleClose() {
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(closeAllMega, 200);
    }

    megaItems.forEach(function (item) {
      var panel = item.querySelector('[data-gemluxjewel-mega-panel]');

      item.addEventListener('mouseenter', function () {
        openMega(item);
      });

      item.addEventListener('mouseleave', scheduleClose);

      if (panel) {
        panel.addEventListener('mouseenter', function () {
          openMega(item);
        });
        panel.addEventListener('mouseleave', scheduleClose);
      }
    });

    var backdrop = header.querySelector('[data-gemluxjewel-mega-backdrop]');
    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeAllMega();
      });
    }
  }

  function initAnnouncementSlider(header) {
    if (headerSliderTimer) {
      window.clearInterval(headerSliderTimer);
      headerSliderTimer = null;
    }

    var topSlider = header.querySelector('[data-gemluxjewel-header-slider]');
    if (!topSlider || topSlider.classList.contains('gemluxjewel-header__top-slider--static')) return;

    var slides = topSlider.querySelectorAll('.gemluxjewel-header__top-slide');
    if (slides.length <= 1 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var current = 0;
    var interval = parseInt(topSlider.dataset.interval, 10) || 4000;

    function goToSlide(nextIndex) {
      var leaving = slides[current];
      leaving.classList.remove('is-active');
      leaving.classList.add('is-leaving');

      current = nextIndex;
      slides[current].classList.add('is-active');

      window.setTimeout(function () {
        leaving.classList.remove('is-leaving');
      }, 450);
    }

    function advanceSlide() {
      goToSlide((current + 1) % slides.length);
    }

    headerSliderTimer = window.setInterval(advanceSlide, interval);

    topSlider.addEventListener('mouseenter', function () {
      if (headerSliderTimer) {
        window.clearInterval(headerSliderTimer);
        headerSliderTimer = null;
      }
    });

    topSlider.addEventListener('mouseleave', function () {
      if (!headerSliderTimer) {
        headerSliderTimer = window.setInterval(advanceSlide, interval);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', initGemluxjewelHeader);
  document.addEventListener('shopify:section:load', initGemluxjewelHeader);
})();
