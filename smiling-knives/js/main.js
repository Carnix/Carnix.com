import { saveCharacter, loadCharacter, saveRun, loadRun, clearRun } from './modules/storage.js';
import { createCharacter, gainSkillXP, computeStats, resetForNewRun } from './modules/character.js';
import { XP_PER_LEVEL, SKILLS } from './modules/skills.js';
import { generateFloor } from './modules/dungeon-gen.js';
import { tryMove, getRoomAt, cellAhead } from './modules/navigation.js';
import { spawnMonster, pickWeightedMonster } from './modules/monsters.js';
import { SPELLS, canCast, castSpell as castSpellFn } from './modules/spells.js';
import { initCombat, playerAttack, playerCastSpell, playerFlee, playerHide,
         monsterTurn, checkCombatEnd, collectMonsterLoot } from './modules/combat.js';
import { openChest, pickLock, smashChest, applyLootToCharacter, getItem } from './modules/treasure.js';
import { setContext, getLine } from './modules/narrator.js';
import { initUI, showNameEntry, hideNameEntry, renderViewport, renderStats,
         renderControls, renderCombatStats, hideCombatStats, pushLog, showNarrator,
         renderMinimap } from './modules/ui.js';
import { playHallwayAdvance, finishTransition, playCombatHit, playFloorTransition } from './modules/animation.js';

let character = null;
let run       = null;
let menuState = null;

const applyStats = () => {
  const s = computeStats(character);
  character.maxHp   = s.maxHp;
  character.maxMana = s.maxMana;
};

const floor = () => run?.floors?.[run.floor] ?? null;
const viewport   = () => document.getElementById('viewport');
const view       = () => {
  const f = floor();
  if (!f) return { room: null, fwdCell: null, facing: run?.facing ?? 'north' };
  return {
    room:    getRoomAt(f, run.position),
    fwdCell: cellAhead(f, run.position, run.facing),
    facing:  run.facing,
  };
};

const encounterRate = () => 18 * (1 - (character.skills.stealth?.level ?? 0) * 0.05);

const SKILL_LABELS = {
  longBlades: 'Long Blades', shortBlades: 'Short Blades', axes: 'Axes',
  bluntWeapons: 'Blunt Weapons', arcana: 'Arcana', stealth: 'Stealth',
  lockpicking: 'Lockpicking', trapSense: 'Trap Sense', fortitude: 'Fortitude',
  perception: 'Perception', alchemy: 'Alchemy', luck: 'Luck',
};
const skillLabel = (id) => SKILL_LABELS[id] ?? id;

const saveState = () => {
  saveCharacter(character);
  if (run) saveRun(run);
};

const applyXP = (skillId, amount) => {
  if (!amount || amount <= 0) return;
  const res = gainSkillXP(character, skillId, amount);
  if (res.levelsGained.length) {
    pushLog([`${skillLabel(skillId)} → level ${character.skills[skillId].level}!`]);
    showNarrator(getLine('skillUp'));
  }
  if (res.titleChanged) {
    setContext({ classTitle: character.classTitle });
    pushLog([`You are now: ${character.classTitle}`]);
    showNarrator(getLine('classChange'));
  }
};

const buildSpellMenu = () => {
  const inCombat = run.phase === 'combat';
  return (character.knownSpells ?? []).map(id => {
    const s = SPELLS[id];
    if (!s) return null;
    return {
      id,
      name:     s.name,
      manaCost: s.manaCost,
      action:   inCombat ? 'cast' : 'cast_ooc',
      enabled:  canCast(character, id) && (inCombat || s.targetsSelf === true),
    };
  }).filter(Boolean);
};

const buildItemMenu = () =>
  (character.inventory ?? []).reduce((acc, item, idx) => {
    const prefix = item.type === 'weapon' || item.type === 'armor' ? 'Equip' : 'Use';
    acc.push({ id: String(idx), name: `${prefix}: ${item.name ?? item.id}` });
    return acc;
  }, []);

