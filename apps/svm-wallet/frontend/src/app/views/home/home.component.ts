import {Component} from "@angular/core";

@Component({
  selector: "app-home",
  template: `
    <div class="home">
      <p>
        Eternitas is utilizig the Telos blockchain to build open source browser
        games in which players truly own their data.
      </p>
    </div>
  `,
  styles: [`
    .home {
      padding: var(--spacing);
    }
  `]
})
export class HomeComponent {}
