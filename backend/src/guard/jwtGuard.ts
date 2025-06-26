import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { CustomRequest } from '../dtos';

const YOUR_DYNAMIC_ENV_ID = 'your-environment-id';
const jwksUrl = `https://app.dynamic.xyz/api/v0/sdk/8ec25553-dc1b-4e26-9d77-0b2d976428fa/.well-known/jwks`;

const client = new JwksClient({
  jwksUri: jwksUrl,
  rateLimit: true,
  cache: true,
  cacheMaxEntries: 5, // Maximum number of cached keys
  cacheMaxAge: 600000, // Cache duration in milliseconds (10 minutes)
});

const jwtGuard = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({
          error: 'Unauthorized: Missing or invalid Authorization header',
        });
    }

    const encodedJwt = authHeader.split(' ')[1];
    const signingKey = await client.getSigningKey();
    const publicKey = signingKey.getPublicKey();

    const decodedToken: JwtPayload = jwt.verify(encodedJwt, publicKey, {
      ignoreExpiration: false,
    }) as JwtPayload;

    if (decodedToken.scopes?.includes('requiresAdditionalAuth')) {
      throw new Error('Additional verification required');
    }

    // Attach decoded token to the request object for further use

    req.email = decodedToken.email || '';


    next();
  } catch (error) {
    res
      .status(401)
      .json({
        error:
          'Unauthorized: ' +
          (error instanceof Error ? error.message : 'Invalid token'),
      });
  }
};

export default jwtGuard;
