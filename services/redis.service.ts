import { Redis } from "https://deno.land/x/upstash_redis@v1.16.0/mod.ts";
import { ConfigService } from "./config.service.ts";

export default class RedisServiceClass {
  redis: Redis;

  constructor() {
    this.redis = new Redis({
      url: ConfigService.get("UPSTASH_REDIS_REST_URL") as string,
      token: ConfigService.get("UPSTASH_REDIS_REST_TOKEN") as string,
    });
  }

  async set(key: string, value: string, expire = 0): Promise<boolean> {
    await this.redis.set(key, JSON.stringify(value));
    if (expire > 0) await this.redis.expire(key, expire);
    return true;
  }

  async get<T>(key: string): Promise<T | undefined> {
    const record = await this.redis.get<string>(key);
    if (!record) return undefined;
    return JSON.parse(record) as T;
  }

  async del(key: string): Promise<boolean> {
    await this.redis.del(key);
    return true;
  }
}

export const RedisService = new RedisServiceClass();