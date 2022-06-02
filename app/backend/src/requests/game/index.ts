import {attackHero} from "./attackHero";
import {attackMinion} from "./attackMinion";
import {endTurn} from "./endTurn";
import {hoverCard} from "./hoverCard";
import {hoverHandCard} from "./hoverHandCard";
import {playMagic} from "./playMagic";
import {playMinion} from "./playMinion";
import {playTrap} from "./playTrap";
import {unhoverCard} from "./unhoverCard";
import {unhoverHandCard} from "./unhoverHandCard";

const game = [
  attackHero,
  attackMinion,
  endTurn,
  hoverCard,
  hoverHandCard,
  playMagic,
  playMinion,
  playTrap,
  unhoverCard,
  unhoverHandCard
];

export {game};
