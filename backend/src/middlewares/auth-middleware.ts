// chekc user is logged in or not
// check is he owner or not
//   ACCESS_TOKEN_SECRET

import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import jwt, { JwtPayload } from 'jsonwebtoken';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET;

interface User extends JwtPayload {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cookie = req.cookies;

    if (cookie) {
      const token = cookie.token;
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Unauthorized. Please log in to continue.',
        });
      }
      const decodedToken = (await jwt.verify(token, JWT_TOKEN_SECRET!)) as
        | JwtPayload
        | string;
      if (
        typeof decodedToken === 'string' ||
        !decodedToken.id ||
        !decodedToken
      ) {
        return res.status(400).json({
          success: false,
          message: 'Unauthorized. Please log in to continue.',
        });
      }

      (req as AuthenticatedRequest).user = decodedToken as User;
      next();
    }
  } catch {
    return res.status(400).json({
      success: false,
      message: 'Unauthorized. Please log in to continue.',
    });
  }
}
