import { ICreateIngredientRequestDTO } from "./CreateIngredientDTO";
import { HttpException } from "../../types/HttpException";
import { IIngredientsRepository } from "../../repositories/IIngredientsRepository";
import { Ingredient } from "../../entities/Ingredient";

export class CreateIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(data: ICreateIngredientRequestDTO) {
    const ingredientAlreadyExists = await this.ingredientsRepository.findbyname(
      data.name
    );

    if (ingredientAlreadyExists) {
      throw new HttpException(409, "Ingredient already exists");
    }

    const ingredient = new Ingredient(data);

    await this.ingredientsRepository.save(ingredient);
  }
}
