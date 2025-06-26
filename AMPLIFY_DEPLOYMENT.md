# AWS Amplify Deployment Guide

## Overview

This guide will help you deploy your Web3 Signature Frontend to AWS Amplify.

## Prerequisites

- AWS Account
- GitHub repository with your code
- AWS CLI installed (optional but recommended)

## Step 1: Connect Repository to AWS Amplify

1. Go to the [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" > "Host web app"
3. Select your Git provider (GitHub, GitLab, etc.)
4. Authorize AWS Amplify to access your repository
5. Select your repository: `legacy-fe-candidate-assignment`
6. Select the branch you want to deploy (usually `main`)

## Step 2: Configure Build Settings

The `amplify.yml` file has been configured to:

- Install dependencies in the `frontend` folder
- Build the Next.js application with static export
- Cache node_modules and Next.js build cache for faster builds

## Step 3: Environment Variables

If your application requires environment variables, add them in the Amplify Console:

1. Go to App Settings > Environment variables
2. Add the following variables as needed:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
   - `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` - Your Dynamic.xyz environment ID
   - Any other environment-specific variables

## Step 4: Deploy

1. Click "Save and deploy"
2. AWS Amplify will automatically build and deploy your application
3. You'll get a unique URL like `https://branch-name.appid.amplifyapp.com`

## Step 5: Custom Domain (Optional)

1. Go to App Settings > Domain management
2. Add your custom domain
3. AWS will handle SSL certificate provisioning automatically

## Build Configuration Details

The `amplify.yml` file includes:

- **Build directory**: `frontend/out` (Next.js static export)
- **Cache**: Node modules and Next.js build cache
- **Build command**: `npm run build` (runs in frontend directory)

## Next.js Configuration

The `next.config.js` has been updated to:

- Enable static export (`output: 'export'`)
- Add trailing slashes for better compatibility
- Disable image optimization for static export
- Maintain webpack fallbacks for Web3 libraries

## Monitoring

AWS Amplify provides:

- Build logs and deployment history
- Real-time monitoring
- Performance metrics
- Error tracking

## Troubleshooting

Common issues:

1. **Build fails**: Check the build logs in the Amplify Console
2. **Environment variables**: Ensure they're set in the Amplify Console
3. **API calls**: Update CORS settings in your backend to allow the new domain
4. **Wallet connection**: Ensure Web3 providers work in the deployed environment

## Automatic Deployments

AWS Amplify will automatically deploy when you push to your connected branch. You can also trigger manual deployments from the console.
