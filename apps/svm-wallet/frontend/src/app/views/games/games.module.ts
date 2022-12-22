import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";
import {NgChartsModule} from "ng2-charts";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDividerModule} from "@angular/material/divider";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatTabsModule} from "@angular/material/tabs";
import {GameComponent} from "./game.component";
import {GamesComponent} from "./games.component";
import {MatSnackBarModule} from "@angular/material/snack-bar";

@NgModule({
  declarations: [GameComponent, GamesComponent],
  imports: [
    CommonModule,
    RouterModule,
    NgChartsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatSnackBarModule
  ]
})
export class GamesModule {}
