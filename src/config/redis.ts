import { createClient } from "@redis/client";
import dotenv from "dotenv";

dotenv.config();

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const isTLS = redisUrl.startsWith("rediss://");

const redisClient = createClient({
  url: redisUrl,
  socket: {
    ...(isTLS
      ? {
          tls: true as const,
          rejectUnauthorized: false,
        }
      : {}),
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error("Redis reconnection attempts exhausted.");
        return new Error("Redis reconnection retry limit reached");
      }

      return Math.min(retries * 100, 3000);
    },
  },
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

// Connect to Redis
async function connectRedis() {
  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Could not establish Redis connection", error);
  }
}

export { redisClient, connectRedis };
