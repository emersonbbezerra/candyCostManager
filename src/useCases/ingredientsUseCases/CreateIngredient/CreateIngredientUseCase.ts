import { IIngredientDTO } from "../../../dtos/IngredientDTO";
import { HttpException } from "../../../types/HttpException";
import { IIngredientsRepository } from "../../../repositories/IIngredientsRepository";
import { Ingredient } from "../../../entities/Ingredient";
import { ingredientSchema } from "../../../utils/ingredientUtils";

export class CreateIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(data: IIngredientDTO): Promise<void> {
    const parsedData = ingredientSchema.parse(data);

    const existingIngredient =
      await this.ingredientsRepository.findByNameAndManufacturer(
        parsedData.name,
        parsedData.manufacturer
      );
    if (existingIngredient) {
      throw new HttpException(
        409,
        "Ingredient with this name and manufacturer already exists"
      );
    }

    const ingredient = new Ingredient({
      ...parsedData,
      createdAt: parsedData.createdAt?.toISOString(),
      updatedAt: parsedData.updatedAt?.toISOString(),
      packageQuantity: parsedData.packageQuantity,
    });

    await this.ingredientsRepository.save(ingredient);
  }
}
