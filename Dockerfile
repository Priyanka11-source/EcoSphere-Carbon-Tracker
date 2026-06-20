# Use official Node.js Alpine base image for a lightweight container
FROM node:18-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies (production and dev for building)
RUN npm ci

# Copy application files
COPY . .

# Build client-side assets and backend bundles
RUN npm run build

# Expose default port
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Start the Node Express backend
CMD ["npm", "start"]
