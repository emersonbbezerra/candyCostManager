import { Request, Response, NextFunction } from 'express';
import { CreateProductUseCase } from './CreateProductUseCase';
import { IProductDTO } from '../../../dtos/ProductDTO';

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: IProductDTO = req.body;
      await this.createProductUseCase.execute(data);
      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      next(error);
    }
  }
}
