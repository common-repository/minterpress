import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class GalleryEdit {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.galleryId = this.el.dataset.galleryId;
    this.form = this.el.querySelector('[data-gallery-edit="form"]');
    this.saveButton = this.el.querySelector('[data-gallery-edit="save"]');
    this.savedNotice = document.getElementById("minterpress-app-notice-saved");
  }

  bindEvents() {
    this.saveButton.addEventListener("click", (e) => this.handleSave(e));
  }

  async handleSave() {
    const formData = new FormData(this.form);
    const entries = formData.entries();
    const jsonData = Object.fromEntries(entries);
    // Wordpress requires an array of term ids.
    jsonData.minterpress_category = [jsonData.minterpress_category];
    const response = await WpApiHelpers.updateGallery(this.galleryId, jsonData);
    if (response.status === 200) {
      UiHelpers.show(this.savedNotice);
    } else {
      alert(`Something went wrong: ${response.statusText}`);
    }
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
