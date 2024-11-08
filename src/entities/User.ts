import { uuidv7 } from "uuidv7";
import { IUser } from "../interfaces/IUser";

export class User implements IUser  {
  public readonly id!: string;
  public name!: string;
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
