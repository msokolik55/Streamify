# Build
FROM node:20-alpine3.16 as build_stage
WORKDIR /app

COPY package.json .
RUN npm install

COPY . .
RUN npm run build

# Production
FROM node:20-alpine3.16 as production_stage
WORKDIR /app

COPY --from=build_stage /app/dist /app/dist
EXPOSE 8080

COPY package.json .
COPY vite.config.mjs .

RUN npm install typescript

EXPOSE 8080
CMD ["npm", "run", "preview"]
