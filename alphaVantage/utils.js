const moment = require("moment");

// Extracts intraday data from json to frontend parsable state.
/**
 * @param {Object} data - Intraday data from AlphaVantage
 * @param {String} start - Starting point for datetime
 * @param {String} end - Ending point for datetime
 * @param {String} [format] - Format to the datetime strings for moment
 * @param {Integer} [diff] - Time difference in mins between each endpoints
 */
exports.extractAlphavantageDayCoordinates = (
	data,
	start,
	end,
	format = "YYYY-MM-DD HH:mm:ss",
	diff = 5
) => {
	let startTime = moment(start);
	let endTime = moment(end);
	let coordinates = [];

	while (moment(startTime).isSameOrBefore(moment(endTime))) {
		let coordinate = {};
		let startTimeStr = moment(startTime).format(format);
		if (typeof data[startTimeStr] === "object") {
			coordinate.y = data[startTimeStr]["4. close"];
			coordinate.x = startTimeStr;
			coordinates.push(coordinate);
		}

		startTime = moment(startTime).add(diff, "minutes");
	}
	return coordinates;
};
