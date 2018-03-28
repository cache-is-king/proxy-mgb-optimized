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

const reviewsRenderBundle = require('./dist/bundle-render');

dotenv.config();

const port = process.env.PORT || 5005;
const REDIS_LIFETIME = 60; // seconds, lifetime of redis key

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
const redisClient = redis.createClient({ host: process.env.REDIS_HOST });

const URLs = {
  reviews: process.env.REVIEWS_URL,
};

const bundleFiles = {
  'bundle-reviews.js': `${URLs.reviews}/bundle-reviews.js`,
};

const statistics = {
  cacheHit: 0,
  cacheMiss: 0,
  lookupCount: {},
};

const html = fs.readFileSync(path.join(__dirname, 'dist', 'ssr-template.html'), 'utf8');
const ssrTemplate = _.template(html);

const sendResponse = (res, code, mimeType, data) => {
  if (mimeType === '') {
    res.writeHead(code);
  } else {
    res.writeHead(code, {
      'Content-Type': mimeType,
    });
  }
  res.end(data);
};

const server = http.createServer((req, res) => {
  if (req.method !== 'GET') {
    sendResponse(res, 404, '', '404 Not Found');
  } else if (req.url.startsWith('/restaurants/')) {
    // handle ajax call for restaurant reviews
    const [, , id, component] = req.url.split('/');
    statistics.lookupCount[id] = statistics.lookupCount[id] ? statistics.lookupCount[id] + 1 : 1;
    // console.log(`GET ${component} to ${URLs.reviews}/restaurants/${id}/reviews`);
    const redisKey = `reviews:${id}`;
    redisClient.getAsync(redisKey)
      .then((redisVal) => {
        if (redisVal === null) {
          axios.get(`${URLs.reviews}/restaurants/${id}/reviews`)
            .then((response) => {
              const jsonString = JSON.stringify(response.data);
              sendResponse(res, 200, 'application/json', jsonString);
              redisClient.set(redisKey, jsonString, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
            })
            .catch((error) => {
              console.log(error, 'Error');
              const errCode = error.response ? error.response.status : 500;
              const errMsg = error.response ? error.response.statusText : 'Internal Server Error';
              sendResponse(res, errCode, '', errMsg);
            });
          statistics.cacheMiss += 1;
        } else {
          sendResponse(res, 200, 'application/json', redisVal);
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
          const component = React.createElement(reviewsRenderBundle.default, { id });
          const markup = ReactDom.renderToString(component);

          const result = ssrTemplate({ id, markup });
          sendResponse(res, 200, 'text/html', result);
          redisClient.set(redisKey, result, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
          statistics.cacheMiss += 1;
        } else {
          sendResponse(res, 200, 'text/html', redisVal);
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
          // if a special filename, go to the component server(s) to grab bundles if necessary
          if (Object.keys(bundleFiles).includes(reqFile)) {
            axios.get(bundleFiles[reqFile])
              .then((response) => {
                // console.log(response, 'axios response');
                // const jsonString = JSON.stringify(response.data);
                sendResponse(res, 200, 'application/javascript', response.data);
                redisClient.set(redisKey, response.data, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
              })
              .catch((error) => {
                console.log(error, 'Error');
                const errCode = error.response ? error.response.status : 500;
                const errMsg = error.response ? error.response.statusText : 'Internal Server Error';
                sendResponse(res, errCode, '', errMsg);
              });
          } else {
            fs.readFile(filename, (err, data) => {
              if (err) {
                console.log(err);
                sendResponse(res, 404, '', '404 Not Found');
              } else {
                sendResponse(res, 200, mime.lookup(filename), data);
                const encoding = mime.lookup(filename) === 'image/jpeg' ? 'base64' : 'utf8';
                const bufferString = data.toString(encoding);
                redisClient.set(redisKey, bufferString, 'EX', REDIS_LIFETIME); // cache for REDIS_LIFETIME secs
              }
            });
          }
          statistics.cacheMiss += 1;
        } else {
          const returnData = mime.lookup(filename) === 'image/jpeg' ? new Buffer(redisVal, 'base64') : redisVal;
          sendResponse(res, 200, mime.lookup(filename), returnData);
          statistics.cacheHit += 1;
        }
      });
  }
});

server.listen(port, () => {
  console.log('NewRelic', newrelic.agent.config.license_key.slice(0, 10), '...');
  console.log(`listening on port ${port}`);
});

process.on('SIGINT', () => {
  const total = Math.max(1, statistics.cacheHit + statistics.cacheMiss);
  console.log('\nRedis hits %', (100 * (statistics.cacheHit / total)).toFixed(1));
  console.log('Redis misses %', (100 * (statistics.cacheMiss / total)).toFixed(1));
  console.log('Total lookups', total);

  const multiLookups = Object.values(statistics.lookupCount).filter(count => count > 1);
  const singleLookups = Object.values(statistics.lookupCount).filter(count => count === 1);
  console.log(`multi-lookups: ${multiLookups.length}, single-lookups: ${singleLookups.length}`);

  process.exit();
});
