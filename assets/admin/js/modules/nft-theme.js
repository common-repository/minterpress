import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";
export default class NftTheme {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.nftPreview = this.el.querySelector(".nft-card");
    this.form = this.el.querySelector("form");
    this.borderRadius = this.el.querySelector("#borderRadius");
    this.borderWidth = this.el.querySelector("#borderWidth");
    this.borderColor = this.el.querySelector("#borderColor");
    this.fontFamily = this.el.querySelector("#fontFamily");
    this.textColor = this.el.querySelector("#textColor");
    this.cardColor = this.el.querySelector("#cardColor");
    this.themeInputs = this.el.querySelectorAll(".theme-input");
    this.themeUiFeedback = document.querySelector(
      "#minterpress-app-notice-nft-theme"
    );
  }

  bindEvents() {
    this.themeInputs.forEach((input) => {
      input.addEventListener("change", (e) => this.updateStyles(e));
    });
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
    this.form.addEventListener("reset", (e) => this.handleReset(e));
  }

  updateStyles(e, isReset = false) {
    if (e?.currentTarget?.type === "range") {
      const target = e.currentTarget;
      this.setRangeInput(target);
    }

    this.nftPreview.style.setProperty(
      "--nft-card-border-width",
      `${isReset ? this.borderWidth.defaultValue : this.borderWidth.value}px`
    );
    this.nftPreview.style.setProperty(
      "--nft-card-border-color",
      isReset ? this.borderColor.defaultValue : this.borderColor.value
    );
    this.nftPreview.style.setProperty(
      "--nft-card-radius",
      `${isReset ? this.borderRadius.defaultValue : this.borderRadius.value}px`
    );
    this.nftPreview.style.setProperty(
      "--nft-card-text-color",
      isReset ? this.textColor.defaultValue : this.textColor.value
    );
    this.nftPreview.style.setProperty(
      "--nft-card-card-color",
      isReset ? this.cardColor.defaultValue : this.cardColor.value
    );
    this.nftPreview.style.setProperty(
      "--nft-card-font-family",
      isReset ? this.fontFamily.defaultValue : this.fontFamily.value
    );
  }

  async handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this.form);
    const entries = formData.entries();
    const jsonData = Object.fromEntries(entries);
    const stringifiedData = JSON.stringify(jsonData);
    const data = {
      action: "update_options",
      options: JSON.stringify({ mp_theme: stringifiedData }),
    };

    try {
      await WpApiHelpers.postToAjax(data);
    } catch (err) {
      const themeUiFeedbackText = this.themeUiFeedback.querySelector("p");
      themeUiFeedbackText.innerText =
        "Sorry, there was an error saving your theme settings.";
    } finally {
      UiHelpers.show(this.themeUiFeedback);
      this.themeUiFeedback.scrollIntoView({behavior: "smooth", block: "end", inline: "nearest"});
    }
  }

  handleReset(e) {
    this.updateStyles(e, true);
    this.setRangeInput(this.borderRadius, true);
    this.setRangeInput(this.borderWidth, true);
  }

  setRangeInput(target, isReset = false) {
    const min = target.min;
    const max = target.max;
    const val = isReset ? target.defaultValue : target.value;

    target.style.setProperty(
      "--rangeProgress",
      `${((val - min) / (max - min)) * 100}%`
    );
  }

  init() {
    this.setVars();
    this.bindEvents();
    this.updateStyles();
    this.setRangeInput(this.borderRadius);
    this.setRangeInput(this.borderWidth);
  }
}
