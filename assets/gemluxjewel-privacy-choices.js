document.addEventListener('DOMContentLoaded', initGemluxjewelPrivacyChoices);
document.addEventListener('shopify:section:load', initGemluxjewelPrivacyChoices);

function initGemluxjewelPrivacyChoices() {
  document.querySelectorAll('[data-gemluxjewel-privacy-choices]').forEach(function (section) {
    if (section.dataset.gemluxjewelPrivacyChoicesReady === 'true') return;

    var button = section.querySelector('[data-gemluxjewel-privacy-opt-out]');
    var status = section.querySelector('[data-gemluxjewel-privacy-status]');
    if (!button) return;

    function showSuccess(message) {
      button.disabled = true;
      button.classList.add('is-success');
      button.textContent = message;

      if (status) {
        status.hidden = false;
        status.textContent = message;
      }
    }

    function checkConsent() {
      if (!window.Shopify || !window.Shopify.customerPrivacy || !window.Shopify.customerPrivacy.getTrackingConsent) {
        return;
      }

      window.Shopify.customerPrivacy.getTrackingConsent(function (consent) {
        if (consent && consent.sale_of_data === false) {
          showSuccess(button.dataset.success || 'You have opted out of data sharing on this device.');
        }
      });
    }

    button.addEventListener('click', function () {
      if (!window.Shopify || !window.Shopify.customerPrivacy || !window.Shopify.customerPrivacy.setTrackingConsent) {
        if (status) {
          status.hidden = false;
          status.textContent = 'Privacy settings are unavailable. Please try again later.';
        }
        return;
      }

      button.disabled = true;

      window.Shopify.customerPrivacy.setTrackingConsent({ sale_of_data: false }, function () {
        showSuccess(button.dataset.success || 'You have opted out of data sharing on this device.');
      });
    });

    checkConsent();
    section.dataset.gemluxjewelPrivacyChoicesReady = 'true';
  });
}
