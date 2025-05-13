FROM node:18-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --network-timeout 1000000

# Copy the rest of the app
COPY . .

# Make start script executable
RUN chmod +x start.sh

# Create .env file with default values (will be overridden by Railway env vars)
RUN echo "MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL:-https://your-backend-url.com}" > .env

# Build the app
RUN yarn build

# Expose the port the app runs on
EXPOSE 7000

# Start the server using our script
CMD ["./start.sh"] 