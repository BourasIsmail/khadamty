# ── Étape 1 : Build Next.js ──
FROM node:18-alpine AS build
WORKDIR /app

# Installer les dépendances nécessaires pour Next.js
RUN apk add --no-cache libc6-compat

# Recevoir l'URL de l'API comme argument
ARG NEXT_PUBLIC_API_URL=http://localhost:8080/api
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# ── Étape 2 : Lancer le frontend ──
FROM node:18-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV production

COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public

EXPOSE 3000

CMD ["node", "server.js"]
