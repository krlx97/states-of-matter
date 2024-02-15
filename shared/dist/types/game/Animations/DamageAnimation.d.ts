import { Field } from "../../mongo/Game/Field.js";
interface DamageAnimation {
    type: "DAMAGE";
    increment: number;
    field: Field;
    name: string;
}
export type { DamageAnimation };
