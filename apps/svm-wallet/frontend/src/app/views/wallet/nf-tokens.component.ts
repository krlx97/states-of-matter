import {Component, OnInit} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SvmService} from "services/svm.service";
import {UserService} from "services/user.service";
import type {NfToken} from "./types/nf-token.types";

@Component({
  selector: "app-nf-tokens",
  template: `
    <button class="btn--mint" mat-stroked-button color="primary" (click)="mint()" [disabled]="isLoading">MINT - 1000.0000 VMT</button>
    <mat-progress-bar *ngIf="isLoading" mode="indeterminate"></mat-progress-bar>
    <div class="nfts">
      <app-nf-token *ngFor="let nft of nfts" [nfToken]="nft"></app-nf-token>
    </div>
  `,
  styles: [`
    .nfts {
      display: flex;
      flex-wrap: wrap;
      padding: 1em 0 0 1em;
      box-sizing: border-box;
    }
  `]
})
export class NfTokensComponent implements OnInit {
  public constructor (
    private readonly _matSnackBar: MatSnackBar,
    private readonly _svmService: SvmService,
    private readonly _userService: UserService
  ) {}

  public nfts: NfToken[] = [];
  public isLoading = false;

  public async mint (): Promise<void> {
    const groups = [
      "forsakenseaf",
      "cruelavet",
      "enlightgl",
      "graverobber"
    ];
    const groupMap = new Map([
      [groups[0], {name: "Forsaken Seafarer", by: "dev.pay"}],
      [groups[1], {name: "Cruel Avet", by: "dev.pay"}],
      [groups[2], {name: "Enlightened Lights", by: "dev.pay"}],
      [groups[3], {name: "Graverobber", by: "vule"}],
    ])
    this.isLoading = true;

    const {_svmService, _userService} = this;
    const {privateKey} = _userService;
    const {name, nonce} = _userService.user.profile;
    const signature = _svmService.sign(`${nonce}`, privateKey);

    const handle = (error: any): void => {
      this._matSnackBar.open(error, "", {duration: 7000});
    };
    const i = Math.floor(Math.random() * 4); // ;w;
    const transaction = await _svmService.push("mint", {i, name, signature}).catch(handle);

    if (!transaction) {
      this.isLoading = false;
      return;
    }

    await _userService.reloadUser();

    this._matSnackBar.open(`Minted ${groupMap.get(groups[i])?.name} by ${groupMap.get(groups[i])?.by}.`, "GUCCI.");
    this.isLoading = false;
  }

  public ngOnInit (): void {
    this._userService.$assets.subscribe((x) => {

    });
    this._userService.user.tokens.nonFungible.serials.forEach(async (serial) => {
      const nft = await this._svmService.api.rpc.get_table_rows({
        code: "eterninft131",
        scope: "eterninft131",
        table: "items",
        lower_bound: serial,
        upper_bound: serial
      }).catch(console.log);

      if (!nft) { return; }

      const nfttags = await this._svmService.api.rpc.get_table_rows({
        code: "eterninft131",
        scope: nft.rows[0].group,
        table: "sharedtags",
      }).catch(console.log);

      const nftattrs = await this._svmService.api.rpc.get_table_rows({
        code: "eterninft131",
        scope: nft.rows[0].group,
        table: "sharedattrs",
      }).catch(console.log);

      if (!nfttags || !nftattrs) { return; }

      const tags: any = {};
      const attrs: any = [];

      nfttags.rows.forEach((row) => {
        tags[row.tag_name] = row.content;
      });

      nftattrs.rows.forEach((row) => attrs.push(row));

      this.nfts.push({
        serial,
        tags,
        attrs
      });
    });
  }
}
