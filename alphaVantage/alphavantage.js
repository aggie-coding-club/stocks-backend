const axios = require("axios");
const utils = require("./utils");

module.exports = class alphaVantage {
	constructor(key) {
		this.key = key;
	}

	getStockQuote = async (symbol) => {
		let uri = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.key}`;
		let data = await axios
			.get(uri)
			.then((res) => {
				return res.data["Global Quote"];
			})
			.catch((err) => {
				console.log(err);
				return {};
			});

		if ("05. price" in data) {
			const price = data["05. price"];
			return price;
		} else {
			return 0;
		}
	};

	getStockInfo = async (keyword) => {
		let uri = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keyword}&apikey=${this.key}`;
		let data = await axios
			.get(uri)
			.then((res) => {
				return res.data["bestMatches"][0];
			})
			.catch((err) => {
				console.log(err);
				return {};
			});

		if ("1. symbol" in data) {
			const info = { symbol: data["1. symbol"], name: data["2. name"] };
			return info;
		} else {
			return "No data found";
		}
	};

	// The whole command to get data regarding a stock for the frontend
	getStockData = async (symbol) => {
		let uri = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=full&apikey=${this.key}`;
		let timeCoordinates = await axios
			.get(uri)
			.then((res) => {
				const timeSeries = res.data["Time Series (5min)"];
				const metaData = res.data["Meta Data"];

				// start and end times based on nyse opening and closing hours in EST
				const startTime = metaData["3. Last Refreshed"]
					.split(" ")[0]
					.concat(" 09:30:00");

				// making the top time end to be 4pm or earlier if day not complete yet
				let endTime = startTime.split(" ")[0].concat(" 16:00:00");

				endTime =
					endTime > metaData["3. Last Refreshed"]
						? metaData["3. Last Refreshed"]
						: endTime;

				const timeCoordinates = utils.extractAlphavantageDayCoordinates(
					timeSeries,
					startTime,
					endTime
				);

				return timeCoordinates;
			})
			.catch((err) => {
				console.log(err);
				return {};
			});

		// acquiring meta data for the stock
		const stockInfo = await this.getStockInfo(symbol);
		const title = stockInfo["name"];
		const currentValue = await this.getStockQuote(symbol);

		const data = {
			[symbol]: {
				data: timeCoordinates,
				title,
				currentValue,
			},
		};

		return data;
	};
};
