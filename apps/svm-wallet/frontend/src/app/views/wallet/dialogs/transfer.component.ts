import {Component, Inject} from "@angular/core";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {Fungible, UserService} from "services/user.service";
import {assetValidator} from "validators/asset.validator";
import {balanceFeeValidator} from "validators/balance-fee.validator";
import {balanceValidator} from "validators/balance.validator";
import {nameValidator} from "validators/name.validator";
import { FToken } from "../types/f-token.types";

@Component({
  selector: "app-transfer",
  template: `
    <div mat-dialog-title>Transfer {{symbol}}</div>
    <div mat-dialog-content>

      <form id="transferForm" [formGroup]="form" (ngSubmit)="onSubmit()">

        <mat-form-field appearance="standard">
          <mat-label>To</mat-label>
          <input matInput formControlName="to"/>
          <mat-error *ngIf="to.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="to.hasError('minlength')">
            Must contain at least 3 characters
          </mat-error>
          <mat-error *ngIf="to.hasError('maxlength')">
            Mustn't contain more than 12 characters
          </mat-error>
          <mat-error *ngIf="!to.hasError('minlength') && !to.hasError('maxlength') && to.hasError('nameValid')">
            Must only contain a-z characters, 1-5 numbers and . symbol
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="standard">
          <mat-label>Quantity</mat-label>
          <input matInput formControlName="amount" type="number"/>
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

        <mat-form-field appearance="standard">
          <mat-label>Memo</mat-label>
          <input matInput formControlName="memo">
          <mat-error *ngIf="memo.hasError('maxlength')">
            256 characters maximum
          </mat-error>
        </mat-form-field>

        <mat-checkbox formControlName="isWithdraw">
          Send to Telos account
        </mat-checkbox>

      </form>

      <div class="cards">
        <mat-list dense>
          <mat-list-item>
            FEE <div class="spacer"></div> 0.1000 TLOS
          </mat-list-item>
          <mat-list-item>
            REMAINING <div class="spacer"></div> {{tlosRemaining}}
          </mat-list-item>
        </mat-list>

        <mat-divider></mat-divider>

        <mat-list dense>
          <mat-list-item>
            TRANSFER <div class="spacer"></div> {{total}}
          </mat-list-item>
          <mat-list-item>
            REMAINING <div class="spacer"></div> {{remaining}} {{symbol}}
          </mat-list-item>
        </mat-list>
      </div>

      <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

    </div>
    <div mat-dialog-actions>
      <button
        mat-stroked-button
        color="primary"
        form="transferForm"
        [disabled]="isLoading || form.invalid">
        TRANSFER
      </button>
    </div>
  `,
  styles: [`
    button {
      width: 100%;
    }

    .set-max {
      color: #448AFF;
      cursor: pointer;
    }
  `]
})
export class TransferComponent {
  public constructor (
    @Inject(MAT_DIALOG_DATA) public readonly token: Fungible,
    private readonly _formBuilder: FormBuilder,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public readonly symbol = this.token.key.sym.split(",")[1];

  public readonly form = this._formBuilder.nonNullable.group({
    to: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(12),
      nameValidator()
    ]],
    amount: ["", [
      Validators.required,
      Validators.min(0.0001),
      assetValidator(),
      balanceValidator(this.balance),
      // balanceFeeValidator(this.balance, this._svmService.fees.get("VMT")!)
    ]],
    memo: ["", [
      Validators.maxLength(256)
    ]],
    isWithdraw: [false, []]
  });

  public isLoading = false;

  public get to (): FormControl<string> {
    return this.form.controls["to"];
  }

  public get amount (): FormControl<string> {
    return this.form.controls["amount"];
  }

  public get memo (): FormControl<string> {
    return this.form.controls["memo"];
  }

  public get total (): string {
    return `${(parseFloat(this.amount.value ? this.amount.value : "0.0000")).toFixed(4)} ${this.symbol}`
  }

  public get staked (): any {
    return this.token.value.staked;
  }

  public get balance (): any {
    return this.token.value.liquid;
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

  public get quantity (): any {
    return this.amount.value ? parseFloat(this.amount.value).toFixed(4) : "0.0000";
  }

  public get remaining (): string {
    return (parseFloat(this.balance) - parseFloat(this.amount.value ? this.amount.value : "0.0000 VMT")).toFixed(4);
  }

  public setMax (): void {
    const max = (parseFloat(this.amount.value ? this.amount.value : "0.0000 VMT") + parseFloat(this.remaining)).toFixed(4);

    this.amount.setValue(max);
  }

  public async onSubmit (): Promise<void> {
    this.isLoading = true;

    const {_svmService, _userService, form} = this;
    const {to, amount, memo, isWithdraw} = form.value;
    const {privateKey} = _userService;
    const {name, nonce} = _userService.user.profile;
    const from = name;
    const signature = _svmService.sign(`${nonce}`, privateKey);

    if (!to || !amount) {
      this.isLoading = false;
      return;
    }

    const quantity = `${parseFloat(amount).toFixed(4)} ${this.symbol}`;

    const handle = (error: any): void => {
      this._matSnackBar.open(error, "", {duration: 7000});
    };

    const transaction = await _svmService.push(
      "transfer",
      {from, to, quantity: {quantity, contract: this.token.key.contract}, memo, signature, isWithdraw}
    ).catch(handle);

    if (!transaction) {
      this.isLoading = false;
      return;
    }

    await _userService.reloadUser();

    this._matSnackBar.open(`Sent ${quantity} to ${to}`, "OK");
    this.isLoading = false;
  }
}
