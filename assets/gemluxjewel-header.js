(function () {
  var header = document.querySelector('[data-gemluxjewel-header]');
  if (!header) return;

  var mobileMenu = document.querySelector('[data-gemluxjewel-mobile-menu]');
  var burgerBtn = header.querySelector('[data-gemluxjewel-burger]');
  var closeBtn = mobileMenu && mobileMenu.querySelector('[data-gemluxjewel-menu-close]');
  var mobileLinks = mobileMenu && mobileMenu.querySelectorAll('[data-gemluxjewel-menu-close-on-click]');
  var mainBar = header.querySelector('[data-gemluxjewel-header-main]');

  function setHeaderOffset() {
    var offset = header.offsetHeight + 24;
    document.documentElement.style.setProperty('--gemluxjewel-header-offset', offset + 'px');
  }

  setHeaderOffset();
  window.addEventListener('resize', setHeaderOffset);

  var prevScroll = window.pageYOffset || document.documentElement.scrollTop;

  window.addEventListener('scroll', function () {
    var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    if (prevScroll > currentScroll || currentScroll === 0) {
      header.classList.remove('is-hidden');
    } else if (currentScroll > 120) {
      header.classList.add('is-hidden');
    }
    prevScroll = currentScroll;
  }, { passive: true });

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

  if (mainBar) {
    header.querySelectorAll('.has-mega, [data-gemluxjewel-mega-panel]').forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        mainBar.classList.add('is-mega-open');
      });
      el.addEventListener('mouseleave', function () {
        mainBar.classList.remove('is-mega-open');
      });
    });
  }

  var topSlider = header.querySelector('[data-gemluxjewel-header-slider]');
  if (topSlider) {
    var slides = topSlider.querySelectorAll('.gemluxjewel-header__top-slide');
    if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      var current = 0;
      var interval = parseInt(topSlider.dataset.interval, 10) || 4000;

      setInterval(function () {
        var leaving = slides[current];
        leaving.classList.remove('is-active');
        leaving.classList.add('is-leaving');

        current = (current + 1) % slides.length;
        slides[current].classList.add('is-active');

        window.setTimeout(function () {
          leaving.classList.remove('is-leaving');
        }, 450);
      }, interval);
    }
  }
})();
