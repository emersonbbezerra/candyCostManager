import { z } from "zod";
import { Product } from "../entities/Product";

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
      ingredientName: z.string(),
      quantity: z.number().nonnegative({
        message: "A quantidade deve ser um número não negativo.",
      }),
    })
  ),
  salePrice: z.number().nonnegative({
    message: "O preço de venda deve ser um número não negativo.",
  }),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  productionCost: z.number().optional(),
  isIngredient: z.boolean().optional(),
});

export const convertToProduct = (productDoc: any): Product => {
  const product = new Product(
    {
      name: productDoc.name!,
      description: productDoc.description!,
      category: productDoc.category!,
      ingredients: productDoc.ingredients!,
      productionCost: productDoc.productionCost!,
      salePrice: productDoc.salePrice!,
      createdAt: productDoc.createdAt?.toISOString(),
      updatedAt: productDoc.updatedAt?.toISOString(),
      isIngredient: productDoc.isIngredient || false,
    },
    productDoc._id.toString()
  );
  return {
    ...product,
    id: productDoc._id.toString(),
  };
};
