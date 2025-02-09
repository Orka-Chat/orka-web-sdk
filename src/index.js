class Orka {
  constructor() {
    window.ORKA_SESSION = window.ORKA_SESSION || {};
  }

  configure(appId, options = {}) {
    this.appId = appId;
    this.env = options.env ?? "prod";
    this.autoload = options.autoload ?? true;

    if (this.autoload) {
      this.load();
    }
  }

  load() {
    window.ORKA_APP_ID = this.appId;
    const script = document.createElement("script");
    script.src = `//widget.orka.chat/app.js`;
    if (this.env === "dev") {
      script.src = `http://localhost:5175/app.js`;
    }
    document.head.appendChild(script);
  }

  update(data) {
    if (typeof window.Orka !== "undefined") {
      window.Orka.update(data);
    } else {
      window.ORKA_SESSION = {
        ...window.ORKA_SESSION,
        ...data,
      };
    }
  }

  reset() {
    window.Orka.reset();
  }

  toggle() {
    window.Orka.toggle();
  }

  show() {
    window.Orka.show();
  }

  hide() {
    window.Orka.hide();
  }

  destroy() {
    window.Orka.destroy();
  }
}

const instance = new Orka();

export default instance;
