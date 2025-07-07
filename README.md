# Web3 Message Signer & Verifier

A full-stack Web3 application that allows users to authenticate using Dynamic.xyz embedded wallets, sign custom messages, and verify signatures through a Node.js backend.

![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)
![React Version](https://img.shields.io/badge/react-18.2.0-61dafb)

## 🌟 Features

- **🔐 Headless Wallet Authentication** - Email-based login with Dynamic.xyz
- **✍️ Message Signing** - Sign custom messages with embedded wallets
- **✅ Signature Verification** - Backend verification using ethers.js
- **📜 History Management** - Local storage with import/export
- **🎨 Modern UI/UX** - Dark mode, glassmorphism, animations
- **🔒 Multi-Factor Auth** - Optional MFA setup (bonus feature)
- **📱 Responsive Design** - Works on all devices

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Dynamic.xyz account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/web3-message-signer.git
cd web3-message-signer
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```
Backend will run on http://localhost:3001

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Add your Dynamic.xyz environment ID to .env
npm run dev
```
Frontend will run on http://localhost:5173

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📦 Production Deployment

See individual README files in `backend/` and `frontend/` directories for deployment instructions.

## 📄 License

MIT License
