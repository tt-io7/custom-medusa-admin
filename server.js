const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = process.env.PORT || 80;

const MIME_TYPES = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  // Health check endpoint
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200);
    res.end("OK");
    return;
  }
  
  let filePath = path.join(__dirname, "dist", req.url);
  
  // Default to index.html if the path is a directory
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }
  
  // Handle paths that don't include file extensions
  if (!path.extname(filePath)) {
    filePath = path.join(__dirname, "dist", "index.html");
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || "application/octet-stream";
  
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        // File not found - serve index.html
        fs.readFile(path.join(__dirname, "dist", "index.html"), (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end(`Error: ${err.code}`);
          } else {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(content, "utf-8");
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Error: ${err.code}`);
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 