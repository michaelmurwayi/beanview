# Dockerfile
# Stage 1 — build
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps (use cached layer)
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
# If you have environment-specific base: set VITE_* env vars at build time or use env replacement
RUN npm run build

# Stage 2 — serve with nginx
FROM nginx:1.25-alpine
# Remove default site
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose default port
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
