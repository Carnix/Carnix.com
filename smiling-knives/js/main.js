import { generateUI } from './modules/ui.js';
import { generateMap } from './modules/map.js';
import { fightMonster } from './modules/fight.js';
import { movePlayer } from './modules/player.js';
import { initialState } from './modules/settings.js';

const gameContainer = document.body;

// Define the oppositeDirection function
const oppositeDirection = direction => {
  const oppositeDirections = {
    'left': 'right',
    'right': 'left',
    'forward': 'backward',
    'backward': 'forward',
  };
  return oppositeDirections[direction];
};

const handleMove = direction => {
  // Display animation (for example, a short hallway animation)
  ui.showAnimation('You are moving down a hallway...', 3000);

  setTimeout(() => {
    const newPosition = movePlayer(state.playerPosition, direction);
    if (newPosition) {
      state.playerPosition = newPosition;

      // Update UI with new player position
      ui.updatePlayerPosition(state.playerPosition);

      // Update the ASCII map with the new player position
      const asciiMap = map.createAsciiMap(state.playerPosition);
      ui.appendAsciiMap(asciiMap);

      // Handle events based on the new cell
      const cellEvent = map.getCellEvent(state.playerPosition);
      if (cellEvent === 'monster') {
        const monster = map.generateRandomMonster();
        const result = fightMonster(monster);
        if (result === 'win') {
          state.goldCoins += monster.gold;
          ui.updateGoldCoins(state.goldCoins);
        }
      } else if (cellEvent === 'gold') {
        const goldFound = Math.floor(Math.random() * 100) + 1;
        state.goldCoins += goldFound;
        ui.updateGoldCoins(state.goldCoins);
      } else if (cellEvent === 'blocked') {
        state.playerPosition = movePlayer(state.playerPosition, oppositeDirection(direction));
        ui.updatePlayerPosition(state.playerPosition);
      }
    }
  }, 3000); // Wait for the animation duration before actually moving
};

// Initialize UI with the handleMove function
const ui = generateUI(gameContainer, handleMove);
const map = generateMap(ui); // Pass the ui module object to the map generator


let state = { ...initialState };

// Initialize UI and start the game
ui.init();
ui.updateGoldCoins(state.goldCoins);
