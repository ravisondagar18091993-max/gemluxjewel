(function () {
  function closeAllDropdowns(except) {
    document.querySelectorAll('[data-gemluxjewel-plp-dropdown]').forEach(function (dropdown) {
      if (except && dropdown === except) return;
      dropdown.open = false;
    });
  }

  function closeAllSortDropdowns(except) {
    document.querySelectorAll('[data-gemluxjewel-plp-sort-dropdown]').forEach(function (dropdown) {
      if (except && dropdown === except) return;
      dropdown.open = false;
    });
  }

  function syncSortLabel(sortWrap) {
    var nativeSelect = sortWrap.querySelector('.gemluxjewel-plp-sort__native');
    var label = sortWrap.querySelector('[data-gemluxjewel-plp-sort-label]');
    if (!nativeSelect || !label) return;

    var selectedOption = nativeSelect.options[nativeSelect.selectedIndex];
    if (selectedOption) {
      label.textContent = selectedOption.textContent;
    }

    sortWrap.querySelectorAll('[data-gemluxjewel-plp-sort-option]').forEach(function (button) {
      var isActive = button.getAttribute('data-value') === nativeSelect.value;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
  }

  function initSortDropdowns(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-sort]').forEach(function (sortWrap) {
      if (sortWrap.dataset.gemluxjewelPlpSortInit === 'true') return;
      sortWrap.dataset.gemluxjewelPlpSortInit = 'true';

      var nativeSelect = sortWrap.querySelector('.gemluxjewel-plp-sort__native');
      var dropdown = sortWrap.querySelector('[data-gemluxjewel-plp-sort-dropdown]');
      if (!nativeSelect || !dropdown) return;

      var trigger = dropdown.querySelector('summary');
      if (trigger) {
        trigger.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }

      var panel = dropdown.querySelector('.gemluxjewel-plp-sort__panel');
      if (panel) {
        panel.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }

      dropdown.addEventListener('toggle', function () {
        if (dropdown.open) {
          closeAllSortDropdowns(dropdown);
          closeAllDropdowns();
        }
      });

      sortWrap.querySelectorAll('[data-gemluxjewel-plp-sort-option]').forEach(function (button) {
        button.addEventListener('click', function (event) {
          event.preventDefault();
          var value = button.getAttribute('data-value');
          if (!value || nativeSelect.value === value) {
            dropdown.open = false;
            return;
          }

          nativeSelect.value = value;
          syncSortLabel(sortWrap);
          dropdown.open = false;
          nativeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });

      nativeSelect.addEventListener('change', function () {
        syncSortLabel(sortWrap);
      });

      syncSortLabel(sortWrap);
    });
  }

  function positionDropdownPanel(dropdown) {
    var panel = dropdown.querySelector('.gemluxjewel-plp-filter-dropdown__panel');
    if (!panel) return;

    panel.style.left = '';
    panel.style.right = '';
    panel.style.maxWidth = '';

    if (!dropdown.open) return;

    window.requestAnimationFrame(function () {
      var viewportPadding = 12;
      var panelRect = panel.getBoundingClientRect();

      if (panelRect.right > window.innerWidth - viewportPadding) {
        panel.style.left = 'auto';
        panel.style.right = '0';
      }

      panelRect = panel.getBoundingClientRect();

      if (panelRect.left < viewportPadding) {
        panel.style.left = '0';
        panel.style.right = 'auto';
      }

      panelRect = panel.getBoundingClientRect();

      if (panelRect.right > window.innerWidth - viewportPadding) {
        var triggerRect = dropdown.getBoundingClientRect();
        panel.style.maxWidth = Math.max(160, window.innerWidth - triggerRect.left - viewportPadding) + 'px';
        panel.style.left = '0';
        panel.style.right = 'auto';
      }
    });
  }

  function initDropdowns(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-dropdown]').forEach(function (dropdown) {
      if (dropdown.dataset.gemluxjewelPlpDropdownInit === 'true') return;
      dropdown.dataset.gemluxjewelPlpDropdownInit = 'true';

      var trigger = dropdown.querySelector('summary');
      if (trigger) {
        trigger.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }

      var panel = dropdown.querySelector('.gemluxjewel-plp-filter-dropdown__panel');
      if (panel) {
        panel.addEventListener('click', function (event) {
          event.stopPropagation();
        });
      }

      dropdown.addEventListener('toggle', function () {
        if (dropdown.open) {
          closeAllDropdowns(dropdown);
        }
        positionDropdownPanel(dropdown);
      });
    });
  }

  function openDrawer(scrollTarget) {
    var drawer = document.getElementById('GemluxPlpFilterDrawer');
    if (!drawer) return;

    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('gemluxjewel-plp-drawer-open');

    document.querySelectorAll('[data-gemluxjewel-plp-drawer-open]').forEach(function (button) {
      button.setAttribute('aria-expanded', 'true');
    });

    if (scrollTarget) {
      window.requestAnimationFrame(function () {
        var group = drawer.querySelector('[data-gemluxjewel-sidebar-group="' + scrollTarget + '"]');
        if (group) {
          group.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }
  }

  function closeDrawer() {
    var drawer = document.getElementById('GemluxPlpFilterDrawer');
    if (!drawer) return;

    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('gemluxjewel-plp-drawer-open');

    document.querySelectorAll('[data-gemluxjewel-plp-drawer-open]').forEach(function (button) {
      button.setAttribute('aria-expanded', 'false');
    });
  }

  function syncSidebarSort(sidebarSort, mainSort) {
    if (!sidebarSort || !mainSort || sidebarSort.dataset.gemluxjewelSortSync === 'true') return;
    sidebarSort.dataset.gemluxjewelSortSync = 'true';

    sidebarSort.addEventListener('change', function () {
      mainSort.value = sidebarSort.value;
      mainSort.dispatchEvent(new Event('change', { bubbles: true }));
      var sortWrap = document.querySelector('[data-gemluxjewel-plp-sort]');
      if (sortWrap) syncSortLabel(sortWrap);
    });

    mainSort.addEventListener('change', function () {
      sidebarSort.value = mainSort.value;
    });
  }

  function initDrawer(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-drawer-open]').forEach(function (button) {
      if (button.dataset.gemluxjewelPlpDrawerOpenInit === 'true') return;
      button.dataset.gemluxjewelPlpDrawerOpenInit = 'true';

      button.addEventListener('click', function (event) {
        event.preventDefault();
        openDrawer(button.getAttribute('data-gemluxjewel-plp-scroll-to'));
      });
    });

    root.querySelectorAll('[data-gemluxjewel-plp-drawer-close]').forEach(function (button) {
      if (button.dataset.gemluxjewelPlpDrawerCloseInit === 'true') return;
      button.dataset.gemluxjewelPlpDrawerCloseInit = 'true';

      button.addEventListener('click', function (event) {
        event.preventDefault();
        closeDrawer();
      });
    });

    syncSidebarSort(
      root.querySelector('[data-gemluxjewel-plp-sidebar-sort]'),
      root.querySelector('#SortBy')
    );
  }

  function initFilterLabels(root) {
    root.querySelectorAll('.gemluxjewel-plp-sidebar-group__option').forEach(function (option) {
      if (option.dataset.gemluxjewelFilterOptionInit === 'true') return;
      option.dataset.gemluxjewelFilterOptionInit = 'true';

      option.addEventListener('click', function (event) {
        var input = option.querySelector('input[type="checkbox"]');
        if (!input || input.disabled || event.target === input) return;
        event.preventDefault();
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  function initDropdownOptions(root) {
    root.querySelectorAll('.gemluxjewel-plp-filter-dropdown__option').forEach(function (option) {
      if (option.dataset.gemluxjewelDropdownOptionInit === 'true') return;
      option.dataset.gemluxjewelDropdownOptionInit = 'true';

      option.addEventListener('click', function (event) {
        var input = option.querySelector('input[type="checkbox"]');
        if (!input || input.disabled || event.target === input) return;
        event.preventDefault();
        input.checked = !input.checked;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      });
    });
  }

  function initCollectionSearch(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-search]').forEach(function (input) {
      if (input.dataset.gemluxjewelPlpSearchInit === 'true') return;
      input.dataset.gemluxjewelPlpSearchInit = 'true';

      var form = input.closest('form');
      var facetForm = input.closest('facet-filters-form');
      if (!form || !facetForm) return;

      function buildSearchParams() {
        var params = new FormData(form);
        var query = (params.get('q') || '').trim();

        if (!query) {
          params.delete('q');
          params.delete('options[prefix]');
        } else {
          params.set('q', query);
          params.set('options[prefix]', 'last');
        }

        return new URLSearchParams(params).toString();
      }

      function submitSearch() {
        facetForm.onSubmitForm(buildSearchParams(), { target: input });
      }

      var debouncedSubmit = typeof debounce === 'function' ? debounce(submitSearch, 500) : submitSearch;

      input.addEventListener('input', function (event) {
        event.stopPropagation();
        debouncedSubmit();
      });

      input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          event.preventDefault();
          submitSearch();
        }
      });

      input.addEventListener('search', function () {
        submitSearch();
      });
    });
  }

  function init(root) {
    root = root || document;
    initDropdowns(root);
    initSortDropdowns(root);
    initDrawer(root);
    initFilterLabels(root);
    initDropdownOptions(root);
    initCollectionSearch(root);
  }

  document.addEventListener('click', function (event) {
    if (event.target.closest('[data-gemluxjewel-plp-dropdown]')) return;
    closeAllDropdowns();
    if (!event.target.closest('[data-gemluxjewel-plp-sort-dropdown]')) {
      closeAllSortDropdowns();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllDropdowns();
      closeAllSortDropdowns();
      closeDrawer();
    }
  });

  function resetInitFlags(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-dropdown]').forEach(function (el) {
      delete el.dataset.gemluxjewelPlpDropdownInit;
    });
    root.querySelectorAll('[data-gemluxjewel-plp-sort]').forEach(function (el) {
      delete el.dataset.gemluxjewelPlpSortInit;
    });
    root.querySelectorAll('[data-gemluxjewel-filter-option-init]').forEach(function (el) {
      delete el.dataset.gemluxjewelFilterOptionInit;
    });
    root.querySelectorAll('[data-gemluxjewel-dropdown-option-init]').forEach(function (el) {
      delete el.dataset.gemluxjewelDropdownOptionInit;
    });
    root.querySelectorAll('[data-gemluxjewel-plp-search]').forEach(function (el) {
      delete el.dataset.gemluxjewelPlpSearchInit;
    });
  }

  document.addEventListener('gemluxjewel:facets-updated', function () {
    var params = new URLSearchParams(window.location.search);
    document.querySelectorAll('[data-gemluxjewel-plp-search]').forEach(function (input) {
      input.value = params.get('q') || '';
    });
    resetInitFlags(document);
    init(document);
  });

  init(document);

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
