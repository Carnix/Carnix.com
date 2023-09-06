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

1. Open the [google-poc.html](https://pages.github.tools.sap/digital-experiences/ux-test/autocomplete-poc/google-poc.html) page in a web browser.
2. Start typing in the input field to see auto-suggested addresses.
3. Select an address to populate the address form.

## Custom Company AutoComplete

The `autocomplete-poc` directory contains a custom POC that implements autocomplete functionality for company names using a JSON data source. It includes an HTML file, a CSS file, and a JavaScript file.

### Features

- Custom autocomplete using a local JSON data source.
- Allows searching and selecting company names.
- Provides suggestions based on user input.

### Usage

1. Open the [sap-poc.html](https://pages.github.tools.sap/digital-experiences/ux-test/autocomplete-poc/sap-poc.html) page in a web browser.
2. Start typing in the input field to see auto-suggested company names.
3. Select a company name to populate the input field.

## About

These POCs were created to showcase two different approaches to implementing autocomplete functionality in web applications. They demonstrate the usage of external APIs as well as custom implementations using local data.

Feel free to explore the code, customize it for your needs, and use it as a reference for your own projects.

---

> Note: These POCs are for demonstration purposes only and might not be suitable for production use without further development and testing.
