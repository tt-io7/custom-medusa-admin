# Railway Environment Variables for Medusa Admin

When deploying your Medusa Admin to Railway, you need to configure the following environment variables in your Railway project:

## Required Environment Variables

- `MEDUSA_BACKEND_URL`: The URL of your deployed Medusa server (e.g., https://your-medusa-server.railway.app)

## Optional Environment Variables

- `ADMIN_PATH`: If your Medusa server uses a different admin endpoint than `/admin`
- `ANALYTICS_REPORTING`: Set to `true` to enable analytics
- `ANALYTICS_ENDPOINT`: For custom analytics endpoint
- `JWT_SECRET`: Must match the JWT_SECRET used on your Medusa server
- `COOKIE_SECRET`: Must match the COOKIE_SECRET used on your Medusa server

## How to Set Environment Variables in Railway

1. Go to your Railway project
2. Click on the "Variables" tab
3. Add each variable with its corresponding value
4. Click "Add" after entering each variable
5. Railway will automatically redeploy your application after adding variables

## Important Notes

- Make sure your Medusa server is up and running before deploying the admin
- The JWT_SECRET and COOKIE_SECRET must match between your server and admin
- The admin requires your Medusa server to have CORS properly configured 