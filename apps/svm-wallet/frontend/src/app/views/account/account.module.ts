import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {MatDialogModule} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {AccountComponent} from "./account.component";
import {ActivateComponent} from "./dialogs/activate.component";
import {SetAvatarComponent} from './dialogs/set-avatar.component';

@NgModule({
  declarations: [AccountComponent, ActivateComponent, SetAvatarComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule
  ]
})
export class AccountModule {}
