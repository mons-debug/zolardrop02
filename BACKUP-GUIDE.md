# Database Backup & Recovery Guide

## 🔴 What Happened

The variants for the Eclipse Black product (PROD-01-EB) were **permanently deleted** from the database on **2025-12-01** when the product was saved with an empty variants array.

## 📊 Current Database Status

✅ **Safe Data:**
- Products: 5
- Orders: 41
- Customers: 6
- Newsletter Subscribers: 2
- Hero Slides: 2

❌ **Lost Data:**
- Variants for Eclipse Black product (CLOUD MIST, FOREST DUSK, OCEAN DEEP)

## 🛡️ How to Backup Your Database (Going Forward)

### Method 1: Manual Backup (Recommended Daily)

```bash
node scripts/backup-database.js
```

This creates a backup file in `backups/backup-[timestamp].json` containing ALL your database data.

### Method 2: Automatic Backups

Set up a cron job or scheduled task to run the backup script automatically:

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Set it to run daily at 2 AM
4. Action: Start a program
5. Program: `node`
6. Arguments: `C:\Users\pc\z\zolardrop02\scripts\backup-database.js`
7. Start in: `C:\Users\pc\z\zolardrop02`

### Method 3: Vercel Postgres Backups (Professional)

1. Go to https://vercel.com/dashboard
2. Navigate to your project → Storage → Postgres
3. Enable "Automated Backups" (requires Pro plan)
4. Or manually create snapshots before making changes

## 📦 How to Restore from Backup

```bash
node scripts/restore-backup.js backups/backup-[timestamp].json
```

**Note:** This script only restores **missing variants**. It won't overwrite existing data.

## 🔧 Preventing Future Data Loss

### 1. Separate Local & Production Databases

**Current Setup (DANGEROUS):**
- Local development → Production Database ✖️
- Any mistake locally affects production

**Recommended Setup:**
- Local development → Local Database ✅
- Production → Production Database ✅

**How to Set Up:**

1. Install PostgreSQL locally or use Docker:
```bash
docker run --name zolar-local-db -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres
```

2. Create `.env.local` (for local development):
```
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/zolar_local"
```

3. Keep `.env` for production:
```
DATABASE_URL="your-vercel-postgres-url"
```

4. Run migrations on local database:
```bash
npx prisma db push
npx prisma db seed # if you have seed data
```

### 2. Add Backup Reminders

Add to your `package.json`:
```json
{
  "scripts": {
    "backup": "node scripts/backup-database.js",
    "backup:before-deploy": "npm run backup && git add backups/ && git commit -m 'Backup before deploy'",
    "deploy": "npm run backup:before-deploy && vercel deploy --prod"
  }
}
```

### 3. Git Ignore Sensitive Backups (Optional)

Add to `.gitignore` if backups contain sensitive data:
```
backups/*.json
```

But keep at least one backup committed for emergency recovery.

## 🚨 Emergency Recovery Steps

If you lose data:

1. **Check backups folder** for most recent backup
2. **Run restore script**: `node scripts/restore-backup.js backups/[file].json`
3. **If no backups exist**, check:
   - Vercel deployment logs
   - Git history for hardcoded data
   - Your local notes/screenshots

## 📝 Recreating Eclipse Black Variants

Since the variants are lost and there's no backup, you'll need to recreate them manually:

### Variant 1: CLOUD MIST
- Color: CLOUD MIST
- SKU: PROD-01-CM
- Price: $220.00
- Stock: [Enter quantity]
- Size Inventory: M=25, L=15, S=10, XL=5 (adjust as needed)
- Show as Product: Yes

### Variant 2: FOREST DUSK
- Color: FOREST DUSK
- SKU: PROD-01-FD
- Price: $220.00
- Stock: [Enter quantity]
- Size Inventory: M=25, L=15, S=10, XL=5
- Show as Product: Yes

### Variant 3: OCEAN DEEP
- Color: OCEAN DEEP
- SKU: PROD-01-OD
- Price: $220.00
- Stock: [Enter quantity]
- Size Inventory: M=25, L=15, S=10, XL=5
- Show as Product: Yes

## 🎯 Best Practices Going Forward

1. ✅ **Backup before ANY database changes**
2. ✅ **Use separate local database for development**
3. ✅ **Test changes locally first**
4. ✅ **Keep multiple backup copies**
5. ✅ **Enable Vercel automated backups (if on Pro plan)**
6. ✅ **Document your data (product details, variants, etc.)**

## 📞 Support

If you need help:
1. Check `backups/` folder for recent backups
2. Run `node scripts/backup-database.js` to see current state
3. Contact Vercel support if on Pro plan for database snapshots







