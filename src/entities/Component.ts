import { BaseEntity } from './BaseEntity';

export class Component extends BaseEntity {
  public name!: string;
  public manufacturer!: string;
  public price!: number;
  public packageQuantity!: number;
  public unitOfMeasure!: string;
  public category!: string;
}
