import type {ChatMessage} from "types/mongo/index.js";

interface AccountChatView {
  name: string;
  status: number;
  avatarId: number;
  messages: Array<ChatMessage>;
  isOpen: boolean;
}

export type {AccountChatView};
