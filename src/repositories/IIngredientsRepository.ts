import { Ingredient } from "../entities/Ingredient";

export interface IIngredientsRepository {
  findByName(name: string): Promise<Ingredient | null>;
  save(ingredient: Ingredient): Promise<void>;
  findById(id: string): Promise<Ingredient | null>;
  findAll(): Promise<Ingredient[]>;
  update(
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient | null>;
  delete(id: string): Promise<boolean>;
}
