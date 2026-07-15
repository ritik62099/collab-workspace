import { logger } from '../utils/logger.js';

// Get cached data
export const getCache = async (key) => {
  try {
    if (!global.redisClient) return null;
    const data = await global.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    logger.error('Cache get error:', error.message);
    return null;
  }
};

// Set cached data
export const setCache = async (key, value, ttl = 3600) => {
  try {
    if (!global.redisClient) return;
    await global.redisClient.setEx(key, ttl, JSON.stringify(value));
  } catch (error) {
    logger.error('Cache set error:', error.message);
  }
};

// Delete cached data
export const deleteCache = async (key) => {
  try {
    if (!global.redisClient) return;
    await global.redisClient.del(key);
  } catch (error) {
    logger.error('Cache delete error:', error.message);
  }
};

// Delete multiple keys by pattern
export const deleteCacheByPattern = async (pattern) => {
  try {
    if (!global.redisClient) return;
    const keys = await global.redisClient.keys(pattern);
    if (keys.length > 0) {
      await global.redisClient.del(keys);
    }
  } catch (error) {
    logger.error('Cache pattern delete error:', error.message);
  }
};