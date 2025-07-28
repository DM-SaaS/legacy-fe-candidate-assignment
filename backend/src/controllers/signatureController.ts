import { Request, Response } from 'express';
import { verifySignature } from '../utils/signatureUtils';

export const verifySignatureController = async (req: Request, res: Response) => {
  try {
    const { message, signature } = req.body;

    if (!message || !signature) {
      return res.status(400).json({ 
        error: 'Missing required parameters: message and signature are required' 
      });
    }

    const result = await verifySignature(message, signature);

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in signature verification controller:', error);
    return res.status(500).json({ 
      error: 'Server error during signature verification',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 