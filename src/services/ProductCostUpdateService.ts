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

    // Buscar todos os ingredientes e seus preços
    const allIngredients = await IngredientMongoose.find().lean().exec();
    for (const ingredient of allIngredients) {
      if (ingredient.price && ingredient.packageQuantity) {
        const pricePerUnit =
          ingredient._id.toString() === updatedIngredientId
            ? newPrice / ingredient.packageQuantity
            : ingredient.price / ingredient.packageQuantity;
        ingredientPrices.set(ingredient._id.toString(), pricePerUnit);
      }
    }

    // Adicionar produtos que são ingredientes ao mapa de preços
    for (const product of allProducts) {
      if (product.isIngredient) {
        ingredientPrices.set(product.id!, product.productionCostRatio || 0);
      }
    }

    // Função recursiva para atualizar produtos
    const updateProductRecursively = async (product: Product) => {
      let totalCost = 0;

      // Calcular custo total considerando todos os ingredientes
      for (const ingredient of product.ingredients) {
        const ingredientPrice = ingredientPrices.get(ingredient.ingredient);
        if (ingredientPrice !== undefined) {
          totalCost += ingredientPrice * ingredient.quantity;
        }
      }

      // Atualizar o produto com o novo custo
      const updatedProduct = new Product({
        ...product,
        productionCost: totalCost,
        productionCostRatio: product.yield
          ? totalCost / product.yield
          : undefined,
        updatedAt: new Date(),
      });

      if (!updatedProduct.id) throw new Error("Unexpected error");

      await this.productsRepository.update(updatedProduct.id, updatedProduct);

      // Atualizar o preço no mapa se for um ingrediente
      if (updatedProduct.isIngredient) {
        ingredientPrices.set(
          updatedProduct.id,
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
