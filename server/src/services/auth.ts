// import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv';
dotenv.config();

// interface JwtPayload {
//   _id: unknown;
//   username: string;
//   email: string,
// }

// DEPRECATED REST API AUTHENTICATION
// export const authenticateToken1 = (req: Request, res: Response, next: NextFunction) => {
//   const authHeader = req.headers.authorization;

//   if (authHeader) {
//     const token = authHeader.split(' ')[1];

//     const secretKey = process.env.JWT_SECRET_KEY || '';

//     jwt.verify(token, secretKey, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Forbidden
//       }

//       req.user = user as JwtPayload;
//       return next();
//     });
//   } else {
//     res.sendStatus(401); // Unauthorized
//   }
// };

// export const authenticateToken = (username: string, _email: string, _id: string) => {
//   const token = username;

//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   return jwt.verify(token, secretKey, (err, user) => {
//     if (err) {
//       console.error('<.><.><.><.><.><.><.> Error verifying token:', err);
//       throw new Error('Invalid token 🍥');
//     }

//     return user as JwtPayload;
//   });
// };

export const signToken = (username: string, email: string, _id: unknown) => {
  console.info('Attempting to create token for: ', { username, email, _id });

  const payload = { username, email, _id };
  const secretKey = process.env.JWT_SECRET_KEY;

  console.info('Environment variables loaded:', { 
    JWT_SECRET_EXISTS: !!secretKey,
    JWT_SECRET_LENGTH: secretKey ? secretKey.length : 0
  });

  if (!secretKey) {
    console.error('JWT_SECRET_KEY is missing or empty!');
    throw new Error('Server configuration error');
  }

  try {
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    console.log('Token created successfully, first 8 chars:', token.substring(0, 8) + '...');
    return token;
  } catch (err) {
    console.error('Failed to create token:', err);
    throw new Error('Token generation failed');
  }
};
