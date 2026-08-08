(function () {
  if (window.__gemluxjewelAccordionBound) return;
  window.__gemluxjewelAccordionBound = true;

  function toggleAccordion(root, header) {
    var content = header.nextElementSibling;
    if (!content || !content.classList.contains('closet-content')) return;

    var isOpen = header.classList.contains('active');

    root.querySelectorAll('.closet-header.active').forEach(function (openHeader) {
      if (openHeader !== header) {
        openHeader.classList.remove('active');
        openHeader.setAttribute('aria-expanded', 'false');
        if (openHeader.nextElementSibling) {
          openHeader.nextElementSibling.style.display = 'none';
        }
      }
    });

    if (isOpen) {
      header.classList.remove('active');
      header.setAttribute('aria-expanded', 'false');
      content.style.display = 'none';
    } else {
      header.classList.add('active');
      header.setAttribute('aria-expanded', 'true');
      content.style.display = 'block';
    }
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

  document.addEventListener('click', handleToggle);
  document.addEventListener('keydown', handleToggle);
})();
