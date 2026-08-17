(function () {
  function normalizeMetal(value) {
    return (value || '').toString().trim().toLowerCase();
  }

  function isGoldMetal(value) {
    var metal = normalizeMetal(value);
    return metal === 'gold' || metal.indexOf('gold') !== -1;
  }

  function isCompositeMetalPicker(picker) {
    return picker.dataset.gemluxjewelPdpCompositeMetal === 'true';
  }

  function metalFamilyFromValue(value) {
    var metal = normalizeMetal(value);
    if (metal === 'silver') return 'Silver';
    if (metal === 'platinum') return 'Platinum';
    if (isGoldMetal(value)) return 'Gold';
    return '';
  }

  function findHiddenMetalRadio(picker, value) {
    var wrap = picker.querySelector('[data-gemluxjewel-pdp-metal-radios]');
    return findRadioByValue(wrap, 'input[type="radio"]', value);
  }

  function selectHiddenMetalRadio(picker, value, dispatchChange) {
    var radio = findHiddenMetalRadio(picker, value);
    if (!radio || radio.disabled || radio.classList.contains('disabled')) return false;

    if (!radio.checked) {
      radio.checked = true;
      if (dispatchChange !== false) {
        radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    saveCompositeMetalSelection(picker, value);
    return true;
  }

  function getCompositeMetalSelectionKey(picker) {
    return picker.dataset.productHandle || picker.getAttribute('data-product-handle') || '';
  }

  function saveCompositeMetalSelection(picker, value) {
    if (!value || !isCompositeMetalPicker(picker)) return;

    picker.dataset.gemluxjewelPdpMetalValue = value;

    var handle = getCompositeMetalSelectionKey(picker);
    if (!handle) return;

    try {
      sessionStorage.setItem('gemluxjewel_pdp_metal_' + handle, value);
    } catch (error) {
      /* ignore storage errors */
    }
  }

  function readCompositeMetalSelection(picker) {
    if (picker.dataset.gemluxjewelPdpMetalValue) {
      return picker.dataset.gemluxjewelPdpMetalValue;
    }

    var handle = getCompositeMetalSelectionKey(picker);
    if (!handle) return '';

    try {
      return sessionStorage.getItem('gemluxjewel_pdp_metal_' + handle) || '';
    } catch (error) {
      return '';
    }
  }

  function restoreCompositeMetalSelection(picker) {
    if (!isCompositeMetalPicker(picker)) return;

    var saved = readCompositeMetalSelection(picker);
    if (!saved) return;

    var radio = findHiddenMetalRadio(picker, saved);
    if (!radio || radio.disabled || radio.classList.contains('disabled')) return;

    if (!radio.checked) {
      radio.checked = true;
    }

    syncCompositeColorUi(picker, saved);
  }

  function getCheckedHiddenMetalValue(picker) {
    var wrap = picker.querySelector('[data-gemluxjewel-pdp-metal-radios]');
    if (!wrap) return '';
    var checked = wrap.querySelector('input[type="radio"]:checked');
    return checked ? checked.value : '';
  }

  function parseCompositeGold(value) {
    var match = (value || '').trim().match(/^(10K|14K|18K)\s+(.+)$/i);
    if (!match) return { karat: '', color: '' };
    return { karat: match[1].toUpperCase(), color: match[2] };
  }

  function buildCompositeGold(karat, color) {
    if (!karat || !color) return '';
    return karat + ' ' + color;
  }

  function getCheckedGoldKarat(picker) {
    var checked = picker.querySelector('[data-gemluxjewel-pdp-gold-karat]:checked');
    return checked ? checked.value : '';
  }

  function syncGoldColorCells(picker, karat) {
    var cells = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-color-cell]');
    for (var i = 0; i < cells.length; i++) {
      var show = cells[i].getAttribute('data-karat') === karat;
      cells[i].hidden = !show;
      cells[i].classList.toggle('is-hidden', !show);
    }
  }

  function syncCompositeKaratUi(picker, karat) {
    var karatTabs = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-karat]');
    for (var i = 0; i < karatTabs.length; i++) {
      karatTabs[i].checked = karatTabs[i].value === karat;
    }
  }

  function syncCompositeColorUi(picker, value) {
    var parsed = parseCompositeGold(value);
    var colorInputs = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-color]');
    for (var i = 0; i < colorInputs.length; i++) {
      colorInputs[i].checked = colorInputs[i].value === value;
    }
    if (parsed.karat) {
      syncCompositeKaratUi(picker, parsed.karat);
      syncGoldColorCells(picker, parsed.karat);
    }
  }

  function firstAvailableGoldColor(picker, karat) {
    if (!karat) return null;
    var colors = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-color][data-karat-value="' + karat + '"]');
    for (var i = 0; i < colors.length; i++) {
      if (isCompositeMetalPicker(picker)) {
        var hidden = findHiddenMetalRadio(picker, colors[i].value);
        if (hidden && !hidden.disabled && !hidden.classList.contains('disabled')) return colors[i];
      } else {
        return colors[i];
      }
    }
    return null;
  }

  function firstAvailableGoldKarat(picker) {
    var karats = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-karat]');
    for (var i = 0; i < karats.length; i++) {
      if (firstAvailableGoldColor(picker, karats[i].value)) return karats[i].value;
    }
    return karats.length ? karats[0].value : '';
  }

  function syncCompositeFamilyUi(picker, family) {
    var familyTabs = picker.querySelectorAll('[data-gemluxjewel-pdp-metal-family-tab]');
    for (var i = 0; i < familyTabs.length; i++) {
      familyTabs[i].checked = familyTabs[i].value === family;
    }
  }

  function firstAvailableGoldVariant(picker) {
    var karat = firstAvailableGoldKarat(picker);
    var color = firstAvailableGoldColor(picker, karat);
    return color;
  }

  function syncCompositeMetal(picker) {
    var panel = picker.querySelector('[data-gemluxjewel-pdp-gold-panel]');
    var colorPanel = picker.querySelector('[data-gemluxjewel-pdp-gold-color-panel]');
    var selectedValue = isCompositeMetalPicker(picker) ? getCheckedHiddenMetalValue(picker) : '';
    var family = metalFamilyFromValue(selectedValue);

    if (!family) {
      var checkedFamily = picker.querySelector('[data-gemluxjewel-pdp-metal-family-tab]:checked');
      if (checkedFamily) {
        family = checkedFamily.value;
      } else if (picker.dataset.gemluxjewelPdpDemo === 'true') {
        family = getCheckedMetalTab(picker) || 'Gold';
      } else {
        family = 'Gold';
      }
    }

    syncCompositeFamilyUi(picker, family);

    var showGold = family === 'Gold';
    if (panel) {
      panel.hidden = !showGold;
      panel.classList.toggle('is-hidden', !showGold);
      panel.classList.toggle('is-visible', showGold);
    }

    if (showGold) {
      var parsed = parseCompositeGold(selectedValue);
      var karat = parsed.karat || getCheckedGoldKarat(picker) || firstAvailableGoldKarat(picker);
      syncCompositeKaratUi(picker, karat);
      syncGoldColorCells(picker, karat);

      if (colorPanel) {
        colorPanel.hidden = !karat;
        colorPanel.classList.toggle('is-hidden', !karat);
        colorPanel.classList.toggle('is-visible', !!karat);
      }

      if (selectedValue && parsed.karat && parsed.color) {
        updateMetalLabel(picker, selectedValue);
      } else {
        var checkedColor = karat
          ? picker.querySelector('[data-gemluxjewel-pdp-gold-color][data-karat-value="' + karat + '"]:checked')
          : null;
        updateMetalLabel(picker, checkedColor ? checkedColor.value : karat ? karat + ' Gold' : 'Gold');
      }
    } else if (colorPanel) {
      colorPanel.hidden = true;
      colorPanel.classList.add('is-hidden');
      colorPanel.classList.remove('is-visible');
      updateMetalLabel(picker, selectedValue || family);
    }
  }

  function handleCompositeFamilyTab(picker, family) {
    if (family === 'Gold') {
      var selectedValue = getCheckedHiddenMetalValue(picker);
      if (isCompositeMetalPicker(picker) && !isGoldMetal(selectedValue)) {
        var karat = firstAvailableGoldKarat(picker);
        var firstColor = firstAvailableGoldColor(picker, karat);
        if (firstColor) {
          selectHiddenMetalRadio(picker, firstColor.value, true);
          return;
        }
      }
      syncCompositeMetal(picker);
      return;
    }

    if (isCompositeMetalPicker(picker)) {
      selectHiddenMetalRadio(picker, family, true);
    }
  }

  function handleGoldKaratChange(picker, karat) {
    syncCompositeKaratUi(picker, karat);
    syncGoldColorCells(picker, karat);

    var colorPanel = picker.querySelector('[data-gemluxjewel-pdp-gold-color-panel]');
    if (colorPanel) {
      colorPanel.hidden = !karat;
      colorPanel.classList.toggle('is-hidden', !karat);
      colorPanel.classList.toggle('is-visible', !!karat);
    }

    var selectedValue = getCheckedHiddenMetalValue(picker);
    var parsed = parseCompositeGold(selectedValue);
    var colorInput = null;

    if (parsed.karat === karat) {
      colorInput = picker.querySelector('[data-gemluxjewel-pdp-gold-color][value="' + selectedValue + '"]');
    }

    if (!colorInput) {
      colorInput = firstAvailableGoldColor(picker, karat);
    }

    if (colorInput) {
      colorInput.checked = true;
      if (isCompositeMetalPicker(picker)) {
        selectHiddenMetalRadio(picker, colorInput.value, true);
      } else {
        updateMetalLabel(picker, colorInput.value);
      }
      return;
    }

    updateMetalLabel(picker, karat + ' Gold');
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

  function getGoldSelectionKey(picker) {
    return picker.dataset.productHandle || picker.getAttribute('data-product-handle') || '';
  }

  function saveGoldSelection(picker, value) {
    if (!value) return;

    picker.dataset.gemluxjewelPdpGoldValue = value;

    if (picker.dataset.gemluxjewelPdpDemo === 'true') return;

    var handle = getGoldSelectionKey(picker);
    if (!handle) return;

    try {
      sessionStorage.setItem('gemluxjewel_pdp_gold_' + handle, value);
    } catch (error) {
      /* ignore storage errors */
    }
  }

  function readGoldSelection(picker) {
    if (picker.dataset.gemluxjewelPdpGoldValue) {
      return picker.dataset.gemluxjewelPdpGoldValue;
    }

    var handle = getGoldSelectionKey(picker);
    if (!handle) return '';

    try {
      return sessionStorage.getItem('gemluxjewel_pdp_gold_' + handle) || '';
    } catch (error) {
      return '';
    }
  }

  function restoreGoldSelection(picker) {
    if (picker.dataset.gemluxjewelPdpDemo === 'true') return;
    if (!isGoldMetal(getCheckedMetalTab(picker))) return;

    var value = readGoldSelection(picker);
    if (!value) return;

    var gridInputs = picker.querySelectorAll('[data-gemluxjewel-pdp-gold-grid]');
    for (var i = 0; i < gridInputs.length; i++) {
      if (gridInputs[i].value === value) {
        gridInputs[i].checked = true;
        break;
      }
    }
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

  function syncGoldGridToRadiosSilent(picker, gridInput) {
    var hiddenWrap = picker.querySelector('[data-gemluxjewel-pdp-gold-radios]');
    if (!hiddenWrap || !gridInput) return;

    var karat = gridInput.getAttribute('data-karat-value') || (gridInput.value.split('|')[0] || '');
    var color = gridInput.getAttribute('data-color-value') || (gridInput.value.split('|')[1] || '');

    var karatRadio = findRadioByValue(hiddenWrap, '[data-gemluxjewel-pdp-karat]', karat);
    var colorRadio = findRadioByValue(hiddenWrap, '[data-gemluxjewel-pdp-color]', color);

    if (karatRadio) karatRadio.checked = true;
    if (colorRadio) colorRadio.checked = true;
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
    if (isCompositeMetalPicker(picker) || picker.querySelector('[data-gemluxjewel-pdp-gold-karat]')) {
      syncCompositeMetal(picker);
      return;
    }

    var panel = picker.querySelector('[data-gemluxjewel-pdp-gold-panel]');
    if (!panel) return;

    var metal = getCheckedMetalTab(picker);
    var showGold = isGoldMetal(metal);

    panel.hidden = !showGold;
    panel.classList.toggle('is-hidden', !showGold);
    panel.classList.toggle('is-visible', showGold);

    if (picker.dataset.gemluxjewelPdpDemo === 'true') {
      updateMetalLabel(picker, metal);
      return;
    }

    if (showGold) {
      var hiddenWrap = picker.querySelector('[data-gemluxjewel-pdp-gold-radios]');
      var hasHiddenKarat = hiddenWrap && hiddenWrap.querySelector('[data-gemluxjewel-pdp-karat]');

      if (hasHiddenKarat) {
        syncGoldGridFromRadios(picker);
        var checkedGrid = picker.querySelector('[data-gemluxjewel-pdp-gold-grid]:checked');
        if (checkedGrid) syncGoldGridToRadiosSilent(picker, checkedGrid);
      } else {
        restoreGoldSelection(picker);
      }
    } else {
      selectNaOption(picker, '[data-gemluxjewel-pdp-karat]');
      selectNaOption(picker, '[data-gemluxjewel-pdp-color]');
    }

    updateMetalLabel(picker, metal);
  }

  function initPickers(root, options) {
    var restoreSelection = !options || options.restoreSelection !== false;

    (root || document).querySelectorAll('[data-gemluxjewel-pdp-variant-picker]').forEach(function (picker) {
      if (restoreSelection) {
        restoreCompositeMetalSelection(picker);
      } else if (isCompositeMetalPicker(picker)) {
        var current = getCheckedHiddenMetalValue(picker);
        if (current && !readCompositeMetalSelection(picker)) {
          saveCompositeMetalSelection(picker, current);
        }
      }
      syncGoldPanel(picker);
    });
  }

  function init(root) {
    initPickers(root, { restoreSelection: false });
    initWishlist(root);
  }

  function handlePickerChange(event) {
    var target = event.target;
    if (!target || !target.matches) return;

    var picker = target.closest('[data-gemluxjewel-pdp-variant-picker]');
    if (!picker) return;

    if (target.matches('[data-gemluxjewel-pdp-metal-family-tab]')) {
      handleCompositeFamilyTab(picker, target.value);
      return;
    }

    if (target.matches('[data-gemluxjewel-pdp-gold-karat]')) {
      handleGoldKaratChange(picker, target.value);
      return;
    }

    if (target.matches('[data-gemluxjewel-pdp-gold-color]')) {
      if (isCompositeMetalPicker(picker)) {
        selectHiddenMetalRadio(picker, target.value, true);
      } else {
        updateMetalLabel(picker, target.value);
      }
      return;
    }

    if (target.matches('[data-gemluxjewel-pdp-metal-value]')) {
      saveCompositeMetalSelection(picker, target.value);
      syncCompositeMetal(picker);
      return;
    }

    if (target.matches('[data-gemluxjewel-pdp-metal-tab]')) {
      syncGoldPanel(picker);
      return;
    }

    if (target.matches('[data-gemluxjewel-pdp-gold-grid]')) {
      saveGoldSelection(picker, target.value);

      if (picker.dataset.gemluxjewelPdpDemo === 'true') return;

      var hiddenWrap = picker.querySelector('[data-gemluxjewel-pdp-gold-radios]');
      var hasHiddenKarat = hiddenWrap && hiddenWrap.querySelector('[data-gemluxjewel-pdp-karat]');
      if (hasHiddenKarat) {
        syncGoldGridToRadios(picker, target);
      }
    }
  }

  var WISHLIST_STORAGE_KEY = 'gemluxjewel_wishlist';

  function readWishlist() {
    try {
      var raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      var parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed.map(String) : [];
    } catch (error) {
      return [];
    }
  }

  function writeWishlist(items) {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      /* ignore storage errors */
    }
  }

  function isWishlisted(productId) {
    return readWishlist().indexOf(String(productId)) !== -1;
  }

  function toggleWishlist(productId) {
    var items = readWishlist();
    var id = String(productId);
    var index = items.indexOf(id);
    if (index === -1) items.push(id);
    else items.splice(index, 1);
    writeWishlist(items);
    return index === -1;
  }

  function setWishlistUi(productId, isActive) {
    document.querySelectorAll('[data-gemluxjewel-wishlist-btn][data-product-id="' + productId + '"]').forEach(function (button) {
      var label = button.querySelector('[data-gemluxjewel-wishlist-label]');
      var addLabel = button.getAttribute('data-label-add') || 'Add to Wishlist';
      var addedLabel = button.getAttribute('data-label-added') || 'In Wishlist';

      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-label', isActive ? addedLabel : addLabel);
      if (label) label.textContent = isActive ? addedLabel : addLabel;
    });

    document.querySelectorAll('[data-gemluxjewel-wishlist-heart][data-product-id="' + productId + '"]').forEach(function (button) {
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      button.setAttribute('aria-label', isActive ? 'Remove from wishlist' : 'Add to wishlist');
    });
  }

  function initWishlist(root) {
    var scope = root || document;

    scope.querySelectorAll('[data-gemluxjewel-wishlist-btn]').forEach(function (button) {
      if (button.dataset.gemluxjewelWishlistReady === 'true') return;
      button.dataset.gemluxjewelWishlistReady = 'true';

      var productId = button.getAttribute('data-product-id');
      setWishlistUi(productId, isWishlisted(productId));

      button.addEventListener('click', function () {
        var added = toggleWishlist(productId);
        setWishlistUi(productId, added);
        document.dispatchEvent(
          new CustomEvent('gemluxjewel:wishlist-updated', {
            detail: {
              productId: productId,
              handle: button.getAttribute('data-product-handle') || '',
              variantId: button.getAttribute('data-variant-id') || '',
              added: added,
              items: readWishlist()
            }
          })
        );
      });
    });

    scope.querySelectorAll('[data-gemluxjewel-wishlist-heart]').forEach(function (button) {
      if (button.dataset.gemluxjewelWishlistReady === 'true') return;
      button.dataset.gemluxjewelWishlistReady = 'true';

      var productId = button.getAttribute('data-product-id');
      setWishlistUi(productId, isWishlisted(productId));

      button.addEventListener('click', function () {
        var added = toggleWishlist(productId);
        setWishlistUi(productId, added);
        document.dispatchEvent(
          new CustomEvent('gemluxjewel:wishlist-updated', {
            detail: {
              productId: productId,
              added: added,
              items: readWishlist()
            }
          })
        );
      });
    });
  }

  document.addEventListener('change', handlePickerChange);

  document.addEventListener('DOMContentLoaded', function () {
    init(document);

    if (typeof subscribe === 'function' && typeof PUB_SUB_EVENTS !== 'undefined') {
      subscribe(PUB_SUB_EVENTS.variantChange, function () {
        initPickers(document, { restoreSelection: true });
      });
    }
  });

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
