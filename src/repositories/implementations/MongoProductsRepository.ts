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

  async save(product: Product): Promise<void> {
    const mongooseProduct = new ProductMongoose(product);
    await mongooseProduct.save();
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
          ingredients: {
            $map: {
              input: "$ingredients",
              as: "i",
              in: {
                ingredient: "$$i.ingredient",
                ingredientName: {
                  $cond: {
                    if: { $in: ["$$i.ingredient", "$ingredientDetails._id"] },
                    then: {
                      $arrayElemAt: [
                        "$ingredientDetails.name",
                        {
                          $indexOfArray: [
                            "$ingredientDetails._id",
                            "$$i.ingredient",
                          ],
                        },
                      ],
                    },
                    else: {
                      $arrayElemAt: [
                        "$productDetails.name",
                        {
                          $indexOfArray: [
                            "$productDetails._id",
                            "$$i.ingredient",
                          ],
                        },
                      ],
                    },
                  },
                },
                quantity: "$$i.quantity",
              },
            },
          },
          productionCost: 1,
          salePrice: 1,
          createdAt: 1,
          updatedAt: 1,
          isIngredient: 1,
        },
      },
    ]).exec();

    return productDocs.length ? convertToProduct(productDocs[0]) : null;
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
          ingredients: {
            $map: {
              input: "$ingredients",
              as: "i",
              in: {
                ingredient: "$$i.ingredient",
                ingredientName: {
                  $cond: {
                    if: { $in: ["$$i.ingredient", "$ingredientDetails._id"] },
                    then: {
                      $arrayElemAt: [
                        "$ingredientDetails.name",
                        {
                          $indexOfArray: [
                            "$ingredientDetails._id",
                            "$$i.ingredient",
                          ],
                        },
                      ],
                    },
                    else: {
                      $arrayElemAt: [
                        "$productDetails.name",
                        {
                          $indexOfArray: [
                            "$productDetails._id",
                            "$$i.ingredient",
                          ],
                        },
                      ],
                    },
                  },
                },
                quantity: "$$i.quantity",
              },
            },
          },
          productionCost: 1,
          salePrice: 1,
          createdAt: 1,
          updatedAt: 1,
          isIngredient: 1,
        },
      },
    ]).exec();

    return productDocs.map((doc) => convertToProduct(doc));
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    const updatedProduct = await ProductMongoose.findByIdAndUpdate(
      id,
      product,
      { new: true }
    )
      .lean()
      .exec();
    return updatedProduct ? convertToProduct(updatedProduct) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductMongoose.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
