import dialogPolyfill from "dialog-polyfill";

export default class Dialog {
  constructor(el) {
    this.el = el;
    this.init();
  }

  toggleDialog() {
    const modalIsOpen = this.dialog.getAttribute("open");
    if (modalIsOpen) {
      this.dialog.removeAttribute("open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.removeEventListener("keydown", this.trapFocus);
    } else {
      this.dialog.setAttribute("open", true);
      document.body.style.position = "fixed";
      const wpHeaderHeight = 32;
      window.scrollTo(0, parseInt(scrollY - wpHeaderHeight || "0") * -1);
      document.addEventListener("keydown", (e) => this.trapFocus(e));

      // Skip the close button, focus on the first non-close element.
      this.focusableContent[1].focus();
    }
  }

  setVars() {
    this.triggers = this.el.querySelectorAll('[data-dialog="trigger"]');
    this.dialog = this.el.querySelector("dialog");
    this.focusableElements =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    this.firstFocusableElement = this.dialog.querySelectorAll(
      this.focusableElements
    )[0];
    this.focusableContent = this.dialog.querySelectorAll(
      this.focusableElements
    );
    this.lastFocusableElement =
      this.focusableContent[this.focusableContent.length - 1];
  }

  registerPolyfills() {
    dialogPolyfill.registerDialog(this.dialog);
  }

  bindEvents() {
    this.triggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => this.toggleDialog(e));
    });
  }

  trapFocus(e) {
    const isEscapePressed = e.key === "Espcape" || e.keyCode === 27;
    if (isEscapePressed) {
      this.toggleDialog();
      return;
    }

    const isTabPressed = e.key === "Tab" || e.keyCode === 9;
    if (!isTabPressed) {
      return;
    }

    if (e.shiftKey) {
      // if shift key pressed for shift + tab combination
      if (document.activeElement === this.firstFocusableElement) {
        this.lastFocusableElement.focus(); // add focus for the last focusable element
        e.preventDefault();
      }
    } else {
      // if tab key is pressed
      if (document.activeElement === this.lastFocusableElement) {
        // if focused has reached to last focusable element then focus first focusable element after pressing tab
        this.firstFocusableElement.focus(); // add focus for the first focusable element
        e.preventDefault();
      }
    }
  }

  init() {
    this.setVars();
    this.registerPolyfills();
    this.bindEvents();
  }
}
