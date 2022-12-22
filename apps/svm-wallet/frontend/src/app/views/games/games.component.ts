import {Component} from "@angular/core";

@Component({
  selector: "app-games",
  template: `
    <div class="games">
      <mat-card>
        <mat-card-header>
          <img mat-card-avatar src="assets/logo.png"/>
          <mat-card-title>States of Matter</mat-card-title>
          <mat-card-subtitle>
            Coming <s>November the 1st, 2022</s> December the 1st, 2022 😭
          </mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          States of Matter is a PvP Card Game featuring four card classes:
          Solid, Liquid, Gas and Plasma. Pick your favorite playstyle, create
          your deck and get ready to duel!
        </mat-card-content>
        <mat-card-actions>
          <button mat-button color="primary">DEMO</button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .games {
      padding: var(--spacing);
    }
  `]
})
export class GamesComponent {}
