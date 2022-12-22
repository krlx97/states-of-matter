import {NgModule} from "@angular/core";
import {RouterModule, type Routes} from "@angular/router";

import {AccountComponent} from "./views/account/account.component";
import {AppsComponent} from "./views/apps/apps.component";
import {WalletComponent} from "./views/wallet/wallet.component";
import {GamesComponent} from "./views/games/games.component";
import {SignedInComponent} from "./views/guard/signed-in.component";
import {SignedOutComponent} from "./views/guard/signed-out.component";
import {HomeComponent} from "./views/home/home.component";
import {SigninComponent} from "./views/signin/signin.component";
import {SignupComponent} from "./views/signup/signup.component";
import {GameComponent} from "./views/games/game.component";
import {RecoverComponent} from "./views/recover/recover.component";

import {SignedInGuard} from "guards/signed-in.guard";
import {SignedOutGuard} from "guards/signed-out.guard";

const routes: Routes = [{
  path: "signin-guard",
  component: SignedInComponent
}, {
  path: "signout-guard",
  component: SignedOutComponent
}, {
  path: "wallet",
  component: WalletComponent,
  canActivate: [SignedInGuard]
}, {
  path: "account",
  component: AccountComponent,
  canActivate: [SignedInGuard]
}, {
  path: "home",
  component: HomeComponent
}, {
  path: "games",
  children: [{
    path: "states_of_matter",
    component: GameComponent
  }, {
    path: "",
    pathMatch: "full",
    component: GamesComponent
  }]
}, {
  path: "apps",
  component: AppsComponent
}, {
  path: "signin",
  component: SigninComponent,
  canActivate: [SignedOutGuard]
}, {
  path: "signup",
  component: SignupComponent,
  canActivate: [SignedOutGuard]
}, {
  path: "recover",
  component: RecoverComponent,
  canActivate: [SignedOutGuard]
}, {
  path: "",
  pathMatch: "full",
  component: HomeComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
