window.addEventListener('load', event => {

	const consentCheck = () => {

		const optOutLink = document.getElementById('optout')
		const optInLink = document.getElementById('optin')

		if(localStorage.getItem('optout') === 'true'){
			document.getElementById('optinstring').style.display = 'block';
		}
		else{
			document.getElementById('optoutstring').style.display = 'block';
		}

		optOutLink.addEventListener('click', event => {
			localStorage.setItem('optout', true);
		});

		optInLink.addEventListener('click', event => {
			localStorage.removeItem('optout');
		});

	}



    if(localStorage.getItem('optout') !== 'true'){

		const gaScript = document.createElement('script');

		gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-C6WJMPH8E1';
        document.body.append(gaScript);
    
		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-C6WJMPH8E1');

    }



    consentCheck();

})

