/**
 * Event listener that triggers when the window has loaded.
 * Initializes tracking and user consent management.
 * @listens window#load
 */
window.addEventListener('load', () => {

    /**
     * Implements Google Analytics
    
    if (localStorage.getItem('optout') !== 'true') {
        const gaScript = document.createElement('script');
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-C6WJMPH8E1';
        document.body.append(gaScript);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-C6WJMPH8E1');
    }
    */
  
    /**
     * Manages user consent and corresponding UI elements.
     * @function
     */
    const consentCheck = (() => {
      const optOutLink = document.getElementById('optout');
      const optInLink = document.getElementById('optin');
  
      const optinString = document.getElementById('optinstring');
      const optoutString = document.getElementById('optoutstring');
  
      if (localStorage.getItem('optout') === 'true') {
        optinString.classList.remove('hide');
        optinString.classList.add('show');
      } else {
        optoutString.classList.remove('hide');
        optoutString.classList.add('show');
      }
  
      optOutLink.addEventListener('click', () => {
        localStorage.setItem('optout', true);
      });
  
      optInLink.addEventListener('click', () => {
        localStorage.removeItem('optout');
      });
    })();
  
  console.log('[carnix@localhost]$ grep -r fks * 2> /dev/null');
  console.log('[carnix@localhost]$');
});
