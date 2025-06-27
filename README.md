# Web3 Signature Verifier

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

## 📁 Project Structure

```
legacy-fe-candidate-assignment/
├── backend/                    # NestJS backend
│   ├── sls/                   # Serverless infrastructure
│   │   ├── serverless.yml     # AWS deployment config
│   │   └── package.json       # Serverless dependencies
│   ├── src/                   # Backend source code
│   │   ├── signature/         # Signature verification module
│   │   ├── app.module.ts      # Main app module
│   │   ├── main.ts            # Application entry point
│   │   └── lambda.ts          # AWS Lambda handler
│   ├── package.json           # Backend dependencies
│   └── tsconfig.json          # TypeScript config
├── frontend/                  # Next.js frontend
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── components/       # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── types/            # TypeScript types
│   ├── package.json          # Frontend dependencies
│   └── next.config.js        # Next.js configuration
└── README.md                 # This file
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
cd ../backend/sls
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

The frontend will run on `http://localhost:3000`

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

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2023-12-01T10:00:00.000Z",
  "service": "Web3 Signature Verification Backend"
}
```

## 🔐 Security Features

- **Message Signing**: Uses EIP-191 standard message signing
- **Signature Verification**: Backend verifies signatures using ethers.js
- **Address Recovery**: Cryptographically recovers signer address
- **Input Validation**: Comprehensive request validation
- **CORS Protection**: Configured for secure cross-origin requests

## 🎨 Design System

- **Colors**: Modern purple/blue gradient theme
- **Typography**: Inter font family for clean readability
- **Components**: Reusable UI components with consistent styling
- **Responsive**: Mobile-first responsive design
- **Animations**: Subtle animations for better UX

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

### Future Improvements

1. **Database Integration**: Add PostgreSQL/MongoDB for persistent storage
2. **Advanced Auth**: Implement role-based access control
3. **Message Types**: Support for structured data signing (EIP-712)
4. **Analytics**: Usage analytics and signature statistics
5. **Multi-Chain**: Support for multiple blockchain networks
6. **Batch Operations**: Sign multiple messages at once

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For questions or support:

- Create an issue in this repository
- Check the Dynamic.xyz documentation
- Review the NestJS and Next.js documentation

---

Built with ❤️ using Next.js, NestJS, TypeScript, and Dynamic.xyz
