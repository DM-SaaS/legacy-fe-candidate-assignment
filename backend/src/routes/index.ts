import { Router } from 'express';
import { SignatureController } from '../controllers/signatureController';
import { validateJsonBody, validateContentType } from '../middleware/validation';

const router = Router();

// Health check endpoint
router.get('/health', SignatureController.healthCheck);

// Signature verification endpoint
router.post(
  '/verify-signature',
  validateContentType,
  validateJsonBody,
  SignatureController.verifySignature
);

export default router;