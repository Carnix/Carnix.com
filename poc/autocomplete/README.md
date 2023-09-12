# AutoComplete Proof of Concepts

This repository contains two Proof of Concepts (POCs) for implementing autocomplete functionality using different approaches:

1. [Google Places AutoComplete API](#google-places-autocomplete-api)
2. [Custom Company AutoComplete](#custom-company-autocomplete)

## Google Places AutoComplete API

The `google-poc` directory contains a POC that demonstrates the usage of the Google Places AutoComplete API to provide address suggestions based on user input. It includes an HTML file, a CSS file, and a JavaScript file.

### Features

- AutoComplete suggestions using the Google Places API.
- Displays detailed address information when a place is selected.
- Allows biasing results based on the user's geographical location.

### Usage

1. Open the [google-poc.html](https://www.carnix.com/poc/autocomplete/google-poc.html) page in a web browser.
2. Start typing in the input field to see auto-suggested addresses.
3. Select an address to populate the address form.

## Custom Company AutoComplete

The `autocomplete-poc` directory contains a custom POC that implements autocomplete functionality for company names using a JSON data source. It includes an HTML file, a CSS file, and a JavaScript file.

### Features

- Custom autocomplete using a local JSON data source.
- Allows searching and selecting company names.
- Provides suggestions based on user input.

### Usage

1. Open the [sap-poc.html](https://www.carnix.com/poc/autocomplete/sap-poc.html) page in a web browser.
2. Start typing in the input field to see auto-suggested company names.
3. Select a company name to populate the input field.
4. Additionally there is a full page POC here:  [full-form.html](https://www.carnix.com/poc/autocomplete/full-form.html)
## About

These POCs were created to showcase two different approaches to implementing autocomplete functionality in web applications. They demonstrate the usage of external APIs as well as custom implementations using local data.

**NOTE:** THe data source for `sap-poc.html` comes from the US Securities and Exchange commission's bulk data download website: [https://www.sec.gov/edgar/sec-api-documentation].  It is used here as a convenient data source for demonstration purposes but SHOULD NOT be used in a final product.

---

> Note: These POCs are for demonstration purposes only and might not be suitable for production use without further development and testing.
