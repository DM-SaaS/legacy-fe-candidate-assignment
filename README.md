# Web3 Signature Verifier - by Gabriel Fialho

A full-stack Web3 application that allows users to authenticate using Dynamic.xyz embedded wallet, sign custom messages, and verify signatures through a secure backend.

## 🚀 Features

- **Dynamic.xyz Integration**: Headless embedded wallet authentication
- **Message Signing**: Sign custom messages with your connected wallet
- **Backend Verification**: Secure signature verification using ethers.js
- **Real-time Validation**: Instant signature verification and feedback
- **Message History**: Local storage of signed messages with verification status
- **Modern UI**: Beautiful, responsive design with Tailwind CSS
- **TypeScript**: Full type safety across frontend and backend
- **Serverless Ready**: AWS Lambda deployment with Serverless Framework

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │     Backend     │    │       AWS       │
│   (Next.js)     │◄──►│   (NestJS)      │◄──►│    (Lambda)     │
│                 │    │                 │    │                 │
│ • Dynamic.xyz   │    │ • Signature     │    │ • Serverless    │
│ • React 18      │    │   Verification  │    │ • API Gateway   │
│ • TypeScript    │    │ • ethers.js     │    │ • CloudFormation│
│ • Tailwind CSS  │    │ • TypeScript    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📸 Application Screenshots

![Screenshot 1](https://imgur.com/KNLSEM2.png)

![Screenshot 2](https://imgur.com/Pk12bCG.png)

![Screenshot 3](https://imgur.com/EXEDsTi.png)

![Screenshot 4](https://imgur.com/045J0Dd.png)

![Screenshot 5](https://imgur.com/8DUJuXw.png)

## 📁 Project Structure

```
legacy-fe-candidate-assignment-gabriel-fialho/
├── amplify.yml                 # AWS Amplify configuration
├── backend/                    # NestJS backend
│   ├── nest-cli.json          # Nest CLI configuration
│   ├── package.json           # Backend dependencies
│   ├── package-lock.json      # Backend dependency lock
│   ├── serverless.yml         # Serverless Framework config
│   ├── tsconfig.json          # TypeScript configuration
│   ├── sls/                   # Serverless infrastructure
│   │   └── functions/
│   │       └── api/
│   │           └── main.yml   # Lambda function definition
│   ├── src/                   # Backend source code
│   │   ├── app.module.ts      # Main app module
│   │   ├── lambda.ts          # AWS Lambda handler
│   │   ├── main.ts            # Application entry point
│   │   └── signature/         # Signature verification module
│   │       ├── dto/
│   │       │   └── verify-signature.dto.ts
│   │       ├── signature.controller.spec.ts
│   │       ├── signature.controller.ts
│   │       ├── signature.module.ts
│   │       ├── signature.service.spec.ts
│   │       └── signature.service.ts
│   └── test/                  # E2E tests
│       ├── app.e2e-spec.ts
│       └── jest-e2e.json
├── frontend/                  # Next.js frontend
│   ├── jest.config.js         # Jest configuration
│   ├── jest.setup.js          # Jest setup
│   ├── next.config.js         # Next.js configuration
│   ├── package.json           # Frontend dependencies
│   ├── package-lock.json      # Frontend dependency lock
│   ├── postcss.config.js      # PostCSS configuration
│   ├── tailwind.config.js     # Tailwind CSS configuration
│   ├── tsconfig.json          # TypeScript configuration
│   └── src/
│       ├── app/               # Next.js app directory
│       │   ├── globals.css    # Global styles
│       │   ├── layout.tsx     # Root layout
│       │   └── page.tsx       # Home page
│       ├── components/        # React components
│       │   ├── __tests__/
│       │   │   └── Button.test.tsx
│       │   ├── ui/            # UI components
│       │   │   ├── Button.tsx
│       │   │   ├── Card.tsx
│       │   │   ├── Input.tsx
│       │   │   └── Textarea.tsx
│       │   ├── DynamicProvider.tsx
│       │   ├── MessageSigner.tsx
│       │   ├── SignatureHistory.tsx
│       │   └── WalletConnection.tsx
│       ├── hooks/             # Custom React hooks
│       │   └── useSignature.tsx
│       ├── lib/               # Utility functions
│       │   ├── api.ts
│       │   └── utils.ts
│       └── types/             # TypeScript types
│           └── index.ts
├── ENVIRONMENT_SETUP.md       # Environment setup guide
├── package.json               # Root package.json
└── README.md                  # This file
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+
- npm or yarn
- AWS CLI (for deployment)
- Dynamic.xyz account (for wallet integration)

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Install serverless dependencies
cd ../backend
npm install
```

### 2. Environment Configuration

#### Frontend Environment Variables

Create `frontend/.env.local`:

```env
# Dynamic.xyz Configuration (Required)
NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here

# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Backend Environment Variables

No additional environment variables required for local development.

### 3. Dynamic.xyz Setup

1. Visit [Dynamic.xyz Dashboard](https://app.dynamic.xyz/)
2. Create a new project
3. Copy your Environment ID
4. Add it to `frontend/.env.local`

### 4. Development Servers

#### Start Backend (Terminal 1)

```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

#### Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3003`

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm run test        # Unit tests
npm run test:e2e    # End-to-end tests
npm run test:cov    # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm run test
```

## 🚀 Deployment

### Backend Deployment (AWS)

1. Configure AWS credentials:

```bash
aws configure
```

2. Deploy to AWS:

```bash
cd backend/sls
npm run deploy
```

3. Update frontend environment with deployed API URL:

```env
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.amazonaws.com
```

## 🔧 API Documentation

### POST /api/verify-signature

Verify a message signature.

**Request:**

```json
{
  "message": "Hello, Web3!",
  "signature": "0x1234..."
}
```

**Response:**

```json
{
  "isValid": true,
  "signer": "0xabc123...",
  "originalMessage": "Hello, Web3!"
}
```

## 🔐 Security Features

- **Message Signing**: Uses EIP-191 standard message signing
- **Signature Verification**: Backend verifies signatures using ethers.js
- **Address Recovery**: Cryptographically recovers signer address
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for secure cross-origin requests

## 📱 Features Walkthrough

1. **Connect Wallet**: Click "Connect Wallet" to authenticate with Dynamic.xyz
2. **Sign Message**: Enter any custom message and click "Sign Message"
3. **Verify Signature**: Signatures are automatically verified by the backend
4. **View History**: See all your signed messages with verification status
5. **Manage Messages**: Copy signatures, delete messages, or clear all history

## 🔮 Bonus Features Implemented

- ✅ **Headless Integration**: Using Dynamic.xyz headless SDK
- ✅ **Beautiful UI**: Modern, responsive design with animations
- ✅ **Local History**: Persistent message history in localStorage
- ✅ **Real-time Verification**: Immediate backend validation
- ✅ **Copy Functions**: Easy copying of addresses, messages, and signatures
- ✅ **Error Handling**: Comprehensive error handling and user feedback

## 🚧 Trade-offs & Improvements

### Current Trade-offs

1. **In-Memory Session**: Backend uses in-memory storage (as required)
2. **Local Storage**: Frontend history stored locally (as required)
3. **Single Signature Type**: Currently supports message signing only

---

Built with ❤️ by Gabriel Fialho
