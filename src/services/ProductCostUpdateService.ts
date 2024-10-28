import { IProductsRepository } from "../repositories/IProductsRepository";
import { Product } from "../entities/Product";
import { IngredientMongoose } from "../infra/database/schemas/ingredientSchema";

export class ProductCostUpdateService {
  constructor(private productsRepository: IProductsRepository) {}

  async updateCosts(
    updatedIngredientId: string,
    newPrice: number
  ): Promise<void> {
    const allProducts = await this.productsRepository.findAll();
    const ingredientPrices = new Map<string, number>();

    // Preencher o mapa de preços dos ingredientes
    for (const product of allProducts) {
      if (product.isIngredient) {
        ingredientPrices.set(product.id!, product.productionCostRatio || 0);
      }
    }

    // Adicionar o novo preço do ingrediente atualizado
    const updatedIngredient = await IngredientMongoose.findById(
      updatedIngredientId
    )
      .lean()
      .exec();
    if (updatedIngredient && updatedIngredient.packageQuantity) {
      const pricePerUnit = newPrice / updatedIngredient.packageQuantity;
      ingredientPrices.set(updatedIngredientId, pricePerUnit);
    } else {
      console.error(
        `Ingrediente ${updatedIngredientId} não encontrado ou sem quantidade de pacote definida.`
      );
      throw new Error(
        `Ingrediente ${updatedIngredientId} não encontrado ou sem quantidade de pacote definida.`
      );
    }

    // Função recursiva para atualizar produtos
    const updateProductRecursively = async (product: Product) => {
      const updatedProduct = new Product(product);

      if (!updatedProduct.id) throw new Error("Unexpected error");

      updatedProduct.updateProductionCost(ingredientPrices);
      await this.productsRepository.update(updatedProduct.id, updatedProduct);

      // Atualizar o preço no mapa de ingredientes se o produto também for um ingrediente
      if (updatedProduct.isIngredient) {
        ingredientPrices.set(
          updatedProduct.id!,
          updatedProduct.productionCostRatio || 0
        );
      }

      // Atualizar produtos que usam este como ingrediente
      const productsUsingThis = allProducts.filter((p) =>
        p.ingredients.some((i) => i.ingredient === updatedProduct.id)
      );

      for (const productUsingThis of productsUsingThis) {
        await updateProductRecursively(productUsingThis);
      }
    };

    // Iniciar a atualização em cascata
    const productsUsingUpdatedIngredient = allProducts.filter((p) =>
      p.ingredients.some((i) => i.ingredient === updatedIngredientId)
    );

    for (const product of productsUsingUpdatedIngredient) {
      await updateProductRecursively(product);
    }
  }
}
