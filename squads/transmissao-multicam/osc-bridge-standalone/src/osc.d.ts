// Minimal typings for the `osc` npm package (no @types published).
// Mirrors operator-panel/src/server/osc.d.ts — keep in sync.

declare module "osc" {
  export interface UDPPortOptions {
    localAddress?: string;
    localPort?: number;
    remoteAddress?: string;
    remotePort?: number;
    metadata?: boolean;
  }

  export interface OscArg {
    type: "i" | "f" | "s" | "b" | string;
    value: number | string | boolean | Buffer;
  }

  export interface OscMessage {
    address: string;
    args: OscArg[];
  }

  export class UDPPort {
    constructor(opts: UDPPortOptions);
    open(): void;
    close(): void;
    send(msg: OscMessage): void;
    on(event: "ready", cb: () => void): this;
    on(event: "error", cb: (err: Error) => void): this;
    on(event: "message", cb: (msg: OscMessage) => void): this;
    on(event: string, cb: (...args: unknown[]) => void): this;
  }
}
