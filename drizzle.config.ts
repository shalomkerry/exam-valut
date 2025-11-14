// drizzle.config.ts
import * as dotenv from 'dotenv';
import { defineConfig } from "drizzle-kit";
dotenv.config();
export default defineConfig({

  dialect: "postgresql",
  out:"./drizzle",
  schema: "./src/db/auth_schema.ts",
  dbCredentials: {
    url: process.env.NEXT_PUBLIC_DATABASE_URL!, // 👈 your Neon DB connection
  },
});
