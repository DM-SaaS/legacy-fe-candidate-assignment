# Web3 Message Signer - Backend

Express.js backend API for Web3 message signature verification and history management.

## Features

- **Signature Verification**: Cryptographic verification of Web3 signatures
- **History Management**: Store and retrieve signing history
- **Security**: Input validation and error handling
- **Fast Performance**: Optimized API endpoints
- **TypeScript**: Full type safety across the application
- **Comprehensive Testing**: Unit and integration tests

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe development
- **Viem** - Ethereum signature verification
- **Cors** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Winston** - logging
- **Joi** - Input validation
- **Mocha** - Testing framework
- **Supertest** - HTTP assertion testing

## Quick Start

### Prerequisites
- Node.js >= 20.18.0
- Yarn

### Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env

# Start development server
yarn dev
```

## 🔐 Environment Variables

Create a `.env` file in the backend root:

```env
# Server Configuration
PORT=3000

# CORS Configuration
FRONTEND_URL=http://localhost:5173
```

## 📂 Project Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   └── messageController.ts
│   ├── middleware/         # Express middleware
│   │   ├── validation.ts
│   │   ├── errorHandler.ts
│   │   ├── cors.ts
│   │   └── rateLimiter.ts
│   ├── routes/            # API route definitions
│   │   └── index.ts
│   ├── services/          # Business logic
│   │   └── signatureService.ts
│   ├── utils/             # Utility functions
│   │   ├── logger.ts
│   │   └── constants.ts
│   ├── types/             # TypeScript definitions
│   │   └── index.ts
│   ├── app.ts             # Express app configuration
│   └── server.ts          # Server entry point
├── test/                  # Test files
├── .env.example
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600
}
```

### Verify Signature Message

```http
POST /verify-signature
```

**Request Body:**
```json
{
  "message": "Hello World",
  "signature": "0x1234567890abcdef...",
  "address": "0x742d35Cc8C6C2C3e4f3B0a8d9A25d2f7A8d7F8B9"
}
```

**Response:**
```json
{
  "isValid": true,
  "address": "0x742d35Cc8C6C2C3e4f3B0a8d9A25d2f7A8d7F8B9",
  "originMessage": "Hello World"
}
```

## Testing

### Run Tests

```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test:watch

# Run specific test suite
yarn test -- --grep "POST /verify-signature"
```

## Deployment

### Production Build

```bash
# Build the application
yarn build

# Start production server
yarn start
```

### Docker Deployment

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN yarn install --production

COPY dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]
```

### Environment Variables for Production

Set these in your deployment platform:

- `NODE_ENV=production`
- `PORT=3000` (or your preferred port)
- `FRONTEND_URL=https://your-frontend-domain.com`

## Monitoring & Logging

### Logging Configuration

```typescript
import winston from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});
```

## Troubleshooting

### Common Issues
**CORS Issues:**
```bash
# Check FRONTEND_URL in .env matches your frontend URL
# Ensure CORS middleware is properly configured
```

**Signature Verification Failures:**
```bash
# Verify the message format matches exactly
# Check that the signature is from the correct address
# Ensure proper encoding (UTF-8)
```

### Database Integration (Future)

```typescript
// Example Prisma schema
model SigningHistory {
  id        String   @id @default(cuid())
  address   String
  message   String
  signature String
  createdAt DateTime @default(now())
  
  @@map("signing_history")
}
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Viem Documentation](https://viem.sh/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Mocha Testing Framework](https://mochajs.org/)

---

*This backend serves the Web3 Message Signer frontend. Ensure proper CORS configuration for cross-origin requests.*