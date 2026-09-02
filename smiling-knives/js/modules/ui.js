const DOM = {};

const VW = 42;
const VH = 14;
const r   = (ch, n) => ch.repeat(n);
const ctr = (s, w)  => { const p = Math.max(0, w - s.length); return ' '.repeat(Math.floor(p/2)) + s + ' '.repeat(Math.ceil(p/2)); };

const OUTER = '+' + r('=', VW-2) + '+';
const H1    = '| +' + r('-', VW-6)  + '+ |';
const H2    = '| | +' + r('-', VW-10) + '+ | |';
const B2    = '| | |' + r(' ', VW-10) + '| | |';
const FL    = '|'    + r(' ', VW-2)  + '|';
const WL    = '|'    + r('#', VW-2)  + '|';

const ARTS = {
  wall: [OUTER, ...Array(VH-2).fill(WL), OUTER].join('\n'),

  corridor: [
    OUTER, H1, H2,
    B2, B2,
    '| | |' + ctr('. . .', VW-10) + '| | |',
    B2, B2,
    H2, H1, FL, FL, FL, OUTER,
  ].join('\n'),

  door: [
    OUTER, H1,
    '| |  +' + r('=', VW-12) + '+  | |',
    '| |  |' + r(' ', VW-12) + '|  | |',
    '| |  |' + ctr('[ DOOR ]', VW-12) + '|  | |',
    '| |  |' + r(' ', VW-12) + '|  | |',
    '| |  +' + r('=', VW-12) + '+  | |',
    H1, FL, FL, FL, FL, FL, OUTER,
  ].join('\n'),
};

const MONSTER_ART = {
  goblin: [
    "  ^(o.o)^  ",
    "  <| w |>  ",
    "   /| |\\   ",
    "   | | |   ",
    "  _| | |_  ",
  ],
  skeleton: [
    "   (^ ^)    ",
    "  __|_|__   ",
    "    |X|     ",
    "   /| |\     ",
    "  _| | |_   ",
  ],
  caveTroll: [
    " /\\     /\\  ",
    "(  o   o  ) ",
    " \\  ---  /  ",
    " /|     |\\  ",
    "// |   | \\\\ ",
  ],
  seeker: [
    "  ,_____,   ",
    " / ? . ? \\  ",
    "|  _____  | ",
    " \\|     |/  ",
    "  |  |  |   ",
  ],
  spider: [
    "\\/ _____ \\/ ",
    "/\\(  ___)\\/  ",
    "\\ \\(o_o)/ /  ",
    " \\/-----\\/  ",
    "  |  |  |   ",
  ],
  rous: [
    "   /\\_/\\    ",
    "  ( o.o )~  ",
    "   ) ^ (    ",
    "  (_____)   ",
    "  |~| |~|   ",
  ],
  giantMosquito: [
    "  \\  |  /   ",
    "   \\ | /    ",
    " --[=X=]--  ",
    "   / | \\    ",
    "  /  |  \\   ",
  ],
  hellhound: [
    "   //^^\\    ",
    "  (@ . @)   ",
    "   ) ~ (    ",
    "  /|   |\\   ",
    " //|___|\\\\  ",
  ],
  orc: [
    "   _|_|_    ",
    "  /o   o\   ",
    " ( --=-- )  ",
    "  \\|   |/   ",
    "  /|   |\\   ",
  ],
  ogre: [
    "  /######\   ",
    " | O    O |  ",
    " |  /--\\ |  ",
    "  \\_| |_//  ",
    " //|    |\\  ",
  ],
};

const combatArt = (monster) => {
  const ln = (s) => '|' + ctr(s, VW-2) + '|';
  const top = '+' + r('*', VW-2) + '+';
  const sep = '+' + r('-', VW-2) + '+';
  const filled = Math.round((monster.hp / monster.maxHp) * 20);
  const bar = '█'.repeat(Math.max(0, filled)) + '░'.repeat(20 - Math.max(0, filled));
  const activeStatuses = Object.entries(monster.statuses ?? {})
    .filter(([, v]) => v > 0)
    .map(([k]) => k.toUpperCase())
    .join('  ');
  const art = MONSTER_ART[monster.id] ?? ['', '', '', '', ''];
  return [
    top,
    ln(`[ ${monster.name.toUpperCase()} ]`),
    ln(bar),
    ln(`${monster.hp} / ${monster.maxHp} HP`),
    activeStatuses ? ln(activeStatuses) : FL,
    FL,
    ...art.map(ln),
    FL,
    sep,
  ].join('\n');
};

