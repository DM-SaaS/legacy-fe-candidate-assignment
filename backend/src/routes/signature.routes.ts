import { Router } from "express";
import { z } from "zod";
import { signatureService } from "../services/signature.service";
import { validateRequest } from "../middleware/validateRequest";

const router = Router();

const verifySignatureSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message is required"),
    signature: z.string().regex(/^0x[a-fA-F0-9]+$/, "Invalid signature format"),
  }),
});

/**
 * @swagger
 * /api/verify-signature:
 *   post:
 *     summary: Verify cryptographic signature
 *     description: Verifies a cryptographic signature and recovers the signer's wallet address
 *     tags: [Signature]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignatureVerificationRequest'
 *           examples:
 *             example1:
 *               summary: Basic signature verification
 *               value:
 *                 message: "Hello, this is a test message"
 *                 signature: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12"
 *     responses:
 *       200:
 *         description: Signature verification result
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SignatureVerificationResponse'
 *             examples:
 *               validSignature:
 *                 summary: Valid signature
 *                 value:
 *                   isValid: true
 *                   signer: "0x742d35Cc6634C0532925a3b8D1234567890abcdef"
 *                   originalMessage: "Hello, this is a test message"
 *                   timestamp: 1703097600000
 *               invalidSignature:
 *                 summary: Invalid signature
 *                 value:
 *                   isValid: false
 *                   signer: ""
 *                   originalMessage: "Hello, this is a test message"
 *                   timestamp: 1703097600000
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       429:
 *         description: Too Many Requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Too many requests"
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
router.post(
  "/verify-signature",
  validateRequest(verifySignatureSchema),
  async (req, res, next) => {
    try {
      const result = await signatureService.verifySignature(req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
