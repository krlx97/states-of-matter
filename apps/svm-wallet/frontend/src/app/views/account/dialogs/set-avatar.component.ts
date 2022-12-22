import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SvmService } from 'services/svm.service';
import { UserService } from 'services/user.service';

@Component({
  selector: 'app-set-avatar',
  template: `
    <h3 mat-dialog-title>Choose avatar</h3>
    <mat-dialog-content>
      <img *ngFor="let i of [0, 1, 2, 3, 4]" [src]="getSrc(i)" (click)="onSetAvatar(i)"/>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>CLOSE</button>
    </mat-dialog-actions>
  `,
  styles: [`
    img {
      margin: var(--spacing);
    }
  `]
})
export class SetAvatarComponent implements OnInit {
  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    private readonly _matDialogRef: MatDialogRef<SetAvatarComponent>,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  ngOnInit(): void {
  }

  public getSrc (i: number): string {
    return `assets/avatars/${i}.png`;
  }

  public async onSetAvatar (i: number): Promise<void> {
    const handle = (error: any): void => {
      this._matSnackBar.open(error, "OK");
    };

    const {privateKey} = this._userService;
    const {name, nonce} = this._userService.user.profile;
    const signature = this._svmService.sign(`${nonce}`, privateKey);

    const transaction = await this._svmService.api.transact({
      actions: [{
        account: "eternisvm131",
        name: "setavatar",
        authorization: [{
          actor: "eternisvm131",
          permission: "active"
        }],
        data: {name, signature, avatarId: i}
      }]
    }, {
      blocksBehind: 3,
      expireSeconds: 30
    }).catch(handle);

    if (!transaction) {
      // this.isLoading = false;
      return;
    }

    await this._userService.reloadUser().catch(handle);

    this._matSnackBar.open("Avatar changed.", "OK");
    // this.isLoading = false;
    this._matDialogRef.close();
  }
}