const deadArt = (character) => {
  const ln = (s) => '|' + ctr(s, VW-2) + '|';
  const top = '+' + r('*', VW-2) + '+';
  return [
    top, FL, FL,
    ln('Y O U   D I E D'),
    FL,
    ln(character ? `Floor ${character.stats?.bestFloor ?? '?'} reached` : ''),
    FL, FL,
    ln('Your skills endure.'),
    FL, FL, FL, FL,
    top,
  ].join('\n');
};

// ─── Minimap ─────────────────────────────────────────────────────────────────

const MAP_W = 13;
const MAP_H =  9;

export const renderMinimap = (floor, pos, facing) => {
  if (!DOM.minimap || !floor) return;
  const hw = Math.floor(MAP_W / 2);
  const hh = Math.floor(MAP_H / 2);
  const facingChar = { north: '^', south: 'v', east: '>', west: '<' }[facing] ?? '@';
  let out = '';
  for (let dy = -hh; dy <= hh; dy++) {
    for (let dx = -hw; dx <= hw; dx++) {
      if (dx === 0 && dy === 0) { out += facingChar; continue; }
      const gx = pos.x + dx;
      const gy = pos.y + dy;
      const cell = floor.grid[gy]?.[gx];
      if (!cell || !cell.encountered) {
        out += ' ';
      } else if (cell.content === 'exit') {
        out += '>';
      } else if (cell.content === 'chest') {
        out += '*';
      } else if (cell.type === 'door') {
        out += '+';
      } else if (cell.roomId !== null) {
        out += '·';
      } else {
        out += '.';
      }
    }
    out += '\n';
  }
  DOM.minimap.textContent = out;
};

// ─── Exports ─────────────────────────────────────────────────────────────────

export const initUI = (onAction) => {
  DOM.overlay     = document.getElementById('name-overlay');
  DOM.nameInput   = document.getElementById('name-input');
  DOM.nameSubmit  = document.getElementById('name-submit');
  DOM.narrator    = document.getElementById('narrator-text');
  DOM.viewport    = document.getElementById('viewport');
  DOM.facingLabel = document.getElementById('facing-label');
  DOM.hpBar       = document.getElementById('hp-bar');
  DOM.hpText      = document.getElementById('hp-text');
  DOM.mpBar       = document.getElementById('mp-bar');
  DOM.mpText      = document.getElementById('mp-text');
  DOM.statFloor   = document.getElementById('stat-floor');
  DOM.statGold    = document.getElementById('stat-gold');
  DOM.statClass   = document.getElementById('stat-class');
  DOM.combatStats = document.getElementById('combat-stats');
  DOM.monsterName = document.getElementById('monster-name');
  DOM.enemyBar    = document.getElementById('enemy-bar');
  DOM.enemyText   = document.getElementById('enemy-text');
  DOM.monsterSt   = document.getElementById('monster-statuses');
  DOM.logLines    = document.getElementById('log-lines');
  DOM.controls    = document.getElementById('controls');
  DOM.minimap     = document.getElementById('minimap');

  DOM.controls.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn || btn.disabled) return;
    onAction(btn.dataset.action, btn.dataset.payload);
  });

  DOM.nameSubmit.addEventListener('click', () => {
    const name = DOM.nameInput.value.trim();
    if (name) onAction('submit_name', name);
  });
  DOM.nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const name = DOM.nameInput.value.trim();
      if (name) onAction('submit_name', name);
    }
  });

  document.addEventListener('keydown', (e) => {
    if (DOM.overlay && !DOM.overlay.classList.contains('hidden')) return;
    const map = {
      ArrowUp: ['move','forward'], w: ['move','forward'],
      ArrowLeft: ['move','left'], a: ['move','left'],
      ArrowRight: ['move','right'], d: ['move','right'],
      ArrowDown: ['move','back'], s: ['move','back'],
      ' ': ['attack', null], Enter: ['attack', null],
      f: ['flee', null], h: ['hide', null],
      o: ['chest_open', null], p: ['chest_pick', null],
      Escape: ['chest_leave', null],
    };
    const entry = map[e.key];
    if (entry) { e.preventDefault(); onAction(entry[0], entry[1]); }
  });
};

export const showNameEntry = () => {
  if (DOM.overlay) DOM.overlay.classList.remove('hidden');
  if (DOM.nameInput) setTimeout(() => DOM.nameInput.focus(), 50);
};

export const hideNameEntry = () => {
  if (DOM.overlay) DOM.overlay.classList.add('hidden');
};

