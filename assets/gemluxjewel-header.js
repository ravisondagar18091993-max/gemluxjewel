(function () {
  var headerSliderTimer = null;
  var closeAllMegaFn = null;

  function initGemluxjewelHeader() {
    var header = document.querySelector('[data-gemluxjewel-header]');
    if (!header) return;

    var mobileMenu = document.querySelector('[data-gemluxjewel-mobile-menu]');
    var burgerBtn = header.querySelector('[data-gemluxjewel-burger]');
    var closeBtn = mobileMenu && mobileMenu.querySelector('[data-gemluxjewel-menu-close]');
    var mainBar = header.querySelector('[data-gemluxjewel-header-main]');

    function resetMobilePanels() {
      if (!mobileMenu) return;
      mobileMenu.querySelectorAll('[data-mobile-panel]').forEach(function (panel) {
        panel.classList.remove('is-active', 'is-leaving');
        if (panel.dataset.mobilePanel !== 'main') {
          panel.hidden = true;
        }
      });
      var mainPanel = mobileMenu.querySelector('[data-mobile-panel="main"]');
      if (mainPanel) {
        mainPanel.hidden = false;
        mainPanel.classList.add('is-active');
      }
    }

    function closeMenu() {
      if (!mobileMenu) return;
      mobileMenu.classList.remove('is-open');
      document.documentElement.classList.remove('gemluxjewel-menu-open');
      if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
      window.setTimeout(resetMobilePanels, 450);
    }

    if (header.dataset.gemluxjewelHeaderReady !== 'true') {
      function setHeaderOffset() {
        var height = header.offsetHeight;
        document.documentElement.style.setProperty('--gemluxjewel-header-height', height + 'px');
        document.documentElement.style.setProperty('--gemluxjewel-header-offset', height + 'px');
      }

      setHeaderOffset();
      window.addEventListener('resize', setHeaderOffset);

      var prevScroll = window.pageYOffset || document.documentElement.scrollTop;

      window.addEventListener('scroll', function () {
        if (document.documentElement.classList.contains('gemluxjewel-menu-open')) return;
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
        resetMobilePanels();
        mobileMenu.classList.add('is-open');
        document.documentElement.classList.add('gemluxjewel-menu-open');
        if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'true');
        header.classList.remove('is-hidden');
      }

      if (burgerBtn) burgerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openMenu();
      });

      if (closeBtn) closeBtn.addEventListener('click', closeMenu);

      if (mobileMenu) {
        if (!mobileMenu.dataset.gemluxjewelMenuBound) {
          mobileMenu.addEventListener('click', function (event) {
            var closeLink = event.target.closest('a[data-gemluxjewel-menu-close-on-click]');
            if (closeLink) {
              closeMenu();
              return;
            }

            var expandBtn = event.target.closest('[data-mobile-open]');
            if (expandBtn) {
              event.preventDefault();
              showMobilePanel(mobileMenu, expandBtn.getAttribute('data-mobile-open'));
            }

            var backBtn = event.target.closest('[data-mobile-back]');
            if (backBtn) {
              event.preventDefault();
              showMobilePanel(mobileMenu, 'main');
            }

            var accordionTrigger = event.target.closest('.gemluxjewel-mobile-menu__accordion-trigger');
            if (accordionTrigger) {
              event.preventDefault();
              toggleMobileAccordion(accordionTrigger);
            }
          });

          mobileMenu.dataset.gemluxjewelMenuBound = 'true';
        }

        resetMobilePanels();
      }

      initMegaMenu(header, mainBar);
      initMegaPreview(header);
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

  function showMobilePanel(mobileMenu, panelId) {
    var panelsWrap = mobileMenu.querySelector('[data-gemluxjewel-mobile-panels]');
    if (!panelsWrap || !panelId) return;

    panelsWrap.querySelectorAll('[data-mobile-panel]').forEach(function (panel) {
      var isTarget = panel.dataset.mobilePanel === panelId;

      if (isTarget) {
        panel.hidden = false;
        panel.classList.remove('is-leaving');
        window.requestAnimationFrame(function () {
          panel.classList.add('is-active');
        });
      } else {
        panel.classList.remove('is-active', 'is-leaving');
        panel.hidden = true;
      }
    });
  }

  function toggleMobileAccordion(trigger) {
    var accordion = trigger.closest('.gemluxjewel-mobile-menu__accordion');
    if (!accordion) return;

    var isOpen = accordion.classList.contains('is-open');
    var group = accordion.closest('.gemluxjewel-mobile-menu__accordions');

    if (group) {
      group.querySelectorAll('.gemluxjewel-mobile-menu__accordion.is-open').forEach(function (openAccordion) {
        if (openAccordion !== accordion) {
          openAccordion.classList.remove('is-open');
          var openTrigger = openAccordion.querySelector('.gemluxjewel-mobile-menu__accordion-trigger');
          if (openTrigger) openTrigger.setAttribute('aria-expanded', 'false');
        }
      });
    }

    accordion.classList.toggle('is-open', !isOpen);
    trigger.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
  }

  function initMegaPreview(header) {
    header.querySelectorAll('[data-gemluxjewel-mega-standard]').forEach(function (panel) {
      if (panel.dataset.gemluxjewelMegaPreviewReady === 'true') return;

      var previewCol = panel.querySelector('[data-gemluxjewel-mega-preview]');
      if (!previewCol) return;

      var currentTarget = previewCol.querySelector('[data-gemluxjewel-mega-preview-current]');
      var captionEl = previewCol.querySelector('[data-gemluxjewel-mega-preview-caption]');
      var defaultSrc = previewCol.dataset.defaultSrc || '';
      var defaultCaption = previewCol.dataset.defaultCaption || '';
      var triggers = panel.querySelectorAll('[data-mega-preview-src]');

      function setPreview(src, caption) {
        if (currentTarget && currentTarget.tagName === 'IMG') {
          if (src) {
            currentTarget.src = src;
            currentTarget.hidden = false;
          }
          if (caption) currentTarget.alt = caption;
        }
        if (captionEl) {
          if (caption) {
            captionEl.textContent = caption;
            captionEl.hidden = false;
          } else if (!defaultCaption) {
            captionEl.hidden = true;
          }
        }
      }

      function resetPreview() {
        setPreview(defaultSrc, defaultCaption);
        triggers.forEach(function (trigger) {
          trigger.classList.remove('is-preview-source');
        });
      }

      triggers.forEach(function (trigger) {
        trigger.addEventListener('mouseenter', function () {
          var src = trigger.getAttribute('data-mega-preview-src');
          var caption = trigger.getAttribute('data-mega-preview-caption') || '';
          if (!src) return;

          triggers.forEach(function (other) {
            other.classList.remove('is-preview-source');
          });
          trigger.classList.add('is-preview-source');
          setPreview(src, caption);
        });
      });

      panel.addEventListener('mouseleave', resetPreview);
      panel.dataset.gemluxjewelMegaPreviewReady = 'true';
    });
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
