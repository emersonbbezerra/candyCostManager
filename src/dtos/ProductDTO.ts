export interface IProductDTO {
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
  salePrice: number;
  isIngredient?: boolean;
  createdAt: string;
  updatedAt: string;
}
