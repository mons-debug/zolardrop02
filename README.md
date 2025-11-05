# Zolar Drop 02

A modern e-commerce platform for exclusive drops, built with Next.js, TypeScript, and Prisma.

## Tech Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM with database integration
- **Payment Processing**: Cash on Delivery (COD)
- **State Management**: React Query (TanStack Query)
- **Development Tools**: ESLint, Prettier, Jest, Playwright
- **Deployment**: Optimized for Vercel/Netlify

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run prisma:migrate
npm run prisma:seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Quick Access

- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Products Page:** [http://localhost:3000/products](http://localhost:3000/products)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin)
  - Password: `admin-token-123` (MVP testing)

## Admin Dashboard

The admin dashboard (`/admin`) provides comprehensive management features:

### Order Management
- 🔐 Password-protected access (token-based authentication)
- 📊 Live statistics (Total Orders, Pending, COD)
- 📋 Order listing from database (sorted by newest)
- 🔄 One-click status updates: pending → confirmed → shipped → delivered
- 🔔 Real-time notifications via Pusher
- ✅ Toast alerts: "🧾 New COD order received!"
- 🔄 Auto-refresh on new orders

### Product Management (`/admin/products`)
- 📦 Create, edit, and delete products
- 🎨 Add multiple variants/colors with separate SKUs
- 🖼️ Image upload with preview thumbnails
- 💰 Price and stock management per variant
- ⚡ Products appear instantly on storefront
- 🔄 Cascading updates to variants

**See `ADMIN_WORKFLOW_TEST.md` for order management guide.**  
**See `ADMIN_PRODUCTS_GUIDE.md` for product management guide.**

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run Jest tests
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database

## Project Structure

```
/
├── app/                 # Next.js 14 App Router
├── components/          # Reusable React components
├── lib/                 # Utility libraries and configurations
├── prisma/              # Database schema and migrations
├── scripts/             # Database seeds and utility scripts
├── styles/              # Global CSS and Tailwind styles
└── pages/api/           # API routes for serverless functions
```

## 6-Week Development Roadmap

### Week 1: Foundation & Authentication
- [ ] Set up user authentication system
- [ ] Implement user registration and login
- [ ] Create protected routes and middleware
- [ ] Set up password reset functionality

### Week 2: Product Management
- [ ] Design product schema and models
- [ ] Create admin interface for product management
- [ ] Implement product CRUD operations
- [ ] Add product image upload and optimization

### Week 3: Drop System
- [ ] Implement drop scheduling system
- [ ] Create countdown timers and drop notifications
- [ ] Build queue system for high-demand drops
- [ ] Add email notifications for upcoming drops

### Week 4: Shopping Cart & Checkout
- [ ] Implement shopping cart functionality
- [ ] Add admin order management dashboard
- [ ] Create order management system
- [ ] Add order confirmation and email receipts

### Week 5: User Dashboard & Profiles
- [ ] Build user profile management
- [ ] Create order history and tracking
- [ ] Implement wishlist functionality
- [ ] Add user preference settings

### Week 6: Testing & Launch Preparation
- [ ] Write comprehensive test suite
- [ ] Perform security audit and fixes
- [ ] Optimize performance and SEO
- [ ] Prepare for production deployment

## Environment Variables

Create a `.env` file with the following variables:

```
DATABASE_URL="file:./dev.db"
ADMIN_TOKEN="admin-token-123"

# Pusher Configuration (for real-time admin notifications)
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

**Note:** See `PUSHER_SETUP.md` for detailed Pusher configuration instructions. The app works without Pusher, but real-time admin notifications won't function.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if necessary
5. Run the linter and tests
6. Submit a pull request

## License

This project is private and not licensed for public use.
