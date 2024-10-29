import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/ingredientSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../types/HttpException";
import { convertToProduct, productSchema } from "../../../utils/productUtils";

interface IIngredientInput {
  ingredientId?: string;
  ingredient?: string;
  quantity: number;
  ingredientName?: string | null;
}

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  private async calculateIngredientCost(
    ingredientId: string | undefined,
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
    ingredients: any[]
  ): Promise<number> {
    let totalCost = 0;
    for (const item of ingredients) {
      const ingredientId =
        (item as IIngredientInput).ingredientId ||
        (item as IIngredientInput).ingredient;
      const quantity = (item as IIngredientInput).quantity;

      if (!ingredientId) {
        throw new Error("Ingredient ID is missing");
      }

      const cost = await this.calculateIngredientCost(ingredientId, quantity);
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

    if (parsedData.name) {
      const productWithSameName = await this.productsRepository.findByName(
        parsedData.name
      );
      if (productWithSameName && productWithSameName.id !== id) {
        throw new HttpException(409, "Product with this name already exists");
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
      const ingredientsWithCorrectFormat = updateData.ingredients.map(
        (item: IIngredientInput) => ({
          ingredient: item.ingredientId || item.ingredient,
          quantity: item.quantity,
        })
      );
      updateData.ingredients = ingredientsWithCorrectFormat as any;
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
    if (updatedProduct.isIngredient) {
      const productsUsingThis = await ProductMongoose.find({
        "ingredients.ingredient": id,
      })
        .lean()
        .exec();

      for (const product of productsUsingThis) {
        // Recalcular custo total do produto que usa este ingrediente
        const newProductionCost = await this.calculateTotalProductionCost(
          product.ingredients
        );

        // Atualizar produto com novo custo
        await ProductMongoose.findByIdAndUpdate(
          product._id,
          {
            $set: {
              productionCost: newProductionCost,
              productionCostRatio: product.yield
                ? newProductionCost / product.yield
                : undefined,
              updatedAt: new Date(),
            },
          },
          { new: true }
        );
      }
    }

    return this.productsRepository.findById(id);
  }
}
