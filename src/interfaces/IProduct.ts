import { IIngredientInProduct } from "./IIngredient";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  ingredients: {
    ingredientId: string;
    ingredientName?: string | null;
    quantity: number;
  }[];
  productionCost?: number;
  yield?: number;
  unitOfMeasure?: string;
  productionCostRatio?: number;
  salePrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isIngredient?: boolean;
}
