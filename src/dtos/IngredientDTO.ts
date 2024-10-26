export interface IIngredientDTO {
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface IIngredientInProductDTO {
  ingredientId: string;
  ingredientName: string;
  quantity: number;
}
