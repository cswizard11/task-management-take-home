# Stage 1: Build the Angular application
FROM node:24 AS builder

WORKDIR /app

# Copy workspace files
COPY package*.json ./
COPY nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy the rest of the monorepo source
COPY . .

# Build the dashboard project
RUN npx nx build dashboard

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the built static files from the builder stage
# The output is directly in /app/dist/apps/dashboard, not a 'browser' subfolder
COPY --from=builder /app/dist/apps/dashboard /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY apps/dashboard/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80
