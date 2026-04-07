import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SessionManager } from "./sessionManager.js";

// Minimal mock ChatSession for testing
function mockChat(): any {
  return {
    getAgent: () => ({ id: "test", name: "Test", squad: "test" }),
    switchAgent: vi.fn(),
    resetHistory: vi.fn(),
    send: vi.fn(),
    historyLength: () => 0,
  };
}

describe("SessionManager", () => {
  let manager: SessionManager;

  beforeEach(() => {
    manager = new SessionManager(5000); // 5 second TTL for tests
  });

  afterEach(() => {
    manager.stop();
  });

  it("stores and retrieves sessions", () => {
    const chat = mockChat();
    manager.set("session-1", chat);

    const state = manager.get("session-1");
    expect(state).toBeDefined();
    expect(state!.chat).toBe(chat);
  });

  it("returns undefined for non-existent session", () => {
    expect(manager.get("non-existent")).toBeUndefined();
  });

  it("has() returns true for existing sessions", () => {
    manager.set("session-1", mockChat());
    expect(manager.has("session-1")).toBe(true);
    expect(manager.has("non-existent")).toBe(false);
  });

  it("deletes sessions", () => {
    manager.set("session-1", mockChat());
    expect(manager.delete("session-1")).toBe(true);
    expect(manager.has("session-1")).toBe(false);
  });

  it("tracks session count", () => {
    expect(manager.size()).toBe(0);
    manager.set("session-1", mockChat());
    expect(manager.size()).toBe(1);
    manager.set("session-2", mockChat());
    expect(manager.size()).toBe(2);
    manager.delete("session-1");
    expect(manager.size()).toBe(1);
  });

  it("updates lastActivity on get()", async () => {
    manager.set("session-1", mockChat());
    const state1 = manager.get("session-1")!;
    const firstActivity = state1.lastActivity;

    // Wait a small amount of real time
    await new Promise((r) => setTimeout(r, 10));

    const state2 = manager.get("session-1")!;
    expect(state2.lastActivity).toBeGreaterThanOrEqual(firstActivity);
  });

  it("expires sessions after TTL", () => {
    vi.useFakeTimers();
    const shortTtlManager = new SessionManager(1000); // 1 second TTL

    shortTtlManager.set("session-1", mockChat());
    expect(shortTtlManager.has("session-1")).toBe(true);

    // Advance past TTL
    vi.advanceTimersByTime(1500);

    expect(shortTtlManager.get("session-1")).toBeUndefined();
    shortTtlManager.stop();
    vi.useRealTimers();
  });

  it("records createdAt timestamp", () => {
    manager.set("session-1", mockChat());
    const state = manager.get("session-1")!;
    expect(state.createdAt).toBeGreaterThan(0);
    expect(state.createdAt).toBeLessThanOrEqual(Date.now());
  });
});
