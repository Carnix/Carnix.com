import { gainXP as _gainXP, getSkillEffect } from './skills.js';
import { getItem } from './treasure.js';

const BASE_HP   = 20;
const BASE_MANA = 10;

const SKILL_KEYS = [
  'longBlades','shortBlades','axes','bluntWeapons',
  'arcana','stealth','lockpicking','trapSense',
  'fortitude','perception','alchemy','luck',
];

const top2 = (skills) =>
  Object.entries(skills)
    .map(([k, v]) => [k, v.level])
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([k]) => k);

export const getClassTitle = (character) => {
  const skills = character.skills;
  const totalLevels = Object.values(skills).reduce((s, v) => s + v.level, 0);
  if (totalLevels === 0) return 'Adventurer';

  const [s1, s2] = top2(skills);

  if (s1 === 'longBlades' && s2 === 'fortitude') return 'Knight';
  if (s1 === 'longBlades' && s2 === 'stealth')   return 'Duelist';
  if (s1 === 'longBlades')                        return 'Sellsword';
  if (s1 === 'shortBlades' && s2 === 'stealth')   return 'Cutthroat';
  if (s1 === 'shortBlades')                       return 'Bladedancer';
  if (s1 === 'axes' && s2 === 'fortitude')        return 'Berserker';
  if (s1 === 'axes')                              return 'Reaver';
  if (s1 === 'bluntWeapons' && s2 === 'arcana')   return 'Battle Mage';
  if (s1 === 'bluntWeapons')                      return 'Bruiser';
  if (s1 === 'arcana' && s2 === 'alchemy')        return 'Artificer';
  if (s1 === 'arcana' && s2 === 'stealth')        return 'Hexblade';
  if (s1 === 'arcana')                            return 'Arcanist';
  if (s1 === 'stealth' && s2 === 'lockpicking')   return 'Thief';
  if (s1 === 'stealth' && s2 === 'shortBlades')   return 'Shadow';
  if (s1 === 'stealth')                           return 'Ghost';
  if (s1 === 'fortitude')                         return 'Juggernaut';
  if (s1 === 'perception')                        return 'Scout';
  if (s1 === 'alchemy')                           return 'Alchemist';
  if (s1 === 'luck')                              return 'The Fool';
  return 'Adventurer';
};

export const computeStats = (character) => {
  let maxHp = BASE_HP;
  let maxMana = BASE_MANA;
  let damageBonus = 0;
  let encounterRate = 0.35;
  let damageReduction = 0;

  for (const [skillId, { level }] of Object.entries(character.skills)) {
    const fx = getSkillEffect(skillId, level);
    if (fx.maxHpBonus)              maxHp += fx.maxHpBonus;
    if (fx.maxManaBonus)            maxMana += fx.maxManaBonus;
    if (fx.damageBonus)             damageBonus += fx.damageBonus;
    if (fx.encounterRateMultiplier) encounterRate *= fx.encounterRateMultiplier;
    if (fx.damageReduction)         damageReduction += fx.damageReduction;
  }

  const armorDefense = character.equipment.armor?.defense ?? 0;
  const mageArmorBonus = character.mageArmorActive ? 4 : 0;

  return { maxHp, maxMana, damageBonus, armorDefense: armorDefense + mageArmorBonus, encounterRate, damageReduction };
};

export const createCharacter = (name) => ({
  name,
  hp: BASE_HP,
  maxHp: BASE_HP,
  mana: BASE_MANA,
  maxMana: BASE_MANA,
  gold: 0,
  skills: Object.fromEntries(SKILL_KEYS.map(k => [k, { level: 0, xp: 0 }])),
  knownSpells: ['magicMissile'],
  equipment: { weapon: getItem('rustDagger'), armor: null },
  inventory: [],
  classTitle: 'Adventurer',
  mageArmorActive: false,
  stats: { runsCompleted: 0, bestFloor: 0, totalKills: 0, totalGoldFound: 0 },
});

export const gainSkillXP = (character, skillId, amount) => {
  const levelsGained = _gainXP(character, skillId, amount);
  const prevTitle = character.classTitle;
  character.classTitle = getClassTitle(character);
  return { levelsGained, titleChanged: character.classTitle !== prevTitle };
};

export const resetForNewRun = (character) => {
  const stats = computeStats(character);
  character.hp = stats.maxHp;
  character.maxHp = stats.maxHp;
  character.mana = stats.maxMana;
  character.maxMana = stats.maxMana;
  character.mageArmorActive = false;
  character.stats.runsCompleted++;
};
