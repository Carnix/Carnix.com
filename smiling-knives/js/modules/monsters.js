const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const MONSTERS = {
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    hpRange: [6, 10],
    attack: 4,
    defense: 1,
    gold: [2, 8],
    xpValue: 5,
    lootTable: [{ itemId: 'rustDagger', chance: 20 }, { itemId: 'healingPotion', chance: 15 }],
    weaknesses: [],
    resistances: [],
    immunities: [],
    canFindHidden: false,
  },
  skeleton: {
    id: 'skeleton',
    name: 'Skeleton',
    hpRange: [10, 16],
    attack: 6,
    defense: 2,
    gold: [4, 12],
    xpValue: 10,
    lootTable: [{ itemId: 'shortSword', chance: 15 }],
    weaknesses: ['blunt'],
    resistances: ['poison'],
    immunities: ['sleep'],
    canFindHidden: false,
  },
  caveTroll: {
    id: 'caveTroll',
    name: 'Cave Troll',
    hpRange: [20, 30],
    attack: 9,
    defense: 4,
    gold: [10, 25],
    xpValue: 20,
    lootTable: [{ itemId: 'clubOfBashing', chance: 25 }],
    weaknesses: ['fire'],
    resistances: [],
    immunities: [],
    canFindHidden: false,
  },
  seeker: {
    id: 'seeker',
    name: 'The Seeker',
    hpRange: [15, 22],
    attack: 7,
    defense: 3,
    gold: [0, 0],
    xpValue: 0,
    lootTable: [],
    weaknesses: [],
    resistances: [],
    immunities: [],
    canFindHidden: true,
  },
  spider: {
    id: 'spider',
    name: 'Giant Spider',
    hpRange: [7, 13],
    attack: 5,
    defense: 1,
    gold: [1, 5],
    xpValue: 7,
    lootTable: [{ itemId: 'healingPotion', chance: 10 }],
    weaknesses: ['fire'],
    resistances: ['poison'],
    immunities: [],
    canFindHidden: false,
  },
  rous: {
    id: 'rous',
    name: 'R.O.U.S.',
    hpRange: [12, 18],
    attack: 6,
    defense: 1,
    gold: [0, 4],
    xpValue: 10,
    lootTable: [],
    weaknesses: [],
    resistances: [],
    immunities: [],
    canFindHidden: false,
  },
  giantMosquito: {
    id: 'giantMosquito',
    name: 'Giant Mosquito',
    hpRange: [6, 10],
    attack: 4,
    defense: 0,
    gold: [0, 2],
    xpValue: 6,
    lootTable: [],
    weaknesses: ['cold', 'fire'],
    resistances: [],
    immunities: [],
    canFindHidden: false,
  },
  hellhound: {
    id: 'hellhound',
    name: 'Hellhound',
    hpRange: [14, 20],
    attack: 8,
    defense: 2,
    gold: [5, 15],
    xpValue: 15,
    lootTable: [],
    weaknesses: ['cold'],
    resistances: ['fire'],
    immunities: [],
    canFindHidden: false,
  },
  orc: {
    id: 'orc',
    name: 'Orc',
    hpRange: [14, 22],
    attack: 7,
    defense: 3,
    gold: [6, 18],
    xpValue: 12,
    lootTable: [{ itemId: 'handAxe', chance: 15 }],
    weaknesses: [],
    resistances: [],
    immunities: [],
    canFindHidden: false,
  },
  ogre: {
    id: 'ogre',
    name: 'Ogre',
    hpRange: [26, 38],
    attack: 11,
    defense: 4,
    gold: [12, 30],
    xpValue: 25,
    lootTable: [{ itemId: 'woodenClub', chance: 30 }, { itemId: 'clubOfBashing', chance: 10 }],
    weaknesses: [],
    resistances: [],
    immunities: ['sleep'],
    canFindHidden: false,
  },
};

const ENCOUNTER_TABLES = {
  1: [
    { id: 'goblin',       weight: 40 },
    { id: 'spider',       weight: 30 },
    { id: 'giantMosquito',weight: 20 },
    { id: 'rous',         weight: 10 },
  ],
  2: [
    { id: 'goblin',   weight: 25 },
    { id: 'orc',      weight: 30 },
    { id: 'skeleton', weight: 25 },
    { id: 'hellhound',weight: 20 },
  ],
  3: [
    { id: 'orc',      weight: 25 },
    { id: 'ogre',     weight: 20 },
    { id: 'skeleton', weight: 20 },
    { id: 'hellhound',weight: 20 },
    { id: 'caveTroll',weight: 15 },
  ],
};

export const getEncounterTable = (floorNum) =>
  ENCOUNTER_TABLES[Math.min(floorNum, 3)];

export const spawnMonster = (id) => {
  const t = MONSTERS[id];
  const hp = randInt(...t.hpRange);
  return {
    ...t,
    hp,
    maxHp: hp,
    statuses: { frozen: 0, asleep: 0, paralyzed: 0, poisoned: 0 },
  };
};

export const pickWeightedMonster = (floorNum) => {
  const table = getEncounterTable(floorNum);
  const total = table.reduce((s, e) => s + e.weight, 0);
  let roll = Math.random() * total;
  for (const entry of table) {
    roll -= entry.weight;
    if (roll <= 0) return entry.id;
  }
  /* v8 ignore next */
  return table[0].id;
};

export const tickStatuses = (monster) => {
  const messages = [];
  if (monster.statuses.poisoned > 0) {
    monster.hp -= 3;
    monster.statuses.poisoned--;
    messages.push(`${monster.name} writhes from poison. (3 damage)`);
  }
  if (monster.statuses.frozen > 0) monster.statuses.frozen--;
  if (monster.statuses.asleep > 0) monster.statuses.asleep--;
  if (monster.statuses.paralyzed > 0) monster.statuses.paralyzed--;
  return messages;
};
