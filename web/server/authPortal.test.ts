import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// We test the logic by importing the module after setting env vars
describe("authPortal", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("portalAuthEnabled returns false when no key set", async () => {
    delete process.env.WEB_PORTAL_API_KEY;
    const { portalAuthEnabled } = await import("./authPortal.js");
    expect(portalAuthEnabled()).toBe(false);
  });

  it("portalAuthEnabled returns true when key is set", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthEnabled } = await import("./authPortal.js");
    expect(portalAuthEnabled()).toBe(true);
  });

  it("middleware allows /api/health without key", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = { path: "/api/health", headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("middleware allows /api/auth/status without key", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = { path: "/api/auth/status", headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("middleware allows non-API paths without key", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = { path: "/index.html", headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("middleware rejects API calls without key when auth is enabled", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = { path: "/api/squads", headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ code: "PORTAL_AUTH_REQUIRED" })
    );
  });

  it("middleware accepts X-Portal-Key header", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = {
      path: "/api/squads",
      headers: { "x-portal-key": "test-key-123" },
    } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("middleware accepts Bearer token", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = {
      path: "/api/squads",
      headers: { authorization: "Bearer test-key-123" },
    } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("middleware rejects wrong key", async () => {
    process.env.WEB_PORTAL_API_KEY = "test-key-123";
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = {
      path: "/api/squads",
      headers: { "x-portal-key": "wrong-key" },
    } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("middleware passes through when no key is configured", async () => {
    delete process.env.WEB_PORTAL_API_KEY;
    const { portalAuthMiddleware } = await import("./authPortal.js");

    const req = { path: "/api/squads", headers: {} } as any;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
    const next = vi.fn();

    portalAuthMiddleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
