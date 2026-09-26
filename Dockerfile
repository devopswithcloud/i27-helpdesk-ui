# =========================
# Stage 1 : Builder Stage
# AS builder gives this stage the name builder
FROM node:18-alpine AS builder

WORKDIR /app

# Copy only the manifests first so this layer is cached until dependencies change
COPY package.json package-lock.json ./

# npm ci installs the exact versions from package-lock.json
RUN npm ci

COPY . .

# Base url needs to be passed as build argument
ARG NEXT_PUBLIC_API_BASE_URL

# Convert the build arg into an env variable (baked into the JS bundle by next build)
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

# Create an optimised next.js production build
# next.config.js has output: 'standalone' -> produces .next/standalone
RUN npm run build


# docker build -t imagename --build-arg NEXT_PUBLIC_API_BASE_URL=https://gw-dev.i27academy.com .
# =========================
# Stage 2 : Runtime stage
# Only the standalone server + static assets are copied, no full node_modules / source
FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

# server.js + the minimal node_modules it needs
COPY --from=builder --chown=node:node /app/.next/standalone ./
# client-side JS/CSS chunks (standalone does not include these)
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
# If a public/ folder is added later, also copy it:
# COPY --from=builder --chown=node:node /app/public ./public

# Run as the non-root "node" user that ships with the image
USER node

EXPOSE 3000
CMD ["node", "server.js"]
