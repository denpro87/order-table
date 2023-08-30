import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import * as FileSaver from "file-saver";
import { MessageService, TreeNode, ConfirmationService } from "primeng/api";

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

  clonedHolding: { [s: string]: Holding } = {};

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
  expandedAll: boolean = false;

  treeTableData: any[] = [];

  selectedGrouping = "accountType";
  filterOptions: any[] = [];
  currentFilters: string[] = [];

  isSelectAll = false;
  selectedHoldings: string[] = [];

  constructor(
    private holdingService: HoldingService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.holdingService.getHoldingData().then((arrayData) => {
      console.log(arrayData);
      this.loading = false;
      this.athArrData = arrayData.athArrData;
      this.setAccountWithHoldingColumns();
      this.updateTreeTableData();
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
      const worksheet = xlsx.utils.json_to_sheet(this.athArrData);
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

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
      node.children.forEach((childNode) => {
        this.expandRecursive(childNode, isExpand);
      });
    }
  }

  handleExpandRows() {
    this.expandedAll = !this.expandedAll;
    const cloneData = [...this.treeTableData];
    cloneData.forEach((node) => {
      this.expandRecursive(node, this.expandedAll);
    });
    this.treeTableData = cloneData;
  }

  onColumnsChange(columns: string[]) {
    this.selectedColumnsKeys = columns;
    this.setColumns();
  }

  checkMatch(filters, row) {
    let isMatch = filters.length === 0;
    for (const filter of filters) {
      const [keysString, value] = filter.split(", ");
      const keys = keysString.split(" - ");
      const values = value.split(" - ");
      if (keys.length > 1) {
        if (values[0] === row[keys[0]] && values[1] === row[keys[1]]) {
          isMatch = true;
          break;
        }
      } else {
        if (value === row[keysString]) {
          isMatch = true;
          break;
        }
      }
    }
    return isMatch;
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

  accountGroupingData(list) {
    const keysString = this.selectedGrouping;
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

    const accountData = Object.entries(groupingViaCommonProperty).map(
      ([group, value]) => ({
        data: {
          holdingName: `${group} (${value.length})`,
          allocation: value.reduce((accumulator, object) => {
            return (
              accumulator +
              Number(
                object.holdings.reduce((accumulator, holdingObject) => {
                  return accumulator + Number(holdingObject.allocation || "0");
                }, 0) || "0"
              )
            );
          }, 0),
          isGroup: true,
        },
        children: value[0].holdings.map((item) => ({
          data: item,
        })),
      })
    );
    const data = [
      {
        data: {
          holdingName: "Total",
          allocation:
            Math.round(
              accountData.reduce((accumulator, object) => {
                return accumulator + object.data.allocation;
              }, 0) * 100
            ) / 100,
          isTotal: true,
        },
      },
      ...accountData,
    ];
    return data;
  }

  updateTreeTableData(): void {
    this.treeTableData = this.accountGroupingData(this.athArrData);
    console.log("threeTableData=====>", this.treeTableData);
  }

  confirmDeleteHolding(event: Event, holdingCode: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteHolding(holdingCode);
      },
    });
  }

  deleteHolding(holdingCode: string) {
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.filter(
        (child) => child.data.holdingCode !== holdingCode
      ),
    }));
  }

  onHoldingRowEditInit(holding: Holding) {
    this.clonedHolding[holding.holdingCode] = { ...holding };
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) =>
        child.data.holdingCode === holding.holdingCode
          ? {
              ...child,
              data: { ...child.data, isEditing: true },
            }
          : child
      ),
    }));
  }

  onHoldingRowEditSave(holding: Holding) {
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) =>
        child.data.holdingCode === holding.holdingCode
          ? {
              ...child,
              data: { ...child.data, isEditing: false },
            }
          : child
      ),
    }));
    delete this.clonedHolding[holding.holdingCode];
  }

  onHoldingRowEditCancel(holding: Holding) {
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) =>
        child.data.holdingCode === holding.holdingCode
          ? {
              ...child,
              data: {
                ...this.clonedHolding[holding.holdingCode],
                isEditing: false,
              },
            }
          : child
      ),
    }));
    delete this.clonedHolding[holding.holdingCode];
  }

  deleteAll() {
    console.log(this.selectedHoldings);
  }

  handleSelectAll(event) {
    event.stopPropagation();
    const clonedData = [...this.treeTableData];
    const selectedHoldings = [];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) => {
        if (this.isSelectAll) {
          selectedHoldings.push(child.data.holdingCode);
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
      this.selectedHoldings = [...this.selectedHoldings, holding.holdingCode];
    } else {
      this.selectedHoldings = this.selectedHoldings.filter(
        (item) => item !== holding.holdingCode
      );
    }
    if (this.selectedHoldings.length < 1) {
      this.isSelectAll = false;
    }
  }
}
