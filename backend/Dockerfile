# Build
FROM node:20-alpine3.16 as build_stage
WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .

RUN npm run build

# Production
FROM node:20-alpine3.16 as production_stage
WORKDIR /app

COPY package*.json .
RUN npm install --omit=dev

COPY --from=build_stage /app/dist dist
COPY --from=build_stage /app/prisma prisma
COPY --from=build_stage /app/.env .

EXPOSE 4000
CMD ["npm", "start"]
