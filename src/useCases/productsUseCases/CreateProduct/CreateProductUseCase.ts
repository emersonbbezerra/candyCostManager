import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/ingredientSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../types/HttpException";
import { productSchema } from "../../../utils/productUtils";

export class CreateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: IProductDTO): Promise<void> {
    const parsedData = productSchema.parse(data);

    const existingProduct = await this.productsRepository.findByName(
      parsedData.name
    );
    if (existingProduct) {
      throw new HttpException(409, "Product already exists");
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
        const price = ingredient.price ?? 0;
        productionCost += price * item.quantity;
        ingredientIdsWithQuantities.push({
          ingredient: ingredient._id.toString(),
          ingredientName: ingredient.name,
          quantity: item.quantity,
        });
      } else if (productIngredient && productIngredient.isIngredient) {
        const price = productIngredient.productionCost ?? 0;
        productionCost += price * item.quantity;
        ingredientIdsWithQuantities.push({
          ingredient: productIngredient._id.toString(),
          ingredientName: productIngredient.name,
          quantity: item.quantity,
        });
      } else {
        throw new Error(`Ingrediente não encontrado: ${item.ingredientId}`);
      }
    }

    const product = new Product({
      name: parsedData.name,
      description: parsedData.description,
      category: parsedData.category,
      salePrice: parsedData.salePrice,
      productionCost,
      ingredients: ingredientIdsWithQuantities,
      isIngredient: parsedData.isIngredient, // Verifique se `isIngredient` está correto aqui
    });

    await this.productsRepository.save(product);
  }
}
