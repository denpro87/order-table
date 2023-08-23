export interface Holding {
  holdingName: string;
  holdingCode: string;
  holdingType: string;
  assetClass: string;
  subAssetClass: string;
  sourceOfInvestment: string;
  isLocked: string;
  geography: string;
  estimatedAnnualDistribution: number;
  currentYield: number;
  quantity: number;
  price: number;
  marketValue: number;
  portfolioPercent: number;
  portfolioManger: string;
  accounts: Account[];
}

export interface Account {
  clientId: string;
  clientName: string;
  accountId: string;
  accountName: string;
  accountType: string;
  programType: string;
  quantity: number;
  allocation: number;
}