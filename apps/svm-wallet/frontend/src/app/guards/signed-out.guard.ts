import {Injectable} from "@angular/core";
import {Router, type CanActivate} from "@angular/router";
import {UserService} from "services/user.service";

@Injectable({
  providedIn: "root"
})
export class SignedOutGuard implements CanActivate {
  public constructor (
    private readonly _router: Router,
    private readonly _userService: UserService
  ) {}

  public canActivate (): boolean {
    if (this._userService.isLoggedIn) {
      this._router.navigate(["signin-guard"]);
      return false;
    }

    return true;
  }
}
