import { uuidv7 } from "uuidv7";

export class Component {
  public readonly id!: string;

  public name!: string;
  public manufacturer!: string;
  public price!: number;
  public packageQuantity!: number;
  public unitOfMeasure!: string;
  public category!: string;
  public createdAt?: string;
  public updatedAt?: string;

  constructor(props: Omit<Component, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuidv7();
    }
  }
}
