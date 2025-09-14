import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: "./src/server/db/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: env.DATABASE_URL ?? "file:./db.sqlite",
  },
  tablesFilter: ["cf-test_*"],
} satisfies Config;
