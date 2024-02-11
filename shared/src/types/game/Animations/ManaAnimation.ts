import {Field} from "../../mongo/Game/Field.js";

interface ManaAnimation {
  type: "MANA";
  increment: number;
  field: Field;
  name: string;
}

export type {ManaAnimation};
