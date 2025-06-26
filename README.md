# Take-Home Task: **Web3 Message Signer & Verifier**
React + Dynamic.xyz Headless Implementation (Frontend) | Node.js + Express (Backend)

## 🎯 Objective
Build a full-stack Web3 app that allows a user to:
1. Authenticate using a **Dynamic.xyz embedded wallet headless implementation https://docs.dynamic.xyz/headless/headless-email**
2. Enter and **sign a custom message** of the user's choosing
3. Send the signed message to a **Node.js + Express** backend
4. Backend verifies the signature and responds with validity + address

## 🔧 Requirements

### 🧩 Frontend (React 18+)
* Integrate Dynamic.xyz Embedded Wallet
* After authentication:
   * Show connected wallet address
   * Provide a form to input a custom message
   * Let user sign the message
   * Submit `{ message, signature }` to backend
* Show result from backend:
   * Whether the signature is valid
   * Which wallet signed it
* Allow signing multiple messages (show a local history)

**Note:** How you structure the React app is up to you — but the app complexity is high enough that good React patterns will shine through.

### 🌐 Backend (Node.js + Express – required)
* Create a REST API endpoint: `POST /verify-signature`
* Accept:
```json
{ "message": "string", "signature": "string" }
```
* Use `ethers.js` (or `viem`) to:
   * Recover the signer from the signature
   * Validate the signature
* Return:
```json
{ "isValid": true, "signer": "0xabc123...", "originalMessage": "..." }
```

## Behavior & Constraints
* Session state can be in-memory (no DB required)
* Message signing history should persist across React component state or localStorage
* No third-party signature validation services — use raw `ethers.js`, `viem` or similar in backend

## 🖥️ Frontend

### Instructions
1. Use **Node.js version 23**.
2. Run the following command to install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Build the project:
   ```bash
   npm run build
   ```
4. Start the project:
   ```bash
   npm start
   ```

### Structure
- **Components**: Reusable UI components like `Button`, `SignMessageItem`, and `SignedMessageList`.
- **Hooks**: Custom hooks for API interactions (`useVerifySignature`, `useGetVerifySignature`).
- **Services**: Axios configuration and API service layer.
- **Utilities**: Helper functions like `showToast` for notifications.
- **Context**: Authentication state management using `AuthContext`.

### Code Quality
- TypeScript for type safety.
- ESLint and Prettier for consistent code formatting.
- Tailwind CSS for styling.
- TanStack Query for efficient data fetching and caching.

### Architecture
- Modular and scalable design.
- Separation of concerns between components, hooks, and services.
- Environment variable management using `.env`.

## 🌐 Backend

### Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the project:
   ```bash
   npm run start
   ```

### Structure
- **Routes**: API endpoints like `/verify-signature`.
- **Controllers**: Business logic for handling requests.
- **Services**: Utility functions like `verifySignatureService`.
- **Middleware**: Request validation and JWT guard.
- **Tests**: E2E tests for API endpoints.

### Technologies Used
- **Node.js**: Backend runtime.
- **Express**: Web framework.
- **Ethers.js**: Signature verification.
- **Jest**: Testing framework.
- **Dotenv**: Environment variable management.
- **Helmet**: Security middleware.
- **Cors**: Cross-origin resource sharing.

## 🚀 Deployments

### Frontend
- Hosted on **Vercel**.
- Ensure `.env` is configured with the correct API URL.

### Backend
- Hosted on **Heroku** or similar platform.
- Ensure `.env` is configured with the correct secrets and database credentials.

Let me know if you need further adjustments or additional details!
