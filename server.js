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

// Log all directories in the current folder to help with debugging
const listDirectories = () => {
  console.log("Current directory:", __dirname);
  try {
    const files = fs.readdirSync(__dirname);
    console.log("Files in current directory:", files);
    
    // Check if dist exists
    if (fs.existsSync(path.join(__dirname, "dist"))) {
      console.log("dist directory exists");
      const distFiles = fs.readdirSync(path.join(__dirname, "dist"));
      console.log("Files in dist directory:", distFiles);
    }
    
    // Check if .medusa exists
    if (fs.existsSync(path.join(__dirname, ".medusa"))) {
      console.log(".medusa directory exists");
      const medusaFiles = fs.readdirSync(path.join(__dirname, ".medusa"));
      console.log("Files in .medusa directory:", medusaFiles);
    }
    
    // Check if public exists
    if (fs.existsSync(path.join(__dirname, "public"))) {
      console.log("public directory exists");
      const publicFiles = fs.readdirSync(path.join(__dirname, "public"));
      console.log("Files in public directory:", publicFiles);
    }
  } catch (error) {
    console.error("Error listing directories:", error);
  }
};

// List directories at startup
listDirectories();

// Try to find a file in multiple possible locations
const findFile = (urlPath) => {
  // Possible locations to check for files
  const possiblePaths = [
    path.join(__dirname, "dist", urlPath),
    path.join(__dirname, "public", urlPath),
    path.join(__dirname, ".medusa/admin", urlPath),
    path.join(__dirname, ".medusa/server/public/admin", urlPath),
    path.join(__dirname, "build", urlPath),
    path.join(__dirname, urlPath)
  ];
  
  // Try each possible path
  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      console.log(`Found file at: ${filePath}`);
      return filePath;
    }
  }
  
  // If the URL is a path without extension, look for index.html
  if (!path.extname(urlPath)) {
    for (const basePath of [
      path.join(__dirname, "dist"),
      path.join(__dirname, "public"),
      path.join(__dirname, ".medusa/admin"),
      path.join(__dirname, ".medusa/server/public/admin"),
      path.join(__dirname, "build"),
      __dirname
    ]) {
      const indexPath = path.join(basePath, urlPath, "index.html");
      if (fs.existsSync(indexPath)) {
        console.log(`Found index.html at: ${indexPath}`);
        return indexPath;
      }
    }
  }
  
  // Default fallback - index.html in various locations
  for (const basePath of [
    path.join(__dirname, "dist"),
    path.join(__dirname, "public"),
    path.join(__dirname, ".medusa/admin"),
    path.join(__dirname, ".medusa/server/public/admin"),
    path.join(__dirname, "build"),
    __dirname
  ]) {
    const indexPath = path.join(basePath, "index.html");
    if (fs.existsSync(indexPath)) {
      console.log(`Fallback to index.html at: ${indexPath}`);
      return indexPath;
    }
  }
  
  // Create a simple HTML if nothing is found
  return null;
};

const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.url}`);
  
  // Health check endpoint
  if (req.url === "/health" || req.url === "/") {
    res.writeHead(200);
    res.end("OK");
    return;
  }

  // Clean the URL path
  const urlPath = req.url.split("?")[0]; // Remove query parameters
  
  // Try to find the file
  const filePath = findFile(urlPath.slice(1)); // Remove leading slash
  
  if (!filePath) {
    // If no files were found anywhere, return a simple HTML
    console.log("No files found, returning simple HTML");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medusa Admin</title>
      </head>
      <body>
        <h1>Medusa Admin</h1>
        <p>The server is running, but no files were found to serve.</p>
      </body>
      </html>
    `);
    return;
  }
  
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || "application/octet-stream";
  
  // Read and serve the file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      console.error(`Error reading file: ${filePath}`, err);
      res.writeHead(500);
      res.end(`Error: ${err.code}`);
    } else {
      console.log(`Successfully serving: ${filePath}`);
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 