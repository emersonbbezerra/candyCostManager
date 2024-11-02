import { z } from "zod";
import { Product } from "../entities/Product";
import { capitalize } from "./stringUtils";
import { IProduct } from "../interfaces/IProduct";

export const productSchema = z.object({
  name: z
    .string({
      required_error: "O nome é obrigatório.",
      invalid_type_error: "O nome deve ser uma string.",
    })
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O nome deve ter no máximo 100 caracteres." })
    .trim()
    .transform(capitalize),

  description: z
    .string({
      required_error: "A descrição é obrigatória.",
      invalid_type_error: "A descrição deve ser uma string.",
    })
    .min(3, { message: "A descrição deve ter pelo menos 3 caracteres." })
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres." })
    .trim()
    .transform(capitalize),

  category: z
    .string({
      required_error: "A categoria é obrigatória.",
      invalid_type_error: "A categoria deve ser uma string.",
    })
    .min(3, { message: "A categoria deve ter pelo menos 3 caracteres." })
    .max(50, { message: "A categoria deve ter no máximo 50 caracteres." })
    .trim()
    .transform(capitalize),

  ingredients: z
    .array(
      z.object({
        ingredientId: z.string({
          required_error: "O ID do ingrediente é obrigatório.",
          invalid_type_error: "O ID do ingrediente deve ser uma string.",
        }),
        quantity: z
          .number({
            required_error: "A quantidade é obrigatória.",
            invalid_type_error: "A quantidade deve ser um número.",
          })
          .positive({ message: "A quantidade deve ser maior que zero." })
          .max(999999.99, {
            message: "A quantidade não pode exceder 999.999,99.",
          }),
        ingredientName: z
          .string({
            invalid_type_error: "O nome do ingrediente deve ser uma string.",
          })
          .nullable()
          .optional(),
      }),
      {
        required_error: "É necessário adicionar pelo menos um ingrediente.",
        invalid_type_error: "Formato de ingredientes inválido.",
      }
    )
    .min(1, { message: "É necessário adicionar pelo menos um ingrediente." })
    .max(50, { message: "O produto não pode ter mais de 50 ingredientes." }),

  productionCost: z
    .number({
      invalid_type_error: "O custo de produção deve ser um número.",
    })
    .nonnegative({ message: "O custo de produção não pode ser negativo." })
    .max(999999.99, {
      message: "O custo de produção não pode exceder 999.999,99.",
    })
    .optional(),

  yield: z
    .number({
      invalid_type_error: "O rendimento deve ser um número.",
    })
    .positive({ message: "O rendimento deve ser maior que zero." })
    .max(999999.99, {
      message: "O rendimento não pode exceder 999.999,99.",
    })
    .optional(),

  unitOfMeasure: z
    .string({
      invalid_type_error: "A unidade de medida deve ser uma string.",
    })
    .min(1, { message: "A unidade de medida não pode estar vazia." })
    .max(50, {
      message: "A unidade de medida deve ter no máximo 50 caracteres.",
    })
    .trim()
    .optional(),

  productionCostRatio: z
    .number({
      invalid_type_error: "A taxa de custo de produção deve ser um número.",
    })
    .nonnegative({
      message: "A taxa de custo de produção não pode ser negativa.",
    })
    .max(999999.99, {
      message: "A taxa de custo de produção não pode exceder 999.999,99.",
    })
    .optional(),

  salePrice: z
    .number({
      invalid_type_error: "O preço de venda deve ser um número.",
    })
    .nonnegative({
      message: "O preço de venda deve ser um número não negativo.",
    })
    .max(999999.99, {
      message: "O preço de venda não pode exceder 999.999,99.",
    })
    .optional(),

  isIngredient: z
    .boolean({
      invalid_type_error: "O campo isIngredient deve ser um booleano.",
    })
    .optional(),

  createdAt: z
    .date({
      invalid_type_error: "Data de criação inválida.",
    })
    .optional(),

  updatedAt: z
    .date({
      invalid_type_error: "Data de atualização inválida.",
    })
    .optional(),
});

export function convertToProduct(productDoc: any): Product {
  const productData: IProduct = {
    id: productDoc.id || productDoc._id.toString(),
    name: productDoc.name,
    description: productDoc.description,
    category: productDoc.category,
    ingredients: productDoc.ingredients.map((ing: any) => ({
      ingredientId: ing.ingredientId.toString(),
      ingredientName: ing.ingredientName,
      quantity: ing.quantity,
    })),
    productionCost: productDoc.productionCost,
    yield: productDoc.yield,
    unitOfMeasure: productDoc.unitOfMeasure,
    productionCostRatio: productDoc.productionCostRatio,
    salePrice: productDoc.salePrice,
    isIngredient: productDoc.isIngredient,
    createdAt:
      productDoc.createdAt instanceof Date
        ? productDoc.createdAt
        : new Date(productDoc.createdAt),
    updatedAt:
      productDoc.updatedAt instanceof Date
        ? productDoc.updatedAt
        : new Date(productDoc.updatedAt),
  };

  return new Product(productData);
}
