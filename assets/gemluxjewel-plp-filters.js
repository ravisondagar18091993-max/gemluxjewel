(function () {
  function closeAllDropdowns(except) {
    document.querySelectorAll('[data-gemluxjewel-plp-dropdown]').forEach(function (dropdown) {
      if (except && dropdown === except) return;
      dropdown.open = false;
    });
  }

  function initDropdowns(root) {
    root.querySelectorAll('[data-gemluxjewel-plp-dropdown]').forEach(function (dropdown) {
      if (dropdown.dataset.gemluxjewelPlpDropdownInit === 'true') return;
      dropdown.dataset.gemluxjewelPlpDropdownInit = 'true';

      dropdown.addEventListener('toggle', function () {
        if (dropdown.open) {
          closeAllDropdowns(dropdown);
        }
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

  function init(root) {
    root = root || document;
    initDropdowns(root);
    initDrawer(root);
    initFilterLabels(root);
  }

  document.addEventListener('click', function (event) {
    if (!event.target.closest('[data-gemluxjewel-plp-dropdown]')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllDropdowns();
      closeDrawer();
    }
  });

  document.addEventListener('gemluxjewel:facets-updated', function () {
    init(document);
  });

  init(document);

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target);
  });
})();
