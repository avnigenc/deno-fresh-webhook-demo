import { getCookies, setCookie } from "std/http/cookie.ts";

export class SessionServiceClass {
  get(headers: Headers): string {
    const cookie = getCookies(headers) as { sessionId: string };
    return cookie.sessionId;
  }

  set(headers: Headers, domain: string, value: string): boolean {
    setCookie(
      headers,
      {
        name: "sessionId",
        value,
        maxAge: 120000,
        sameSite: "Lax", // this is important to prevent CSRF attacks
        domain,
        path: "/",
        secure: true,
      },
    );

    return true;
  }

  // TODO:
  delete() {
    setCookie(new Headers(), {
      name: "sessionId",
      value: "",
      domain: "https://webhook-demo.deno.dev",
      sameSite: "Lax", // this is important to prevent CSRF attacks
      expires: new Date(0),
    });

    return true;
  }
}

export const SessionService = new SessionServiceClass();
