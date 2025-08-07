# Web3 Message Signer & Verifier - Frontend

A modern React + Next.js 15 application for signing and verifying Web3 messages using Dynamic.xyz headless wallet integration.

## 🚀 Features

- **Dynamic.xyz Integration**: Headless email wallet authentication with multi-wallet support
- **Message Signing**: Sign custom messages with your Web3 wallet
- **Signature Verification**: Real-time cryptographic signature verification via backend API
- **Signing History**: Complete history with localStorage persistence and export functionality
- **Beautiful UI**: Modern design with Tailwind CSS and shadcn/ui components
- **Multi-Chain Support**: Ethereum, Base, Sepolia, and more
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Web3 Integration**: Dynamic.xyz SDK
- **State Management**: React hooks + localStorage
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0
- Dynamic.xyz account and Environment ID

## ⚙️ Setup Instructions

### 1. Environment Configuration

1. **Copy the environment file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Dynamic Environment ID:**
   - Go to [Dynamic.xyz Dashboard](https://app.dynamic.xyz)
   - Create a new project or use existing one
   - Copy your Environment ID from the project settings

3. **Update .env.local:**
   ```env
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_dynamic_environment_id_here
   NEXT_PUBLIC_BACKEND_URL=http://localhost:3001/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 2. Dynamic.xyz Configuration

1. **Login to Dynamic Dashboard:**
   - Visit [Dynamic.xyz Dashboard](https://app.dynamic.xyz)
   - Navigate to your project settings

2. **Configure CORS:**
   - Add `http://localhost:3000` to allowed origins
   - Add your production domain if deploying

3. **Enable Email Authentication:**
   - Go to Authentication settings
   - Enable "Email/SMS" authentication
   - Configure social providers if needed (Google, Twitter, etc.)

4. **Network Configuration:**
   - Ensure Ethereum Mainnet, Sepolia, and Base are enabled
   - Configure any additional networks as needed

### 3. Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Visit the application:**
   - Open [http://localhost:3000](http://localhost:3000)
   - Connect your wallet and start signing messages!

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Backend Integration
# Make sure the backend is running on http://localhost:3001
```

## 🏗️ Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API routes
│   │   │   └── server/         # Backend proxy routes
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout with providers
│   │   └── page.tsx            # Homepage
│   ├── components/             # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── message-signer.tsx  # Message signing interface
│   │   └── signing-history.tsx # History management
│   ├── hooks/                  # Custom React hooks
│   │   ├── use-dynamic-auth.ts # Dynamic.xyz integration
│   │   └── use-signing-history.ts # History management
│   ├── lib/                    # Utilities
│   └── providers/              # React context providers
│       └── dynamic-provider.tsx # Dynamic.xyz setup
├── public/                     # Static assets
├── .env.local                  # Environment variables
└── README.md
```

## 🌐 API Integration

The frontend communicates with the backend through Next.js API routes:

### Backend Proxy Route
```typescript
// src/app/api/server/verify-signature/route.ts
POST /api/server/verify-signature
```

This route forwards requests to the Node.js backend running on `http://localhost:3001/api/verify-signature`.

### Request Format
```json
{
  "message": "Hello World",
  "signature": "0x1234567890abcdef..."
}
```

### Response Format
```json
{
  "isValid": true,
  "signer": "0x742d35cc6bb3c0532925a3b8d8cf6e8e1d47e5c1",
  "originalMessage": "Hello World"
}
```

## 🎨 UI Components

### Main Components

1. **WalletConnectButton**: Dynamic.xyz widget integration with connection status
2. **MessageSigner**: Interface for signing messages with real-time verification
3. **SigningHistory**: Complete history management with analytics and export

### Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Mode**: Theme support (can be extended)
- **Toast Notifications**: User feedback for all actions
- **Loading States**: Proper loading indicators throughout
- **Error Handling**: Comprehensive error states and messages

## 🔐 Security Features

- **Client-side Validation**: Input validation before sending to backend
- **Signature Verification**: Real-time cryptographic verification
- **Secure Storage**: localStorage for history (client-side only)
- **CORS Protection**: Configured for specific origins
- **Error Handling**: No sensitive data exposed in error messages

## 📱 User Experience Flow

1. **Connect Wallet**: 
   - Click "Connect Wallet" button
   - Choose from supported wallets (MetaMask, Coinbase, WalletConnect, etc.)
   - Dynamic.xyz handles the connection flow

2. **Sign Message**:
   - Enter custom message
   - Click "Sign & Verify Message"
   - Wallet prompts for signature
   - Real-time verification via backend

3. **View History**:
   - Switch to "Signing History" tab
   - See all previous signatures with verification status
   - Export history or clear individual items

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository to Vercel**
2. **Set environment variables:**
   ```env
   NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID=your_environment_id
   NEXT_PUBLIC_BACKEND_URL=https://your-backend-url.com/api
   NEXT_PUBLIC_APP_URL=https://your-app-url.vercel.app
   ```
3. **Deploy**: Vercel will automatically build and deploy

### Other Platforms

- **Netlify**: Configure build command as `npm run build`
- **Railway**: Connect GitHub and set environment variables
- **DigitalOcean**: Use App Platform with Node.js buildpack

## 🔧 Configuration Options

### Dynamic.xyz Settings

The Dynamic provider supports extensive customization:

```typescript
// src/providers/dynamic-provider.tsx
{
  // Authentication mode
  initialAuthenticationMode: 'connect-and-sign',
  
  // Multi-wallet support
  multiWallet: true,
  
  // Recommended wallets
  recommendedWallets: [
    { walletKey: 'metamask' },
    { walletKey: 'coinbase' },
    { walletKey: 'walletconnect' },
  ],
  
  // Network overrides
  overrides: { evmNetworks },
  
  // Event handlers
  events: {
    onAuthSuccess: (event) => console.log('User authenticated'),
    onLogout: () => console.log('User logged out'),
  },
}
```

### Styling Customization

The app uses Tailwind CSS with custom color schemes:

```css
/* Gradient backgrounds */
bg-gradient-to-br from-blue-50 via-white to-purple-50

/* Component styling */
.dynamic-widget-button--primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Missing Dynamic Environment ID" error**:
   - Ensure `NEXT_PUBLIC_DYNAMIC_ENVIRONMENT_ID` is set in `.env.local`
   - Check that the environment ID is correct

2. **Wallet connection fails**:
   - Check CORS settings in Dynamic dashboard
   - Ensure localhost:3000 is added to allowed origins

3. **Backend verification fails**:
   - Ensure backend is running on port 3001
   - Check `NEXT_PUBLIC_BACKEND_URL` environment variable

4. **Build errors**:
   - Clear `.next` folder and node_modules
   - Run `npm install` again
   - Check for TypeScript errors

### Development Tips

- Use browser dev tools to check console for Dynamic.xyz connection logs
- Network tab shows API calls to backend
- localStorage inspector shows signing history data

## 📧 Support

For issues related to:
- **Dynamic.xyz**: Check [Dynamic documentation](https://docs.dynamic.xyz) or join their [Slack community](https://dynamic.xyz/slack)
- **Next.js**: See [Next.js documentation](https://nextjs.org/docs)
- **This project**: Create an issue in the repository

## 🎯 Future Enhancements

- Multi-factor authentication (MFA) integration
- Batch message signing
- Message templates
- Enhanced analytics dashboard
- Additional blockchain networks
- Mobile app with React Native

---

Built with ❤️ using Dynamic.xyz, Next.js, and modern Web3 technologies.