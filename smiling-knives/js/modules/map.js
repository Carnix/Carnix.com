/**
 * Map module for Smiling Knives game.
 * @module map
 */

/**
 * Creates an ASCII-rendered map element.
 * @param {string[]} mapData - Array of strings representing the map layout.
 * @param {Array} playerPosition - The player's position.
 * @returns {HTMLElement} The ASCII map element.
 */
export const generateAsciiMap = (mapData, playerPosition) => {
    const asciiMap = document.createElement('pre');
    asciiMap.classList.add('ascii-map');
  
    const mapRows = mapData.map(row => row.split(''));
  
    // Place the player icon 'P' at the player's position
    mapRows[playerPosition[1]][playerPosition[0]] = 'P';
  
    mapRows.forEach(row => {
      asciiMap.textContent += row.join('') + '\n';
    });
  
    return asciiMap;
  };
  
  /**
   * Generates the game map and provides functions to interact with it.
   * @param {Object} ui - The UI module object.
   * @returns {Object} An object with map-related functions.
   */
  export const generateMap = ui => {
    const mapData = [
      "##########",
      "#        #",
      "#        #",
      "#        #",
      "#        #",
      "#   P    #",
      "#        #",
      "#        #",
      "#        #",
      "##########"
    ];
  
    const mapHistory = [];
  
    return {
      getCellEvent: position => {
        // Return event type based on the map data
        return 'empty'; // Placeholder value
      },
      generateRandomMonster: () => {
        // Generate a random monster for the player to fight
        return {
          type: 'Goblin',
          gold: 10
        };
      },
      createAsciiMap: playerPosition => {
        const asciiMap = generateAsciiMap(mapData, playerPosition);
        mapHistory.push(asciiMap.textContent);
        ui.updateMapHistory(mapHistory);
        return asciiMap;
      },
    };
  };
  