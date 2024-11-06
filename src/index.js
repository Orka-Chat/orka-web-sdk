class Orka {
  constructor() {}

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
}

const instance = new Orka();

export default instance;
