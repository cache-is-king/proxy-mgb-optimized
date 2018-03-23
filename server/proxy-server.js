const newrelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const fs = require('file-system');
const path = require('path');
const axios = require('axios');
const React = require('react');
const ReactDom = require('react-dom/server');
const _ = require('underscore');

const app = express();
const port = process.env.PORT || 5005;

const URLs = {
  reviews: 'http://localhost:8081',
};

const reviewsBundle = require('../../reviews-optimized/react/dist/bundle-render');

app.use(parser.json());

app.use(express.static(path.join(__dirname, 'dist')));

const html = fs.readFileSync(path.join(__dirname, 'dist', 'ssr-template.html'), 'utf8');
const ssrTemplate = _.template(html);

app.get('/:id', (req, res) => {
  const component = React.createElement(reviewsBundle.default, { id: Number(req.params.id) });
  const str = ReactDom.renderToString(component);

  const result = ssrTemplate({ markup: str, id: Number(req.params.id) });
  res.send(result);
});

app.get('/restaurants/:id/reviews', (req, res) => {
  axios.get(`${URLs.reviews}/restaurants/${req.params.id}/reviews`)
    .then((response) => {
      res.status(response.status);
      res.send(response.data);
    })
    .catch((error) => {
      if (error.response) {
        res.status(error.response.status);
        res.send(error.response.statusText);
      } else {
        res.status(500);
        res.send('Internal Server Error');
      }
    });
});


app.listen(port, () => {
  console.log('NewRelic', newrelic.agent.config.license_key.slice(0, 10),'...');
  console.log(`listening on port ${port}`);
});
