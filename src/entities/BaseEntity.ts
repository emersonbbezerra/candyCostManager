import { uuidv7 } from 'uuidv7';

export abstract class BaseEntity {
  public readonly id!: string;
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(id?: string) {
    if (!id) this.id = uuidv7();
    this.createdAt = new Date();
  }
}
