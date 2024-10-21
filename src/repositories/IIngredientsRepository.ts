import { Ingredient } from "../entities/Ingredient";

export interface IIngredientsRepository {
  findbyname(name: string): Promise<Ingredient>;
  save(ingredient: Ingredient): Promise<void>;
}
