// DO NOT EDIT. This file is generated by fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import config from "./deno.json" assert { type: "json" };
import * as $0 from "./routes/_404.tsx";
import * as $1 from "./routes/_500.tsx";
import * as $2 from "./routes/_app.tsx";
import * as $3 from "./routes/_middleware.ts";
import * as $4 from "./routes/api/v1/authentication/callback/index.ts";
import * as $5 from "./routes/api/v1/configs/index.ts";
import * as $6 from "./routes/api/v1/webhook/[webhook].ts";
import * as $7 from "./routes/api/v1/ws/index.ts";
import * as $8 from "./routes/index.tsx";
import * as $$0 from "./islands/Authenticate.tsx";
import * as $$1 from "./islands/Hero.tsx";

const manifest = {
  routes: {
    "./routes/_404.tsx": $0,
    "./routes/_500.tsx": $1,
    "./routes/_app.tsx": $2,
    "./routes/_middleware.ts": $3,
    "./routes/api/v1/authentication/callback/index.ts": $4,
    "./routes/api/v1/configs/index.ts": $5,
    "./routes/api/v1/webhook/[webhook].ts": $6,
    "./routes/api/v1/ws/index.ts": $7,
    "./routes/index.tsx": $8,
  },
  islands: {
    "./islands/Authenticate.tsx": $$0,
    "./islands/Hero.tsx": $$1,
  },
  baseUrl: import.meta.url,
  config,
};

export default manifest;
