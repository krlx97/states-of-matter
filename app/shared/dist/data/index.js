import { CardKlass, CardType, Effect } from "../enums/index.js";
export const effectInfo = new Map([
    [Effect.CHARGE, "Can attack on the same turn when summoned"],
    [Effect.QUICK_SHOT, "When Normal Summoned deal 2 Damage to a random enemy Minion"],
    [Effect.MULTI_STRIKE, "Can attack twice per turn."],
    [Effect.NECRO, "Normal summon -2 ATK, -2 HP, Special summon +5 ATK, +5 HP."],
    [Effect.SPELLWEAVE, "Gain +1 ATK for every spell and trap card in your graveyard."],
    [Effect.PUPPETEER, `
    When Normal Summoned, Special Summon a Minion based on Hero Class. The
    Minion can attack, has unique effect and inherits class specific buffs.
  `],
    [Effect.REBIRTH, "Special summon 1 Minion from the graveyard."],
    [Effect.EXHAUST, "Reduce ATK and HP of one enemy Minion by 5."],
    [Effect.RELOAD, "Draw one card."],
    [Effect.MIRRORS_EDGE, "Reflect next incoming attack back to the enemy Hero."],
    [Effect.SMITE, "Destroy the enemies next Minion Card."],
    [Effect.ANTI_MAGE, "Destroy the enemies next Magic card."]
]);
const cards = [{
        id: 0,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Seafarer",
        damage: 10,
        health: 5,
        manaCost: 4,
        lore: `
    The darkness that spreads across the stone wall lured many men to their
    doom. Driven by curiosity, greed or forces greater than themselves, they
    would spend months crossing mountains where only birds and those possesed
    by gas spirits dare to dwell. All who returned from that perilious journey
    lost their sanity. One can see them walking aimlessly, saying things that
    are stripped of any meaning.
    Greenish aura surrounds their malnourished, deformed bodies. Eyes have lost
    all color, and look like the blackest void. However, they are often
    possesed with powerful spirits of Ether who needed vessels in order to move
    across the mountains, driven by the similar wishes as the humans who
    crossed to their side. That is the reason why those with power negotiate
    with spirits who use their bodies and use them for help in the war. In
    return, they promised to find a way to transplant them into other, better
    bodies.
    Human soul which still suffers inside is barely relevant to anyone.
  `,
        effects: [Effect.CHARGE]
    }, {
        id: 1,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Avet",
        damage: 15,
        health: 15,
        manaCost: 18,
        lore: `
    Humans, as powerful as they can be, are not immortal. Dark spirits of the
    Ether decided not to use vessels which could not serve them for longer
    periods of time, but to create their own. They condensed dark matter and
    created bodies which look like solid shadows to human eye. Able to move
    through almost everything, they are valuable asset in fights. Although they
    are not dependent on bodies of the others, they still need energy in order
    to preserve themselves far from their realms. When they appear, one can see
    all vegetation, animals and even humans in terrible pain, for avet sucks
    anything which it deems as a viable source of life.
    They are intelligent and they are not necessarily malignant, but only
    powerful humans can collaborate with them without being drained.
  `,
        effects: [Effect.QUICK_SHOT]
    }, {
        id: 2,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Guiding Lights",
        damage: 8,
        health: 20,
        manaCost: 12,
        lore: `
    During nights when moon is still young and stars are not visible, lone
    pilgrims could see shining, many-colored (usually rainbow spectre) lights.
    They hum, spin around and help humans see in the night, often showing them
    a faster route or a good place to rest. Nobody knows when they appeared,
    but many texts written by the aristocracy of the old mentions that “they
    are not spirits which can be classified among those of this realm“.
    Individual intelligence is not noticeable among guiding lights, but the
    theory is that they are aspects of the light in general, and that they are
    connected to the ultimate intelligence of that aspect of Ether. They are
    helpful to people not just because they show the road, but also for they
    move fast and can confuse potential enemies. Even though these lights are
    reluctant to participate in a war, they will help humans whose cause is
    just.
  `,
        effects: [Effect.MULTI_STRIKE]
    }, {
        id: 3,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Gravedigger",
        damage: 10,
        health: 10,
        manaCost: 10,
        lore: "Gravedigger lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.NECRO]
    }, {
        id: 4,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Spellweaver",
        damage: 5,
        health: 10,
        manaCost: 12,
        lore: "Spellweaver lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.SPELLWEAVE]
    }, {
        id: 5,
        klass: CardKlass.NEUTRAL,
        type: CardType.MINION,
        name: "Puppeteer",
        damage: 15,
        health: 10,
        manaCost: 7,
        lore: "Puppeteer lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.PUPPETEER]
    }, {
        id: 6,
        klass: CardKlass.NEUTRAL,
        type: CardType.MAGIC,
        name: "Rebirth",
        manaCost: 15,
        lore: "Rebirth lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.REBIRTH]
    }, {
        id: 7,
        klass: CardKlass.NEUTRAL,
        type: CardType.MAGIC,
        name: "Exhaust",
        manaCost: 12,
        lore: "Exhaust lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.EXHAUST]
    }, {
        id: 8,
        klass: CardKlass.NEUTRAL,
        type: CardType.MAGIC,
        name: "Reload",
        manaCost: 10,
        lore: "Reload lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.RELOAD]
    }, {
        id: 9,
        klass: CardKlass.NEUTRAL,
        type: CardType.TRAP,
        name: "Mirrors Edge",
        manaCost: 10,
        lore: "Mirrors Edge lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.MIRRORS_EDGE]
    }, {
        id: 10,
        klass: CardKlass.NEUTRAL,
        type: CardType.TRAP,
        name: "Smite",
        manaCost: 9,
        lore: "Smite lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.SMITE]
    }, {
        id: 11,
        klass: CardKlass.NEUTRAL,
        type: CardType.TRAP,
        name: "Anti-Mage",
        manaCost: 7,
        lore: "Anti-Mage lore coming soon ༼ つ ◕_◕ ༽つ",
        effects: [Effect.ANTI_MAGE]
    }, {
        id: 50,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 1",
        damage: 1,
        health: 1,
        manaCost: 1,
        lore: "Solid card 1 effect",
        effects: []
    }, {
        id: 51,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 2",
        damage: 2,
        health: 2,
        manaCost: 2,
        lore: "Solid card 2 effect",
        effects: []
    }, {
        id: 52,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 3",
        damage: 3,
        health: 3,
        manaCost: 3,
        lore: "Solid card 3 effect",
        effects: []
    }, {
        id: 53,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 4",
        damage: 4,
        health: 4,
        manaCost: 4,
        lore: "Solid card 4 effect",
        effects: []
    }, {
        id: 54,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 5",
        damage: 5,
        health: 5,
        manaCost: 5,
        lore: "Solid card 5 effect",
        effects: []
    }, {
        id: 55,
        klass: CardKlass.SOLID,
        type: CardType.MINION,
        name: "Solid card 6",
        damage: 6,
        health: 6,
        manaCost: 6,
        lore: "Solid card 6 effect",
        effects: []
    }, {
        id: 56,
        klass: CardKlass.SOLID,
        type: CardType.MAGIC,
        name: "Solid card 7",
        manaCost: 7,
        lore: "Solid card 7 effect",
        effects: []
    }, {
        id: 57,
        klass: CardKlass.SOLID,
        type: CardType.MAGIC,
        name: "Solid card 8",
        manaCost: 8,
        lore: "Solid card 8 effect",
        effects: []
    }, {
        id: 58,
        klass: CardKlass.SOLID,
        type: CardType.MAGIC,
        name: "Solid card 9",
        manaCost: 9,
        lore: "Solid card 9 effect",
        effects: []
    }, {
        id: 59,
        klass: CardKlass.SOLID,
        type: CardType.TRAP,
        name: "Solid card 10",
        manaCost: 10,
        lore: "Solid card 10 effect",
        effects: []
    }, {
        id: 60,
        klass: CardKlass.SOLID,
        type: CardType.TRAP,
        name: "Solid card 11",
        manaCost: 11,
        lore: "Solid card 11 effect",
        effects: []
    }, {
        id: 61,
        klass: CardKlass.SOLID,
        type: CardType.TRAP,
        name: "Solid card 12",
        manaCost: 12,
        lore: "Solid card 12 effect",
        effects: []
    }, {
        id: 100,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 1",
        damage: 1,
        health: 1,
        manaCost: 1,
        lore: "Liquid card 1 effect",
        effects: []
    }, {
        id: 101,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 2",
        damage: 2,
        health: 2,
        manaCost: 2,
        lore: "Liquid card 2 effect",
        effects: []
    }, {
        id: 102,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 3",
        damage: 3,
        health: 3,
        manaCost: 3,
        lore: "Liquid card 3 effect",
        effects: []
    }, {
        id: 103,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 4",
        damage: 4,
        health: 4,
        manaCost: 4,
        lore: "Liquid card 4 effect",
        effects: []
    }, {
        id: 104,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 5",
        damage: 5,
        health: 5,
        manaCost: 5,
        lore: "Liquid card 5 effect",
        effects: []
    }, {
        id: 105,
        klass: CardKlass.LIQUID,
        type: CardType.MINION,
        name: "Liquid card 6",
        damage: 6,
        health: 6,
        manaCost: 6,
        lore: "Liquid card 6 effect",
        effects: []
    }, {
        id: 106,
        klass: CardKlass.LIQUID,
        type: CardType.MAGIC,
        name: "Liquid card 7",
        manaCost: 7,
        lore: "Liquid card 7 effect",
        effects: []
    }, {
        id: 107,
        klass: CardKlass.LIQUID,
        type: CardType.MAGIC,
        name: "Liquid card 8",
        manaCost: 8,
        lore: "Liquid card 8 effect",
        effects: []
    }, {
        id: 108,
        klass: CardKlass.LIQUID,
        type: CardType.MAGIC,
        name: "Liquid card 9",
        manaCost: 9,
        lore: "Liquid card 9 effect",
        effects: []
    }, {
        id: 109,
        klass: CardKlass.LIQUID,
        type: CardType.TRAP,
        name: "Liquid card 10",
        manaCost: 10,
        lore: "Liquid card 10 effect",
        effects: []
    }, {
        id: 110,
        klass: CardKlass.LIQUID,
        type: CardType.TRAP,
        name: "Liquid card 11",
        manaCost: 11,
        lore: "Liquid card 11 effect",
        effects: []
    }, {
        id: 111,
        klass: CardKlass.LIQUID,
        type: CardType.TRAP,
        name: "Liquid card 12",
        manaCost: 12,
        lore: "Liquid card 12 effect",
        effects: []
    }, {
        id: 150,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 1",
        damage: 1,
        health: 1,
        manaCost: 1,
        lore: "Gas card 1 effect",
        effects: []
    }, {
        id: 151,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 2",
        damage: 2,
        health: 2,
        manaCost: 2,
        lore: "Gas card 2 effect",
        effects: []
    }, {
        id: 152,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 3",
        damage: 3,
        health: 3,
        manaCost: 3,
        lore: "Gas card 3 effect",
        effects: []
    }, {
        id: 153,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 4",
        damage: 4,
        health: 4,
        manaCost: 4,
        lore: "Gas card 4 effect",
        effects: []
    }, {
        id: 154,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 5",
        damage: 5,
        health: 5,
        manaCost: 5,
        lore: "Gas card 5 effect",
        effects: []
    }, {
        id: 155,
        klass: CardKlass.GAS,
        type: CardType.MINION,
        name: "Gas card 6",
        damage: 6,
        health: 6,
        manaCost: 6,
        lore: "Gas card 6 effect",
        effects: []
    }, {
        id: 156,
        klass: CardKlass.GAS,
        type: CardType.MAGIC,
        name: "Gas card 7",
        manaCost: 7,
        lore: "Gas card 7 effect",
        effects: []
    }, {
        id: 157,
        klass: CardKlass.GAS,
        type: CardType.MAGIC,
        name: "Gas card 8",
        manaCost: 8,
        lore: "Gas card 8 effect",
        effects: []
    }, {
        id: 158,
        klass: CardKlass.GAS,
        type: CardType.MAGIC,
        name: "Gas card 9",
        manaCost: 9,
        lore: "Gas card 9 effect",
        effects: []
    }, {
        id: 159,
        klass: CardKlass.GAS,
        type: CardType.TRAP,
        name: "Gas card 10",
        manaCost: 10,
        lore: "Gas card 10 effect",
        effects: []
    }, {
        id: 160,
        klass: CardKlass.GAS,
        type: CardType.TRAP,
        name: "Gas card 11",
        manaCost: 11,
        lore: "Gas card 11 effect",
        effects: []
    }, {
        id: 161,
        klass: CardKlass.GAS,
        type: CardType.TRAP,
        name: "Gas card 12",
        manaCost: 12,
        lore: "Gas card 12 effect",
        effects: []
    }, {
        id: 200,
        klass: CardKlass.PLASMA,
        type: CardType.MINION,
        name: "Plasma card 1",
        damage: 1,
        health: 1,
        manaCost: 1,
        lore: `
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
        lore: `
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
        lore: `
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
        lore: `
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
        lore: `
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
        lore: `
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
        lore: `
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
        lore: "Plasma card 8 effect",
        effects: []
    }, {
        id: 208,
        klass: CardKlass.PLASMA,
        type: CardType.MAGIC,
        name: "Plasma card 9",
        manaCost: 9,
        lore: "Plasma card 9 effect",
        effects: []
    }, {
        id: 209,
        klass: CardKlass.PLASMA,
        type: CardType.TRAP,
        name: "Plasma card 10",
        manaCost: 10,
        lore: `
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
        lore: "Plasma card 11 effect",
        effects: []
    }, {
        id: 211,
        klass: CardKlass.PLASMA,
        type: CardType.TRAP,
        name: "Plasma card 12",
        manaCost: 12,
        lore: "Plasma card 12 effect",
        effects: []
    }];
