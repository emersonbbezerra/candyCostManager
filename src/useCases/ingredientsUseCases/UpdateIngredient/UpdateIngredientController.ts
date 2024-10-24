import { Request, Response } from "express";
import { UpdateIngredientUseCase } from "./UpdateIngredientUseCase";
import { Ingredient } from "../../../entities/Ingredient";
import { HttpException } from "../../../types/HttpException";

export class UpdateIngredientController {
  constructor(private updateIngredientUseCase: UpdateIngredientUseCase) {}

  async handle(request: Request, response: Response): Promise<Response | null> {
    const { id } = request.params;
    const data: Partial<Ingredient> = request.body;

    try {
      const ingredient = await this.updateIngredientUseCase.execute(id, data);
      return response
        .status(200)
        .json({ message: "Ingredient updated", ingredient });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      } else if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      return response.status(500).send({ message: "Unexpected error" });
    }
  }
}
