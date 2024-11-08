import { NextFunction, Request, Response } from 'express';
import { FindProductMethodsUseCase } from './FindProductMethodsUseCase';

export class FindProductMethodsController {
  constructor(private findProductMethodsUseCase: FindProductMethodsUseCase) {}

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;

      const result = await this.findProductMethodsUseCase.findAll({
        page,
        limit,
        category,
      });

      return res.status(200).json({
        products: result.products,
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async findById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const product = await this.findProductMethodsUseCase.findById(id);
      if (!product) {
        res.status(404).json({ message: 'Product not found' });
      }
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }

  async findByPartialName(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.query;
      const products = await this.findProductMethodsUseCase.findByPartialName(
        name as string
      );
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }
}
