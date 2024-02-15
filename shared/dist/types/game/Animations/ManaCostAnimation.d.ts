import { Field } from "../../mongo/Game/Field.js";
interface ManaCostAnimation {
    type: "MANACOST";
    increment: number;
    field: Field;
    name: string;
}
export type { ManaCostAnimation };
