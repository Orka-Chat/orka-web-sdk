// Orka Web SDK, the npm package. It injects the same script as the HTML snippet (app.js, served by widget.orka.chat)
// and forwards every call to window.Orka. Before the script is loaded, window.Orka is a stub that queues the calls
// in order (window.Orka._q, the same queue as the snippet): app.js replays them when it runs. Nothing else is done
// here, the behavior of every method is the one of app.js. See https://docs.orka.chat/public-api/docs/sdk/npm

const SCRIPT_URLS = { prod: "https://widget.orka.chat/app.js", dev: "http://localhost:5175/app.js" };

// Calls queued before app.js runs. Keep in sync with window.Orka of app.js
const METHODS = ["update", "reset", "show", "hide", "toggle", "showWidget", "hideWidget", "load", "destroy", "on", "off", "track"];
// Synchronous state, with the value returned before the widget is ready
const GETTERS = { isReady: false, isOpen: false, isOnline: false, getUnreadCount: 0 };

const hasWindow = () => typeof window !== "undefined";

// window.Orka: the real one once app.js ran, the queuing stub before that
const target = () => {
  if (!hasWindow()) {
    return null;
  }
  if (!window.Orka) {
    const stub = { _q: [] };
    METHODS.forEach((method) => {
      stub[method] = (...args) => stub._q.push([method, args]);
    });
    window.Orka = stub;
  }
  return window.Orka;
};

class Orka {
  // appId: the project id (Settings > Installation)
  // options.autoload: false does not inject the script, call load() when you want the chat (default true)
  // options.locale: forces the language of the widget ("en", "fr"...), the one of the browser otherwise
  // options.env: "dev" loads the script from the local widget server (Orka developers only)
  configure(appId, options = {}) {
    if (!hasWindow()) {
      return;
    }
    this.appId = appId;
    this.env = options.env === "dev" ? "dev" : "prod";
    window.ORKA_APP_ID = appId;
    if (typeof options.locale === "string" && options.locale) {
      window.ORKA_LOCALE = options.locale;
    }
    target();
    if (options.autoload ?? true) {
      this.load();
    }
  }

  // Injects app.js once. Once it ran, forwards to window.Orka.load() (the widget is put back after destroy())
  load() {
    if (!hasWindow()) {
      return;
    }
    if (typeof window.Orka?.isReady === "function") {
      window.Orka.load();
      return;
    }
    if (!this.appId || document.querySelector("script[data-orka-sdk]")) {
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URLS[this.env] || SCRIPT_URLS.prod;
    script.async = true;
    script.setAttribute("data-orka-sdk", "");
    document.head.appendChild(script);
  }
}

// Every other method is forwarded, queued when app.js did not run yet
METHODS.filter((method) => method !== "load").forEach((method) => {
  Orka.prototype[method] = function (...args) {
    return target()?.[method](...args);
  };
});

// The getters are not queued: their default is returned until the widget is ready
Object.keys(GETTERS).forEach((getter) => {
  Orka.prototype[getter] = function () {
    const orka = target();
    return typeof orka?.[getter] === "function" ? orka[getter]() : GETTERS[getter];
  };
});

const instance = new Orka();

export default instance;
