document.addEventListener('DOMContentLoaded', initGemluxjewelCustomJewellery);
document.addEventListener('shopify:section:load', initGemluxjewelCustomJewellery);

function initGemluxjewelCustomJewellery() {
  initCustomFormTabs();
  initCustomFormMetalTags();
  initCustomFaqTabs();
  initCustomPortfolioSlider();
}

function initCustomFormTabs() {
  document.querySelectorAll('[data-gemluxjewel-custom-form]').forEach(function (formWrap) {
    if (formWrap.dataset.gemluxjewelCustomFormReady === 'true') return;

    var tabs = formWrap.querySelectorAll('[data-gemluxjewel-custom-form-tab]');
    var hiddenInput = formWrap.querySelector('[data-gemluxjewel-custom-form-type]');
    if (!tabs.length || !hiddenInput) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        hiddenInput.value = tab.dataset.value || tab.textContent.trim();
      });
    });

    formWrap.dataset.gemluxjewelCustomFormReady = 'true';
  });
}

function initCustomFormMetalTags() {
  document.querySelectorAll('[data-gemluxjewel-custom-metal]').forEach(function (wrap) {
    if (wrap.dataset.gemluxjewelCustomMetalReady === 'true') return;

    var tags = wrap.querySelectorAll('[data-gemluxjewel-custom-metal-tag]');
    var hiddenInput = wrap.querySelector('[data-gemluxjewel-custom-metal-value]');
    if (!tags.length || !hiddenInput) return;

    var selected = [];

    tags.forEach(function (tag) {
      tag.addEventListener('click', function () {
        var value = tag.dataset.value || tag.textContent.trim();
        if (tag.classList.contains('is-active')) {
          tag.classList.remove('is-active');
          selected = selected.filter(function (v) {
            return v !== value;
          });
        } else {
          tag.classList.add('is-active');
          selected.push(value);
        }
        hiddenInput.value = selected.join(', ');
      });
    });

    wrap.dataset.gemluxjewelCustomMetalReady = 'true';
  });
}

function initCustomFaqTabs() {
  document.querySelectorAll('[data-gemluxjewel-custom-faq]').forEach(function (section) {
    if (section.dataset.gemluxjewelCustomFaqReady === 'true') return;

    var tabs = section.querySelectorAll('[data-gemluxjewel-custom-faq-tab]');
    var items = section.querySelectorAll('[data-gemluxjewel-custom-faq-item]');
    if (!tabs.length || !items.length) return;

    function filter(category) {
      items.forEach(function (item) {
        var itemCategory = item.dataset.category || 'general';
        item.classList.toggle('is-hidden', category !== 'all' && itemCategory !== category);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) {
          t.classList.remove('is-active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        filter(tab.dataset.category || 'all');
      });
    });

    filter('all');
    section.dataset.gemluxjewelCustomFaqReady = 'true';
  });
}

function initCustomPortfolioSlider() {
  document.querySelectorAll('[data-gemluxjewel-custom-portfolio]').forEach(function (slider) {
    if (slider.dataset.gemluxjewelCustomPortfolioReady === 'true') return;

    var track = slider.querySelector('[data-gemluxjewel-custom-portfolio-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-custom-portfolio-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-custom-portfolio-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var items = track.querySelectorAll('.gemluxjewel-custom-portfolio__item');
    if (!items.length) return;

    var index = 0;

    function getVisibleCount() {
      if (window.matchMedia('(min-width: 1200px)').matches) return 4;
      if (window.matchMedia('(min-width: 990px)').matches) return 3;
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
    slider.dataset.gemluxjewelCustomPortfolioReady = 'true';
    update();
  });
}
