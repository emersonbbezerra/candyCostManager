import { ICreateIngredientRequestDTO } from "./CreateIngredientDTO";
import { HttpException } from "../../types/HttpException";
import { IIngredientsRepository } from "../../repositories/IIngredientsRepository";
import { Ingredient } from "../../entities/Ingredient";
import { ingredientSchema } from "../../utils/ingredientUtils";

export class CreateIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(data: ICreateIngredientRequestDTO): Promise<void> {
    try {
      const parsedData = ingredientSchema.parse(data);

      const existingIngredient = await this.ingredientsRepository.findByName(
        parsedData.name
      );

      if (existingIngredient) {
        throw new HttpException(409, "Ingrediente já cadastrado");
      }

      const ingredient = new Ingredient({
        ...parsedData,
        createdAt: parsedData.createdAt?.toISOString(),
        updatedAt: parsedData.updatedAt?.toISOString(),
      });

      await this.ingredientsRepository.save(ingredient);
    } catch (e: any) {
      if (e.errors) {
        throw new HttpException(400, e.errors[0].message);
      }
      throw e;
    }
  }
}
