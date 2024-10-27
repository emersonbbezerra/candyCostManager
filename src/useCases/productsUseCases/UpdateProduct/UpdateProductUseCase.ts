import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/ingredientSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../types/HttpException";
import { productSchema } from "../../../utils/productUtils";

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(
    id: string,
    data: Partial<IProductDTO>
  ): Promise<Product | null> {
    const parsedData = productSchema.partial().parse(data);

    if (parsedData.name) {
      const existingProduct = await this.productsRepository.findByName(
        parsedData.name
      );
      if (existingProduct && existingProduct.id !== id) {
        throw new HttpException(409, "Product with this name already exists");
      }
    }

    let productionCost = 0;
    if (parsedData.ingredients) {
      for (let item of parsedData.ingredients) {
        const ingredient = await Ingredient.findById(item.ingredientId)
          .lean()
          .exec();
        const productIngredient = await ProductMongoose.findById(
          item.ingredientId
        )
          .lean()
          .exec();

        if (ingredient) {
          const price = ingredient.price ?? 0;
          productionCost += price * item.quantity;
        } else if (productIngredient && productIngredient.isIngredient) {
          const costRatio = productIngredient.productionCostRatio ?? 0;
          productionCost += costRatio * item.quantity;
        } else {
          throw new Error(`Ingrediente não encontrado: ${item.ingredientId}`);
        }
      }
      parsedData.productionCost = productionCost;
    }

    parsedData.updatedAt = new Date();

    const { createdAt, ...updateData } = parsedData;

    if (updateData.ingredients) {
      const ingredientsWithCorrectFormat = updateData.ingredients.map(
        (item) => ({
          ingredient: item.ingredientId,
          quantity: item.quantity,
        })
      );
      updateData.ingredients = ingredientsWithCorrectFormat as any;
    }

    const updatedProduct = await this.productsRepository.update(
      id,
      updateData as Partial<Product>
    );
    if (!updatedProduct) {
      throw new HttpException(404, "Product not found");
    }
    return updatedProduct;
  }
}
