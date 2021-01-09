const express = require("express");
const dotenv = require("dotenv");
const logger = require("./middleware/logger");

// Load config
dotenv.config({ path: "./config/config.env" });

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

app.get("/", (request, response) => {
  response.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
