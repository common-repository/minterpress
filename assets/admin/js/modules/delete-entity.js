import WpApiHelpers from "../helpers/wpApiHelpers";

export default class DeleteEntity {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.entityId = this.el.dataset.entityId;
  }

  bindEvents() {
    this.el.addEventListener("click", async () => {
      const data = {
        action: "delete_post",
        id: this.entityId,
      };

      await WpApiHelpers.postToAjax(data);
      location.reload();
    });
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
