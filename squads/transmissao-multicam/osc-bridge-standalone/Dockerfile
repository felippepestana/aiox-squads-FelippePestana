# syntax=docker/dockerfile:1.6
#
# Standalone OSC bridge — multi-stage build.
#
# Build context: squads/transmissao-multicam/ (one level up from this file)
#   docker build -f osc-bridge-standalone/Dockerfile -t osc-bridge:latest .
#
# This lets us bake the squad's data/*.yaml mappings into the image without
# leaking the rest of the repo into the build context. Same convention as
# the project's chatbot/web Dockerfiles.

# ─── Build stage ──────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install deps with a clean lockfile (npm ci) — produces deterministic builds.
COPY osc-bridge-standalone/package.json osc-bridge-standalone/package-lock.json ./
RUN npm ci --no-audit --no-fund

# Compile TypeScript to dist/.
COPY osc-bridge-standalone/tsconfig.json ./
COPY osc-bridge-standalone/src ./src
RUN npm run build

# Strip dev deps so the runtime stage only carries production node_modules.
RUN npm prune --omit=dev

# ─── Runtime stage ────────────────────────────────────────────
FROM node:22-alpine AS runtime

# Run as non-root for defense-in-depth. node:22-alpine ships a `node` user
# (uid 1000) precisely for this.
WORKDIR /app
USER node

ENV NODE_ENV=production

# Copy only what runtime needs: built JS + production node_modules + the
# YAML mappings the bridge reads at startup.
#
# IMPORTANT: package.json must be in the runtime CWD too. The project uses
# ES modules (`"type": "module"`), and Node looks at the nearest package.json
# to decide how to parse `.js` files. Without it `node dist/index.js` throws
# `SyntaxError: Cannot use import statement outside a module`.
COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --chown=node:node data ./data

# Default paths so the operator doesn't have to set them. They can be
# overridden via env at `docker run`/compose.
ENV OSC_MAPPING_PATH=/app/data/osc-mapping.yaml
ENV MIC_MAPPING_PATH=/app/data/mic-mapping.yaml
ENV OSC_PORT=9300

# OSC uses UDP. Document the port for tooling — actual binding happens via
# host-network in docker-compose (UDP can't traverse Docker's user-space NAT
# without quirks).
EXPOSE 9300/udp
EXPOSE 9301/udp

# No HEALTHCHECK: the bridge holds open a UDP socket + obs-websocket client;
# the cheapest healthcheck would be a `ss -lu | grep 9300`, which requires
# iproute2 in the image. Operator monitors via the OBS connection log.

CMD ["node", "dist/index.js"]
