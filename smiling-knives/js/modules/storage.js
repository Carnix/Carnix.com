const KEYS = {
  character: 'smiling-knives:character',
  run: 'smiling-knives:run',
};

export const saveCharacter = (character) =>
  localStorage.setItem(KEYS.character, JSON.stringify(character));

export const loadCharacter = () => {
  const raw = localStorage.getItem(KEYS.character);
  return raw ? JSON.parse(raw) : null;
};

export const saveRun = (run) =>
  localStorage.setItem(KEYS.run, JSON.stringify(run));

export const loadRun = () => {
  const raw = localStorage.getItem(KEYS.run);
  return raw ? JSON.parse(raw) : null;
};

export const clearRun = () =>
  localStorage.removeItem(KEYS.run);
