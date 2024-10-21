import { Ingredient } from "../../entities/Ingredient";
import { IngredientMongoose } from "../../infra/database/schemas/ingredientSchema";
import { IIngredientsRepository } from "../IIngredientsRepository";

export class MongoIngredientsRepository implements IIngredientsRepository {
  async findbyname(name: string): Promise<Ingredient> {
    const ingredient = await IngredientMongoose.findOne({ name });
    return ingredient;
  }

  async save(ingredient: Ingredient): Promise<void> {
    const mongooseIngredient = new IngredientMongoose(ingredient);
    await mongooseIngredient.save();
  }
}
