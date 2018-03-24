const TOT_DATA_SIZE = 10e6;
const HIGH_TRAFFIC = 1e2;
const LOW_TRAFFIC = 1e6 - HIGH_TRAFFIC;

const genRandom = (requestParams, context, ee, next) => {

  const rand = Math.floor(TOT_DATA_SIZE * Math.random());
  requestParams.url = requestParams.url.replace('{{replace}}', rand);
  // console.log('  artilleryFn:', requestParams.url);

  return next(); // MUST be called for the scenario to continue
};

const genRandomID = (probability) => {
  return Math.random() < probability
    ? Math.floor(HIGH_TRAFFIC * Math.random())
    : Math.floor(HIGH_TRAFFIC + (LOW_TRAFFIC * Math.random()));
};

const genRandom50 = (requestParams, context, ee, next) => {
  const range = Math.floor(10 * Math.random());
  const requestId = (1e6 * range) + genRandomID(0.5);

  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};

const genRandom80 = (requestParams, context, ee, next) => {
  const range = Math.floor(10 * Math.random());
  const requestId = (1e6 * range) + genRandomID(0.8);

  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};

const genRandom99 = (requestParams, context, ee, next) => {
  const range = Math.floor(10 * Math.random());
  const requestId = (1e6 * range) + genRandomID(0.99);

  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};

const genRandom999 = (requestParams, context, ee, next) => {
  const range = Math.floor(10 * Math.random());
  const requestId = (1e6 * range) + genRandomID(0.999);

  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};

const genRandom9999 = (requestParams, context, ee, next) => {
  const range = Math.floor(10 * Math.random());
  const requestId = (1e6 * range) + genRandomID(0.9999);

  requestParams.url = requestParams.url.replace('{{replace}}', requestId);
  return next();
};


module.exports = {
  genRandom,
  genRandom50,
  genRandom80,
  genRandom99,
  genRandom999,
  genRandom9999,
};
