import { createClient } from "redis";

const redis = createClient({
    url: process.env.REDIS_URL,
});

redis.on("error", (err) => {
    console.error("Redis Client Error", err);
});

redis
    .connect()
    .then(() => {
        console.log(`Connected to Redis at ${process.env.REDIS_URL}`);
    })
    .catch((err) => {
        console.error("Redis Connection Error", err);
    });

export default redis;
