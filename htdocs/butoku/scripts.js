(function(){
	var store = {};
	var get = function(url){
		var output, xhr = new XMLHttpRequest();

		xhr.open('GET', 'app.php');
		xhr.onload = function(){
			if (xhr.status === 200){
				store.response = xhr.responseText;
				console.log('get>output:', store.response);
			}
			else{
				output = xhr.status;
				console.log('get>output.error:', store.response);
			}

			console.log('get>dataToDisplay:', store.response);
			processData(store.response);
		};

		xhr.send();
	};

	var processData = function(data){
		console.log('processData>data:', data);
		var output, json = JSON.parse(data);
		console.log('processData>json.results:', json.results);

		for (var i=0; i<json.results.length; i++) {
			displayData(json.results[i]);
		}
	};

	var displayData = function(obj){
		var tmpl = document.querySelector('section#template > div.aikidoka').cloneNode(true);
		console.log(obj.name,obj.count);
		tmpl.querySelector(".name").innerHTML = obj.name;
		tmpl.querySelector(".count").innerHTML = obj.count;

		document.querySelector('section#record').appendChild(tmpl);
	};

	addTokens = function(){

	};

	var getData = function(){
		var output = get('app.php');
	};

	var dataToDisplay = getData();

})();