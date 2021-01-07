const express = require('express')
const app = express();
// FIXME(nhwn): should this be an environment variable?
const port = 3000;
const path = require('path');
// FIXME(nhwn): this assumes the build directory is already populated (i.e. 
// `npm run-script build` has already been run in stocks-frontend); we should
// probably check to see if the files actually exist or not
const buildPath = path.join(__dirname, 'stocks-frontend', 'build')

app.use(express.static(buildPath));

app.get('/', (request, response) => {
  response.sendFile(path.join(buildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
