# evmMessageVerifier

## Overview

evmMessageVerifier is a Node.js backend service that provides a RESTful API for verifying Ethereum EVM signatures. It leverages Express.js and ethers.js to recover the signer address from a signed message and validate the authenticity of the signature.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation

1. Clone the repository or download the source code.
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Server

Start the backend server with:
```bash
npm start
```
By default, the server listens on port `3000`. You can override this by setting the `PORT` environment variable.

## API Reference

### POST `/verify-signature`

Verifies an Ethereum signature and recovers the signer address.

#### Request
- **Method:** POST
- **Content-Type:** application/json
- **Body:**
  ```json
  {
    "message": "string",
    "signature": "string"
  }
  ```

#### Response
- **Content-Type:** application/json
- **Body:**
  ```json
  {
    "isValid": true,
    "signer": "0xabc123...",
    "originalMessage": "..."
  }
  ```
  - `isValid`: Indicates if the signature is valid.
  - `signer`: The Ethereum address that signed the message (null if invalid).
  - `originalMessage`: The original message that was verified.

#### Example
```bash
curl -X POST http://localhost:3000/verify-signature \
  -H "Content-Type: application/json" \
  -d '{"message":"hello","signature":"0x..."}'
```

## CORS Policy

CORS is enabled for all origins by default, allowing cross-origin requests from any frontend application.

## License

MIT