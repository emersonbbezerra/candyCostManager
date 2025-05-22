import { IComponentInProduct } from '../interfaces/IComponentInProduct';
import { IProduct } from '../interfaces/IProduct';
import { BaseEntity } from './BaseEntity';

export class Product extends BaseEntity implements IProduct {
  public name!: string;
  public description!: string;
  public category!: string;
  public components!: IComponentInProduct[];
  public productionCost?: number;
  public yield?: number;
  public unitOfMeasure?: string;
  public productionCostRatio?: number;
  public salePrice?: number;
  public isComponent?: boolean;

  constructor(data?: Partial<IProduct>, id?: string) {
    super(id);
    if (data) {
      Object.assign(this, data);
    }
  }
}
