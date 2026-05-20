import { createClient } from "@redis/client";
import dotenv from "dotenv";

dotenv.config();

// Initialize client
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

// Lifecycle events

redisClient.on("connect", () => {
  console.log("Connecting to Redis...");
});

redisClient.on("ready", () => {
  console.log("Redis is ready to use");
});

redisClient.on("error", (err) => {
  console.error("Redis client error:", err);
});

redisClient.on("end", () => {
  console.log("Redis connection closed");
});

//Connect to redis
async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Could not establish Redis connection", error);
  }
}

export { redisClient, connectRedis };
