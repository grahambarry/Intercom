const url = require('../getCustomersWithinRadius.js')

let customerObjectsArray = ['{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"},{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}'];

let dataAfterjsonifyBracketsData = '[{"latitude": "52.986375", "user_id": 12, "name": "Christina McArdle", "longitude": "-6.043701"},{"latitude": "51.92893", "user_id": 1, "name": "Alice Cahill", "longitude": "-10.27699"}]'

test('HaversineFormula Function - should return TRUE because Coords are within 100km withinRadius', () => {
	expect(url.HaversineFormula(53.2451022, -6.238335)).toBe(true);
});

test('HaversineFormula Function - should return FALSE because Coords are NOT within 100km withinRadius', () => {
	expect(url.HaversineFormula(51.8856167, -10.4240951)).toBe(false);
});

test('toRadians Function 5 Degrees to Radians is 0.08726646259971647', () => {
	expect(url.toRadians(5)).toBe(0.08726646259971647);
});

test('toRadians Function to output a number', () => {
	expect(url.toRadians(5)).toBeDefined();
});

test('toRadians Function -53.32344 toRadians should be -0.9306695964896451', () => {
	expect(url.toRadians(-53.32344)).toBe(-0.9306695964896451);
});

test('jsonifyBracketsData Function - data input should match sample data output adding [] around data', () => {
	const customerObjectsToJson = url.jsonifyBracketsData(customerObjectsArray.join());
		expect(customerObjectsToJson).toMatch(dataAfterjsonifyBracketsData);
});