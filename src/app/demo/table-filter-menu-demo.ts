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
  selector: "table-filter-menu-demo",
  templateUrl: "table-filter-menu-demo.html",
  styleUrls: ["table-filter-menu-demo.scss"],
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
export class TableFilterMenuDemo implements OnInit {
  selectedTable: string;

  tables = [
    { label: "Customers", value: "customers" },
    { label: "Holdings", value: "holdings" },
  ];

  etfs = [
    {
      ticker: "TQQQ",
      name: "ProShares UltraPro QQQ",
      mer: 1.3,
      allocation: 30,
    },
    {
      ticker: "UPRO",
      name: "ProShares UltraPro S&P500",
      mer: 1.2,
      allocation: 30,
    },
    {
      ticker: "TMF",
      name: "Direxion Treasury Bull 3X",
      mer: 0.5,
      allocation: 40,
    },
  ];

  customers!: TreeNode[];

  customerArray!: Customer[];

  orders!: Order[];

  clonedOrders: { [s: string]: Order } = {};
  sortedCustomers: Customer[]; // Sorted list based on country

  clonedCustomers: { [s: number]: Customer } = {};

  representatives!: Representative[];

  statuses!: any[];

  loading: boolean = true;

  activityValues: number[] = [0, 100];

  cols!: Column[];
  frozenCols!: Column[];
  scrollableCols!: Column[];
  selectedColumns!: Column[];

  weightedMER: number = 0;
  totalAllocation: number = 0;
  showError: boolean = false;

  expandedGroups: string[] = [];
  expandedRowKeys: any[] = [];

  allGroupsExpanded: boolean = false;

  expandedAll: boolean = false;

  groupRowsBy: ["country", "representative.name"];
  multiSortMeta: [
    { field: "country"; order: 1 },
    { field: "representative.name"; order: -1 }
  ];

  treeTableData: any[] = [];
  groupingOptions: any[] = [
    { label: 'Group by Country', value: ['country'] },
    { label: 'Group by Country & Name', value: ['country', 'name'] }
  ];
  selectedGrouping: DropDownOption;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.customerService.getCustomerWithOrders().then((customers) => {
      // this.customers = customers;
      this.loading = false;

      this.customers = customers;
      this.cols = [
        { field: "name", header: "Name", filterType: 'text' },

        { field: "country", header: "Country", filterType: 'text' },

        { field: "representative.name", header: "Agent", filterType: 'text' },

        { field: "date", header: "Date", filterType: 'date' },

        { field: "balance", header: "Balance", filterType: 'numeric' },
      ];
      this.scrollableCols = [
        { field: "country", header: "Country", filterType: 'date' },

        { field: "representative.name", header: "Agent", filterType: 'date' },

        { field: "date", header: "Date", filterType: 'numeric' },

        { field: "balance", header: "Balance", filterType: 'numeric' },
      ];
      this.frozenCols = [{ field: "name", header: "Name", filterType: 'date' }];
      this.selectedColumns = this.scrollableCols;
    });

    this.customerService.getCustomerWithOrdersArray().then((customerArray) => {
      this.customerArray = customerArray;

      // Initialize with default grouping
      this.selectedGrouping = this.groupingOptions[0];
      this.updateTreeTableData();
    });

    this.representatives = [
      { name: "Amy Elsner", image: "amyelsner.png" },
      { name: "Anna Fali", image: "annafali.png" },
      { name: "Asiya Javayant", image: "asiyajavayant.png" },
      { name: "Bernardo Dominic", image: "bernardodominic.png" },
      { name: "Elwin Sharvill", image: "elwinsharvill.png" },
      { name: "Ioni Bowcher", image: "ionibowcher.png" },
      { name: "Ivan Magalhaes", image: "ivanmagalhaes.png" },
      { name: "Onyama Limba", image: "onyamalimba.png" },
      { name: "Stephen Shaw", image: "stephenshaw.png" },
      { name: "Xuxue Feng", image: "xuxuefeng.png" },
    ];

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

  generateWeightedMER() {
    this.totalAllocation = this.etfs.reduce(
      (sum, etf) => sum + etf.allocation,
      0
    );

    if (this.totalAllocation !== 100) {
      this.showError = true;
      return;
    }
    this.showError = false;

    this.weightedMER = this.etfs.reduce(
      (sum, etf) => sum + (etf.mer * etf.allocation) / 100,
      0
    );
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

  onRowEditInit(customer: Customer) {
    this.clonedCustomers[customer.id as number] = { ...customer };
  }

  onRowEditSave(customer: Customer) {
    if (customer.activity > 0) {
      delete this.clonedCustomers[customer.id as number];
      this.messageService.add({
        severity: "success",
        summary: "Success",
        detail: "Customer is updated",
      });
    } else {
      this.messageService.add({
        severity: "error",
        summary: "Error",
        detail: "Invalid Value",
      });
    }
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
    const cloneCustomers = [...this.customers];
    cloneCustomers.forEach((node) => {
      this.expandRecursive(node, this.expandedAll);
    });
    this.customers = cloneCustomers;
  }

  groupByAndSum(list: any[], keys: string[]): any[] {
    if (keys.length === 0) {
      const sum = list.reduce((acc, curr) => {
        acc.total += curr.total; // Assuming 'total' is the field you want to sum
        return acc;
      }, { total: 0 });

      return [{ data: sum, details: list }];
    }

    // Get the first key
    const key = keys[0];

    // Group by the key
    const grouped = list.reduce((acc, curr) => {
      (acc[curr[key]] = acc[curr[key]] || []).push(curr);
      return acc;
    }, {});

    const nextKeys = keys.slice(1);

    // For each group, call the function recursively
    for (const prop in grouped) {
      grouped[prop] = this.groupByAndSum(grouped[prop], nextKeys);
    }

    // Convert the grouped object into an array
    const result = [];
    for (const prop in grouped) {
      const childrenTotal = grouped[prop].reduce((sum, child) => sum + child.data.total, 0);
      result.push({
        data: { name: prop, total: childrenTotal },
        children: grouped[prop]
      });
    }

    return result;
  }

  onGroupingChange(): void {
    this.updateTreeTableData();
  }

  updateTreeTableData(): void {
    this.treeTableData = this.groupByAndSum(this.customerArray, this.selectedGrouping.value);
    console.log("treeTableData: " + JSON.stringify(this.treeTableData));
  }

}
