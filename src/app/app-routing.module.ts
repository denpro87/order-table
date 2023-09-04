import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TableFilterMenuDemo } from "src/app/demo/table-filter-menu-demo";
import { HoldingComponent } from "./holding/holding.component";
import { EditAccountComponent } from "./edit-account/edit-account.component";
import { EquityCharacteristicsComponent } from "./equity-characteristics/equity-characteristics.component";

const routes: Routes = [
  { path: "demo", component: TableFilterMenuDemo },
  { path: "holding", component: HoldingComponent },
  { path: "edit-account", component: EditAccountComponent },
  { path: "characteristics", component: EquityCharacteristicsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
