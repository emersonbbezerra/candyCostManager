import { uuidv7 } from 'uuidv7';
import { IProduct } from '../interfaces/IProduct';

export class Product implements IProduct {
  public readonly id?: string;
  public name!: string;
  public description!: string;
  public category!: string;
  public components!: {
    componentId: string;
    componentName?: string | null;
    quantity: number;
  }[];
  public productionCost?: number;
  public yield?: number;
  public unitOfMeasure?: string;
  public productionCostRatio?: number;
  public salePrice?: number;
  public isComponent?: boolean;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: IProduct) {
    Object.assign(this, props);
    if (!this.id) {
      this.id = uuidv7();
    }
  }
}
