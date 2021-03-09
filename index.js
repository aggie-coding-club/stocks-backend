const express = require("express");
const dotenv = require("dotenv");
const logger = require("./logger.js");
const alphavantage = require("./alphavantage.js");

// load config
dotenv.config({ path: "./config.env" });

const app = express();
// Specify your PORT in the config.env file;
const PORT = process.env.PORT || 5000;

// set up alphavantage api
const KEY = process.env.API_KEY || "demo";
const stocksApi = new alphavantage(KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// initialize middleware
app.use(logger);

app.get("/", (req, res) => {
	res.send("howdy");
});

app.get("/stocks", async (req, res) => {
	// each request has a parameter called query that holds eveything from ? in the url
	// query must have one param - symbol
	if (typeof req.query.symbol === "string") {
		const symbol = req.query.symbol;
        const results = await stocksApi.getStockInfo(symbol);
        res.send(results);
	} else {
		res.status(400).send("please add query param for symbol");
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
