const newrelic = require('newrelic');
const express = require('express');
const parser = require('body-parser');
const _ = require('underscore');
const fs = require('file-system');
const path = require('path');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 5005;

const URLs = {
  reviews: 'http://localhost:8081',
};

app.use(parser.json());

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'dist', 'template.html'), 'utf8', (err, html) => {
    const template = _.template(html);
    const result = template({ id: req.params.id });
    res.send(result);
  });
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
  console.log(newrelic);
  console.log(`listening on port ${port}`);
});
