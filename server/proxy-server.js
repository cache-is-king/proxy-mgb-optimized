const express = require('express');
const parser = require('body-parser');
const _ = require('underscore');
const fs = require('file-system');
const path = require('path');

const app = express();

app.use(parser.json());

app.use(express.static(path.join(__dirname, 'dist')));
app.get('/:id', (req, res) => {
  fs.readFile(path.join(__dirname, 'dist', 'template.html'), 'utf8', (err, html) => {
    const template = _.template(html);
    const result = template({ id: req.params.id });
    res.send(result);
  });
});
const port = process.env.PORT || 5005;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
