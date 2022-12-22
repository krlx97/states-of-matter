import {Component} from "@angular/core";
import {FormBuilder, Validators, type FormControl} from "@angular/forms";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {UserService} from "services/user.service";
import {nameValidator} from "validators/name.validator";
import {passwordValidator} from "validators/password.validator";

@Component({
  selector: "app-signin",
  template: `
    <div class="signin">
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
          SIGNIN
        </button>

        <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>

      </form>
    </div>
  `,
  styles: [`
    mat-form-field, button {
      margin-bottom: var(--spacing);
    }

    .signin {
      padding: var(--spacing);
    }
  `]
})
export class SigninComponent {
  public constructor (
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
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

    const handle = (error: any): void => {
      this._matSnackBar.open(error, "OK", {duration: 7000});
    };

    const {name, password} = this.form.value;
    const privateKeyHash = localStorage.getItem("privateKeyHash");

    if (!privateKeyHash) {
      this._matSnackBar.open("Create an account first or recover an existing one", "OK");
      this.isLoading = false;
      return;
    }

    const privateKey = this._svmService.decrypt(privateKeyHash as string, password as string);

    if (!privateKey) {
      this._matSnackBar.open("Wrong password", "OK");
      this.isLoading = false;
      return;
    }

    const table = await this._svmService.api.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "accounts",
      lower_bound: name,
      limit: 1
    }).catch(handle);

    if (!table) {
      this.isLoading = false;
      return;
    }

    const account = table.rows[0];

    console.log(account);

    this._userService.user = account;
    this._userService.$assets.next(this._userService.user.tokens);
    this._userService.privateKey = privateKey;
    this._userService.isLoggedIn = true;
    this._matSnackBar.open("Signin successfull", "OK");
    this._router.navigate(["/account"]);
    this.isLoading = false;
  }
}
