import {CardKlass} from "@som/shared/enums";

const heroPassives = new Map<CardKlass, string>([
  [CardKlass.SOLID, `
    Solid Hero and Minions take
    <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
    when defending.
  `],
  [CardKlass.LIQUID, `
    A random Liquid Minion gets +1 HP HEAL when you end your turn
  `],
  [CardKlass.GAS, `
    When attacking, Gas Hero and Minions apply
    <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
    debuff to the entire enemy field, dealing
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    each turn to the affected targets. This effect can stack.
  `],
  [CardKlass.PLASMA, `
    When attacking, Plasma Hero and Minions apply
    <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
    debuff, which deals
    <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
    to the affected Minions or Hero each turn. This effect can stack.
  `]
]);

export {heroPassives};
