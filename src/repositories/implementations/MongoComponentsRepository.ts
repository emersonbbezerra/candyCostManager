import { Component } from "../../entities/Component";
import { ComponentMongoose } from "../../infra/database/schemas/componentSchema";
import { IComponentsRepository } from "../IComponentsRepository";
import { convertToComponent } from "../../utils/componentUtils";

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
      name: { $regex: name, $options: "i" },
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

  async findAll(): Promise<Component[]> {
    const componentDocs = await ComponentMongoose.find().lean().exec();
    return componentDocs.map((doc) => convertToComponent(doc));
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
