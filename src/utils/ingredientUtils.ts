import { z } from "zod";
import { Ingredient } from "../entities/Ingredient";
import { capitalize } from "./stringUtils";

export const ingredientSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório.",
      invalid_type_error: "O nome deve ser uma string.",
    })
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." })
    .trim()
    .transform(capitalize),

  manufacturer: z
    .string({
      required_error: "O fabricante é obrigatório.",
      invalid_type_error: "O fabricante deve ser uma string.",
    })
    .min(3, { message: "O fabricante deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O fabricante deve ter no máximo 100 caracteres." })
    .trim()
    .transform(capitalize),

  price: z
    .number({
      required_error: "O preço é obrigatório.",
      invalid_type_error: "O preço deve ser um número.",
    })
    .nonnegative({ message: "O preço deve ser um número não negativo." })
    .max(999999.99, { message: "O preço não pode exceder 999.999,99." }),

  packageQuantity: z
    .number({
      required_error: "A quantidade da embalagem é obrigatória.",
      invalid_type_error: "A quantidade da embalagem deve ser um número.",
    })
    .nonnegative({
      message: "A quantidade da embalagem deve ser um número não negativo.",
    })
    .max(999999.99, {
      message: "A quantidade da embalagem não pode exceder 999.999,99.",
    }),

  unitOfMeasure: z
    .string({
      required_error: "A unidade de medida é obrigatória.",
      invalid_type_error: "A unidade de medida deve ser uma string.",
    })
    .min(1, { message: "A unidade de medida é obrigatória." })
    .max(50, {
      message: "A unidade de medida deve ter no máximo 50 caracteres.",
    })
    .trim()
    .transform(capitalize),

  category: z
    .string({
      required_error: "A categoria é obrigatória.",
      invalid_type_error: "A categoria deve ser uma string.",
    })
    .min(1, { message: "A categoria é obrigatória." })
    .max(50, { message: "A categoria deve ter no máximo 50 caracteres." })
    .trim()
    .transform(capitalize),

  createdAt: z
    .date({
      invalid_type_error: "Data de criação inválida.",
    })
    .optional()
    .nullable(),

  updatedAt: z
    .date({
      invalid_type_error: "Data de atualização inválida.",
    })
    .optional()
    .nullable(),
});

export const convertToIngredient = (ingredientDoc: any): Ingredient => {
  const ingredient = new Ingredient(
    {
      name: ingredientDoc.name!,
      manufacturer: ingredientDoc.manufacturer!,
      price: ingredientDoc.price!,
      packageQuantity: ingredientDoc.packageQuantity!,
      unitOfMeasure: ingredientDoc.unitOfMeasure!,
      category: ingredientDoc.category!,
      createdAt: ingredientDoc.createdAt?.toISOString(),
      updatedAt: ingredientDoc.updatedAt?.toISOString(),
    },
    ingredientDoc._id.toString()
  );
  return {
    ...ingredient,
    id: ingredientDoc._id.toString(),
  };
};
