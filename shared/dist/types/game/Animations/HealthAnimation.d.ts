import { Field } from "../../mongo/Game/Field.js";
interface HealthAnimation {
    type: "HEALTH";
    increment: number;
    field: Field;
    name: string;
}
export type { HealthAnimation };