const buildCharSheet = () => {
  const skills = Object.entries(character.skills).map(([id, { level, xp }]) => {
    const name = SKILLS[id]?.name ?? id;
    const xpForLevel  = XP_PER_LEVEL[level]     ?? 0;
    const xpForNext   = XP_PER_LEVEL[level + 1] ?? null;
    const xpInLevel   = xp - xpForLevel;
    const xpNeeded    = xpForNext != null ? xpForNext - xpForLevel : null;
    const pct         = xpNeeded ? Math.min(1, xpInLevel / xpNeeded) : 1;
    const filled      = Math.round(pct * 8);
    const bar         = '█'.repeat(filled) + '░'.repeat(8 - filled);
    return { name, level, bar, xpStr: xpNeeded != null ? `${xpInLevel}/${xpNeeded}` : 'MAX' };
  });
  return {
    name:   character.name,
    title:  character.classTitle,
    hp:     character.hp,  maxHp:  character.maxHp,
    mana:   character.mana, maxMana: character.maxMana,
    gold:   character.gold,
    weapon: character.equipment.weapon?.name ?? 'Unarmed',
    armor:  character.equipment.armor?.name  ?? 'None',
    floor:  run?.floor ?? 1,
    kills:  character.stats?.totalKills ?? 0,
    bestFloor: character.stats?.bestFloor ?? 0,
    skills,
  };
};

// ─── Render ───────────────────────────────────────────────────────────────────

const render = () => {
  const f = floor();
  renderViewport(view(), run.phase, character, run.combatState);
  renderStats(character, run);
  renderMinimap(f, run.position, run.facing);

  if (run.phase === 'combat' && run.combatState) {
    renderCombatStats(run.combatState.monster);
  } else {
    hideCombatStats();
  }

  if (menuState === 'spell_menu') {
    renderControls('spell_menu', buildSpellMenu(), character);
  } else if (menuState === 'item_menu') {
    renderControls('item_menu', buildItemMenu(), character);
  } else if (menuState === 'char_sheet') {
    renderControls('char_sheet', buildCharSheet(), character);
  } else if (run.phase === 'shop' && run.shopState) {
    renderControls('shop', run.shopState, character);
  } else if (run.phase === 'chest' && run.chestState) {
    renderControls('chest', run.chestState.chest, character);
  } else {
    renderControls(run.phase, null, character);
  }
};

const newRun = () => {
  resetForNewRun(character); // applies computeStats internally

  let f;
  try { f = generateFloor(1); }
  catch { f = generateFloor(1); }

  run = {
    floor:       1,
    position:    { ...f.entrance },
    facing:      'south',
    floors:      { 1: f },
    phase:       'exploring',
    combatState: null,
    chestState:  null,
    regenTick:   0,
  };

  character.stats = character.stats ?? {};
  character.stats.runsCompleted = (character.stats.runsCompleted ?? 0) + 1;

  setContext({ playerName: character.name, classTitle: character.classTitle, floorNum: 1 });
  showNarrator(getLine('greet'));
  pushLog([`Welcome to the dungeon, ${character.name}.`]);

  render();
  saveState();
};

// ─── Movement ────────────────────────────────────────────────────────────────

const doMove = async (dir) => {
  if (run.phase !== 'exploring') return;

  const f    = floor();
  const move = tryMove(f, run.position, run.facing, dir);
  run.facing = move.newFacing;

  if (!move.success) {
    render();
    return;
  }

  const vp = viewport();
  await playHallwayAdvance(vp);

  const prevRoomId = (() => {
    const c = f.grid[run.position.y]?.[run.position.x];
    return c?.roomId ?? null;
  })();

  run.position    = { ...move.newPos };
  const cell      = move.cell;
  const wasNew    = !cell.encountered;
  cell.encountered = true;
  const curRoomId = cell.roomId ?? null;
  const enteredRoom = curRoomId !== null && curRoomId !== prevRoomId;

  run.regenTick = (run.regenTick ?? 0) + 1;
  if (run.regenTick % 4 === 0 && character.hp < character.maxHp) {
    character.hp = Math.min(character.maxHp, character.hp + 1);
  }

  if (cell.content === 'exit') {
    await floorTransition();
    return;
  }

  if (enteredRoom) {
    const room = getRoomAt(f, run.position);
    if (room.type === 'monster' && !room.cleared) {
      await finishTransition(vp);
      startCombat(room.monsterTemplate);
      return;
    }
    if (room.type === 'treasure' && !room.chest?.opened) {
      run.phase      = 'chest';
      run.chestState = { room, chest: room.chest };
      await finishTransition(vp);
      render();
      saveState();
      return;
    }
    await finishTransition(vp);
    if (room.type === 'empty' || room.chest?.opened) showNarrator(getLine('emptyRoom'));
    render();
    saveState();
    return;
  }

  if (wasNew && curRoomId === null && cell.encounterSeed > 95) {
    await finishTransition(vp);
    run.phase     = 'shop';
    run.shopState = generateVendor(run.floor);
    render();
    saveState();
    return;
  }

  if (wasNew && curRoomId === null && cell.encounterSeed < encounterRate()) {
    const monsterId = pickWeightedMonster(run.floor);
    await finishTransition(vp);
    startCombat(monsterId);
    return;
  }

  await finishTransition(vp);
  render();
  saveState();
};

