import { Component, Input, OnInit } from "@angular/core";

import { Portfolio } from "src/types";

@Component({
  selector: "app-equity-style-table",
  templateUrl: "./equity-style-table.component.html",
  styleUrls: ["./equity-style-table.component.scss"],
})
export class EquityStyleTableComponent implements OnInit {
  @Input() portfolios!: Portfolio[];

  ngOnInit() {}
}
