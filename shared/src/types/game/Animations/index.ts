import {DamageAnimation} from "./DamageAnimation.js";
import {DeathAnimation} from "./DeathAnimation.js";
import {EffectAnimation} from "./EffectAnimation.js";
import {FloatingTextAnimation} from "./FloatingTextAnimation.js";
import {ShakeAnimation} from "./ShakeAnimation.js";
import {TrapAnimation} from "./TrapAnimation.js";

type Animation =
  DamageAnimation |
  DeathAnimation |
  EffectAnimation |
  FloatingTextAnimation |
  ShakeAnimation |
  TrapAnimation;

type Animations = Array<Animation>;

export type {Animations};
