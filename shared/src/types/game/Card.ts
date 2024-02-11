import type {
  Ability,
  CardId,
  CardKlass,
  CardType,
  EffectId
} from "../../enums/index.js";

interface ClientBaseCard {
  id: CardId;
  klass: CardKlass;
  effect: EffectId;
}

interface ClientHero extends ClientBaseCard {
  type: CardType.HERO;
  health: number;
  mana: number;
  ability: Ability;
}

interface ClientMinion extends ClientBaseCard {
  type: CardType.MINION;
  health: number;
  damage: number;
  manaCost: number;
}

interface ClientMagic extends ClientBaseCard {
  type: CardType.MAGIC;
  manaCost: number;
}

interface ClientTrap extends ClientBaseCard {
  type: CardType.TRAP;
  manaCost: number;
}

type ClientCard = ClientHero | ClientMinion | ClientMagic | ClientTrap;
type ClientCards = Array<ClientCard>;

export type {ClientCard, ClientCards};
