
# Build the React/Vite application
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Serve the site and its Telegram endpoint
FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package.json ./package.json
COPY server ./server
ENV PORT=80
EXPOSE 80
CMD ["node", "server/index.js"]

