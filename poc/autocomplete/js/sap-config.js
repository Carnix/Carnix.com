/**
 * Configuration object for company autocomplete functionality.
 * @typedef {Object} AppConfig
 * @property {string} datafile - The path to the data file containing company information.
 * @property {NormalizationOptions} normalization - Options for normalizing and sorting the data.
 */

/**
 * Options for normalizing and sorting the data.
 * @typedef {Object} NormalizationOptions
 * @property {boolean} toTitleCase - Whether to convert company names to title case.
 * @property {boolean} alphabetical - Whether to sort company names alphabetically.
 */

/**
 * Represents the SEC data and its source.
 * @type {AppConfig}
 */
const settings = {
    datafile: 'data/companies.json',
    normalization: {
      toTitleCase: false,
      alphabetical: true,
    },
    pocFiles: {
      round1: 'sap-poc.html',
      round2: 'full-form.html',
    }
  };
  
export default settings;