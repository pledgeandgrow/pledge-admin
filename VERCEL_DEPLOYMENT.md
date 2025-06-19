# Pledge Admin - Vercel Deployment Guide

This document provides instructions for deploying the Pledge Admin application to Vercel.

## Prerequisites

1. A Vercel account
2. A Supabase account with a project set up
3. Your Supabase project credentials

## Environment Variables

The following environment variables need to be set in your Vercel project:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

## Deployment Steps

### Option 1: Deploy from the Vercel Dashboard

1. Log in to your Vercel account
2. Click "Add New" > "Project"
3. Import the project from your Git repository
4. Configure the project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Add the environment variables listed above
6. Click "Deploy"

### Option 2: Deploy using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```bash
   vercel login
   ```

3. Navigate to your project directory and deploy:
   ```bash
   cd pledg-admin
   vercel
   ```

4. Follow the prompts to configure your project
5. Add environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

6. Deploy to production:
   ```bash
   vercel --prod
   ```

## Post-Deployment

After deployment, verify that:

1. The application is running correctly
2. The connection to Supabase is working
3. All features are functioning as expected

## Troubleshooting

If you encounter any issues during deployment:

1. Check the Vercel deployment logs
2. Verify that all environment variables are set correctly
3. Ensure that your Supabase project is properly configured and accessible
4. Check for any build errors in the Vercel dashboard

## Updating the Deployment

To update your deployment after making changes:

1. Push your changes to the connected Git repository, or
2. Run `vercel --prod` from the command line

## Custom Domains

To set up a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to "Settings" > "Domains"
3. Add your domain and follow the instructions to configure DNS settings
