import type { Field, MinionField } from "../../mongo/index.js";
interface Attack {
    attacker: MinionField;
    attacked: Field;
}
export type { Attack };
