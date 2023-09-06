'use strict';

/**
 * Module for handling company autocomplete functionality.
 * @module CompanyAutocompletePOC
 * @version 0.0.1
 * @author Michael Langford
 */

import settings from './sap-config.js';

/**
 * Fetches the SEC data from the specified URL.
 * @param {string} url - The URL to fetch the data from.
 * @returns {Promise<Object[]>} - The promise containing the fetched data.
 */
const getsettings = async (url = settings.datafile) => {
  const response = await fetch(url);
  const companies = await response.json();
  return companies;
};

/**
 * Normalize an array of strings based on configuration settings.
 *
 * @param {Array<string>} json - The array of strings to be normalized.
 * @param {Object} config - The configuration object with normalization settings.
 * @returns {Array<string>} The normalized array with applied settings.
 */
const normalize = (json, config) => {
  /**
   * Convert a string to title case.
   *
   * @param {string} input - The input string to be converted.
   * @returns {string} The input string converted to title case.
   */
  const toTitleCase = (input) => {
    return input.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase());
  };

  let output = [...json];

  if (config.normalization.toTitleCase) {
    output = output.map(item => toTitleCase(item));
  }

  if (config.normalization.alphabetical) {
    output = [...new Set(output)].sort();
  }

  return output;
};

/**
 * Entry point for the company autocomplete functionality.
 */
getsettings().then(json => {
  const companies = normalize(json, settings);

  const searchInput = document.getElementById('sap-searchInput');
  const autocompleteList = document.getElementById('sap-autocompleteList');
  let selectedIndex = -1;


  /**
   * Updates the selection state and input value based on the selectedIndex.
   * @param {string[]} matchingCompanies - Array of matching company names.
   * @param {boolean} isMouseSelection - Indicates whether the selection is done via mouse click.
   */  
  const updateSelection = (matchingCompanies, isMouseSelection) => {
    const listItems = Array.from(autocompleteList.children);
    listItems.forEach((li, index) => {
      if (index === selectedIndex) {
        li.classList.add('selected');
      } else {
        li.classList.remove('selected');
      }
    });
  
    if (selectedIndex !== -1) {
      searchInput.value = isMouseSelection ? matchingCompanies[selectedIndex] : matchingCompanies[selectedIndex];
    } else {
      searchInput.value = searchInput.value;
    }
  };


  /**
   * Hides the autocomplete list.
   */
  const hideAutocompleteList = () => {
    autocompleteList.innerHTML = '';
    autocompleteList.classList.remove('visible');
  };


  /**
   * Updates the autocomplete list with matching company names.
   * Limits the displayed results to a maximum of 6 items.
   * @param {string[]} matchingCompanies - Array of company names matching the search term.
   */
  const updateAutocompleteList = matchingCompanies => {
    autocompleteList.innerHTML = '';
  
    const maxResults = 6;
    const resultsToDisplay = matchingCompanies.slice(0, maxResults);
  
    resultsToDisplay.forEach((company, index) => {
      const li = document.createElement('li');
      li.textContent = company;
      li.addEventListener('click', () => {
        searchInput.value = company;
        hideAutocompleteList();
      });
      autocompleteList.appendChild(li);
  
      if (index === selectedIndex) {
        li.classList.add('selected');
      }
    });
  
    if (resultsToDisplay.length > 0) {
      autocompleteList.classList.add('visible');
    } else {
      hideAutocompleteList();
    }
  };


  /**
   * Handles keyboard navigation and selection for the autocomplete list.
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  const handleKeyDown = event => {
    const matchingCompanies = Array.from(autocompleteList.children).map(li => li.textContent);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        selectedIndex = Math.min(selectedIndex + 1, matchingCompanies.length - 1);
        updateSelection(matchingCompanies, false);
        break;
      case 'ArrowUp':
        event.preventDefault();
        selectedIndex = Math.max(selectedIndex - 1, -1);
        updateSelection(matchingCompanies, false);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex !== -1) {
          searchInput.value = matchingCompanies[selectedIndex];
          hideAutocompleteList();
        }
        break;
    }
  };

  /**
   * Event listener to handle the blur (unfocus) event of the search input.
   * Hides the autocomplete list when the search input loses focus.
   */
  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      hideAutocompleteList();
    }, 200); // Delay to allow for selection of autocomplete items
  });

  /**
   * Event listener to handle back button clicks.
   * sends users to specified page
   */
  const buttonLinks = document.querySelectorAll('button[data-href]');

  buttonLinks.forEach(button => {
      const href = button.dataset.href;
      
      button.addEventListener('click', () => {
          window.location.href = href;
      });
  });


  /**
   * Initializes the autocomplete functionality.
   */
  const initSAPAutocomplete = () => {
    searchInput.addEventListener('input', () => {
      const searchTerm = searchInput.value.toLowerCase();
      const matchingCompanies = companies.filter(company => company.toLowerCase().includes(searchTerm));
      selectedIndex = -1;
      updateAutocompleteList(matchingCompanies);
    });
  };

  searchInput.addEventListener('keydown', handleKeyDown);

  initSAPAutocomplete();

});