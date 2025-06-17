import express, { Request, Response } from "express";
import { verifySignature } from "../utils/verify";
import { logger } from "../utils/logger";
import Joi from "joi";

const router = express.Router();

export const signatureSchema = Joi.object({
  message: Joi.string().required(),
  signature: Joi.string()
    .required()
    .pattern(/^0x[a-fA-F0-9]{130}$/, "valid signature"),
});

//@ts-ignore
router.post("/verify-signature", async (req: Request, res: Response) => {
  const { error, value } = signatureSchema.validate(req.body);

  if (error) {
    logger.error("Signature verification failed:", error.details);
    return res.status(422).json({
      isValid: false,
      signer: null,
      originalMessage: value?.message || null,
      message: "Invalid input",
      details: error.details,
    });
  }

  try {
    const result = await verifySignature(value.message, value.signature);
    logger.info("Signature verification result:", result);
    res.json(result);
  } catch (err) {
    logger.error("Error during signature verification:", err);
    res.status(500).json({
      isValid: false,
      signer: null,
      originalMessage: value.message,
      message: "Internal server error during signature verification",
    });
  }
});

export default router;
