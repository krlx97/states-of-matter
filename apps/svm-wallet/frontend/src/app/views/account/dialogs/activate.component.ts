import {Component} from "@angular/core";
import {MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {UserService} from "services/user.service";

@Component({
  selector: "app-activate",
  template: `
    <h3 mat-dialog-title>Activate account</h3>
    <mat-dialog-content>
      In order to withdraw assets to a Telos account or to an exchange, you'll
      need to activate your Eternitas account. This costs 10 TLOS and is a one
      time fee. You can also activate the account with assets earned from
      playing.
      <br/>
      <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-stroked-button
        color="primary"
        [disabled]="isLoading"
        (click)="onActivate()">
        ACTIVATE (10 TLOS)
      </button>
      <button mat-button mat-dialog-close>CLOSE</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ActivateComponent {
  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    private readonly _matDialogRef: MatDialogRef<ActivateComponent>,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public isLoading = false;

  public async onActivate (): Promise<void> {
    this.isLoading = true;

    const handle = (error: any): void => {
      this._matSnackBar.open(error, "OK");
    };

    const {privateKey} = this._userService;
    const {name, nonce} = this._userService.user.profile;
    const signature = this._svmService.sign(`${nonce}`, privateKey);
    const transaction = await this
      ._svmService
      .push("activate", {name, signature})
      .catch(handle);

    // const transaction = await this._svmService.api.transact({
    //   actions: [{
    //     account: "eternisvm121",
    //     name: "activate",
    //     authorization: [{
    //       actor: "eternisvm121",
    //       permission: "active"
    //     }],
    //     data: {name, signature}
    //   }]
    // }, {
    //   blocksBehind: 3,
    //   expireSeconds: 30
    // }).catch(handle);

    if (!transaction) {
      this.isLoading = false;
      return;
    }

    await this._userService.reloadUser().catch(handle);

    this._matSnackBar.open("Account activated successfully.", "OK");
    this.isLoading = false;
    this._matDialogRef.close();
  }
}
