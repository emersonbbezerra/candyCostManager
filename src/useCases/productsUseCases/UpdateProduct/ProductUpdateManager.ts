import { Product } from '../../../entities/Product';
import { IProductsRepository } from '../../../repositories/IProductsRepository';
import { HttpException } from '../../../utils/HttpException';
import { UpdateProductUseCase } from './UpdateProductUseCase';

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
      const { products: allProducts } = await this.productsRepository.findAll();
      const dependentProducts = allProducts.filter((product: Product) =>
        product.components.some(
          (component) => component.componentId === updatedProductId
        )
      );

      for (const product of dependentProducts) {
        await this.updateSingleProduct(
          product,
          updatedProductId,
          productionCostRatio,
          allProducts,
          result
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        500,
        `Failed to update dependent products: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }

    return result;
  }

  private async updateSingleProduct(
    product: Product,
    updatedProductId: string,
    productionCostRatio: number,
    allProducts: Product[],
    result: UpdateResult
  ): Promise<void> {
    try {
      const newProductionCost = this.calculateNewProductionCost(
        product,
        updatedProductId,
        productionCostRatio,
        allProducts
      );
      const calculatedProductionCostRatio = this.calculateProductionCostRatio(
        product,
        newProductionCost
      );

      const updatedProduct = await this.updateProductUseCase.execute(
        product.id!,
        {
          productionCost: newProductionCost,
          productionCostRatio: calculatedProductionCostRatio,
        }
      );

      if (updatedProduct) {
        result.success.push(updatedProduct);
        await this.updateDependentProducts(
          product.id!,
          calculatedProductionCostRatio
        );
      }
    } catch (error) {
      result.errors.push({
        productId: product.id!,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  private calculateNewProductionCost(
    product: Product,
    updatedProductId: string,
    productionCostRatio: number,
    allProducts: Product[]
  ): number {
    return product.components.reduce((cost, component) => {
      if (component.componentId === updatedProductId) {
        return cost + productionCostRatio * component.quantity;
      }
      const componentProduct = allProducts.find(
        (p) => p.id === component.componentId
      );
      return (
        cost + (componentProduct?.productionCostRatio || 0) * component.quantity
      );
    }, 0);
  }

  private calculateProductionCostRatio(
    product: Product,
    newProductionCost: number
  ): number {
    return product.yield
      ? newProductionCost / product.yield
      : newProductionCost;
  }
}
