// Nikki Heckermann

// initialize base currency for API
var extendURL = "?base="
var setBase = extendURL + document.getElementById("baseCurrencyDropdown").value;

// update base currency for API if the user changes this dropdown selection
function selectBaseCurrency() {
	var baseCurrencyList = document.getElementById("baseCurrencyDropdown");
	var activeBaseCurrency = baseCurrencyList.options[baseCurrencyList.selectedIndex].text;

	// change base on API URL
	setBase = extendURL + activeBaseCurrency;
}

// update conversion currency for rate value if the user changes this dropdown selection
function selectConversionCurrency() {
	var conversionCurrencyList = document.getElementById("conversionCurrencyDropdown");
	var activeConversionCurrency = conversionCurrencyList.options[conversionCurrencyList.selectedIndex].text;
}

// update the text headings above the input sections with the results of the calculated values
function updateHeadings() {
	document.getElementById("displayBase").innerHTML = document.getElementById("base_num").value + 
		" " + document.getElementById("baseCurrencyDropdown").value + " equals";

	document.getElementById("displayConversion").innerHTML = document.getElementById("convertTo_num").value + 
		" " + document.getElementById("conversionCurrencyDropdown").value;
}

// make calculation from the user input for base currency
function calculateFromBase(rate) {

	var baseAmt = document.getElementById("base_num").value;

	var conversionAmt = (baseAmt * rate).toFixed(2);

	// update conversion amt textfield
	document.getElementById("convertTo_num").value = conversionAmt;

	// update headings with results
	updateHeadings();
}

// make calculation from the user input for conversion currency
function calculateBackwards(rate) {

	var conversionAmt = document.getElementById("convertTo_num").value;

	var baseAmt = (conversionAmt / rate).toFixed(2);

	// update conversion amt textfield
	document.getElementById("base_num").value = baseAmt;

	// update headings with results
	updateHeadings();
}

// get data from  API 
function fetchAPI(forwards) {
	var API_URL = "https://api.exchangeratesapi.io/latest" + setBase;
	var conversionCurrency = document.getElementById("conversionCurrencyDropdown").value;

	fetch(API_URL)
		.then((response) => {
			return response.json()
		})
		.then((data) => {
			// translate JSON data to map
			var dataObjToMap = data => {
				var keys = Object.keys(data);
				var map = new Map();
				for(let i = 0; i < keys.length; i++) {
					map.set(keys[i], data[keys[i]])
				}
				return map;
				}
			
			var data_map = dataObjToMap(data);

			// update date
			var currentDate = data_map.get('date');
			document.getElementById("displayDate").innerHTML = currentDate;

			// convert object value to key value map
			var ratesObj = data_map.get('rates');
			var rates_map = dataObjToMap(ratesObj);

			// determine conversion rate from rates_map
			var conversionRate = rates_map.get(conversionCurrency)

			if (forwards === true) {
				calculateFromBase(conversionRate);
			}
			else if (forwards === false) {
				calculateBackwards(conversionRate);
			}
			else {
				// add error handling here
				console.log("Error.");
			}
		// add error handling for fetch() here
		})
}

// boolean used to determine whether we are calculating from base input or conversion input
var convertFromBase;

var base_input = document.getElementById("base_num");
	base_input.addEventListener("keyup", function(event) {
		if (event.key === "Enter") {
			// process data in text field based on updated base_input
			convertFromBase = true; 
			fetchAPI(convertFromBase);
	}})	

var convertTo_input = document.getElementById("convertTo_num");
	convertTo_input.addEventListener("keyup", function(event) {
		if (event.key === "Enter") {
			// process data in text field based on updated convertTo_input
			convertFromBase = false;
			fetchAPI(convertFromBase);
		}})

// give headings a starting value upon page landing
updateHeadings();