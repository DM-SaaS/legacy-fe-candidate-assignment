import express from 'express';
import {
  verifySignatureController,
  getSignaturesBasedOnUsers,
} from '../controllers';
import { validateRequestBody } from '../middleware';
import jwtGuard from '../guard/jwtGuard';

const router = express.Router();
router.post(
  '/',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  jwtGuard,
  validateRequestBody,
  verifySignatureController,
);

router.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  jwtGuard,
  getSignaturesBasedOnUsers,
);

export default router;
