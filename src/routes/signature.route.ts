import Router from 'express';
import { SignatureController } from '../controllers/signature.controller';

const router = Router();
const signatureController = new SignatureController();

router.post('/', signatureController.verifySignature.bind(signatureController));

export default router;
