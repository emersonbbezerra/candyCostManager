import { Request, Response, NextFunction } from 'express';
import { CreateComponentUseCase } from './CreateComponentUseCase';
import { IComponentDTO } from '../../../dtos/ComponentDTO';

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
