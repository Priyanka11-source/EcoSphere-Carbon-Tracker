# Use lightweight Node.js base image
FROM node:18-alpine

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install production dependencies only to keep the image small
RUN npm ci --omit=dev

# Copy the pre-built assets (frontend and backend bundle)
COPY dist ./dist

# Expose default port
EXPOSE 3000

# Set Node environment to production
ENV NODE_ENV=production

# Start the Node Express backend
CMD ["node", "dist/server.cjs"]
