export interface Instrument {
  id: string;
  symbol: string;
  name: string;
  assetClass: "stock" | "mutual_fund" | "bond";
}
