import type { Field } from "../../mongo/index.js";
interface AttackMinion {
    attacker: Field;
    attacked: Field;
}
export type { AttackMinion };
