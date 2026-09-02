const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const ITEMS = {
  rustDagger:    { id: 'rustDagger',    name: 'Rusty Dagger',    type: 'weapon', damage: [2, 5],  skillType: 'shortBlades', bonus: 0 },
  shortSword:    { id: 'shortSword',    name: 'Short Sword',     type: 'weapon', damage: [3, 7],  skillType: 'shortBlades', bonus: 0 },
  longSword:     { id: 'longSword',     name: 'Long Sword',      type: 'weapon', damage: [4, 9],  skillType: 'longBlades',  bonus: 0 },
  handAxe:       { id: 'handAxe',       name: 'Hand Axe',        type: 'weapon', damage: [4, 8],  skillType: 'axes',        bonus: 0 },
  woodenClub:    { id: 'woodenClub',    name: 'Wooden Club',     type: 'weapon', damage: [3, 6],  skillType: 'bluntWeapons', bonus: 0 },
  clubOfBashing: { id: 'clubOfBashing', name: 'Club of Bashing', type: 'weapon', damage: [5, 10], skillType: 'bluntWeapons', bonus: 1 },
  healingPotion: { id: 'healingPotion', name: 'Healing Potion',  type: 'potion', effect: 'heal',  magnitude: 20, identified: true },
  leatherArmor:  { id: 'leatherArmor',  name: 'Leather Armor',   type: 'armor',  defense: 2 },
};

export const getItem = (id) => ITEMS[id] ? { ...ITEMS[id] } : null;

const LOOT_TABLES = {
  1: [
    { type: 'gold',   amount: [5, 20],  weight: 40 },
    { type: 'item',   id: 'rustDagger',    weight: 15 },
    { type: 'item',   id: 'shortSword',    weight: 12 },
    { type: 'item',   id: 'healingPotion', weight: 25 },
    { type: 'item',   id: 'woodenClub',    weight:  8 },
  ],
  2: [
    { type: 'gold',   amount: [10, 40], weight: 35 },
    { type: 'item',   id: 'shortSword',    weight: 18 },
    { type: 'item',   id: 'longSword',     weight: 12 },
    { type: 'item',   id: 'handAxe',       weight: 10 },
    { type: 'item',   id: 'healingPotion', weight: 15 },
    { type: 'item',   id: 'leatherArmor',  weight:  5 },
    { type: 'scroll', spell: 'magicMissile', weight: 5 },
  ],
};

export const generateLoot = (floorNum) => {
  const table = LOOT_TABLES[Math.min(floorNum, 2)];
  const total = table.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) {
      if (entry.type === 'gold')   return { id: 'gold', name: 'Gold', type: 'gold', amount: ri(...entry.amount) };
      if (entry.type === 'item')   return getItem(entry.id);
      if (entry.type === 'scroll') return { id: `scroll_${entry.spell}`, name: `Scroll of ${entry.spell}`, type: 'scroll', spell: entry.spell };
    }
  }
  /* v8 ignore next */
  return { id: 'gold', name: 'Gold', type: 'gold', amount: ri(1, 5) };
};

export const generateChest = (floorNum) => ({
  locked: false,
  lockDifficulty: 0,
  trapped: false,
  trapType: null,
  trapDifficulty: 0,
  loot: [
    generateLoot(floorNum),
    ...(Math.random() < 0.4 ? [generateLoot(floorNum)] : []),
  ],
  opened: false,
});

export const openChest = (chest) => {
  if (chest.opened) return { result: 'already_opened', loot: [], messages: ['The chest is empty.'], skillXpGained: {} };
  chest.opened = true;
  return { result: 'opened', loot: chest.loot, messages: ['You open the chest.'], skillXpGained: {} };
};

export const pickLock = (chest, character) => {
  const chance = 30 + (character.skills.lockpicking?.level ?? 0) * 7;
  if (Math.random() * 100 < chance) {
    return { success: true, messages: ['The lock clicks open.'], skillXpGained: { lockpicking: 5 } };
  }
  return { success: false, messages: ['You fail to pick the lock. You waste time trying.'], skillXpGained: { lockpicking: 1 } };
};

export const smashChest = (chest, character) => {
  const w = character.equipment.weapon;
  if (!w || !['axes', 'bluntWeapons'].includes(w.skillType)) {
    return { success: false, loot: [], messages: ["You can't smash it with that weapon."], skillXpGained: {}, attractsMonster: false };
  }
  chest.opened = true;
  let loot = [...chest.loot];
  const messages = ['You smash the chest open. The crash echoes through the dungeon!'];

  if (w.skillType === 'bluntWeapons') {
    loot = loot.filter(item => {
      if (item.type === 'potion' && Math.random() < 0.3) {
        messages.push('A potion shatters!');
        return false;
      }
      return true;
    });
  }

  return { success: true, loot, messages, skillXpGained: { [w.skillType]: 2 }, attractsMonster: true };
};

export const disarmTrap = (chest, character) => {
  const chance = 20 + (character.skills.trapSense?.level ?? 0) * 8;
  if (Math.random() * 100 < chance) {
    chest.trapped = false;
    return { success: true, messages: ['You carefully disarm the trap.'], skillXpGained: { trapSense: 5 } };
  }
  return { success: false, messages: ['Your disarm attempt fails. Be careful!'], skillXpGained: { trapSense: 1 } };
};

export const applyLootToCharacter = (loot, character) => {
  const messages = [];
  for (const item of loot) {
    if (!item) continue;
    if (item.type === 'gold') {
      character.gold += item.amount;
      messages.push(`You find ${item.amount} gold.`);
    } else if (item.type === 'weapon' || item.type === 'armor') {
      character.inventory.push(item);
      messages.push(`You find: ${item.name}.`);
    } else if (item.type === 'potion' || item.type === 'scroll') {
      character.inventory.push(item);
      messages.push(`You find: ${item.name}.`);
    }
  }
  return messages;
};
