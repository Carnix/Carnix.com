const fs = require('fs');
const path = require('path');

// Configuration variables
const dataDirectory = path.join(__dirname, '..', 'data'); 
const inputFilePath = path.join(dataDirectory, 'companies_sec.json'); //full path to input file
const outputFilePath = path.join(dataDirectory, 'companies.json'); //full path to input file
const key = "title"; //specific key for company name in original JSON

/**
 * Read and parse the input JSON file.
 *
 * @param {string} filePath - The path to the JSON input file.
 * @returns {Object} Parsed JSON data.
 */
const readAndParseJson = (filePath) => {
  const jsonData = fs.readFileSync(filePath, 'utf8');
  const parsedData = JSON.parse(jsonData);
  return parsedData;
};

/**
 * Extract values from parsed JSON data using the specified key.
 *
 * @param {Object} jsonData - Parsed JSON data.
 * @param {string} key - The key to extract from each object.
 * @returns {Array} Array of extracted values.
 */
const extractValues = (jsonData, key) => {
  return Object.values(jsonData).map(item => item[key]);
};

/**
 * Transform data by reading, parsing, extracting values, and writing to an output file.
 *
 * @param {string} inputPath - The path to the JSON input file.
 * @param {string} outputPath - The path to the output file.
 * @param {string} key - The key to extract from each object.
 */
const transformData = (inputPath, outputPath, key) => {
  const jsonData = readAndParseJson(inputPath);
  const extractedValues = extractValues(jsonData, key);
  const jsonOutput = JSON.stringify(extractedValues, null, 2);

  // Ensure the output directory exists
  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  fs.writeFileSync(outputPath, jsonOutput);
  console.log('Transformation complete. Transformed file saved at:', outputPath);
};

// Call the transformData function with the configuration variables
transformData(inputFilePath, outputFilePath, key);
