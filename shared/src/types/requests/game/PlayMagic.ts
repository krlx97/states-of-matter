import type {Field} from "../../mongo/index.js";

interface PlayMagic {
  gid: number;
  target?: number;
  field?: Field;
}

export type {PlayMagic};
