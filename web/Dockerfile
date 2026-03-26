# Contexto de build: raiz do repositório (onde estão squads/ e web/)
# docker compose --profile web build

FROM node:22-alpine AS build
WORKDIR /app/web
COPY web/package.json web/package-lock.json ./
RUN npm ci
COPY web/ ./
RUN npm run build

FROM node:22-alpine AS production
RUN apk add --no-cache wget
WORKDIR /app/web
ENV NODE_ENV=production
COPY web/package.json web/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build /app/web/dist ./dist
COPY squads /app/squads
ENV SQUADS_ROOT=/app/squads
ENV PORT=8787
EXPOSE 8787
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8787/api/health || exit 1
CMD ["node", "dist/server/index.js"]