// ─── Combat ──────────────────────────────────────────────────────────────────

const startCombat = (monsterId) => {
  const monster    = spawnMonster(monsterId);
  run.phase        = 'combat';
  run.combatState  = initCombat(monster);
  pushLog([`A ${monster.name} appears!`]);
  render();
  saveState();
};

const resolveCombatEnd = async (result) => {
  const vp = viewport();
  if (result === 'win') {
    const monster = run.combatState.monster;
    const room    = getRoomAt(floor(), run.position);
    if (room) room.cleared = true;

    const rawLoot = collectMonsterLoot(monster);
    const loot    = rawLoot.map(i => i.type === 'gold' ? i : (getItem(i.id) ?? i));
    const msgs    = applyLootToCharacter(loot, character);
    pushLog(msgs);
    showNarrator(getLine('monsterKill'));
    applyXP('luck', 2);

    character.stats.totalKills = (character.stats.totalKills ?? 0) + 1;
    run.phase       = 'exploring';
    run.combatState = null;

  } else if (result === 'fled') {
    showNarrator(getLine('fleeSuccess'));
    run.phase       = 'exploring';
    run.combatState = null;

  } else if (result === 'lose') {
    showNarrator(getLine('death'));
    character.stats.bestFloor = Math.max(character.stats.bestFloor ?? 0, run.floor);
    run.phase = 'dead';
    clearRun();
  }

  applyStats();
  render();
  saveState();
};

const doCombat = async (action, payload) => {
  if (run.phase !== 'combat') return;

  const vp = viewport();
  let res;

  switch (action) {
    case 'attack':
      res = playerAttack(run.combatState, character);
      await playCombatHit(vp);
      break;
    case 'cast': {
      const spellId = payload ?? character.knownSpells?.[0];
      if (!spellId) { pushLog(["You don't know any spells."]); return; }
      res = playerCastSpell(run.combatState, character, spellId);
      break;
    }
    case 'flee':
      res = playerFlee(run.combatState, character);
      if (!res.success) await playCombatHit(vp);
      break;
    case 'hide':
      res = playerHide(run.combatState, character);
      break;
    default: return;
  }

  pushLog(res.messages);
  for (const [sk, xp] of Object.entries(res.skillXpGained ?? {})) applyXP(sk, xp);

  let over = checkCombatEnd(run.combatState, character);
  if (over) { await resolveCombatEnd(over); return; }

  if (!run.combatState.playerTurn) {
    const monRes = monsterTurn(run.combatState, character);
    pushLog(monRes.messages);
    if (monRes.damage > 0) await playCombatHit(vp);
    if (character.hp / character.maxHp < 0.3 && Math.random() < 0.4) showNarrator(getLine('lowHp'));
    over = checkCombatEnd(run.combatState, character);
    if (over) { await resolveCombatEnd(over); return; }
  }

  render();
  saveState();
};

// ─── Chest ───────────────────────────────────────────────────────────────────

const doChest = async (action) => {
  if (run.phase !== 'chest') return;
  const { chest } = run.chestState;

  switch (action) {
    case 'chest_open': {
      if (chest.locked) { pushLog(['It is locked.']); render(); return; }
      const res  = openChest(chest);
      const msgs = applyLootToCharacter(res.loot, character);
      pushLog([...res.messages, ...msgs]);
      if (res.loot.some(i => i?.type === 'gold')) showNarrator(getLine('findGold'));
      run.phase      = 'exploring';
      run.chestState = null;
      break;
    }
    case 'chest_pick': {
      const res = pickLock(chest, character);
      pushLog(res.messages);
      applyXP('lockpicking', res.skillXpGained.lockpicking ?? 0);
      if (res.success) chest.locked = false;
      break;
    }
    case 'chest_smash': {
      const res  = smashChest(chest, character);
      const msgs = applyLootToCharacter(res.loot, character);
      pushLog([...res.messages, ...msgs]);
      showNarrator(getLine('chestSmash'));
      for (const [sk, xp] of Object.entries(res.skillXpGained ?? {})) applyXP(sk, xp);
      run.phase      = 'exploring';
      run.chestState = null;
      if (res.attractsMonster) {
        render(); saveState();
        setTimeout(() => startCombat(pickWeightedMonster(run.floor)), 400);
        return;
      }
      break;
    }
    case 'chest_leave':
      run.phase      = 'exploring';
      run.chestState = null;
      break;
  }

  render();
  saveState();
};

