
//-- Variables
	let url = 'https://gist.githubusercontent.com/brianw/19896c50afa89ad4dec3/raw/6c11047887a03483c50017c1d451667fd62a53ca/gistfile1.txt';

	let withinRadiusOf = 100000;
	let intercomCoords = {name: "Intercom", city: "Dublin", latitude: 53.339428, longitude: -6.257664};
	let intercomDublinCoords = {name: "Intercom", city: "Dublin", latitude: 53.339428, longitude: -6.257664};
	let intercomChicagoCoords = {name: "Intercom", city: "Chicago", latitude: 41.8828113, longitude: -87.6575928};

	let lat1 = 53.339428;
	let lon1 = -6.257664;

//-----------------------------------------------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------//

//-- Retrieve Txt Data From url
	async function request(url) {
		try {
	    let result = await fetch(url);
	    	let data = await result.text();
				return data;
					} catch(err) {
	    			// catches errors both in fetch and result
						alert(err);
  					}
	};
	 
//-- Adds Brackets[] in a step to Jsonify data
	function jsonifyBracketsData(data) {
		const datamod = "["+data+"]";
			return datamod;
	};

//-- SplitDataBy splits data by a REGEX seperator such as newline or carriage return and returns Array of objects
	function splitDataBy(data, separator) {
		var arrayOfSplitBySeparator = data.split(separator);
			return arrayOfSplitBySeparator;
	};

//-- Makes Url Request, Jsonifys retrieved data and in a step Jsonifys(adds commas through .join)
	async function parseToJson(url) {
	    const result = await request(url); // Calls request
		    const newLineSeparator = /\r?\n/;
		    	const customerObjectsArray = splitDataBy(result, newLineSeparator);// Calls SplitDataBy - Splits Objects by NewLine 
					const customerObjectsToJson = jsonifyBracketsData(customerObjectsArray.join()); // Calls jsonifyBracketsData - Joins Array adding commas as well as brackets[]
						var obj = JSON.parse(customerObjectsToJson);
							return obj;
	};

//-- Check if distance is withinRadius of Interated Point which is fed in via customerIsWithinRadius();
	function HaversineFormula(lat2, lon2){
		let R = 6371e3; // metres
			let angle1 = toRadians(lat1);
				let angle2 = toRadians(lat2);
					let deltaLatitude = toRadians(lat2-lat1);
						let deltaLongitude = toRadians(lon2-lon1);

			let a = Math.sin(deltaLatitude/2) * Math.sin(deltaLatitude/2) +
	        	Math.cos(angle1) * Math.cos(angle2) *
	        		Math.sin(deltaLongitude/2) * Math.sin(deltaLongitude/2);
						let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
							let d = R * c;

				if(d < withinRadiusOf) {
					return true;
				}
				else {
					return false;
				};
	};

//-- Convert Angle to Radians
	function toRadians(degrees){
		var pi = Math.PI;
			return degrees * (pi/180);
	};

/* Retrieves the Jsonified customers object and runs a loop which checks whether 
	individual customers are withinRadius and pushes to customersThatAreWithinRadius Array */
	async function isCustomerWithinRadius(url, withinRadiusOf) {
		const customers = await parseToJson(url);
			let customersThatAreWithinRadius = [];
				for (let i = 0; i < customers.length; i++) {
					customerDistance = HaversineFormula(customers[i].latitude, customers[i].longitude);
						if (customerDistance === true){
							customersThatAreWithinRadius.push(customers[i]);
						};
				};
								return customersThatAreWithinRadius;
	};

//-- Sort By user_id
	function sortByUserId(object){
		let sortableObject = object;
			sortableObject.sort(function (a, b) {
    			return a.user_id - (b.user_id);
					});
						return sortableObject
	};

