import { IGitHubUser } from "../interfaces/index.ts";

export class GithubServiceClass {
  #token = "";

  async getAccessToken(code: string): Promise<string> {
    const rootUrl = "https://github.com/login/oauth/access_token";

    const options = {
      client_id: Deno.env.get("GITHUB_OAUTH_CLIENT_ID") as string,
      client_secret: Deno.env.get("GITHUB_OAUTH_CLIENT_SECRET") as string,
      code,
    };

    const response = await fetch(
      `${rootUrl}?${new URLSearchParams(options).toString()}`,
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

    const data = await response.json() as { access_token: string };
    this.#token = data.access_token;

    return this.#token;
  }

  async getUser(): Promise<IGitHubUser> {
    const response = await fetch(
      "https://api.github.com/user",
      {
        headers: {
          Authorization: `Bearer ${this.#token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Failed to exchange code: ${response.statusText}`);
    }

    return await response.json() as IGitHubUser;
  }
}

export const GithubService = new GithubServiceClass();
