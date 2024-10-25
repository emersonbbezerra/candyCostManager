import { IIngredientInProductDTO } from "./IngredientDTO";

export interface IProductDTO {
  name: string;
  description: string;
  category: string;
  ingredients: IIngredientInProductDTO[];
  salePrice: number;
  createdAt: string;
  updatedAt: string;
}
