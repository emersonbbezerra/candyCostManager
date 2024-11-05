import { NextFunction, Request, Response } from "express";
import { UpdateUserUseCase } from "./UpdateUserUseCase";

export class UpdateUserController {
  constructor(private updateUserUseCase: UpdateUserUseCase) {}

  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const { id } = req.params;
    const data = req.body;

    try {
      const updatedUser = await this.updateUserUseCase.execute(id, data);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}
