# Web3 Message Verifier Backend

Node.js + Express backend for verifying Ethereum signatures.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Development

```bash
# Run in development mode with hot reload
npm run dev

# The server will start on http://localhost:3001
```

### Production

```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📝 API Documentation

### POST /api/verify-signature

Verifies an Ethereum signature.

**Request Body:**
```json
{
  "message": "string",
  "signature": "string"
}
```

**Response:**
```json
{
  "isValid": true,
  "signer": "0xabc123...",
  "originalMessage": "...",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```
