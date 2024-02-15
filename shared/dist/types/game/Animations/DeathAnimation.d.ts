import { Field } from "../../mongo/Game/Field.js";
interface DeathAnimation {
    type: "DEATH";
    field: Field;
    name: string;
}
export type { DeathAnimation };
