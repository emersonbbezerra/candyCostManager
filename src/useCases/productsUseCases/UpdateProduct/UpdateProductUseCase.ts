import { IProductsRepository } from "../../../repositories/IProductsRepository";
import { IProductDTO } from "../../../dtos/ProductDTO";
import { Product } from "../../../entities/Product";
import { ComponentMongoose as Component } from "../../../infra/database/schemas/componentSchema";
import { ProductMongoose } from "../../../infra/database/schemas/productSchema";
import { HttpException } from "../../../utils/HttpException";
import { convertToProduct, productSchema } from "../../../utils/productUtils";
import { ProductUpdateManager } from "./ProductUpdateManager";

interface IComponentInput {
  componentId: string;
  componentName?: string | null;
  quantity: number;
}

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  private async getComponentName(componentId: string): Promise<string | null> {
    // Primeiro verifica se é um produto-componente
    const productComponent = await ProductMongoose.findById(componentId)
      .lean()
      .exec();
    if (productComponent) {
      return productComponent.name || null;
    }

    // Se não for, busca como componente normal
    const component = await Component.findById(componentId).lean().exec();
    return component?.name || null;
  }

  private async calculateComponentCost(
    componentId: string,
    quantity: number
  ): Promise<number> {
    if (!componentId) {
      throw new HttpException(422, "Component ID is required");
    }

    // Primeiro verifica se é um produto-componente
    const productComponent = await ProductMongoose.findById(componentId)
      .lean()
      .exec();
    if (productComponent?.isComponent) {
      return (productComponent.productionCostRatio || 0) * quantity;
    }

    // Se não for, busca como componente normal
    const component = await Component.findById(componentId).lean().exec();
    if (!component) {
      throw new HttpException(404, `Component not found: ${componentId}`);
    }

    if (component.price == null || component.packageQuantity == null) {
      throw new HttpException(422, `Invalid component: ${componentId}`);
    }

    return (component.price / component.packageQuantity) * quantity;
  }

  private async calculateTotalProductionCost(
    components: IComponentInput[]
  ): Promise<number> {
    let totalCost = 0;
    for (const item of components) {
      const cost = await this.calculateComponentCost(
        item.componentId,
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
    const componentsToUse = parsedData.components || existingProduct.components;
    const productionCost = await this.calculateTotalProductionCost(
      componentsToUse
    );
    parsedData.productionCost = productionCost;

    // Calcular productionCostRatio
    const yieldValue = parsedData.yield || existingProduct.yield;
    if (yieldValue) {
      parsedData.productionCostRatio = productionCost / yieldValue;
    }

    parsedData.updatedAt = new Date();
    const { createdAt, ...updateData } = parsedData;

    if (updateData.components) {
      const componentsWithCorrectFormat = await Promise.all(
        updateData.components.map(async (item: IComponentInput) => {
          const componentName = await this.getComponentName(item.componentId);
          return {
            componentId: item.componentId,
            componentName,
            quantity: item.quantity,
          };
        })
      );
      updateData.components = componentsWithCorrectFormat;
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
