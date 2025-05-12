FROM node:14-alpine

WORKDIR /app

# Install dependencies needed for node-gyp and other build tools
RUN apk add --no-cache python3 make g++ git

# Install serve globally
RUN yarn global add serve

# Copy package.json and yarn.lock first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies with more verbose output
RUN yarn install --network-timeout 1000000

# Copy the rest of the application
COPY . .

# Create a .env file with required environment variables
RUN echo "MEDUSA_BACKEND_URL=https://api.example.com" > .env

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 7000

# Command to run the app that will use the env vars from Railway at runtime
CMD ["sh", "-c", "serve -s dist -l ${PORT:-7000}"] 