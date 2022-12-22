import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {SvmService} from "./svm.service";

interface Profile {
  nonce: number;
  name: string;
  joinedAt: number;
  publicKey: string;
  avatarId: number;
  isActivated: boolean;
}

export interface Fungible {
  key: {sym: string; contract: string};
  value: {
    total: string;
    liquid: string;
    staked: string;
    unstaking: string;
    claimable: any[]
  };
}

interface Assets {
  fungible: Fungible[];
  nonFungible: {
    serials: number[];
  };
}

interface Account {
  profile: Profile;
  tokens: Assets;
}

@Injectable({
  providedIn: "root"
})
export class UserService {
  constructor (private readonly _svmService: SvmService) {}

  public isLoggedIn = false;
  public privateKey = "";

  public user: Account = {
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

  public $assets = new BehaviorSubject<Assets>({
    fungible: [],
    nonFungible: {
      serials: []
    }
  });

  public async reloadUser (): Promise<void> {
    const table = await this._svmService.api.rpc.get_table_rows({
      code: "eternisvm131",
      scope: "eternisvm131",
      table: "accounts",
      lower_bound: this.user.profile.name,
      limit: 1
    }).catch(error => console.error(error));

    if (!table) { return; }

    this.user = table.rows[0];
    this.$assets.next(this.user.tokens);
  }
}
