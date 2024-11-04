import { IProductsRepository } from "../../repositories/IProductsRepository";
import { Product } from "../../entities/Product";
import { ComponentMongoose } from "../../infra/database/schemas/componentSchema";
import { HttpException } from "../../utils/HttpException";

export class ComponentCostUpdateService {
  constructor(private productsRepository: IProductsRepository) {}

  async updateCosts(
    updatedComponentId: string,
    newPrice: number
  ): Promise<void> {
    const allProducts = await this.productsRepository.findAll();
    const componentPrices = new Map<string, number>();

    // Buscar todos os componentes e seus preços
    const allComponents = await ComponentMongoose.find().lean().exec();
    for (const component of allComponents) {
      if (component.price && component.packageQuantity) {
        const pricePerUnit =
          component._id.toString() === updatedComponentId
            ? newPrice / component.packageQuantity
            : component.price / component.packageQuantity;
        componentPrices.set(component._id.toString(), pricePerUnit);
      }
    }

    // Adicionar produtos que são componentes ao mapa de preços
    for (const product of allProducts) {
      if (product.isComponent) {
        componentPrices.set(product.id!, product.productionCostRatio || 0);
      }
    }

    // Função recursiva para atualizar produtos
    const updateProductRecursively = async (product: Product) => {
      let totalCost = 0;

      // Calcular custo total considerando todos os componentes
      for (const component of product.components) {
        const componentPrice = componentPrices.get(component.componentId);
        if (componentPrice !== undefined) {
          totalCost += componentPrice * component.quantity;
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

      if (!updatedProduct.id) throw new HttpException(500, "Unexpected error");

      await this.productsRepository.update(updatedProduct.id, updatedProduct);

      // Atualizar o preço no mapa se for um componente
      if (updatedProduct.isComponent) {
        componentPrices.set(
          updatedProduct.id,
          updatedProduct.productionCostRatio || 0
        );
      }

      // Atualizar produtos que usam este como componente
      const productsUsingThis = allProducts.filter((p) =>
        p.components.some((i) => i.componentId === updatedProduct.id)
      );

      for (const productUsingThis of productsUsingThis) {
        await updateProductRecursively(productUsingThis);
      }
    };

    // Iniciar a atualização em cascata
    const productsUsingUpdatedComponent = allProducts.filter((p) =>
      p.components.some((i) => i.componentId === updatedComponentId)
    );

    for (const product of productsUsingUpdatedComponent) {
      await updateProductRecursively(product);
    }
  }
}
