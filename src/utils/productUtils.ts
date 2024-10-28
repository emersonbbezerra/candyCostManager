import { z } from "zod";
import { IProduct, Product } from "../entities/Product";

export const capitalize = (str: string) => {
  return str
    .toLowerCase()
    .replace(/(?:^|\s|[\p{P}\p{S}])\p{L}/gu, (char) => char.toUpperCase());
};

export const productSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .transform(capitalize),
  description: z
    .string()
    .min(3, { message: "A descrição deve ter pelo menos 3 caracteres." })
    .transform(capitalize),
  category: z
    .string()
    .min(1, { message: "A categoria é obrigatória." })
    .transform(capitalize),
  ingredients: z.array(
    z.object({
      ingredientId: z.string(),
      quantity: z.number(),
      ingredientName: z.string().nullable().optional(),
    })
  ),
  productionCost: z.number().optional(),
  yield: z.number().optional(),
  unitOfMeasure: z.string().optional(),
  productionCostRatio: z.number().optional(),
  salePrice: z
    .number()
    .nonnegative({
      message: "O preço de venda deve ser um número não negativo.",
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  isIngredient: z.boolean().optional(),
});

export function convertToProduct(productDoc: any): Product {
  const productData: IProduct = {
    id: productDoc.id || productDoc._id.toString(),
    name: productDoc.name,
    description: productDoc.description,
    category: productDoc.category,
    ingredients: productDoc.ingredients.map((ing: any) => ({
      ingredient: ing.ingredient.toString(),
      quantity: ing.quantity,
      ingredientName: ing.ingredientName,
    })),
    productionCost: productDoc.productionCost,
    yield: productDoc.yield,
    unitOfMeasure: productDoc.unitOfMeasure,
    productionCostRatio: productDoc.productionCostRatio,
    salePrice: productDoc.salePrice,
    createdAt:
      productDoc.createdAt instanceof Date
        ? productDoc.createdAt
        : new Date(productDoc.createdAt),
    updatedAt:
      productDoc.updatedAt instanceof Date
        ? productDoc.updatedAt
        : new Date(productDoc.updatedAt),
    isIngredient: productDoc.isIngredient,
    usedInProducts: productDoc.usedInProducts,
  };

  return new Product(productData);
}
