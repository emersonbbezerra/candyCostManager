import { z } from "zod";
import { Component } from "../entities/Component";
import { capitalize } from "./stringUtils";

export const componentSchema = z.object({
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
    .min(3, { message: "A categoria deve ter pelo menos 3 caracteres." })
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

export const convertToComponent = (componentDoc: any): Component => {
  const component = new Component(
    {
      name: componentDoc.name!,
      manufacturer: componentDoc.manufacturer!,
      price: componentDoc.price!,
      packageQuantity: componentDoc.packageQuantity!,
      unitOfMeasure: componentDoc.unitOfMeasure!,
      category: componentDoc.category!,
      createdAt: componentDoc.createdAt?.toISOString(),
      updatedAt: componentDoc.updatedAt?.toISOString(),
    },
    componentDoc._id.toString()
  );
  return {
    ...component,
    id: componentDoc._id.toString(),
  };
};
