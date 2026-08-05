document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('[data-gemluxjewel-policy-nav]');
  if (!nav) return;

  const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
  const sections = links
    .map((link) => {
      const id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    })
    .filter(Boolean);

  if (!sections.length) return;

  const setActive = (id) => {
    links.forEach((link) => {
      const item = link.parentElement;
      if (!item) return;
      item.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
    });
  };

  setActive(sections[0].id);

  const onScroll = () => {
    const offset = window.scrollY + 205;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (offset >= top && offset < bottom) {
        setActive(section.id);
      }
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
