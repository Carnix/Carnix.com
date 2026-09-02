import { castSpell as _castSpell, canCast } from './spells.js';
import { tickStatuses } from './monsters.js';

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const weaponDmg = (character) => {
  const w = character.equipment.weapon;
  return w ? ri(...w.damage) : ri(1, 3);
};

const weaponSkillBonus = (character) => {
  const w = character.equipment.weapon;
  if (!w) return 0;
  return Math.floor((character.skills[w.skillType]?.level ?? 0) / 2);
};

export const initCombat = (monster) => ({
  monster,
  playerTurn: true,
  round: 1,
  result: null,
  shieldTurns: 0,
  log: [],
});

export const playerAttack = (combatState, character) => {
  const { monster } = combatState;
  const dmg = Math.max(1,
    weaponDmg(character) + weaponSkillBonus(character) - monster.defense + ri(0, 2)
  );

  monster.hp -= dmg;

  const skillId = character.equipment.weapon?.skillType ?? 'longBlades';
  const msg = `You attack for ${dmg} damage.`;
  combatState.log.push(msg);
  combatState.playerTurn = false;

  return { combatState, messages: [msg], skillXpGained: { [skillId]: 3 } };
};

export const playerCastSpell = (combatState, character, spellId) => {
  if (!canCast(character, spellId)) {
    return { combatState, messages: ["You can't cast that."], skillXpGained: {} };
  }

  const result = _castSpell(spellId, character, combatState.monster);
  const messages = [];

  if (result.damage > 0) {
    combatState.monster.hp -= result.damage;
    messages.push(`${spellId === 'magicMissile' ? 'Magic Missile' : spellId} strikes for ${result.damage}!`);
  }

  for (const effect of result.effects) {
    switch (effect) {
      case 'heal':
        character.hp = Math.min(character.maxHp, character.hp + result.healAmount);
        messages.push(`You heal ${result.healAmount} HP.`);
        break;
      case 'shield':
        combatState.shieldTurns = 3;
        messages.push('A magical barrier forms around you.');
        break;
      case 'freeze':
        combatState.monster.statuses.frozen = 2;
        messages.push(`${combatState.monster.name} is frozen solid!`);
        break;
      case 'sleep':
        if (!combatState.monster.immunities.includes('sleep')) {
          combatState.monster.statuses.asleep = 3;
          messages.push(`${combatState.monster.name} slumps asleep.`);
        } else {
          messages.push(`${combatState.monster.name} is unaffected.`);
        }
        break;
      case 'paralyze':
        combatState.monster.statuses.paralyzed = 2;
        messages.push(`${combatState.monster.name} is paralyzed!`);
        break;
      case 'poison':
        combatState.monster.statuses.poisoned = 3;
        messages.push(`${combatState.monster.name} is poisoned!`);
        break;
      case 'flee':
        combatState.result = 'fled';
        messages.push('You blink away through a rift. Gone.');
        break;
      case 'reduceDefense':
        combatState.monster.defense = Math.max(0, combatState.monster.defense - 1);
        messages.push(`${combatState.monster.name}'s defense is reduced.`);
        break;
      case 'mageArmor':
        character.mageArmorActive = true;
        messages.push('Arcane armor envelops you.');
        break;
      case 'detectMagic':
        messages.push('You sense the magical signatures on this floor.');
        break;
    }
  }

  combatState.log.push(...messages);
  combatState.playerTurn = false;

  return { combatState, messages, skillXpGained: { arcana: 5 } };
};

export const playerFlee = (combatState, character) => {
  const chance = 30 + (character.skills.stealth?.level ?? 0) * 7;
  if (Math.random() * 100 < chance) {
    combatState.result = 'fled';
    return { combatState, messages: ['You flee into the darkness!'], skillXpGained: { stealth: 3 }, success: true };
  }
  combatState.playerTurn = false;
  return { combatState, messages: ['You fail to escape!'], skillXpGained: {}, success: false };
};

export const playerHide = (combatState, character) => {
  if (combatState.monster.canFindHidden) {
    return { combatState, messages: [`${combatState.monster.name} can see right through your shadows.`], skillXpGained: {}, success: false };
  }
  const chance = 20 + (character.skills.stealth?.level ?? 0) * 7;
  if (Math.random() * 100 < chance) {
    combatState.result = 'fled';
    return { combatState, messages: ['You melt into the shadows. The monster loses track of you.'], skillXpGained: { stealth: 4 }, success: true };
  }
  combatState.playerTurn = false;
  return { combatState, messages: ["You can't find enough shadow to hide in."], skillXpGained: {}, success: false };
};

export const monsterTurn = (combatState, character) => {
  const { monster } = combatState;
  const statusMsgs = tickStatuses(monster);
  const messages = [...statusMsgs];

  // Monster might already be dead from poison tick
  if (monster.hp <= 0) {
    combatState.playerTurn = true;
    combatState.round++;
    return { combatState, messages, damage: 0 };
  }

  if (monster.statuses.asleep > 0 || monster.statuses.paralyzed > 0 || monster.statuses.frozen > 0) {
    messages.push(`${monster.name} cannot act.`);
    combatState.playerTurn = true;
    combatState.round++;
    return { combatState, messages, damage: 0 };
  }

  const armorDef = character.equipment.armor?.defense ?? 0;
  const shieldDef = combatState.shieldTurns > 0 ? 3 : 0;
  const fortDef = Math.floor((character.skills.fortitude?.level ?? 0) / 3);
  const mageArmorDef = character.mageArmorActive ? 4 : 0;
  const totalDef = armorDef + shieldDef + fortDef + mageArmorDef;

  const dmg = Math.max(0, monster.attack + ri(-2, 2) - totalDef);
  character.hp -= dmg;
  if (combatState.shieldTurns > 0) combatState.shieldTurns--;

  messages.push(dmg > 0
    ? `${monster.name} attacks for ${dmg} damage!`
    : `${monster.name} attacks but can't get through your defenses.`
  );

  combatState.playerTurn = true;
  combatState.round++;
  return { combatState, messages, damage: dmg };
};

export const checkCombatEnd = (combatState, character) => {
  if (combatState.result) return combatState.result;
  if (combatState.monster.hp <= 0) { combatState.result = 'win'; return 'win'; }
  if (character.hp <= 0)           { combatState.result = 'lose'; return 'lose'; }
  return null;
};

export const collectMonsterLoot = (monster) => {
  const loot = [];
  const gold = Math.floor(Math.random() * (monster.gold[1] - monster.gold[0] + 1)) + monster.gold[0];
  if (gold > 0) loot.push({ id: 'gold', name: 'Gold', type: 'gold', amount: gold });
  for (const { itemId, chance } of monster.lootTable) {
    if (Math.random() * 100 < chance) loot.push({ id: itemId });
  }
  return loot;
};
