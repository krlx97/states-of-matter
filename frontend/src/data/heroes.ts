import {Klass} from "enums";
import type {Hero} from "models/view";

const solidHero: Hero = {
  name: "Solid Hero",
  klass: Klass.SOLID,
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
]

export default heroes;
