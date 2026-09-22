# Orka Web SDK

The chat widget of [Orka](https://orka.chat) in React, Vue, Angular, Svelte and any bundled app. No dependency.

The package injects the same script as the HTML snippet and exposes its methods. Do not use both.

```bash
npm install orka-web-sdk
```

```javascript
import Orka from "orka-web-sdk";

Orka.configure("YOUR_PROJECT_ID");

// Who is on the page, and what your team should know
Orka.update({ name: "Ada Lovelace", email: "ada@example.com", plan: "pro" });

// Your own launcher
Orka.hideWidget();
document.querySelector("#help").onclick = () => Orka.show();

// Events
Orka.on("unread:change", (count) => setBadge(count));
Orka.on("ready", ({ conversation_id }) => save(conversation_id));

// On logout
Orka.reset();
```

Every method can be called right after `configure()`: the calls made before the script is loaded are queued and run in order once it is. `Orka` is a singleton, import it from any file.

With server-side rendering (Next.js, Nuxt, Remix), call `configure()` in an effect or a client-only component: the widget needs the browser.

## Documentation

Methods, events, identity verification, session continuity: the [Orka developer hub](https://docs.orka.chat/public-api/docs).

## License

MIT, see [LICENSE](./LICENSE).

- **Maintainer**: [@marcdelalonde](https://github.com/marcdelalonde)
