import {Component, Input} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {ExploreComponent} from "./dialogs/explore.component";
import {StakeComponent} from "./dialogs/stake.component";
import {TransferComponent} from "./dialogs/transfer.component";
import {UnstakeComponent} from "./dialogs/unstake.component";
import {UnstakingComponent} from "./dialogs/unstaking.component";
import type {FToken} from "./types/f-token.types";

@Component({
  selector: "app-f-token",
  template: `
    <mat-card>
      <mat-card-header>
        <img mat-card-avatar [src]="icon"/>
        <mat-card-title>{{token.key.contract}}</mat-card-title>
        <mat-card-subtitle>{{token.value.total}}</mat-card-subtitle>
        <div class="spacer"></div>
        <button mat-icon-button [matMenuTriggerFor]="moreMenu">
          <mat-icon>more_vert</mat-icon>
        </button>
        <mat-menu #moreMenu>
          <button mat-menu-item (click)="onExplore()">EXPLORE</button>
          <button mat-menu-item (click)="onTransfer()">TRANSFER</button>
          <button mat-menu-item (click)="onStake()">STAKE</button>
          <button mat-menu-item (click)="onUnstake()">UNSTAKE</button>
          <button mat-menu-item (click)="onUnstaking()">UNSTAKING</button>
        </mat-menu>
      </mat-card-header>
      <mat-card-content>
        <mat-list dense>
          <mat-list-item>
            LIQUID<div class="spacer"></div>{{token.value.liquid}}
          </mat-list-item>
          <mat-list-item>
            STAKED<div class="spacer"></div>{{token.value.staked}}
          </mat-list-item>
          <mat-list-item>
            UNSTAKING<div class="spacer"></div>{{token.value.unstaking}}
          </mat-list-item>
        </mat-list>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    mat-card {
      margin-bottom: 1em;
    }
  `]
})
export class FTokenComponent {
  public constructor (private readonly _matDialog: MatDialog) {}

  @Input() public token!: any;

  public get icon (): string {
    return `assets/tokens/${this.token.key.sym.split(",")[1]}.png`;
  }

  public onExplore (): void {
    this._matDialog.open(ExploreComponent, {data: this.token, width: "320px"});
  }

  public onTransfer (): void {
    this._matDialog.open(TransferComponent, {data: this.token, width: "320px"});
  }

  public onStake (): void {
    this._matDialog.open(StakeComponent, {data: this.token, width: "320px"});
  }

  public onUnstake (): void {
    this._matDialog.open(UnstakeComponent, {data: this.token, width: "320px"});
  }

  public onUnstaking (): void {
    this._matDialog.open(UnstakingComponent, {data: this.token, width: "320px"});
  }
}
