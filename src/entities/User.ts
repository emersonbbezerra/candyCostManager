import { uuidv7 } from "uuidv7";

export class User {
  public readonly id!: string;
  public email!: string;
  public password!: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: Omit<User, "id">, id?: string) {
    Object.assign(this, props);
    if (!id) {
      this.id = uuidv7();
    }
  }
}
