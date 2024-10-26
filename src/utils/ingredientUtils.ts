import { z } from "zod";
import { Ingredient } from "../entities/Ingredient";

export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[\p{P}\p{S}])\p{L}/gu, (char) => char.toUpperCase());
};

export const ingredientSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .transform(capitalize),
  manufacturer: z
    .string()
    .min(3, { message: "O fabricante deve ter pelo menos 3 caracteres." })
    .transform(capitalize),
  price: z
    .number()
    .nonnegative({ message: "O preço deve ser um número não negativo." }),
  packageQuantity: z
    .number()
    .nonnegative({
      message: "A quantidade da embalagem deve ser um número não negativo.",
    }), // Novo campo
  unitOfMeasure: z
    .string()
    .min(1, { message: "A unidade de medida é obrigatória." })
    .transform(capitalize),
  category: z
    .string()
    .min(1, { message: "A categoria é obrigatória." })
    .transform(capitalize),
  createdAt: z.date().optional().nullable(),
  updatedAt: z.date().optional().nullable(),
});

export const convertToIngredient = (ingredientDoc: any): Ingredient => {
  const ingredient = new Ingredient(
    {
      name: ingredientDoc.name!,
      manufacturer: ingredientDoc.manufacturer!,
      price: ingredientDoc.price!,
      packageQuantity: ingredientDoc.packageQuantity!, // Novo campo
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
