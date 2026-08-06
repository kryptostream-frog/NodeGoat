ARG BASE_IMAGE=node:18-slim
FROM ${BASE_IMAGE} AS builder
WORKDIR /app
# Install deps from the committed lockfile via the Artifactory-configured .npmrc
# (.npmrc is written by `jf npmc --repo-resolve` in CI and copied in below)
COPY package.json package-lock.json* .npmrc* ./
RUN npm ci --loglevel verbose
COPY . .
RUN npm run build
RUN npm prune --omit=dev

FROM ${BASE_IMAGE}
ENV NODE_ENV=production
WORKDIR /home/node/app
COPY --from=builder --chown=node:node /app ./
USER node
EXPOSE 4000
CMD ["node", "server.js"]