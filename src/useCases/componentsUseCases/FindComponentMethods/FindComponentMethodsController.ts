import { Request, Response, NextFunction } from "express";
import { FindComponentMethodsUseCase } from "./FindComponentMethodsUseCase";

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
      const components = await this.findComponentMethodsUseCase.findAll();
      res.status(200).json(components);
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
