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
    const optionsGroup = this.getDefaultOptionsGroup();
    this.formGroup = this.formBuilder.group({
      search: "",
      options: optionsGroup,
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
    this.formGroup.controls["options"].valueChanges.subscribe((values) => {
      this.onOptionsChange(
        Object.entries(values)
          .filter(([key, value]) => value)
          .map(([key]) => key)
      );
    });
  }

  getDefaultOptionsGroup() {
    const optionsGroup = this.formBuilder.group({});
    for (const group of this.filterOptions) {
      for (const child of group.children) {
        optionsGroup.addControl(
          child.key,
          new FormControl({ value: false, disabled: false })
        );
      }
    }
    return optionsGroup;
  }

  resetToDefault() {
    this.nodes = [...this.filterOptions];
    this.formGroup.patchValue({
      search: "",
    });
    const defaultValues = {};
    for (const group of this.filterOptions) {
      for (const child of group.children) {
        defaultValues[child.key] = false;
      }
    }
    this.formGroup.controls["options"].patchValue(defaultValues);
  }

  onOptionsChange(filters: string[]) {
    this.filterChangeEvent.emit(filters);
  }
}
