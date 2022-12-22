import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";

import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialogModule} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatTabsModule} from '@angular/material/tabs';
import {MatToolbarModule} from "@angular/material/toolbar";

import {HowToDepositComponent} from "./dialogs/how-to-deposit.component";
import {HowToWithdrawComponent} from "./dialogs/how-to-withdraw.component";
import {TransferComponent} from "./dialogs/transfer.component";
import {WalletComponent} from "./wallet.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatListModule } from "@angular/material/list";
import {MatExpansionModule} from '@angular/material/expansion';
import { StakeComponent } from './dialogs/stake.component';
import { UnstakeComponent } from './dialogs/unstake.component';
import { ExploreComponent } from './dialogs/explore.component';
import {NgChartsModule} from "ng2-charts";
import { TransferItemComponent } from './dialogs/transfer-item.component';
import { UnstakingComponent } from './dialogs/unstaking.component';
import { FTokensComponent } from './f-tokens.component';
import { FTokenComponent } from './f-token.component';
import { NfTokenComponent } from './nf-token.component';
import { NfTokensComponent } from './nf-tokens.component';

@NgModule({
  declarations: [
    HowToDepositComponent,
    HowToWithdrawComponent,
    TransferComponent,
    WalletComponent,
    StakeComponent,
    UnstakeComponent,
    ExploreComponent,
    TransferItemComponent,
    UnstakingComponent,
    FTokensComponent,
    FTokenComponent,
    NfTokenComponent,
    NfTokensComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressBarModule,
    MatTabsModule,
    MatToolbarModule,
    NgChartsModule
  ]
})
export class WalletModule {}
