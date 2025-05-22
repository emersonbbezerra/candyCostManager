import { IComponent } from '../interfaces/IComponent';
import { BaseEntity } from './BaseEntity';

export class Component extends BaseEntity implements IComponent {
  public name!: string;
  public manufacturer!: string;
  public price!: number;
  public packageQuantity!: number;
  public unitOfMeasure?: string;
  public category!: string;

  constructor(data?: Partial<IComponent>, id?: string) {
    super(id);
    if (data) {
      Object.assign(this, data);
    }
  }
}
