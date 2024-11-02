import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/componentSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../types/HttpException";
import { productSchema } from "../../../utils/productUtils";

export class CreateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: IProductDTO): Promise<void> {
    const parsedData = productSchema.parse(data);
    const existingProduct = await this.productsRepository.findByNameAndCategory(
      parsedData.name,
      parsedData.category
    );

    if (existingProduct) {
      throw new HttpException(
        409,
        "Product with this name and category already exists"
      );
    }

    let productionCost = 0;
    const ingredientIdsWithQuantities = [];

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
        if (ingredient.price == null || ingredient.packageQuantity == null) {
          throw new Error(`Ingrediente inválido: ${item.ingredientId}`);
        }
        const pricePerUnit = ingredient.price / ingredient.packageQuantity;
        productionCost += pricePerUnit * item.quantity;
        ingredientIdsWithQuantities.push({
          ingredientId: ingredient._id.toString(),
          ingredientName: ingredient.name || null,
          quantity: item.quantity,
        });
      } else if (productIngredient && productIngredient.isIngredient) {
        const costRatio = productIngredient.productionCostRatio ?? 0;
        productionCost += costRatio * item.quantity;
        ingredientIdsWithQuantities.push({
          ingredientId: productIngredient._id.toString(),
          ingredientName: productIngredient.name || null,
          quantity: item.quantity,
        });
      } else {
        throw new Error(`Ingrediente não encontrado: ${item.ingredientId}`);
      }
    }

    const productionCostRatio =
      productionCost && parsedData.yield
        ? productionCost / parsedData.yield
        : undefined;

    const product = new Product({
      name: parsedData.name,
      description: parsedData.description,
      category: parsedData.category,
      salePrice: parsedData.salePrice,
      productionCost,
      yield: parsedData.yield,
      unitOfMeasure: parsedData.unitOfMeasure,
      productionCostRatio,
      ingredients: ingredientIdsWithQuantities,
      isIngredient: parsedData.isIngredient,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.productsRepository.save(product);
  }
}
