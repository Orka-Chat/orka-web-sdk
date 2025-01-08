declare module "orka-web-sdk" {
  interface OrkaOptions {
    env?: "prod" | "dev";
    autoload?: boolean;
  }

  interface OrkaUpdateData {
    [key: string]: any;
  }

  class Orka {
    constructor();
    configure(appId: string, options?: OrkaOptions): void;
    load(): void;
    update(data: OrkaUpdateData): void;
    reset(): void;
    toggle(): void;
    show(): void;
    hide(): void;
    destroy(): void;
  }

  const instance: Orka;

  export default instance;
}
