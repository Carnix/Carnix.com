/**
 * Event listener that triggers when the window has loaded.
 * Initializes tracking and user consent management.
 */
window.addEventListener('load', () => {
    // Check if user hasn't opted out of tracking
    if (localStorage.getItem('optout') !== 'true') {
        // Create and append Google Analytics script
        const gaScript = document.createElement('script');
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-C6WJMPH8E1';
        document.body.append(gaScript);

        // Initialize Google Analytics tracking
        window.dataLayer = window.dataLayer || [];
        /**
         * Pushes tracking data to the Google Analytics data layer.
         * @param {...*} args - Tracking arguments to push.
         */
        const gtag = (...args) => dataLayer.push(args);
        gtag('js', new Date());
        gtag('config', 'G-C6WJMPH8E1');
    }

    /**
     * Manages user consent and corresponding UI elements.
     */
    const consentCheck = (() => {
        const optOutLink = document.getElementById('optout');
        const optInLink = document.getElementById('optin');

        const optinString = document.getElementById('optinstring');
        const optoutString = document.getElementById('optoutstring');

        // Show appropriate UI based on user's consent choice
        if (localStorage.getItem('optout') === 'true') {
            optinString.classList.remove('hide');
            optinString.classList.add('show');
        } else {
            optoutString.classList.remove('hide');
            optoutString.classList.add('show');
        }

        // Event listener for opting out
        optOutLink.addEventListener('click', () => {
            localStorage.setItem('optout', true);
        });

        // Event listener for opting in
        optInLink.addEventListener('click', () => {
            localStorage.removeItem('optout');
        });
    })();

    /**
     * Placeholder for the showMunch function.
     * @param {Event} event - The event triggering the function.
     */
    const showMunch = event => {
        // Implementation of showMunch function goes here
    };

    // Log a message to the console
    console.log('[carnix@localhost]$ grep -r fks * 2> /dev/null');
    console.log('[carnix@localhost]$');
});

try {
    // Event listener for clicking the sadface SVG
    document.getElementById('sadface-svg').addEventListener('click', event => {
        const target = event.target;
        const showElement = document.getElementById('munch-container');
        const hideElement = document.getElementById('sadface-container');

        // Show the Munch container and hide the sadface container
        showElement.classList.remove('hide');
        showElement.classList.add('show');

        hideElement.classList.remove('show');
        hideElement.classList.add('hide');
    });
} catch (error) {
    // Handle any errors that might occur
}