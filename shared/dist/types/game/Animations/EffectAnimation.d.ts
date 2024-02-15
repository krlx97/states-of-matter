import { Field } from "../../mongo/Game/Field.js";
interface EffectAnimation {
    type: "EFFECT";
    field: Field;
}
export type { EffectAnimation };
