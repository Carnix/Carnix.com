'use strict';

/**
 * Initializes the playlist and sets event listeners for track items.
 * @param {Object} config - The configuration for the playlist.
 * @param {boolean} config.autorun - Whether the playlist should auto-run.
 */
const initializePlaylist = config => {
    const tracks = {};

    /**
     * Sets click event listeners for track items.
     */
    const setEvents = () => {
        const items = [...document.querySelectorAll('div#tracks a')];

        items.forEach(item => {
            item.addEventListener('click', event => {
                event.preventDefault();

                items.forEach(item => {
                    delete item.dataset.playing;
                    const playerControl = document.getElementById('player-control');
                    if (playerControl) {
                        playerControl.remove();
                    }
                });

                item.dataset.playing = true;
                const mp3file = item.href;
                const player = `<div id="player-control"><audio controls autoplay="true"><source src="${mp3file}" type="audio/mpeg"></audio></div>`;
                item.insertAdjacentHTML('afterend', player);
            });
        });
    };

    if (config.autorun) {
        setEvents();
    }
};

// Entry point: Initialize the playlist with autorun enabled.
initializePlaylist({ autorun: true });
