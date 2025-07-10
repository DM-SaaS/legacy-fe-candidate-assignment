# Dynamic Wallet Frontend

React + TypeScript + Vite frontend for the Dynamic Wallet application.

**🌐 [Live Demo](https://legacy-fe-candidate-assignment-6hk8sifm5.vercel.app)** • **📚 [API Docs](https://legacy-fe-candidate-assignment-e9pd.onrender.com/api-docs)**

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌐 Production Deployment

### **Live Application**
- **Frontend**: [https://legacy-fe-candidate-assignment-6hk8sifm5.vercel.app](https://legacy-fe-candidate-assignment-6hk8sifm5.vercel.app)
- **Backend API**: [https://legacy-fe-candidate-assignment-e9pd.onrender.com](https://legacy-fe-candidate-assignment-e9pd.onrender.com)

### **Production Stack**
- **Platform**: Vercel (Automatic deployments)
- **Domain**: Custom Vercel subdomain
- **SSL**: Automatically provisioned
- **CDN**: Global edge network

## 🌐 Deployment

### Vercel Deployment (Production)

**Current Configuration:**
- **Repository**: Connected to GitHub
- **Root Directory**: `frontend`
- **Framework**: Vite (Auto-detected)
- **Node Version**: 18.x
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Environment Variables** (in Vercel dashboard):
```
VITE_API_URL=https://legacy-fe-candidate-assignment-e9pd.onrender.com
VITE_DYNAMIC_ENV_ID=your-dynamic-labs-env-id
```

### Manual Deployment Steps

1. **Fork/Clone** this repository
2. **Connect** to Vercel:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Select the `frontend` directory as root

3. **Environment Variables** (in Vercel dashboard):
   ```
   VITE_API_URL=https://your-backend-url.com
   VITE_DYNAMIC_ENV_ID=your-dynamic-labs-env-id
   ```

4. **Deploy** - Vercel will automatically detect Vite and deploy

### Manual Environment Setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```env
   # Development
   VITE_API_URL=http://localhost:3001
   VITE_DYNAMIC_ENV_ID=your-actual-environment-id

   # Production
   VITE_API_URL=https://legacy-fe-candidate-assignment-e9pd.onrender.com
   VITE_DYNAMIC_ENV_ID=your-production-environment-id
   ```

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run test` - Run test suite
- `npm run test:coverage` - Run tests with coverage

### Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **Dynamic Labs** - Web3 authentication
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── layouts/        # Layout components
│   ├── navigation/     # Navigation components
│   ├── pages/          # Page components
│   └── ui/             # Base UI components
├── features/           # Feature-based modules
│   ├── auth/           # Authentication feature
│   └── wallet/         # Wallet feature
├── hooks/              # Custom React hooks
├── lib/                # External API clients
├── router/             # React Router configuration
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🔧 Configuration

### Vite Configuration

The project uses Vite with the following optimizations:
- **Fast Refresh** for instant hot reloading
- **Path aliases** for clean imports
- **Bundle optimization** for production builds

### Tailwind CSS

Custom configuration includes:
- **Design system** colors and spacing
- **Component variants** for consistency
- **Responsive breakpoints** for mobile-first design

### ESLint & Prettier

Code quality enforced with:
- **TypeScript** linting rules
- **React** best practices
- **Import** organization
- **Accessibility** checks

## 🌍 Environment Variables

| Variable | Description | Development | Production |
|----------|-------------|-------------|------------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001` | `https://legacy-fe-candidate-assignment-e9pd.onrender.com` |
| `VITE_DYNAMIC_ENV_ID` | Dynamic Labs Environment ID | `your-dev-env-id` | `your-production-env-id` |

## 📱 Features

- ✅ **Wallet Authentication** via Dynamic Labs
- ✅ **Message Signing** with signature verification
- ✅ **Responsive Design** for all devices
- ✅ **Component Library** showcase page
- ✅ **Error Boundaries** for graceful error handling
- ✅ **Type Safety** with comprehensive TypeScript
- ✅ **Testing** with Vitest and React Testing Library

## 🐛 Troubleshooting

### Common Issues

**Build Errors:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Environment Variables Not Loading:**
- Ensure variables start with `VITE_`
- Restart development server after changes
- Check `.env` file is in frontend root directory

**Dynamic Labs Connection Issues:**
- Verify `VITE_DYNAMIC_ENV_ID` is correct
- Check Dynamic Labs dashboard for environment settings
- Ensure domain is whitelisted in Dynamic Labs

**API Connection Issues:**
- Verify `VITE_API_URL` points to running backend
- **Development**: http://localhost:3001
- **Production**: https://legacy-fe-candidate-assignment-e9pd.onrender.com
- Check CORS configuration in backend
- Ensure backend is accessible from frontend domain

## 📄 License

MIT License - see root LICENSE file for details.