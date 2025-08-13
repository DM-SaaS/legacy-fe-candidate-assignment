# Web3 Message Signer - Frontend

React frontend application for signing and verifying Web3 messages with wallet integration.

## Features

- **Wallet Connection**: Seamless Web3 wallet integration via Dynamic.xyz
- **Message Signing**: Interactive message signing interface
- **History View**: Display signing history with beautiful UI
- **Real-time Updates**: Live signature verification status
- **Responsive Design**: Mobile-first responsive interface
- **Modern UI**: Clean design with Tailwind CSS

## Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast development and build tooling
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Viem** - Lightweight Ethereum library
- **Dynamic.xyz** - Web3 wallet connection
- **React Query** - Server state management
- **React Hook Form** - Form state management
- **Vitest** - Fast unit testing
- **Testing Library** - Component testing utilities

## Quick Start

### Prerequisites

- Node.js >= 20.18.0
- Yarn or npm

### Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Start development server
yarn dev
```

## Environment Variables

Create a `.env` file in the frontend root:

```env
# Backend API URL
VITE_BACKEND_URL=http://localhost:3000

# Dynamic.xyz Environment ID (get from https://app.dynamic.xyz)
VITE_DYNAMIC_ENV_ID=your_dynamic_xyz_env_id
```

### Getting Dynamic.xyz Environment ID

1. Visit [Dynamic.xyz Dashboard](https://app.dynamic.xyz)
2. Create a new project or select existing
3. Copy your Environment ID from the project settings
4. Add it to your `.env` file

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── __tests__/       # components test cases
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   │   ├── helpers.ts
│   │   └── type-guards.ts
│   ├── types/              # TypeScript type definitions
│   │   └── __tests__/       # utilities test cases
│   │   └── index.ts
│   ├── App.tsx             # Main application component
│   ├── main.tsx           # Application entry point
│   └── vite-env.d.ts      # Vite type definitions
├── test/                   # Test files
│   ├── components/
│   ├── hooks/
│   └── utils/
├── .env.example
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Testing

### Run Tests

```bash
# Run all tests
yarn test

# Run specific test file
yarn test MessageSigner.test.tsx
```

## Linting & Formatting

```bash
yarn lint             # Run ESLint
yarn lint:fix         # Fix ESLint issues
yarn format           # Format code with Prettier
```

## Deployment

### Build for Production

```bash
yarn build
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deploy to Netlify

```bash
# Build the project
yarn build

# Deploy dist folder to Netlify
# Or use Netlify CLI: netlify deploy --prod --dir=dist
```

### Environment Variables for Production

Set these in your deployment platform:

- `VITE_BACKEND_URL`: Your production backend URL
- `VITE_DYNAMIC_ENV_ID`: Your Dynamic.xyz environment ID

## Troubleshooting

### Common Issues

**Wallet Connection Failed:**

```bash
# Check if wallet extension is installed
# Ensure wallet is unlocked
# Try refreshing the page
```

**Environment Variables Not Loading:**

```bash
# Ensure .env file exists in frontend root
# Restart development server after changes
# Check variable names start with VITE_
```

**Build Errors:**

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
yarn install

# Check linter issues
yarn lint
```

**Dynamic.xyz Integration Issues:**

```bash
# Verify VITE_DYNAMIC_ENV_ID is correct
# Check Dynamic.xyz dashboard for project settings
# Ensure domain is added to allowed origins
```

## Performance Tips

- **Code Splitting**: Components are lazy-loaded where appropriate
- **Bundle Analysis**: Run `yarn build` and check bundle size
- **Caching**: React Query handles API response caching

## Security Considerations

- Never expose private keys in frontend code
- Always validate user inputs
- Use HTTPS in production
- Implement proper error boundaries
- Sanitize user-generated content

## Additional Resources

- [React Documentation](https://react.dev/)
- [Viem Documentation](https://viem.sh/)
- [Dynamic.xyz Docs](https://docs.dynamic.xyz/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vitest Documentation](https://vitest.dev/)

---

_This frontend connects to the Web3 Message Signer backend API. Make sure the backend is running for full functionality._
