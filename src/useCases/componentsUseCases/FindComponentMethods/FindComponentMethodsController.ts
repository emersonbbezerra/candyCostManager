import { NextFunction, Request, Response } from 'express';
import { FindComponentMethodsUseCase } from './FindComponentMethodsUseCase';

export class FindComponentMethodsController {
  constructor(
    private findComponentMethodsUseCase: FindComponentMethodsUseCase
  ) {}

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;
      const category = req.query.category as string;

      const result = await this.findComponentMethodsUseCase.findAll({
        page,
        limit,
        category,
      });
      res.status(200).json({
        components: result.components,
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
      const component = await this.findComponentMethodsUseCase.findById(id);
      res.status(200).json(component);
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
      const components =
        await this.findComponentMethodsUseCase.findByPartialName(
          name as string
        );
      res.status(200).json(components);
    } catch (error) {
      next(error);
    }
  }
}
