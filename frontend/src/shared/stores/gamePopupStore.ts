import {writable} from "svelte/store";
import {GameType} from "@som/shared/enums";

interface GamePopupStore {
  id: number;
  type: GameType;
  hasPlayerAccepted: boolean;
  hasOpponentAccepted: boolean;
}

const gamePopupStore = writable<GamePopupStore>({
  id: 0,
  type: GameType.CUSTOM,
  hasPlayerAccepted: false,
  hasOpponentAccepted: false
});

export {gamePopupStore};
