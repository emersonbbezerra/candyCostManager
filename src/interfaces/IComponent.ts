export interface IComponent {
  id?: string;
  name: string;
  manufacturer: string;
  price: number;
  packageQuantity: number;
  unitOfMeasure?: string;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}
