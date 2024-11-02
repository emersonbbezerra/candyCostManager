import { uuidv7 } from "uuidv7";
import { IProduct } from "../interfaces/IProduct";

export class Product implements IProduct {
  public readonly id?: string;
  public name!: string;
  public description!: string;
  public category!: string;
  public ingredients!: {
    ingredientId: string;
    ingredientName?: string | null;
    quantity: number;
  }[];
  public productionCost?: number;
  public yield?: number;
  public unitOfMeasure?: string;
  public productionCostRatio?: number;
  public salePrice?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public isIngredient?: boolean;

  constructor(props: IProduct) {
    Object.assign(this, props);
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
