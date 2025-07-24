#!/usr/bin/env node

/**
 * Deployment script for production
 * Runs database migrations automatically on deployment
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runMigration() {
  console.log('🚀 Starting production deployment...');
  
  try {
    // Check if we're in production environment
    if (process.env.NODE_ENV !== 'production') {
      console.log('⚠️  Not in production environment, skipping migration');
      return;
    }

    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      console.log('⚠️  DATABASE_URL not set, skipping migration');
      return;
    }

    console.log('📊 Running database migrations...');
    
    // Generate Prisma client
    await execAsync('npx prisma generate');
    console.log('✅ Prisma client generated');
    
    // Run migrations
    await execAsync('npx prisma migrate deploy');
    console.log('✅ Database migrations completed successfully');
    
  } catch (error) {
    console.error('❌ Migration failed:', error instanceof Error ? error.message : String(error));
    
    // Don't fail the deployment if migration fails
    // This prevents deployment failures due to database issues
    console.log('⚠️  Continuing deployment despite migration error');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration();
}

export default runMigration;
