document.addEventListener('DOMContentLoaded', initGemluxjewelEngagementRing);
document.addEventListener('shopify:section:load', initGemluxjewelEngagementRing);

function initGemluxjewelEngagementRing() {
  initEngagementHeroReadMore();
  initEngagementFaqTabs();
}

function initEngagementHeroReadMore() {
  document.querySelectorAll('[data-gemluxjewel-engagement-hero]').forEach(function (section) {
    if (section.dataset.gemluxjewelEngagementHeroReady === 'true') return;

    var text = section.querySelector('[data-gemluxjewel-engagement-hero-text]');
    var toggle = section.querySelector('[data-gemluxjewel-engagement-hero-toggle]');
    if (!text || !toggle) return;

    toggle.addEventListener('click', function () {
      var collapsed = text.classList.toggle('is-collapsed');
      toggle.textContent = collapsed ? toggle.dataset.moreLabel || 'Read more' : toggle.dataset.lessLabel || 'Read less';
      toggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
    });

    section.dataset.gemluxjewelEngagementHeroReady = 'true';
  });
}

function initEngagementFaqTabs() {
  document.querySelectorAll('[data-gemluxjewel-engagement-faq]').forEach(function (section) {
    if (section.dataset.gemluxjewelEngagementFaqReady === 'true') return;

    var tabs = section.querySelectorAll('[data-gemluxjewel-engagement-faq-tab]');
    var items = section.querySelectorAll('[data-gemluxjewel-engagement-faq-item]');
    if (!tabs.length || !items.length) return;

    function filter(category) {
      items.forEach(function (item) {
        var itemCategory = item.dataset.category || 'lab_grown';
        item.classList.toggle('is-hidden', itemCategory !== category);
      });

      section.querySelectorAll('.closet-header.active').forEach(function (header) {
        header.classList.remove('active');
        header.setAttribute('aria-expanded', 'false');
        if (header.nextElementSibling) {
          header.nextElementSibling.style.display = 'none';
        }
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (other) {
          other.classList.remove('is-active');
          other.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('is-active');
        tab.setAttribute('aria-selected', 'true');
        filter(tab.dataset.category || 'lab_grown');
      });
    });

    var activeTab = section.querySelector('[data-gemluxjewel-engagement-faq-tab].is-active');
    filter(activeTab ? activeTab.dataset.category : 'lab_grown');

    section.dataset.gemluxjewelEngagementFaqReady = 'true';
  });
}
