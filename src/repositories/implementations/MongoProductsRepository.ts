import { Product } from "../../entities/Product";
import { ProductMongoose } from "../../infra/database/schemas/productSchema";
import { IProductsRepository } from "../IProductsRepository";
import { convertToProduct } from "../../utils/productUtils";
import mongoose from "mongoose";

export class MongoProductsRepository implements IProductsRepository {
  async findByName(name: string): Promise<Product | null> {
    const productDoc = await ProductMongoose.findOne({ name }).lean().exec();
    return productDoc ? convertToProduct(productDoc) : null;
  }

  async save(product: Product): Promise<Product> {
    const mongooseProduct = new ProductMongoose(product);
    const createdProduct = await mongooseProduct.save();
    return convertToProduct(createdProduct.toObject());
  }

  async findById(id: string): Promise<Product | null> {
    const productDocs = await ProductMongoose.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "ingredients",
          localField: "ingredients.ingredient",
          foreignField: "_id",
          as: "ingredientDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ingredients.ingredient",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: 1,
          description: 1,
          category: 1,
          ingredients: 1,
          productionCost: 1,
          yield: 1,
          unitOfMeasure: 1,
          productionCostRatio: 1,
          salePrice: 1,
          createdAt: 1,
          updatedAt: 1,
          isIngredient: 1,
          usedInProducts: 1,
        },
      },
    ]).exec();

    return productDocs.length > 0 ? convertToProduct(productDocs[0]) : null;
  }

  async findAll(): Promise<Product[]> {
    const productDocs = await ProductMongoose.aggregate([
      {
        $lookup: {
          from: "ingredients",
          localField: "ingredients.ingredient",
          foreignField: "_id",
          as: "ingredientDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "ingredients.ingredient",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $project: {
          id: { $toString: "$_id" },
          name: 1,
          description: 1,
          category: 1,
          ingredients: 1,
          productionCost: 1,
          yield: 1,
          unitOfMeasure: 1,
          productionCostRatio: 1,
          salePrice: 1,
          createdAt: 1,
          updatedAt: 1,
          isIngredient: 1,
          usedInProducts: 1,
        },
      },
    ]).exec();

    return productDocs.map(convertToProduct);
  }

  async update(product: Product): Promise<void> {
    await ProductMongoose.findByIdAndUpdate(product.id, {
      ...product,
      updatedAt: new Date(),
    }).exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductMongoose.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
