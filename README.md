# Web3 Message Signer & Verifier

A full-stack Web3 application that enables secure message signing and verification using Dynamic.xyz embedded wallets with headless authentication and multi-factor authentication support.

## Live Demo

- **Frontend**: [https://decentralized-frontend.vercel.app/](https://decentralized-frontend.vercel.app/)
- **Backend API**: [https://decentralized-backend.onrender.com/](https://decentralized-backend.onrender.com/)

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Key Features](#key-features)
- [Testing](#testing)
- [Building for Production](#building-for-production)
- [Environment Variables](#environment-variables)

## Overview

This application demonstrates a complete Web3 authentication and message signing workflow with the following key features:

- **Headless Wallet Integration**: Email-based authentication using Dynamic.xyz embedded wallets
- **Message Signing**: Sign custom messages with cryptographic proof
- **Signature Verification**: Backend verification of signed messages using ethers.js
- **Multi-Factor Authentication**: TOTP-based MFA for enhanced security
- **Signature History**: Persistent storage of signed messages with verification status
- **Modern UI**: Responsive React interface with Tailwind CSS

## Architecture

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript and Vite
- **Styling**: Tailwind CSS with custom components
- **Authentication**: Dynamic.xyz SDK for headless wallet integration
- **State Management**: React Context with custom hooks
- **Form Handling**: React Hook Form with Zod validation
- **HTTP Client**: Axios for API communication

### Backend (Node.js + Express)
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with strict type checking
- **Validation**: Zod schemas for request/response validation
- **Crypto**: ethers.js for signature verification
- **MFA**: otplib for TOTP generation and validation
- **Security**: Helmet, CORS, and rate limiting middleware

## Prerequisites

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher
- Dynamic.xyz account and API key

## Setup Instructions

### 1. Clone the Repository

```bash
git clone
cd decentralized-masters-project
```

### 2. Install Dependencies

```bash
# Install root dependencies and all workspace packages
npm run install:all
```

### 3. Environment Configuration

#### Frontend Environment
Create `packages/frontend/.env`:

```env
VITE_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id
VITE_API_BASE_URL=http://localhost:3001/api
```

#### Backend Environment
Create `packages/backend/.env`:

```env
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 4. Start Development Servers

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3001
```

## Usage Guide

### 1. Authentication Flow

1. **Email Authentication**: Enter your email address to receive an OTP
2. **OTP Verification**: Enter the 6-digit code sent to your email
3. **Wallet Creation**: Dynamic.xyz creates an embedded wallet for your email
4. **MFA Setup** (Optional): Set up TOTP for additional security

### 2. Message Signing

1. **Connect Wallet**: Complete the authentication flow
2. **Enter Message**: Type your custom message in the signing form
3. **Sign Message**: Click "Sign Message" to create a cryptographic signature
4. **View History**: Signed messages appear in the history panel with verification status

### 3. Signature Verification

The application automatically verifies signatures by:
1. Sending the message and signature to the backend API
2. Using ethers.js to recover the signer address
3. Displaying verification results and signer address

## API Documentation

### Base URL
```
# Development
http://localhost:3001/api

# Production
https://decentralized-backend.onrender.com/api
```

### Endpoints

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Verify Signature
```http
POST /verify-signature
Content-Type: application/json

{
  "message": "Hello, Web3!",
  "signature": "0x..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "signer": "0x742d35Cc662C610E4F216AD1E6f90e0d1B8B7d06",
    "originalMessage": "Hello, Web3!",
    "timestamp": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### MFA Setup
```http
POST /mfa/setup
Content-Type: application/json

{
  "userEmail": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "secret": "JBSWY3DPEHPK3PXP",
    "qrCodeUrl": "data:image/png;base64,...",
    "manualEntryKey": "JBSWY3DPEHPK3PXP",
    "backupCodes": ["123456", "789012", ...]
  }
}
```

#### MFA Validation
```http
POST /mfa/validate
Content-Type: application/json

{
  "token": "123456",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

## Project Structure

```
decentralized-masters/
├── packages/
│   ├── frontend/               # React frontend application
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── contexts/       # React contexts
│   │   │   ├── hooks/          # Custom React hooks
│   │   │   ├── services/       # API and utility services
│   │   │   ├── types/          # TypeScript type definitions
│   │   │   └── utils/          # Utility functions
│   │   └── package.json
│   └── backend/                # Node.js backend API
│       ├── src/
│       │   ├── controllers/    # Request handlers
│       │   ├── middleware/     # Express middleware
│       │   ├── routes/         # API route definitions
│       │   ├── services/       # Business logic services
│       │   ├── types/          # TypeScript interfaces
│       │   └── utils/          # Utility functions
│       └── package.json
├── package.json                # Root package configuration
└── README.md
```

## Key Features

### Dynamic.xyz Headless Integration

The application implements Dynamic.xyz's headless authentication flow:

- **Email OTP Authentication**: Users authenticate with their email address
- **Embedded Wallet Creation**: Automatic wallet generation and management
- **Multi-Chain Support**: Supports Ethereum, Solana, and Sui networks
- **Session Management**: Secure session handling with proper cleanup

### Multi-Factor Authentication

TOTP-based MFA implementation includes:

- **QR Code Generation**: Easy setup with authenticator apps
- **Time-Window Validation**: Flexible validation for network delays
- **Backup Codes**: Recovery options for lost devices
- **Session Management**: Configurable MFA session duration

### Security Features

- **Input Validation**: Comprehensive validation using Zod schemas
- **Rate Limiting**: Protection against brute force attacks
- **Error Handling**: Structured error responses with proper HTTP status codes
- **CORS Configuration**: Secure cross-origin request handling
- **Type Safety**: Full TypeScript implementation for runtime safety

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test --workspace=backend

# Run tests in watch mode
npm run test:watch --workspace=backend
```

### Test Coverage

The backend includes comprehensive test coverage for:
- Signature verification logic
- MFA token generation and validation
- API endpoint validation
- Error handling scenarios

## Building for Production

```bash
# Build all packages
npm run build

# Build individual packages
npm run build --workspace=backend
npm run build --workspace=frontend
```


## Environment Variables

### Production Frontend
```env
VITE_DYNAMIC_ENVIRONMENT_ID=your_production_dynamic_environment_id
VITE_API_BASE_URL=https://your-backend-url.com/api
```

### Production Backend
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
```
