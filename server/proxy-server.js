const newrelic = require('newrelic');
const dotenv = require('dotenv');
const http = require('http');
const mime = require('mime-types');
const fs = require('file-system');
const path = require('path');
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');
const React = require('react');
const ReactDom = require('react-dom/server');
const _ = require('underscore');

const reviewsBundle = require('../../reviews-optimized/react/dist/bundle-render');

dotenv.config();

const port = process.env.PORT || 5005;
const REDIS_LIFETIME = 60; // seconds, lifetime of redis key

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient();

const URLs = {
  reviews: process.env.REVIEWS_URL,
};

const statistics = {
  cacheHit: 0,
  cacheMiss: 0,
  axiosCalls: 0,
};

const lookupCount = {};

const html = fs.readFileSync(path.join(__dirname, 'dist', 'ssr-template.html'), 'utf8');
const ssrTemplate = _.template(html);

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(404);
    res.end();
  } else if (req.url.startsWith('/restaurants/')) {
    // handle ajax call for restaurant reviews
    const [, , id, component] = req.url.split('/');
    lookupCount[id] = lookupCount[id] ? lookupCount[id] + 1 : 1;
    // console.log(`GET ${component} to ${URLs.reviews}/restaurants/${id}/reviews`);
    const redisKey = `reviews:${id}`;
    redisClient.getAsync(redisKey)
      .then((redisVal) => {
        if (redisVal === null) {
          axios.get(`${URLs.reviews}/restaurants/${id}/reviews`)
            .then((response) => {
              res.writeHead(response.status, {
                'Content-Type': 'application/json',
              });
              const jsonString = JSON.stringify(response.data);
              res.end(jsonString);
              redisClient.set(redisKey, jsonString, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
            })
            .catch((error) => {
              console.log(error, 'Error');
              res.statusCode = error.response ? error.response.status : 500;
              const errMsg = error.response ? error.response.statusText : 'Internal Server Error';
              res.end(errMsg);
            });
          statistics.cacheMiss += 1;
          statistics.axiosCalls += 1;
        } else {
          res.writeHead(200, {
            'Content-Type': 'application/json',
          });
          res.end(redisVal);
          statistics.cacheHit += 1;
        }
      });
  } else if (req.url.match(/\/\d+$/)) {
    // if a restaurant ID is requested,
    const id = Number(req.url.slice(1));

    const redisKey = `ssr:${id}`;
    redisClient.getAsync(redisKey)
      .then((redisVal) => {
        if (redisVal === null) {
          const component = React.createElement(reviewsBundle.default, { id });
          const markup = ReactDom.renderToString(component);

          const result = ssrTemplate({ id, markup });
          res.writeHead(200, {
            'Content-Type': 'text/html',
          });
          res.end(result);
          redisClient.set(redisKey, result, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
          statistics.cacheMiss += 1;
        } else {
          res.writeHead(200, {
            'Content-Type': 'text/html',
          });
          res.end(redisVal);
          statistics.cacheHit += 1;
        }
      });
  } else {
    // else, try to serve static file
    const reqFile = req.url.slice(1) !== '' ? req.url.slice(1) : 'index.html';
    const filename = path.join(__dirname, 'dist', reqFile);

    const redisKey = `static:${filename}`;
    redisClient.getAsync(redisKey)
      .then((redisVal) => {
        if (redisVal === null) {
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

              const encoding = mime.lookup(filename) === 'image/jpeg' ? 'base64' : 'utf8';
              const bufferString = data.toString(encoding);
              // console.log(`${redisKey} setting to ${bufferString.slice(0, 20)}`);
              redisClient.set(redisKey, bufferString, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
            }
            statistics.cacheMiss += 1;
          });
        } else {
          // console.log(`${redisKey} resolves to ${redisVal.slice(0, 20)}`);
          res.writeHead(200, {
            'Content-Type': mime.lookup(filename),
          });
          const returnData = mime.lookup(filename) === 'image/jpeg' ? new Buffer(redisVal, 'base64') : redisVal;
          res.end(returnData);
          statistics.cacheHit += 1;
        }
      });
  }
});

server.listen(port, () => {
  console.log('NewRelic', newrelic.agent.config.license_key.slice(0, 10),'...');
  console.log(`listening on port ${port}`);
});

process.on('SIGINT', () => {
  const total = Math.max(1, statistics.cacheHit + statistics.cacheMiss);
  console.log('\nRedis hits %', (100 * (statistics.cacheHit / total)).toFixed(1));
  console.log('Redis misses %', (100 * (statistics.cacheMiss / total)).toFixed(1));
  console.log('Total lookups', total);
  console.log('Axios calls', statistics.axiosCalls);

  const multiLookups = Object.values(lookupCount).filter(count => count > 1);
  const singleLookups = Object.values(lookupCount).filter(count => count === 1);
  console.log(`multi: ${multiLookups.length}, single: ${singleLookups.length}`);

  process.exit();
});
