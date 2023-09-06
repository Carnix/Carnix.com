/**
 * @module SecretNav
 * @description Real big secret huh?
 */

import { secretNavLinks } from './settings.js';

const generateSecretNav = () => {
  const navList = document.createElement('ul');

  secretNavLinks.forEach(link => {
    const listItem = document.createElement('li');
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.textContent = link.label;
    listItem.appendChild(anchor);
    navList.appendChild(listItem);
  });

  const secretNav = document.createElement('nav');
  secretNav.appendChild(navList);
  secretNav.id = 'secretNav';

  // Add the close button element to the navigation
  const closeNav = document.createElement('span');
  closeNav.id = 'closeNav';
  closeNav.className = 'close-nav';
  closeNav.textContent = 'Close';
  secretNav.appendChild(closeNav);

  return secretNav;
};

export default {
  generateSecretNav
};
