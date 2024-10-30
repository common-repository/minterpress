import WpApiHelpers from "../helpers/wpApiHelpers";

export default class GalleryCreate {
  constructor(el) {
    this.el = el;
    this.init();
  }

  async handleCreate(e) {
    e.preventDefault();
    const formData = new FormData(this.el);
    const postId = await WpApiHelpers.createGallery(formData);
    window.location.href = `${window.location.href}&id=${postId}`;
  }

  setVars() {}

  bindEvents() {
    this.el.addEventListener("submit", (e) => this.handleCreate(e));
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
