import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import * as FileSaver from "file-saver";
import { MessageService, ConfirmationService } from "primeng/api";

import { AccountWithHolding, Column, Holding } from "../../types";
import { HoldingService } from "src/service/holdingService";

@Component({
  selector: "app-edit-account",
  templateUrl: "edit-account.component.html",
  styleUrls: ["edit-account.component.scss"],
  animations: [
    trigger("fadeInOut", [
      state(
        "void",
        style({
          opacity: 0,
        })
      ),
      transition("void <=> *", animate(500)),
    ]),
  ],
  providers: [MessageService, ConfirmationService],
})
export class EditAccountComponent implements OnInit {
  athArrData!: AccountWithHolding[];

  loading: boolean = true;

  cols!: Column[];
  selectedColumns!: Column[];
  selectedColumnsKeys = [
    "holdingName",
    "allocationPercent",
    "allocation",
    "price",
    "quantity",
    "marketValue",
    "portfolioPercent",
    "assetClassPercent",
    "minPurchase",
  ];

  showError: boolean = false;

  treeTableData: any[] = [];

  selectedGrouping = "assetClass";

  isSelectAll = false;
  selectedHoldings: number[] = [];

  cash = 100000;
  initialCash = 100000;
  holdings: Holding[] = [];
  currentAccount!: AccountWithHolding;
  constructor(
    private holdingService: HoldingService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.setAccountWithHoldingColumns();
    this.holdingService.getHoldingData().then((arrayData) => {
      console.log(arrayData);
      this.loading = false;
      this.athArrData = arrayData.athArrData;
      this.currentAccount = this.athArrData[0];
      this.holdings = this.currentAccount.holdings;
      this.updateCash();
    });
  }

  setColumns() {
    this.selectedColumns = [...this.cols].filter((col) =>
      this.selectedColumnsKeys.includes(col.field)
    );
  }

  setAccountWithHoldingColumns() {
    this.cols = [
      { field: "holdingName", header: "Holdings", filterType: "text" },
      { field: "quantity", header: "Qty", filterType: "numeric" },
      { field: "price", header: "Price", filterType: "numeric" },
      {
        field: "allocationPercent",
        header: "Alloc. %",
        filterType: "numeric",
      },
      {
        field: "allocation",
        header: "Alloc. $",
        filterType: "numeric",
      },
      {
        field: "minPurchase",
        header: "Min. $",
        filterType: "numeric",
      },
    ];
    this.setColumns();
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.holdings);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      this.saveAsExcelFile(excelBuffer, "customers");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    let EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  onAccountChange() {
    this.holdings = this.currentAccount.holdings;
    this.updateCash();
  }

  onColumnsChange(columns: string[]) {
    this.selectedColumnsKeys = columns;
    this.setColumns();
  }

  getGroupingViaProperty(list, keysString) {
    const keys = keysString.split(" - ");
    const groupingViaCommonProperty: { [key: string]: any[] } = list.reduce(
      (acc, current) => {
        const key =
          keys.length > 1
            ? `${current[keys[0]]} - ${current[keys[1]]}`
            : current[keysString];
        acc[key] = acc[key] ?? [];
        acc[key].push(current);
        return acc;
      },
      {}
    );
    return Object.keys(groupingViaCommonProperty);
  }

  holdingGroupingData(list) {
    const key = this.selectedGrouping;
    const groupingViaCommonProperty: { [key: string]: any[] } = list.reduce(
      (acc, current) => {
        acc[current[key]] = acc[current[key]] ?? [];
        acc[current[key]].push(current);
        return acc;
      },
      {}
    );
    const holdingData = Object.entries(groupingViaCommonProperty).map(
      ([group, value]) => ({
        expanded: true,
        data: {
          holdingName: `${group} (${value.length})`,
          allocation:
            Math.round(
              value.reduce((accumulator, object) => {
                return accumulator + Number(object.allocation);
              }, 0) * 100
            ) / 100,
          allocationPercent:
            Math.round(
              value.reduce((accumulator, object) => {
                return accumulator + Number(object.allocationPercent);
              }, 0) * 100
            ) / 100,
          isGroup: true,
        },
        children: value.map((item) => {
          return {
            data: item,
          };
        }),
      })
    );
    const data = [
      {
        data: {
          holdingName: "Total",
          allocation:
            Math.round(
              holdingData.reduce((accumulator, object) => {
                return accumulator + object.data.allocation;
              }, 0) * 100
            ) / 100,
          allocationPercent:
            Math.round(
              holdingData.reduce((accumulator, object) => {
                return accumulator + object.data.allocationPercent;
              }, 0) * 100
            ) / 100,
          isTotal: true,
        },
      },
      ...holdingData,
    ];
    return data;
  }

