import { Component, Inject } from '@angular/core';
import { FormBuilder, Validators, type FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SvmService } from 'services/svm.service';
import { Fungible, UserService } from 'services/user.service';
import { assetValidator } from 'validators/asset.validator';
import { balanceFeeValidator } from 'validators/balance-fee.validator';
import { balanceValidator } from 'validators/balance.validator';
import { FToken } from '../types/f-token.types';

@Component({
  selector: 'app-unstake',
  template: `
    <div mat-dialog-title>Unstake {{symbol}}</div>

    <div mat-dialog-content>
      <p>
        Unstake your tokens and claim them after 21 days. You will lose your
        vote power and not get any rewards during the vesting period.
      </p>

      <form id="stakeForm" [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="standard">
          <mat-label>Amount</mat-label>
          <input matInput formControlName="amount" type="number">
          <div matSuffix>{{symbol}}</div>
          <mat-error *ngIf="amount.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="amount.hasError('min') && !amount.hasError('assetValid')">
            Minimum 0.0001 {{this.symbol}}
          </mat-error>
          <mat-error *ngIf="amount.hasError('assetValid')">
            Up to four decimal places allowed
          </mat-error>
          <mat-error *ngIf="amount.hasError('balanceValid') && !amount.hasError('assetValid')">
            Insufficient staked
          </mat-error>
          <mat-error *ngIf="amount.hasError('balanceFeeValid') && !amount.hasError('balanceValid')">
            Insufficient balance to pay the fees
          </mat-error>
        </mat-form-field>
      </form>

      <!-- <mat-list dense>
        <mat-list-item>BALANCE<div class="spacer"></div>{{balance}}</mat-list-item>
        <mat-list-item>
          STAKED
          <div class="spacer"></div>
          <a class="set-max" (click)="setMax()">{{staked}}</a>
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>
          FEE
          <div class="spacer"></div>
          0.1000 VMT
        </mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>
          REMAINING
          <div class="spacer"></div>
          {{remaining}}
        </mat-list-item>
      </mat-list> -->

      <mat-list dense>
          <mat-list-item>
            FEE <div class="spacer"></div> 0.1000 TLOS
          </mat-list-item>
          <mat-list-item>
            REMAINING <div class="spacer"></div> {{tlosRemaining}}
          </mat-list-item>
        <!-- </mat-list> -->

        <mat-divider></mat-divider>

        <!-- <mat-list dense> -->
          <mat-list-item>
            UNSTAKE <div class="spacer"></div> {{total}}
          </mat-list-item>
          <mat-list-item>
            REMAINING <div class="spacer"></div> {{remaining}}
          </mat-list-item>
        </mat-list>
      <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

    </div>

    <div mat-dialog-actions>
      <button
        mat-stroked-button
        color="primary"
        form="stakeForm"
        [disabled]="isLoading || form.invalid">
        UNSTAKE
      </button>
    </div>
  `,
  styles: [`
    .set-max {
      color: #448AFF;
      text-decoration: underline;
    }

    button {
      width: 100%;
    }
  `]
})
export class UnstakeComponent {
  public constructor (
    @Inject(MAT_DIALOG_DATA) public readonly token: Fungible,
    private readonly _formBuilder: FormBuilder,
    private readonly _matSnackBar: MatSnackBar,
    public readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public readonly symbol = this.token.key.sym.split(",")[1];

  public readonly form = this._formBuilder.nonNullable.group({
    amount: ["", [
      Validators.required,
      Validators.min(0.0001),
      assetValidator(),
      balanceValidator(this.staked),
      // balanceFeeValidator(this.balance, this._svmService.fees.get("VMT")!)
    ]]
  });

  public isLoading = false;

  public get amount (): FormControl<string> {
    return this.form.controls["amount"];
  }

  public get tlosBalance (): any {
    const tlos = this._userService.user.tokens.fungible.find((liquid) => liquid.key.sym.includes("TLOS"));

    if (!tlos) {
      return "0.0000 TLOS";
    }

    return tlos.value.liquid;
  }

  public get tlosRemaining (): any {
    return (parseFloat(this.tlosBalance) - 0.1).toFixed(4) + " TLOS";
  }

  public get total (): string {
    return `${(parseFloat(this.amount.value ? this.amount.value : "0.0000 VMT")).toFixed(4)} ${this.symbol}`
  }

  public get staked (): any {
    return this.token.value.staked;
  }

  public get balance (): any {
    return this.token.value.liquid;
  }

  public get remaining (): string {
    const {symbol} = this;
    const value = (parseFloat(this.staked) - parseFloat(this.total)).toFixed(4);

    return `${value} ${symbol}`;
  }

  public setMax (): void {
    const x = parseFloat(this.staked).toFixed(4);

    this.amount.setValue(x);
  }

  public async onSubmit (): Promise<void> {
    this.isLoading = true;

    const {_svmService, _userService, form} = this;
    const {amount} = form.value;

    if (!amount) {
      this.isLoading = false;
      return;
    }

    const {privateKey} = _userService;
    const {name, nonce} = _userService.user.profile;
    const signature = _svmService.sign(`${nonce}`, privateKey);
    const token = `${parseFloat(amount).toFixed(4)} ${this.symbol}`;
    const tx = await _svmService.push("unstake", {name, signature, token: {quantity: token, contract: this.token.key.contract}});

    if (!tx) {
      this.isLoading = false;
      return;
    }

    await _userService.reloadUser();

    this._matSnackBar.open(`Successfully staked ${token}`, "OK");
    this.isLoading = false;
  }
}
