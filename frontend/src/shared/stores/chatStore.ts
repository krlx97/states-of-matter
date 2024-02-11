import {writable} from "svelte/store";
import type {ChatMessages} from "@som/shared/types/mongo";

interface ChatStore {
  name: string;
  isOpen: boolean;
  messages: ChatMessages;
}

const chatStore = writable<ChatStore>({
  name: "",
  isOpen: false,
  messages: []
});

export {chatStore};
