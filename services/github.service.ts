import GitHubUser from "../interfaces/github-user.interface.ts";
import { ConfigService } from "./config.service.ts";

export class GithubServiceClass {
  #token = "";

  async getAccessToken(code: string): Promise<string> {
    const rootUrl = "https://github.com/login/oauth/access_token";

    const options = {
      client_id: ConfigService.get("GITHUB_OAUTH_CLIENT_ID") as string,
      client_secret: ConfigService.get("GITHUB_OAUTH_CLIENT_SECRET") as string,
      code,
    };

    const queryString = new URLSearchParams(options).toString();

    const response = await fetch(
      `${rootUrl}?${queryString}`,
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    const data = await response.json();
    this.#token = data.access_token;

    return this.#token;
  }

  async getUser(): Promise<GitHubUser> {
    try {
      const response = await fetch(
        "https://api.github.com/user",
        {
          headers: {
            Authorization: `Bearer ${this.#token}`,
          },
        },
      );

      return await response.json();
    } catch (err) {
      throw Error(err);
    }
  }
}

export const GithubService = new GithubServiceClass();
