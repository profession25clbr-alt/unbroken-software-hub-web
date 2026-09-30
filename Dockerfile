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

# --- Etapa 2: solo las dependencias de producción del servidor ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# --- Etapa 3: runtime mínimo ---
# Alpine pelado + el binario de node. La imagen oficial node:alpine trae además npm,
# yarn y corepack (~30 MB) que el servidor nunca usa; borrarlos con rm en una capa
# nueva no achica la imagen, por eso se parte de alpine y se copia solo `node`.
FROM alpine:3.24
RUN apk add --no-cache libstdc++ \
 && addgroup -g 1000 node \
 && adduser -u 1000 -G node -s /bin/sh -D node

COPY --from=deps /usr/local/bin/node /usr/local/bin/node

WORKDIR /app
ENV NODE_ENV=production

# package.json se necesita en runtime ("type": "module" para los imports ESM).
COPY package.json ./
COPY --from=deps /app/node_modules ./node_modules
COPY server ./server
COPY --from=build /app/dist ./dist

USER node
EXPOSE 8787

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8787/healthz || exit 1

CMD ["node", "server/index.js"]
