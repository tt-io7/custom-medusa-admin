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

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 7000

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "7000"] 