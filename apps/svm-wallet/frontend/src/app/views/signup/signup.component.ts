import {Component} from "@angular/core";
import {FormBuilder, Validators, type FormControl} from "@angular/forms";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {nameValidator} from "validators/name.validator";
import {passwordValidator} from "validators/password.validator";

@Component({
  selector: "app-signup",
  template: `
    <div class="signup">
      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput formControlName="name">
          <mat-error *ngIf="name.hasError('required')">
            Mustn't be empty
          </mat-error>
          <mat-error *ngIf="name.hasError('minlength')">
            Must contain at least 3 characters
          </mat-error>
          <mat-error *ngIf="name.hasError('maxlength')">
            Mustn't contain more than 12 characters
          </mat-error>
          <mat-error *ngIf="!name.hasError('minlength') && !name.hasError('maxlength') && name.hasError('nameValid')">
            Must only contain a-z characters, 1-5 numbers and . symbol
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Password</mat-label>
          <input matInput formControlName="password" [type]="passwordType">
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

        <button mat-stroked-button color="primary" [disabled]="form.invalid || isLoading">
          SIGNUP
        </button>

        <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

      </form>
    </div>
  `,
  styles: [`
    mat-form-field, button {
      margin-bottom: var(--spacing);
    }

    .signup {
      padding: var(--spacing);
    }
  `]
})
export class SignupComponent {
  public constructor (
    private readonly _formBuilder: FormBuilder,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService
  ) {}

  public readonly form = this._formBuilder.nonNullable.group({
    name: ["", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(12),
      nameValidator()
    ]],
    password: ["", [
      Validators.required,
      Validators.minLength(6),
      passwordValidator()
    ]]
  });

  public isPasswordVisible = false;
  public isLoading = false;

  public get name (): FormControl<string> {
    return this.form.controls["name"];
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

  public async onSubmit (): Promise<void> {
    this.isLoading = true;

    const {_matSnackBar, _svmService, form} = this;
    const {name, password} = form.value;

    // make this a separate function?
    const handleError = (error: any): void => { _matSnackBar.open(error, "OK"); };

    const privateKey = await _svmService.randomKey().catch(handleError);

    if (!privateKey || !name || !password) {
      this.isLoading = false;
      return;
    }

    const privateKeyHash = _svmService.encrypt(privateKey, password);
    const publicKey = _svmService.privateToPublic(privateKey);
    const tx = await _svmService.api.transact({
      actions: [{
        account: "eternisvm131",
        name: "signup",
        authorization: [{
          actor: "eternisvm131",
          permission: "active"
        }],
        data: {name, publicKey}
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    }).catch(handleError);

    if (tx) {
      localStorage.setItem("privateKeyHash", privateKeyHash);
      _matSnackBar.open("Signup successfull, you can now signin", "OK");
    }

    this.isLoading = false;
  }
}
