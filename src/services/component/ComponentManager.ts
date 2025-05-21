import { ComponentMongoose as Component } from '../../infra/database/mongoose/schemas/componentSchema';
import { ProductMongoose } from '../../infra/database/mongoose/schemas/productSchema';

export class ComponentManager {
  async getComponentName(componentId: string): Promise<string | null> {
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

  async formatComponents(
    components: { componentId: string; quantity: number }[]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): Promise<any[]> {
    return Promise.all(
      components.map(async (item) => {
        const componentName = await this.getComponentName(item.componentId);
        return {
          componentId: item.componentId,
          componentName,
          quantity: item.quantity,
        };
      })
    );
  }
}
