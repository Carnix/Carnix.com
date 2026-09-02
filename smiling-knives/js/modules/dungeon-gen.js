import { generateChest } from './treasure.js';

const ri = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const makeCell = (type = 'wall') => ({
  type,
  roomId: null,
  content: null,
  encountered: false,
  encounterSeed: Math.random() * 100,
});

const carveRoom = (grid, room) => {
  for (let y = room.y; y < room.y + room.height; y++) {
    for (let x = room.x; x < room.x + room.width; x++) {
      grid[y][x] = { ...makeCell('floor'), roomId: room.id };
    }
  }
};

const carveCorridor = (grid, x1, y1, x2, y2) => {
  const sx = x1 <= x2 ? 1 : -1;
  const sy = y1 <= y2 ? 1 : -1;
  for (let x = x1; x !== x2 + sx; x += sx) {
    if (grid[y1][x].type === 'wall') grid[y1][x] = makeCell('floor');
  }
  for (let y = y1; y !== y2 + sy; y += sy) {
    if (grid[y][x2].type === 'wall') grid[y][x2] = makeCell('floor');
  }
};

const roomCenter = (room) => ({
  x: Math.floor(room.x + room.width / 2),
  y: Math.floor(room.y + room.height / 2),
});

const tryPlaceRoom = (grid, width, height) => {
  for (let attempt = 0; attempt < 60; attempt++) {
    const rw = ri(4, 8);
    const rh = ri(3, 6);
    const rx = ri(2, width - rw - 3);
    const ry = ri(2, height - rh - 3);
    let ok = true;
    outer: for (let y = ry - 1; y <= ry + rh; y++) {
      for (let x = rx - 1; x <= rx + rw; x++) {
        if (grid[y]?.[x]?.type !== 'wall') { ok = false; break outer; }
      }
    }
    if (ok) return { x: rx, y: ry, width: rw, height: rh };
  }
  return null;
};

const postProcessDoors = (grid, height, width) => {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y][x];
      if (cell.type !== 'floor' || cell.roomId !== null) continue;
      const adj = [[x-1,y],[x+1,y],[x,y-1],[x,y+1]];
      const borderesRoom = adj.some(([nx,ny]) =>
        nx >= 0 && ny >= 0 && nx < width && ny < height &&
        grid[ny][nx].type === 'floor' && grid[ny][nx].roomId !== null
      );
      if (borderesRoom) cell.type = 'door';
    }
  }
};

const FLOOR_MONSTERS = {
  1: ['goblin', 'spider', 'giantMosquito', 'rous'],
  2: ['goblin', 'orc', 'skeleton', 'hellhound'],
  3: ['orc', 'ogre', 'hellhound', 'caveTroll'],
};

const pickRoomMonster = (floorNum) => {
  const pool = FLOOR_MONSTERS[Math.min(floorNum, 3)];
  return pool[Math.floor(Math.random() * pool.length)];
};

export const generateFloor = (floorNum) => {
  const width  = Math.min(32 + floorNum * 2, 60);
  const height = Math.min(26 + floorNum * 2, 50);
  const targetRooms = Math.min(5 + floorNum, 15);

  const grid = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => makeCell('wall'))
  );

  const rooms = [];
  for (let i = 0; i < targetRooms; i++) {
    const bounds = tryPlaceRoom(grid, width, height);
    if (!bounds) continue;
    const room = { ...bounds, id: rooms.length, type: 'empty', cleared: false, chest: null, monsterTemplate: null };
    rooms.push(room);
    carveRoom(grid, room);
  }

  if (rooms.length < 2) throw new Error('Dungeon generation failed: too few rooms');

  // Connect rooms (Prim-style: always connect nearest unconnected room)
  const connected = new Set([0]);
  while (connected.size < rooms.length) {
    let bestDist = Infinity, bestFrom = -1, bestTo = -1;
    for (const fromId of connected) {
      for (let toId = 0; toId < rooms.length; toId++) {
        if (connected.has(toId)) continue;
        const c1 = roomCenter(rooms[fromId]);
        const c2 = roomCenter(rooms[toId]);
        const d = Math.abs(c1.x - c2.x) + Math.abs(c1.y - c2.y);
        if (d < bestDist) { bestDist = d; bestFrom = fromId; bestTo = toId; }
      }
    }
    const c1 = roomCenter(rooms[bestFrom]);
    const c2 = roomCenter(rooms[bestTo]);
    carveCorridor(grid, c1.x, c1.y, c2.x, c2.y);
    connected.add(bestTo);
  }

  postProcessDoors(grid, height, width);

  // Assign room types: room 0 = entrance, last = exit, others distributed
  const middle = rooms.slice(1, -1);
  middle.forEach((room, i) => {
    if (i % 3 === 0)      room.type = 'treasure';
    else if (i % 3 === 1) room.type = 'monster';
    // else stays 'empty'
  });

  // Populate rooms
  rooms.forEach(room => {
    if (room.type === 'treasure') {
      const center = roomCenter(room);
      grid[center.y][center.x].content = 'chest';
      room.chest = generateChest(floorNum);
    } else if (room.type === 'monster') {
      room.monsterTemplate = pickRoomMonster(floorNum);
    }
  });

  const entrance = roomCenter(rooms[0]);
  const exitRoom = rooms[rooms.length - 1];
  const exitPos  = roomCenter(exitRoom);
  grid[exitPos.y][exitPos.x].content = 'exit';

  return { width, height, grid, rooms, entrance, exit: exitPos, floorNum };
};
