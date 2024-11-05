import { NextFunction, Request, Response } from "express";
import { FindUserMethodsUseCase } from "./FindUserMethodsUseCase";

export class FindUserMethodsController {
  constructor(private findUserMethodsUseCase: FindUserMethodsUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params;

    try {
      const user = await this.findUserMethodsUseCase.execute(id);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}
