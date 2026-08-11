(function () {
  function normalizeMetal(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function isGoldMetal(value) {
    var metal = normalizeMetal(value);
    return metal === 'gold' || metal.indexOf('gold') !== -1;
  }

  function updateMetalLabel(picker, value) {
    var label = picker.querySelector('[data-gemluxjewel-pdp-metal-label]');
    if (label) label.textContent = value || 'Select Metal Type';
  }

  function getCheckedMetalTab(picker) {
    var checked = picker.querySelector('[data-gemluxjewel-pdp-metal-tab]:checked');
    return checked ? checked.value : '';
  }

  function selectNaOption(picker, selector) {
    var na = picker.querySelector(selector + '[data-gemluxjewel-pdp-na="true"]:not(.disabled)');
    if (na && !na.checked) {
      na.checked = true;
      na.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function findRadioByValue(container, selector, value) {
    if (!container || !value) return null;
    var inputs = container.querySelectorAll(selector);
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].value === value) return inputs[i];
    }
    return null;
  }

  function syncGoldGridToRadios(picker, gridInput) {
    var hiddenWrap = picker.querySelector('[data-gemluxjewel-pdp-gold-radios]');
    if (!hiddenWrap || !gridInput) return;

    var karat = gridInput.getAttribute('data-karat-value') || (gridInput.value.split('|')[0] || '');
    var color = gridInput.getAttribute('data-color-value') || (gridInput.value.split('|')[1] || '');

    var karatRadio = findRadioByValue(hiddenWrap, '[data-gemluxjewel-pdp-karat]', karat);
    var colorRadio = findRadioByValue(hiddenWrap, '[data-gemluxjewel-pdp-color]', color);

    if (karatRadio && !karatRadio.checked) {
      karatRadio.checked = true;
      karatRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (colorRadio && !colorRadio.checked) {
      colorRadio.checked = true;
      colorRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function syncGoldGridFromRadios(picker) {
    var hiddenWrap = picker.querySelector('[data-gemluxjewel-pdp-gold-radios]');
    if (!hiddenWrap) return;

    var karatRadio = hiddenWrap.querySelector('[data-gemluxjewel-pdp-karat]:checked');
    var colorRadio = hiddenWrap.querySelector('[data-gemluxjewel-pdp-color]:checked');
    if (!karatRadio || !colorRadio) return;

    var gridInputs = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-grid]');
    for (var i = 0; i < gridInputs.length; i++) {
      var input = gridInputs[i];
      var k = input.getAttribute('data-karat-value') || (input.value.split('|')[0] || '');
      var c = input.getAttribute('data-color-value') || (input.value.split('|')[1] || '');
      if (k === karatRadio.value && c === colorRadio.value) {
        input.checked = true;
        break;
      }
    }
  }

  function syncGoldPanel(picker) {
    var panel = picker.querySelector('[data-gemluxjewel-pdp-gold-panel]');
    if (!panel) return;

    var metal = getCheckedMetalTab(picker);
    var showGold = isGoldMetal(metal);

    panel.hidden = !showGold;
    panel.classList.toggle('is-visible', showGold);

    if (picker.dataset.gemluxjewelPdpDemo === 'true') {
      updateMetalLabel(picker, metal);
      return;
    }

    if (showGold) {
      syncGoldGridFromRadios(picker);
      var checkedGrid = picker.querySelector('[data-gemluxjewel-pdp-gold-grid]:checked');
      if (checkedGrid) syncGoldGridToRadios(picker, checkedGrid);
    } else {
      selectNaOption(picker, '[data-gemluxjewel-pdp-karat]');
      selectNaOption(picker, '[data-gemluxjewel-pdp-color]');
    }

    updateMetalLabel(picker, metal);
  }

  function initPicker(picker) {
    if (picker.dataset.gemluxjewelPdpReady === 'true') return;
    picker.dataset.gemluxjewelPdpReady = 'true';

    picker.querySelectorAll('[data-gemluxjewel-pdp-metal-tab]').forEach(function (input) {
      input.addEventListener('change', function () {
        syncGoldPanel(picker);
      });
    });

    picker.querySelectorAll('[data-gemluxjewel-pdp-gold-grid]').forEach(function (input) {
      input.addEventListener('change', function () {
        if (picker.dataset.gemluxjewelPdpDemo !== 'true') {
          syncGoldGridToRadios(picker, input);
        }
      });
    });

    syncGoldPanel(picker);
  }

  function init(root) {
    (root || document).querySelectorAll('[data-gemluxjewel-pdp-variant-picker]').forEach(initPicker);
  }

  document.addEventListener('DOMContentLoaded', function () {
    init(document);
  });

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
