# Vite + React-TS WEB3 MESSAGE SIGNER AND VERIFIER 🔐

- Connect using Dynamic.xyz embedded wallets (via email OTP)
- Sign custom messages using their wallet
- Verify the signature on a Node.js + Express backend via ethers.js

## Features

- Email-based Wallet Authentication : Users can sign in using their email address via Dynamic.xyz, receive a One-Time Password (OTP), and instantly create an embedded wallet with no browser extension required.

- Message Signing via Wallet : After authentication, users can enter a custom message and securely sign it using their Dynamic-connected wallet powered by primaryWallet.signMessage().

- Server-side Signature Verification : The signed message is sent to a backend API built with Express + ethers.js, which verifies the signature and returns the signer address and validity.

- Live Signature Result Feedback : Upon signing, users immediately see whether the signature is valid and which wallet address it was signed by, enhancing trust and clarity.

- Modern Responsive UI : Built with Tailwind CSS and React, the app adapts smoothly to mobile and desktop screen sizes for a consistent user experience.

## Install Dependecies

```
pnpm install
```

## Start the dev server

```
pnpm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

- /components: Contains reusable React components, including the main authentication and signing interfaces:
  - ConnectWithEmailView – Handles email-based wallet connection and OTP verification.
  - MessageSigner – Allows users to sign custom messages and view verification results.

- /lib: Stores environment-based configuration, such as backend API endpoint constants for centralized access.
- /utils: Includes utility functions used across the app, such as the API call to verify signed messages with the backend.

## Libraries and Tools

- React: A JavaScript library for building user interfaces, used here for component-based development.
- TypeScript: Provides static typing, improving code quality, refactoring, and overall maintainability.
- Vite: A fast, modern build tool for web projects, offering lightning-fast hot module replacement (HMR).

## Development Environment

- Node.js: Version 20.17.0 is required to install dependencies and run the project.
- Vite: Provides a fast development environment and optimized build process.
- ESLint: Linting tool for maintaining code consistency and avoiding bugs.
- Operating System: The app has been developed and tested on Ubuntu 23, but it should work on other OSes as well.
