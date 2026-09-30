# --- Etapa 1: compilar la landing con Vite ---
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
# Mismo origen que la página: el chat vive en /api/chat del mismo servidor.
ARG VITE_CHAT_API_URL=/api/chat
ENV VITE_CHAT_API_URL=$VITE_CHAT_API_URL
RUN npm run build

# --- Etapa 2: runtime mínimo (Express sirve dist/ y /api/chat) ---
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server ./server
COPY --from=build /app/dist ./dist

USER node
EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8787/healthz || exit 1

CMD ["node", "server/index.js"]
