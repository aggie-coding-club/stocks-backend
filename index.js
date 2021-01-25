const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");
const alphavantage = require("./alphaVantage/alphavantage");

// Load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
// Specify your PORT in the config.env file;
// NOTE: if you are running the frontend simultaneouly, they must be different port numbers
// Suggestion is to use PORT = 3001 in backend config.env file
const PORT = process.env.PORT || 5000;

//  set up alphavantage api
const KEY = process.env.API_KEY || "demo";
const stocksApi = new alphavantage(KEY);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//init middleware
app.use(logger);

const path = require("path");
// FIXME(nhwn): this assumes the build directory is already populated (i.e.
// `npm run-script build` has already been run in stocks-frontend); we should
// probably check to see if the files actually exist or not
const buildPath = path.join(__dirname, "stocks-frontend", "build");

app.use(express.static(buildPath));

app.get("/", (req, res) => {
	res.sendFile(path.join(buildPath, "index.html"));
});

app.get("/stocks", (req, res) => {
	// each request has a parameter called query that holds eveything from ? in the url
	// query must have one param - symbol
	if (typeof req.query.symbol === "string") {
		let symbol = req.query.symbol;
		stocksApi.getStockData(symbol).then((results) => {
			res.send(results);
		});
	} else {
		res.status(400).send("please add query param for symbol");
	}
});

// TODO(shreyshah33): Add /cron endpoints

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
