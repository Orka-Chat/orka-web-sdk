export interface OrkaOptions {
  /** `false` does not inject the script: call `Orka.load()` when you want the chat. Default `true` */
  autoload?: boolean;
  /** Forces the language of the widget ("en", "fr"...). The one of the browser otherwise */
  locale?: string;
  /** "dev" loads the script from the local widget server (Orka developers only) */
  env?: "prod" | "dev";
}

/** `name`, `email`, `thumbnail` and `signature` are reserved, every other key is a custom attribute */
export interface OrkaIdentity {
  name?: string;
  email?: string;
  thumbnail?: string;
  /** HMAC-SHA256 of the email computed by your server (identity verification) */
  signature?: string;
  [attribute: string]: string | number | boolean | null | undefined;
}

export interface OrkaSession {
  visitor_id: string | null;
  conversation_id: string | null;
}

export interface OrkaMessage {
  id: string;
  content: string;
  /** ISO 8601 */
  created_at: string;
}

export interface OrkaReceivedMessage extends OrkaMessage {
  author: { type: "agent" | "ai" | "bot"; name: string | null };
}

export interface OrkaEvents {
  /** The widget is displayed and the session exists. Fires once, a listener added later is called right away */
  ready: (session: OrkaSession) => void;
  /** The conversation changed after `ready`: `reset()`, or session continuity restored the one of the person */
  "session:change": (session: OrkaSession) => void;
  open: () => void;
  close: () => void;
  "unread:change": (count: number) => void;
  "message:sent": (message: OrkaMessage) => void;
  "message:received": (message: OrkaReceivedMessage) => void;
  /** The visitor typed their email in the chat */
  "visitor:email": (email: string) => void;
  "availability:change": (isOnline: boolean) => void;
}

export type OrkaEventName = keyof OrkaEvents;

/** Flat data: string, number or boolean values, up to 20 keys */
export type OrkaTrackData = Record<string, string | number | boolean>;

export interface Orka {
  /** Sets the project and injects the script (unless `autoload: false`). Call it once, in the browser */
  configure(appId: string, options?: OrkaOptions): void;
  /** Injects the script when `autoload` was `false`, or puts the widget back after `destroy()` */
  load(): void;
  /** Sets the visitor identity and custom attributes. Safe at any time, kept until the widget is ready */
  update(data: OrkaIdentity): void;
  /** Forgets the visitor and starts a new session. Call it on logout */
  reset(): void;
  /** Opens the chat, optionally pre-fills the input */
  show(message?: string): void;
  /** Closes the chat, the bubble stays */
  hide(): void;
  toggle(): void;
  /** Shows the bubble again after `hideWidget()` */
  showWidget(): void;
  /** Hides everything, bubble included. The session stays alive */
  hideWidget(): void;
  /** Removes the widget from the page */
  destroy(): void;
  on<E extends OrkaEventName>(event: E, listener: OrkaEvents[E]): void;
  /** Without listener: removes every listener of the event */
  off<E extends OrkaEventName>(event: E, listener?: OrkaEvents[E]): void;
  /** Adds an event to the timeline of the contact. Dropped while the visitor has no email */
  track(name: string, data?: OrkaTrackData): void;
  /** `false` until the `ready` event */
  isReady(): boolean;
  isOpen(): boolean;
  isOnline(): boolean;
  getUnreadCount(): number;
}

declare const instance: Orka;

export default instance;
