document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-gemluxjewel-testimonials-slider]').forEach(function (slider) {
    var track = slider.querySelector('[data-gemluxjewel-testimonials-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-testimonials-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-testimonials-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var cards = track.querySelectorAll('.gemluxjewel-testimonials__card');
    if (!cards.length) return;

    var index = 0;

    function getVisibleCount() {
      if (window.matchMedia('(min-width: 990px)').matches) return 4;
      if (window.matchMedia('(min-width: 750px)').matches) return 2;
      return 1;
    }

    function getMaxIndex() {
      return Math.max(0, cards.length - getVisibleCount());
    }

    function update() {
      var card = cards[0];
      if (!card) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 12;
      var offset = index * (card.offsetWidth + gap);
      track.style.transform = 'translate3d(-' + offset + 'px, 0, 0)';

      prevBtn.disabled = index <= 0;
      nextBtn.disabled = index >= getMaxIndex();
    }

    prevBtn.addEventListener('click', function () {
      index = Math.max(0, index - 1);
      update();
    });

    nextBtn.addEventListener('click', function () {
      index = Math.min(getMaxIndex(), index + 1);
      update();
    });

    window.addEventListener('resize', function () {
      index = Math.min(index, getMaxIndex());
      update();
    });

    update();
  });
});
