import {Component} from "@angular/core";
import {FormBuilder, Validators, type FormControl} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {passwordValidator} from "validators/password.validator";
import {privateKeyValidator} from "validators/private-key.validator";

@Component({
  selector: "app-recover",
  template: `
    <div class="recover">
      <p>
        Recover your account in case you forgot your password or have cleared
        your browser data.
      </p>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <mat-form-field appearance="outline">
          <mat-label>Private Key</mat-label>
          <input matInput formControlName="privateKey"/>
          <mat-error *ngIf="privateKey.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="privateKey.hasError('privateKeyValid')">
            Invalid private key
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>New password</mat-label>
          <input matInput formControlName="password" [type]="passwordType"/>
          <button mat-icon-button matSuffix type="button" (click)="onTogglePasswordVisible()">
            <mat-icon>{{passwordSuffixIcon}}</mat-icon>
          </button>
          <mat-error *ngIf="password.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="password.hasError('minlength')">
            Must contain at least 6 characters
          </mat-error>
          <mat-error *ngIf="!password.hasError('minlength') && password.hasError('passwordValid')">
            Must contain at least one lower case, upper case and numeric
            character
          </mat-error>
        </mat-form-field>

        <button mat-stroked-button color="primary" [disabled]="form.invalid">
          RECOVER
        </button>

      </form>
    </div>
  `,
  styles: [`
    mat-form-field {
      margin-bottom: var(--spacing);
    }

    .recover {
      padding: var(--spacing);
    }
  `]
})
export class RecoverComponent {
  public constructor (
    private readonly _formBuilder: FormBuilder,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService
  ) {}

  public readonly form = this._formBuilder.nonNullable.group({
    privateKey: ["", [
      Validators.required,
      privateKeyValidator(this._svmService)
    ]],
    password: ["", [
      Validators.required,
      Validators.minLength(6),
      passwordValidator()
    ]]
  });

  public isPasswordVisible = false;

  public get privateKey (): FormControl<string> {
    return this.form.controls["privateKey"];
  }

  public get password (): FormControl<string> {
    return this.form.controls["password"];
  }

  public get passwordType (): string {
    return this.isPasswordVisible ? "text" : "password";
  }

  public get passwordSuffixIcon (): string {
    return this.isPasswordVisible ? "visibility" : "visibility_off";
  }

  public onTogglePasswordVisible (): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  public onSubmit (): void {
    const {_matSnackBar, _svmService , form} = this;
    const {privateKey, password} = form.value;

    if (!privateKey || !password) { return; }

    const privateKeyHash = _svmService.encrypt(privateKey, password);

    localStorage.setItem("privateKeyHash", privateKeyHash);
    _matSnackBar.open("Recovery successfull, you can now signin", "OK");
  }
}
