export * from "./customer";
export * from "./holding";

export interface Column {
  field: string;
  header: string;
  filterType: string;
}

export interface DropDownOption {
  label: string;
  value: string[];
}
