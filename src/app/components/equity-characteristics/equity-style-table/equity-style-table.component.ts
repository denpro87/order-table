import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from "@angular/core";

import { Column, Portfolio } from "src/types";

const StyleBoxCategories = [
  {
    key: "LARGE_VALUE",
    text: "Large Value",
    categoryGroup: "Large",
  },
  {
    key: "LARGE_CORE",
    text: "Large Core",
    categoryGroup: "Large",
  },
  {
    key: "LARGE_GROWTH",
    text: "Large Growth",
    categoryGroup: "Large",
  },
  {
    key: "MID_VALUE",
    text: "Mid Value",
    categoryGroup: "Mid",
  },
  {
    key: "MID_CORE",
    text: "Mid Core",
    categoryGroup: "Mid",
  },
  {
    key: "MID_GROWTH",
    text: "Mid Growth",
    categoryGroup: "Mid",
  },
  {
    key: "SMALL_VALUE",
    text: "Small Value",
    categoryGroup: "Small",
  },
  {
    key: "SMALL_CORE",
    text: "Small Core",
    categoryGroup: "Small",
  },
  {
    key: "SMALL_GROWTH",
    text: "Small Growth",
    categoryGroup: "Small",
  },
];

@Component({
  selector: "app-equity-style-table",
  templateUrl: "./equity-style-table.component.html",
  styleUrls: ["./equity-style-table.component.scss"],
})
export class EquityStyleTableComponent implements OnInit, OnChanges {
  @Input() portfolios!: Portfolio[];
  tableData: any[];
  cols: Column[];
  groupingViaCategoryGroup: any;

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["portfolios"] && changes["portfolios"].currentValue) {
      const tableData = [];
      this.cols = [
        {
          field: "category",
          header: "Category",
        },
      ];
      const groupingViaCategoryGroup = {};

      for (const portfolio of this.portfolios) {
        this.cols.push({
          field: portfolio.id.toString(),
          header: portfolio.name,
        });
      }

      for (const category of StyleBoxCategories) {
        const row = {
          category: category.text,
          categoryGroup: category.categoryGroup,
        };
        if (!groupingViaCategoryGroup[category.categoryGroup]) {
          groupingViaCategoryGroup[category.categoryGroup] = {};
        }
        for (const portfolio of this.portfolios) {
          row[portfolio.id.toString()] =
            Math.round(
              portfolio.portfolioCalculation.equityStylebox[category.key] *
                10000
            ) / 100;
          if (
            !groupingViaCategoryGroup[category.categoryGroup][
              portfolio.id.toString()
            ]
          ) {
            groupingViaCategoryGroup[category.categoryGroup][
              portfolio.id.toString()
            ] = 0;
          }
          groupingViaCategoryGroup[category.categoryGroup][
            portfolio.id.toString()
          ] += row[portfolio.id.toString()];
        }
        tableData.push(row);
      }

      this.tableData = tableData;
      this.groupingViaCategoryGroup = groupingViaCategoryGroup;
    }
  }

  calculateSumStyleBox(categoryGroup) {
    const data = this.groupingViaCategoryGroup[categoryGroup];
    return {
      category: categoryGroup,
      ...data,
    };
  }
}
