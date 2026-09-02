const sleep = (ms) => new Promise(r => setTimeout(r, ms));

export const playHallwayAdvance = async (viewport) => {
  viewport.style.transition = 'opacity 0.12s ease-out';
  viewport.style.opacity = '0';
  await sleep(130);
};

export const finishTransition = async (viewport) => {
  viewport.style.transition = 'opacity 0.12s ease-in';
  viewport.style.opacity = '1';
  await sleep(130);
};

export const playDoorOpen = async (viewport) => {
  viewport.style.transition = 'opacity 0.2s ease-out';
  viewport.style.opacity = '0';
  await sleep(220);
};

export const playCombatHit = async (viewport) => {
  viewport.style.transition = 'none';
  viewport.style.backgroundColor = '#3a0000';
  await sleep(80);
  viewport.style.backgroundColor = '';
  await sleep(40);
};

export const playFloorTransition = async (viewport) => {
  viewport.style.transition = 'opacity 0.6s ease-out';
  viewport.style.opacity = '0';
  await sleep(700);
  viewport.style.transition = 'opacity 0.6s ease-in';
  viewport.style.opacity = '1';
  await sleep(600);
};
