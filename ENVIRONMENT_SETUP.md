# Environment Setup Guide

## Required Environment Variables

### Frontend Environment (.env.local)

Create `frontend/.env.local` with the following variables:

```env
# Dynamic.xyz Configuration (REQUIRED)
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Dynamic.xyz Setup

### 1. Create Dynamic.xyz Account

1. Visit [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Sign up for a free account
3. Create a new project

### 2. Configure Your Project

1. **Project Name**: `Web3 Signature Verifier`
2. **Networks**: Enable Ethereum Mainnet and/or testnets as needed
3. **Wallet Connectors**: Enable the connectors you want to support

### 3. Get Your Environment ID

1. In your Dynamic.xyz dashboard, go to **Developers** → **API Keys**
2. Copy your **Environment ID**
3. Add it to your `frontend/.env.local` file

### 4. Configure Allowed Origins (for production)

1. Go to **Developers** → **API Keys** → **Allowed Origins**
2. Add your domain(s):
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://your-app.vercel.app`)

## Development Setup

### Quick Start

```bash
# Install all dependencies
npm run install:all

# Create environment file
cp frontend/.env.local.example frontend/.env.local
# Edit the file with your Dynamic.xyz Environment ID

# Start both backend and frontend
npm run dev
```

### Individual Services

```bash
# Backend only (runs on port 3001)
npm run dev:backend

# Frontend only (runs on port 3000)
npm run dev:frontend
```

## Testing

```bash
# Run all tests
npm run test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## Deployment

### Backend (AWS Lambda)

```bash
# Configure AWS credentials
aws configure

# Deploy backend
npm run deploy:backend
```

### Frontend (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
npm run deploy:frontend
```

## Troubleshooting

### Common Issues

1. **Dynamic.xyz Environment ID not set**

   - Make sure you've created `frontend/.env.local`
   - Ensure the Environment ID is correct

2. **Backend not responding**

   - Check if backend is running on port 3001
   - Verify no other services are using the port

3. **Build errors**

   - Make sure all dependencies are installed: `npm run install:all`
   - Check TypeScript errors in the terminal

4. **Wallet connection issues**
   - Verify your Dynamic.xyz configuration
   - Check browser console for errors
   - Ensure you're using a supported wallet

### Getting Help

- Check the [Dynamic.xyz Documentation](https://docs.dynamic.xyz/)
- Review the main [README.md](./README.md) for detailed setup instructions
- Create an issue in this repository for specific problems
