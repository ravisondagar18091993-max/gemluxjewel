document.addEventListener('DOMContentLoaded', function () {
  initGemluxjewelCollectionSlider();
});

document.addEventListener('shopify:section:load', function () {
  initGemluxjewelCollectionSlider();
});

function initGemluxjewelCollectionSlider() {
  document.querySelectorAll('[data-gemluxjewel-collection-slider]').forEach(function (slider) {
    if (slider.dataset.gemluxjewelCollectionSliderReady === 'true') return;

    var track = slider.querySelector('[data-gemluxjewel-collection-slider-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-collection-slider-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-collection-slider-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-collection-slider__item');
    if (!items.length) return;

    var index = 0;

    function getVisibleCount() {
      if (window.matchMedia('(min-width: 1200px)').matches) return 4;
      if (window.matchMedia('(min-width: 750px)').matches) return 3;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function update() {
      var item = items[0];
      if (!item) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 16;
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
    slider.dataset.gemluxjewelCollectionSliderReady = 'true';
    update();
  });
}
