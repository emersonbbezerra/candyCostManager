import { Request, Response, NextFunction } from 'express';
import { DeleteComponentUseCase } from './DeleteComponentUseCase';

export class DeleteComponentController {
  constructor(private deleteComponentUseCase: DeleteComponentUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteComponentUseCase.execute(id);
      res.status(200).json({ message: 'Component deleted' });
    } catch (error) {
      next(error);
    }
  }
}
