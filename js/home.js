'use strict';

/**
 * @file Handles various functionalities on the site.
 * @version 1.0.0
 * @author Michael Langford
 * @license MIT
 */

import SecretNav from './secretnav.js';

const secretNavElement = SecretNav.generateSecretNav();
const header = document.querySelector('header');
header.appendChild(secretNavElement);

// Ensure that the DOM elements are present before adding event listeners
document.addEventListener('DOMContentLoaded', () => {
  const secretLink = document.getElementById('secret-trigger');
  const secretNav = document.getElementById('secretNav');
  const closeNav = document.getElementById('closeNav');

  secretLink.addEventListener('click', event => {
    event.preventDefault();
    secretNav.classList.toggle('show');
  });

  closeNav.addEventListener('click', () => {
    secretNav.classList.remove('show');
  });
});
  
try {
  /**
   * Event listener for clicking the sadface SVG.
   * @listens sadface-svg#click
   */
  document.getElementById('sadface-svg').addEventListener('click', event => {
    const target = event.target;
    const showElement = document.getElementById('munch-container');
    const hideElement = document.getElementById('sadface-container');

    showElement.classList.remove('hide');
    showElement.classList.add('show');

    hideElement.classList.remove('show');
    hideElement.classList.add('hide');
  });
} catch (error) {
  // Handle any errors that might occur
}