import {Component, type OnInit} from "@angular/core";
import {NavigationEnd, Router} from "@angular/router";
import {HyperionService} from "services/hyperion.service";
import {UserService} from "services/user.service";

@Component({
  selector: "app-root",
  template: `
    <div class="app-wrapper">
      <div class="app mat-elevation-z2">

        <mat-toolbar>
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          {{route.title}}
        </mat-toolbar>

        <mat-drawer-container>
          <mat-drawer #drawer mode="over">
            <mat-nav-list>
              <div matSubheader>Main</div>
              <button
                *ngFor="let mainRoute of mainRoutes"
                mat-list-item
                [routerLink]="mainRoute.url"
                (click)="route = mainRoute">
                <mat-icon>{{mainRoute.icon}}</mat-icon> {{mainRoute.title}}
              </button>
              <div matSubheader>Account</div>
              <div *ngIf="userService.isLoggedIn">
                <button
                  *ngFor="let accountRoute of accountRoutes"
                  mat-list-item
                  [routerLink]="accountRoute.url"
                  (click)="route = accountRoute">
                  <mat-icon>{{accountRoute.icon}}</mat-icon> {{accountRoute.title}}
                </button>
                <button mat-list-item (click)="onSignout()">
                  <mat-icon>power_settings_new</mat-icon> Signout
                </button>
              </div>
              <div *ngIf="!userService.isLoggedIn">
                <button
                  *ngFor="let authRoute of authRoutes"
                  mat-list-item
                  [routerLink]="authRoute.url"
                  (click)="route = authRoute">
                  <mat-icon>{{authRoute.icon}}</mat-icon> {{authRoute.title}}
                </button>
              </div>
            </mat-nav-list>
          </mat-drawer>
          <mat-drawer-content>
            <router-outlet></router-outlet>
          </mat-drawer-content>
        </mat-drawer-container>

      </div>
    </div>
  `,
  styles: [`
    .app-wrapper {
      height: 100vh;
      width: 100vw;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #212121;
    }
    .app {
      height: 100vh;
      width: 100vw;
      display: flex;
      flex-direction: column;
    }

    mat-drawer-container {
      flex-grow: 1;
    }

    .account {
      display: flex;
      align-items: center;
    }

    img {
      height: 32px;
      width: 32px;
      margin-left: 0.5em;
    }

    @media screen and (min-width: 600px) {
      .app {
        width: 600px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  public route = {title: "", icon: "", url: ""};

  public readonly mainRoutes = [
    {title: "Home",   icon: "home",            url: "/home"},
    {title: "Games",  icon: "sports_esports",  url: "/games"},
    {title: "Apps",   icon: "apps",            url: "/apps"}
  ];

  public readonly authRoutes = [
    {title: "Signin",   icon: "login",       url: "/signin"},
    {title: "Signup",   icon: "person_add",  url: "/signup"},
    {title: "Recover",  icon: "key",         url: "/recover"}
  ];

  public readonly accountRoutes = [
    {title: "Profile",  icon: "account_circle",  url: "/account"},
    {title: "Wallet",   icon: "wallet",          url: "/wallet"}
  ];

  public constructor (
    public readonly userService: UserService,
    private readonly router: Router,
    private readonly _hyperionService: HyperionService
  ) {}

  public onSignout (): void {
    this.userService.user = {
      profile: {
        nonce: 0,
        name: "",
        joinedAt: 0,
        publicKey: "",
        avatarId: 0,
        isActivated: false
      },
      tokens: {
        fungible: [],
        nonFungible: {
          serials: []
        }
      }
    };
    this.userService.privateKey = "";
    this.userService.isLoggedIn = false;
  }

  public ngOnInit (): void {
    const {client} = this._hyperionService;

    client.onData = async (data) => {
      console.log(data);
    }

    client.onConnect = () => {
      console.log("connect");
      client.streamActions({
        contract: 'eternisvm111',
        action: 'transfer',
        account: 'eternisvm111',
        start_from: 0,
        read_until: 0,
        filters: [],
      });
    };

    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const mr = this.mainRoutes.find((rout) => rout.url === event.urlAfterRedirects);
        const authr = this.authRoutes.find((rout) => rout.url === event.urlAfterRedirects);
        const accr = this.accountRoutes.find((rout) => rout.url === event.urlAfterRedirects);

        if (mr) {this.route = mr;}
        if (authr) {this.route = authr;}
        if (accr) {this.route = accr;}
      }
    });
  }
}
