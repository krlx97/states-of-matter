import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SvmService } from 'services/svm.service';
import { UserService } from 'services/user.service';
import { HowToDepositComponent } from './dialogs/how-to-deposit.component';
import { HowToWithdrawComponent } from './dialogs/how-to-withdraw.component';
import { FToken } from './types/f-token.types';

@Component({
  selector: 'app-f-tokens',
  template: `
    <button class="btn--mint" mat-stroked-button color="primary" (click)="airdrop()" [disabled]="isLoading">
      AIRDROP - 1000.0000 VMT
    </button>
    <mat-progress-bar
      *ngIf="isLoading"
      mode="indeterminate"
    ></mat-progress-bar>

    <div class="wallet">
      <button mat-icon-button [matMenuTriggerFor]="menu" class="btn--help">
        <mat-icon>help</mat-icon>
      </button>

      <!-- <mat-card class="asset">
        <mat-card-header>
          <img mat-card-avatar src="assets/tokens/TLOS.png"/>
          <mat-card-title>Telos TLOS</mat-card-title>
          <mat-card-subtitle>Telos network token</mat-card-subtitle>
          <div class="spacer"></div>
          <button mat-icon-button [matMenuTriggerFor]="moreMenu">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #moreMenu>
            <button mat-menu-item>
              <mat-icon>explore</mat-icon> EXPLORE
            </button>
            <button mat-menu-item>TRANSFER</button>
          </mat-menu>
        </mat-card-header>
        <mat-card-content>
          <mat-list>
            <mat-list-item>
              LIQUID<div class="spacer"></div>10.0000 TLOS
            </mat-list-item>
          </mat-list>
        </mat-card-content>
      </mat-card> -->
      <app-f-token *ngFor="let token of tokens" [token]="token"></app-f-token>
    </div>

    <mat-menu #menu="matMenu">
      <button mat-menu-item (click)="onHowToDeposit()">
        How to deposit?
      </button>
      <button mat-menu-item (click)="onHowToWithdraw()">
        How to withdraw?
      </button>
    </mat-menu>
  `,
  styles: [`
    .wallet {
      padding: var(--spacing);
    }

    .asset {
      margin-bottom: 1em;
    }
  `]
})
export class FTokensComponent implements OnInit {
  public constructor (
    private readonly _matDialog: MatDialog,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  @Input() public tokens: FToken[] = [];

  public isLoading = false;

  public onHowToDeposit (): void {
    this._matDialog.open(HowToDepositComponent, {width: "316px"});
  }

  public onHowToWithdraw (): void {
    this._matDialog.open(HowToWithdrawComponent, {width: "316px"});
  }

  public async airdrop (): Promise<void> {
    const {_svmService, _userService} = this;
    const {name} = _userService.user.profile;

    this.isLoading = true;

    const transaction = await _svmService.push("tokenairdrop", {name}).catch(console.log);

    if (!transaction) {
      this.isLoading = false;
    }

    this.isLoading = false;
  }

  ngOnInit(): void {
  }
}
