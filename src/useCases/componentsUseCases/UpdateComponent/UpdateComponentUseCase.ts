import { IComponentsRepository } from "../../../repositories/IComponentsRepository";
import { Component } from "../../../entities/Component";
import { HttpException } from "../../../utils/HttpException";
import { componentSchema } from "../../../utils/componentUtils";
import { ComponentCostUpdateService } from "../../../services/component/ComponentCostUpdateService";

export class UpdateComponentUseCase {
  constructor(
    private componentsRepository: IComponentsRepository,
    private productCostUpdateService: ComponentCostUpdateService
  ) {}

  async execute(
    id: string,
    data: Partial<Component>
  ): Promise<Component | null> {
    const existingComponent = await this.componentsRepository.findById(id);
    if (!existingComponent) {
      throw new HttpException(404, "Component not found");
    }

    const parsedData = componentSchema.partial().parse(data);

    if (parsedData.name || parsedData.manufacturer) {
      const nameToCheck = parsedData.name || existingComponent.name;
      const manufacturerToCheck =
        parsedData.manufacturer || existingComponent.manufacturer;

      // Procura por um componente com o mesmo nome e fabricante
      const duplicateComponent =
        await this.componentsRepository.findByNameAndManufacturer(
          nameToCheck,
          manufacturerToCheck
        );

      // Verifica se encontrou um componente diferente do atual com os mesmos dados
      if (duplicateComponent && duplicateComponent.id !== id) {
        throw new HttpException(
          409,
          "An component with this name and manufacturer already exists"
        );
      }
    }

    const updatedData = {
      ...parsedData,
      createdAt: parsedData.createdAt?.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedComponent = await this.componentsRepository.update(
      id,
      updatedData
    );

    if (!updatedComponent) {
      throw new HttpException(500, "Failed to update component");
    }

    // Atualiza os custos dos produtos que usam este componente
    if (updatedComponent.price !== undefined) {
      await this.productCostUpdateService.updateCosts(
        id,
        updatedComponent.price
      );
    }

    return updatedComponent;
  }
}
