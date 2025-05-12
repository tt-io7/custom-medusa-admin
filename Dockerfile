FROM node:16-alpine

WORKDIR /app

# Install serve globally
RUN yarn global add serve

# Copy package.json and yarn.lock first for better layer caching
COPY package.json yarn.lock ./

# Install dependencies 
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Expose the port the app runs on
EXPOSE 7000

# Command to run the app
CMD ["serve", "-s", "dist", "-l", "7000"] 