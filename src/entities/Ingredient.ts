import { uuidv7 } from "uuidv7";

export class Ingredient {
  public readonly id!: string;

  public name!: string;
  public manufacturer!: string;
  public price!: number;
  public unitOfMeasure!: string;
  public category!: string;
  public createdAt?: string;
  public updatedAt?: string;

  constructor(props: Omit<Ingredient, "id">, id?: string) {
    Object.assign(this, props);

    if (!id) {
      this.id = uuidv7();
    }
  }
}
