import { IProductsRepository } from "../repositories/IProductsRepository";
import { ProductUpdateManager } from "../useCases/productsUseCases/UpdateProduct/ProductUpdateManager";
import { UpdateProductUseCase } from "../useCases/productsUseCases/UpdateProduct/UpdateProductUseCase";

export class IngredientObserver {
  constructor(
    private productsRepository: IProductsRepository,
    private updateProductUseCase: UpdateProductUseCase
  ) {}

  async onIngredientUpdate(
    ingredientId: string,
    newPrice: number
  ): Promise<void> {
    const products = await this.productsRepository.findAll();
    const affectedProducts = products.filter((product) =>
      product.ingredients.some(
        (ing) => ing.ingredient.toString() === ingredientId
      )
    );

    const updateManager = new ProductUpdateManager(this.productsRepository);

    for (const product of affectedProducts) {
      await updateManager.updateDependentProducts(
        product.id!,
        product.productionCostRatio || 0
      );
    }
  }
}
