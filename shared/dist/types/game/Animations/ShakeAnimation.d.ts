import { Field } from "../../mongo/Game/Field.js";
interface ShakeAnimation {
    type: "SHAKE";
    damageTaken: number;
    field: Field;
    name: string;
}
export type { ShakeAnimation };
