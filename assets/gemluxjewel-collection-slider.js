document.addEventListener('DOMContentLoaded', function () {
  initGemluxjewelCollectionSlider();
});

document.addEventListener('shopify:section:load', function () {
  initGemluxjewelCollectionSlider();
});

function initGemluxjewelCollectionSlider(root) {
  root = root || document;
  root.querySelectorAll('[data-gemluxjewel-collection-slider]').forEach(function (slider) {
    if (slider.dataset.gemluxjewelCollectionSliderReady === 'true') return;

    var track = slider.querySelector('[data-gemluxjewel-collection-slider-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-collection-slider-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-collection-slider-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-collection-slider__item');
    if (!items.length) return;

    var index = 0;
    var viewport = slider.querySelector('.gemluxjewel-pdp__complete-set-viewport');

    function getVisibleCount() {
      if (viewport && items[0]) {
        var gap = parseFloat(getComputedStyle(track).gap) || 16;
        var itemWidth = items[0].getBoundingClientRect().width;
        if (itemWidth > 0 && viewport.clientWidth > 0) {
          var visible = Math.floor((viewport.clientWidth + gap) / (itemWidth + gap));
          return Math.max(1, Math.min(visible, items.length));
        }
      }

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
    window.requestAnimationFrame(update);
  });
}

window.initGemluxjewelCollectionSlider = initGemluxjewelCollectionSlider;

function resetGemluxjewelCollectionSliders(root) {
  root = root || document;
  root.querySelectorAll('[data-gemluxjewel-collection-slider]').forEach(function (slider) {
    delete slider.dataset.gemluxjewelCollectionSliderReady;
  });
}

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('product-recommendations').forEach(function (el) {
    var observer = new MutationObserver(function () {
      resetGemluxjewelCollectionSliders(el);
      initGemluxjewelCollectionSlider(el);
    });
    observer.observe(el, { childList: true, subtree: true });
  });
});
