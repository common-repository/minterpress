import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class NftOrder {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.nftId = this.el.dataset.nftOrderId;
    this.input = this.el.querySelector("input");
  }

  bindEvents() {
    this.input.addEventListener("change", async (event) => {
      UiHelpers.turnOnConfirmExit();
      const newOrderMetaValue = event.target.value;
      const data = {
        action: "update_nft",
        id: this.nftId,
        meta: {
          order: newOrderMetaValue,
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
