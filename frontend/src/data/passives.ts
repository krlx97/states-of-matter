import { Klass } from "enums";

const passives = [
  {
    klass: Klass.SOLID,
    text: `
      Solid Hero and Minions take
      <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
      when defending.
    `
  }, {
    klass: Klass.LIQUID,
    text: `
      Liquid Hero and Minions heal
      <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
      whenever a Liquid Minion dies.
    `
  }, {
    klass: Klass.GAS,
    text: `
      When attacking, Gas Hero and Minions apply
      <span class="f--gas"><i class="fas fa-radiation fa-fw"></i></span>
      debuff to the entire enemy field, dealing
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      each turn to the affected targets. This effect can stack.
    `
  }, {
    klass: Klass.PLASMA,
    text: `
      When attacking, Plasma Hero and Minions apply
      <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
      debuff, which deals
      <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
      to the affected Minions or Hero each turn. This effect can stack.
    `
  }
];

export default passives;
