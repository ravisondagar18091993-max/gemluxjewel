(function () {
  var layout = document.querySelector('[data-gemluxjewel-shop-layout]');
  var toggle = document.querySelector('[data-gemluxjewel-filter-toggle]');
  var checkbox = document.querySelector('[data-gemluxjewel-filter-checkbox]');
  var toggleLabel = toggle ? toggle.querySelector('span:first-child') : null;
  var showLabel = toggle ? toggle.getAttribute('data-show-label') || 'Show Filter' : 'Show Filter';
  var hideLabel = toggle ? toggle.getAttribute('data-hide-label') || 'Hide Filter' : 'Hide Filter';

  function openFilterGroups() {
    document.querySelectorAll('.gemluxjewel-facets .facets__disclosure-vertical').forEach(function (details) {
      details.open = true;
    });
  }

  function syncFilters() {
    if (!layout || !checkbox) return;
    layout.classList.toggle('is-filters-open', checkbox.checked);
    if (toggleLabel) {
      toggleLabel.textContent = checkbox.checked ? hideLabel : showLabel;
    }
  }

  if (layout && toggle && checkbox) {
    toggle.addEventListener('click', function (e) {
      if (e.target === checkbox) return;
      e.preventDefault();
      checkbox.checked = !checkbox.checked;
      syncFilters();
    });

    checkbox.addEventListener('change', syncFilters);
    syncFilters();
  }

  openFilterGroups();

  document.addEventListener('shopify:section:load', openFilterGroups);
})();
