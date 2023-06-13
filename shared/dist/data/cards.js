import { Ability, CardId, CardKlass, CardType, EffectId } from "../enums/index.js";
const cards = [{
        id: CardId.BOEDICEA,
        klass: CardKlass.SOLID,
        effect: EffectId.ETERNAL_AURA,
        type: CardType.HERO,
        health: 20,
        mana: 10,
        ability: Ability.FORTIFY
    }, {
        id: CardId.LIQUID_HERO,
        klass: CardKlass.LIQUID,
        effect: EffectId.LIFE_AURA,
        type: CardType.HERO,
        health: 20,
        mana: 10,
        ability: Ability.HEAL
    }, {
        id: CardId.GAS_HERO,
        klass: CardKlass.GAS,
        effect: EffectId.TOXIC_AURA,
        type: CardType.HERO,
        health: 20,
        mana: 10,
        ability: Ability.NEUROTOXIN
    }, {
        id: CardId.PLASMA_HERO,
        klass: CardKlass.PLASMA,
        effect: EffectId.BURNING_AURA,
        type: CardType.HERO,
        health: 20,
        mana: 10,
        ability: Ability.OVERCHARGE
    }, {
        id: CardId.SEAFARER,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.SHADOW_SURGE,
        type: CardType.MINION,
        health: 2,
        damage: 1,
        manaCost: 3
    }, {
        id: CardId.AVET,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.QUICK_SHOT,
        type: CardType.MINION,
        health: 2,
        damage: 3,
        manaCost: 5
    }, {
        id: CardId.GUIDING_LIGHTS,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.BLAZE,
        type: CardType.MINION,
        health: 4,
        damage: 2,
        manaCost: 5
    }, {
        id: CardId.VESSELS,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.NECROMANCY,
        type: CardType.MINION,
        health: 3,
        damage: 3,
        manaCost: 4
    }, {
        id: CardId.SLEEPER,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.ELUSIVE,
        type: CardType.MINION,
        health: 4,
        damage: 1,
        manaCost: 8
    }, {
        id: CardId.PILGRIMS,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.REVENGE,
        type: CardType.MINION,
        health: 4,
        damage: 3,
        manaCost: 7
    }, {
        id: CardId.GRAVECALL,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.REBIRTH,
        type: CardType.MAGIC,
        manaCost: 8
    }, {
        id: CardId.CROSS,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.DIMINISH,
        type: CardType.MAGIC,
        manaCost: 4
    }, {
        id: CardId.GAMBIT,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.RELOAD,
        type: CardType.MAGIC,
        manaCost: 3
    }, {
        id: CardId.REFLECTION,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.MIRRORS_EDGE,
        type: CardType.TRAP,
        manaCost: 3
    }, {
        id: CardId.DISCUS,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.SMITE,
        type: CardType.TRAP,
        manaCost: 4
    }, {
        id: CardId.SPELLBANE,
        klass: CardKlass.NEUTRAL,
        effect: EffectId.SILENCE,
        type: CardType.TRAP,
        manaCost: 4
    }, {
        id: CardId.DENDRITES,
        klass: CardKlass.SOLID,
        effect: EffectId.GLORY,
        type: CardType.MINION,
        health: 3,
        damage: 2,
        manaCost: 3
    }, {
        id: CardId.GNOMES,
        klass: CardKlass.SOLID,
        effect: EffectId.UNITY,
        type: CardType.MINION,
        health: 3,
        damage: 1,
        manaCost: 2
    }, {
        id: CardId.MUD_SPIRIT,
        klass: CardKlass.SOLID,
        effect: EffectId.SPELLWEAVE,
        type: CardType.MINION,
        health: 2,
        damage: 3,
        manaCost: 4
    }, {
        id: CardId.PEACEMAKER,
        klass: CardKlass.SOLID,
        effect: EffectId.SHIELDWALL,
        type: CardType.MINION,
        health: 4,
        damage: 3,
        manaCost: 5
    }, {
        id: CardId.GOLEMICA,
        klass: CardKlass.SOLID,
        effect: EffectId.UNBREAKABLE,
        type: CardType.MINION,
        health: 5,
        damage: 1,
        manaCost: 6
    }, {
        id: CardId.CAVE_LION,
        klass: CardKlass.SOLID,
        effect: EffectId.PROTECTOR,
        type: CardType.MINION,
        health: 7,
        damage: 2,
        manaCost: 7
    }, {
        id: CardId.PACT,
        klass: CardKlass.SOLID,
        effect: EffectId.VALOR,
        type: CardType.MAGIC,
        manaCost: 3
    }, {
        id: CardId.ANVIL,
        klass: CardKlass.SOLID,
        type: CardType.MAGIC,
        effect: EffectId.SHELL,
        manaCost: 5
    }, {
        id: CardId.QUICK_SAND,
        klass: CardKlass.SOLID,
        effect: EffectId.FORTITUDE,
        type: CardType.MAGIC,
        manaCost: 4
    }, {
        id: CardId.WORMHOLE,
        klass: CardKlass.SOLID,
        effect: EffectId.RICOCHET,
        type: CardType.TRAP,
        manaCost: 3
    }, {
        id: CardId.CAGE,
        klass: CardKlass.SOLID,
        effect: EffectId.LAST_STAND,
        type: CardType.TRAP,
        manaCost: 4
    }, {
        id: CardId.FURY,
        klass: CardKlass.SOLID,
        effect: EffectId.HEART_OF_STEEL,
        type: CardType.TRAP,
        manaCost: 5
    }, {
        id: CardId.LIQUID_1,
        klass: CardKlass.LIQUID,
        effect: EffectId.RISING_FURY,
        type: CardType.MINION,
        health: 3,
        damage: 3,
        manaCost: 5
    }, {
        id: CardId.LIQUID_2,
        klass: CardKlass.LIQUID,
        effect: EffectId.REGENERATION,
        type: CardType.MINION,
        health: 4,
        damage: 2,
        manaCost: 4
    }, {
        id: CardId.LIQUID_3,
        klass: CardKlass.LIQUID,
        effect: EffectId.SACRIFICE,
        type: CardType.MINION,
        health: 2,
        damage: 4,
        manaCost: 2
    }, {
        id: CardId.LIQUID_4,
        klass: CardKlass.LIQUID,
        effect: EffectId.SHADOWSTRIKE,
        type: CardType.MINION,
        health: 3,
        damage: 2,
        manaCost: 5
    }, {
        id: CardId.LIQUID_5,
        klass: CardKlass.LIQUID,
        effect: EffectId.LEECH,
        type: CardType.MINION,
        health: 3,
        damage: 6,
        manaCost: 5
    }, {
        id: CardId.LIQUID_6,
        klass: CardKlass.LIQUID,
        effect: EffectId.RESILIENT,
        type: CardType.MINION,
        health: 2,
        damage: 3,
        manaCost: 5
    }, {
        id: CardId.LIQUID_7,
        klass: CardKlass.LIQUID,
        effect: EffectId.ELECTRO_SHOCK,
        type: CardType.MAGIC,
        manaCost: 4
    }, {
        id: CardId.LIQUID_8,
        klass: CardKlass.LIQUID,
        effect: EffectId.CLEANSE,
        type: CardType.MAGIC,
        manaCost: 4
    }, {
        id: CardId.LIQUID_9,
        klass: CardKlass.LIQUID,
        effect: EffectId.TIDAL_WAVE,
        type: CardType.MAGIC,
        manaCost: 6
    }, {
        id: CardId.LIQUID_10,
        klass: CardKlass.LIQUID,
        effect: EffectId.RETRIBUTION,
        type: CardType.TRAP,
        manaCost: 3
    }, {
        id: CardId.LIQUID_11,
        klass: CardKlass.LIQUID,
        effect: EffectId.FROSTBITE,
        type: CardType.TRAP,
        manaCost: 4
    }, {
        id: CardId.LIQUID_12,
        klass: CardKlass.LIQUID,
        effect: EffectId.BANISH,
        type: CardType.TRAP,
        manaCost: 5
    }, {
        id: CardId.GAS_1,
        klass: CardKlass.GAS,
        effect: EffectId.ACIDIC_DEATH,
        type: CardType.MINION,
        health: 1,
        damage: 1,
        manaCost: 1
    }, {
        id: CardId.GAS_2,
        klass: CardKlass.GAS,
        effect: EffectId.STEALTH,
        type: CardType.MINION,
        health: 2,
        damage: 2,
        manaCost: 2
    }, {
        id: CardId.GAS_3,
        klass: CardKlass.GAS,
        effect: EffectId.POISONOUS_TOUCH,
        type: CardType.MINION,
        health: 3,
        damage: 3,
        manaCost: 3
    }, {
        id: CardId.GAS_4,
        klass: CardKlass.GAS,
        effect: EffectId.TOXIC_SPRAY,
        type: CardType.MINION,
        health: 4,
        damage: 4,
        manaCost: 4
    }, {
        id: CardId.GAS_5,
        klass: CardKlass.GAS,
        effect: EffectId.CORROSIVE_TOUCH,
        type: CardType.MINION,
        health: 5,
        damage: 5,
        manaCost: 5
    }, {
        id: CardId.GAS_6,
        klass: CardKlass.GAS,
        effect: EffectId.TOXIC_GAS,
        type: CardType.MINION,
        health: 6,
        damage: 6,
        manaCost: 6
    }, {
        id: CardId.GAS_7,
        klass: CardKlass.GAS,
        effect: EffectId.ACID_RAIN,
        type: CardType.MAGIC,
        manaCost: 7
    }, {
        id: CardId.GAS_8,
        klass: CardKlass.GAS,
        effect: EffectId.SMOKE_BOMB,
        type: CardType.MAGIC,
        manaCost: 8
    }, {
        id: CardId.GAS_9,
        klass: CardKlass.GAS,
        effect: EffectId.CONTAMINATED_AIR,
        type: CardType.MAGIC,
        manaCost: 9
    }, {
        id: CardId.GAS_10,
        klass: CardKlass.GAS,
        effect: EffectId.RUSTY_NEEDLE,
        type: CardType.TRAP,
        manaCost: 10
    }, {
        id: CardId.GAS_11,
        klass: CardKlass.GAS,
        effect: EffectId.NOXIOUS_FUMES,
        type: CardType.TRAP,
        manaCost: 11
    }, {
        id: CardId.GAS_12,
        klass: CardKlass.GAS,
        effect: EffectId.POISONED_GROUND,
        type: CardType.TRAP,
        manaCost: 12
    }, {
        id: CardId.PLASMA_1,
        klass: CardKlass.PLASMA,
        effect: EffectId.SELF_DESTRUCT,
        type: CardType.MINION,
        health: 1,
        damage: 1,
        manaCost: 1,
    }, {
        id: CardId.PLASMA_2,
        klass: CardKlass.PLASMA,
        effect: EffectId.RAMPAGE,
        type: CardType.MINION,
        health: 2,
        damage: 2,
        manaCost: 2,
    }, {
        id: CardId.PLASMA_3,
        klass: CardKlass.PLASMA,
        effect: EffectId.BACKSTAB,
        type: CardType.MINION,
        health: 3,
        damage: 3,
        manaCost: 3,
    }, {
        id: CardId.PLASMA_4,
        klass: CardKlass.PLASMA,
        effect: EffectId.MARKSMANSHIP,
        type: CardType.MINION,
        health: 4,
        damage: 4,
        manaCost: 4,
    }, {
        id: CardId.PLASMA_5,
        klass: CardKlass.PLASMA,
        effect: EffectId.OVERPOWER,
        type: CardType.MINION,
        health: 5,
        damage: 5,
        manaCost: 5,
    }, {
        id: CardId.PLASMA_6,
        klass: CardKlass.PLASMA,
        effect: EffectId.EXECUTE,
        type: CardType.MINION,
        health: 6,
        damage: 6,
        manaCost: 6,
    }, {
        id: CardId.PLASMA_7,
        klass: CardKlass.PLASMA,
        effect: EffectId.IGNITE,
        type: CardType.MAGIC,
        manaCost: 7
    }, {
        id: CardId.PLASMA_8,
        klass: CardKlass.PLASMA,
        effect: EffectId.CORRUPTION,
        type: CardType.MAGIC,
        manaCost: 8
    }, {
        id: CardId.PLASMA_9,
        klass: CardKlass.PLASMA,
        effect: EffectId.HYSTERIA,
        type: CardType.MAGIC,
        manaCost: 9
    }, {
        id: CardId.PLASMA_10,
        klass: CardKlass.PLASMA,
        effect: EffectId.EXPLOSIVE,
        type: CardType.TRAP,
        manaCost: 10
    }, {
        id: CardId.PLASMA_11,
        klass: CardKlass.PLASMA,
        effect: EffectId.REFLECTION,
        type: CardType.TRAP,
        manaCost: 11
    }, {
        id: CardId.PLASMA_12,
        klass: CardKlass.PLASMA,
        effect: EffectId.CONSTRICTION,
        type: CardType.TRAP,
        manaCost: 12
    }];
export { cards };
