# Database Migration Guide

## Overview
This project has been migrated from SQLite to PostgreSQL for production deployment compatibility with Vercel.

## Current Setup

### Local Development
- **Database**: SQLite (`file:./dev.db`)
- **Environment**: `.env.local`

### Production
- **Database**: PostgreSQL (Railway)
- **Environment**: Production environment variables in Vercel

## Database Providers

### Railway PostgreSQL
- **Connection String**: Available in project environment variables
- **Access**: Via Railway dashboard or CLI
- **Backup**: Automatic backups available in Railway dashboard

## Environment Files

- `.env` - Currently set to PostgreSQL for development
- `.env.local` - Override for local development (use SQLite)
- `.env.production` - Production settings with Railway PostgreSQL
- `.env.local.example` - Template for local development

## For Vercel Deployment

Add these environment variables in your Vercel dashboard:

```bash
DATABASE_URL="postgresql://postgres:LptOzOWWxQQlucAnlyRcdsDKSLojrnuf@hopper.proxy.rlwy.net:45237/railway"
ADMIN_USERNAME="admin"
JWT_SECRET="your-strong-production-secret"
ADMIN_PASSWORD_HASH="your-bcrypt-hashed-password"
UPLOADTHING_TOKEN="your-production-uploadthing-token"
NEXT_PUBLIC_DEBUG_MODE="false"
DEBUG_MODE="false"
```

## Data Migration Completed

✅ **Products**: 18 migrated successfully  
✅ **Orders**: 3 migrated successfully  
✅ **Contacts**: 3 migrated successfully  
✅ **Carts**: 0 (empty)

## Backup

- SQLite backup available at: `prisma/db.sqlite.backup`
- Original SQLite database: `prisma/db.sqlite`

## Commands

```bash
# View database in browser
npm run db:studio

# Deploy migrations to production
npm run db:migrate

# Generate Prisma client
npx prisma generate
```

## Switching Between Databases

### To use SQLite locally:
1. Update `.env` DATABASE_URL to `file:./dev.db`
2. Update `prisma/schema.prisma` provider to `sqlite`
3. Run `npx prisma generate`

### To use PostgreSQL:
1. Update `.env` DATABASE_URL to Railway connection string
2. Update `prisma/schema.prisma` provider to `postgresql`  
3. Run `npx prisma generate`
