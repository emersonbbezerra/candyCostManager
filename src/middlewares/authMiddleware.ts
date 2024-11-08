import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        status: 401,
        message: 'Token not provided',
      });
      return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
      res.status(401).json({
        status: 401,
        message: 'Token error',
      });
      return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
      res.status(401).json({
        status: 401,
        message: 'Token malformatted',
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    req.userId = (decoded as any).id;
    next();
  } catch (error) {
    next(error);
  }
};
