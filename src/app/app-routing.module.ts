import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { TableFilterMenuDemo } from "src/app/demo/table-filter-menu-demo";
import { HoldingComponent } from "./holding/holding.component";

const routes: Routes = [
  { path: "demo", component: TableFilterMenuDemo },
  { path: "holding", component: HoldingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
