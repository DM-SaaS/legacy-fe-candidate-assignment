import { Router } from 'express';
import { body } from 'express-validator';
import { SignatureController } from '../controllers/signatureController';
import { validateRequest } from '../middleware/validation';

const router = Router();

// POST /api/verify-signature
router.post(
  '/verify-signature',
  [
    body('message')
      .notEmpty()
      .withMessage('Message is required')
      .isString()
      .withMessage('Message must be a string')
      .isLength({ min: 1, max: 10000 })
      .withMessage('Message must be between 1 and 10000 characters'),
    body('signature')
      .notEmpty()
      .withMessage('Signature is required')
      .isString()
      .withMessage('Signature must be a string')
      .matches(/^0x[a-fA-F0-9]+$/)
      .withMessage('Signature must be a valid hex string starting with 0x'),
  ],
  validateRequest,
  SignatureController.verifySignature
);

export default router;
