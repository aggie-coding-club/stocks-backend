const axios = require("axios");

module.exports = class alphaVantage {
	constructor(key) {
		this.key = key;
	}

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
};
