import { Component } from '../../entities/Component';
import { ComponentMongoose } from '../../infra/database/mongoose/schemas/componentSchema';
import { convertToComponent } from '../../utils/componentUtils';
import {
  FindAllComponentsOptions,
  FindAllComponentsResult,
  IComponentsRepository,
} from '../IComponentsRepository';

export class MongoComponentsRepository implements IComponentsRepository {
  async findByNameAndManufacturer(
    name: string,
    manufacturer: string
  ): Promise<Component | null> {
    const componentDoc = await ComponentMongoose.findOne({
      name,
      manufacturer,
    })
      .lean()
      .exec();
    return componentDoc ? convertToComponent(componentDoc) : null;
  }

  async findByPartialName(name: string): Promise<Component[]> {
    const components = await ComponentMongoose.find({
      name: { $regex: name, $options: 'i' },
    })
      .lean()
      .exec();
    return components.map(convertToComponent);
  }

  async save(component: Component): Promise<void> {
    const mongooseComponent = new ComponentMongoose(component);
    await mongooseComponent.save();
  }

  async findById(id: string): Promise<Component | null> {
    const componentDoc = await ComponentMongoose.findById(id).lean().exec();
    return componentDoc ? convertToComponent(componentDoc) : null;
  }

  async findAll(
    options: FindAllComponentsOptions = {}
  ): Promise<FindAllComponentsResult> {
    const page = options.page || 1;
    const limit = options.limit || 50;
    const skip = (page - 1) * limit;

    // Construir o filtro
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};
    if (options.category) {
      filter.category = options.category;
    }
    const [components, totalCount] = await Promise.all([
      ComponentMongoose.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      ComponentMongoose.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    return {
      components: components.map(convertToComponent),
      total: totalCount,
      totalPages,
      currentPage: page,
    };
  }

  async update(
    id: string,
    component: Partial<Component>
  ): Promise<Component | null> {
    const updatedComponent = await ComponentMongoose.findByIdAndUpdate(
      id,
      component,
      { new: true }
    )
      .lean()
      .exec();
    return updatedComponent ? convertToComponent(updatedComponent) : null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await ComponentMongoose.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}
