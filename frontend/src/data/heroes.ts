import {Klass} from "enums";
import type {Hero} from "models/view";

const solidHero: Hero = {
  name: "Solid Hero",
  klass: Klass.SOLID,
  damage: 55,
  health: 1500,
  mana: 100,
  passive: {
    name: "Passive",
    amount: 10,
    info: `
      Solid Hero and Minions have
      <span class="f--yellow">Damage Reduction <i class="fas fa-shield-alt fa-fw"></i></span>,
      reducing all incoming damage by a flat amount.
    `
  },
  active: {
    name: "Effect",
    manaCost: 10,
    info: `
      Solid Hero and Minions reflect the damage that they block to the attacker.
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
};

const liquidHero: Hero = {
  name: "Liquid Hero",
  klass: Klass.LIQUID,
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
  klass: Klass.GAS,
  damage: 10,
  health: 1000,
  mana: 100,
  passive: {
    name: `
      <span class="f--gas">Neurotoxin <i class="fas fa-radiation fa-fw"></i></span>
    `,
    amount: 1,
    info: `
      Gas Hero and Minions attacks apply stacks of
      <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
      to the entire enemy field, dealing
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      per stack.
    `
  },
  active: {
    name: "Active",
    manaCost: 25,
    info: `
      When a Gas Minion dies, 
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
};

const plasmaHero: Hero = {
  name: "Plasma Hero",
  klass: Klass.PLASMA,
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
      Plasma Hero and Minion attacks apply stacks of
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>,
      dealing
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      to the cards affected each turn per stack.
    `
  },
  active: {
    name: "Active",
    manaCost: 50,
    info: `
      When an enemy minion affected by
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
      dies, the remaining
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
      stacks get transfered to another random enemy Minion.
    `
  },
  special: {
    amount: 0,
    effect: ""
  },
}

const heroes = new Map([
  [1, solidHero],
  [2, liquidHero],
  [3, gasHero],
  [4, plasmaHero]
]);

export default heroes;
