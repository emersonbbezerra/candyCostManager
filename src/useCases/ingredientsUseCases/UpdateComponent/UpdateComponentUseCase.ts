import { IIngredientsRepository } from "../../../repositories/IComponentsRepository";
import { Ingredient } from "../../../entities/Component";
import { HttpException } from "../../../types/HttpException";
import { ingredientSchema } from "../../../utils/ingredientUtils";
import { ProductCostUpdateService } from "../../../services/ProductCostUpdateService";

export class UpdateIngredientUseCase {
  constructor(
    private ingredientsRepository: IIngredientsRepository,
    private productCostUpdateService: ProductCostUpdateService
  ) {}

  async execute(
    id: string,
    data: Partial<Ingredient>
  ): Promise<Ingredient | null> {
    const existingIngredient = await this.ingredientsRepository.findById(id);
    if (!existingIngredient) {
      throw new HttpException(404, "Ingredient not found");
    }

    const parsedData = ingredientSchema.partial().parse(data);

    if (parsedData.name || parsedData.manufacturer) {
      const nameToCheck = parsedData.name || existingIngredient.name;
      const manufacturerToCheck =
        parsedData.manufacturer || existingIngredient.manufacturer;

      // Procura por um ingrediente com o mesmo nome e fabricante
      const duplicateIngredient =
        await this.ingredientsRepository.findByNameAndManufacturer(
          nameToCheck,
          manufacturerToCheck
        );

      // Verifica se encontrou um ingrediente diferente do atual com os mesmos dados
      if (duplicateIngredient && duplicateIngredient.id !== id) {
        throw new HttpException(
          409,
          "An ingredient with this name and manufacturer already exists"
        );
      }
    }

    const updatedData = {
      ...parsedData,
      createdAt: parsedData.createdAt?.toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedIngredient = await this.ingredientsRepository.update(
      id,
      updatedData
    );

    if (!updatedIngredient) {
      throw new HttpException(404, "Failed to update ingredient");
    }

    // Atualiza os custos dos produtos que usam este ingrediente
    if (updatedIngredient.price !== undefined) {
      await this.productCostUpdateService.updateCosts(
        id,
        updatedIngredient.price
      );
    }

    return updatedIngredient;
  }
}
