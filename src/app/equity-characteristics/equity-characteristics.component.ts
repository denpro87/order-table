import { Component, OnInit } from "@angular/core";

import { CharacteristicsService } from "src/service/characteristicsService";
import { EquityCharacteristics } from "src/types";

@Component({
  selector: "app-equity-characteristics",
  templateUrl: "./equity-characteristics.component.html",
  styleUrls: ["./equity-characteristics.component.scss"],
})
export class EquityCharacteristicsComponent implements OnInit {
  characteristics!: EquityCharacteristics;

  constructor(private characteristicsService: CharacteristicsService) {}

  ngOnInit() {
    this.characteristicsService
      .getCharacteristicsData()
      .then((characteristics) => {
        this.characteristics = characteristics;
      });
  }
}
