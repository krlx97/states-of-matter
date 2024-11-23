import {Field} from "../../mongo/Game/Field.js";

interface FloatingTextAnimation {
  type: "FLOATING_TEXT";
  field: Field;
  name: string;
  text: string;
}

export type {FloatingTextAnimation};
