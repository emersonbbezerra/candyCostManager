import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { IngredientMongoose as Ingredient } from "../../../infra/database/schemas/ingredientSchema";
import { HttpException } from "../../../types/HttpException";
import { productSchema } from "../../../utils/productUtils";

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(
    id: string,
    data: Partial<IProductDTO>
  ): Promise<Product | null> {
    // Validar os dados do produto com Zod antes de prosseguir
    const parsedData = productSchema.partial().parse(data);

    // Verificar se o nome do produto já existe com um ID diferente
    if (parsedData.name) {
      const existingProduct = await this.productsRepository.findByName(
        parsedData.name
      );
      if (existingProduct && existingProduct.id !== id) {
        throw new HttpException(409, "Product with this name already exists");
      }
    }

    // Calcular o custo de produção se ingredientes ou quantidades forem atualizados
    let productionCost = 0;
    if (parsedData.ingredients) {
      for (let item of parsedData.ingredients) {
        const ingredient = await Ingredient.findById(item.ingredientId)
          .lean()
          .exec();
        if (ingredient) {
          const price = ingredient.price ?? 0;
          productionCost += price * item.quantity;
        } else {
          throw new Error(`Ingrediente não encontrado: ${item.ingredientId}`);
        }
      }
      parsedData.productionCost = productionCost;
    }

    // Atualizar o campo updatedAt
    parsedData.updatedAt = new Date();

    // Remover `createdAt` do parsedData
    const { createdAt, ...updateData } = parsedData;

    // Converter `ingredients` para o formato esperado na entidade
    if (updateData.ingredients) {
      const ingredientsWithCorrectFormat = updateData.ingredients.map(
        (item) => ({
          ingredient: item.ingredientId,
          quantity: item.quantity,
        })
      );
      updateData.ingredients = ingredientsWithCorrectFormat as any;
    }

    // Atualizar o produto no repositório
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
