import { Product } from "../../entities/Product";
import { ProductMongoose } from "../../infra/database/schemas/productSchema";
import { IProductsRepository } from "../IProductsRepository";
import { convertToProduct } from "../../utils/productUtils";

export class MongoProductsRepository implements IProductsRepository {
  async findByName(name: string): Promise<Product | null> {
    const productDoc = await ProductMongoose.findOne({ name }).lean().exec();
    return productDoc ? convertToProduct(productDoc) : null;
  }

  async save(product: Product): Promise<void> {
    const mongooseProduct = new ProductMongoose(product);
    await mongooseProduct.save();
  }

  async findAll(): Promise<Product[]> {
    const productDocs = await ProductMongoose.find().lean().exec();
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

  async findById(id: string): Promise<Product | null> {
    const productDoc = await ProductMongoose.findById(id).lean().exec();
    return productDoc ? convertToProduct(productDoc) : null;
  }
}