// ─── Shop ────────────────────────────────────────────────────────────────────

const generateShop = (floorNum) => {
  const potionPrice = 15 + (floorNum - 1) * 5;
  const items = [
    { item: getItem('healingPotion'), price: potionPrice },
    { item: getItem('healingPotion'), price: potionPrice },
  ];
  const equipPool = floorNum >= 2
    ? ['shortSword', 'longSword', 'handAxe', 'leatherArmor']
    : ['rustDagger', 'shortSword', 'woodenClub'];
  const equip = getItem(equipPool[Math.floor(Math.random() * equipPool.length)]);
  if (equip) items.push({ item: equip, price: 25 + floorNum * 10 });
  return { type: 'shop', title: 'A merchant makes camp between floors.', items };
};

const generateVendor = (floorNum) => {
  const price = 12 + (floorNum - 1) * 4;
  const count = Math.random() < 0.5 ? 1 : 2;
  return {
    type: 'vendor',
    title: 'A hooded figure blocks your path — "Potions, friend?"',
    items: Array.from({ length: count }, () => ({ item: getItem('healingPotion'), price })),
  };
};

const doShop = (action, payload) => {
  if (run.phase !== 'shop') return;
  if (action === 'shop_leave') {
    run.phase = 'exploring';
    run.shopState = null;
    render();
    saveState();
    return;
  }
  if (action === 'shop_buy') {
    const idx = parseInt(payload, 10);
    const entry = run.shopState?.items?.[idx];
    if (!entry) return;
    if (character.gold < entry.price) {
      pushLog(['You cannot afford that.']);
      render();
      return;
    }
    character.gold -= entry.price;
    character.inventory.push({ ...entry.item });
    pushLog([`You buy ${entry.item.name} for ${entry.price}g.`]);
    run.shopState.items.splice(idx, 1);
    if (!run.shopState.items.length) {
      run.phase = 'exploring';
      run.shopState = null;
    }
    render();
    saveState();
  }
};

const floorTransition = async () => {
  run.phase = 'transitioning';
  render();
  await playFloorTransition(viewport());

  run.floor += 1;
  if (!run.floors[run.floor]) {
    try { run.floors[run.floor] = generateFloor(run.floor); }
    catch { run.floors[run.floor] = generateFloor(run.floor); }
  }

  const f      = run.floors[run.floor];
  run.position = { ...f.entrance };
  run.facing   = 'south';
  run.phase    = 'exploring';

  character.hp   = character.maxHp;
  character.mana = character.maxMana;
  character.stats.bestFloor = Math.max(character.stats.bestFloor ?? 0, run.floor);

  setContext({ floorNum: run.floor });
  showNarrator(getLine('newFloor'));
  pushLog([`Floor ${run.floor}. The descent restores you.`]);

  run.phase     = 'shop';
  run.shopState = generateShop(run.floor);
  render();
  saveState();
};

// ─── Action router ───────────────────────────────────────────────────────────

const castOutOfCombat = (spellId) => {
  if (!canCast(character, spellId)) {
    pushLog(['Not enough mana or arcana level too low.']);
    return;
  }
  const spell = SPELLS[spellId];
  if (!spell?.targetsSelf) {
    pushLog(["That spell requires a target — can't use it outside of combat."]);
    return;
  }
  const result = castSpellFn(spellId, character, null);
  const msgs = [];
  for (const eff of result.effects) {
    if (eff === 'heal') {
      const healed = Math.min(result.healAmount ?? 0, character.maxHp - character.hp);
      character.hp += healed;
      msgs.push(`You heal ${healed} HP. (${character.hp}/${character.maxHp})`);
    } else if (eff === 'mageArmor') {
      character.mageArmorActive = true;
      msgs.push('Arcane armor envelops you.');
    } else if (eff === 'shield') {
      msgs.push('A barrier shimmers briefly. Cast in combat for full effect.');
    } else if (eff === 'detectMagic') {
      msgs.push('You sense magical auras on this floor.');
    } else if (eff === 'flee') {
      msgs.push('Misty Step fizzles — no threat to escape.');
    }
  }
  if (msgs.length) pushLog(msgs);
  applyXP('arcana', 3);
  showNarrator(getLine('castSpell'));
  menuState = null;
  render();
  saveState();
};

