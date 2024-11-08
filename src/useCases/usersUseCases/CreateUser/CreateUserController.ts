import { NextFunction, Request, Response } from 'express';
import { IUserDTO } from '../../../dtos/UserDTO';
import { capitalize, normalizeSpaces } from '../../../utils/stringUtils';
import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  constructor(private createUserUseCase: CreateUserUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData: IUserDTO = {
        ...req.body,
        name: capitalize(normalizeSpaces(req.body.name)),
      };

      await this.createUserUseCase.execute(userData);

      const user = {
        name: userData.name,
        email: userData.email,
      };
      res.status(201).json({ message: 'User created successfully', user });
    } catch (error) {
      next(error);
    }
  }
}
