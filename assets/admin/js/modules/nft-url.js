import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class NftUrl {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.nftId = this.el.dataset.nftUrlId;
    this.input = this.el.querySelector("input");
  }

  bindEvents() {
    this.input.addEventListener("change", async (event) => {
      UiHelpers.turnOnConfirmExit();
      const newUrlMetaValue = event.target.value;
      const data = {
        action: "update_nft",
        id: this.nftId,
        meta: {
          mintUrl: newUrlMetaValue,
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
