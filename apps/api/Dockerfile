# Stage 1: Build the application
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

# Build the API project
RUN npx nx build api

# Set the database path for the seed script and run it
ENV DATABASE_PATH=./database.sqlite
RUN npm run seed

# Stage 2: Create the production image
FROM node:24-slim

WORKDIR /app

# Copy dependencies from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copy the built application from the builder stage
COPY --from=builder /app/apps/api/dist ./dist/apps/api

# Copy the pre-seeded database from the builder stage
COPY --from=builder /app/database.sqlite /data/database.sqlite



# Expose the port
EXPOSE 3000

# Start the server
CMD ["node", "dist/apps/api/main.js"]
