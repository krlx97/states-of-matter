import type {ChatMessage} from "types/mongo/index.js";

interface AccountSocialFriendView {
  name: string;
  status: number;
  avatarId: number;
  messages: Array<ChatMessage>;
}

export type {AccountSocialFriendView};
