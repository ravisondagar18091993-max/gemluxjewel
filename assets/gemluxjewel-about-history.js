document.addEventListener('DOMContentLoaded', function () {
  initGemluxjewelAboutHistory();
});

document.addEventListener('shopify:section:load', function () {
  initGemluxjewelAboutHistory();
});

function initGemluxjewelAboutHistory() {
  document.querySelectorAll('[data-gemluxjewel-about-history]').forEach(function (slider) {
    if (slider.dataset.gemluxjewelAboutHistoryReady === 'true') return;

    var track = slider.querySelector('[data-gemluxjewel-about-history-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-about-history-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-about-history-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-about-history__slide');
    if (!items.length) return;

    var index = 0;

    function getVisibleCount() {
      if (window.matchMedia('(min-width: 1200px)').matches) return 3;
      if (window.matchMedia('(min-width: 750px)').matches) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function update() {
      var item = items[0];
      if (!item) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 20;
      var offset = index * (item.offsetWidth + gap);
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= getMaxIndex();
    }

    function onResize() {
      index = Math.min(index, getMaxIndex());
      update();
    }

    prevBtn.addEventListener('click', function () {
      index = Math.max(0, index - 1);
      update();
    });

    nextBtn.addEventListener('click', function () {
      index = Math.min(getMaxIndex(), index + 1);
      update();
    });

    window.addEventListener('resize', onResize);
    slider.dataset.gemluxjewelAboutHistoryReady = 'true';
    update();
  });
}
