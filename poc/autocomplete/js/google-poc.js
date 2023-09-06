'use strict';

/**
 * Autocomplete functionality for address forms using Google Places API.
 * @module CompanyAutocompletePOC
 * @version 0.1.0
 * @author Michael Langford
 * @global google
 */

/**
 * The search input element for autocomplete.
 * @type {HTMLInputElement}
 */
let autocompleteInput;
let autocomplete; // Declare autocomplete at a broader scope

/**
 * Initializes the Google Maps API with the specified library and callback function.
 *
 * @param {string} library - The Google Maps library to load (e.g., 'places', 'geometry', etc.).
 */
const gapi = (library) => {
  /**
   * The Google Maps API key.
   * @type {string}
   */
  const key = atob('QUl6YVN5RF9tdkZMaDgxVElxRU9TWlZrejBra1hoVnFJY0N6bzRB');

  /**
   * The name of the callback function to be executed when the API is loaded.
   * @type {string}
   */
  const callback = 'initAutocomplete';

  /**
   * Creates a SCRIPT element and appends it to the document's body to load the Google Maps API.
   * @type {HTMLScriptElement}
   */
  const script = document.createElement('SCRIPT');
  script.src = 'https://maps.googleapis.com/maps/api/js?key=' + key + '&libraries=' + library + '&callback=' + callback;

  // Append the script element to the document's body.
  document.body.append(script);
}

/**
 * Initialize the Google Places Autocomplete.
 * @function initAutocomplete
 */
const initAutocomplete = () => {
  autocompleteInput = document.getElementById('autocomplete');
  const options = {
    types: ['establishment'],
  };
  autocomplete = new google.maps.places.Autocomplete(autocompleteInput, options); // Assign to the broader autocomplete variable
  autocomplete.addListener('place_changed', fillInAddress);
};

/**
 * Fill the address form with the selected place's details.
 * @function fillInAddress
 */
const fillInAddress = () => {
  const place = autocomplete.getPlace();

  for (const component in componentForm) {
    if (Object.prototype.hasOwnProperty.call(componentForm, component)) {
      document.getElementById(component).value = '';
      document.getElementById(component).disabled = false;
    }
  }

  document.getElementById('autocomplete').value = place.name;
  document.getElementById("business").value = place.name;
  document.getElementById("business").disabled = false;

  for (let i = 0; i < place.address_components.length; i++) {
    const addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      const val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }

  

};

/**
 * Bias the autocomplete object to the user's geographical location.
 * @function geolocate
 */
const geolocate = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      const circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
};

// Component form object for mapping address components to form fields
const componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

// Google Places API callback function
window.initAutocomplete = initAutocomplete;

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
