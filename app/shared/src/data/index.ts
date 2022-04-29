interface Card {
  id: number;
  klass: number;
  type: number;
  name: string;
  damage?: number;
  health?: number;
  manaCost: number;
  effect: string;
  effects: Array<number>;
}


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

import {CardKlass, CardType, Effect} from "../enums/index.js";

export const lore = new Map([
  
]);

const cards: Array<Card> = [{
  id: 0,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 1",
  damage: 10,
  health: 70,
  manaCost: 30,
  effect: "Neutral card 1 can attack twice.",
  effects: [Effect.GREED]
}, {
  id: 1,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 2",
  damage: 11,
  health: 80,
  manaCost: 35,
  effect: "Neutral card 2 effect",
  effects: [Effect.BLIND]
}, {
  id: 2,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 3",
  damage: 12,
  health: 90,
  manaCost: 40,
  effect: "Neutral card 3 effect",
  effects: [Effect.CHARGE]
}, {
  id: 3,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 4",
  damage: 13,
  health: 100,
  manaCost: 45,
  effect: "Neutral card 4 effect",
  effects: []
}, {
  id: 4,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 5",
  damage: 14,
  health: 110,
  manaCost: 50,
  effect: "Neutral card 5 effect",
  effects: []
}, {
  id: 5,
  klass: CardKlass.NEUTRAL,
  type: CardType.MINION,
  name: "Neutral card 6",
  damage: 15,
  health: 120,
  manaCost: 55,
  effect: "Neutral card 6 effect",
  effects: []
}, {
  id: 6,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  name: "Neutral card 7",
  manaCost: 60,
  effect: "Neutral card 7 effect",
  effects: []
}, {
  id: 7,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  name: "Neutral card 8",
  manaCost: 60,
  effect: "Neutral card 8 effect",
  effects: []
}, {
  id: 8,
  klass: CardKlass.NEUTRAL,
  type: CardType.MAGIC,
  name: "Neutral card 9",
  manaCost: 60,
  effect: "Neutral card 9 effect",
  effects: []
}, {
  id: 9,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  name: "Neutral card 10",
  manaCost: 60,
  effect: "Neutral card 10 effect",
  effects: []
}, {
  id: 10,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  name: "Neutral card 11",
  manaCost: 60,
  effect: "Neutral card 11 effect",
  effects: []
}, {
  id: 11,
  klass: CardKlass.NEUTRAL,
  type: CardType.TRAP,
  name: "Neutral card 12",
  manaCost: 60,
  effect: "Neutral card 12 effect",
  effects: []
}, {
  id: 50,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 1",
  damage: 1,
  health: 1,
  manaCost: 1,
  effect: "Solid card 1 effect",
  effects: []
}, {
  id: 51,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 2",
  damage: 2,
  health: 2,
  manaCost: 2,
  effect: "Solid card 2 effect",
  effects: []
}, {
  id: 52,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 3",
  damage: 3,
  health: 3,
  manaCost: 3,
  effect: "Solid card 3 effect",
  effects: []
}, {
  id: 53,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 4",
  damage: 4,
  health: 4,
  manaCost: 4,
  effect: "Solid card 4 effect",
  effects: []
}, {
  id: 54,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 5",
  damage: 5,
  health: 5,
  manaCost: 5,
  effect: "Solid card 5 effect",
  effects: []
}, {
  id: 55,
  klass: CardKlass.SOLID,
  type: CardType.MINION,
  name: "Solid card 6",
  damage: 6,
  health: 6,
  manaCost: 6,
  effect: "Solid card 6 effect",
  effects: []
}, {
  id: 56,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  name: "Solid card 7",
  manaCost: 7,
  effect: "Solid card 7 effect",
  effects: []
}, {
  id: 57,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  name: "Solid card 8",
  manaCost: 8,
  effect: "Solid card 8 effect",
  effects: []
}, {
  id: 58,
  klass: CardKlass.SOLID,
  type: CardType.MAGIC,
  name: "Solid card 9",
  manaCost: 9,
  effect: "Solid card 9 effect",
  effects: []
}, {
  id: 59,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  name: "Solid card 10",
  manaCost: 10,
  effect: "Solid card 10 effect",
  effects: []
}, {
  id: 60,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  name: "Solid card 11",
  manaCost: 11,
  effect: "Solid card 11 effect",
  effects: []
}, {
  id: 61,
  klass: CardKlass.SOLID,
  type: CardType.TRAP,
  name: "Solid card 12",
  manaCost: 12,
  effect: "Solid card 12 effect",
  effects: []
}, {
  id: 100,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 1",
  damage: 1,
  health: 1,
  manaCost: 1,
  effect: "Liquid card 1 effect",
  effects: []
}, {
  id: 101,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 2",
  damage: 2,
  health: 2,
  manaCost: 2,
  effect: "Liquid card 2 effect",
  effects: []
}, {
  id: 102,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 3",
  damage: 3,
  health: 3,
  manaCost: 3,
  effect: "Liquid card 3 effect",
  effects: []
}, {
  id: 103,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 4",
  damage: 4,
  health: 4,
  manaCost: 4,
  effect: "Liquid card 4 effect",
  effects: []
}, {
  id: 104,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 5",
  damage: 5,
  health: 5,
  manaCost: 5,
  effect: "Liquid card 5 effect",
  effects: []
}, {
  id: 105,
  klass: CardKlass.LIQUID,
  type: CardType.MINION,
  name: "Liquid card 6",
  damage: 6,
  health: 6,
  manaCost: 6,
  effect: "Liquid card 6 effect",
  effects: []
}, {
  id: 106,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  name: "Liquid card 7",
  manaCost: 7,
  effect: "Liquid card 7 effect",
  effects: []
}, {
  id: 107,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  name: "Liquid card 8",
  manaCost: 8,
  effect: "Liquid card 8 effect",
  effects: []
}, {
  id: 108,
  klass: CardKlass.LIQUID,
  type: CardType.MAGIC,
  name: "Liquid card 9",
  manaCost: 9,
  effect: "Liquid card 9 effect",
  effects: []
}, {
  id: 109,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  name: "Liquid card 10",
  manaCost: 10,
  effect: "Liquid card 10 effect",
  effects: []
}, {
  id: 110,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  name: "Liquid card 11",
  manaCost: 11,
  effect: "Liquid card 11 effect",
  effects: []
}, {
  id: 111,
  klass: CardKlass.LIQUID,
  type: CardType.TRAP,
  name: "Liquid card 12",
  manaCost: 12,
  effect: "Liquid card 12 effect",
  effects: []
}, {
  id: 150,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 1",
  damage: 1,
  health: 1,
  manaCost: 1,
  effect: "Gas card 1 effect",
  effects: []
}, {
  id: 151,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 2",
  damage: 2,
  health: 2,
  manaCost: 2,
  effect: "Gas card 2 effect",
  effects: []
}, {
  id: 152,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 3",
  damage: 3,
  health: 3,
  manaCost: 3,
  effect: "Gas card 3 effect",
  effects: []
}, {
  id: 153,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 4",
  damage: 4,
  health: 4,
  manaCost: 4,
  effect: "Gas card 4 effect",
  effects: []
}, {
  id: 154,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 5",
  damage: 5,
  health: 5,
  manaCost: 5,
  effect: "Gas card 5 effect",
  effects: []
}, {
  id: 155,
  klass: CardKlass.GAS,
  type: CardType.MINION,
  name: "Gas card 6",
  damage: 6,
  health: 6,
  manaCost: 6,
  effect: "Gas card 6 effect",
  effects: []
}, {
  id: 156,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  name: "Gas card 7",
  manaCost: 7,
  effect: "Gas card 7 effect",
  effects: []
}, {
  id: 157,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  name: "Gas card 8",
  manaCost: 8,
  effect: "Gas card 8 effect",
  effects: []
}, {
  id: 158,
  klass: CardKlass.GAS,
  type: CardType.MAGIC,
  name: "Gas card 9",
  manaCost: 9,
  effect: "Gas card 9 effect",
  effects: []
}, {
  id: 159,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  name: "Gas card 10",
  manaCost: 10,
  effect: "Gas card 10 effect",
  effects: []
}, {
  id: 160,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  name: "Gas card 11",
  manaCost: 11,
  effect: "Gas card 11 effect",
  effects: []
}, {
  id: 161,
  klass: CardKlass.GAS,
  type: CardType.TRAP,
  name: "Gas card 12",
  manaCost: 12,
  effect: "Gas card 12 effect",
  effects: []
}, {
  id: 200,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 1",
  damage: 1,
  health: 1,
  manaCost: 1,
  effect: `
    If Plasma card 1 procs
    <span class="f--red"><i class="fas fa-khanda"></i></span>,
    it can attack again.
  `,
  effects: []
}, {
  id: 201,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 2",
  damage: 2,
  health: 2,
  manaCost: 2,
  effect: `
    When summoned, 10% of your Life Points are transfered into *cardname*
    damage
  `,
  effects: []
}, {
  id: 202,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 3",
  damage: 3,
  health: 3,
  manaCost: 3,
  effect: `
    Gains
    <span class="f--red">+1% <i class="fas fa-khanda"></i></span>
    for each
    <span class="f--green">1% missing <i class="fas fa-heart"></i></span>,
    and converts excess
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    to
    <span class="f--orange"><i class="fas fa-fire"></i></span>.
  `,
  effects: []
}, {
  id: 203,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 4",
  damage: 4,
  health: 4,
  manaCost: 4,
  effect: `
    Gains <span class="f--red">+20% <i class="fas fa-khanda"></i></span> for
    each Minion on your field, self included.
  `,
  effects: []
}, {
  id: 204,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 5",
  damage: 5,
  health: 5,
  manaCost: 5,
  effect: `
    Executes Minions below
    <span class="f--green">5% <i class="fas fa-heart"></i></span>
    after combat.
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    procs execute Minions below
    <span class="f--green">10% <i class="fas fa-heart"></i></span>
    instead. Works only on minions.
  `,
  effects: []
}, {
  id: 205,
  klass: CardKlass.PLASMA,
  type: CardType.MINION,
  name: "Plasma card 6",
  damage: 6,
  health: 6,
  manaCost: 6,
  effect: `
    If Plasma card 6 procs
    <span class="f--red"><i class="fas fa-khanda"></i></span>
    , the opposing card is stunned.
    <br>
    <i><b>* Stunned</b>: Not able to attack for 1 turn.</i>
  `,
  effects: []
}, {
  id: 206,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  name: "Plasma card 7",
  manaCost: 7,
  effect: `
    Give one minion
    <span class="f--red">+6/6 <i class="fas fa-khanda"></i></span>.
  `,
  effects: []
}, {
  id: 207,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  name: "Plasma card 8",
  manaCost: 8,
  effect: "Plasma card 8 effect",
  effects: []
}, {
  id: 208,
  klass: CardKlass.PLASMA,
  type: CardType.MAGIC,
  name: "Plasma card 9",
  manaCost: 9,
  effect: "Plasma card 9 effect",
  effects: []
}, {
  id: 209,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  name: "Plasma card 10",
  manaCost: 10,
  effect: `
    The next Minion your opponent attacks will gain
    <span class="f--red">+6/6 <i class="fas fa-khanda"></i></span>
    until the end of their turn.
  `,
  effects: []
}, {
  id: 210,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  name: "Plasma card 11",
  manaCost: 11,
  effect: "Plasma card 11 effect",
  effects: []
}, {
  id: 211,
  klass: CardKlass.PLASMA,
  type: CardType.TRAP,
  name: "Plasma card 12",
  manaCost: 12,
  effect: "Plasma card 12 effect",
  effects: []
}];

