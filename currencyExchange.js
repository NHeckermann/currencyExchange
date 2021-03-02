// Nikki Heckermann

// store API data
var ratesData = fetchAPI().then(function(results){
	// access results here by chaining to the returned promise
	ratesData = convertData(results);

	// give all fields a starting value upon page landing
	calculateConversion(1);
	updateHeadings();
});	


// get data from  API 
function fetchAPI() {
	return fetch("https://api.exchangeratesapi.io/latest")
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			// console.log(data);
			return data;
		})
		.catch((error) => {
			console.warn("Error: Could not connect to API.");
		})
	}


// get map of conversion rates and populate dropdown lists
function convertData(data) {

	var baseCurrencyList = document.getElementById('baseCurrencyDropdown');
	var conversionCurrencyList = document.getElementById('conversionCurrencyDropdown');

	// translate JSON data to map
	var dataObjToMap = data => {
		var keys = Object.keys(data);
		var map = new Map(); //new Map([...map.entries()].sort());
		var baseOption;
		var currencyOption;

		for(let i = 0; i < keys.length; i++) {
			// populate map
			map.set(keys[i], data[keys[i]])
			
			// populate the currency selection dropdown lists from the API data
				// account for base currency not listed in rates
			if (keys[i] === 'base') {
				baseOption = document.createElement('option');
				baseOption.text = data[keys[i]];
				baseCurrencyList.add(baseOption);

				currencyOption = document.createElement('option');
				currencyOption.text = data[keys[i]];
				conversionCurrencyList.add(currencyOption);
			}

				// ensure only keys in rates object are listed
			if (keys.length > 3) {
				baseOption = document.createElement('option');
				baseOption.text = keys[i];
				baseCurrencyList.add(baseOption);

				currencyOption = document.createElement('option');
				currencyOption.text = keys[i];
				conversionCurrencyList.add(currencyOption);
			}
		}
		return map;
	}
	
	var data_map = dataObjToMap(data);

	// update date
	var currentDate = data_map.get('date');
	document.getElementById("displayDate").innerHTML = currentDate;

	// convert object value to key value map
	var rates_map = dataObjToMap(data_map.get('rates'));

	// sort the the currency selection dropdown lists
  	sortList("baseCurrencyDropdown");
  	sortList("conversionCurrencyDropdown");

	// set the default values of the dropdown lists
	setDropDownDefault("USD", baseCurrencyList);
	setDropDownDefault("EUR", conversionCurrencyList);

	return rates_map;
}


// sort the dropdown lists alphabetically
function sortList(dropdownListID) {
	var list, i, switching, b, shouldSwitch;
	list = document.getElementById(dropdownListID);
	switching = true;
	// continue until no switching occurs
	while (switching) {
		switching = false;
	  	b = list.getElementsByTagName("option");

		for (i = 0; i < (b.length - 1); i++) {
			shouldSwitch = false;
		// check if the next item should switch places with the current item
		if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
			/* if next item is alphabetically
			lower than current item, mark as a switch
			and break the loop: */
			shouldSwitch = true;
			break;
		}
	  }
	  	if (shouldSwitch) {
			/* if a switch has been marked, make the switch
			and mark the switch as done: */
			b[i].parentNode.insertBefore(b[i + 1], b[i]);
			switching = true;
	  	}
	}
}


// set the default values for the dropdown lists
function setDropDownDefault(defaultCurrency, dropdownList) {
	for(var i, j = 0; i = dropdownList.options[j]; j++) {
		if(i.value == defaultCurrency) {
			dropdownList.selectedIndex = j;
			break;
		}	
	}
}


// get the conversion rate from the rates map unless currency matches base units
function getConversionRate(conversionCurrency) {
	if (conversionCurrency === "EUR") {
		return 1;
	}
	else {
		return ratesData.get(conversionCurrency);
	}
}


// convert currency from input
function calculateConversion(textfield) {

	// use input from first textfield/dropdown to update info in second textfield
	if (textfield === 1) {
		rate = getConversionRate(document.getElementById("baseCurrencyDropdown").value);

		var baseAmt = document.getElementById("base_num").value;

		var inEuros = baseAmt / rate;

		rate = getConversionRate(document.getElementById("conversionCurrencyDropdown").value);

		var conversionAmt = (inEuros * rate).toFixed(2);

		// update conversion amt textfield
		document.getElementById("convertTo_num").value = conversionAmt;
	}
	// use input from second textfield/dropdown to update info in first textfield
	else if (textfield === 2) {
		rate = getConversionRate(document.getElementById("conversionCurrencyDropdown").value);

		var conversionAmt = document.getElementById("convertTo_num").value;
		
		var inEuros = conversionAmt / rate;
		
		rate = getConversionRate(document.getElementById("baseCurrencyDropdown").value);
		
		var baseAmt = (inEuros * rate).toFixed(2);

		// update conversion amt textfield
		document.getElementById("base_num").value = baseAmt;
	}
	else {
		console.log("Error, base textfield undefined.")
	}

	// update headings with results
	updateHeadings();
}


// update the text headings above the input sections with the results of the calculated values
function updateHeadings() {
	document.getElementById("displayBase").innerHTML = document.getElementById("base_num").value + 
		" " + document.getElementById("baseCurrencyDropdown").value + " equals";

	document.getElementById("displayConversion").innerHTML = document.getElementById("convertTo_num").value + 
		" " + document.getElementById("conversionCurrencyDropdown").value;
}


// event listeners for updated input
var base_input = document.getElementById("base_num");
	base_input.addEventListener("keyup", function(event) {
		if (event.key === "Enter") {
			// process data in text field based on updated base_input
			calculateConversion(1);
	}})	

var convertTo_input = document.getElementById("convertTo_num");
	convertTo_input.addEventListener("keyup", function(event) {
		if (event.key === "Enter") {
			// process data in text field based on updated convertTo_input
			calculateConversion(2);
		}})