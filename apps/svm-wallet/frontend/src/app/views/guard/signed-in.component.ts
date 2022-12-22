import {Component} from "@angular/core";

@Component({
  selector: "app-signed-in",
  template: `
    <h3>
      You can't view this page if you're signed in.
    </h3>
  `,
  styles: [`
    h3 {
      text-align: center;
    }
  `]
})
export class SignedInComponent {}
