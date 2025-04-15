/**
 * Cache manager for storing and retrieving data
 */
const NodeCache = require('node-cache');
const config = require('../config');

// Create a new cache instance with TTL (Time To Live)
const cache = new NodeCache({
  stdTTL: config.cacheTTL,
  checkperiod: config.cacheTTL * 0.2
});

/**
 * Get value from cache
 * @param {string} key - The cache key
 * @returns {*} The cached value or undefined if not found
 */
function get(key) {
  return cache.get(key);
}

/**
 * Set value in cache
 * @param {string} key - The cache key
 * @param {*} value - The value to cache
 * @param {number} ttl - Optional custom TTL in seconds
 * @returns {boolean} True on success, false on failure
 */
function set(key, value, ttl = config.cacheTTL) {
  return cache.set(key, value, ttl);
}

/**
 * Delete value from cache
 * @param {string} key - The cache key
 * @returns {number} Number of deleted entries
 */
function del(key) {
  return cache.del(key);
}

/**
 * Flush all cache
 */
function flush() {
  return cache.flushAll();
}

/**
 * Get statistics about the cache
 * @returns {Object} Cache statistics
 */
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