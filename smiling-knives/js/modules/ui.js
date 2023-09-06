/**
 * Generates the UI for the game.
 * @param {HTMLElement} container - The HTML element to contain the UI.
 * @param {Function} handleMove - The handleMove function from main.js.
 * @returns {Object} An object with UI-related functions.
 */
export const generateUI = (container, handleMove, map) => {
    const viewportWidth = 15;
    const viewportHeight = 10;

    const createAsciiViewport = (width, height) => {
      const viewport = document.createElement('div');
      viewport.classList.add('ascii-viewport');

      // Generate the ASCII-rendered dungeon layout here
      // You can use CSS to style the ASCII viewport

      return viewport;
    };

    const createControls = () => {
      const controls = document.createElement('div');
      controls.classList.add('controls');

      const directions = ['North', 'South', 'East', 'West'];
      directions.forEach(direction => {
        const button = document.createElement('button');
        button.textContent = direction[0];
        button.classList.add('control-button', direction.toLowerCase());
        button.setAttribute('data-direction', direction.toLowerCase());
        button.addEventListener('click', event => {
          if (event.target.classList.contains('control-button')) {
            const direction = event.target.getAttribute('data-direction');
            handleMove(direction); // Call handleMove with the clicked direction
          }
        });
        controls.appendChild(button);
      });

      return controls;
    };

    const asciiViewport = createAsciiViewport(viewportWidth, viewportHeight);
    container.appendChild(asciiViewport);

    const mapHistoryContainer = document.createElement('div');
    mapHistoryContainer.classList.add('map-history');
    container.appendChild(mapHistoryContainer);

    const updatePlayerPosition = position => {
      const playerPositionElement = document.createElement('div');
      playerPositionElement.textContent = `Player Position: ${position}`;
      container.appendChild(playerPositionElement);
    };

    const updateGoldCoins = amount => {
      // Update gold coins UI
    };

    const controls = createControls(); // Create the controls
    container.appendChild(controls); // Append the controls to the container

    return {
        init: () => {
            // Initialize UI
            const initialPlayerPosition = [0, 0];
            updatePlayerPosition(initialPlayerPosition);
            updateGoldCoins(0);
        
            // Create and append the initial ASCII map
            const asciiMap = map.createAsciiMap(initialPlayerPosition);
            appendAsciiMap(asciiMap);
        },
        updatePlayerPosition,
        updateGoldCoins,

        updateAsciiMap: playerPosition => {
            const asciiMap = map.createAsciiMap(playerPosition); // Use the map object
            asciiViewport.innerHTML = ''; // Clear previous map
            asciiViewport.appendChild(asciiMap);
          },

        updateMapHistory: history => {
            const mapHistoryElement = document.createElement('pre');
            mapHistoryElement.textContent = history.join('\n\n');
            mapHistoryContainer.innerHTML = '';
            mapHistoryContainer.appendChild(mapHistoryElement);
        },
      showAnimation: (message, duration) => {
        const animationContainer = document.createElement('div');
        animationContainer.classList.add('animation-container');
        const animationText = document.createElement('p');
        animationText.textContent = message;
        animationContainer.appendChild(animationText);
        container.appendChild(animationContainer);

        setTimeout(() => {
          container.removeChild(animationContainer);
        }, duration);
      },
      // Other UI-related functions
    };
};