//-- Constructors and Setters
	async function returnCustomersWithinRadiusSorted(url, withinRadiusOfInput, lat1Intercom, lon1Intercom) {
		const withinRadiusOf = withinRadiusOfInput;
			lat1 = lat1Intercom;
				lon1 = lon1Intercom;
					const unsortedCustomersWithinRadius = await isCustomerWithinRadius(url, withinRadiusOfInput); 
						const sortedCustomersWithinRadius = sortByUserId(unsortedCustomersWithinRadius);
							document.getElementById("json").innerHTML = JSON.stringify(sortedCustomersWithinRadius, undefined, 2);
								return sortedCustomersWithinRadius;
	};

//-- Create Arrays for Google Maps Function
	async function setMapMarkersAndDetails() {
		const customersWithinRadius = await returnCustomersWithinRadiusSorted(url, withinRadiusOf, Number(intercomCoords.latitude), Number(intercomCoords.longitude), intercomCoords);
			let intercomSelected = intercomCoords;
				let intercomSelectedArray = [intercomSelected.name + ' ' + ' ' + intercomSelected.city, Number(intercomSelected.latitude), Number(intercomSelected.longitude)];
					let markersIndividual = [];
						let infoIndividual = [];
							let markers = [];
								let infoWindowContent = [];
									markers.push(intercomSelectedArray);
										infoWindowContent.push(['<div class="info_content">' + '<h3>' 
	    									+ intercomSelected.name + '</h3>' + '<p>' 
	    										+ intercomSelected.city + '</p>' + '</div>']);
													let joinedMarkerAndInfoArrays = [];
			//Loop To Create Map Marker Array as well as Marker Information Array of HTML
			for( i = 0; i < customersWithinRadius.length; i++ ) {
	    		markersIndividual.push(customersWithinRadius[i].name, 
	    									Number(customersWithinRadius[i].latitude), 
	    										Number(customersWithinRadius[i].longitude));

	    		//Create Html For when Map Marker Information is clicked
	    		infoIndividual.push('<div class="info_content">' + '<h3>' 
	    									+ customersWithinRadius[i].name + '</h3>' + '<p>' 
	    										+ String(customersWithinRadius[i].user_id) + '</p>' + '</div>'); 
		    										markers.push(markersIndividual.concat());
		    											infoWindowContent.push(infoIndividual.concat());
		    												markersIndividual = [];
		    													infoIndividual = [];
				}
																	joinedMarkerAndInfoArrays.push(markers, infoWindowContent)
																		return joinedMarkerAndInfoArrays;
																		
	};
//-- User Inputs which Re-Initialize and Run App
	function distanceUserInput(val) {
		withinRadiusOf = val * 1000;
			run();
	};

	function choose(choice){
		intercomCoords = choice;
			$('button').on('click', function(){
    			$('button').removeClass('selected');
    				$(this).addClass('selected');
			});
						run();
	}


// -----------------------------------------  MODULE EXPORTS  ------------------------------  //

//--Module Export VARIABLES
module.exports = {url: url,
					distanceUserInput: distanceUserInput,
						choose: choose, 
							withinRadiusOf: withinRadiusOf, 
								intercomCoords: intercomCoords, 
									intercomChicagoCoords: intercomChicagoCoords,
										lat1: lat1,
											lon1: lon1,
												intercomDublinCoords: intercomDublinCoords,
													setMapMarkersAndDetails: setMapMarkersAndDetails}

//-- Module Exports Functions and Async Functions
module.exports = {setMapMarkersAndDetails: setMapMarkersAndDetails,
					request: request,
						jsonifyBracketsData: jsonifyBracketsData,
							splitDataBy: splitDataBy,
								parseToJson: parseToJson,
									HaversineFormula: HaversineFormula,
										toRadians: toRadians,
											isCustomerWithinRadius: isCustomerWithinRadius,
												sortByUserId: sortByUserId,
													returnCustomersWithinRadiusSorted: returnCustomersWithinRadiusSorted,}

//-- Modifiable Control Variables
module.exports.intercomChicagoCoords = intercomChicagoCoords;
module.exports.distanceUserInput = distanceUserInput;
module.exports.choose = choose;
module.exports.intercomDublinCoords = intercomDublinCoords;