export const renderViewport = ({ fwdCell, facing }, phase, character, combatState) => {
  if (!DOM.viewport) return;

  if (phase === 'dead') {
    DOM.viewport.textContent = deadArt(character);
    if (DOM.facingLabel) DOM.facingLabel.textContent = '';
    return;
  }

  if (phase === 'combat' && combatState?.monster) {
    DOM.viewport.textContent = combatArt(combatState.monster);
    if (DOM.facingLabel) DOM.facingLabel.textContent = 'COMBAT';
    return;
  }

  if (!fwdCell || fwdCell.type === 'wall') {
    DOM.viewport.textContent = ARTS.wall;
  } else if (fwdCell.type === 'door') {
    DOM.viewport.textContent = ARTS.door;
  } else {
    DOM.viewport.textContent = ARTS.corridor;
  }

  if (DOM.facingLabel) DOM.facingLabel.textContent = `facing ${facing}`;
};

export const renderStats = (character, run) => {
  if (!character) return;

  const hpPct = Math.max(0, Math.min(100, (character.hp / character.maxHp) * 100));
  const mpPct = Math.max(0, Math.min(100, (character.mana / character.maxMana) * 100));

  if (DOM.hpBar)  DOM.hpBar.style.width  = hpPct + '%';
  if (DOM.hpText) DOM.hpText.textContent = `${Math.max(0, character.hp)}/${character.maxHp}`;
  if (DOM.mpBar)  DOM.mpBar.style.width  = mpPct + '%';
  if (DOM.mpText) DOM.mpText.textContent = `${character.mana}/${character.maxMana}`;

  if (DOM.statFloor) DOM.statFloor.textContent = run?.floor ?? '—';
  if (DOM.statGold)  DOM.statGold.textContent  = character.gold ?? 0;
  if (DOM.statClass) DOM.statClass.textContent  = character.classTitle ?? '—';
};

export const renderCombatStats = (monster) => {
  if (!DOM.combatStats) return;
  DOM.combatStats.classList.remove('hidden');
  if (DOM.monsterName) DOM.monsterName.textContent = monster.name.toUpperCase();
  const pct = Math.max(0, Math.min(100, (monster.hp / monster.maxHp) * 100));
  if (DOM.enemyBar)  DOM.enemyBar.style.width  = pct + '%';
  if (DOM.enemyText) DOM.enemyText.textContent = monster.hp;

  const statuses = Object.entries(monster.statuses)
    .filter(([, v]) => v > 0)
    .map(([k]) => k)
    .join(', ');
  if (DOM.monsterSt) DOM.monsterSt.textContent = statuses;
};

export const hideCombatStats = () => {
  if (DOM.combatStats) DOM.combatStats.classList.add('hidden');
};

const btn = (label, action, payload, cls = '') =>
  `<button type="button" class="ctrl-btn ${cls}" data-action="${action}"${payload != null ? ` data-payload="${payload}"` : ''}>${label}</button>`;

