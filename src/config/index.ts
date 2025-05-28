require("dotenv").config();

export const PORT = process.env.PORT || 3000;

export const MONGO_URI = process.env.MONGO_URI as string;

export const RABBITMQ_URI = process.env.RABBITMQ_URI as string;
export const QUEUE_NAME = process.env.QUEUE_NAME as string;

export const REDIS_URL = process.env.REDIS_URL as string;