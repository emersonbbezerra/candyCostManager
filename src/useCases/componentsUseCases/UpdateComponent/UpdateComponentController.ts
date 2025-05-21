import { NextFunction, Request, Response } from 'express';
import { Component } from '../../../entities/Component';
import { UpdateComponentUseCase } from './UpdateComponentUseCase';

export class UpdateComponentController {
  constructor(private updateComponentUseCase: UpdateComponentUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<Component> = req.body;
      const component = await this.updateComponentUseCase.execute(id, data);
      res.status(200).json({ message: 'Component updated', component });
    } catch (error) {
      next(error);
    }
  }
}
