import express from 'express';
import { verifySignatureController } from '../controllers/signatureController';

const router = express.Router();

router.post('/verify-signature', verifySignatureController);

export default router; 