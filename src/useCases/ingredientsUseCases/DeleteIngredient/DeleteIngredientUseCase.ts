import { IIngredientsRepository } from "../../../repositories/IIngredientsRepository";
import { HttpException } from "../../../types/HttpException";

export class DeleteIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(id: string): Promise<void> {
    const deleted = await this.ingredientsRepository.delete(id);
    if (!deleted) {
      throw new HttpException(404, "Ingredient not found");
    }
  }
}
