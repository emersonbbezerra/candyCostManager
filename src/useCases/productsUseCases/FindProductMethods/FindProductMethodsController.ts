import { Request, Response, NextFunction } from "express";
import { FindProductMethodsUseCase } from "./FindProductMethodsUseCase";
import { capitalize } from "../../../utils/stringUtils";

export class FindProductMethodsController {
  constructor(private findProductMethodsUseCase: FindProductMethodsUseCase) {}

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const categoryParam = req.query.category as string | undefined;
      const category = categoryParam ? capitalize(categoryParam) : undefined;

      const page = Math.max(1, Number(req.query.page) || 1);
      const perPage = Math.min(
        100,
        Math.max(1, Number(req.query.perPage) || 10)
      );

      const result = await this.findProductMethodsUseCase.findAll({
        category,
        page,
        perPage,
      });

      res.status(200).json({
        data: result.products,
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
      const product = await this.findProductMethodsUseCase.findById(id);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
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
