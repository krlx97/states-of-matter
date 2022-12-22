import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {SvmService} from "services/svm.service";
import {Fungible, UserService} from "services/user.service";
import { FToken } from "../types/f-token.types";

@Component({
  selector: "app-unstaking",
  template: `
    <div mat-dialog-title>Claimable {{token.value.claimable.length}}</div>
    <div mat-dialog-content>
      <mat-card *ngFor="let unstake of token.value.claimable">
        <mat-list>
          <mat-list-item>{{unstake.value}}</mat-list-item>
          <mat-list-item>{{unstake.key * 1000 | date: "long"}}</mat-list-item>
        </mat-list>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="onClaim(unstake.key)">CLAIM</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: []
})
export class UnstakingComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public readonly token: Fungible,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public async onClaim (date: string): Promise<void> {
    const {privateKey} = this._userService;
    const {name, nonce} = this._userService.user.profile;
    const signature = this._svmService.sign(`${nonce}`, privateKey);

    const transaction = await this._svmService.push(
      "claim",
      {name, signature, symbol: {sym: this.token.key.sym, contract: this.token.key.contract}, date}
    ).catch(console.error);

    await this._userService.reloadUser();
  }
}
