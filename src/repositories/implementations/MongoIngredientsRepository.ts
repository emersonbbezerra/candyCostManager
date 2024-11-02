import { Ingredient } from "../../entities/Ingredient";
import { IngredientMongoose } from "../../infra/database/schemas/ingredientSchema";
import { IIngredientsRepository } from "../IIngredientsRepository";
import { convertToIngredient } from "../../utils/ingredientUtils";

export class MongoIngredientsRepository implements IIngredientsRepository {
  async findByNameAndManufacturer(
    name: string,
    manufacturer: string
  ): Promise<Ingredient | null> {
    const ingredientDoc = await IngredientMongoose.findOne({
      name,
      manufacturer,
    })
      .lean()
      .exec();
    return ingredientDoc ? convertToIngredient(ingredientDoc) : null;
  }

  async findByPartialName(name: string): Promise<Ingredient[]> {
    const ingredients = await IngredientMongoose.find({
      name: { $regex: name, $options: "i" },
    })
      .lean()
      .exec();
    return ingredients.map(convertToIngredient);
  }

  async save(ingredient: Ingredient): Promise<void> {
    const mongooseIngredient = new IngredientMongoose(ingredient);
    await mongooseIngredient.save();
  }

  async findById(id: string): Promise<Ingredient | null> {
    const ingredientDoc = await IngredientMongoose.findById(id).lean().exec();
    return ingredientDoc ? convertToIngredient(ingredientDoc) : null;
  }

  async findAll(): Promise<Ingredient[]> {
    const ingredientDocs = await IngredientMongoose.find().lean().exec();
    return ingredientDocs.map((doc) => convertToIngredient(doc));
  }

  async update(
    id: string,
    ingredient: Partial<Ingredient>
  ): Promise<Ingredient | null> {
    const updatedIngredient = await IngredientMongoose.findByIdAndUpdate(
      id,
      ingredient,
      { new: true }
    )
      .lean()
      .exec();
    return updatedIngredient ? convertToIngredient(updatedIngredient) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await IngredientMongoose.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
