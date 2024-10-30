export default class UiHelpers {
  static hiddenClass = "hidden";

  /**
   * Toggle state of sign in / sign out buttons.
   *
   * @param {boolean} walletIsActive a boolean indicating an active wallet
   * @param {*} connectButton the connect element
   * @param {*} disconnectButton the disconnect element
   */
  static toggleButtons(walletIsActive, connectButton, disconnectButton) {
    if (walletIsActive) {
      connectButton.disabled = true;
      disconnectButton.disabled = false;
    } else {
      disconnectButton.disabled = true;
      connectButton.disabled = false;
    }
  }

  /**
   * Show an element.
   *
   * @param {*} el the element.
   */
  static show(el) {
    if (el) {
      el.classList.remove(this.hiddenClass);
    }
  }

  /**
   * Hide an element.
   *
   * @param {*} el the element.
   */
  static hide(el) {
    if (el) {
      el.classList.add(this.hiddenClass);
    }
  }

  /**
   * Toggle visibility of an element.
   *
   * @param {*} el the element.
   */
  static toggleVisibility(el) {
    if (el.classList.contains(this.hiddenClass)) {
      this.show(el);
    } else {
      this.hide(el);
    }
  }

  /**
   * Warn users before closing window or navigating away.
   */
  static turnOnConfirmExit() {
    window.onbeforeunload = () => {
      return true;
    };
  }

  /**
   * Do not warn users before closing window or navigating away.
   */
  static turnOffConfirmExit() {
    window.onbeforeunload = null;
  }
}
