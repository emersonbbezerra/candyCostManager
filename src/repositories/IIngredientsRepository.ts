import { Ingredient } from "../entities/Ingredient";

export interface IIngredientsRepository {
  findbyname(name: string): Promise<Ingredient | null>;
  save(ingredient: Ingredient): Promise<void>;
}
