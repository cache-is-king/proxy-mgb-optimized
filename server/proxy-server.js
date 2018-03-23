const newrelic = require('newrelic');
const dotenv = require('dotenv');
const http = require('http');
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
    const id = req.url.split('/')[2];
    console.log(`GET to ${URLs.reviews}/restaurants/${id}/reviews`);
    axios.get(`${URLs.reviews}/restaurants/${id}/reviews`)
      .then((response) => {
        res.statusCode = response.status;
        res.end(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error, 'Error');
        if (error.response) {
          res.statusCode = error.response.status;
          res.end(error.response.statusText);
        } else {
          res.statusCode = 500;
          res.end('Internal Server Error');
        }
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

  }
});

server.listen(port, () => {
  console.log('NewRelic', newrelic.agent.config.license_key.slice(0, 10),'...');
  console.log(`listening on port ${port}`);
});
