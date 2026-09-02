export const XP_PER_LEVEL = [0, 10, 25, 50, 90, 150, 240, 370, 550, 800, 1150];

export const SKILLS = {
  longBlades:   { name: 'Long Blades',   category: 'weapon' },
  shortBlades:  { name: 'Short Blades',  category: 'weapon' },
  axes:         { name: 'Axes',          category: 'weapon' },
  bluntWeapons: { name: 'Blunt Weapons', category: 'weapon' },
  arcana:       { name: 'Arcana',        category: 'magic' },
  stealth:      { name: 'Stealth',       category: 'rogue' },
  lockpicking:  { name: 'Lockpicking',   category: 'rogue' },
  trapSense:    { name: 'Trap Sense',    category: 'rogue' },
  fortitude:    { name: 'Fortitude',     category: 'warrior' },
  perception:   { name: 'Perception',    category: 'utility' },
  alchemy:      { name: 'Alchemy',       category: 'utility' },
  luck:         { name: 'Luck',          category: 'utility' },
};

export const gainXP = (character, skillId, amount) => {
  const skill = character.skills[skillId];
  if (!skill) return [];
  skill.xp += amount;
  const levelsGained = [];
  while (
    skill.level < XP_PER_LEVEL.length - 1 &&
    skill.xp >= XP_PER_LEVEL[skill.level + 1]
  ) {
    skill.level++;
    levelsGained.push(skill.level);
  }
  return levelsGained;
};

export const getSkillEffect = (skillId, level) => {
  switch (skillId) {
    case 'longBlades':
    case 'shortBlades':
    case 'axes':
    case 'bluntWeapons':
      return { damageBonus: Math.floor(level / 2) };
    case 'arcana':
      return { maxManaBonus: level, spellDmgBonus: Math.floor(level / 4) };
    case 'stealth':
      return {
        encounterRateMultiplier: Math.max(0.1, 1 - level * 0.05),
        fleeBonus: level * 7,
      };
    case 'lockpicking':
      return { lockSuccessChance: 30 + level * 7 };
    case 'trapSense':
      return { trapDetectChance: 20 + level * 8, canDisarm: level >= 5 };
    case 'fortitude':
      return { maxHpBonus: level * 2, damageReduction: Math.floor(level / 3) };
    case 'perception':
      return { mapRevealRadius: 1 + level, canSeeChestStatus: level >= 3 };
    case 'alchemy':
      return { canIdentifyPotions: level >= 1, canCraft: level >= 5 };
    case 'luck':
      return { luckBonus: level };
    default:
      return {};
  }
};
