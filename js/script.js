window.addEventListener('load', event => {

	if(localStorage.getItem('optout') !== 'true'){

		const gaScript = document.createElement('script');

		gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-C6WJMPH8E1';
		document.body.append(gaScript);

		window.dataLayer = window.dataLayer || [];
		function gtag(){dataLayer.push(arguments);}
		gtag('js', new Date());
		gtag('config', 'G-C6WJMPH8E1');

	}


	const consentCheck = ( _ => {

		const optOutLink = document.getElementById('optout')
		const optInLink = document.getElementById('optin')

		if(localStorage.getItem('optout') === 'true'){
			document.getElementById('optinstring').classList.remove('hide')
			document.getElementById('optinstring').classList.add('show');
		}
		else{
			document.getElementById('optoutstring').classList.remove('hide')
			document.getElementById('optoutstring').classList.add('show');
		}

		optOutLink.addEventListener('click', event => {
			localStorage.setItem('optout', true);
		});

		optInLink.addEventListener('click', event => {
			localStorage.removeItem('optout');
		});

	})();


	const showMunch = (event) => {

	}


});

try{
	document.getElementById('sadface-svg').addEventListener('click', event => {
		const target = event.target;
		const showElement = document.getElementById('munch-container');
		const hideElement = document.getElementById('sadface-container');

		showElement.classList.remove('hide');
		showElement.classList.add('show');

		hideElement.classList.remove('show');
		hideElement.classList.add('hide');


	});
}catch(error){}