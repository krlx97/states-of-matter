import {Component} from "@angular/core";

@Component({
  selector: "app-signed-out",
  template: `
    <h3>
      You can't view this page if you're not signed in.
    </h3>
  `,
  styles: [`
    h3 {
      text-align: center;
    }
  `]
})
export class SignedOutComponent {}
