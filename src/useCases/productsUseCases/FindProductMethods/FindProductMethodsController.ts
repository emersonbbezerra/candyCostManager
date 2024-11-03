import { Request, Response, NextFunction } from "express";
import { FindProductMethodsUseCase } from "./FindProductMethodsUseCase";

export class FindProductMethodsController {
  constructor(private findProductMethodsUseCase: FindProductMethodsUseCase) {}

  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const products = await this.findProductMethodsUseCase.findAll();
      res.status(200).json(products);
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
