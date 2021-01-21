const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");
const connectDB = require("./config/db");

// Load config
dotenv.config({ path: "./config/config.env" });

connectDB();

const app = express();
// Specify your PORT in the config.env file;
// NOTE: if you are running the frontend simultaneouly, they must be different port numbers
// Suggestion is to use PORT = 3001 in backend config.env file
const PORT = process.env.PORT || 5000;

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
	// each request has a parameter called query that hols eveything from ? in the url
	// query must have one of the 2 params - name, symbol
	if (req.query && req.query != {}) {
		let query = req.query;
		let symbol, name;
		if ("name" in query) {
			name = query.name;
			res.send({ name, symbol });
		} else if ("symbol" in query) {
			symbol = query.symbol;
			res.send({ name, symbol });
		} else {
			res.status(400).send("please add query params for name or symbol");
		}
	} else {
		res.status(400).send("please add query params for name or symbol");
	}
});

app.listen(PORT, () => {
	console.log(`Example app listening at http://localhost:${PORT}`);
});
