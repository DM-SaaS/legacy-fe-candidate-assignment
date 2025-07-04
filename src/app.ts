import express from 'express';
import cors from 'cors';
import signatureRoutes from './routes/signature.route';

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get('/', (_req, res) => {
  res.send('✅ Web3 Signature Verification API is running');
});

// Signature verification route
app.use('/verify-signature', signatureRoutes);

export default app;
