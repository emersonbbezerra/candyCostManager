import { NextFunction, Request, Response } from 'express';
import { IProductDTO } from '../../../dtos/ProductDTO';
import { UpdateProductUseCase } from './UpdateProductUseCase';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<IProductDTO> = req.body;

      // Conversão das strings para Date
      if (data.createdAt && typeof data.createdAt === 'string') {
        data.createdAt = new Date(data.createdAt);
      }
      if (data.updatedAt && typeof data.updatedAt === 'string') {
        data.updatedAt = new Date(data.updatedAt);
      }

      const product = await this.updateProductUseCase.execute(id, data);
      res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
      next(error);
    }
  }
}
