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

import {
  HoldingWithAccount,
  Account,
  AccountWithHolding,
  Holding,
  Column,
  DropDownOption,
} from "../../types";
import { HoldingService } from "src/service/holdingService";

@Component({
  selector: "app-holding",
  templateUrl: "holding.component.html",
  styleUrls: ["holding.component.scss"],
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
export class HoldingComponent implements OnInit {
  arrayData: {
    htaArrData: HoldingWithAccount[];
    athArrData: AccountWithHolding[];
  };
  currentArrayData: any[];

  accounts!: Account[];
  clonedHolding: { [s: number]: Holding } = {};

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
  groupingOptions: any[] = [
    { label: "Account", value: ["accountName - accountType"] },
    { label: "Asset Class", value: ["assetClass"] },
    { label: "Asset Class & Geography", value: ["assetClass", "geography"] },
    {
      label: "Asset Class & Sub Class",
      value: ["assetClass", "subAssetClass"],
    },
    {
      label: "Asset Class, Geography and Sub Class",
      value: ["assetClass", "geography", "subAssetClass"],
    },
  ];
  groupedColumns = [
    {
      label: "Group 1",
      value: "group1",
      items: [
        { field: "quantity", header: "Qty", filterType: "numeric" },
        { field: "holdingCode", header: "Holding Code", filterType: "text" },
        { field: "price", header: "Price", filterType: "numeric" },
        { field: "marketValue", header: "Mkt.Value", filterType: "numeric" },
      ],
    },
    {
      label: "Group 2",
      value: "group2",
      items: [
        {
          field: "portfolioPercent",
          header: "% of Port",
          filterType: "numeric",
        },
        {
          field: "assetClassPercent",
          header: "% of Class",
          filterType: "numeric",
        },
        {
          field: "portfolioManger",
          header: "port.Manger",
          filterType: "text",
        },
      ],
    },
  ];
  selectedGrouping: DropDownOption;
  filterOptions: any[] = [];
  currentFilters: string[] = [];

  constructor(
    private holdingService: HoldingService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.holdingService.getHoldingData().then((arrayData) => {
      console.log(arrayData);
      this.loading = false;
      this.arrayData = arrayData;
      this.stFilters();
      this.setAccountWithHoldingColumns();
      // Initialize with default grouping
      this.currentArrayData = this.arrayData.athArrData;
      this.selectedGrouping = this.groupingOptions[0];
      this.updateTreeTableData();
    });
  }

  get isAccountView() {
    return this.selectedGrouping.label === "Account";
  }

  setColumns() {
    this.selectedColumns = [...this.cols].filter((col) =>
      this.selectedColumnsKeys.includes(col.field)
    );
  }

  stFilters() {
    const account = this.getGroupingViaProperty(
      [...this.arrayData.athArrData],
      "accountName - accountType"
    );
    const programType = this.getGroupingViaProperty(
      this.arrayData.athArrData,
      "programType"
    );
    const accountType = this.getGroupingViaProperty(
      this.arrayData.athArrData,
      "accountType"
    );
    this.filterOptions = [
      {
        key: "accountName - accountType",
        label: "Account",
        children: account.map((item) => ({
          key: `accountName - accountType, ${item}`,
          label: item,
        })),
      },
      {
        key: "programType",
        label: "Program Type",
        children: programType.map((item) => ({
          key: `programType, ${item}`,
          label: item,
        })),
      },
      {
        key: "accountType",
        label: "Account Type",
        children: accountType.map((item) => ({
          key: `accountType, ${item}`,
          label: item,
        })),
      },
    ];
  }

  setHoldingWithAccountColumns() {
    this.cols = [
      { field: "holdingName", header: "Holdings", filterType: "text" },
      { field: "quantity", header: "Qty", filterType: "numeric" },
      { field: "price", header: "Price", filterType: "numeric" },
      { field: "marketValue", header: "Mkt.Value $", filterType: "numeric" },
      {
        field: "portfolioPercent",
        header: "% of Port",
        filterType: "numeric",
      },
      {
        field: "assetClassPercent",
        header: "% of Class",
        filterType: "numeric",
      },
      {
        field: "estimatedAnnualDistribution",
        header: "Estimated Annual Distribution",
        filterType: "numeric",
      },
      {
        field: "yieldMaturity",
        header: "Yield Maturity",
        filterType: "numeric",
      },
      {
        field: "currentYield",
        header: "Current Yield",
        filterType: "numeric",
      },
    ];
    this.setColumns();
  }

  setAccountWithHoldingColumns() {
    this.cols = [
      { field: "holdingName", header: "Holdings", filterType: "text" },
      { field: "marketValue", header: "Mkt.Value $", filterType: "numeric" },
      { field: "price", header: "Price", filterType: "numeric" },
      { field: "quantity", header: "Qty", filterType: "numeric" },
      {
        field: "portfolioPercent",
        header: "% of Port",
        filterType: "numeric",
      },
      {
        field: "assetClassPercent",
        header: "% of Class",
        filterType: "numeric",
      },
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
      {
        field: "estimatedAnnualDistribution",
        header: "Estimated Annual Distribution",
        filterType: "numeric",
      },
      {
        field: "yieldMaturity",
        header: "Yield Maturity",
        filterType: "numeric",
      },
      {
        field: "currentYield",
        header: "Current Yield",
        filterType: "numeric",
      },
    ];
    this.setColumns();
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.currentArrayData);
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

  onGroupingChange(): void {
    this.expandedAll = false;
    if (this.selectedGrouping.label === "Account") {
      this.setAccountWithHoldingColumns();
      this.updateTreeTableData();
    } else {
      this.setHoldingWithAccountColumns();
      this.updateTreeTableData();
    }
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
  onFilterChange(filters: string[]) {
    this.currentFilters = filters;
    this.updateTreeTableData();
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

  holdingGroupingData(list, deep, parentMarketValue = 0) {
    const key = this.selectedGrouping.value[deep];
    const groupingViaCommonProperty: { [key: string]: any[] } = list.reduce(
      (acc, current) => {
        acc[current[key]] = acc[current[key]] ?? [];
        acc[current[key]].push(current);
        return acc;
      },
      {}
    );
    const holdingData = Object.entries(groupingViaCommonProperty).map(
      ([group, value]) => {
        const marketValue = value.reduce((accumulator, object) => {
          return accumulator + Number(object.marketValue);
        }, 0);
        return {
          data: {
            holdingName: `${group} (${value.length})`,
            marketValue,
            portfolioPercent: value.reduce((accumulator, object) => {
              return accumulator + Number(object.portfolioPercent);
            }, 0),
            assetClassPercent:
              deep === 0 ? 100 : (marketValue / parentMarketValue) * 100,
            isGroup: true,
          },
          children:
            deep < this.selectedGrouping.value.length - 1
              ? this.holdingGroupingData(value, deep + 1, marketValue)
              : value.map((item) => {
                  const itemData = { ...item };
                  delete itemData.accounts;
                  return {
                    data: {
                      ...itemData,
                      assetClassPercent: (item.marketValue / marketValue) * 100,
                    },
                    children: [{ data: { accounts: item["accounts"] } }],
                  };
                }),
        };
      }
    );
    if (deep === 0) {
      const data = [
        {
          data: {
            holdingName: "Total",
            marketValue:
              Math.round(
                holdingData.reduce((accumulator, object) => {
                  return accumulator + object.data.marketValue;
                }, 0) * 100
              ) / 100,
            isTotal: true,
          },
        },
        ...holdingData,
      ];
      return data;
    }
    return holdingData;
  }

  accountGroupingData(list) {
    const accountData = list.map((value) => {
      const marketValue = value.holdings.reduce(
        (accumulator, holdingObject) => {
          return accumulator + Number(holdingObject.marketValue || "0");
        },
        0
      );
      return {
        data: {
          holdingName: `${value.accountName} (${value.accountId}) - ${value.accountType}`,
          marketValue,
          isGroup: true,
        },
        children: value.holdings.map((item) => ({
          data: {
            ...item,
            assetClassPercent: item.marketValue
              ? (item.marketValue / marketValue) * 100
              : "",
          },
        })),
      };
    });
    const data = [
      {
        data: {
          holdingName: "Total",
          marketValue:
            Math.round(
              accountData.reduce((accumulator, object) => {
                return accumulator + object.data.marketValue;
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
    const accountFilters = this.currentFilters.filter((filter) =>
      filter.includes("accountName")
    );
    const programTypeFilters = this.currentFilters.filter((filter) =>
      filter.includes("programType")
    );
    const accountTypeFilters = this.currentFilters.filter(
      (filter) =>
        filter.includes("accountType") && !filter.includes("accountName")
    );
    if (this.isAccountView) {
      this.currentArrayData = this.arrayData.athArrData.filter((row) => {
        let isMatch = this.checkMatch(accountFilters, row);
        if (!isMatch) return false;
        isMatch = this.checkMatch(programTypeFilters, row);
        if (!isMatch) return false;
        isMatch = this.checkMatch(accountTypeFilters, row);
        return isMatch;
      });
      this.treeTableData = this.accountGroupingData(this.currentArrayData);
    } else {
      this.currentArrayData = this.arrayData.htaArrData.map((row) => ({
        ...row,
        accounts: row.accounts.filter((account) => {
          let isMatch = this.checkMatch(accountFilters, account);
          if (!isMatch) return false;
          isMatch = this.checkMatch(programTypeFilters, account);
          if (!isMatch) return false;
          isMatch = this.checkMatch(accountTypeFilters, account);
          return isMatch;
        }),
      }));
      this.treeTableData = this.holdingGroupingData(this.currentArrayData, 0);
    }
    console.log("threeTableData=====>", this.treeTableData);
  }

  confirmDeleteHolding(event: Event, holdingId: number) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Are you sure that you want to proceed?",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        this.deleteHolding(holdingId);
      },
    });
  }

  deleteHolding(holdingId: number) {
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.filter(
        (child) => child.data.holdingId !== holdingId
      ),
    }));
  }

  onHoldingRowEditInit(holding: Holding) {
    this.clonedHolding[holding.holdingId] = { ...holding };
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) =>
        child.data.holdingId === holding.holdingId
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
        child.data.holdingId === holding.holdingId
          ? {
              ...child,
              data: { ...child.data, isEditing: false },
            }
          : child
      ),
    }));
    delete this.clonedHolding[holding.holdingId];
  }

  onHoldingRowEditCancel(holding: Holding) {
    const clonedData = [...this.treeTableData];
    this.treeTableData = clonedData.map((group) => ({
      ...group,
      children: group.children?.map((child) =>
        child.data.holdingId === holding.holdingId
          ? {
              ...child,
              data: {
                ...this.clonedHolding[holding.holdingId],
                isEditing: false,
              },
            }
          : child
      ),
    }));
    delete this.clonedHolding[holding.holdingId];
  }
}
