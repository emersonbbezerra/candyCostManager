import { Request, Response } from "express";
import { DeleteIngredientUseCase } from "./DeleteIngredientUseCase";
import { HttpException } from "../../types/HttpException";

export class DeleteIngredientController {
  constructor(private deleteIngredientUseCase: DeleteIngredientUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    try {
      await this.deleteIngredientUseCase.execute(id);
      return response.status(200).send({ message: "Ingredient deleted" });
    } catch (error: any) {
      if (error instanceof HttpException) {
        return response.status(error.status).send({ message: error.message });
      }
      if (error.errors) {
        return response.status(400).send({ message: error.errors[0].message });
      }
      console.error(error);
      return response.status(500).send({ message: "Unexpected error" });
    }
  }
}
