export interface IConfig {
  GITHUB_OAUTH_CLIENT_ID: string;
  GITHUB_OAUTH_CLIENT_SECRET: string;
  GITHUB_OAUTH_CALLBACK_URL: string;
  UPSTASH_REDIS_REST_URL: string;
  UPSTASH_REDIS_REST_TOKEN: string;
}

import { config } from "https://deno.land/x/dotenv/mod.ts";
const configuration = config() as unknown as any;

export default class ConfigServiceClass {
  config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  get(key: keyof IConfig): string | number | boolean {
    return this.config[key];
  }
}

export const ConfigService = new ConfigServiceClass(configuration);
