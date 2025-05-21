import { NextFunction, Request, Response } from 'express';
import { IComponentDTO } from '../../../dtos/ComponentDTO';
import { CreateComponentUseCase } from './CreateComponentUseCase';

export class CreateComponentController {
  constructor(private createComponentUseCase: CreateComponentUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IComponentDTO = req.body;
      await this.createComponentUseCase.execute(data);
      res.status(201).json({ message: 'Component created' });
    } catch (error) {
      next(error);
    }
  }
}
