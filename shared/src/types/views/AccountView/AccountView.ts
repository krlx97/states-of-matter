import type {AccountSocialView} from "./AccountSocialView.js";

interface AccountView {
  name: string;
  publicKey: string;
  avatarId: number;
  bannerId: number;
  social: AccountSocialView;
}

export type {AccountView};
