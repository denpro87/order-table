import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HoldingWithAccount, AccountWithHolding } from "src/types";

@Injectable()
export class HoldingService {
  getData() {
    return [
      {
        clientId: 23890989,
        clientName: "Barack Obama",
        crmOid: "7F2979606D9A4450A3EBF5EA807815DC",
        accounts: [
          {
            accountId: "78907890",
            accountType: "RRSP",
            programType: "PIM",
            iaCode: "3G3",
            holdings: [
              {
                holdingId: 877343234,
                holdingName: "iShares S&P/TSX Cdn Prefr Shr ETF Comm",
                holdingCode: "CPD",
                holdingType: "ETF",
                assetClass: "Fixed Income",
                subAssetClass: "Fixed Income Canada",
                sourceOfInvestment: "Individual",
                isLocked: "FALSE",
                geography: "Canada",
                estimatedAnnualDistribution: 23.8,
                currentYield: 3.5,
                quantity: 25,
                price: 23.89,
                portfolioPercent: 23.5,
                portfolioManger: "Julia Wilson",
                allocation: 52000,
                allocationPercent: 11.1,
                minPurchase: 500,
              },
              {
                holdingId: 888888888,
                holdingName: "PIMCO Monthly Income F",
                holdingCode: "PMO205",
                holdingType: "Mutual Fund",
                assetClass: "Fixed Income",
                subAssetClass: "Fixed Income Canada",
                sourceOfInvestment: "SMA Model: Forstrong Core Growth",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 22.9,
                currentYield: 2.4,
                quantity: 20,
                price: 2.4,
                marketValue: 225.89,
                portfolioPercent: 11.9,
                portfolioManger: "Blaze Titus",
                allocation: 3000,
                allocationPercent: 22.2,
                minPurchase: 500,
              },
            ],
          },
          {
            accountId: "22224444",
            accountType: "TFSA",
            programType: "Commission",
            iaCode: "R56",
            holdings: [
              {
                holdingId: 333333333,
                holdingName: "Canadian National Railway Co",
                holdingCode: "CNR",
                holdingType: "Stock",
                assetClass: "Equity",
                subAssetClass: "Equity Canada",
                sourceOfInvestment: "PAG Model: Focus List",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 13.05,
                currentYield: 3.75,
                quantity: 40,
                price: 99.485,
                marketValue: 58737,
                portfolioPercent: 10.85,
                portfolioManger: "Blaze Titus",
                allocation: 2000,
                allocationPercent: 12.3,
                minPurchase: 500,
              },
              {
                holdingId: 111111111,
                holdingName: "Bank of Nova Scotia",
                holdingCode: "BNS",
                holdingType: "Stock",
                assetClass: "Equity",
                subAssetClass: "Equity Canada",
                sourceOfInvestment: "PAG Model: Focus List",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 10.2,
                currentYield: 2.43,
                quantity: 45,
                price: 123.263,
                marketValue: 73475,
                portfolioPercent: 8.34,
                portfolioManger: "Daniel GoodWill",
                allocation: 11100,
                allocationPercent: 23.4,
                minPurchase: 500,
              },
              {
                holdingId: 222222222222,
                holdingName: "PIMCO Monthly Income F",
                holdingCode: "PMO205",
                holdingType: "Mutual Fund",
                assetClass: "Fixed Income",
                subAssetClass: "Fixed Income Canada",
                sourceOfInvestment: "SMA Model: Forstrong Core Growth",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 22.9,
                currentYield: 2.4,
                quantity: 20,
                price: 2.4,
                marketValue: 225.89,
                portfolioPercent: 11.9,
                portfolioManger: "Blaze Titus",
                allocation: 555500,
                allocationPercent: 34.5,
                minPurchase: 500,
              },
            ],
          },
        ],
      },
      {
        clientId: 23890958,
        clientName: "Michelle Obama",
        crmOid: "7F2979606D9A4450A3EBF5EA807815DC",
        accounts: [
          {
            accountId: "23890978",
            accountType: "RRSP",
            programType: "PIM",
            iaCode: "3G3",
            holdings: [
              {
                holdingId: 555555555,
                holdingName: "iShares S&P/TSX Cdn Prefr Shr ETF Comm",
                holdingCode: "CPD",
                holdingType: "ETF",
                assetClass: "Fixed Income",
                subAssetClass: "Fixed Income Canada",
                sourceOfInvestment: "Individual",
                isLocked: "FALSE",
                geography: "Canada",
                estimatedAnnualDistribution: 23.8,
                currentYield: 3.5,
                quantity: 25,
                price: 23.89,
                portfolioPercent: 23.5,
                portfolioManger: "Julia Wilson",
                allocation: 99000,
                allocationPercent: 45.6,
                minPurchase: 500,
              },
              {
                holdingId: 444556666,
                holdingName: "PIMCO Monthly Income F",
                holdingCode: "PMO205",
                holdingType: "Mutual Fund",
                assetClass: "Fixed Income",
                subAssetClass: "Fixed Income Canada",
                sourceOfInvestment: "SMA Model: Forstrong Core Growth",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 22.9,
                currentYield: 2.4,
                quantity: 20,
                price: 2.4,
                marketValue: 225.89,
                portfolioPercent: 11.9,
                portfolioManger: "Blaze Titus",
                allocation: 10000,
                allocationPercent: 21.1,
                minPurchase: 500,
              },
            ],
          },
          {
            accountId: "78907891",
            accountType: "RIF",
            programType: "Commission",
            iaCode: "3G3",
            holdings: [
              {
                holdingId: 990000099,
                holdingName: "Bank of Nova Scotia",
                holdingCode: "BNS",
                holdingType: "Stock",
                assetClass: "Equity",
                subAssetClass: "Equity Canada",
                sourceOfInvestment: "PAG Model: Focus List",
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: 10.2,
                currentYield: 2.43,
                quantity: 45,
                price: 123.263,
                marketValue: 73475,
                portfolioPercent: 8.34,
                portfolioManger: "Julia Wilson",
                allocation: 88900,
                allocationPercent: 32.2,
                minPurchase: 500,
              },
              {
                holdingId: 111555566,
                holdingName: "Royal Bank of Canada",
                holdingCode: "RY",
                holdingType: "Stock",
                assetClass: "Equity",
                subAssetClass: "Equity Canada",
                sourceOfInvestment: null,
                isLocked: "TRUE",
                geography: "Canada",
                estimatedAnnualDistribution: "6.895",
                currentYield: 3.119,
                quantity: 20,
                price: 147.41,
                marketValue: 88200,
                portfolioPercent: 5.83,
                portfolioManger: "Julia Wilson",
                allocation: 10000,
                allocationPercent: 16.1,
                minPurchase: 500,
              },
            ],
          },
        ],
      },
    ];
  }

