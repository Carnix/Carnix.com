const DIRS = {
  north: { dx:  0, dy: -1 },
  south: { dx:  0, dy:  1 },
  east:  { dx:  1, dy:  0 },
  west:  { dx: -1, dy:  0 },
};

const FACING_MAP = {
  north: { forward: 'north', back: 'south', left: 'west',  right: 'east'  },
  south: { forward: 'south', back: 'north', left: 'east',  right: 'west'  },
  east:  { forward: 'east',  back: 'west',  left: 'north', right: 'south' },
  west:  { forward: 'west',  back: 'east',  left: 'south', right: 'north' },
};

export const resolveDirection = (facing, relativeDir) =>
  FACING_MAP[facing][relativeDir];

export const getCell = (floor, { x, y }) =>
  floor.grid[y]?.[x] ?? null;

export const cellAhead = (floor, pos, facing) => {
  const { dx, dy } = DIRS[facing];
  return getCell(floor, { x: pos.x + dx, y: pos.y + dy });
};

export const cellAt = (floor, pos, facing, relativeDir) => {
  const absDir = resolveDirection(facing, relativeDir);
  const { dx, dy } = DIRS[absDir];
  return getCell(floor, { x: pos.x + dx, y: pos.y + dy });
};

export const tryMove = (floor, pos, facing, relativeDir) => {
  const absDir = resolveDirection(facing, relativeDir);

  // Left/right are pure rotations — update facing but don't step
  if (relativeDir === 'left' || relativeDir === 'right') {
    return { success: false, newPos: pos, newFacing: absDir, cell: null, deadEnd: false };
  }

  const { dx, dy } = DIRS[absDir];
  const newPos   = { x: pos.x + dx, y: pos.y + dy };
  const cell     = getCell(floor, newPos);

  if (!cell || cell.type === 'wall') {
    return { success: false, newPos: pos, newFacing: absDir, cell: null, deadEnd: true };
  }

  return { success: true, newPos, newFacing: absDir, cell, deadEnd: false };
};

export const getRoomAt = (floor, pos) => {
  const cell = getCell(floor, pos);
  if (!cell || cell.roomId === null) return null;
  return floor.rooms.find(r => r.id === cell.roomId) ?? null;
};
