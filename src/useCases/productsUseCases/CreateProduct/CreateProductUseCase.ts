import { IProductDTO } from '../../../dtos/ProductDTO';
import { Product } from '../../../entities/Product';
import { ComponentMongoose as Component } from '../../../infra/database/schemas/componentSchema';
import { ProductMongoose } from '../../../infra/database/schemas/productSchema';
import { IComponentInProduct } from '../../../interfaces/IComponent';
import { IProductsRepository } from '../../../repositories/IProductsRepository';
import { HttpException } from '../../../utils/HttpException';
import { productSchema } from '../../../utils/productUtils';

export class CreateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute(data: IProductDTO): Promise<void> {
    const parsedData = productSchema.parse(data);
    const existingProduct = await this.productsRepository.findByNameAndCategory(
      parsedData.name,
      parsedData.category
    );

    if (existingProduct) {
      throw new HttpException(
        409,
        'Product with this name and category already exists'
      );
    }

    let productionCost = 0;
    const componentIdsWithQuantities: IComponentInProduct[] = [];

    for (const item of parsedData.components) {
      const component = await Component.findById(item.componentId)
        .lean()
        .exec();
      const productComponent = await ProductMongoose.findById(item.componentId)
        .lean()
        .exec();

      if (component) {
        if (component.price == null || component.packageQuantity == null) {
          throw new HttpException(
            422,
            `Invalid component: ${item.componentId}`
          );
        }
        const pricePerUnit = component.price / component.packageQuantity;
        productionCost += pricePerUnit * item.quantity;
        componentIdsWithQuantities.push({
          componentId: component._id.toString(),
          componentName: component.name || undefined,
          quantity: item.quantity,
          unitOfMeasure: component.unitOfMeasure || undefined,
        });
      } else if (productComponent && productComponent.isComponent) {
        const costRatio = productComponent.productionCostRatio ?? 0;
        productionCost += costRatio * item.quantity;
        componentIdsWithQuantities.push({
          componentId: productComponent._id.toString(),
          componentName: productComponent.name || undefined,
          quantity: item.quantity,
          unitOfMeasure: productComponent.unitOfMeasure || undefined,
        });
      } else {
        throw new HttpException(
          404,
          `Component not found: ${item.componentId}`
        );
      }
    }

    const productionCostRatio =
      productionCost && parsedData.yield
        ? productionCost / parsedData.yield
        : undefined;

    const product = new Product({
      name: parsedData.name,
      description: parsedData.description,
      category: parsedData.category,
      salePrice: parsedData.salePrice,
      productionCost,
      yield: parsedData.yield,
      unitOfMeasure: parsedData.unitOfMeasure,
      productionCostRatio,
      components: componentIdsWithQuantities,
      isComponent: parsedData.isComponent,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.productsRepository.save(product);
  }
}
