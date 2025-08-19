import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth-middleware';

export async function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req?.user;

    if (user && user.role.toLowerCase() === 'admin') {
      return next();
    } else {
      return res.status(403).json({
        success: false,
        message:
          'Forbidden. You do not have permission to access this resource.',
      });
    }
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
}
