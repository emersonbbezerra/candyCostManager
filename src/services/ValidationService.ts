export class ValidationService {
  private maxPriceChangePercentage: number = 50; // 50%

  validatePriceUpdate(oldPrice: number, newPrice: number): boolean {
    if (oldPrice <= 0) return true; // Permite primeira definição de preço

    const changePercentage = Math.abs(((newPrice - oldPrice) / oldPrice) * 100);

    if (changePercentage > this.maxPriceChangePercentage) {
      throw new Error(
        `Price change of ${changePercentage.toFixed(
          2
        )}% exceeds maximum allowed (${this.maxPriceChangePercentage}%)`
      );
    }

    return true;
  }

  setMaxPriceChangePercentage(percentage: number): void {
    this.maxPriceChangePercentage = percentage;
  }
}
