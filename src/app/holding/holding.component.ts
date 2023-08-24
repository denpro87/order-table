import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import * as FileSaver from "file-saver";
import { MessageService, TreeNode, SelectItemGroup } from "primeng/api";

import { Holding, Account, Column, DropDownOption } from "../../types";
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
  providers: [MessageService],
})
export class HoldingComponent implements OnInit {
  holdings!: TreeNode[];
  holdingArray!: Holding[];

  accounts!: Account[];
  clonedAccount: { [s: string]: Account } = {};

  loading: boolean = true;

  cols!: Column[];
  frozenCols!: Column[];
  scrollableCols!: Column[];
  selectedColumns!: Column[];

  accountCols!: Column[];
  accountScrollableCols!: Column[];
  accountFrozenCols!: Column[];

  showError: boolean = false;

  expandedGroups: string[] = [];
  expandedRowKeys: any[] = [];

  expandedAll: boolean = false;

  treeTableData: any[] = [];
  groupingOptions: any[] = [
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

  constructor(private holdingService: HoldingService) {}

  ngOnInit() {
    this.holdingService.getHoldingData().then((holdingArray) => {
      this.loading = false;
      this.holdingArray = holdingArray;
      this.cols = [
        { field: "holdingName", header: "Holdings", filterType: "text" },
        { field: "quantity", header: "Qty", filterType: "numeric" },
        { field: "holdingCode", header: "Holding Code", filterType: "text" },
        { field: "price", header: "Price", filterType: "numeric" },
        { field: "marketValue", header: "Mkt.Value", filterType: "numeric" },
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
      ];
      this.scrollableCols = [
        { field: "quantity", header: "Qty", filterType: "numeric" },
        { field: "holdingCode", header: "Holding Code", filterType: "text" },
        { field: "price", header: "Price", filterType: "numeric" },
        { field: "marketValue", header: "Mkt.Value", filterType: "numeric" },
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
      ];
      this.frozenCols = [
        { field: "holdingName", header: "Holdings", filterType: "text" },
      ];
      this.selectedColumns = this.scrollableCols;

      this.accountFrozenCols = [
        { field: "accountName", header: "Name", filterType: "text" },
      ];
      this.accountCols = [
        { field: "accountName", header: "Name", filterType: "text" },
        { field: "quantity", header: "Qty", filterType: "numeric" },
        { field: "accountType", header: "Account Type", filterType: "text" },
        { field: "programType", header: "Program Type", filterType: "text" },
        { field: "allocation", header: "Allocation", filterType: "numeric" },
      ];

      this.accountScrollableCols = [
        { field: "quantity", header: "Qty", filterType: "numeric" },
        { field: "accountType", header: "Account Type", filterType: "text" },
        { field: "programType", header: "Program Type", filterType: "text" },
        { field: "allocation", header: "Allocation", filterType: "numeric" },
      ];

      // Initialize with default grouping
      this.selectedGrouping = this.groupingOptions[0];
      this.updateTreeTableData();
    });
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.holdingArray);
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

  getStatusSeverity(status: string) {
    switch (status) {
      case "PENDING":
        return "warning";
      case "DELIVERED":
        return "success";
      case "CANCELLED":
        return "danger";
    }
  }

  deleteAccount(id: string) {
    this.accounts = this.accounts.filter((account) => account.accountId !== id);
  }

  onAccountRowEditInit(account: Account) {
    this.clonedAccount[account.accountId as string] = { ...account };
  }

  onAccountRowEditSave(account: Account) {
    delete this.clonedAccount[account.accountId as string];
  }

  onAccountRowEditCancel(account: Account, index: number) {
    this.accounts[index] = this.clonedAccount[account.accountId as string];
    delete this.clonedAccount[account.accountId as string];
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
    this.updateTreeTableData();
  }

  groupingData(list, deep) {
    const key = this.selectedGrouping.value[deep];
    const groupingViaCommonProperty: { [key: string]: any[] } = list.reduce(
      (acc, current) => {
        acc[current[key]] = acc[current[key]] ?? [];
        acc[current[key]].push(current);
        return acc;
      },
      {}
    );
    return Object.entries(groupingViaCommonProperty).map(([group, value]) => ({
      data: {
        holdingName: `${group} (${value.length})`,
        marketValue: value.reduce((accumulator, object) => {
          return accumulator + Number(object.marketValue);
        }, 0),
        isGroup: true,
      },
      children:
        deep < this.selectedGrouping.value.length - 1
          ? this.groupingData(value, deep + 1)
          : value.map((item) => {
              const itemData = { ...item };
              delete itemData.accounts;
              return {
                data: itemData,
                children: [{ data: { accounts: item["accounts"] } }],
              };
            }),
    }));
  }
  updateTreeTableData(): void {
    this.treeTableData = this.groupingData(this.holdingArray, 0);
    console.log("threeTableData=====>", this.treeTableData);
  }
}