export const renderControls = (phase, combatState, character) => {
  if (!DOM.controls) return;

  if (phase === 'exploring') {
    DOM.controls.innerHTML = `
      <div class="move-grid">
        ${btn('↑ Fwd', 'move', 'forward')}
        ${btn('← L',   'move', 'left')}
        ${btn('↓ Back','move', 'back')}
        ${btn('R →',   'move', 'right')}
      </div>
      <div class="action-btns">
        ${btn('Spells', 'spells',     null)}
        ${btn('Items',  'items',      null)}
        ${btn('Sheet',  'char_sheet', null)}
      </div>`;
  } else if (phase === 'combat') {
    const hasMana = character && character.mana > 0 && (character.knownSpells?.length ?? 0) > 0;
    const hasItems = (character?.inventory?.length ?? 0) > 0;
    DOM.controls.innerHTML = `
      ${btn('[A] Attack',     'attack',  null, 'primary')}
      ${btn('[C] Cast Spell', 'spells',  null, hasMana  ? '' : 'disabled')}
      ${btn('[I] Items',      'items',   null, hasItems ? '' : 'disabled')}
      ${btn('[F] Flee',       'flee',    null)}
      ${btn('[H] Hide',       'hide',    null)}`;
    if (!hasMana)  DOM.controls.querySelector('[data-action="spells"]')?.setAttribute('disabled', '');
    if (!hasItems) DOM.controls.querySelector('[data-action="items"]')?.setAttribute('disabled', '');
  } else if (phase === 'chest') {
    const chest = combatState;
    const locked = chest?.locked ?? false;
    const canPick = character && (character.skills?.lockpicking?.level ?? 0) > 0;
    const canSmash = character && ['axes','bluntWeapons']
      .includes(character.equipment?.weapon?.skillType);
    DOM.controls.innerHTML = `
      ${btn('[O] Open',     'chest_open',  null, locked ? 'disabled' : 'primary')}
      ${btn('[P] Pick Lock','chest_pick',  null, !locked || !canPick ? 'disabled' : '')}
      ${btn('Smash',        'chest_smash', null, !canSmash ? 'disabled' : '')}
      ${btn('Leave',        'chest_leave', null)}`;
    if (locked) DOM.controls.querySelector('[data-action="chest_open"]')?.setAttribute('disabled', '');
    if (!locked || !canPick) DOM.controls.querySelector('[data-action="chest_pick"]')?.setAttribute('disabled', '');
    if (!canSmash) DOM.controls.querySelector('[data-action="chest_smash"]')?.setAttribute('disabled', '');
  } else if (phase === 'char_sheet') {
    const d = combatState;
    if (!d) { DOM.controls.innerHTML = btn('← Close', 'menu_back', null); return; }
    const skillRows = d.skills.map(s =>
      `<div class="sheet-skill"><span class="sk-name">${s.name}</span>` +
      `<span class="sk-bar">${s.bar}</span>` +
      `<span class="sk-lv">Lv${s.level} ${s.xpStr}</span></div>`
    ).join('');
    DOM.controls.innerHTML =
      `<div class="char-sheet">` +
      `<div class="sheet-header"><strong>${d.name}</strong> · ${d.title} · Floor ${d.floor}</div>` +
      `<div class="sheet-vitals">` +
        `HP ${d.hp}/${d.maxHp} &nbsp; MP ${d.mana}/${d.maxMana} &nbsp; Gold ${d.gold}g` +
      `</div>` +
      `<div class="sheet-equip">Weapon: ${d.weapon} &nbsp;|&nbsp; Armor: ${d.armor}</div>` +
      `<div class="sheet-skills">${skillRows}</div>` +
      `<div class="sheet-stats">Kills: ${d.kills} &nbsp; Best floor: ${d.bestFloor}</div>` +
      `</div>` +
      btn('← Close', 'menu_back', null);
  } else if (phase === 'spell_menu') {
    const spells = combatState ?? [];
    const spellBtns = spells.length
      ? spells.map(s =>
          btn(`${s.name} [${s.manaCost}mp]`, s.action, s.id, s.enabled ? '' : 'disabled')
        ).join(' ')
      : '<span class="ctrl-muted">No spells known.</span>';
    DOM.controls.innerHTML = spellBtns + ' ' + btn('← Back', 'menu_back', null);
  } else if (phase === 'item_menu') {
    const items = combatState ?? [];
    const itemBtns = items.length
      ? items.map(i => btn(i.name, 'use_item', i.id)).join(' ')
      : '<span class="ctrl-muted">Inventory empty.</span>';
    DOM.controls.innerHTML = itemBtns + ' ' + btn('← Back', 'menu_back', null);
  } else if (phase === 'shop') {
    const { title, items } = combatState ?? {};
    const gold = character?.gold ?? 0;
    const itemBtns = (items ?? []).map((si, i) => {
      const canAfford = gold >= si.price;
      return btn(`${si.item?.name ?? '?'} — ${si.price}g`, 'shop_buy', String(i), canAfford ? '' : 'disabled');
    }).join(' ');
    DOM.controls.innerHTML =
      `<span class="ctrl-muted">${title ?? 'Merchant'}</span><br>` +
      `<span class="ctrl-muted">Gold: ${gold}g</span><br>` +
      itemBtns + ' ' + btn('Continue', 'shop_leave', null);
    (items ?? []).forEach((si, i) => {
      if (gold < si.price)
        DOM.controls.querySelector(`[data-payload="${i}"]`)?.setAttribute('disabled', '');
    });
  } else if (phase === 'transitioning') {
    DOM.controls.innerHTML = '<span class="ctrl-muted">Descending...</span>';
  } else if (phase === 'dead') {
    DOM.controls.innerHTML = btn('[ BEGIN AGAIN ]', 'new_run', null, 'primary');
  } else {
    DOM.controls.innerHTML = '';
  }
};

const MAX_LOG = 4;

export const pushLog = (messages) => {
  if (!DOM.logLines || !messages?.length) return;
  messages.filter(Boolean).forEach((msg) => {
    const div = document.createElement('div');
    div.className = 'log-line recent';
    div.textContent = msg;
    DOM.logLines.appendChild(div);
    DOM.logLines.querySelectorAll('.log-line.recent').forEach((el, i, arr) => {
      if (i < arr.length - 1) el.classList.remove('recent');
    });
    while (DOM.logLines.children.length > MAX_LOG) {
      DOM.logLines.removeChild(DOM.logLines.firstChild);
    }
  });
};

let narratorTimer = null;

export const showNarrator = (line) => {
  if (!DOM.narrator || !line) return;
  DOM.narrator.textContent = line;
  DOM.narrator.style.opacity = '1';
  if (narratorTimer) clearTimeout(narratorTimer);
  narratorTimer = setTimeout(() => {
    DOM.narrator.style.opacity = '0.5';
  }, 6000);
};
