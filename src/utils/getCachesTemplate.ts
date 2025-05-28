// services/templateService.ts
import axios from "axios";
import { redis } from "../services/Redis";

export const getCachedTemplate = async (
  templateId: string,
  templateUrl: string
): Promise<string> => {
  const cacheKey = `template:${templateId}`;

  const cached = await redis.get(cacheKey);
  if (cached) return cached;

  const { data } = await axios.get(templateUrl, { responseType: "text" });

  if (data) {
    await redis.set(cacheKey, data, "EX", 60 * 60 * 6); // cache for 1 hour
    return data;
  }

  throw new Error("Unable to fetch template from S3");
};
