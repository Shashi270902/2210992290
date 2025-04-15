
const NodeCache = require('node-cache');
const config = require('../config');

const cache = new NodeCache({
  stdTTL: config.cacheTTL,
  checkperiod: config.cacheTTL * 0.2
});

function get(key) {
  return cache.get(key);
}

function set(key, value, ttl = config.cacheTTL) {
  return cache.set(key, value, ttl);
}


function del(key) {
  return cache.del(key);
}


function flush() {
  return cache.flushAll();
}


function stats() {
  return cache.getStats();
}

module.exports = {
  get,
  set,
  del,
  flush,
  stats
};