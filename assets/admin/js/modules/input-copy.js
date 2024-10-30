export default class InputCopy {
  constructor(el) {
    this.el = el;
    this.init();
  }

  generateString(replaceableElement, associatedElement) {
    if (associatedElement.value) {
      replaceableElement.innerHTML = associatedElement.value;
    } else {
      replaceableElement.innerHTML = "Not provided";
    }
  }

  generateArray(replaceableElement, associatedElement) {
    if (associatedElement.value) {
      const valueWithSpaces = associatedElement.value.replace(/,/g, ", ");
      replaceableElement.innerHTML = valueWithSpaces;
    } else {
      replaceableElement.innerHTML = "Not provided";
    }
  }

  generateImage(replaceableElement, associatedElement) {
    const associatedImage = associatedElement.querySelector("img") || null;
    if (associatedImage) {
      const associatedImageSrc = associatedImage.getAttribute("src");
      replaceableElement.setAttribute("src", associatedImageSrc);
    } else {
      // the user should never get here
      console.warn("Did not provide an image... Check this on the server!");
    }
  }

  updateUI() {
    this.containers.forEach((container) => {
      const containerType = container.dataset.inputCopyType;
      const replaceableElement = container.querySelector(
        "[data-input-copy-id]"
      );
      const replaceableElementID = replaceableElement.dataset.inputCopyId;
      const associatedElement = document.getElementById(replaceableElementID);

      switch (containerType) {
        case "string":
          this.generateString(replaceableElement, associatedElement);
          break;
        case "array":
          this.generateArray(replaceableElement, associatedElement);
          break;
        default:
          replaceableElement.innerHTML = "Not provided";
          console.log("provide a valid type");
      }
    });
  }

  setVars() {
    this.containers = this.el.querySelectorAll("[data-input-copy-type]");
    this.trigger = this.el.querySelector("[data-input-copy='trigger']");
  }

  bindEvents() {
    this.trigger.addEventListener("click", () => this.updateUI());
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
