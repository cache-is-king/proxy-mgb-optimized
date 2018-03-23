const newrelic = require('newrelic');
const dotenv = require('dotenv');
const http = require('http');
const mime = require('mime-types');
const fs = require('file-system');
const path = require('path');
const axios = require('axios');
const React = require('react');
const ReactDom = require('react-dom/server');
const _ = require('underscore');
const reviewsBundle = require('../../reviews-optimized/react/dist/bundle-render');

dotenv.config();

const port = process.env.PORT || 5005;

const URLs = {
  reviews: process.env.REVIEWS_URL,
};

const html = fs.readFileSync(path.join(__dirname, 'dist', 'ssr-template.html'), 'utf8');
const ssrTemplate = _.template(html);

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(404);
    res.end();
  } else if (req.url.startsWith('/restaurants/')) {
    // handle ajax call for restaurant reviews
    const [, , id, component] = req.url.split('/');
    console.log(`GET ${component} to ${URLs.reviews}/restaurants/${id}/reviews`);
    axios.get(`${URLs.reviews}/restaurants/${id}/reviews`)
      .then((response) => {
        res.writeHead(response.status, {
          'Content-Type': 'application/json',
        });
        res.end(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error, 'Error');
        res.statusCode = error.response ? error.response.status : 500;
        const errMsg = error.response ? error.response.statusText : 'Internal Server Error';
        res.end(errMsg);
      });
  } else if (req.url.match(/\/\d+$/)) {
    // if a restaurant ID is requested,
    const id = Number(req.url.slice(1));

    const component = React.createElement(reviewsBundle.default, { id });
    const markup = ReactDom.renderToString(component);

    const result = ssrTemplate({ id, markup });
    res.statusCode = 200;
    res.end(result);
  } else {
    // else, try to serve static file
    const reqFile = req.url.slice(1) !== '' ? req.url.slice(1) : 'index.html';
    const filename = path.join(__dirname, 'dist', reqFile);

    fs.readFile(filename, (err, data) => {
      if (err) {
        console.log(err);
        res.statusCode = 404;
        res.end('404 Not Found');
      } else {
        res.writeHead(200, {
          'Content-Type': mime.lookup(filename),
        });
        res.end(data);
      }
    });
  }
});

server.listen(port, () => {
  console.log('NewRelic', newrelic.agent.config.license_key.slice(0, 10),'...');
  console.log(`listening on port ${port}`);
});