const heroes = [{
        name: "Solid Hero",
        klass: CardKlass.SOLID,
        health: 100,
        mana: 20,
        effects: []
    }, {
        name: "Liquid Hero",
        klass: CardKlass.LIQUID,
        health: 100,
        mana: 20,
        effects: []
    }, {
        name: "Gas Hero",
        klass: CardKlass.GAS,
        health: 100,
        mana: 20,
        effects: []
    }, {
        name: "Plasma Hero",
        klass: CardKlass.PLASMA,
        health: 100,
        mana: 20,
        effects: []
    }];
// passive: {
//     name: "Thick Armor",
//     amount: 10,
//     info: `
//       Solid Hero and Minions take
//       <span class="f--yellow">% Reduced Damage <i class="fas fa-shield-alt fa-fw"></i></span>,
//       when defending.
//     `
//   },
//   active: {
//     name: "Taunt",
//     manaCost: 10,
//     info: `
//       Solid Hero can apply a Taunt buff on Solid Minions or himself, giving it
//       additional
//       <span class="f--yellow"><i class="fas fa-shield-alt fa-fw"></i></span>,
//       and forcing the enemy Hero and Minions to attack that minion for their
//       next turn.
//     `
//   },
// passive: {
//     name: "Passive",
//     amount: 25,
//     info: `
//       Liquid Hero and Minions heal
//       <span class="f--green">50% missing <i class="fas fa-heart fa-fw"></i></span>
//       whenever a Liquid Minion dies.
//     `
//   },
//   active: {
//     name: "Active",
//     manaCost: 30,
//     info: `
//       Liquid hero and minions heal
//       <span class="f--green">10% missing <i class="fas fa-heart"></i></span>.
//     `
//   },
// passive: {
//     name: `
//       <span class="f--red">Radiation <i class="fas fa-burn fa-fw"></i></span>
//     `,
//     amount: 10,
//     info: `
//       <br>
//       When attacking, Plasma Hero and Minions apply
//       <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
//       debuff, which deals
//       <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
//       to the affected Minions or Hero each turn. This effect can stack.
//     `
//   },
//   active: {
//     name: "Unstable Core",
//     manaCost: 50,
//     info: `
//       Plasma Hero applies Unstable Core debuff on one enemy Minion or Hero.
//       Plasma Hero and Minions attacking the affected target will deal additional
//       <span class="f--orange">10% <i class="fas fa-fire fa-fw"></i></span>,
//       and apply
//       <span class="f--red">3 <i class="fas fa-burn fa-fw"></i></span>
//       additional stacks until the end of your turn.
//     `
//   },
// passive: {
//     name: `
//       <span class="f--red">Radiation <i class="fas fa-burn fa-fw"></i></span>
//     `,
//     amount: 10,
//     info: `
//       <br>
//       When attacking, Plasma Hero and Minions apply
//       <span class="f--red"><i class="fas fa-burn fa-fw"></i></span>
//       debuff, which deals
//       <span class="f--orange">1 <i class="fas fa-fire fa-fw"></i></span>
//       to the affected Minions or Hero each turn. This effect can stack.
//     `
//   },
//   active: {
//     name: "Unstable Core",
//     manaCost: 50,
//     info: `
//       Plasma Hero applies Unstable Core debuff on one enemy Minion or Hero.
//       Plasma Hero and Minions attacking the affected target will deal additional
//       <span class="f--orange">10% <i class="fas fa-fire fa-fw"></i></span>,
//       and apply
//       <span class="f--red">3 <i class="fas fa-burn fa-fw"></i></span>
//       additional stacks until the end of your turn.
//     `
//   },
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
export { cards, heroes, passives };
