import { Component, Output, EventEmitter } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: "app-column-filter",
  templateUrl: "./column-filter.component.html",
  styleUrls: ["./column-filter.component.scss"],
})
export class ColumnFilterComponent {
  @Output() columnsChangeEvent = new EventEmitter<string[]>();

  defaultNodes: any[] = [
    {
      key: "0",
      label: "Security Identifiers",
      children: [
        {
          key: "holdingName",
          label: "Name",
          disabled: true,
        },
      ],
    },
    {
      key: "1",
      label: "Cost & Market Value Data",
      children: [
        {
          key: "allocationP",
          label: "Allocation (%)",
        },
        {
          key: "allocation",
          label: "Allocation ($)",
        },
        {
          key: "price",
          label: "Price",
        },
        {
          key: "quantity",
          label: "Quantity",
        },
        {
          key: "marketValue",
          label: "Market Value",
        },
      ],
    },
    {
      key: "2",
      label: "Additional Data",
      children: [
        {
          key: "portfolioPercent",
          label: "% of portfolio",
        },
        {
          key: "classPercent",
          label: "% of class",
        },
      ],
    },
  ];
  nodes!: any[];
  formGroup: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder) {
    this.formGroup = this.formBuilder.group({
      search: "",
      columns: this.formBuilder.group({
        holdingName: new FormControl({ value: true, disabled: true }),
        allocationP: new FormControl({ value: true, disabled: true }),
        allocation: new FormControl({ value: true, disabled: true }),
        price: true,
        quantity: true,
        marketValue: true,
        portfolioPercent: true,
        classPercent: true,
      }),
    });
    this.nodes = [...this.defaultNodes];
    this.formGroup.controls["search"].valueChanges.subscribe((value) => {
      const clonedNodes = [...this.defaultNodes];
      this.nodes = clonedNodes
        .map((node) => ({
          ...node,
          children: node.children.filter((child) =>
            child.label.toLowerCase().includes(value.toLowerCase())
          ),
        }))
        .filter((node) => node.children.length);
    });
    this.formGroup.controls["columns"].valueChanges.subscribe((values) => {
      this.onColumnsChange(
        Object.entries(values)
          .filter(([key, value]) => value)
          .map(([key]) => key)
      );
    });
  }

  resetToDefault() {
    this.nodes = [...this.defaultNodes];
    this.formGroup.patchValue({
      search: "",
      holdingName: true,
      allocationP: true,
      allocation: true,
      price: true,
      quantity: true,
      marketValue: true,
      portfolioPercent: true,
      classPercent: true,
    });
  }

  onColumnsChange(columns: string[]) {
    const defaultColumns = ["holdingName", "allocationP", "allocation"];
    this.columnsChangeEvent.emit([...defaultColumns, ...columns]);
  }
}