  updateTreeTableData(): void {
    this.treeTableData = this.holdingGroupingData(this.holdings);
    console.log("threeTableData=====>", this.treeTableData);
  }

  confirmDeleteHolding(event: Event, holdingId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteHolding(holdingId);
        this.updateCash();
      },
    });
  }

  deleteHolding(holdingId: number) {
    const index = this.holdings.findIndex(
      (holding) => holding.holdingId === holdingId
    );
    this.cash += this.holdings[index].allocation;
    this.holdings.splice(index, 1);
  }

  deleteAll(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        for (const holdingId of this.selectedHoldings) {
          this.deleteHolding(holdingId);
        }
        this.updateCash();
      },
    });
  }

  handleSelectAll(event) {
    event.stopPropagation();
    const clonedData = [...this.treeTableData];
    const selectedHoldings = [];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) => {
        if (this.isSelectAll) {
          selectedHoldings.push(child.data.holdingId);
        }
        return {
          ...child,
          data: { ...child.data, isSelected: this.isSelectAll },
        };
      }),
    }));
    this.selectedHoldings = selectedHoldings;
  }

  handleSelectRow(event, holding: any) {
    event.stopPropagation();
    if (holding.isSelected) {
      this.selectedHoldings = [...this.selectedHoldings, holding.holdingId];
    } else {
      this.selectedHoldings = this.selectedHoldings.filter(
        (item) => item !== holding.holdingId
      );
    }
    if (this.selectedHoldings.length < 1) {
      this.isSelectAll = false;
    }
  }

  updateHolding(holding: Holding, field: keyof Holding): void {
    const value = Number(holding[field]);
    // Switch based on which field is being updated
    switch (field) {
      case "quantity":
        // If quantity are updated, round to a whole number
        holding.quantity = Math.round(value);
        break;
      case "allocationPercent":
        // If percentage is updated, set the stock's percent value
        holding.allocationPercent = value;
        // Calculate the total dollar value based on the portfolio percentage
        holding.allocation =
          (this.initialCash * holding.allocationPercent) / 100;
        // Calculate and round the units based on the dollar value and stock price
        holding.quantity = Math.round(holding.allocation / holding.price);
        break;
      case "allocation":
        // If dollar value is updated, set the stock's dollar value
        holding.allocation = value;
        // Calculate and round the units based on the dollar value and stock price
        holding.quantity = Math.round(holding.allocation / holding.price);

        break;
      default:
        break;
    }
    // Recalculate dollar value after rounding units to ensure no fractional shares
    holding.allocation = holding.quantity * holding.price;
    // Recalculate the stock's percentage of the portfolio after rounding units
    holding.allocationPercent = (holding.allocation / this.initialCash) * 100;
    // After calculations, check if the dollar value meets the minimum purchase requirement
    if (holding.allocation < holding.minPurchase) {
      // Adjust the dollar value to the minimum purchase
      holding.allocation = holding.minPurchase;
      // Recalculate and round units based on the adjusted dollar value
      holding.quantity = Math.round(holding.allocation / holding.price);
      // Recalculate the stock's percentage of the portfolio based on the adjusted dollar value
      holding.allocationPercent = (holding.allocation / this.initialCash) * 100;
    }

    // After all updates, recalculate the total cash left in the portfolio
    this.updateCash();
  }

  updateCash() {
    this.cash =
      this.initialCash -
      this.holdings.reduce((acc, stock) => acc + stock.allocation, 0);
    this.updateTreeTableData();
  }
}
