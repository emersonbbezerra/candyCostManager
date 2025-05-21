export interface IProductDTO {
  name: string;
  description: string;
  category: string;
  components: {
    componentId: string;
    componentName?: string | null;
    quantity: number;
    unitOfMeasure?: string;
  }[];
  productionCost?: number;
  yield?: number;
  unitOfMeasure?: string;
  productionCostRatio?: number;
  salePrice: number;
  isComponent?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
