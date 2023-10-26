import {Field} from "../../mongo/Game/Field.js";

interface DamageAnimation {
  type: "DAMAGE";
  damageTaken: number;
  field: Field;
  name: string;
}

export type {DamageAnimation};
