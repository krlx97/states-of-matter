import {
  Ability,
  CardId,
  CardKlass,
  CardType,
  EffectId
} from "../enums/index.js";

import type {ClientCards} from "../types/game/index.js";

type Color = "neutral" | "solid" | "liquid" | "gas" | "plasma" | "damage" | "mana" | "health";
type ColorParam = [Color, string];
type ColorParams = Array<ColorParam>;
type ColorTooltip = Array<string | ColorParam>;

const colorTooltip = (
  strings: TemplateStringsArray,
  ...params: ColorParams
): ColorTooltip => {
  let final: ColorTooltip = [];

  strings.forEach((string, i): void => {
    final.push(string);

    const param = params[i];

    if (param) {
      final.push(param);
    }
  });

  return final;
};

function trimmer(strings: TemplateStringsArray, ...values: ColorParams) {
    // Join the strings and values into a single string
    const fullString = strings.reduce((accumulator, current, index) => {
        return `${accumulator}${current}${values[index] || ''}`;
    }, '');

    // Replace newline characters with spaces and trim the result
    return fullString.replace(/\n/g, " ").trim();
}

const cards: ClientCards = [{ // Heroes
  id: CardId.BOEDICEA,
  name: "Boedicea",
  type: CardType.HERO,
  klass: CardKlass.SOLID,
  health: 20,
  mana: 10,
  aura: {
    id: EffectId.ETERNAL_AURA,
    name: "Eternal Aura",
    description: colorTooltip`
      ${["solid", "Solid"]} cards' ${["mana", "mana cost"]} is reduced by
      ${["mana", "1"]}.
    `
  },
  ability: {
    id: Ability.FORTIFY,
    name: "Fortify",
    description: colorTooltip`
      Target minion or hero gains ${["solid", "1 shield"]}.
    `
  },
  lore: `
    Forged from metal, earth, and stone, Boedicea stood lifeless, awaiting a
    soul. It was no human breath that awakened her but the voice of the mineral
    kingdom, calling her its own. Now she moves, an immovable guardian of the
    earth: “You are from above; I am from below.”
  `
}, {
  id: CardId.OLATEA,
  name: "Olatea",
  type: CardType.HERO,
  klass: CardKlass.LIQUID,
  health: 20,
  mana: 10,
  aura: {
    id: EffectId.LIFE_AURA,
    name: "Life Aura",
    description: colorTooltip`
      ${["liquid", "Liquid"]} cards' ${["mana", "mana cost"]} is reduced by
      ${["mana", "1"]}.
    `
  },
  ability: {
    id: Ability.HEAL,
    name: "Rejuvenate",
    description: colorTooltip`
      Target minion's ${["health", "health"]} is increased by
      ${["health", "1"]}.
    `
  },
  lore: `
    She understood it all. What once was unseen now is seen. To see inner
    geography of her body meant understanding others. Thoughts navigate through
    network of lymphatic rivers, bloodstreams and all that flows and oozes
    inside and outside. Her body became smaller, not unlike that prophetess of
    the Old. No longer I hear anything, except the music of the veins.
  `
}, {
  id: CardId.ISAAC,
  name: "Isaac",
  type: CardType.HERO,
  klass: CardKlass.GAS,
  health: 20,
  mana: 10,
  aura: {
    id: EffectId.TOXIC_AURA,
    name: "Toxic Aura",
    description: colorTooltip`
      ${["gas", "Gas"]} cards' ${["mana", "mana cost"]} is reduced by
      ${["mana", "1"]}.
    `
  },
  ability: {
    id: Ability.NEUROTOXIN,
    name: "Neurotoxin",
    description: colorTooltip`
      Target enemy minion or hero ${["health", "health"]} is reduced by
      ${["health", "1"]} every time you end your turn.
    `
  },
  lore: `
    He was, after all, just a human in the world where human was a word almost
    forgotten. No longer finding his purpose after the Rapture, he wanted to
    soar high and just watch over everything. If possible forever. After a long
    struggle to change his body, body started to change itself, no longer
    needing any machinery. Sylphs deemed hims as one of his own. Will I ever
    touch the soil again, will I ever die?
  `
}, {
  id: CardId.ZENDARIO,
  name: "Isaac",
  type: CardType.HERO,
  klass: CardKlass.PLASMA,
  health: 20,
  mana: 10,
  aura: {
    id: EffectId.BURNING_AURA,
    name: "Burning Aura",
    description: colorTooltip`
      ${["plasma", "Plasma"]} cards' ${["mana", "mana cost"]} is reduced by
      ${["mana", "1"]}.
    `
  },
  ability: {
    id: Ability.OVERCHARGE,
    name: "Electrocute",
    description: colorTooltip`
      Target enemy minion or hero ${["health", "health"]} is reduced by
      ${["health", "2"]}.
    `
  },
  lore: `
    He was, after all, just a human in the world where human was a word almost
    forgotten. No longer finding his purpose after the Rapture, he wanted to
    soar high and just watch over everything. If possible forever. After a long
    struggle to change his body, body started to change itself, no longer
    needing any machinery. Sylphs deemed hims as one of his own. Will I ever
    touch the soil again, will I ever die?
  `
}, {//--------------------------------------
  id: CardId.SEAFARER,
  name: "Seafarer",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 2,
  damage: 1,
  manaCost: 3,
  effect: {
    id: EffectId.SHADOW_SURGE,
    name: "Shadow Surge",
    description: colorTooltip`
      Seafarer can attack immediately when normal or special summoned.
    `
  },
  lore: trimmer`
    In the depths of The Stone Wall, an ancient darkness unfurls, ensnaring the
    unwary. Those who traverse its waters return as shadows of their former
    selves, their minds unraveling as they whisper forgotten languages. Their
    souls drift in a void, longing for peace that eludes them forever.
  `
}, {
  id: CardId.AVET,
  name: "Avet",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 2,
  damage: 3,
  manaCost: 5,
  effect: {
    id: EffectId.QUICK_SHOT,
    name: "Quick Shot",
    description: colorTooltip`
      Avet shoots a shadow arrow when it is normal summoned, reducing the
      ${["health", "health"]} of a random enemy minion by ${["health", "2"]}.
    `
  },
  lore: trimmer`
    Embodiments of shadow glide through the ether, a haunting reminder of
    mortality. These spirits, neither benevolent nor malevolent, cling to
    existence, swirling with regret. They wander the unseen realms, seeking
    solace in whispers, forever trapped in a cycle of life and death.
  `
}, {
  id: CardId.GUIDING_LIGHTS,
  name: "Guiding Lights",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 4,
  damage: 2,
  manaCost: 5,
  effect: {
    id: EffectId.BLAZE,
    name: "Blaze",
    description: colorTooltip`Guiding Lights can attack twice per turn.`
  },
  lore: trimmer`
    When the moon is a sliver in the sky, ethereal lights flicker, beckoning the
    pure-hearted. These luminous orbs dance in patterns known only to the
    cosmos, guiding souls toward enlightenment. They embody the eternal struggle
    between darkness and light, whispering secrets to the brave.
  `
}, {
  id: CardId.VESSELS,
  name: "Vessels",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 3,
  damage: 3,
  manaCost: 4,
  effect: {
    id: EffectId.NECROMANCY,
    name: "Necromancy",
    description: colorTooltip`
      Lose ${["damage", "2 damage"]} and ${["health", "2 health"]} when normal
      summoned, gain ${["damage", "2 damage"]} and ${["health", "2 health"]}
      when special summoned.
    `
  },
  lore: trimmer`
    Embracing the inevitability of death, she transcended fear to find a deeper
    purpose. As a vessel forged from human spirit and ethereal power, she
    channels universal energies, becoming a beacon of hope. The silence of death
    pales in comparison to her divine mission of transcendent strength.
  `
}, {
  id: CardId.SLEEPER,
  name: "Sleeper",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 4,
  damage: 1,
  manaCost: 5,
  effect: {
    id: EffectId.ELUSIVE,
    name: "Elusive",
    description: colorTooltip`Can't be targeted by card effects.`
  },
  lore: trimmer`
    Awakened from an age-long slumber, he finds himself reborn in a world
    steeped in forgotten dreams. His frail form hides an indomitable spirit that
    commands both respect and fear. Armed with a rusted blade, he wanders realms
    of fantasy, honoring the shadows that granted him battle's thrill.
  `
}, {
  id: CardId.PILGRIMS,
  name: "Pilgrims",
  type: CardType.MINION,
  klass: CardKlass.NEUTRAL,
  health: 4,
  damage: 3,
  manaCost: 7,
  effect: {
    id: EffectId.REVENGE,
    name: "Revenge",
    description: colorTooltip`
      When Pilgrims are sent to the graveyard, special summon another Pilgrims
      card from the deck or hand.
    `
  },
  lore: trimmer`
    Years spent in sacred silence forged him into a warrior, ready to carve his
    fate upon existence. Swifter than a fleeting thought, and stronger than
    legends, he embodies the fusion of mind and body. A new era of champions
    rises, fueled by determination, eager to challenge their trials.
  `
}, {
  id: CardId.GRAVECALL,
  name: "Gravecall",
  type: CardType.MAGIC,
  klass: CardKlass.NEUTRAL,
  manaCost: 8,
  effect: {
    id: EffectId.REBIRTH,
    name: "Rebirth",
    description: colorTooltip`Special summon one minion from the graveyard.`
  },
  lore: trimmer`
    In the realm where life and death intertwine, the fallen rise once more,
    ignited by glory's call. They emerge, not as shadows, but as embodiments of
    valor, ready to serve again. Each resurrection is a testament to their
    undying will, seeking to reclaim honor on the eternal battlefield.
  `
}, {
  id: CardId.CROSS,
  name: "Cross",
  type: CardType.MAGIC,
  klass: CardKlass.NEUTRAL,
  manaCost: 4,
  effect: {
    id: EffectId.DIMINISH,
    name: "Diminish",
    description: colorTooltip`
      Target enemy minion loses ${["damage", "1 damage"]}.
    `
  },
  lore: trimmer`
    As the essence of strength ebbs, a chilling wind heralds the end of life’s
    struggle. Shadows loom, revealing the frailty of existence, reminding all
    that life’s thread can be severed with a whisper. In this moment, the dance
    of fate reaches its zenith, leaving the next soul’s fate in balance.
  `
}, {
  id: CardId.GAMBIT,
  name: "Gambit",
  type: CardType.MAGIC,
  klass: CardKlass.NEUTRAL,
  manaCost: 4,
  effect: {
    id: EffectId.RELOAD,
    name: "Reload",
    description: colorTooltip`Draw one card from the deck.`
  },
  lore: trimmer`
    The wheel of fortune spins in the cosmic void, offering glimpses of fate’s
    whims. Each turn holds promise, a chance to alter destiny itself. Eager
    souls embrace the gamble, knowing that in chaos lies potential for both
    greatness and ruin, a dance between risk and reward.
  `
}, {
  id: CardId.REFLECTION,
  name: "Reflection",
  type: CardType.TRAP,
  klass: CardKlass.NEUTRAL,
  manaCost: 3,
  effect: {
    id: EffectId.MIRRORS_EDGE,
    name: "Mirror's Edge",
    description: colorTooltip`
      Reflect the next incoming attack back to the enemy hero.
    `
  },
  lore: trimmer`
    The sword's edge reflects choices made in blood and honor, echoing that
    those who wield it may meet their own demise. In the shimmering surface,
    past and future collide, revealing the intricate tapestry woven by fate.
    Every strike carries consequence, where glory and tragedy coexist.
  `
}, {
  id: CardId.DISCUS,
  name: "Discus",
  type: CardType.TRAP,
  klass: CardKlass.NEUTRAL,
  manaCost: 4,
  effect: {
    id: EffectId.SMITE,
    name: "Smite",
    description: colorTooltip`
      Destroy the next enemy minion that is normal summoned.
    `
  },
  lore: trimmer`
    With each moment, power shifts, and sacrifices must be made for survival. As
    their ranks dwindle, the echoes of choices reverberate, signaling the time
    for reckoning is near. A price must be paid, a cost in blood and spirit, as
    destiny demands its due.
  `
}, {
  id: CardId.SPELLBANE,
  name: "Spellbane",
  type: CardType.TRAP,
  klass: CardKlass.NEUTRAL,
  manaCost: 4,
  effect: {
    id: EffectId.SILENCE,
    name: "Silence",
    description: colorTooltip`Destroy the enemy's next magic card.`
  },
  lore: trimmer`
    In a realm where energies intertwine, the flow of magic is a fickle river,
    often failing to reach its target. Forces spiral outward only to recoil,
    creating stillness. In this moment, the true power of silence emerges,
    halting chaos and rendering the arcane powerless against the void.
  `
}, {
  // ----- Solid -----
  id: CardId.DENDRITES,
  name: "Dendrites",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 3,
  damage: 2,
  manaCost: 3,
  effect: {
    id: EffectId.GLORY,
    name: "Glory",
    description: colorTooltip`
      Deal ${["damage", "1 damage"]} to a random enemy minion. Dendrites gains
      ${["solid", "taunt"]} if the minion is sent to the graveyard.
    `
  },
  lore: trimmer`
    In the ancient woods, the line between life and earth blurs. Flesh hardens
    to bark, roots entwine the soul, and the forest whispers a song of eternity.
    Was there ever a time before its quiet embrace? Or has the war always been
    part of the roots, growing deep and unyielding?
  `
}, {
  id: CardId.GNOMES,
  name: "Gnomes",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 3,
  damage: 1,
  manaCost: 2,
  effect: {
    id: EffectId.UNITY,
    name: "Unity",
    description: colorTooltip`
      When a Gnomes card is sent to the graveyard, other Gnomes cards from the
      deck or hand gain ${["solid", "taunt"]}.
    `
  },
  lore: trimmer`
    Small yet steadfast, gnomes carry the weight of ancient secrets hidden in
    the soil. Their quiet strength shields the earth's wisdom, their hands
    shaping the foundation of life. They are humble protectors, unshaken by
    storms or the passing of time, a force stronger than stone.
  `
}, {
  id: CardId.MUD_SPIRIT,
  name: "Mud Spirit",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 2,
  damage: 3,
  manaCost: 4,
  effect: {
    id: EffectId.SPELLWEAVE,
    name: "Spellweave",
    description: colorTooltip`
      Gains ${["solid", "1 shield"]} for each magic card in your graveyard.
    `
  },
  lore: trimmer`
    Mud Spirits emerge from the earth, formless yet unrelenting. Their thoughts
    are slow and eternal, their movements mirroring the patience of mountains.
    To mortals, they seem inscrutable, but their loyalty is undeniable,
    grounding allies with a power as ancient as the land itself.
  `
}, {
  id: CardId.PEACEMAKER,
  name: "Peacemaker",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 4,
  damage: 3,
  manaCost: 5,
  effect: {
    id: EffectId.SHIELDWALL,
    name: "Shieldwall",
    description: colorTooltip`
      When normal summoned, adjacent minions gain ${["solid", "1 shield"]}.
    `
  },
  lore: trimmer`
    When the final clash fades, the Peacemaker stands amidst the ruins, offering
    silence instead of conflict. It does not fight but guides weary souls to
    rest. In its presence, the echoes of war dissolve into stillness, leaving
    only peace as eternal as the stars.
  `
}, {
  id: CardId.GOLEMICA,
  name: "Golemica",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 5,
  damage: 1,
  manaCost: 6,
  effect: {
    id: EffectId.UNBREAKABLE,
    name: "Unbreakable",
    description: colorTooltip`
      Golemica gains double ${["solid", "shield"]}.
    `
  },
  lore: trimmer`
    Forged from stone and forgotten knowledge, Golemica knows no fear, mercy,
    or end. Its relentless strength crushes all in its path, a silent juggernaut
    bound to its purpose. It is the will of the earth made manifest, unyielding
    and eternal, unmoved by time or foe.
  `
}, {
  id: CardId.CAVE_LION,
  name: "Cave Lion",
  type: CardType.MINION,
  klass: CardKlass.SOLID,
  health: 4,
  damage: 3,
  manaCost: 7,
  effect: {
    id: EffectId.PROTECTOR,
    name: "Protector",
    description: colorTooltip`
      Gain ${["solid", "1 shield"]} when normal summoned, or gain
      ${["solid", "taunt"]} when special summoned.
    `
  },
  lore: trimmer`
    In the eternal dark of the caverns, cave lions rule unseen. They stalk their
    prey without sound or sight, guided by instincts honed through endless
    hunts. By day, they dream of conquests past; by night, they dominate the
    shadows, untouchable and magnificent.
  `
}, {
  id: CardId.PACT,
  name: "Pact",
  type: CardType.MAGIC,
  klass: CardKlass.SOLID,
  manaCost: 3,
  effect: {
    id: EffectId.VALOR,
    name: "Valor",
    description: colorTooltip`
      Remove ${["solid", "shield"]} from all your minions and deal equal
      ${["damage", "damage"]} to the enemy hero.
    `
  },
  lore: trimmer`
    Your rage is the earth's chorus, summoning spirits to rise in your name.
    With each strike, their strength grows, turning fury into devastation.
    Together, you channel the unyielding force of the ground, bringing ruin to
    all who dare defy its sacred dominion.
  `
}, {
  id: CardId.ANVIL,
  name: "Anvil",
  type: CardType.MAGIC,
  klass: CardKlass.SOLID,
  manaCost: 5,
  effect: {
    id: EffectId.SHELL,
    name: "Shell",
    description: colorTooltip`
      All your minions gain ${["solid", "1 shield"]}.
    `
  },
  lore: trimmer`
    In the heart of battle, the anvil rings true. With each strike, its enduring
    strength shields the weak, transforming defense into an unbreakable wall.
    Allies rally to its call, their resolve unshaken, as the forge of war burns
    brighter with hope.
  `
}, {
  id: CardId.QUICK_SAND,
  name: "Quick Sand",
  type: CardType.MAGIC,
  klass: CardKlass.SOLID,
  manaCost: 4,
  effect: {
    id: EffectId.FORTITUDE,
    name: "Fortitude",
    description: colorTooltip`
      Deal ${["damage", "1 damage"]} to your minion, and grant it
      ${["solid", "taunt"]} if it survives.
    `
  },
  lore: trimmer`
    The earth waits patiently to claim its own. Sink or survive—the choice is
    yours. With every struggle, the ground pulls tighter, testing strength and
    resolve. The stronger the will, the deeper the embrace, as the sands decide
    who will rise and who will fall.
  `
}, {
  id: CardId.WORMHOLE,
  name: "Wormhole",
  type: CardType.TRAP,
  klass: CardKlass.SOLID,
  manaCost: 3,
  effect: {
    id: EffectId.RICOCHET,
    name: "Ricochet",
    description: colorTooltip`
      Redirect the next incoming attack to a random enemy minion.
    `
  },
  lore: trimmer`
    In chaos, even strength can falter. The earth twists and shifts, leading
    enemies astray. Strikes go wide, traps snap shut, and confusion takes hold.
    Let them stumble into their own undoing, their efforts swallowed by the very
    ground they sought to conquer.
  `
}, {
  id: CardId.CAGE,
  name: "Cage",
  type: CardType.TRAP,
  klass: CardKlass.SOLID,
  manaCost: 4,
  effect: {
    id: EffectId.LAST_STAND,
    name: "Last Stand",
    description: colorTooltip`
      When your minion would die after combat, set it to
      ${["health", "1 health"]} and give it ${["solid", "taunt"]}.
    `
  },
  lore: trimmer`
    Near the edge of death, the will to survive burns brightest. Every wound
    fuels strength, every moment builds resolve. With the right fortitude, pain
    becomes power, and the cage of despair turns into a forge, creating warriors
    ready to break free and endure.
  `
}, {
  id: CardId.FURY,
  name: "Fury",
  type: CardType.TRAP,
  klass: CardKlass.SOLID,
  manaCost: 5,
  effect: {
    id: EffectId.HEART_OF_STEEL,
    name: "Heart of Steel",
    description: colorTooltip`
      When an enemy destroys an ally's ${["solid", "shield"]}, that minion
      gains ${["damage", "3 damage"]}.
    `
  },
  lore: trimmer`
    Their raw power strikes with brutal force, but each blow only strengthens
    your resolve. The earth answers their rage, rising stronger with every
    impact. In the end, their fury will break against your unyielding spirit,
    the ground itself standing as your shield.
  `
}, { // ----- Liquid -----
  id: CardId.LIQUID_1,
  name: "Tidesinger",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.RISING_FURY,
    name: "Rising Fury",
    description: colorTooltip`
      When one of your minions is sent to the graveyard, Liquid 1 gains
      ${["damage", "1 damage"]} and is ${["liquid", "healed"]} for
      ${["health", "1 health"]}.
    `
  },
  lore: `
    The Tidesinger hums the forgotten hymns of the deep, its voice resonating
    through the currents. With each note, it taps into the ancient forces of
    water, weaving life and power in a seamless dance.
  `
}, {
  id: CardId.LIQUID_2,
  name: "Lifespring",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.REGENERATION,
    name: "Regeneration",
    description: colorTooltip`
      At the end of your turn, one of your minions is ${["liquid", "healed"]}
      for ${["health", "2 health"]}, excluding this minion.
    `
  },
  lore: `
    The Lifespring is an eternal fountain of vitality, its waters never ceasing
    to flow. Legends speak of its origins in the heart of the deepest ocean,
    where it draws energy to heal all who draw near.
  `
}, {
  id: CardId.LIQUID_3,
  name: "Abyssal Healer",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.SACRIFICE,
    name: "Sacrifice",
    description: colorTooltip`
      While this card is on the field, when a liquid minion is sent to the
      graveyard, your hero gains ${["health", "3 health"]}.
    `
  },
  lore: `
    Born in the dark abysses of the ocean floor, the Abyssal Healer wields the
    mysterious forces of the deep. Its presence is said to be a blessing for the
    weak, but a reminder of mortality for those who tread too close.
  `
}, {
  id: CardId.LIQUID_4,
  name: "Tidal Stalker",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.SHADOWSTRIKE,
    name: "Shadowstrike",
    description: colorTooltip`
      Liquid 4 can attack enemy minions with ${["health", "stealth"]}.
    `
  },
  lore: `
    The Tidal Stalker is a force that moves unseen, its presence felt only in
    the wake of its actions. Fluid and formless, it strikes with precision
    before slipping back into the hidden currents from whence it came.
  `
}, {
  id: CardId.LIQUID_5,
  name: "Bloodtide Brute",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.LEECH,
    name: "Leech",
    description: colorTooltip`
      When Liquid 5 deals ${["damage", "damage"]}, your hero gains
      ${["health", "health"]} equal to the ${["damage", "damage"]} dealt.
    `
  },
  lore: `
    The Bloodtide Brute surges forward with the force of a storm-tossed sea,
    relentless and primal. Its essence is tied to the waters of countless battles,
    feeding off the chaos of war.
  `
}, {
  id: CardId.LIQUID_6,
  name: "Mireling",
  type: CardType.MINION,
  klass: CardKlass.LIQUID,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.RESILIENT,
    name: "Resilient",
    description: colorTooltip`
      This card always takes ${["damage", "1 damage"]}.
    `
  },
  lore: `
    Emerging from the black waters of forgotten swamps, the Mireling drifts
    through life with fragile but eerie persistence. While its form is weak, the
    essence of the murky depths flows through it, keeping it bound to the living
    world.
  `
}, {
  id: CardId.LIQUID_7,
  name: "Purifying Wave",
  type: CardType.MAGIC,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.ELECTRO_SHOCK,
    name: "Electro Shock",
    description: colorTooltip`
      ${["liquid", "Cleanse"]} all buffs and debuffs from both enemy and ally
      fields.
    `
  },
  lore: `
    A wave of cleansing energy sweeps across the battlefield, as pure as the
    waters of a hidden spring. It carries away all burdens and impurities,
    leaving only serenity in its wake.
  `
}, {
  id: CardId.LIQUID_8,
  name: "Healing Waters",
  type: CardType.MAGIC,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.CLEANSE,
    name: "Purify",
    description: colorTooltip`
      ${["liquid", "Cleanse"]} all debuffs from your minion.
    `
  },
  lore: `
    Waters blessed with divine power flow gently across the battlefield, washing
    over the wounded and weary. Each drop carries a spark of renewal, refreshing
    both the body and soul.
  `
}, {
  id: CardId.LIQUID_9,
  name: "Well of Life",
  type: CardType.MAGIC,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.TIDAL_WAVE,
    name: "Tidal Wave",
    description: colorTooltip`
      All your minions gain ${["health", "3 health"]}.
    `
  },
  lore: `
    From deep within the earth, the Well of Life bubbles up, its waters brimming
    with untapped power. To those who drink of it, the promise of healing and
    rejuvenation flows freely, restoring what was lost.
  `
}, {
  id: CardId.LIQUID_10,
  name: "Drenching Strike",
  type: CardType.TRAP,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.RETRIBUTION,
    name: "Retribution",
    description: colorTooltip`
      Whenever an enemy minion attacks your hero, it and its adjacent minions
      lose ${["damage", "2 damage"]}.
    `
  },
  lore: `
    From nowhere, the heavens open and a torrential downpour engulfs the
    battlefield. The force of the rain disrupts all who stand beneath it,
    weakening their resolve and washing away their strength.
  `
}, {
  id: CardId.LIQUID_11,
  name: "Floodwall",
  type: CardType.TRAP,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.FROSTBITE,
    name: "Frostbite",
    description: colorTooltip`
      When an enemy minion attacks, reduce its ${["damage", "damage"]} to
      ${["damage", "1"]}.
    `
  },
  lore: `
    A towering wall of water surges forth, defending against any who would dare
    approach. Its relentless flow defies all attempts to pass, turning even the
    most fearsome attacks into mere ripples.
  `
}, {
  id: CardId.LIQUID_12,
  name: "Rising Tide",
  type: CardType.TRAP,
  klass: CardKlass.LIQUID,
  manaCost: 1,
  effect: {
    id: EffectId.BANISH,
    name: "Banish",
    description: colorTooltip`
      When an enemy minion is summoned, it is returned to opponent's hand.
    `
  },
  lore: `
    Like the relentless tide that swallows the shore, this force cannot be
    contained. All who oppose it are swept away, returned to the depths from
    whence they came, powerless to resist the flow of fate.
  `
}, { // ----- Gas ----- 
  id: CardId.GAS_1, 
  name: "Poison Ship", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 2, 
  damage: 1, 
  manaCost: 5, 
  effect: { 
    id: EffectId.ACIDIC_DEATH, 
    name: "Acidic Death", 
    description: colorTooltip`Deals 1 damage to all Minions on the board when this card dies.` 
  }, 
  lore: `The sails are torn, the hull creaks with decay. No wind guides it; only the acrid stench of rot. Few who board the Poison Ship return, and those who do... bring something worse than death.` 
}, { 
  id: CardId.GAS_2, 
  name: "Avala Hawk", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 3, 
  damage: 1, 
  manaCost: 2, 
  effect: { 
    id: EffectId.STEALTH, 
    name: "Vanish", 
    description: colorTooltip`Avalanche Hawk hides in the gas clouds, gaining ${["gas", "Stealth"]} when normal summoned.` 
  }, 
  lore: `Its wings cut through the thickest mist, silent and swift. By the time you glimpse its silhouette, it's already too late. The Avala Hawk thrives where breathless skies take life away.` 
}, { 
  id: CardId.GAS_3, 
  name: "Nervebite", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 1, 
  damage: 1, 
  manaCost: 1, 
  effect: { 
    id: EffectId.POISONOUS_TOUCH, 
    name: "Poisonous Touch", 
    description: colorTooltip`Attacks infect their target with Neurotoxin.` 
  }, 
  lore: `The slightest touch spreads its venom through flesh and bone. A creeping numbness takes hold, followed by a slow descent into a darkness from which there is no escape. Nervebite shows no mercy.` 
}, { 
  id: CardId.GAS_4, 
  name: "Toxic Weaver", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 1, 
  damage: 1, 
  manaCost: 1, 
  effect: { 
    id: EffectId.TOXIC_SPRAY, 
    name: "Toxic Spray", 
    description: colorTooltip`On Normal Summon, this Minion deals 1 damage to a random enemy minion and infects it with Neurotoxin.` 
  }, 
  lore: `In the shadows, it weaves its deadly web, releasing threads of poison into the air. Its victims fall not to its bite, but to the slow, invisible death it spins around them.` 
}, { 
  id: CardId.GAS_5, 
  name: "Venomsting", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 1, 
  damage: 1, 
  manaCost: 1, 
  effect: { 
    id: EffectId.CORROSIVE_TOUCH, 
    name: "Corrosive Touch", 
    description: colorTooltip`Whenever this Minion attacks, it deals 1 extra damage to the enemy Hero.` 
  }, 
  lore: `A strike from Venomsting feels like a pinprick—barely noticeable at first. But the agony that follows... it spreads deeper and deeper, eating away until nothing but suffering remains.` 
}, { 
  id: CardId.GAS_6, 
  name: "Plagueborn", 
  type: CardType.MINION, 
  klass: CardKlass.GAS, 
  health: 1, 
  damage: 1, 
  manaCost: 1, 
  effect: { 
    id: EffectId.TOXIC_GAS, 
    name: "Toxic Gas", 
    description: colorTooltip`On Normal Summon, all enemy Minions are infected with Neurotoxin.` 
  }, 
  lore: `It takes no shape, no form, and yet it moves among the living with purpose. The Plagueborn carries sickness in its every step, and those near it can feel their strength wither.` 
}, { 
  id: CardId.GAS_7, 
  name: "Corrosive Deluge", // Renamed from "Acid Rain"
  type: CardType.MAGIC, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.ACID_RAIN, 
    name: "Acid Rain", 
    description: colorTooltip`Deals 1 Damage to all enemy minions.` 
  }, 
  lore: `It begins as a drizzle, leaving faint hisses where it lands. But as the downpour intensifies, the ground bubbles, and those caught within it watch their flesh and armor alike dissolve to the bone.` 
}, { 
  id: CardId.GAS_8, 
  name: "Veil of Ash", // Renamed from "Smoke Bomb"
  type: CardType.MAGIC, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.SMOKE_BOMB, 
    name: "Smoke Bomb", 
    description: colorTooltip`All your minions gain stealth.` 
  }, 
  lore: `With one spark, the battlefield is enveloped in a blinding haze. The wisps dance around, hiding friend from foe. Those who step in find themselves lost, vulnerable, at the mercy of what lurks within the smoke.` 
}, { 
  id: CardId.GAS_9, 
  name: "Fetid Vapors", // Renamed from "Contaminated Air"
  type: CardType.MAGIC, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.CONTAMINATED_AIR, 
    name: "Contaminated Air", 
    description: colorTooltip`All minions on the board have -1 Attack.` 
  }, 
  lore: `Invisible but pervasive, the tainted air gnaws at your lungs and slows your limbs. Those who once fought fiercely find their blows feeble, sapped of strength as they struggle just to breathe.` 
}, { 
  id: CardId.GAS_10, 
  name: "Blighted Pin", // Renamed from "Rusty Needle"
  type: CardType.TRAP, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.RUSTY_NEEDLE, 
    name: "Rusty Needle", 
    description: colorTooltip`When an enemy Minion attacks, infect it with Neurotoxin.` 
  }, 
  lore: `Discarded and forgotten, the needle lies in wait, corroded but deadly. Its rust hides poison; a single prick is enough to unleash the toxin, creeping through veins with relentless precision.` 
}, { 
  id: CardId.GAS_11, 
  name: "Lingering Miasma", // Renamed from "Noxious Fumes"
  type: CardType.TRAP, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.NOXIOUS_FUMES, 
    name: "Noxious Fumes", 
    description: colorTooltip`When an enemy Minion attacks, deal 1 damage to it and its adjacent Minions.` 
  }, 
  lore: `A faint cloud lingers just above the ground, almost unnoticeable. Yet as soon as movement stirs the air, it billows out, engulfing all nearby in its suffocating embrace, leaving only silence in its wake.` 
}, { 
  id: CardId.GAS_12, 
  name: "Venomous Mire", // Renamed from "Poisoned Ground"
  type: CardType.TRAP, 
  klass: CardKlass.GAS, 
  manaCost: 1, 
  effect: { 
    id: EffectId.POISONED_GROUND, 
    name: "Poisoned Ground", 
    description: colorTooltip`When an enemy Minion is summoned, it becomes infected with Neurotoxin.` 
  }, 
  lore: `The ground itself has turned against its inhabitants. What seems solid shifts and warps, laced with invisible toxins that seep up with each step, infecting the unwise who enter its domain.` 
}, { // ----- Plasma -----
  id: CardId.PLASMA_1,
  name: "Stellar Ember",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.SELF_DESTRUCT,
    name: "Self-Destruct",
    description: colorTooltip`When card dies, deal 3 damage to the enemy hero.`
  },
  lore: `Born from a collapsing star’s core, Stellar Ember carries the heat of its origin, a volatile remnant that flares brightly before fading into cosmic ash.`
}, {
  id: CardId.PLASMA_2,
  name: "Celestial Warden",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.RAMPAGE,
    name: "Rampage",
    description: colorTooltip`Whenever attacks and survives, gain +1 damage.`
  },
  lore: `Ancient and watchful, the Celestial Warden patrols the edges of starlight, a sentinel armed with the fury of interstellar storms.`
}, {
  id: CardId.PLASMA_3,
  name: "Void Whisper",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.BACKSTAB,
    name: "Backstab",
    description: colorTooltip`When attacking a hero, deal 1 additional damage and leech 1 Mana.`
  },
  lore: `Invisible yet ever-present, Void Whisper slips through shadows of the cosmos, carrying secrets of forgotten constellations to unsuspecting enemies.`
}, {
  id: CardId.PLASMA_4,
  name: "Astro Marksman",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.MARKSMANSHIP,
    name: "Marksmanship",
    description: colorTooltip`Astro Marksman's attacks ignore Taunt.`
  },
  lore: `With an eye sharpened by astral alignment, Astro Marksman’s shots slice through space, unfazed by obstacles in their cosmic path.`
}, {
  id: CardId.PLASMA_5,
  name: "Nova Vanguard",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.OVERPOWER,
    name: "Overpower",
    description: colorTooltip`When attacking a minion, deal excess damage to the enemy hero.`
  },
  lore: `Born from the heart of a supernova, Nova Vanguard charges forward, its blows as fierce as the celestial eruptions that created it.`
}, {
  id: CardId.PLASMA_6,
  name: "Astral Enforcer",
  type: CardType.MINION,
  klass: CardKlass.PLASMA,
  health: 1,
  damage: 1,
  manaCost: 1,
  effect: {
    id: EffectId.EXECUTE,
    name: "Execute",
    description: colorTooltip`Executes minions below 1 health after combat.`
  },
  lore: `Steeped in cosmic law, the Astral Enforcer delivers judgment with an unshakable resolve, reducing all weakened threats to stardust.`
}, {
  id: CardId.PLASMA_7,
  name: "Solar Flare",
  type: CardType.MAGIC,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.IGNITE,
    name: "Ignite",
    description: colorTooltip`Deal 3 damage to a target.`
  },
  lore: `As intense as the sun’s surface, Solar Flare channels the raw heat of a star's rage, scorching all caught in its path.`
}, {
  id: CardId.PLASMA_8,
  name: "Galactic Contagion",
  type: CardType.MAGIC,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.CORRUPTION,
    name: "Corruption",
    description: colorTooltip`Deal 2 damage to your minion and give it Corruption.`
  },
  lore: `A cosmic blight that seeps through the veins of its host, Galactic Contagion spreads like wildfire, feeding on the spark of life.`
}, {
  id: CardId.PLASMA_9,
  name: "Celestial Frenzy",
  type: CardType.MAGIC,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.HYSTERIA,
    name: "Hysteria",
    description: colorTooltip`Double your card's damage, but reduce its health to 1, and destroy it when the turn is over.`
  },
  lore: `Unleashing unchecked stellar might, Celestial Frenzy is a chaotic surge of power, devouring itself in a blinding pulse of brilliance.`
}, {
  id: CardId.PLASMA_10,
  name: "Meteor Trap",
  type: CardType.TRAP,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.EXPLOSIVE,
    name: "Explosive",
    description: colorTooltip`When an enemy minion attacks, deal 3 damage to it.`
  },
  lore: `Dormant yet deadly, the Meteor Trap lies in wait, its impact swift and destructive like a hidden asteroid belt’s strike.`
}, {
  id: CardId.PLASMA_11,
  name: "Galactic Mirror",
  type: CardType.TRAP,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.REFLECTION,
    name: "Reflection",
    description: colorTooltip`When an enemy kills your minion with Corruption, all other minions on your field gain corruption.`
  },
  lore: `An eerie creation, the Galactic Mirror reflects cosmic distortions, spreading corruption as swiftly as light travels through the void.`
}, {
  id: CardId.PLASMA_12,
  name: "Gravity Snare",
  type: CardType.TRAP,
  klass: CardKlass.PLASMA,
  manaCost: 1,
  effect: {
    id: EffectId.CONSTRICTION,
    name: "Constriction",
    description: colorTooltip`Reduce attacking Minion's damage to 1.`
  },
  lore: `A silent force, Gravity Snare pulls attackers into an unyielding embrace, diminishing their strength as it binds them in place.`
}];

export {cards};
