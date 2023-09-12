# JSON Data Transformation Tool

`transform.js`, designed to transform JSON data obtained from the SEC website into a simple JSON format for use in a company name autocomplete POC.

## Features

- Transformation of complex JSON data into a smaller dataset to reduce frontend load and processing time.
- Could be modified to support various transformation operations such as filtering, mapping, and normalization if needed.


# Usage

To use the `transform.js` tool:

1. Make sure you have Node.js installed on your system.
2. Install node and then the required dependencies using npm: `npm init` then `npm install`
3. Modify the configuration variables as needed.
4. Run the transformation script: `node transform.js`
5. The transformed data will be saved in the `outputFilePath` file.

## Configuration

The `transform.js` tool uses a configuration file named `config.js` to define how the transformation should be performed. In the `config.js` file, you can specify various settings such as input and output file paths, normalization options, etc.

```javascript
const dataDirectory = path.join(__dirname, '..', 'data'); 
const inputFilePath = path.join(dataDirectory, 'companies_sec.json'); //full path to input file
const outputFilePath = path.join(dataDirectory, 'companies.json'); //full path to input file
const key = "title"; //specific key for company name in original JSON
```