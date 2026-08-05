# Build stage: install all deps and compile Next.js
ARG BASE_IMAGE=node:18-slim
FROM ${BASE_IMAGE} AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime stage
FROM ${BASE_IMAGE}
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY --from=builder --chown=node:node /app ./
USER node
EXPOSE 4000
