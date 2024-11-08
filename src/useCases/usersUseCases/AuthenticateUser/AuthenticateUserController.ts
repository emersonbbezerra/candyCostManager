import { Request, Response, NextFunction } from 'express';
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

export class AuthenticateUserController {
  constructor(private authenticateUserUseCase: AuthenticateUserUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Email and password are required' });
    }

    try {
      const result = await this.authenticateUserUseCase.execute(
        email,
        password
      );
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
