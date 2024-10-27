import { IProductsRepository } from "../repositories/IProductsRepository";
import { ProductUpdateManager } from "../useCases/productsUseCases/UpdateProduct/ProductUpdateManager";
import { UpdateProductUseCase } from "../useCases/productsUseCases/UpdateProduct/UpdateProductUseCase";
import { LogService } from "./LogService";
import { IProduct } from "../interfaces/IProduct";
import { IIngredientInProduct } from "../interfaces/IIngredient";

interface BatchUpdateResult {
  success: string[];
  errors: { id: string; error: string }[];
}

export class BatchUpdateService {
  constructor(
    private productsRepository: IProductsRepository,
    private updateProductUseCase: UpdateProductUseCase,
    private logService: LogService
  ) {}

  async updateAllProducts(): Promise<BatchUpdateResult> {
    const result: BatchUpdateResult = {
      success: [],
      errors: [],
    };

    const products = await this.productsRepository.findAll();
    const sortedProducts = this.sortProductsByDependencies(products);

    for (const product of sortedProducts) {
      try {
        const oldProductionCost = product.productionCost || 0;

        const updatedProduct = await this.updateProductUseCase.execute(
          product.id!,
          { recalculateCosts: true }
        );

        if (updatedProduct) {
          result.success.push(product.id!);

          await this.logService.logPriceUpdate(
            product.id!,
            oldProductionCost,
            updatedProduct.productionCost || 0,
            "product",
            "batch update"
          );
        }
      } catch (error: any) {
        result.errors.push({
          id: product.id!,
          error: error.message,
        });
      }
    }

    return result;
  }

  private sortProductsByDependencies(products: IProduct[]): IProduct[] {
    const graph = new Map<string, Set<string>>();

    // Construir grafo de dependências
    products.forEach((product) => {
      graph.set(product.id!, new Set<string>());
      product.ingredients.forEach((ing: IIngredientInProduct) => {
        const ingredientId = ing.ingredient.toString();
        if (products.some((p) => p.id === ingredientId)) {
          graph.get(product.id!)?.add(ingredientId);
        }
      });
    });

    // Ordenação topológica
    const visited = new Set<string>();
    const sorted: IProduct[] = [];

    function visit(productId: string) {
      if (visited.has(productId)) return;
      visited.add(productId);

      graph.get(productId)?.forEach((dependencyId: string) => {
        visit(dependencyId);
      });

      const product = products.find((p) => p.id === productId);
      if (product) {
        sorted.push(product);
      }
    }

    products.forEach((product) => {
      if (!visited.has(product.id!)) {
        visit(product.id!);
      }
    });

    return sorted;
  }
}
