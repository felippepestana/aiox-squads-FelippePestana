function expectedPortalKey() {
    const k = process.env.WEB_PORTAL_API_KEY?.trim();
    return k || undefined;
}
export function portalAuthEnabled() {
    return Boolean(expectedPortalKey());
}
/**
 * Quando WEB_PORTAL_API_KEY está definida, exige um dos headers:
 * - X-Portal-Key: <valor>
 * - Authorization: Bearer <valor>
 * Rotas públicas: GET /api/health, GET /api/auth/status
 */
export const portalAuthMiddleware = (req, res, next) => {
    const expected = expectedPortalKey();
    if (!expected) {
        next();
        return;
    }
    const path = req.path ?? "";
    if (path === "/api/health" ||
        path.startsWith("/api/health/") ||
        path === "/api/auth/status" ||
        path.startsWith("/api/auth/status/")) {
        next();
        return;
    }
    if (!path.startsWith("/api")) {
        next();
        return;
    }
    const headerKey = req.headers["x-portal-key"];
    const fromHeader = typeof headerKey === "string"
        ? headerKey.trim()
        : Array.isArray(headerKey)
            ? headerKey[0]?.trim() ?? ""
            : "";
    const auth = req.headers.authorization;
    const fromBearer = auth?.startsWith("Bearer ") ? auth.slice(7).trim() : "";
    if (fromHeader === expected || fromBearer === expected) {
        next();
        return;
    }
    res.status(401).json({
        error: "Chave do portal ausente ou inválida",
        code: "PORTAL_AUTH_REQUIRED",
    });
};
