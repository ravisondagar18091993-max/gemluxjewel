(function () {
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

  document.querySelectorAll('[data-dirona-accordion]').forEach(function (root) {
    root.querySelectorAll('.closet-header').forEach(function (header) {
      header.addEventListener('click', function () {
        toggleAccordion(root, header);
      });

      header.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          toggleAccordion(root, header);
        }
      });
    });
  });
})();
