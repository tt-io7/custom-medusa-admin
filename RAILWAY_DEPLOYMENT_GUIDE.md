# Deploying Medusa Admin to Railway

This guide will walk you through deploying your Medusa Admin dashboard to Railway.

## Prerequisites

1. A Railway account
2. Your Medusa backend server already deployed and running
3. Git repository for your Medusa admin (this repository)

## Step 1: Fix the build error

The error you're encountering is because of a missing export in the medusa-react package. You need to update the file that's causing the error.

Edit `src/domain/inventory/locations/new/index.tsx` and change:

```javascript
import {
  useAdminAddLocationToSalesChannel,
  useAdminCreateStockLocation,
} from "medusa-react"
```

to:

```javascript
import {
  useAdminAddLocationToSalesChannel,
  useAdminCreateLocation,
} from "medusa-react"
```

And change:

```javascript
const { mutateAsync: createStockLocation } = useAdminCreateStockLocation()
```

to:

```javascript
const { mutateAsync: createStockLocation } = useAdminCreateLocation()
```

## Step 2: Update package.json to add "serve"

Add the "serve" package to your dependencies:

```json
"dependencies": {
  // ...existing dependencies
  "serve": "^14.2.1"
}
```

## Step 3: Create Railway Configuration

Create a `railway.json` file in your project root with the following content:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "yarn build"
  },
  "deploy": {
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 3,
    "startCommand": "npx serve -s dist -l $PORT",
    "healthcheckPath": "/",
    "healthcheckTimeout": 300,
    "healthcheckProtocol": "HTTP"
  }
}
```

## Step 4: Configure Environment Variables in Railway

These are the environment variables you'll need to configure in Railway:

```
# Required
MEDUSA_BACKEND_URL=https://your-medusa-server.railway.app

# If your backend uses JWT authentication
JWT_SECRET=same-secret-as-your-backend
COOKIE_SECRET=same-secret-as-your-backend
```

Replace `https://your-medusa-server.railway.app` with your actual Medusa backend URL.

## Step 5: Deploy to Railway

1. Push your changes to your Git repository
2. In Railway, create a new project
3. Choose "Deploy from GitHub repo"
4. Select your repository
5. Add the environment variables from Step 4
6. Deploy!

## Step 6: Configure CORS on your Medusa Backend

You need to update your Medusa backend's environment variables to allow requests from your new admin URL:

```
ADMIN_CORS=https://your-admin-frontend.railway.app
```

Replace `https://your-admin-frontend.railway.app` with your actual admin URL from Railway.

## Troubleshooting

If you encounter build errors related to Node.js native modules:
- Try using a different Node.js version in Railway (14.x or 16.x might be more compatible)
- You can specify the Node.js version in package.json by adding: `"engines": { "node": "16.x" }` 