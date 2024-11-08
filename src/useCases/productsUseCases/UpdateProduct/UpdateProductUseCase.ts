import { IProductDTO } from '../../../dtos/ProductDTO';
import { Product } from '../../../entities/Product';
import { IProductsRepository } from '../../../repositories/IProductsRepository';
import { ComponentManager } from '../../../services/component/ComponentManager';
import { ProductCostCalculator } from '../../../services/product/ProductCostCalculator';
import { HttpException } from '../../../utils/HttpException';
import { convertToProduct, productSchema } from '../../../utils/productUtils';
import { ProductUpdateManager } from './ProductUpdateManager';

export class UpdateProductUseCase {
  private productCostCalculator: ProductCostCalculator;
  private componentManager: ComponentManager;

  constructor(private productsRepository: IProductsRepository) {
    this.productCostCalculator = new ProductCostCalculator();
    this.componentManager = new ComponentManager();
  }

  async execute(
    id: string,
    data: Partial<IProductDTO> & { recalculateCosts?: boolean }
  ): Promise<Product | null> {
    const existingProduct = await this.productsRepository.findById(id);
    if (!existingProduct) {
      throw new HttpException(404, 'Product not found');
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
          'A product with this name and category already exists'
        );
      }
    }

    // Calcular custo de produção
    const componentsToUse = parsedData.components || existingProduct.components;
    const productionCost =
      await this.productCostCalculator.calculateTotalProductionCost(
        componentsToUse
      );
    parsedData.productionCost = productionCost;

    // Calcular productionCostRatio
    const yieldValue = parsedData.yield || existingProduct.yield;
    if (yieldValue) {
      parsedData.productionCostRatio =
        this.productCostCalculator.calculateProductionCostRatio(
          productionCost,
          yieldValue
        );
    }

    parsedData.updatedAt = new Date();
    const { ...updateData } = parsedData;

    if (updateData.components) {
      updateData.components = await this.componentManager.formatComponents(
        updateData.components
      );
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
      throw new HttpException(404, 'Failed to update product');
    }

    // Se o produto atualizado é um componente, atualizar produtos que o utilizam
    if (updatedProduct.isComponent && updatedProduct.productionCostRatio) {
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
