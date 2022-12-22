import {Component} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {UserService} from "services/user.service";
import {ActivateComponent} from "./dialogs/activate.component";
import { SetAvatarComponent } from "./dialogs/set-avatar.component";

@Component({
  selector: "app-account",
  template: `
    <div class="account">
      <p>
        Please securely store your Eternitas account private key. If you lose
        access to the private key the account will be permanently lost.
      </p>
      <mat-divider></mat-divider>
      <mat-list>
        <mat-list-item>
          Avatar
          <div class="spacer"></div>
          <img src="assets/avatars/{{userService.user.profile.avatarId}}.png" height="32" width="32"/>
          <button mat-icon-button (click)="onSetAvatar()">
            <mat-icon>edit</mat-icon>
          </button>
        </mat-list-item>
        <mat-list-item>
          Name
          <div class="spacer"></div>
          {{userService.user.profile.name}}
        </mat-list-item>
        <mat-list-item>
          Activated
          <div class="spacer"></div>
          <!-- {{userService.user.is_activated ? "Yes" : "No"}} -->
          <div *ngIf="userService.user.profile.isActivated; else isntActivated">Yes</div>
          <ng-template #isntActivated>
            <div>No</div>
            <button mat-icon-button (click)="onActivate()">
              <mat-icon>help</mat-icon>
            </button>
          </ng-template>
        </mat-list-item>
        <mat-list-item>
          Joined at
          <div class="spacer"></div>
          {{userService.user.profile.joinedAt * 1000 | date: "medium"}}
        </mat-list-item>
        <mat-list-item>
          Public key
          <div class="spacer"></div>
          {{shortPublicKey}}
          <button mat-icon-button (click)="onCopyPublicKey()">
            <mat-icon>content_copy</mat-icon>
          </button>
        </mat-list-item>
        <mat-list-item>
          Private key
          <div class="spacer"></div>
          {{shortPrivateKey}}
          <button mat-icon-button (click)="onCopyPrivateKey()">
            <mat-icon>content_copy</mat-icon>
          </button>
        </mat-list-item>
      </mat-list>
    </div>
  `,
  styles: [`
    .account {
      padding: var(--spacing);
    }

    .activate {
      margin-bottom: var(--spacing);
    }
  `]
})
export class AccountComponent {
  public constructor (
    public readonly userService: UserService,
    private readonly _matDialog: MatDialog,
    private readonly _matSnackBar: MatSnackBar
  ) {}

  public get shortPrivateKey (): string {
    const {privateKey} = this.userService;
    const firstFiveChars = privateKey.slice(0, 5);
    const lastFiveChars = privateKey.slice(-5);

    return `${firstFiveChars}...${lastFiveChars}`;
  }

  public get shortPublicKey (): string {
    const {publicKey} = this.userService.user.profile;
    const firstFiveChars = publicKey.slice(0, 5);
    const lastFiveChars = publicKey.slice(-5);

    return `${firstFiveChars}...${lastFiveChars}`;
  }

  public onActivate (): void {
    this._matDialog.open(ActivateComponent, {maxWidth: 320});
  }

  public onSetAvatar (): void {
    this._matDialog.open(SetAvatarComponent, {maxWidth: 320});
  }

  public onCopyPublicKey (): void {
    const {userService, _matSnackBar} = this;
    const {publicKey} = userService.user.profile;

    navigator.clipboard.writeText(publicKey);
    _matSnackBar.open("Public key copied to clipboard", "OK", {
      duration: 7000
    });
  }

  public onCopyPrivateKey (): void {
    const {userService, _matSnackBar} = this;
    const {privateKey} = userService;

    navigator.clipboard.writeText(privateKey);
    _matSnackBar.open("Private key copied to clipboard", "OK", {
      duration: 7000
    });
  }
}
