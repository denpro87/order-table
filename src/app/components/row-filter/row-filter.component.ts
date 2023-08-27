import { Component, Input, Output, EventEmitter, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";

@Component({
  selector: "app-row-filter",
  templateUrl: "./row-filter.component.html",
  styleUrls: ["./row-filter.component.scss"],
})
export class RowFilterComponent implements OnInit {
  @Input() filterOptions: any[];
  @Output() filterChangeEvent = new EventEmitter<string[]>();

  nodes!: any[];
  formGroup: FormGroup | undefined;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const columnsGroup = this.formBuilder.group({});
    for (const group of this.filterOptions) {
      for (const child of group.children) {
        columnsGroup.addControl(
          child.key,
          new FormControl({ value: false, disabled: false })
        );
      }
    }
    this.formGroup = this.formBuilder.group({
      search: "",
      columns: columnsGroup,
    });
    this.nodes = [...this.filterOptions];
    this.formGroup.controls["search"].valueChanges.subscribe((value) => {
      const clonedNodes = [...this.filterOptions];
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
    this.nodes = [...this.filterOptions];
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

  onColumnsChange(filters: string[]) {
    this.filterChangeEvent.emit(filters);
  }
}
