import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class NftCategory {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.nftId = this.el.dataset.nftStatusId;
    this.select = this.el.querySelector("[data-category='select']");
  }

  bindEvents() {
    this.select.addEventListener("change", async (event) => {
      UiHelpers.turnOnConfirmExit();
      const newCategoryId = event.target.value;
      const data = {
        action: "update_nft",
        id: this.nftId,
        minterpress_category: newCategoryId,
      };
      await WpApiHelpers.postToAjax(data);
      UiHelpers.turnOffConfirmExit();
    });
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
