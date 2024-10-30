import tagsInput from "tags-input";
import WpApiHelpers from "../helpers/wpApiHelpers";
import UiHelpers from "../helpers/uiHelpers";

export default class MintingForm {
  constructor(el) {
    this.el = el;
    this.init();
  }

  enhanceTagInputs() {
    if (this.tagsEls.length > 0) {
      this.tagsEls.forEach((tagEl) => {
        tagsInput(tagEl);
      });
    }
  }

  /**
   * Use WP-JSON to create a new post
   *
   * @param {*} event the event of the function (click or submit).
   * @param {boolean} isDraft whether the post should be set as a draft.
   */
  async postDataToWpApi(event) {
    const formData = new FormData(this.el);

    const wpId = await WpApiHelpers.saveNftDraft(formData, this.wpId);
    this.wpId = wpId;
    UiHelpers.show(this.draftSavedNotice);
    event.preventDefault();
  }

  setVars() {
    this.tagsEls = this.el.querySelectorAll('input[type="tags"]');
    this.draftButton = this.el.querySelector(
      '[data-minting-form="draft-button"]'
    );
    this.draftSavedNotice = document.getElementById(
      "minterpress-app-notice-saved"
    );

    this.wpId = null;

    this.wpMedia = wp.media.frames.file_frame = wp.media({
      title: "Select media",
      button: {
        text: "Select media",
      },
      multiple: false,
    });
    this.uploadButton = this.el.querySelector("#upload-button");
    this.uploadInput = this.uploadButton.querySelector("input");
    this.preview = this.el.querySelector("#mint-image-preview");
    this.dialogPreview = this.el.querySelector("#mint-image-dialog-preview");
    this.hiddenWpImageUrl = this.el.querySelector("#wpImageUrl");
  }

  bindEvents() {
    this.draftButton.addEventListener("click", (event) => {
      this.postDataToWpApi(event, true);
    });

    this.uploadButton.addEventListener("click", () => {
      this.handleUpload();
    });

    this.wpMedia.on("select", () => {
      var attachment = this.wpMedia.state().get("selection").first().toJSON();
      this.preview.style.backgroundImage = "url('" + attachment.url + "')";
      this.hiddenWpImageUrl.value = attachment.url;
      this.dialogPreview.src = attachment.url;
      UiHelpers.hide(this.uploadInput);
    });
  }

  handleUpload() {
    if (this.wpMedia) {
      this.wpMedia.open();
      return;
    }
  }

  handleDraft() {
    const hasImage = this.hiddenWpImageUrl.value;
    if (hasImage) {
      UiHelpers.hide(this.uploadInput);
    }
  }

  init() {
    this.setVars();
    this.bindEvents();
    this.enhanceTagInputs();
    this.handleDraft();
  }
}
