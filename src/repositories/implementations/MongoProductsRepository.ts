import { Product } from "../../entities/Product";
import { ProductMongoose } from "../../infra/database/schemas/productSchema";
import {
  FindAllProductsOptions,
  FindAllProductsResult,
  IProductsRepository,
} from "../IProductsRepository";
import { convertToProduct } from "../../utils/productUtils";
import mongoose from "mongoose";

export class MongoProductsRepository implements IProductsRepository {
  async findByNameAndCategory(
    name: string,
    category: string
  ): Promise<Product | null> {
    const productDoc = await ProductMongoose.findOne({ name, category })
      .lean()
      .exec();
    return productDoc ? convertToProduct(productDoc) : null;
  }

  async findByPartialName(name: string): Promise<Product[]> {
    const products = await ProductMongoose.find({
      name: { $regex: name, $options: "i" },
    })
      .lean()
      .exec();
    return products.map(convertToProduct);
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
          from: "components",
          localField: "components.component",
          foreignField: "_id",
          as: "componentDetails",
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "components.component",
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
          components: 1,
          productionCost: 1,
          yield: 1,
          unitOfMeasure: 1,
          productionCostRatio: 1,
          salePrice: 1,
          isComponent: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]).exec();

    return productDocs.length > 0 ? convertToProduct(productDocs[0]) : null;
  }

  async findAll(
    options: FindAllProductsOptions = {}
  ): Promise<FindAllProductsResult> {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const skip = (page - 1) * limit;

    // Construir o filtro
    const filter: any = {};
    if (options.category) {
      filter.category = options.category;
    }

    // Fazer a agregação
    const [products, totalCount] = await Promise.all([
      ProductMongoose.aggregate([
        { $match: filter },
        {
          $lookup: {
            from: "components",
            localField: "components.component",
            foreignField: "_id",
            as: "componentDetails",
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "components.component",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $sort: { name: 1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            id: { $toString: "$_id" },
            name: 1,
            description: 1,
            category: 1,
            components: 1,
            productionCost: 1,
            yield: 1,
            unitOfMeasure: 1,
            productionCostRatio: 1,
            salePrice: 1,
            isComponent: 1,
            createdAt: 1,
            updatedAt: 1,
          },
        },
      ]).exec(),
      ProductMongoose.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      products: products.map(convertToProduct),
      total: totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async update(id: string, product: Product): Promise<Partial<Product> | null> {
    const updateProduct = await ProductMongoose.findByIdAndUpdate(product.id, {
      ...product,
      updatedAt: new Date(),
    }).exec();
    return convertToProduct(updateProduct);
  }

  async delete(id: string): Promise<boolean> {
    const result = await ProductMongoose.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}