const solidHero: Hero = {
  name: "Solid Hero",
  klass: CardKlass.SOLID,
  damage: 55,
  health: 1500,
  mana: 100,
  passive: {
    name: "Thick Armor",
    amount: 10,
    info: `
      Solid Hero and Minions take
      <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
      when defending.
    `
  },
  active: {
    name: "Taunt",
    manaCost: 10,
    info: `
      Solid Hero can apply a Taunt buff on Solid Minions or himself, giving it
      additional
      <span class="f--yellow"><i class="fas fa-shield-alt fa-fw"></i></span>,
      and forcing the enemy Hero and Minions to attack that minion for their
      next turn.
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
};

const liquidHero: Hero = {
  name: "Liquid Hero",
  klass: CardKlass.LIQUID,
  damage: 30,
  health: 600,
  mana: 100,
  passive: {
    name: "Passive",
    amount: 25,
    info: `
      Liquid Hero and Minions heal
      <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
      whenever a Liquid Minion dies.
    `
  },
  active: {
    name: "Active",
    manaCost: 30,
    info: `
      Liquid hero and minions heal
      <span class="f--green">10% missing <i class="fas fa-heart"></i></span>.
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
};

const gasHero: Hero = {
  name: "Gas Hero",
  klass: CardKlass.GAS,
  damage: 10,
  health: 1000,
  mana: 100,
  passive: {
    name: `
      <span class="f--gas">Neurotoxin <i class="fas fa-radiation fa-fw"></i></span>
    `,
    amount: 1,
    info: `
      When attacking, Gas Hero and Minions apply
      <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
      debuff to the entire enemy field, dealing
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      each turn to the affected targets. This effect can stack.
    `
  },
  active: {
    name: "Active",
    manaCost: 25,
    info: `
      ...
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
};

const plasmaHero: Hero = {
  name: "Plasma Hero",
  klass: CardKlass.PLASMA,
  damage: 30,
  health: 800,
  mana: 100,
  passive: {
    name: `
      <span class="f--red">Radiation <i class="fas fa-burn fa-fw"></i></span>
    `,
    amount: 10,
    info: `
      <br>
      When attacking, Plasma Hero and Minions apply
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
      debuff, which deals
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      to the affected Minions or Hero each turn. This effect can stack.
    `
  },
  active: {
    name: "Unstable Core",
    manaCost: 50,
    info: `
      Plasma Hero applies Unstable Core debuff on one enemy Minion or Hero.
      Plasma Hero and Minions attacking the affected target will deal additional
      <span class="f--orange">10% <i class="fas fa-fire fa-fw"></i></span>,
      and apply
      <span class="f--red">3 <i class="fas fa-burn fa-fw"></i></span>
      additional stacks until the end of your turn.
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
}

const heroes: Array<Hero> = [
  solidHero, liquidHero, gasHero, plasmaHero
];

const passives = [{
  klass: CardKlass.SOLID,
  text: `
    Solid Hero and Minions take
    <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
    when defending.
  `
}, {
  klass: CardKlass.LIQUID,
  text: `
    Liquid Hero and Minions heal
    <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
    whenever a Liquid Minion dies.
  `
}, {
  klass: CardKlass.GAS,
  text: `
    When attacking, Gas Hero and Minions apply
    <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
    debuff to the entire enemy field, dealing
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    each turn to the affected targets. This effect can stack.
  `
}, {
  klass: CardKlass.PLASMA,
  text: `
    When attacking, Plasma Hero and Minions apply
    <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
    debuff, which deals
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    to the affected Minions or Hero each turn. This effect can stack.
  `
}];

export {cards, heroes, passives};
