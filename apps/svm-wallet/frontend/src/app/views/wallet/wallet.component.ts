import {Component, OnInit} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {HowToDepositComponent} from "./dialogs/how-to-deposit.component";
import {HowToWithdrawComponent} from "./dialogs/how-to-withdraw.component";
import {UserService} from "services/user.service";
import {SvmService} from "services/svm.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: "app-wallet",
  template: `
    <mat-tab-group mat-stretch-tabs>
      <mat-tab label="Fungible">
        <app-f-tokens [tokens]="tokens"></app-f-tokens>
      </mat-tab>
      <mat-tab label="Non-Fungible">
        <app-nf-tokens></app-nf-tokens>
      </mat-tab>
    </mat-tab-group>
    
  `,
  styles: [`
    .btn--help {
      margin-bottom: var(--spacing);
    }
    .btn--mint {
      width: calc(100% - 1em);
      margin-bottom: 1em;
    }

    app-asset {
      margin-bottom: var(--spacing);
    }

    app-asset:last-child {
      margin-bottom: 0;
    }
  `]
})
export class WalletComponent implements OnInit {
  public constructor (
    private readonly _matDialog: MatDialog,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public tokens: any[] = [];
  public isLoading = false;

  public onHowToDeposit (): void {
    this._matDialog.open(HowToDepositComponent);
  }

  public onHowToWithdraw (): void {
    this._matDialog.open(HowToWithdrawComponent);
  }

  public ngOnInit (): void {
    this._userService.$assets.subscribe((assets) => {
      this.tokens = assets.fungible;
    });
  }
}
