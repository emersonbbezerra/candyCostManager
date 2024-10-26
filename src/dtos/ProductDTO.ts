import { IIngredientInProductDTO } from "./IngredientDTO";

export interface IProductDTO {
  name: string;
  description: string;
  category: string;
  ingredients: IIngredientInProductDTO[];
  productionCost?: number;
  salePrice: number;
  isIngredient?: boolean;
  createdAt: string;
  updatedAt: string;
}
