//@section This section is the logic for Encoding the String in 64Base.
/*
 	* This function converts the string to it's equivalent ASCII Binary.
	@param (value) the string which has to be converted.
	@param (urlSafe) is encoding URL-Safe?
	@return (result) the Binary string with the length%6 = 0.
 */

function asciiBinaryEncoder(string = "") {
	let input = string;

	if (typeof string !== "string") input = string.toString();

	let result = "";
	for (const char of input) {
		const binary = char.charCodeAt(0).toString(2);
		const zeroPadding = Array(8 - binary.length)
			.fill(0)
			.join("");

		result += zeroPadding + binary;
	}

	if (result.length % 6 != 0) {
		const zeroPadding = Array(6 - (result.length % 6))
			.fill(0)
			.join("");

		result += zeroPadding;
	}

	return result;
}

/*
 	* This function maps a number to a corresponding value according to the standard table.
	@param (value) the value which has to be mapped (max value: 63).
	@param (urlSafe) is encoding URL-Safe?
	@return (result) the mapped value.
 */
function base64EncoderMapper(value = 0, urlSafe = false) {
	const input = parseInt(value);

	if (input < 26) {
		// A-Z
		return String.fromCharCode(input + 65);
	}
	if (input >= 26 && input < 52) {
		// a-z
		return String.fromCharCode(input + 71);
	}
	if (input >= 52 && input < 62) {
		// 0-9
		return String.fromCharCode(input - 4);
	}
	if (input == 62) {
		if (urlSafe) return "-";
		else return "+";
	}
	if (input == 63) {
		if (urlSafe) return "_";
		else return "/";
	}
}

/*
	* Call this Function to encode a String in 64Base.
	@param (value) the string which you want to encode.
	@param (urlSafe) is encoding URL-Safe?
	@return (result) the 64Base Encoded value.
*/
function encode64Base(string = "", urlSafe = false) {
	let input = string;

	if (typeof string !== "string") input = string.toString();

	let result = "";
	const binaryString = asciiBinaryEncoder(input);
	const binaryLength = binaryString.length;

	for (let i = 0; i < binaryLength / 6; i++) {
		let slicedBinary = binaryString.slice(6 * i, 6 * (i + 1));

		const intValue = parseInt(slicedBinary, 2);
		const asciiValue = base64EncoderMapper(intValue, urlSafe);

		result += asciiValue;
	}

	if (result.length % 4 != 0) {
		const padding = Array(4 - (result.length % 4))
			.fill(urlSafe ? "*" : "=")
			.join("");
		result += padding;
	}

	return result;
}

//@section

//@section This section is the logic for Decoding the String in 64Base.
/*
 	* This function converts back the character to corresponding ASCII value according to the standard table.
	@param (value) the character which has to be mapped.
	@param (urlSafe) is input string URL-Safe?
	@return (result) the converted value if it is a valid character, else Throw Error.
 */
function base64DecoderMapper(value = "", urlSafe = false) {
	const input = value.toString();

	if (input >= "A" && input <= "Z") {
		return input.charCodeAt(0) - 65;
	}
	if (input >= "a" && input <= "z") {
		return input.charCodeAt(0) - 71;
	}
	if (input >= "0" && input <= "9") {
		return input.charCodeAt(0) + 4;
	}
	if (input === "-") {
		return 62;
	}
	if (input === "+" && !urlSafe) {
		return 62;
	}
	if (input === "_" && urlSafe) {
		return 63;
	}
	if (input === "/" && !urlSafe) {
		return 63;
	}
	if (input === "*" && urlSafe) {
		return -1;
	}
	if (input === "=" && !urlSafe) {
		return -1;
	}

	throw new Error('Invalid Character "' + input + '"');
}

/*
	* This function converts the string to it's equivalent ASCII Binary.
	@param (value) the string which has to be converted.
	@param (urlSafe) is input string URL-Safe.
	@return (result) the Binary string with the length%6 = 0.
*/
function asciiBinaryDecoder(string = "", urlSafe = false) {
	let input = string;

	if (typeof string !== "string") input = string.toString();

	let result = "";
	for (const i of input) {
		var temp = base64DecoderMapper(i, urlSafe);
		if (temp == -1) break;
		temp = temp.toString(2);

		for (let i = temp.length; i < 6; i++) {
			temp = "0" + temp;
		}

		result = result + temp;
	}

	return result;
}

/*
	* Call this Function to decode a 64Base string.
	@param (value) the string which you want to decode.
	@param (urlSafe) is input string URL-Safe?
	@return (result) the decoded value.
*/
function decode64Base(string = "", urlSafe = false) {
	let input = string;

	if (typeof string !== "string") input = string.toString();

	let result = "";

	// console.log("input str => ", input);

	const binaryString = asciiBinaryDecoder(input, urlSafe);
	const binaryLength = binaryString.length;

	for (let i = 0; i < parseInt(binaryLength / 8); i++) {
		let slicedBinary = binaryString.slice(8 * i, 8 * (i + 1));

		const intValue = parseInt(slicedBinary, 2);
		const asciiValue = String.fromCharCode(intValue);

		result += asciiValue;
	}

	return result;
}
//@section

/**
 *
 *	* This is a 64base converter, it converts a Decimal number to a 64Base number.
 * 	* This is not same as the 64Base Encoder, it just converts number to a URL safe number.
	@param (number) the number which has to converted.
	@return (result) The URL-Safe 64Base number.
 */
function to64Base(number) {
	let result = "";

	while (number) {
		let temp = parseInt(number % 64);

		if (temp > 9) {
			if (temp < 36)
				result = String.fromCharCode(temp + 87) + result;
			else {
				if (temp < 62)
					result = String.fromCharCode(temp + 29) + result;
				else result = String.fromCharCode(temp - 20) + result;
			}
		} else result = temp + result;

		number = parseInt(number / 64);
	}

	if (result === "") result = "0";

	return result;
}

// @section This section is useful when a batch script is written.
const args = process.argv;

if (args[2] === "encode") {
	console.log("\n" + encode64Base(args[3]));
}
if (args[2] === "decode") {
	console.log("\n" + decode64Base(args[3]));
}
