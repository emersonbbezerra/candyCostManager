import { IIngredientsRepository } from "../../repositories/IIngredientsRepository";
import { Ingredient } from "../../entities/Ingredient";
import { HttpException } from "../../types/HttpException";
import { ingredientSchema } from "../../utils/ingredientUtils";

export class UpdateIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(
    id: string,
    data: Partial<Ingredient>
  ): Promise<Ingredient | null> {
    const parsedData = ingredientSchema.partial().parse(data);

    const updatedData = {
      ...parsedData,
      createdAt: parsedData.createdAt?.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedIngredient = await this.ingredientsRepository.update(
      id,
      updatedData
    );

    if (!updatedIngredient) {
      throw new HttpException(404, "Ingredient not found");
    }
    return updatedIngredient;
  }
}
