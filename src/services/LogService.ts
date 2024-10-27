import mongoose from "mongoose";

// Schema para os logs
const priceUpdateLogSchema = new mongoose.Schema({
  productId: String,
  oldPrice: Number,
  newPrice: Number,
  updateDate: { type: Date, default: Date.now },
  type: String, // 'ingredient' ou 'product'
  reason: String,
});

export const PriceUpdateLog = mongoose.model(
  "PriceUpdateLog",
  priceUpdateLogSchema
);

export class LogService {
  async logPriceUpdate(
    productId: string,
    oldPrice: number,
    newPrice: number,
    type: "ingredient" | "product",
    reason?: string
  ): Promise<void> {
    const log = new PriceUpdateLog({
      productId,
      oldPrice,
      newPrice,
      type,
      reason,
    });
    await log.save();
  }

  async getPriceHistory(productId: string): Promise<any[]> {
    return PriceUpdateLog.find({ productId })
      .sort({ updateDate: -1 })
      .lean()
      .exec();
  }
}
