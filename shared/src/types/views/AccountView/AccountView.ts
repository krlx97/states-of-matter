import type {AccountSocialView} from "./AccountSocialView.js";

interface AccountView {
  name: string;
  address: string;
  nonce: number;
  avatarId: number;
  bannerId: number;
  social: AccountSocialView;
}

export type {AccountView};
