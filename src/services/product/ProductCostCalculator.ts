import { ComponentMongoose as Component } from '../../infra/database/schemas/componentSchema';
import { ProductMongoose } from '../../infra/database/schemas/productSchema';
import { HttpException } from '../../utils/HttpException';

export class ProductCostCalculator {
  async calculateComponentCost(
    componentId: string,
    quantity: number
  ): Promise<number> {
    if (!componentId) {
      throw new HttpException(422, 'Component ID is required');
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

  async calculateTotalProductionCost(
    components: { componentId: string; quantity: number }[]
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

  calculateProductionCostRatio(
    productionCost: number,
    yieldValue: number
  ): number {
    return yieldValue ? productionCost / yieldValue : productionCost;
  }
}
