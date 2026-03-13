FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM node:20-alpine AS backend-builder
WORKDIR /app/chatbot
COPY chatbot/package*.json ./
RUN npm ci
COPY chatbot/ .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=backend-builder /app/chatbot/dist ./chatbot/dist
COPY --from=backend-builder /app/chatbot/node_modules ./chatbot/node_modules
COPY --from=backend-builder /app/chatbot/package.json ./chatbot/
COPY --from=frontend-builder /app/frontend/dist ./chatbot/dist/public
COPY squads/ ./squads/
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000
CMD ["node", "chatbot/dist/server.js"]
