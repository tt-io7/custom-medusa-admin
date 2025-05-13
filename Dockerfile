FROM node:16-alpine

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++ git

# Copy package.json and yarn.lock
COPY package.json yarn.lock* ./

# Install dependencies
RUN yarn install --network-timeout 600000

# Copy the rest of the app
COPY . .

# Set backend URL environment variable
ENV MEDUSA_BACKEND_URL=https://your-backend-url.com
# Can be overridden at runtime

# Build the app
RUN yarn build

# Expose the port the app runs on
EXPOSE 80

# Command to run the app
CMD ["yarn", "serve", "--port", "80", "--host", "0.0.0.0"] 