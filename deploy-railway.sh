#!/bin/bash

# Railway Deployment Script for Web3 Message Signer & Verifier
# This script helps set up and deploy the application to Railway

echo "🚀 Deploying Web3 Message Signer & Verifier to Railway..."
echo ""

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI is not installed. Please install it first:"
    echo "npm install -g @railway/cli"
    exit 1
fi

# Check if user is logged in
if ! railway status &> /dev/null; then
    echo "🔐 Please login to Railway first:"
    echo "railway login"
    exit 1
fi

echo "✅ Railway CLI is ready"
echo ""

# Deploy the application
echo "🚀 Deploying to Railway..."
railway up

echo ""
echo "📋 After deployment, make sure to set these environment variables in Railway dashboard:"
echo ""
echo "Environment Variables to set:"
echo "NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=dc644cce-6fae-4142-873a-93d867c8a2c6"
echo "NEXT_PUBLIC_BACKEND_URL=<your-railway-backend-url>"
echo "FRONTEND_URL=<your-railway-frontend-url>"
echo "NODE_ENV=production"
echo "PORT=<auto-set-by-railway>"
echo ""
echo "Note: Railway will provide the actual URLs after first deployment."
echo "You'll need to update NEXT_PUBLIC_BACKEND_URL and FRONTEND_URL with the actual Railway URLs."
echo ""
echo "🎉 Deployment initiated! Check Railway dashboard for status."