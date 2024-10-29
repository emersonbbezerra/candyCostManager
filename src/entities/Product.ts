import { uuidv7 } from "uuidv7";

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  ingredients: {
    ingredient: string;
    quantity: number;
    ingredientName?: string | null;
  }[];
  productionCost?: number;
  yield?: number;
  unitOfMeasure?: string;
  productionCostRatio?: number;
  salePrice?: number;
  createdAt?: Date;
  updatedAt?: Date;
  isIngredient?: boolean;
  usedInProducts?: string[];
}

export class Product implements IProduct {
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
  public usedInProducts?: string[];

  constructor(props: IProduct) {
    Object.assign(this, props);
    if (!this.id) {
      this.id = uuidv7();
    }
  }

  public calculateProductionCost(
    ingredientPrices: Map<string, number>
  ): number {
    let cost = 0;
    for (const { ingredient, quantity } of this.ingredients) {
      const price = ingredientPrices.get(ingredient);
      if (price !== undefined) {
        cost += price * quantity;
      }
    }
    this.productionCost = cost;
    this.updateProductionCostRatio();
    return cost;
  }

  public updateProductionCost(ingredientPrices: Map<string, number>): void {
    this.calculateProductionCost(ingredientPrices);
    this.updatedAt = new Date();
  }

  private updateProductionCostRatio(): void {
    if (this.productionCost && this.yield) {
      this.productionCostRatio = this.productionCost / this.yield;
    }
  }
}
