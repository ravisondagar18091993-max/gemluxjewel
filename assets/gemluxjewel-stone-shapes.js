document.addEventListener('DOMContentLoaded', function () {
  initGemluxjewelStoneShapes();
});

document.addEventListener('gemluxjewel:stone-shapes:refresh', function () {
  initGemluxjewelStoneShapes();
});

document.addEventListener('gemluxjewel:facets-updated', function () {
  initGemluxjewelStoneShapes();
});

function initGemluxjewelStoneShapes() {
  document.querySelectorAll('[data-gemluxjewel-stone-shapes-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-gemluxjewel-stone-shapes-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-stone-shapes-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-stone-shapes-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-stone-shapes__item');
    if (!items.length) return;

    var index = 0;
    var isPlp = slider.closest('.gemluxjewel-stone-shapes--plp') !== null;
    var gridMq = window.matchMedia('(max-width: 749px)');

    function isGridMode() {
      return gridMq.matches;
    }

    function getVisibleCount() {
      if (isGridMode()) return items.length;

      if (isPlp) {
        if (window.matchMedia('(min-width: 1200px)').matches) return 8;
        if (window.matchMedia('(min-width: 750px)').matches) return 5;
        return 2;
      }

      if (window.matchMedia('(min-width: 1200px)').matches) return 8;
      if (window.matchMedia('(min-width: 750px)').matches) return 5;
      return 2;
    }

    function getMaxIndex() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function applyMode() {
      if (isGridMode()) {
        track.style.transform = '';
        prevBtn.hidden = true;
        nextBtn.hidden = true;
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
      }

      prevBtn.hidden = false;
      nextBtn.hidden = false;
      index = Math.min(index, getMaxIndex());
      update();
    }

    function update() {
      if (isGridMode()) {
        track.style.transform = '';
        return;
      }

      var item = items[0];
      if (!item) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 12;
      var offset = index * (item.offsetWidth + gap);
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= getMaxIndex();
    }

    function onResize() {
      applyMode();
    }

    if (slider.dataset.gemluxjewelStoneShapesReady !== 'true') {
      prevBtn.addEventListener('click', function () {
        if (isGridMode()) return;
        index = Math.max(0, index - getVisibleCount());
        update();
      });

      nextBtn.addEventListener('click', function () {
        if (isGridMode()) return;
        index = Math.min(getMaxIndex(), index + getVisibleCount());
        update();
      });

      window.addEventListener('resize', onResize);
      slider.dataset.gemluxjewelStoneShapesReady = 'true';
    }

    applyMode();
  });
}
