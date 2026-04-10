# Build context: repository root
# docker compose --profile property-web build

FROM node:22-alpine AS build
WORKDIR /app/property-data-web
COPY property-data-web/package.json property-data-web/package-lock.json* ./
RUN npm ci
COPY property-data-web/ ./
COPY squads /app/squads
RUN npx prisma generate
RUN npm run build

FROM node:22-alpine AS production
RUN apk add --no-cache wget
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/property-data-web/.next/standalone ./
COPY --from=build /app/property-data-web/.next/static ./.next/static
COPY --from=build /app/property-data-web/public ./public
COPY squads /app/squads
ENV SQUADS_ROOT=/app/squads
ENV PORT=3000
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1
CMD ["node", "server.js"]
