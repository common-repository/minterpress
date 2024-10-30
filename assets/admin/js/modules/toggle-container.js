export default class ToggleContainer {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.toggle = this.el.querySelector('[data-toggle-container="toggle"]');
    this.container = this.el.querySelector(
      '[data-toggle-container="container"]'
    );
    const classesString = this.el.dataset.toggleContainerClasses;
    this.classesArray = classesString.split(" ");
  }

  toggleContainer() {
    this.classesArray.forEach((className) => {
      this.container.classList.toggle(className);
    });
  }

  bindEvents() {
    this.toggle.addEventListener("click", () => this.toggleContainer());
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
