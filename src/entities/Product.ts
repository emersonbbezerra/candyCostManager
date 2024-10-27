import { uuidv7 } from "uuidv7";

export class Product {
  public readonly id?: string;
  public name!: string;
  public description!: string;
  public category!: string;
  public ingredients!: { ingredient: string; quantity: number }[];
  public productionCost?: number;
  public yield?: number;
  public unitOfMeasure?: string;
  public productionCostRatio?: number;
  public salePrice?: number;
  public createdAt?: Date;
  public updatedAt?: Date;
  public isIngredient?: boolean;

  constructor(props: Omit<Product, "id">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuidv7();
    }
  }
}
