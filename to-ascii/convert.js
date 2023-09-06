/**
 * @file Converts an image to ASCII art.
 * @license MIT License with Attribution
 * @description This script converts an image into ASCII art using JavaScript.
 * @version 1.0.0
 * @author Michael Langford
 * @since 2023-08-25
 * @modified 2023-08-25
 */

/**
 * Converts an image to ASCII art.
 *
 * @param {ImageData} imageData - The ImageData object representing the image.
 * @param {number} width - The desired width of the ASCII art.
 * @returns {string} The ASCII art representation of the image.
 */
export const imageToAscii = (imageData, width) => {
    /**
     * Create a canvas for rendering the image.
     * @type {HTMLCanvasElement}
     */
    const canvas = document.createElement('canvas');
    canvas.width = width;
  
    // Calculate the scaling factor and height based on the width.
    const scaleFactor = imageData.width / width;
    const height = Math.floor(imageData.height / scaleFactor);
    canvas.height = height;
  
    const context = canvas.getContext('2d');
    
    // Draw the image onto the canvas.
    context.drawImage(imageData, 0, 0, width, height);
  
    let asciiArt = '';
  
    // Convert each pixel to ASCII character.
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pixel = context.getImageData(x, y, 1, 1).data;
        const grayscale = (pixel[0] + pixel[1] + pixel[2]) / 3;
        const asciiChar = getAsciiCharacter(grayscale);
        asciiArt += asciiChar;
      }
      asciiArt += '\n';
    }
  
    return asciiArt;
  };
  
  /**
   * Gets the ASCII character corresponding to a grayscale value.
   *
   * @param {number} grayscaleValue - The grayscale value (0-255).
   * @returns {string} The corresponding ASCII character.
   */
  export const getAsciiCharacter = grayscaleValue => {
    // Characters ranging from darkest to lightest.
    const asciiCharacters = '@%#*+=-:. ';
  
    const characterIndex = Math.floor(
      (grayscaleValue / 255) * (asciiCharacters.length - 1)
    );
  
    return asciiCharacters[characterIndex];
  };
  
  // Listen for the DOMContentLoaded event.
  document.addEventListener('DOMContentLoaded', () => {
    // Get the input element for selecting an image.
    const imageInput = document.getElementById('imageInput');
    
    // Get the pre element for displaying the ASCII art.
    const asciiArtElement = document.getElementById('asciiArt');
  
    // Listen for the change event on the image input.
    imageInput.addEventListener('change', async event => {
      const selectedFile = event.target.files[0];
      if (!selectedFile) return;
  
      // Convert the selected file to an ImageBitmap.
      const imageBitmap = await createImageBitmap(selectedFile);
      
      // Convert the ImageBitmap to ASCII art and display it.
      const asciiArt = imageToAscii(imageBitmap, 100); // Adjust width as needed
      asciiArtElement.textContent = asciiArt;
    });
  });
  