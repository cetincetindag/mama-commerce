# UploadThing Migration Guide

This guide will help you migrate from local image storage to UploadThing for your product images.

## Prerequisites

1. **UploadThing Account**: Sign up at [https://uploadthing.com](https://uploadthing.com)
2. **Environment Variables**: Add the following to your `.env` file:

   ```env
   UPLOADTHING_TOKEN=your-uploadthing-v7-token
   ```

   **Note**: UploadThing v7 uses a single `UPLOADTHING_TOKEN` instead of separate `UPLOADTHING_SECRET` and `UPLOADTHING_APP_ID` variables.

## What's Changed

### 🔧 Updated Components
- **ImageUpload.tsx**: Now uses UploadThing's drag-and-drop component instead of custom file upload
- **Environment Configuration**: Added UploadThing variables to `src/env.js`
- **Next.js Config**: Updated to allow UploadThing image domains

### 🆕 New Files
- `src/app/api/uploadthing/core.ts`: UploadThing configuration and file router
- `src/app/api/uploadthing/route.ts`: API route handlers for UploadThing
- `src/utils/uploadthing.ts`: UploadThing utility components
- `scripts/migrate-images-to-uploadthing.js`: Migration script for existing images

### 🗑️ Removed Files
- `src/app/api/admin/upload/route.ts`: Old upload API (no longer needed)

## Setup Instructions

### 1. Get UploadThing Token

1. Go to [UploadThing Dashboard](https://uploadthing.com/dashboard)
2. Navigate to **API Keys** section
3. Click on the **V7** tab (important: use V7, not V6)
4. Copy your `UPLOADTHING_TOKEN`
5. Add it to your `.env` file

### 2. Test the New Upload System
1. Start your development server: `npm run dev`
2. Go to your admin panel
3. Try creating or editing a product
4. Upload new images using the new UploadThing interface

### 3. Migrate Existing Images (Optional)
If you have existing products with local images in the `public/uploads/` folder:

1. **Manual Migration** (Recommended):
   - Edit each product in your admin panel
   - Re-upload the images using the new UploadThing interface
   - Save the product

2. **Automated Migration** (Advanced):
   - The `scripts/migrate-images-to-uploadthing.js` provides a template
   - You'll need to implement the actual UploadThing API calls
   - This requires additional setup and testing

## Benefits of UploadThing

✅ **CDN Integration**: Faster image loading worldwide  
✅ **Automatic Optimization**: Images are optimized for web  
✅ **Scalability**: No server storage limits  
✅ **Security**: Built-in file validation and virus scanning  
✅ **Reliability**: 99.9% uptime SLA  

## Image Management

### New Image URLs
- **Old**: `/uploads/filename.jpg` (local)
- **New**: `https://uploadthing.com/f/unique-id` (UploadThing CDN)

### File Limits
- **Max File Size**: 4MB per image
- **Max Files**: 10 images per upload
- **Supported Formats**: PNG, JPG, GIF

## Troubleshooting

### Common Issues

1. **"Upload failed" Error**
   - Check your UploadThing token in `.env` file (`UPLOADTHING_TOKEN`)
   - Ensure you're using the V7 token from the dashboard
   - Verify your UploadThing app is active
   - Check file size limits (4MB max)

2. **Images not displaying**
   - Verify Next.js config includes UploadThing domains
   - Check that images are properly saved in the database

3. **Environment Variables**
   - Make sure variables are properly set in `.env`
   - Restart your development server after adding variables

### Support
- UploadThing Docs: [https://docs.uploadthing.com](https://docs.uploadthing.com)
- UploadThing Discord: Available in their documentation

## Migration Checklist

- [ ] UploadThing account created
- [ ] V7 token obtained from dashboard (API Keys > V7 tab)
- [ ] `UPLOADTHING_TOKEN` added to `.env` file
- [ ] Development server restarted
- [ ] New image upload tested in admin panel
- [ ] Existing products migrated (if needed)
- [ ] Old `public/uploads/` folder can be removed (after migration)

## Notes

- The old upload API has been removed
- Local image storage is no longer used for new uploads
- Existing local images will continue to work until migrated
- Consider keeping backups of your `public/uploads/` folder during migration
