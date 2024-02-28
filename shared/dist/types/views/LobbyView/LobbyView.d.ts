import type { ChatMessages, LobbyPlayer } from "../../mongo/index.js";
interface LobbyView {
    id: number;
    host: LobbyPlayer;
    challengee: LobbyPlayer | undefined;
    messages: ChatMessages;
}
export type { LobbyView };
