import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CharacteristicsService {
  getData() {
    return {
      lastAnalyzed: "2023-08-31T13:51:10.473151Z",
      portfolios: [
        {
          id: 62893,
          name: "Client Portfolio",
          totalHoldingsAnalyzed: 2,
          portfolioCalculation: {
            equityStylebox: {
              LARGE_CORE: 0.23,
              LARGE_GROWTH: 0.02,
              LARGE_VALUE: 0.01,
              MID_CORE: 0.01,
              MID_GROWTH: 0.08,
              MID_VALUE: 0.05,
              SMALL_CORE: 0.1,
              SMALL_GROWTH: 0.15001,
              SMALL_VALUE: 0.04999,
            },
          },
        },
        {
          id: 62894,
          name: "Recommended Portfolio",
          totalHoldingsAnalyzed: 8,
          portfolioCalculation: {
            equityStylebox: {
              LARGE_CORE: 0.33,
              LARGE_GROWTH: 0.05,
              LARGE_VALUE: 0.02,
              MID_CORE: 0.012,
              MID_GROWTH: 0.075,
              MID_VALUE: 0.04,
              SMALL_CORE: 0.1,
              SMALL_GROWTH: 0.19001,
              SMALL_VALUE: 0.065,
            },
          },
        },
        {
          id: 62895,
          name: "Recommended Portfolio 2",
          totalHoldingsAnalyzed: 5,
          portfolioCalculation: {
            equityStylebox: {
              LARGE_CORE: 0.43,
              LARGE_GROWTH: 0.05,
              LARGE_VALUE: 0.02,
              MID_CORE: 0.022,
              MID_GROWTH: 0.025,
              MID_VALUE: 0.02,
              SMALL_CORE: 0.1,
              SMALL_GROWTH: 0.2505,
              SMALL_VALUE: 0.033,
            },
          },
        },
      ],
    };
  }

  constructor(private http: HttpClient) {}

  getCharacteristicsData() {
    return Promise.resolve(this.getData());
  }
}
