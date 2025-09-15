import { createClient } from "redis";

const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || "16998"),
  },
})
  .on("error", (err) => {
    console.error("Redis Client Error", err);
  })
  .on("connect", () => {
    console.log("Redis client connected");
  })
  .on("ready", () => {
    console.log("Redis client ready");
  })
  .on("end", () => {
    console.log("Redis client disconnected");
  });

export const connectRedis = async () => {
  try {
    await redisClient.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
};

export const setCache = async (key: string, value: any) => {
  try {
    await redisClient.set(key, JSON.stringify(value));
    console.log(`Cache set for key: ${key}`);
  } catch (error) {
    console.error(`Error setting cache for key ${key}:`, error);
  }
};

export const getCache = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    if (data) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(data);
    }
    console.log(`Cache miss for key: ${key}`);
    return null;
  } catch (error) {
    console.error(`Error getting cache for key ${key}:`, error);
    return null;
  }
};

export const deleteCache = async (key: string) => {
  try {
    await redisClient.del(key);
    console.log(`Cache deleted for key: ${key}`);
  } catch (error) {
    console.error(`Error deleting cache for key ${key}:`, error);
  }
};

export const setCacheWithExpiry = async (key: string, value: any, expirySeconds: number) => {
  try {
    await redisClient.setEx(key, expirySeconds, JSON.stringify(value));
    console.log(`Cache set for key: ${key} with expiry: ${expirySeconds}s`);
  } catch (error) {
    console.error(`Error setting cache with expiry for key ${key}:`, error);
  }
};

export default redisClient;
