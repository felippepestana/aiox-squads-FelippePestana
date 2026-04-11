// Demo mode helpers for API routes

export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "true";
}

export const DEMO_USER = {
  id: "demo-user-001",
  email: "demo@propertydata.app",
  name: "Usuario Demo",
};
