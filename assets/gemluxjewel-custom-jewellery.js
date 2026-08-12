document.addEventListener('DOMContentLoaded', initGemluxjewelCustomJewellery);
document.addEventListener('shopify:section:load', initGemluxjewelCustomJewellery);

function initGemluxjewelCustomJewellery() {
  initCustomFormUpload();
  initCustomFaqTabs();
  initCustomPortfolioSlider();
  initCustomMadeToOrderSlider();
}

function initCustomFormUpload() {
  document.querySelectorAll('[data-gemluxjewel-custom-upload]').forEach(function (wrap) {
    if (wrap.dataset.gemluxjewelCustomUploadReady === 'true') return;

    var fileInput = wrap.querySelector('[data-gemluxjewel-custom-upload-input]');
    var namesEl = wrap.querySelector('[data-gemluxjewel-custom-upload-names]');
    var hiddenValue = wrap.querySelector('[data-gemluxjewel-custom-upload-value]');
    var errorEl = wrap.querySelector('[data-gemluxjewel-custom-upload-error]');
    var form = wrap.closest('form');
    var maxBytes = 5 * 1024 * 1024;

    if (!fileInput || !namesEl || !hiddenValue || !form) return;

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function validateFiles(files) {
      for (var i = 0; i < files.length; i++) {
        if (files[i].size > maxBytes) {
          return 'File limit exceeded. Each file must be 5MB or less.';
        }
      }
      return '';
    }

    function updateFiles() {
      var files = fileInput.files;
      if (!files || !files.length) {
        namesEl.textContent = 'No file chosen';
        hiddenValue.value = '';
        if (errorEl) {
          errorEl.hidden = true;
          errorEl.textContent = '';
        }
        return;
      }

      var error = validateFiles(files);
      if (error) {
        if (errorEl) {
          errorEl.hidden = false;
          errorEl.textContent = error;
        }
        fileInput.value = '';
        namesEl.textContent = 'No file chosen';
        hiddenValue.value = '';
        return;
      }

      if (errorEl) {
        errorEl.hidden = true;
        errorEl.textContent = '';
      }

      var summary = Array.from(files).map(function (file) {
        return file.name + ' (' + formatSize(file.size) + ')';
      });
      namesEl.textContent = summary.join(', ');
      hiddenValue.value = summary.join(', ');
    }

    fileInput.addEventListener('change', updateFiles);

    form.addEventListener('submit', function () {
      updateFiles();
      var bodyField = form.querySelector('[name="contact[body]"]');
      if (bodyField && hiddenValue.value) {
        var note = '\n\nUploaded files: ' + hiddenValue.value;
        if (bodyField.value.indexOf('Uploaded files:') === -1) {
          bodyField.value = (bodyField.value || '') + note;
        }
      }
    });

    wrap.dataset.gemluxjewelCustomUploadReady = 'true';
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

function initCustomMadeToOrderSlider() {
  document.querySelectorAll('[data-gemluxjewel-made-to-order]').forEach(function (slider) {
    if (slider.dataset.gemluxjewelMadeToOrderReady === 'true') return;

    var track = slider.querySelector('[data-gemluxjewel-made-to-order-track]');
    var prevBtn = slider.querySelector('[data-gemluxjewel-made-to-order-prev]');
    var nextBtn = slider.querySelector('[data-gemluxjewel-made-to-order-next]');
    if (!track || !prevBtn || !nextBtn) return;

    var slides = track.querySelectorAll('.gemluxjewel-custom-made-to-order__slide');
    if (!slides.length) return;

    var index = 0;

    function getMaxIndex() {
      return Math.max(0, slides.length - 1);
    }

    function update() {
      var slide = slides[0];
      if (!slide) return;

      var gap = parseFloat(getComputedStyle(track).gap) || 0;
      var offset = index * (slide.offsetWidth + gap);
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
    slider.dataset.gemluxjewelMadeToOrderReady = 'true';
    update();
  });
}
