# Etapa 1: build
FROM node:20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Copiamos los archivos públicos, necesarios para servir estáticos (uploads incluidos)
COPY public ./public

# Etapa 2: runtime (más ligera)
FROM node:20-slim

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm install --omit=dev

EXPOSE 3000

CMD ["node", "dist/server.js"]
