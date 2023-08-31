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
      this.updateHoldings();
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
    this.updateHoldings();
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
          allocation: value.reduce((accumulator, object) => {
            return accumulator + Number(object.allocation);
          }, 0),
          allocationPercent: value.reduce((accumulator, object) => {
            return accumulator + Number(object.allocationPercent);
          }, 0),
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
        this.updateHoldings();
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
        this.updateHoldings();
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

  updateHoldings() {
    const totalValue = 100000;
    let initialCash = totalValue;
    this.holdings.forEach((holding) => {
      holding.quantity = Math.round(holding.allocation / holding.price);
      if (holding.quantity * holding.price < holding.minPurchase) {
        holding.quantity = Math.ceil(holding.minPurchase / holding.price);
        holding.allocation = holding.quantity * holding.price;
      }
      holding.allocationPercent = (holding.allocation / totalValue) * 100;
      initialCash -= holding.allocation;
    });
    this.cash = initialCash;
    this.updateTreeTableData();
  }

  updateByQuantity(holdingId, quantity) {
    const index = this.holdings.findIndex(
      (holding) => holding.holdingId === holdingId
    );
    let holding = this.holdings[index];
    if (quantity * holding.price < holding.minPurchase) {
      quantity = Math.ceil(holding.minPurchase / holding.price);
    }
    this.cash += holding.allocation;
    holding.quantity = quantity;
    holding.allocation = quantity * holding.price;
    this.updateHoldings();
  }

  updateByPercent(holdingId, percent) {
    const index = this.holdings.findIndex(
      (holding) => holding.holdingId === holdingId
    );
    let totalValue =
      this.cash +
      this.holdings.reduce((acc, holding) => acc + holding.allocation, 0);
    this.cash += this.holdings[index].allocation;
    this.holdings[index].allocationPercent = percent;
    this.holdings[index].allocation = (percent * totalValue) / 100;
    this.updateHoldings();
  }

  updateByAllocation(holdingId, allocation) {
    const index = this.holdings.findIndex(
      (holding) => holding.holdingId === holdingId
    );
    let holding = this.holdings[index];
    if (allocation < holding.minPurchase) {
      allocation = holding.minPurchase;
    }
    this.cash += holding.allocation;
    this.holdings[index].allocation = allocation;
    this.updateHoldings();
  }
}
