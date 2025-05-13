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

# Create .env file with default values (will be overridden by Railway env vars)
RUN echo "MEDUSA_BACKEND_URL=${MEDUSA_BACKEND_URL:-https://your-backend-url.com}" > .env

# Build the app
RUN yarn build

# Create a simple server.js file
RUN echo 'const http = require("http"); \n\
const fs = require("fs"); \n\
const path = require("path"); \n\
const PORT = process.env.PORT || 80; \n\
\n\
const MIME_TYPES = { \n\
  ".html": "text/html", \n\
  ".js": "text/javascript", \n\
  ".css": "text/css", \n\
  ".json": "application/json", \n\
  ".png": "image/png", \n\
  ".jpg": "image/jpg", \n\
  ".gif": "image/gif", \n\
  ".svg": "image/svg+xml", \n\
  ".ico": "image/x-icon" \n\
}; \n\
\n\
const server = http.createServer((req, res) => { \n\
  console.log(`Request received: ${req.url}`); \n\
  \n\
  // Health check endpoint \n\
  if (req.url === "/health" || req.url === "/") { \n\
    res.writeHead(200); \n\
    res.end("OK"); \n\
    return; \n\
  } \n\
  \n\
  let filePath = path.join(__dirname, "dist", req.url); \n\
  \n\
  // Default to index.html if the path is a directory \n\
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) { \n\
    filePath = path.join(filePath, "index.html"); \n\
  } \n\
  \n\
  // Handle paths that don't include file extensions \n\
  if (!path.extname(filePath)) { \n\
    filePath = path.join(__dirname, "dist", "index.html"); \n\
  } \n\
  \n\
  const extname = path.extname(filePath); \n\
  const contentType = MIME_TYPES[extname] || "application/octet-stream"; \n\
  \n\
  fs.readFile(filePath, (err, content) => { \n\
    if (err) { \n\
      if (err.code === "ENOENT") { \n\
        // File not found - serve index.html \n\
        fs.readFile(path.join(__dirname, "dist", "index.html"), (err, content) => { \n\
          if (err) { \n\
            res.writeHead(500); \n\
            res.end(`Error: ${err.code}`); \n\
          } else { \n\
            res.writeHead(200, { "Content-Type": "text/html" }); \n\
            res.end(content, "utf-8"); \n\
          } \n\
        }); \n\
      } else { \n\
        // Server error \n\
        res.writeHead(500); \n\
        res.end(`Error: ${err.code}`); \n\
      } \n\
    } else { \n\
      // Success \n\
      res.writeHead(200, { "Content-Type": contentType }); \n\
      res.end(content, "utf-8"); \n\
    } \n\
  }); \n\
}); \n\
\n\
server.listen(PORT, () => { \n\
  console.log(`Server running on port ${PORT}`); \n\
});' > server.js

# Expose the port the app runs on
EXPOSE 80

# Start the server
CMD ["node", "server.js"] 