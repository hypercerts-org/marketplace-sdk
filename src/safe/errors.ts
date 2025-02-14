export class SafeTxFailed extends Error {
  public safeAddress: string;
  constructor(safeAddress: string) {
    super(`Safe transaction failed for ${safeAddress}`);
    this.safeAddress = safeAddress;
  }
}
