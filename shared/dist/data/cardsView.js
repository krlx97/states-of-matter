import { CardId } from "../enums/index.js";
const colorTooltip = (strings, ...params) => {
    let final = [];
    strings.forEach((string, i) => {
        final.push(string);
        const param = params[i];
        if (param) {
            final.push(param);
        }
    });
    return final;
};
const cardsView = [{
        id: CardId.SEAFARER,
        name: "Seafarer",
        lore: `
    Darkness that spreads across The Stone Wall lured many to their doom. Those
    who returned lost their sanity. They walk aimlessly, speaking in tongues
    stripped of any meaning. Human soul which still suffers inside is now just a
    forgotten dream.
  `,
        effect: {
            name: "Shadow Surge",
            description: colorTooltip `
      Seafarer can attack immediately when normal or special summoned.
    `
        },
        skins: []
    }, {
        id: CardId.AVET,
        name: "Avet",
        lore: `
    Death embodied in shadow moves slowly, corrupting anything it touches.
    These spirits are not evil themselves, yet rarely any human dares to even
    think of them. Having no other agenda but to survive, they lurk in the
    Ether to prolong their painful existence by any means.
  `,
        effect: {
            name: "Quick Shot",
            description: colorTooltip `
      Deal ${["damage", "2 damage"]} to a random enemy minion when normal
      summoned.
    `
        },
        skins: []
    }, {
        id: CardId.GUIDING_LIGHTS,
        name: "Guiding Lights",
        lore: `
    During those nights when the moon is still young, lone pilgrims see
    shining lights which guide their way. Dancing in patterns strange to
    comprehend, they have their own logic of existence, helping only those who
    are just and pure. They are aspects of the Light itself, connected to its
    ultimate intelligence.
  `,
        effect: {
            name: "Blaze",
            description: colorTooltip `
      Guiding Lights can attack twice per turn.
    `
        },
        skins: []
    }, {
        id: CardId.VESSELS,
        name: "Vessels",
        lore: `
    She knew she will die soon, yet having known her own fullness, she was no
    longer afraid of eternal silence that awaits. Born from the normal human
    and one with the power, she was given strong etheric body, becoming a
    vessel to serve. Sadness of death is nothing compared to the greater
    cause.
  `,
        effect: {
            name: "Necromancy",
            description: colorTooltip `
      Lose ${["damage", "2 damage"]} and ${["health", "2 health"]} when normal
      summoned, gain ${["damage", "2 damage"]} and ${["health", "2 health"]}
      when special summoned.
    `
        },
        skins: []
    }, {
        id: CardId.SLEEPER,
        name: "Sleeper",
        lore: `
    He has slept for too long and now Earth spat him out and suddenly he knows
    what to do. The body is frail, yet the spirit is solid and commands
    respect and fear. With his rusty sabre pointing to the sun, he still
    dreams while walking, thanking that great, black Mother for letting him
    taste the splendor of combat once again.
  `,
        effect: {
            name: "Elusive",
            description: colorTooltip `
      Can't be targeted by card effects.
    `
        },
        skins: []
    }, {
        id: CardId.PILGRIMS,
        name: "Pilgrims",
        lore: `
    Training for years in the monastery, he has set to fight and maybe die or
    come back victorious. Faster than a blue snake, stronger than a cave
    lioness, his body and mind are one with each other and the war itself. New
    warrior caste, stronger than the old, they are ready to use everything in
    their power to prove themselves in combat.
  `,
        effect: {
            name: "Revenge",
            description: colorTooltip `
      When Pilgrims are sent to the graveyard, special summon another Pilgrims
      card from the deck or hand.
    `
        },
        skins: []
    }, {
        id: CardId.GRAVECALL,
        name: "Gravecall",
        lore: `
    Life once taken away is given back, only to serve further in the glorius
    battle.
  `,
        effect: {
            name: "Rebirth",
            description: colorTooltip `
      Special summon one minion from the graveyard.
    `
        },
        skins: []
    }, {
        id: CardId.CROSS,
        name: "Cross",
        lore: `
    Enemy has no strength to prevail. One life will soon end.
  `,
        effect: {
            name: "Diminish",
            description: colorTooltip `
      Target enemy minion loses ${["damage", "2 damage"]}.
    `
        },
        skins: []
    }, {
        id: CardId.GAMBIT,
        name: "Gambit",
        lore: `
    Let’s see what fate has to offer!
  `,
        effect: {
            name: "Reload",
            description: colorTooltip `
      Draw one card from the deck.
    `
        },
        skins: []
    }, {
        id: CardId.REFLECTION,
        name: "Reflection",
        lore: `
    All who took the sword will perished by the same one.
  `,
        effect: {
            name: "Mirror's Edge",
            description: colorTooltip `
      Reflect next incoming attack back to the enemy hero.
    `
        },
        skins: []
    }, {
        id: CardId.DISCUS,
        name: "Discus",
        lore: `
    They are growing weak in numbers, they will pay the price.
  `,
        effect: {
            name: "Smite",
            description: colorTooltip `
      Destroy the enemies next normal summoned minion card.
    `
        },
        skins: []
    }, {
        id: CardId.SPELLBANE,
        name: "Spellbane",
        lore: `
    Energy flows outwards, yet it returns inward again, failing to strike at
    all.
  `,
        effect: {
            name: "Silence",
            description: colorTooltip `
      Destroy the enemies next magic card.
    `
        },
        skins: []
    }, {
        id: CardId.BOEDICEA, // ----- SOLID -----
        name: "Boedicea",
        lore: `
    Immortality in any form was deemed possible. Created from metal, earth and
    stone, she stood waiting for somebody to breathe and to add soul to the
    husk. When it finally came to pass, it was no human breath. It arrived
    from the spirits of mineral kingdom, which she knew she was a part of. Now
    she moves and defends immovable. You are from above, I am from below.
  `,
        effect: {
            name: "Eternal Aura",
            description: colorTooltip `
      Boedicea and solid minions block ${["damage", "1 damage"]} if they have
      taunt.
    `
        },
        skins: [],
        ability: {
            name: "Fortify",
            description: colorTooltip `
      Give your minion ${["solid", "1 shield"]}.
    `
        }
    }, {
        id: CardId.DENDRITES,
        name: "Dendrites",
        lore: `
    Silence grew and silence won. It made the skin hard as an oak. Green
    dreams did not bring solace, yet the roots run deep and every leaf is one
    with the body. Did you forget about life before the forest? Did the war
    make you even more connected to your host?
  `,
        effect: {
            name: "Glory",
            description: colorTooltip `
      Deal ${["damage", "1 damage"]} to a random enemy minion. Dendrites gains
      ${["solid", "taunt"]} if the minion is sent to the graveyard.
    `
        },
        skins: []
    }, {
        id: CardId.GNOMES,
        name: "Gnomes",
        lore: `
    Being one with the solid means that the soul will also be solid,
    well-versed in the ways of earth. Both humble and powerful, childlike and
    wise, gnomes are like humans who know nothing but earth in all of its
    forms, visible and invisible alike.
  `,
        effect: {
            name: "Unity",
            description: colorTooltip `
      When a Gnomes card is sent to the graveyard, other Gnomes cards from the
      deck or hand gain ${["solid", "taunt"]}.
    `
        },
        skins: []
    }, {
        id: CardId.MUD_SPIRIT,
        name: "Mud Spirit",
        lore: `
    One with the Earth, yet conscious as solitary beings, mud spirits are
    frightening enemies and even more frightening allies. Even though loyal,
    their slow, hazy thoughts cannot be comprehended by any human.
  `,
        effect: {
            name: "Spellweave",
            description: colorTooltip `
      Gains ${["solid", "1 shield"]} for each magic card in your graveyard.
    `
        },
        skins: []
    }, {
        id: CardId.PEACEMAKER,
        name: "Peacemaker",
        lore: `
    Its reign starts now, when the battle is almost over. Come over here, you
    souls who are leaving these rotten flesh, die in me and rejoin again in
    Ether. I finish the war with silence that draws you towards death.
    Serenity takes place.
  `,
        effect: {
            name: "Shieldwall",
            description: colorTooltip `
      When normal summoned, adjacent units gain ${["solid", "1 shield"]}.
    `
        },
        skins: []
    }, {
        id: CardId.GOLEMICA,
        name: "Golemica",
        lore: `
    To have no soul of its own, but to be one with the Earth. To kill, yet to
    know no meaning of death. That is the life of a golem, made in the times
    forgotten. It would be considered foolish to fight one of these.
  `,
        effect: {
            name: "Unbreakable",
            description: colorTooltip `
      Golemica gains double ${["solid", "shield"]}.
    `
        },
        skins: []
    }, {
        id: CardId.CAVE_LION,
        name: "Cave Lion",
        lore: `
    During the day, these magnificient beasts dream of unkwown prey and
    eternal chase. During the night they explore the underground world, their
    only home. For the great lion to hunt, it does not even need to see its
    target. Lack of sight only makes other senses stronger than elsewhere in
    nature.
  `,
        effect: {
            name: "Protector",
            description: colorTooltip `
      Gain ${["solid", "taunt"]} when normal summoned, or gain
      ${["solid", "3 shield"]} when special summoned.
    `
        },
        skins: []
    }, {
        id: CardId.PACT,
        name: "Pact",
        lore: `
    Your rage and courage are like music which further strengthen spirits of
    earth in me.
  `,
        effect: {
            name: "Valor",
            description: colorTooltip `
      Remove ${["solid", "shield"]} from all your minions and deal equal
      ${["damage", "damage"]} to the enemy hero.
    `
        },
        skins: []
    }, {
        id: CardId.ANVIL,
        name: "Anvil",
        lore: `
    The best offense is in even greater defense!
  `,
        effect: {
            name: "Shell",
            description: colorTooltip `
      All your minions gain ${["solid", "1 shield"]}.
    `
        },
        skins: []
    }, {
        id: CardId.QUICK_SAND,
        name: "Quicksand",
        lore: `
    Come to me, face your death with dignity.
  `,
        effect: {
            name: "Fortitude",
            description: colorTooltip `
      Deal ${["damage", "1 damage"]} to your minion, and grant it
      ${["solid", "taunt"]} if it survives.
    `
        },
        skins: []
    }, {
        id: CardId.WORMHOLE,
        name: "Wormhole",
        lore: `
    In the midst of real battle nobody knows who strikes whom.
  `,
        effect: {
            name: "Ricochet",
            description: colorTooltip `
      Redirect the next incoming attack to a random enemy minion.
    `
        },
        skins: []
    }, {
        id: CardId.CAGE,
        name: "Cage",
        lore: `
    Wounds only make one stronger and more eager to live.
  `,
        effect: {
            name: "Last Stand",
            description: colorTooltip `
      When your minion would die after combat, set it to
      ${["health", "1 health"]} and give it ${["solid", "taunt"]}.
    `
        },
        skins: []
    }, {
        id: CardId.FURY,
        name: "Fury",
        lore: `
    Their hard strikes and vigour are no match to our superior formation.
  `,
        effect: {
            name: "Heart of Steel",
            description: colorTooltip `
      When an enemy destroys an ally's ${["solid", "shield"]}, that minion
      gains ${["damage", "3 damage"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_HERO,
        name: "Liquid Hero",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Life Aura",
            description: colorTooltip `
      Liquid minions can be ${["liquid", "healed"]} over the
      ${["health", "max health"]} cap.
    `
        },
        skins: [],
        ability: {
            name: "Heal",
            description: colorTooltip `
      Target minion is ${["liquid", "healed"]} for ${["health", "1 health"]}.
    `
        }
    }, {
        id: CardId.LIQUID_1,
        name: "Liquid 1",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Rising Fury",
            description: colorTooltip `
      When one of your minions is sent to the graveyard, Liquid 1 gains
      ${["damage", "1 damage"]} and is ${["liquid", "healed"]} for
      ${["health", "1 health"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_2,
        name: "Liquid 2",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Regeneration",
            description: colorTooltip `
      At the end of your turn, one of your minions is ${["liquid", "healed"]}
      for ${["health", "2 health"]}, excluding this minion.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_3,
        name: "Liquid 3",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Sacrifice",
            description: colorTooltip `
      While this card is on the field, when a liquid minion is sent to the
      graveyard, your hero gains ${["health", "3 health"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_4,
        name: "Liquid 4",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Shadowstrike",
            description: colorTooltip `
      Liquid 4 can attack enemy minions with ${["health", "stealth"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_5,
        name: "Liquid 5",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Leech",
            description: colorTooltip `
      When Liquid 5 deals ${["damage", "damage"]}, your hero gains
      ${["health", "health"]} equal to the ${["damage", "damage"]} dealt.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_6,
        name: "Liquid 6",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Resilient",
            description: colorTooltip `
      This card always takes ${["damage", "1 damage"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_7,
        name: "Liquid 7",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Electro Shock",
            description: colorTooltip `
      ${["liquid", "Cleanse"]} all buffs and debuffs from both enemy and ally
      fields.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_8,
        name: "Liquid 8",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Purify",
            description: colorTooltip `
      ${["liquid", "Cleanse"]} all debuffs from your minion.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_9,
        name: "Liquid 9",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Tidal Wave",
            description: colorTooltip `
      All your minions gain ${["health", "3 health"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_10,
        name: "Liquid 10",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Retribution",
            description: colorTooltip `
      Whenever an enemy minion attacks your hero, it and it's adjacent minions
      lose ${["damage", "2 damage"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_11,
        name: "Liquid 11",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Frostbite",
            description: colorTooltip `
      When an enemy minion attacks, reduce its ${["damage", "damage"]} to
      ${["damage", "1"]}.
    `
        },
        skins: []
    }, {
        id: CardId.LIQUID_12,
        name: "Liquid 12",
        lore: `
    Coming soon.
  `,
        effect: {
            name: "Banish",
            description: colorTooltip `
      When an enemy minion is summoned, it is returned to opponents hand.
    `
        },
        skins: []
    },
    { id: CardId.GAS_HERO,
        name: "Gas Hero",
        lore: `Coming soon.`,
        effect: {
            name: "Toxic Aura",
            description: "Minions infected with neurotoxin take 1 additional damage from gas minions."
        },
        skins: [],
        ability: {
            name: "Neurotoxin",
            description: `
      Enemy minion or hero takes 1 damage each turn.
    `
        }
    }, {
        id: CardId.GAS_1,
        name: "Gas Minion 1",
        lore: `Coming soon.`,
        effect: {
            name: "Acidic Death",
            description: "Deals 1 damage to all Minions on the board when this card dies."
        },
        skins: []
    }, {
        id: CardId.GAS_2,
        name: "Gas 2",
        lore: `Coming soon.`,
        effect: {
            name: "Vanish",
            description: colorTooltip `Gas 2 gains ${["gas", "Stealth"]} when normal summoned.`
        },
        skins: []
    }, {
        id: CardId.GAS_3,
        name: "Gas Minion 3",
        lore: `Coming soon.`,
        effect: {
            name: "Poisonous Touch",
            description: "Attacks infect their target with Neurotoxin."
        },
        skins: []
    }, {
        id: CardId.GAS_4,
        name: "Gas Minion 4",
        lore: `Coming soon.`,
        effect: {
            name: "Toxic Spray",
            description: "On Normal Summon, this Minion deals 1 damage to a random enemy minion and infects it with Neurotoxin."
        },
        skins: []
    }, {
        id: CardId.GAS_5,
        name: "Gas Minion 5",
        lore: `Coming soon.`,
        effect: {
            name: "Corrosive Touch",
            description: "Whenever this Minion attacks, it deals 1 extra damage to the enemy Hero."
        },
        skins: []
    }, {
        id: CardId.GAS_6,
        name: "Gas Minion 6",
        lore: `Coming soon.`,
        effect: {
            name: "Toxic Gas",
            description: "On Normal Summon, all enemy Minions are infected with Neurotoxin."
        },
        skins: []
    }, {
        id: CardId.GAS_7,
        name: "Gas Magic 1",
        lore: `Coming soon.`,
        effect: {
            name: "Acid Rain",
            description: "Deals 1 Damage to all enemy minions."
        },
        skins: []
    }, {
        id: CardId.GAS_8,
        name: "Gas Magic 2",
        lore: `Coming soon.`,
        effect: {
            name: "Smoke Bomb",
            description: "All your minions gain stealth."
        },
        skins: []
    }, {
        id: CardId.GAS_9,
        name: "Gas Magic 3",
        lore: `Coming soon.`,
        effect: {
            name: "Contaminated Air",
            description: "All minions on the board have -1 Attack."
        },
        skins: []
    }, {
        id: CardId.GAS_10,
        name: "Gas Trap 1",
        lore: `Coming soon.`,
        effect: {
            name: "Rusty Needle",
            description: "When an enemy Minion attacks, infect it with Neurotoxin."
        },
        skins: []
    }, {
        id: CardId.GAS_11,
        name: "Gas Trap 2",
        lore: `Coming soon.`,
        effect: {
            name: "Noxious Fumes",
            description: "When an enemy Minion attacks, deal 1 damage to it and it's adjacent Minions."
        },
        skins: []
    }, {
        id: CardId.GAS_12,
        name: "Gas Trap 3",
        lore: `Coming soon.`,
        effect: {
            name: "Poisoned Ground",
            description: "When an enemy Minion is summoned, it becomes infected with Neurotoxin."
        },
        skins: []
    }, {
        id: CardId.PLASMA_HERO,
        name: "Plasma Hero",
        lore: `Coming soon.`,
        effect: {
            name: "Burning Aura",
            description: "Plasma minions affected by corruption have -1 health and +2 damage."
        },
        skins: [],
        ability: {
            name: "Corruption",
            description: "Target minion gains +1 damage."
        }
    }, {
        id: CardId.PLASMA_1,
        name: "Plasma Minion 1",
        lore: `Coming soon.`,
        effect: {
            name: "Self-Destruct",
            description: "When card dies, deal 3 damage to the enemy hero."
        },
        skins: []
    }, {
        id: CardId.PLASMA_2,
        name: "Plasma Minion 2",
        lore: `Coming soon.`,
        effect: {
            name: "Rampage",
            description: "Whenever attacks and survives, gain +1 damage."
        },
        skins: []
    }, {
        id: CardId.PLASMA_3,
        name: "Plasma Minion 3",
        lore: `Coming soon.`,
        effect: {
            name: "Backstab",
            description: "When attacking a hero, deal 1 additional damage and leech 1 Mana."
        },
        skins: []
    }, {
        id: CardId.PLASMA_4,
        name: "Centaur Archer",
        lore: `Coming soon.`,
        effect: {
            name: "Marksmanship",
            description: "Centaur Archer's attacks ignore Taunt."
        },
        skins: []
    }, {
        id: CardId.PLASMA_5,
        name: "Plasma Minion 5",
        lore: `Coming soon.`,
        effect: {
            name: "Overpower",
            description: "When attacking a minion, deal excess damage to the enemy hero."
        },
        skins: []
    }, {
        id: CardId.PLASMA_6,
        name: "Plasma Minion 6",
        lore: `Coming soon.`,
        effect: {
            name: "Execute",
            description: "Executes minions below 1 health after combat."
        },
        skins: []
    }, {
        id: CardId.PLASMA_7,
        name: "Plasma Magic 1",
        lore: `Coming soon.`,
        effect: {
            name: "Ignite",
            description: "Deal 3 damage to a target."
        },
        skins: []
    }, {
        id: CardId.PLASMA_8,
        name: "Plasma Magic 2",
        lore: `Coming soon.`,
        effect: {
            name: "Sacrifice",
            description: "Deal 2 damage to your minion and give it Corruption."
        },
        skins: []
    }, {
        id: CardId.PLASMA_9,
        name: "Plasma Magic 3",
        lore: `Coming soon.`,
        effect: {
            name: "Hysteria",
            description: "Double your cards damage, but reduce it's health to 1, and destroy it when the turn is over."
        },
        skins: []
    }, {
        id: CardId.PLASMA_10,
        name: "Plasma Trap 1",
        lore: `Coming soon.`,
        effect: {
            name: "Explosive",
            description: "When an enemy minion attacks, deal 3 damage to it."
        },
        skins: []
    }, {
        id: CardId.PLASMA_11,
        name: "Plasma Trap 2",
        lore: `Coming soon.`,
        effect: {
            name: "Reflection",
            description: "When an enemy kills your minion with Corruption, all other minions on your field gain corruption."
        },
        skins: []
    }, {
        id: CardId.PLASMA_12,
        name: "Plasma Trap 3",
        lore: `Coming soon.`,
        effect: {
            name: "Constriction",
            description: "Reduce attacking Minions damage to 1."
        },
        skins: []
    }];
export { cardsView };
