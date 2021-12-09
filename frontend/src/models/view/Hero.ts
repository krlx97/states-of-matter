interface Passive {
  name: string;
  amount: number;
  info: string;
}

interface Active {
  name: string;
  manaCost: number;
  info: string;
}

interface Special {
  effect: string;
  amount: number;
}

interface Hero {
  name: string;
  klass: number;
  damage: number;
  health: number;
  mana: number;
  passive: Passive;
  active: Active;
  special: Special;
}

export type {Hero};
