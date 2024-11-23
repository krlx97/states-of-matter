import type {
  Ability,
  CardId,
  CardKlass,
  CardType,
  EffectId
} from "../../enums/index.js";

interface CardEffect {
  id: EffectId;
  name: string;
  description: Array<any>;
}

interface CardAura {
  id: EffectId;
  name: string;
  description: Array<any>;
}

interface ClientBaseCard {
  id: CardId;
  name: string;
  klass: CardKlass;
  lore: string;
}

interface ClientHero extends ClientBaseCard {
  type: CardType.HERO;
  health: number;
  mana: number;
  aura: CardAura;
  ability: {
    id: Ability;
    name: string;
    description: Array<any>;
  }
}

interface ClientMinion extends ClientBaseCard {
  type: CardType.MINION;
  health: number;
  damage: number;
  manaCost: number;
  effect: CardEffect;
}

interface ClientMagic extends ClientBaseCard {
  type: CardType.MAGIC;
  manaCost: number;
  effect: CardEffect;
}

interface ClientTrap extends ClientBaseCard {
  type: CardType.TRAP;
  manaCost: number;
  effect: CardEffect;
}

type ClientCard = ClientHero | ClientMinion | ClientMagic | ClientTrap;
type ClientCards = Array<ClientCard>;

export type {ClientCard, ClientCards};
