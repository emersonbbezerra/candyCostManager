import { IIngredientsRepository } from "../../repositories/IIngredientsRepository";
import { Ingredient } from "../../entities/Ingredient";
import { HttpException } from "../../types/HttpException";

export class FindMethodsUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async findAll(): Promise<Ingredient[]> {
    return this.ingredientsRepository.findAll();
  }

  async findById(id: string): Promise<Ingredient | null> {
    const result = await this.ingredientsRepository.findById(id);
    if (!result) {
      throw new HttpException(404, "Ingredient not found");
    }
    return result;
  }
}
