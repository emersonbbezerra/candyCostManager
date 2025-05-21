import { IComponentInProduct } from './IComponentInProduct';

export interface IProduct {
  id?: string;
  name: string;
  description: string;
  category: string;
  components: IComponentInProduct[];
  productionCost?: number;
  yield?: number;
  unitOfMeasure?: string;
  productionCostRatio?: number;
  salePrice?: number;
  isComponent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
