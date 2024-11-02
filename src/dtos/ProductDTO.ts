export interface IProductDTO {
  name: string;
  description: string;
  category: string;
  components: {
    componentId: string;
    componentName?: string | null;
    quantity: number;
  }[];
  productionCost?: number;
  yield?: number;
  unitOfMeasure?: string;
  productionCostRatio?: number;
  salePrice: number;
  isComponent?: boolean;
  createdAt: string;
  updatedAt: string;
}
