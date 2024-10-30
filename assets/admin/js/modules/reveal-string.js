export default class RevealString {
  constructor(el) {
    this.el = el;
    this.init();
  }

  setVars() {
    this.fullString = this.el.dataset.fulltext;
    this.span = this.el.querySelector("span");
    this.initialString = this.span.innerHTML;
    this.copiedText = "Copied!";
    this.copied = false;
  }

  bindEvents() {
    this.el.addEventListener("mouseover", (e) => {
      this.span.innerHTML = this.copied ? this.copiedText : this.fullString;
    });

    this.el.addEventListener("mouseout", (e) => {
      this.span.innerHTML = this.copied ? this.copiedText : this.initialString;
    });

    this.el.addEventListener("click", (e) => {
      if (!this.copied) {
        navigator.clipboard.writeText(this.fullString);
        this.span.innerHTML = this.copiedText;
        this.copied = true;
      } else {
        this.copied = false;
        this.span.innerHTML = this.fullString;
      }
    });
  }

  init() {
    this.setVars();
    this.bindEvents();
  }
}
