import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { Product } from "../../../entities/Product";
import { UpdateProductUseCase } from "./UpdateProductUseCase";

interface UpdateError {
  productId: string;
  error: string;
}

interface UpdateResult {
  success: Product[];
  errors: UpdateError[];
}

export class ProductUpdateManager {
  private updateProductUseCase: UpdateProductUseCase;

  constructor(private productsRepository: IProductsRepository) {
    // Instanciando UpdateProductUseCase com o repositório
    this.updateProductUseCase = new UpdateProductUseCase(productsRepository);
  }

  async updateDependentProducts(
    updatedProductId: string,
    productionCostRatio: number
  ): Promise<UpdateResult> {
    const result: UpdateResult = {
      success: [],
      errors: [],
    };

    try {
      // Buscar todos os produtos
      const allProducts = await this.productsRepository.findAll();

      // Identificar produtos que usam o produto atualizado como componente
      const dependentProducts = allProducts.filter((product) =>
        product.components.some((ing) => ing.componentId === updatedProductId)
      );

      // Atualizar cada produto dependente
      for (const product of dependentProducts) {
        try {
          // Recalcular custo de produção
          let newProductionCost = 0;

          // Calcular o novo custo de produção baseado em todos os componentes
          for (const component of product.components) {
            const quantity = component.quantity;

            if (component.componentId === updatedProductId) {
              // Usar o novo productionCostRatio para o componente atualizado
              newProductionCost += productionCostRatio * quantity;
            } else {
              // Manter o custo existente para outros componentes
              const componentProduct = allProducts.find(
                (p) => p.id === component.componentId
              );
              if (componentProduct?.productionCostRatio) {
                newProductionCost +=
                  componentProduct.productionCostRatio * quantity;
              }
            }
          }

          // Calcular o novo productionCostRatio baseado no yield do produto
          const calculatedProductionCostRatio = product.yield
            ? newProductionCost / product.yield
            : newProductionCost;

          // Atualizar o produto com os novos valores calculados
          const updatedProduct = await this.updateProductUseCase.execute(
            product.id!,
            {
              productionCost: newProductionCost,
              productionCostRatio: calculatedProductionCostRatio,
            }
          );

          if (updatedProduct) {
            result.success.push(updatedProduct);
            // Recursivamente atualizar produtos que dependem deste
            await this.updateDependentProducts(
              product.id!,
              calculatedProductionCostRatio
            );
          }
        } catch (error: any) {
          result.errors.push({
            productId: product.id!,
            error: error.message || "Unknown error",
          });
        }
      }
    } catch (error: any) {
      throw new Error(`Failed to update dependent products: ${error.message}`);
    }

    return result;
  }
}
