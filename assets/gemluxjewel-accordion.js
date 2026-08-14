(function () {
  if (window.__gemluxjewelAccordionBound) return;
  window.__gemluxjewelAccordionBound = true;

  function setItemState(item, isOpen) {
    if (!item) return;

    var header = item.querySelector('.closet-header');
    var content = item.querySelector('.closet-content');
    if (!header || !content) return;

    item.classList.toggle('is-open', isOpen);
    header.classList.toggle('active', isOpen);
    header.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

    content.style.display = '';

    if (isOpen) {
      content.removeAttribute('hidden');
    } else {
      content.setAttribute('hidden', '');
    }
  }

  function toggleAccordion(root, header) {
    var item = header.closest('.closet-item');
    if (!item) return;

    var isOpen = item.classList.contains('is-open');

    root.querySelectorAll('.closet-item.is-open').forEach(function (openItem) {
      if (openItem !== item) setItemState(openItem, false);
    });

    setItemState(item, !isOpen);
  }

  function handleToggle(event) {
    var header = event.target.closest('.closet-header');
    if (!header) return;

    var root = header.closest('[data-gemluxjewel-accordion]');
    if (!root) return;

    if (event.type === 'keydown' && event.key !== 'Enter' && event.key !== ' ') return;
    if (event.type === 'keydown') event.preventDefault();

    toggleAccordion(root, header);
  }

  function initAccordionDefaults() {
    document.querySelectorAll('[data-gemluxjewel-accordion]').forEach(function (root) {
      root.querySelectorAll('.closet-item').forEach(function (item) {
        setItemState(item, item.classList.contains('is-open'));
      });
    });
  }

  initAccordionDefaults();
  document.addEventListener('DOMContentLoaded', initAccordionDefaults);
  document.addEventListener('shopify:section:load', initAccordionDefaults);

  document.addEventListener('click', handleToggle);
  document.addEventListener('keydown', handleToggle);
})();
