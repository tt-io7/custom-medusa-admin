# Deploying Custom Medusa Admin to Railway

This guide explains how to deploy this custom Medusa admin panel to Railway.

## Prerequisites

- A GitHub account with this repository
- A Railway account connected to your GitHub
- A Medusa backend already deployed (can also be on Railway)

## Steps for Deployment

### 1. Configure Environment Variables in Railway

Create a new project in Railway and add the following environment variables:

```
MEDUSA_BACKEND_URL=https://your-backend-url.railway.app
JWT_SECRET=your-jwt-secret
COOKIE_SECRET=your-cookie-secret
ADMIN_CORS=https://your-admin-panel-url.railway.app
```

Make sure your backend has the corresponding CORS configuration:
```
ADMIN_CORS=https://your-admin-panel-url.railway.app
```

### 2. Deploy from GitHub

1. Select "Deploy from GitHub repository"
2. Choose this repository
3. Railway will automatically detect the Dockerfile and use it for deployment

### 3. Verify Deployment

1. Once deployed, Railway will provide a URL for your admin panel
2. Access the URL and verify you can log in with your Medusa credentials

## Troubleshooting

### Build Failures

If you encounter build failures related to missing hooks in medusa-react:

1. We've replaced these hooks with direct API calls using medusaRequest
2. If you find any remaining references to problematic hooks, replace them using the same pattern

### Connection Issues

If you can't connect to your Medusa backend:

1. Verify the MEDUSA_BACKEND_URL is correct
2. Ensure CORS is properly configured on both the admin and backend
3. Check that your backend is running properly

## Maintenance

When updating your admin panel:

1. Push changes to GitHub
2. Railway will automatically rebuild and deploy your changes 