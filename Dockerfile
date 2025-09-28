# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy app files
COPY . .

# Build the Next.js app
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV NEXTAUTH_URL=https://agentic-ai-project-production.up.railway.app
ENV NEXTAUTH_SECRET=railway-production-secret-key-2025

# Start the application
CMD ["npm", "start"]