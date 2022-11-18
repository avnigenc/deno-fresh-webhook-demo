import { deleteCookie, getCookies, setCookie } from "std/http/cookie.ts";

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

  delete(headers: Headers, name: string, domain: string) {
    deleteCookie(headers, name, {
      path: "/",
      domain,
    });

    return true;
  }
}

export const SessionService = new SessionServiceClass();
