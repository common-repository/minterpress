import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class NftStatus {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.nftId = this.el.dataset.nftStatusId;
    this.select = this.el.querySelector("select");
  }

  bindEvents() {
    this.select.addEventListener("change", async (event) => {
      UiHelpers.turnOnConfirmExit();
      const newPublicMetaValue = event.target.value === "displayed";
      const data = {
        action: "update_nft",
        id: this.nftId,
        meta: {
          public: newPublicMetaValue,
        },
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
