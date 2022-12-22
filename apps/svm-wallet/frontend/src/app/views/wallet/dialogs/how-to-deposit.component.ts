import {Component} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "services/user.service";

@Component({
  selector: "app-how-to-deposit",
  template: `
    <div mat-dialog-title>How to deposit</div>
    <div mat-dialog-content>
      <p>
        Transfer any of the supported tokens to eternisvm131 Telos account which
        holds the contract, and pass your Eternitas account username as the
        memo. Make sure to <strong>correctly fill the memo field</strong> or
        your assets will be permanently lost.
      </p>
      <form>
        <mat-form-field appearance="fill">
          <mat-label>Name</mat-label>
          <input matInput disabled value="eternisvm131"/>
          <button mat-icon-button matSuffix type="button" (click)="onCopyName()">
            <mat-icon>content_copy</mat-icon>
          </button>
        </mat-form-field>
        <mat-form-field appearance="fill">
          <mat-label>Memo</mat-label>
          <input matInput disabled [value]="userService.user.profile.name"/>
          <button mat-icon-button matSuffix type="button" (click)="onCopyMemo()">
            <mat-icon>content_copy</mat-icon>
          </button>
        </mat-form-field>
      </form>
    </div>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `]
})
export class HowToDepositComponent {
  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    public readonly userService: UserService
  ) {}

  public onCopyName (): void {
    navigator.clipboard.writeText("eternisvm131");
    this._matSnackBar.open("Name copied to clipboard", "OK", {
      duration: 7000
    });
  }

  public onCopyMemo (): void {
    navigator.clipboard.writeText(this.userService.user.profile.name);
    this._matSnackBar.open("Memo copied to clipboard", "OK", {
      duration: 7000
    });
  }
}
