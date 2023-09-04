import { Component, Input, OnInit } from "@angular/core";

import { Portfolio } from "src/types";
@Component({
  selector: "app-equity-style",
  templateUrl: "./equity-style.component.html",
  styleUrls: ["./equity-style.component.scss"],
})
export class EquityStyleComponent implements OnInit {
  @Input() portfolios!: Portfolio[];
  ngOnInit() {}
}
