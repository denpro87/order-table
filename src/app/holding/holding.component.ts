import { Component, OnInit, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import * as FileSaver from "file-saver";
import { MessageService, TreeNode } from "primeng/api";

import { Table } from "primeng/table";
import { Customer, Order, Representative } from "../../domain/customer";
import { CustomerService } from "../../service/customerservice";

interface Column {
  field: string;
  header: string;
  filterType: string;
}

interface DropDownOption {
  label: string;
  value: string[];
}

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
  customers!: TreeNode[];

  customerArray!: Customer[];

  orders!: Order[];

  clonedOrders: { [s: string]: Order } = {};
  sortedCustomers: Customer[]; // Sorted list based on country

  clonedCustomers: { [s: number]: Customer } = {};

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  cols!: Column[];
  frozenCols!: Column[];
  scrollableCols!: Column[];
  selectedColumns!: Column[];

  showError: boolean = false;

  expandedGroups: string[] = [];
  expandedRowKeys: any[] = [];

  expandedAll: boolean = false;

  treeTableData: any[] = [];
  groupingOptions: any[] = [
    { label: "Group by Country", value: ["country"] },
    { label: "Group by Country & Name", value: ["country", "name"] },
  ];
  selectedGrouping: DropDownOption;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.customerService.getCustomerWithOrdersArray().then((customerArray) => {
      this.loading = false;
      this.customerArray = customerArray;
      this.cols = [
        { field: "name", header: "Name", filterType: "text" },

        { field: "country", header: "Country", filterType: "text" },

        { field: "representative.name", header: "Agent", filterType: "text" },

        { field: "date", header: "Date", filterType: "date" },

        { field: "balance", header: "Balance", filterType: "numeric" },
      ];
      this.scrollableCols = [
        { field: "country", header: "Country", filterType: "text" },

        { field: "representative.name", header: "Agent", filterType: "text" },

        { field: "date", header: "Date", filterType: "date" },

        { field: "balance", header: "Balance", filterType: "numeric" },
      ];
      this.frozenCols = [{ field: "name", header: "Name", filterType: "text" }];
      this.selectedColumns = this.scrollableCols;

      // Initialize with default grouping
      this.selectedGrouping = this.groupingOptions[0];
      this.updateTreeTableData();
    });

    this.statuses = [
      { label: "Unqualified", value: "unqualified" },
      { label: "Qualified", value: "qualified" },
      { label: "New", value: "new" },
      { label: "Negotiation", value: "negotiation" },
      { label: "Renewal", value: "renewal" },
      { label: "Proposal", value: "proposal" },
    ];
  }

  clear(table: Table) {
    table.clear();
  }

  getSeverity(status: string) {
    switch (status.toLowerCase()) {
      case "unqualified":
        return "danger";

      case "qualified":
        return "success";

      case "new":
        return "info";

      case "negotiation":
        return "warning";

      case "renewal":
        return null;
    }
  }

  exportExcel() {
    import("xlsx").then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.customerArray);
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

  deleteOrder(id: string) {
    this.orders = this.orders.filter((order) => order.id !== id);
  }

  onOrderRowEditInit(order: Order) {
    this.clonedOrders[order.id as string] = { ...order };
  }

  onOrderRowEditSave(order: Order) {
    delete this.clonedOrders[order.id as string];
  }

  onOrderRowEditCancel(order: Order, index: number) {
    this.orders[index] = this.clonedOrders[order.id as string];
    delete this.clonedOrders[order.id as string];
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
        name: group,
        balance: value.reduce((accumulator, object) => {
          return accumulator + object.balance;
        }, 0),
      },
      children:
        deep < this.selectedGrouping.value.length - 1
          ? this.groupingData(value, deep + 1)
          : value.map((item) => {
              const itemData = { ...item };
              delete itemData.orders;
              return {
                data: itemData,
                children: [{ data: { orders: item["orders"] } }],
              };
            }),
    }));
  }
  updateTreeTableData(): void {
    this.treeTableData = this.groupingData(this.customerArray, 0);
    console.log("threeTableData=====>", this.treeTableData);
  }
}
