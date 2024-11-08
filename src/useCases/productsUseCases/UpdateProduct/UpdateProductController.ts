import { Request, Response, NextFunction } from 'express';
import { UpdateProductUseCase } from './UpdateProductUseCase';
import { IProductDTO } from '../../../dtos/ProductDTO';

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async handle(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data: Partial<IProductDTO> = req.body;

      const product = await this.updateProductUseCase.execute(id, data);
      res.status(200).json({ message: 'Product updated', product });
    } catch (error) {
      next(error);
    }
  }
}
