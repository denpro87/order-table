export interface EquityCharacteristics {
  lastAnalyzed: string;
  portfolios: Portfolio[];
}

export interface Portfolio {
  id: number;
  name: string;
  totalHoldingsAnalyzed: number;
  portfolioCalculation: {
    equityStylebox: EquityStylebox;
  };
}

export interface EquityStylebox {
  LARGE_CORE: number;
  LARGE_GROWTH: number;
  LARGE_VALUE: number;
  MID_CORE: number;
  MID_GROWTH: number;
  MID_VALUE: number;
  SMALL_CORE: number;
  SMALL_GROWTH: number;
  SMALL_VALUE: number;
}
