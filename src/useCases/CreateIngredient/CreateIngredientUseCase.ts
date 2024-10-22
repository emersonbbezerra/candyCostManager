import { ICreateIngredientRequestDTO } from "./CreateIngredientDTO";
import { HttpException } from "../../types/HttpException";
import { IIngredientsRepository } from "../../repositories/IIngredientsRepository";
import { Ingredient } from "../../entities/Ingredient";
import { z } from "zod";

const ingredientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  manufacturer: z
    .string()
    .min(3, { message: "O fabricante deve ter pelo menos 3 caracteres." }),
  price: z
    .number()
    .nonnegative({ message: "O preço deve ser um número não negativo." }),
  unitOfMeasure: z
    .string()
    .min(1, { message: "A unidade de medida é obrigatória." }),
  category: z.string().min(1, { message: "A categoria é obrigatória." }),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

export class CreateIngredientUseCase {
  constructor(private ingredientsRepository: IIngredientsRepository) {}

  async execute(data: ICreateIngredientRequestDTO): Promise<void> {
    try {
      const parsedData = ingredientSchema.parse(data);

      const existingIngredient = await this.ingredientsRepository.findbyname(
        parsedData.name
      );

      if (existingIngredient) {
        throw new HttpException(409, "Ingrediente já cadastrado");
      }

      const ingredient = new Ingredient({
        ...parsedData,
        createdAt: parsedData.createdAt?.toISOString(),
        updatedAt: parsedData.updatedAt?.toISOString(),
      });

      await this.ingredientsRepository.save(ingredient);
    } catch (e: any) {
      if (e.errors) {
        throw new HttpException(400, e.errors[0].message);
      }
      throw e;
    }
  }
}
