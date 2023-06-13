import {randomInt} from "crypto";
import {EffectId} from "@som/shared/enums";
import {moveToGraveyard} from "../moveToGraveyard";
import type {Effect} from "@som/shared/types/backend";
import type {GameMinionCard, GamePlayer} from "@som/shared/types/backend/game";
import { deductHealth2 } from "../deductHealth2";

interface Rampage {
  minion: GameMinionCard;
}

const rampage: Effect<Rampage> = (params) => {
  params.minion.damage += 1;
  return [true, ""];
};

export {rampage};
