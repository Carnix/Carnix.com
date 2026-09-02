const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const SPELLS = {
  magicMissile: {
    id: 'magicMissile', name: 'Magic Missile', manaCost: 1, arcanaReq: 0,
    description: 'A bolt of arcane energy. Always hits.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(6, 10) + Math.floor(lvl / 4), effects: [], dmgType: 'arcane' }),
  },
  detectMagic: {
    id: 'detectMagic', name: 'Detect Magic', manaCost: 1, arcanaReq: 0,
    description: 'Reveals magical traps and chests on this floor.',
    targetsSelf: true,
    apply: () => ({ damage: 0, effects: ['detectMagic'], dmgType: null }),
  },
  acidSplash: {
    id: 'acidSplash', name: 'Acid Splash', manaCost: 2, arcanaReq: 2,
    description: 'A spray of acid. Reduces monster defense.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(10, 14) + Math.floor(lvl / 4), effects: ['reduceDefense'], dmgType: 'acid' }),
  },
  shield: {
    id: 'shield', name: 'Shield', manaCost: 2, arcanaReq: 2,
    description: 'A magical barrier. Reduces incoming damage for 3 turns.',
    targetsSelf: true,
    apply: () => ({ damage: 0, effects: ['shield'], dmgType: null }),
  },
  cureWounds: {
    id: 'cureWounds', name: 'Cure Wounds', manaCost: 2, arcanaReq: 2,
    description: 'Closes wounds. Restores ~15 HP.',
    targetsSelf: true,
    apply: (lvl) => ({ damage: 0, effects: ['heal'], healAmount: ri(12, 18) + Math.floor(lvl / 3), dmgType: null }),
  },
  mistyStep: {
    id: 'mistyStep', name: 'Misty Step', manaCost: 2, arcanaReq: 3,
    description: 'Teleport to safety. Instant combat escape.',
    targetsSelf: true,
    apply: () => ({ damage: 0, effects: ['flee'], dmgType: null }),
  },
  poisonSpray: {
    id: 'poisonSpray', name: 'Poison Spray', manaCost: 2, arcanaReq: 3,
    description: 'A noxious cloud. Poisons the target.',
    targetsSelf: false,
    apply: () => ({ damage: ri(4, 8), effects: ['poison'], dmgType: 'poison' }),
  },
  lightningBolt: {
    id: 'lightningBolt', name: 'Lightning Bolt', manaCost: 3, arcanaReq: 4,
    description: 'A bolt of lightning.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(16, 24) + Math.floor(lvl / 4), effects: [], dmgType: 'lightning' }),
  },
  sleep: {
    id: 'sleep', name: 'Sleep', manaCost: 3, arcanaReq: 5,
    description: 'Renders target unconscious. No effect on undead.',
    targetsSelf: false,
    apply: () => ({ damage: 0, effects: ['sleep'], dmgType: null }),
  },
  holdMonster: {
    id: 'holdMonster', name: 'Hold Monster', manaCost: 3, arcanaReq: 5,
    description: 'Paralyzes a monster for 2 turns.',
    targetsSelf: false,
    apply: () => ({ damage: 0, effects: ['paralyze'], dmgType: null }),
  },
  mageArmor: {
    id: 'mageArmor', name: 'Mage Armor', manaCost: 3, arcanaReq: 6,
    description: '+4 defense for the entire floor.',
    targetsSelf: true,
    apply: () => ({ damage: 0, effects: ['mageArmor'], dmgType: null }),
  },
  fireball: {
    id: 'fireball', name: 'Fireball', manaCost: 4, arcanaReq: 7,
    description: 'An explosion of fire.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(28, 42) + Math.floor(lvl / 3), effects: [], dmgType: 'fire' }),
  },
  iceStorm: {
    id: 'iceStorm', name: 'Ice Storm', manaCost: 4, arcanaReq: 7,
    description: 'A blizzard of ice. Freezes on contact.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(24, 36) + Math.floor(lvl / 3), effects: ['freeze'], dmgType: 'cold' }),
  },
  disintegrate: {
    id: 'disintegrate', name: 'Disintegrate', manaCost: 5, arcanaReq: 9,
    description: 'Unmakes matter. Massive single-target damage.',
    targetsSelf: false,
    apply: (lvl) => ({ damage: ri(50, 70) + lvl, effects: [], dmgType: 'arcane' }),
  },
  fingerOfDeath: {
    id: 'fingerOfDeath', name: 'Finger of Death', manaCost: 6, arcanaReq: 11,
    description: 'Instant death attempt. Massive damage if resisted.',
    targetsSelf: false,
    apply: () => ({ damage: ri(60, 90), effects: ['instakill'], dmgType: 'necrotic' }),
  },
};

export const canCast = (character, spellId) => {
  const spell = SPELLS[spellId];
  if (!spell) return false;
  if (!character.knownSpells.includes(spellId)) return false;
  if (character.mana < spell.manaCost) return false;
  if (character.skills.arcana.level < spell.arcanaReq) return false;
  return true;
};

export const castSpell = (spellId, character, target) => {
  const spell = SPELLS[spellId];
  const result = spell.apply(character.skills.arcana.level);
  character.mana -= spell.manaCost;

  if (result.damage > 0 && target) {
    if (target.weaknesses?.includes(result.dmgType))  result.damage = Math.floor(result.damage * 1.5);
    if (target.resistances?.includes(result.dmgType)) result.damage = Math.floor(result.damage * 0.5);
    if (target.immunities?.includes(result.dmgType))  result.damage = 0;
  }

  return result;
};
