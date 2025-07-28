## 🔧 Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:
   ```
   PORT=3001
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The backend API will be available at `http://localhost:3001`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_API_URL=http://localhost:3001/api
   VITE_DYNAMIC_ENVIRONMENT_ID=YOUR_DYNAMIC_ENVIRONMENT_ID
   ```

   Note: You'll need to replace `YOUR_DYNAMIC_ENVIRONMENT_ID` with your actual Dynamic.xyz environment ID.

4. Start the development server:
   ```
   npm run dev
   ```

The frontend will be available at `http://localhost:5173`.

After ruunig, UI will open you have click on connect with wallet and have to signIn with wallet. 

## 🧪 Running Tests

### Backend Tests

```
cd backend
npm test
```

### Frontend Tests

```
cd frontend
npm test

```
5. Live Link:

##   https://web3-ugl4.vercel.app/


## 📝 Trade-offs and Future Improvements

- **Local State**: Currently using React Context and localStorage for state management. For a production application, consider using a more robust state management solution.
- **Error Handling**: Basic error handling is implemented. Could be expanded with more comprehensive error states and user feedback.
- **Multi-Factor Authentication**: The Dynamic.xyz headless MFA implementation could be added for enhanced security.
- **Session Management**: Currently using in-memory session. For production, consider implementing a more persistent solution.
- **UI/UX Enhancements**: The current UI is functional but could benefit from animations and more interactive elements.

## 🔐 Security Considerations

- All signature verification happens on the server side
- No sensitive data is stored in localStorage
- Dynamic.xyz provides secure wallet authentication 

