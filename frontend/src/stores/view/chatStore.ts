import {writable} from "svelte/store";

import type {Writable} from "svelte/store";

interface ChatMessage {
  text: string;
  date: string;
}

interface Chat {
  username: string;
  messages: Array<ChatMessage>;
}

const chatStore: Writable<Array<Chat>> = writable([]);

export default chatStore;