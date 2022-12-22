import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransferItemComponent } from './dialogs/transfer-item.component';
import { NfToken } from './types/nf-token.types';

@Component({
  selector: 'app-nf-token',
  template: `
    <mat-card class="nft">
      <mat-card-title-group>
        <mat-card-title>
          <span [ngClass]="{
            'green': nfToken.attrs[0].points === 1,
            'blue': nfToken.attrs[0].points === 2,
            'purple': nfToken.attrs[0].points === 3
            }">#{{nfToken.serial}}
          </span>
        </mat-card-title>
        <mat-card-subtitle>{{nfToken.tags.title}}</mat-card-subtitle>
      </mat-card-title-group>
      <img class="nft__img" mat-card-image [src]="nfToken.tags.image"/>
      <mat-card-content>
        Author: {{nfToken.tags.author}}<br/>
        <!-- {{nfToken.tags.subtitle}} -->
        <!-- <mat-list dense>
          <mat-list-item *ngFor="let attr of nfToken.attrs">
            {{attr.attribute_name.toUpperCase()}} <div class="spacer"></div> {{attr.points}}
          </mat-list-item>
        </mat-list> -->
      </mat-card-content>
      <mat-card-actions>
        <button mat-stroked-button color="secondary" (click)="transferItem()">TRANSFER</button>
      </mat-card-actions>
    </mat-card>
  `,
  styles: [`
    .nft {
      margin: 0 1em 1em 0;
      width: 144px;
    }

    .nft__img {
      height: 180px;
    }

    .green {color: #69F0AE}
    .blue {color: #448AFF}
    .purple {color: #E040FB}
  `]
})
export class NfTokenComponent implements OnInit {
  @Input() public nfToken: NfToken = {attrs: [], serial: 0, tags: {author: "", image: "", title: "", subtitle: ""}};

  public constructor (private readonly _matDialog: MatDialog) {}

  public transferItem (): void {
    this._matDialog.open(TransferItemComponent, {data: this.nfToken});
  }

  ngOnInit(): void {}
}
