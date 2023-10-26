import type {AccountChatView} from "./AccountChatView.js";
import type {AccountSocialFriendView} from "./AccountSocialFriendView.js";

interface AccountSocialView {
  friends: Array<AccountSocialFriendView>;
  requests: Array<string>;
  blocked: Array<string>;
  chat: AccountChatView;
}

export type {AccountSocialView};
