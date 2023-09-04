import { Component, Input, OnInit } from "@angular/core";

import { Portfolio } from "src/types";

@Component({
  selector: "app-equity-style-box",
  templateUrl: "./equity-style-box.component.html",
  styleUrls: ["./equity-style-box.component.scss"],
})
export class EquityStyleBoxComponent implements OnInit {
  @Input() portfolios!: Portfolio[];

  ngOnInit() {}
}
