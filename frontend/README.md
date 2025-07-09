# Dynamic Wallet Frontend

React + TypeScript + Vite frontend for the Dynamic Wallet application.

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

## 🌐 Deployment

### Vercel Deployment

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
   VITE_API_URL=http://localhost:3001
   VITE_DYNAMIC_ENV_ID=your-actual-environment-id
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

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://api.example.com` |
| `VITE_DYNAMIC_ENV_ID` | Dynamic Labs Environment ID | `01234567-89ab-cdef-0123-456789abcdef` |

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
- Check CORS configuration in backend
- Ensure backend is accessible from frontend domain

## 📄 License

MIT License - see root LICENSE file for details.