  constructor(private http: HttpClient) {}

  getHoldingData() {
    const masterData = this.getData();
    const inclusivePick = (obj, ...keys) =>
      Object.fromEntries(keys.map((key) => [key, obj[key]]));

    const athArrData = masterData.reduce((accArr, client) => {
      const clientId = client.clientId;
      const clientName = client.clientName;
      const accountName = client.clientName;
      const clientAccountsArr = client.accounts.map((accountObj) => {
        const partialAccObj = inclusivePick(
          accountObj,
          ...["accountId", "accountType", "programType", "holdings"]
        );
        return {
          ...partialAccObj,
          clientId,
          clientName,
          accountName,
        };
      });
      return accArr.concat(clientAccountsArr);
    }, []);

    // per account, recalculate `allocation` and `portfolioPercent`??

    const htaObjData = masterData.reduce((holdingKVMap, client) => {
      const clientId = client.clientId;
      const clientName = client.clientName;
      const accountName = client.clientName;
      client.accounts.forEach((accountObj) => {
        const accountId = accountObj.accountId;
        const accountType = accountObj.accountType;
        const programType = accountObj.programType;
        const holdings = accountObj.holdings;
        holdings.forEach((holdingObj) => {
          const partialholdingObj = inclusivePick(
            holdingObj,
            ...[
              "holdingName",
              "holdingCode",
              "holdingType",
              "assetClass",
              "subAssetClass",
              "sourceOfInvestment",
              "isLocked",
              "geography",
              "estimatedAnnualDistribution",
              "currentYield",
              "quantity",
              "price",
              //marketValue
              //portfolioPercent
              "portfolioManger",
            ]
          );

          const htaAccountObj = {
            clientId,
            clientName,
            accountId,
            accountName,
            accountType,
            programType,
            quantity: holdingObj.quantity,
            allocation: holdingObj.allocation,
            isLocked: holdingObj.isLocked,
            sourceOfInvestment: holdingObj.sourceOfInvestment,
            minPurchase: holdingObj.minPurchase,
            allocationPercent: holdingObj.allocationPercent,
            marketValue: holdingObj.quantity * holdingObj.price,
          };
          const holdingCode = holdingObj.holdingCode;
          //assuming holdingCode is unique identifier
          const upsertedholdingObj = !!holdingKVMap[holdingCode]
            ? holdingKVMap[holdingCode]
            : partialholdingObj;
          const accountsArr = upsertedholdingObj.accounts || [];
          const prevQuantity = holdingKVMap[holdingCode]?.quantity || 0;
          holdingKVMap[holdingCode] = {
            ...upsertedholdingObj,
            accounts: accountsArr.concat(htaAccountObj),
            quantity: prevQuantity + holdingObj.quantity,
          };
        });
      });
      return holdingKVMap;
    }, {});

    //add marketValue field
    let totalValue = 0;
    const htaArrData = Object.values(htaObjData)
      .map((_: any) => {
        const marketValue = _.quantity * _.price;
        totalValue += marketValue;
        return {
          ..._,
          marketValue,
        };
      })
      .map((_) => {
        const portfolioPercent = (_.marketValue / totalValue) * 100;
        return {
          ..._,
          portfolioPercent,
        };
      });
    return Promise.resolve({
      htaArrData: htaArrData as HoldingWithAccount[],
      athArrData: athArrData as AccountWithHolding[],
    });
  }
}