const useItem = (idxStr) => {
  const idx = parseInt(idxStr, 10);
  const item = character.inventory?.[idx];
  if (!item) return;

  if (item.type === 'weapon') {
    const prev = character.equipment.weapon;
    character.equipment.weapon = item;
    character.inventory.splice(idx, 1);
    if (prev) character.inventory.push(prev);
    pushLog([`You equip the ${item.name}.${prev ? ` (${prev.name} stowed)` : ''}`]);
  } else if (item.type === 'armor') {
    const prev = character.equipment.armor;
    character.equipment.armor = item;
    character.inventory.splice(idx, 1);
    if (prev) character.inventory.push(prev);
    pushLog([`You don the ${item.name}.${prev ? ` (${prev.name} stowed)` : ''}`]);
  } else if (item.type === 'potion') {
    const amount = item.magnitude ?? 15;
    character.hp = Math.min(character.maxHp, character.hp + amount);
    pushLog([`You drink the ${item.name}. +${amount} HP.`]);
    character.inventory.splice(idx, 1);
  } else if (item.type === 'scroll') {
    const spellId = item.spell;
    if (spellId && !character.knownSpells.includes(spellId)) {
      character.knownSpells.push(spellId);
      pushLog([`You read the scroll. Learned: ${SPELLS[spellId]?.name ?? spellId}!`]);
      showNarrator(getLine('foundScroll'));
    } else {
      pushLog(['You already know that spell.']);
    }
    character.inventory.splice(idx, 1);
  }

  menuState = null;
  render();
  saveState();
};

const handleAction = (action, payload) => {
  if (action === 'submit_name') {
    character = createCharacter(payload);
    applyStats();
    hideNameEntry();
    newRun();
    return;
  }
  if (action === 'new_run')    { newRun(); return; }
  if (action === 'move')       { doMove(payload); return; }
  if (action === 'menu_back')  { menuState = null; render(); return; }
  if (action === 'spells')     { menuState = 'spell_menu'; render(); return; }
  if (action === 'items')      { menuState = 'item_menu';  render(); return; }
  if (action === 'char_sheet') { menuState = 'char_sheet'; render(); return; }
  if (action === 'cast_ooc')   { castOutOfCombat(payload); return; }
  if (action === 'use_item')   { useItem(payload); return; }
  if (action.startsWith('shop_')) { doShop(action, payload); return; }
  if (['attack', 'cast', 'flee', 'hide'].includes(action)) {
    menuState = null;
    doCombat(action, payload);
    return;
  }
  if (action.startsWith('chest_')) { doChest(action); return; }
};

// ─── Init ────────────────────────────────────────────────────────────────────

const init = () => {
  initUI(handleAction);

  character = loadCharacter();
  const savedRun = character ? loadRun() : null;

  if (!character) {
    showNameEntry();
    return;
  }

  applyStats();

  if (savedRun && savedRun.floors) {
    run = savedRun;
    setContext({ playerName: character.name, classTitle: character.classTitle, floorNum: run.floor });
    pushLog(['Resuming your descent...']);
    render();
  } else {
    newRun();
  }
};

document.addEventListener('DOMContentLoaded', init);

// debug hook (playtest only)
window.__sk = () => {
  const f = run?.floors?.[run.floor];
  let hint = null;
  if (f && run?.position) {
    // BFS: find first step toward nearest unvisited passable cell
    const seen = new Set([`${run.position.x},${run.position.y}`]);
    const queue = [{ x: run.position.x, y: run.position.y, firstDir: null }];
    outer: while (queue.length) {
      const { x, y, firstDir } = queue.shift();
      for (const [dx, dy, dir] of [[0,-1,'north'],[0,1,'south'],[1,0,'east'],[-1,0,'west']]) {
        const nx = x + dx, ny = y + dy, key = `${nx},${ny}`;
        if (seen.has(key)) continue;
        seen.add(key);
        const cell = f.grid[ny]?.[nx];
        if (!cell || cell.type === 'wall') continue;
        const step = firstDir ?? dir;
        if (!cell.encountered) { hint = step; break outer; }
        queue.push({ x: nx, y: ny, firstDir: step });
      }
    }
  }
  const adjCells = ['north','south','east','west'].reduce((acc, dir) => {
    const [dx, dy] = { north:[0,-1], south:[0,1], east:[1,0], west:[-1,0] }[dir];
    const c = f?.grid?.[run.position.y + dy]?.[run.position.x + dx];
    acc[dir] = c ? `${c.type}${c.encountered?'✓':''}` : 'OOB';
    return acc;
  }, {});
  return { floor: run?.floor, phase: run?.phase, pos: run?.position, facing: run?.facing,
           hp: character?.hp, maxHp: character?.maxHp, inv: character?.inventory?.length,
           hint, exit: run?.floors?.[run.floor]?.exit, adj: adjCells };
};
