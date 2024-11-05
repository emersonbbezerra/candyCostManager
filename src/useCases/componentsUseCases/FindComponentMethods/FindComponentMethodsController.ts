import { Request, Response, NextFunction } from "express";
import { FindComponentMethodsUseCase } from "./FindComponentMethodsUseCase";
import { capitalize } from "../../../utils/stringUtils";

export class FindComponentMethodsController {
  constructor(
    private findComponentMethodsUseCase: FindComponentMethodsUseCase
  ) {}

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categoryParam = req.query.category as string | undefined;
      const category = categoryParam ? capitalize(categoryParam) : undefined;
      const page = Number(req.query.page) || 1;
      const perPage = Number(req.query.perPage) || 10;

      const result = await this.findComponentMethodsUseCase.findAll({
        category,
        page,
        perPage,
      });
      res.status(200).json({
        data: result.components,
        pagination: {
          total: result.total,
          page,
          perPage,
          totalPages: Math.ceil(result.total / perPage),
          hasNext: page * perPage < result.total,
          hasPrev: page > 1,
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
