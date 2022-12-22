import {Component, Inject} from "@angular/core";
import {FormBuilder, Validators, type FormControl} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {Fungible, UserService} from "services/user.service";
import {assetValidator} from "validators/asset.validator";
import {balanceFeeValidator} from "validators/balance-fee.validator";
import {balanceValidator} from "validators/balance.validator";
import { FToken } from "../types/f-token.types";

@Component({
  selector: "app-stake",
  template: `
    <div mat-dialog-title>Stake {{symbol}}</div>
    <div mat-dialog-content>
      <p>
        Stake {{symbol}} to receive daily rewards and increase your game voting
        power
      <p>
      <form id="stakeForm" [formGroup]="form" (ngSubmit)="onSubmit()">
        <mat-form-field appearance="standard">
          <mat-label>Amount</mat-label>
          <input matInput formControlName="amount" type="number">
          <a matSuffix class="set-max" (click)="setMax()">MAX</a>
          <mat-error *ngIf="amount.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="amount.hasError('min') && !amount.hasError('assetValid')">
            Minimum 0.0001 {{symbol}}
          </mat-error>
          <mat-error *ngIf="amount.hasError('assetValid')">
            Up to four decimal places allowed
          </mat-error>
          <mat-error *ngIf="amount.hasError('balanceValid') && !amount.hasError('assetValid')">
            Insufficient balance
          </mat-error>
          <mat-error *ngIf="amount.hasError('balanceFeeValid') && !amount.hasError('balanceValid') && !amount.hasError('assetValid')">
            Insufficient balance to pay the fees
          </mat-error>
        </mat-form-field>
      </form>


      <!-- <mat-list dense>
        <mat-list-item>BALANCE<div class="spacer"></div><a class="set-max" (click)="setMax()">{{balance}}</a></mat-list-item>
        <mat-list-item>STAKED<div class="spacer"></div>{{staked}}</mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>STAKE<div class="spacer"></div>{{amount.value ? amount.value : "0.0000"}} {{token.symbol}}</mat-list-item>
        <mat-list-item>FEE<div class="spacer"></div>0.1000 VMT</mat-list-item>
        <mat-list-item>TOTAL<div class="spacer"></div>{{total ? total : "0.1000 VMT"}}</mat-list-item>
        <mat-divider></mat-divider>
        <mat-list-item>REMAINING<div class="spacer"></div>{{remaining}} {{token.symbol}}</mat-list-item>
      </mat-list> -->
      <!-- <div class="cards"> -->
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
            STAKE <div class="spacer"></div> {{total}}
          </mat-list-item>
          <mat-list-item>
            REMAINING <div class="spacer"></div> {{remaining}} {{symbol}}
          </mat-list-item>
        </mat-list>
      <!-- </div> -->


      <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>
    </div>
    <div mat-dialog-actions>
      <button
        mat-stroked-button
        color="primary"
        form="stakeForm"
        [disabled]="isLoading || form.invalid">
        STAKE
      </button>
    </div>
  `,
  styles: [`
    .set-max {
      color: #448AFF;
      cursor: pointer;
      text-decoration: underline;
    }

    button {
      width: 100%;
    }

    mat-list {
      padding-top: 0;
      margin-top: var(--spacing);
    }
  `]
})
export class StakeComponent {
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
      balanceValidator(this.balance),
      // balanceFeeValidator(this.balance, this.fee)
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

  public get fee (): string {
    const fee = this._svmService.fees.get(this.symbol);

    if (!fee) {
      return "";
    }

    return fee;
  }

  public get total (): string {
    const {value} = this.amount;
    const {symbol} = this;
    const zero = `0.0000 ${symbol}`;
    const fee = this._svmService.fees.get(symbol);

    return `${(parseFloat(value ? value : zero)).toFixed(4)} ${symbol}`
  }

  public get staked (): any {
    return this.token.value.staked;
  }

  public get balance (): any {
    return this.token.value.liquid;
  }

  public get remaining (): string {
    return (parseFloat(this.balance) - parseFloat(this.amount.value ? this.amount.value : "0.0000 VMT")).toFixed(4);
  }

  public setMax (): void {
    const x = (parseFloat(this.amount.value ? this.amount.value : "0.0000 VMT") + parseFloat(this.remaining)).toFixed(4);

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
    const tx = await _svmService.push("stake", {name, signature, token: {quantity: token, contract: this.token.key.contract}});

    if (!tx) {
      this.isLoading = false;
      return;
    }

    await _userService.reloadUser();

    this._matSnackBar.open(`Successfully staked ${token}`, "OK");
    this.isLoading = false;
  }
}
