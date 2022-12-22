import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {AccountModule} from "./account/account.module";
import {AppsModule} from "./apps/apps.module";
import {WalletModule} from "./wallet/wallet.module";
import {GamesModule} from "./games/games.module";
import {GuardModule} from "./guard/guard.module";
import {HomeModule} from "./home/home.module";
import {RecoverModule} from "./recover/recover.module";
import {SigninModule} from "./signin/signin.module";
import {SignupModule} from "./signup/signup.module";

@NgModule({
  imports: [
    CommonModule,
    AccountModule,
    AppsModule,
    WalletModule,
    GamesModule,
    GuardModule,
    HomeModule,
    RecoverModule,
    SigninModule,
    SignupModule
  ]
})
export class ViewsModule {}
