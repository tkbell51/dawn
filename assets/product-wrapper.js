// Name must contain a dash
if (!customElements.get('product-wrapper')) {
  customElements.define(
    'product-wrapper',
    class ProductWrapper extends HTMLElement {
      constructor() {
        super();
      }

      onVariantChangeUnsubscriber = undefined;
      swapProductUtility = undefined;

      connectedCallback() {
        this.initializeProductSwapUtility();

        this.onVariantChangeUnsubscriber = subscribe(
          PUB_SUB_EVENTS.variantChangeStart,
          this.handleOptionValueChange.bind(this)
        );
      }

      disconnectedCallback() {
        this.onVariantChangeUnsubscriber();
      }

      initializeProductSwapUtility() {
        this.swapProductUtility = new HTMLUpdateUtility();
        this.swapProductUtility.addPreProcessCallback((html) => {
          html
            .querySelectorAll('.scroll-trigger')
            .forEach((element) => element.classList.add('scroll-trigger--cancel'));
          return html;
        });
        this.swapProductUtility.addPostProcessCallback((newNode) => {
          window?.Shopify?.PaymentButton?.init();
          window?.ProductModel?.loadShopifyXR();
          publish(PUB_SUB_EVENTS.sectionRefreshed, {
            data: {
              sectionId: this.dataset.section,
              resource: {
                type: SECTION_REFRESH_RESOURCE_TYPE.product,
                id: this.dataset.productId,
                // TODO need to update dataset productID after swap happens
              },
            },
          });
        });
      }

      handleOptionValueChange({ data: { event, targetId, targetUrl, variant } }) {
        if (!this.contains(event.target)) return;

        // const input = this.getInputForEventTarget(event.target);
        // const targetId = input.id;
        // const targetUrl = input.dataset.productUrl;
        // this.currentVariant = this.getVariantData(targetId);

        // TODO how do we want to handle this?
        // const sectionId = this.dataset.originalSection || this.dataset.section;
        // this.updateSelectedSwatchValue(event);

        this.productForm?.toggleSubmitButton(true, '');
        // this.toggleAddButton(true, '', false);
        // this.removeErrorMessage();

        // let callback = () => {};
        // if (this.dataset.url !== targetUrl) {
        //   this.updateURL(targetUrl);
        //   this.updateShareUrl(targetUrl);
        //   callback = this.handleSwapProduct(sectionId);
        // } else if (!this.currentVariant) {
        //   this.setUnavailable();
        //   callback = (html) => {
        //     this.updatePickupAvailability();
        //     this.updateOptionValues(html);
        //   };
        // } else {
        //   this.updateMedia();
        //   this.updateURL(targetUrl);
        //   this.updateVariantInput();
        //   this.updateShareUrl(targetUrl);
        //   callback = this.handleUpdateProductInfo(sectionId);
        // }

        // this.renderProductInfo(sectionId, targetUrl, targetId, callback);

        debugger;
      }

      // TODO should this live on productform
      // toggleAddButton(disable = true, text, modifyClass = true) {
      //   // TODO worth it to replace this with a static instance of this.productform? or no because you have to refresh it?
      //   debugger;
      //   const productForm = this.querySelector(`#product-form-${this.dataset.section}`);

      //   productForm?.toggleSubmitButton(disable, text);
      //   // if (!productForm) return;

      //   const addButton = productForm.querySelector('[name="add"]');
      //   const addButtonText = productForm.querySelector('[name="add"] > span');
      //   if (!addButton) return;

      //   if (disable) {
      //     addButton.setAttribute('disabled', 'disabled');
      //     if (text) addButtonText.textContent = text;
      //   } else {
      //     addButton.removeAttribute('disabled');
      //     addButtonText.textContent = window.variantStrings.addToCart;
      //   }
      // }

      // should this be memoized? or no because the content can be changed?
      get productForm() {
        return this.querySelector(`#product-form-${this.dataset.section}`);
      }
    }
  );
}
