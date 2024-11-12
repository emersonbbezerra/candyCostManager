import { NextFunction, Request, Response } from 'express';
import { ValidateTokenUseCase } from './ValidateTokenUseCase';

export class ValidateTokenController {
  constructor(private validateTokenUseCase: ValidateTokenUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Token is missing' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const result = await this.validateTokenUseCase.execute(token);
      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
