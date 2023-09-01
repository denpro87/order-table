import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

import { Holding, Account, Column } from "../../../types";

@Component({
  selector: "app-account-table",
  templateUrl: "./account-table.component.html",
  styleUrls: ["./account-table.component.scss"],
})
export class AccountTableComponent implements OnInit {
  @Input() accounts!: Account[];
  @Output() accountMarketValueChangeEvent = new EventEmitter();
  clonedAccount: { [s: string]: Account } = {};

  accountCols!: Column[];

  constructor() {}

  ngOnInit() {
    this.accountCols = [
      { field: "accountName", header: "Account", filterType: "text" },
      { field: "accountId", header: "Account No.", filterType: "text" },
      { field: "accountType", header: "Account Type", filterType: "text" },
      { field: "programType", header: "Program Type", filterType: "text" },
      { field: "sourceOfInvestment", header: "Source", filterType: "text" },
      { field: "marketValue", header: "Mkt.Value $", filterType: "numeric" },
      { field: "quantity", header: "Qty", filterType: "numeric" },
      { field: "allocationPercent", header: "Alloc. %", filterType: "numeric" },
      { field: "allocation", header: "Alloc. $", filterType: "numeric" },
      { field: "minPurchase", header: "Min. $", filterType: "numeric" },
    ];
  }

  deleteAccount(account: Account) {
    this.accounts = this.accounts.filter(
      (item) => account.accountId !== item.accountId
    );
    this.accountMarketValueChangeEvent.emit({
      diff: -account.allocation,
      accounts: this.accounts,
    });
  }

  onAccountRowEditInit(account: Account) {
    this.clonedAccount[account.accountId as string] = { ...account };
  }

  onAccountRowEditSave(account: Account) {
    const diff =
      account.allocation -
      this.clonedAccount[account.accountId as string].allocation;
    this.accountMarketValueChangeEvent.emit({
      diff,
      accounts: this.accounts,
    });
    delete this.clonedAccount[account.accountId as string];
  }

  onAccountRowEditCancel(account: Account, index: number) {
    this.accounts[index] = this.clonedAccount[account.accountId as string];
    delete this.clonedAccount[account.accountId as string];
  }

  handleHoldingChange(account, index, key) {
    const totalValue = 100000;
    let quantity = account.quantity;
    let allocation = account.allocation;
    let allocationPercent = account.allocationPercent;
    if (key === "quantity") {
      if (quantity * account.price < account.minPurchase) {
        quantity = Math.ceil(account.minPurchase / account.price);
      }
      allocation = quantity * account.price;
      allocationPercent = (allocation / totalValue) * 100;
    } else if (key === "allocation") {
      if (allocation < account.minPurchase) {
        allocation = account.minPurchase;
      }
      quantity = Math.round(allocation / account.price);
      allocationPercent = (allocation / totalValue) * 100;
    } else if (key === "allocationPercent") {
      allocation = (allocationPercent * totalValue) / 100;
      quantity = Math.round(allocation / account.price);
    }
    this.accounts[index] = {
      ...this.accounts[index],
      quantity,
      allocation,
      allocationPercent,
      marketValue: allocation,
    };
  }
}
