import type {GameMinionCard, MinionField} from "../../../types/mongo/index.js";

interface SummonAnimation {
  type: "SUMMON";
  name: string;
  field: MinionField;
  minion: GameMinionCard;
}

export type {SummonAnimation};
