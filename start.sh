#!/bin/sh

# Print environment information for debugging
echo "NODE_ENV: $NODE_ENV"
echo "PORT: $PORT"
echo "PWD: $PWD"

# List files in current directory
echo "Files in current directory:"
ls -la

# List directories to help debugging
if [ -d "dist" ]; then
  echo "dist directory exists"
  ls -la dist
fi

if [ -d "public" ]; then
  echo "public directory exists"
  ls -la public
fi

if [ -d ".medusa" ]; then
  echo ".medusa directory exists"
  ls -la .medusa
fi

# Start the server
node server.js 