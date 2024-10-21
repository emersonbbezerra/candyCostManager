import { Request, Response } from "express";
import { CreateIngredientUseCase } from "./CreateIngredientUseCase";
import { ICreateIngredientRequestDTO } from "./CreateIngredientDTO";
import { HttpException } from "../../types/HttpException";

export class CreateIngredientController {
  constructor(private createIngredietUseCase: CreateIngredientUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const data: ICreateIngredientRequestDTO = request.body;

    try {
      await this.createIngredietUseCase.execute(data);
      return response.status(201).send("Ingredient created");
    } catch (error: any) {
      throw new HttpException(400, "Unexpected error");
    }
  }
}
