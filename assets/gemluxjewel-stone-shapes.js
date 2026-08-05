document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-gemluxjewel-stone-shapes-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-gemluxjewel-stone-shapes-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-stone-shapes-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-stone-shapes-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-stone-shapes__item');
    if (!items.length) return;

    var index = 0;

    function getVisibleCount() {
      if (window.matchMedia('(min-width: 1200px)').matches) return 7;
      if (window.matchMedia('(min-width: 750px)').matches) return 5;
      return 3;
    }

    function getMaxIndex() {
      return Math.max(0, items.length - getVisibleCount());
    }

    function update() {
      var item = items[0];
      if (!item) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 12;
      var offset = index * (item.offsetWidth + gap);
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= getMaxIndex();
    }

    prevBtn.addEventListener('click', function () {
      index = Math.max(0, index - getVisibleCount());
      update();
    });

    nextBtn.addEventListener('click', function () {
      index = Math.min(getMaxIndex(), index + getVisibleCount());
      update();
    });

    window.addEventListener('resize', function () {
      index = Math.min(index, getMaxIndex());
      update();
    });

    update();
  });
});
