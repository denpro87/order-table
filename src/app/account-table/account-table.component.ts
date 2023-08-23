import { Component, OnInit, Input } from "@angular/core";

import { Holding, Account, Column } from "../../types";

@Component({
  selector: "app-account-table",
  templateUrl: "./account-table.component.html",
  styleUrls: ["./account-table.component.scss"],
})
export class AccountTableComponent implements OnInit {
  @Input() accounts!: Account[];
  clonedAccount: { [s: string]: Account } = {};

  accountCols!: Column[];
  accountScrollableCols!: Column[];
  accountFrozenCols!: Column[];

  constructor() {}

  ngOnInit() {
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
}
