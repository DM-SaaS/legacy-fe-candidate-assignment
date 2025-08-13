# Web3 Message Verifier Backend

A Node.js + Express API for verifying Ethereum message signatures using ethers.js.

## 🚀 Features

- **Signature Verification**: Verify Ethereum message signatures and recover signer addresses
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions
- **Security**: Rate limiting, CORS, security headers via Helmet
- **Validation**: Comprehensive input validation and error handling
- **Testing**: 100% test coverage with unit, integration, and e2e tests
- **Production Ready**: Structured codebase following Node.js best practices

## 📋 API Endpoints

### Health Check
```
GET /api/health
```
Returns server health status and version information.

### Verify Signature
```
POST /api/verify-signature
```

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
  "isValid": boolean,
  "signer": "string | null", 
  "originalMessage": "string"
}
```

**Example:**
```bash
curl -X POST http://localhost:3001/api/verify-signature \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hello World",
    "signature": "0x1234567890abcdef..."
  }'
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   FRONTEND_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Development server:**
   ```bash
   npm run dev
   ```
   
   Server will start at `http://localhost:3001`

5. **Production build:**
   ```bash
   npm run build
   npm start
   ```

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Generate coverage report:
```bash
npm run test:coverage
```

### Test categories:
- **Unit Tests**: Test individual functions and utilities
- **Controller Tests**: Test API endpoints with mocked dependencies  
- **Integration Tests**: Test complete API flows
- **E2E Tests**: Test with real Ethereum signatures

## 📁 Project Structure

```
backend/
├── src/
│   ├── controllers/          # API route handlers
│   │   └── signatureController.ts
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── routes/              # API route definitions
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/               # Utility functions
│   │   └── signatureVerifier.ts
│   ├── __tests__/           # Test files
│   │   ├── controllers/
│   │   ├── integration/
│   │   ├── e2e/
│   │   └── utils/
│   └── server.ts            # Express app setup
├── dist/                    # Compiled JavaScript (after build)
├── coverage/                # Test coverage reports
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for common vulnerabilities
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data

## 🎯 Implementation Details

### Signature Verification Process

1. **Validation**: Check message and signature format
2. **Recovery**: Use `ethers.verifyMessage()` to recover signer address
3. **Response**: Return validation result with signer address

### Error Handling

The API provides consistent error responses:

```json
{
  "error": "Error Type",
  "message": "Human readable description", 
  "statusCode": 400
}
```

### Request Validation

- Message: Must be non-empty string
- Signature: Must be valid hex string with 0x prefix (132 characters total)
- Content-Type: Must be `application/json`

## 🚀 Production Deployment

### Environment Variables
```env
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker (Optional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist/ ./dist/
EXPOSE 3001
CMD ["npm", "start"]
```

### Health Check Endpoint
Use `/api/health` for load balancer health checks and monitoring.

## 🧪 Testing with Real Signatures

The test suite includes real signature verification:

```javascript
// Example from e2e tests
const wallet = ethers.Wallet.createRandom();
const message = "Hello World";
const signature = await wallet.signMessage(message);

// This will verify successfully
const response = await api.post('/verify-signature', {
  message,
  signature
});
```

## 📈 Performance Considerations

- **In-Memory**: No database required, stateless design
- **Rate Limiting**: Prevents abuse while allowing normal usage
- **Error Caching**: Failed signatures fail fast without heavy computation
- **Input Validation**: Early validation prevents unnecessary processing

## 🔧 Development

### Code Quality
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix auto-fixable linting errors
```

### File Watching
```bash
npm run dev           # Auto-restart on file changes
```

## 📝 API Usage Examples

### Valid Signature Verification
```bash
curl -X POST http://localhost:3001/api/verify-signature \
  -H "Content-Type: application/json" \
  -d '{
    "message": "I agree to the terms",
    "signature": "0x..."
  }'

# Response:
# {
#   "isValid": true,
#   "signer": "0x742d35cc6bb3c0532925a3b8d8cf6e8e1d47e5c1",
#   "originalMessage": "I agree to the terms"
# }
```

### Invalid Signature
```bash
curl -X POST http://localhost:3001/api/verify-signature \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Different message",
    "signature": "0x..."
  }'

# Response:
# {
#   "isValid": false,
#   "signer": null,
#   "originalMessage": "Different message"
# }
```

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain 100% test coverage
3. Use conventional commit messages
4. Update documentation for API changes

## 📄 License

MIT License - see LICENSE file for details.