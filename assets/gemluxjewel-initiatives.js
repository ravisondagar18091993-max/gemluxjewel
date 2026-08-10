(function () {
  function setActiveMedia(section, index) {
    var mediaItems = section.querySelectorAll('[data-initiative-media]');
    mediaItems.forEach(function (item) {
      var itemIndex = parseInt(item.getAttribute('data-initiative-media'), 10);
      item.classList.toggle('is-active', itemIndex === index);
    });
  }

  function getActiveAccordionIndex(section) {
    var activeHeader = section.querySelector('.gemluxjewel-initiatives__item .closet-header.active');
    if (!activeHeader) return 0;

    var item = activeHeader.closest('[data-initiative-item]');
    if (!item) return 0;

    return parseInt(item.getAttribute('data-initiative-item'), 10) || 0;
  }

  function initSection(section) {
    var items = section.querySelectorAll('[data-initiative-item]');
    if (!items.length) return;

    setActiveMedia(section, getActiveAccordionIndex(section));

    items.forEach(function (item) {
      var index = parseInt(item.getAttribute('data-initiative-item'), 10);
      var header = item.querySelector('.closet-header');
      if (!header) return;

      item.addEventListener('mouseenter', function () {
        setActiveMedia(section, index);
      });

      header.addEventListener('click', function () {
        window.setTimeout(function () {
          if (header.classList.contains('active')) {
            setActiveMedia(section, index);
          }
        }, 0);
      });
    });

    var accordion = section.querySelector('[data-gemluxjewel-initiatives-accordion]');
    if (accordion) {
      accordion.addEventListener('mouseleave', function () {
        setActiveMedia(section, getActiveAccordionIndex(section));
      });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-gemluxjewel-initiatives]').forEach(initSection);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    var section = event.target.querySelector('[data-gemluxjewel-initiatives]');
    if (section) initSection(section);
  });
})();
