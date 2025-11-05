# Environment Variables

This file documents all required and optional environment variables for the Zolar application.

## Required Variables

### Database
```env
DATABASE_URL="file:./dev.db"
```
- SQLite database location for Prisma

### JWT Authentication
```env
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
```
- Secret key for JWT token generation
- **IMPORTANT**: Change this to a random secure string in production

### Pusher (Real-time Notifications)
```env
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-pusher-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-pusher-cluster"
```
- Required for real-time order notifications
- Get credentials from [Pusher Dashboard](https://dashboard.pusher.com/)

### Web Push Notifications (Optional - Advanced)
```env
VAPID_PUBLIC_KEY="your-vapid-public-key"
VAPID_PRIVATE_KEY="your-vapid-private-key"
NEXT_PUBLIC_VAPID_PUBLIC_KEY="your-vapid-public-key"
```
- Optional: For advanced server-side push notifications
- Generate with: `npx web-push generate-vapid-keys`
- Not required for basic browser notifications (Web Notification API works without VAPID)

## Optional Variables

### Google Analytics 4
```env
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```
- Google Analytics 4 Measurement ID
- Enables visitor tracking and analytics
- Get from [Google Analytics](https://analytics.google.com/)

### Hotjar
```env
NEXT_PUBLIC_HOTJAR_ID="1234567"
```
- Hotjar Site ID for heatmaps and session recordings
- Get from [Hotjar Dashboard](https://insights.hotjar.com/)

### Legacy Admin Token
```env
ADMIN_TOKEN="admin-token-123"
```
- Backward compatibility only
- New authentication uses JWT tokens

## Setup Instructions

1. Copy the example values to your `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Update all placeholder values with your actual credentials

3. Restart your development server:
   ```bash
   npm run dev
   ```

## Security Notes

- Never commit `.env` files to version control
- Use strong, random values for secrets in production
- Rotate JWT_SECRET periodically
- Use environment-specific values (dev, staging, prod)
- Enable HTTPS in production for secure cookie transmission

## Default Admin Account

After running the seed script, you can log in with:

- **Email**: `admin@zolar.com`
- **Password**: `Admin123!`

**IMPORTANT**: Change this password immediately after first login in production!

