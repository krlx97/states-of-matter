import {CardId} from "@som/shared/enums";

const cardLores = new Map<number, string>([
  // ----- Neutral -----
  [CardId.SEAFARER, `
    The darkness that spread across the stone wall lured many men to their doom.
    All who returned lost their sanity. They walk aimlessly, saying words
    stripped of any meaning. Human soul which still suffers inside is now just
    a forgotten dream.
  `],
  [CardId.AVET, `
    Death emobdied in shadow moves slowly, yet corrupts anything it touchers.
    These spirits have no evil in themselves, yet rarely any human dares to even
    think of them. Having no other agenda but to survive, they lurk in the Ether
    to prolong their painful existence by any means.
  `],
  [CardId.GUIDING_LIGHTS, `
    During nights when the moon is still young and the stars are not visible,
    lone pilgrims see shining lights which guide their way. Dancing in patterns
    strange to comprehend, they have their own logic of existence, helping only
    those who are just and pure. They are aspects of the Light itself, connected
    to its ultimate intelligence.
  `],
  [CardId.VESSELS, `
    She knew she will die soon, yet having known her own fullness, she was no
    longer afraid of eternal silence that awaits. Born from the normal human and
    one with the power, she was given strong etheric body, becoming a vessel to
    serve. Sadness of death is nothing compared to the greater cause.
  `],
  [CardId.EARTHS_BELOVED, `
    He has slept too long and now Earth spat him out and suddenly he knows what
    to do. The body is frail, yet the spirit is solid and commands respect and
    fear. With his rusty sabre pointing to the sun, he still dreams while
    walking, thanking that great, black Mother for letting him taste the
    splendor of combat once again.
  `],
  [CardId.PILGRIMS, `
    Training for years in the monastery, he has set to fight and maybe die or
    come back victorious. Faster than a blue snake, stronger than a cave
    lioness, his body and mind are one with each other and the war itself. New
    warrior caste, stronger than the old, they are ready to use everything in
    their power to prove themselves in combat.
  `],
  [CardId.REBIRTH, "Rebirth lore coming soon."],
  [CardId.EXHAUST, "Exhaust lore coming soon."],
  [CardId.RELOAD, "Reload lore coming soon."],
  [CardId.MIRRORS_EDGE, "Mirrors Edge lore coming soon."],
  [CardId.SMITE, "Smite lore coming soon."],
  [CardId.ANTI_MAGE, "Anti-Mage lore coming soon."],
  // ----- Solid -----
  [CardId.SOLID_1, `
    Silence grew and silence won. It made the skin hard as an oak. Green dreams
    did not bring solace, yet the roots run and deep and every leaf was one with
    the body. Did you forget life before the forest? Did the war made you even
    more connected to your host?
  `],
  [CardId.SOLID_2, `
    Being one with the solid means that the soul will also be solid,
    well-versed in the ways of earth. Both humble and powerful, childlike and
    wise, gnomes are like humans who know nothing but earth in all of its forms,
    visible and invisible alike.
  `],
  [CardId.SOLID_3, `
    One with the Earth, yet conscious as a solitary being, mud spirits are
    frightening enemies and even more frightening allies. Even though loyal,
    their slow, hazy thoughts cannot be comprehended by any human.
  `],
  [CardId.SOLID_4, `
    Its reign starts now, when the battle is almost over. Come over here, you
    souls who are leaving these rotten flesh, die in me and rejoin again in
    Ether. I finish the war with silence that draws you towards death. Serenity
    takes place.
  `],
  [CardId.SOLID_5, `
    To have no soul of its own, but to be one with the Earth. To kill, yet to
    know no meaning of death. That is the life of golem, made in the times
    forgotten. One has to be fool to fight one of these.
  `],
  [CardId.SOLID_6, `
    During the day, these magnificient beasts dream of unkwown prey and eternal
    chase. During the night they explore the underground world, their only home.
    One can hunt down even what one can't see.
  `],
  [CardId.SOLID_7, "Solid card 7 lore coming soon."],
  [CardId.SOLID_8, "Solid card 8 lore coming soon."],
  [CardId.SOLID_9, "Solid card 9 lore coming soon."],
  [CardId.SOLID_10, "Solid card 10 lore coming soon."],
  [CardId.SOLID_11, "Solid card 11 lore coming soon."],
  [CardId.SOLID_12, "Solid card 12 lore coming soon."],
  // ----- Liquid -----
  [CardId.LIQUID_1, "Liquid card 1 lore coming soon."],
  [CardId.LIQUID_2, "Liquid card 2 lore coming soon."],
  [CardId.LIQUID_3, "Liquid card 3 lore coming soon."],
  [CardId.LIQUID_4, "Liquid card 4 lore coming soon."],
  [CardId.LIQUID_5, "Liquid card 5 lore coming soon."],
  [CardId.LIQUID_6, "Liquid card 6 lore coming soon."],
  [CardId.LIQUID_7, "Liquid card 7 lore coming soon."],
  [CardId.LIQUID_8, "Liquid card 8 lore coming soon."],
  [CardId.LIQUID_9, "Liquid card 9 lore coming soon."],
  [CardId.LIQUID_10, "Liquid card 10 lore coming soon."],
  [CardId.LIQUID_11, "Liquid card 11 lore coming soon."],
  [CardId.LIQUID_12, "Liquid card 12 lore coming soon."],
  // ----- Gas -----
  [CardId.GAS_1, "Gas card 1 lore coming soon."],
  [CardId.GAS_2, "Gas card 2 lore coming soon."],
  [CardId.GAS_3, "Gas card 3 lore coming soon."],
  [CardId.GAS_4, "Gas card 4 lore coming soon."],
  [CardId.GAS_5, "Gas card 5 lore coming soon."],
  [CardId.GAS_6, "Gas card 6 lore coming soon."],
  [CardId.GAS_7, "Gas card 7 lore coming soon."],
  [CardId.GAS_8, "Gas card 8 lore coming soon."],
  [CardId.GAS_9, "Gas card 9 lore coming soon."],
  [CardId.GAS_10, "Gas card 10 lore coming soon."],
  [CardId.GAS_11, "Gas card 11 lore coming soon."],
  [CardId.GAS_12, "Gas card 12 lore coming soon."],
  // ----- Plasma -----
  [CardId.PLASMA_1, "Plasma card 1 lore coming soon."],
  [CardId.PLASMA_2, "Plasma card 2 lore coming soon."],
  [CardId.PLASMA_3, "Plasma card 3 lore coming soon."],
  [CardId.PLASMA_4, "Plasma card 4 lore coming soon."],
  [CardId.PLASMA_5, "Plasma card 5 lore coming soon."],
  [CardId.PLASMA_6, "Plasma card 6 lore coming soon."],
  [CardId.PLASMA_7, "Plasma card 7 lore coming soon."],
  [CardId.PLASMA_8, "Plasma card 8 lore coming soon."],
  [CardId.PLASMA_9, "Plasma card 9 lore coming soon."],
  [CardId.PLASMA_10, "Plasma card 10 lore coming soon."],
  [CardId.PLASMA_11, "Plasma card 11 lore coming soon."],
  [CardId.PLASMA_12, "Plasma card 12 lore coming soon."],
]);

export {cardLores};
