import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/ingredientSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../types/HttpException";
import { convertToProduct, productSchema } from "../../../utils/productUtils";
import { ProductUpdateManager } from "./ProductUpdateManager";

interface IIngredientInput {
  ingredientId: string;
  ingredientName?: string | null;
  quantity: number;
}

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  private async getIngredientName(
    ingredientId: string
  ): Promise<string | null> {
    // Primeiro verifica se é um produto-ingrediente
    const productIngredient = await ProductMongoose.findById(ingredientId)
      .lean()
      .exec();
    if (productIngredient) {
      return productIngredient.name || null;
    }

    // Se não for, busca como ingrediente normal
    const ingredient = await Ingredient.findById(ingredientId).lean().exec();
    return ingredient?.name || null;
  }

  private async calculateIngredientCost(
    ingredientId: string,
    quantity: number
  ): Promise<number> {
    if (!ingredientId) {
      throw new Error("Ingredient ID is required");
    }

    // Primeiro verifica se é um produto-ingrediente
    const productIngredient = await ProductMongoose.findById(ingredientId)
      .lean()
      .exec();
    if (productIngredient?.isIngredient) {
      return (productIngredient.productionCostRatio || 0) * quantity;
    }

    // Se não for, busca como ingrediente normal
    const ingredient = await Ingredient.findById(ingredientId).lean().exec();
    if (!ingredient) {
      throw new Error(`Ingredient not found: ${ingredientId}`);
    }

    if (ingredient.price == null || ingredient.packageQuantity == null) {
      throw new Error(`Invalid ingredient: ${ingredientId}`);
    }

    return (ingredient.price / ingredient.packageQuantity) * quantity;
  }

  private async calculateTotalProductionCost(
    ingredients: IIngredientInput[]
  ): Promise<number> {
    let totalCost = 0;
    for (const item of ingredients) {
      const cost = await this.calculateIngredientCost(
        item.ingredientId,
        item.quantity
      );
      totalCost += cost;
    }
    return totalCost;
  }

  async execute(
    id: string,
    data: Partial<IProductDTO> & { recalculateCosts?: boolean }
  ): Promise<Product | null> {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new HttpException(404, "Product not found");
    }

    const parsedData = productSchema.partial().parse(data);

    if (parsedData.name || parsedData.category) {
      const nameToCheck = parsedData.name || existingProduct.name;
      const categoryToCheck = parsedData.category || existingProduct.category;

      const duplicateProduct =
        await this.productsRepository.findByNameAndCategory(
          nameToCheck,
          categoryToCheck
        );

      if (duplicateProduct && duplicateProduct.id !== id) {
        throw new HttpException(
          409,
          "A product with this name and category already exists"
        );
      }
    }

    // Calcular custo de produção
    const ingredientsToUse =
      parsedData.ingredients || existingProduct.ingredients;
    const productionCost = await this.calculateTotalProductionCost(
      ingredientsToUse
    );
    parsedData.productionCost = productionCost;

    // Calcular productionCostRatio
    const yieldValue = parsedData.yield || existingProduct.yield;
    if (yieldValue) {
      parsedData.productionCostRatio = productionCost / yieldValue;
    }

    parsedData.updatedAt = new Date();
    const { createdAt, ...updateData } = parsedData;

    if (updateData.ingredients) {
      const ingredientsWithCorrectFormat = await Promise.all(
        updateData.ingredients.map(async (item: IIngredientInput) => {
          const ingredientName = await this.getIngredientName(
            item.ingredientId
          );
          return {
            ingredientId: item.ingredientId,
            ingredientName,
            quantity: item.quantity,
          };
        })
      );
      updateData.ingredients = ingredientsWithCorrectFormat;
    }

    const productToUpdate = convertToProduct({
      ...existingProduct,
      ...updateData,
    });

    const updatedProduct = await this.productsRepository.update(
      id,
      productToUpdate
    );

    if (!updatedProduct) {
      throw new HttpException(404, "Failed to update product");
    }

    // Se o produto atualizado é um ingrediente, atualizar produtos que o utilizam
    if (updatedProduct.isIngredient && updatedProduct.productionCostRatio) {
      const productUpdateManager = new ProductUpdateManager(
        this.productsRepository
      );
      await productUpdateManager.updateDependentProducts(
        id,
        updatedProduct.productionCostRatio
      );
    }

    return this.productsRepository.findById(id);
  }
}
