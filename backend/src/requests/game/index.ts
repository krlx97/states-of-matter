import {attackHero} from "./attackHero";
import {attackMinion} from "./attackMinion";
import {endTurn} from "./endTurn";
import {playMagic} from "./playMagic";
import {playMinion} from "./playMinion";
import {playTrap} from "./playTrap";
import {surrender} from "./surrender";
import {useAbility} from "./useAbility";

const game = [
  attackHero,
  attackMinion,
  endTurn,
  playMagic,
  playMinion,
  playTrap,
  surrender,
  useAbility
];

export {game};
