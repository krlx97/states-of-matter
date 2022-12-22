import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SvmService } from 'services/svm.service';
import { UserService } from 'services/user.service';
import { assetValidator } from 'validators/asset.validator';
import { balanceValidator } from 'validators/balance.validator';
import { nameValidator } from 'validators/name.validator';
import { NfToken } from '../types/nf-token.types';

@Component({
  selector: 'app-transfer-item',
  template: `
    <div mat-dialog-title>Transfer {{token.serial}}</div>

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

        <mat-checkbox formControlName="isWithdraw">
          Send to Telos account
        </mat-checkbox>

      </form>

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
  `]
})
export class TransferItemComponent {
  public constructor (
    @Inject(MAT_DIALOG_DATA) public readonly token: NfToken,
    private readonly _formBuilder: FormBuilder,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public readonly form = this._formBuilder.nonNullable.group({
    to: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(12),
      nameValidator()
    ]],
    isWithdraw: [false, []]
  });

  public isLoading = false;

  public get to (): FormControl<string> {
    return this.form.controls["to"];
  }

  public async onSubmit (): Promise<void> {
    this.isLoading = true;

    const {_svmService, _userService, form} = this;
    const {to, isWithdraw} = form.value;
    const {privateKey} = _userService;
    const {name, nonce} = _userService.user.profile;
    const from = name;
    const serials = [this.token.serial];
    const signature = _svmService.sign(`${nonce}`, privateKey);
    const memo = "svm frontend";

    if (!to) {
      this.isLoading = false;
      return;
    }


    const handle = (error: any): void => {
      this._matSnackBar.open(error, "", {duration: 7000});
    };

    const transaction = await _svmService.push(
      "transferitem",
      {from, to, serials, memo, signature, isWithdraw}
    ).catch(handle);

    if (!transaction) {
      this.isLoading = false;
      return;
    }

    await _userService.reloadUser();

    this._matSnackBar.open(`Sent ${this.token.serial} to ${to}`, "OK");
    this.isLoading = false;
  }
}
