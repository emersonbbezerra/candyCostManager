import { Ingredient } from "../../entities/Ingredient";
import { IngredientMongoose } from "../../infra/database/schemas/ingredientSchema";
import { IIngredientsRepository } from "../IIngredientsRepository";

export class MongoIngredientsRepository implements IIngredientsRepository {
  async findbyname(name: string): Promise<Ingredient | null> {
    const ingredientDoc = await IngredientMongoose.findOne({ name })
      .lean()
      .exec();
    if (ingredientDoc) {
      const ingredient = new Ingredient(
        {
          name: ingredientDoc.name!,
          manufacturer: ingredientDoc.manufacturer!,
          price: ingredientDoc.price!,
          unitOfMeasure: ingredientDoc.unitOfMeasure!,
          category: ingredientDoc.category!,
          createdAt: ingredientDoc.createdAt?.toISOString(),
          updatedAt: ingredientDoc.updatedAt?.toISOString(),
        },
        ingredientDoc._id.toString()
      );
      return ingredient;
    }
    return null;
  }

  async save(ingredient: Ingredient): Promise<void> {
    const mongooseIngredient = new IngredientMongoose(ingredient);
    await mongooseIngredient.save();
  }
}
