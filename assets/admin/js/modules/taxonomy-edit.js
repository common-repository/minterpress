import WpApiHelpers from "../helpers/wpApiHelpers";

export default class TaxonomyEdit {
  constructor(el) {
    this.el = el;
    this.init();
  }

  async handleSubmit(e) {
    e.preventDefault();
    const term = this.input.value;
    const data = {
      action: "update_taxonomy",
      data: JSON.stringify({
        taxonomy: this.taxonomyName,
        action: "create",
        name: term,
      }),
    };
    await WpApiHelpers.postToAjax(data);
    location.reload();
  }

  async handleDelete(termId) {
    const data = {
      action: "update_taxonomy",
      data: JSON.stringify({
        taxonomy: this.taxonomyName,
        action: "delete",
        id: termId,
      }),
    };
    await WpApiHelpers.postToAjax(data);
    location.reload();
  }

  setVars() {
    this.taxonomyName = this.el.dataset.taxonomyName;
    this.submitButton = this.el.querySelector('[data-edit-tax="submit"]');
    this.input = this.el.querySelector('[data-edit-tax="new-term"]');
    this.deleteButtons = this.el.querySelectorAll('[data-tax-action="delete"]');
  }

  bindEvents() {
    this.submitButton.addEventListener("click", (e) => this.handleSubmit(e));
    this.deleteButtons.forEach((element) => {
      element.addEventListener("click", (e) => {
        e.preventDefault();
        this.handleDelete(element.dataset.termId);
      });
    });
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
