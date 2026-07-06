# Stage 1 build the React frontend into static assets
FROM node:26-alpine AS frontend-build
WORKDIR /frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2 install backend production dependencies only
FROM node:26-alpine AS backend-deps
WORKDIR /backend

COPY backend/package*.json ./
RUN npm ci --omit=dev


# Stage 3 final minimal runtime image
FROM node:26-alpine AS runtime

# Install curl only for the HEALTHCHECK, then drop package cache
RUN apk add --no-cache curl

ENV NODE_ENV=production \
    PORT=3000

WORKDIR /app

# Run as a non-root unprivileged user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --chown=appuser:appgroup --from=backend-deps /backend/node_modules ./node_modules
COPY --chown=appuser:appgroup backend/package*.json ./
COPY --chown=appuser:appgroup backend/src ./src
COPY --chown=appuser:appgroup --from=frontend-build /frontend/dist ./public

USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
