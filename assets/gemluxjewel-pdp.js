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

  function initPickers(root) {
    (root || document).querySelectorAll('[data-gemluxjewel-pdp-variant-picker]').forEach(function (picker) {
      syncGoldPanel(picker);
    });
  }

  function init(root) {
    initPickers(root);
    initWishlist(root);
  }

  function handlePickerChange(event) {
    var target = event.target;
    if (!target || !target.matches) return;

    var picker = target.closest('[data-gemluxjewel-pdp-variant-picker]');
    if (!picker) return;

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
        initPickers(document);
      });
    }
  });

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
