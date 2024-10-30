import { Ingredient } from "../entities/Ingredient";

export interface IIngredientsRepository {
  findByName(name: string): Promise<Ingredient | null>;
  findByPartialName(name: string): Promise<Ingredient[]>;
  save(ingredient: Ingredient): Promise<void>;
  findById(id: string): Promise<Ingredient | null>;
  findAll(): Promise<Ingredient[]>;
  update(
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient | null>;
  delete(id: string): Promise<boolean>;
}
