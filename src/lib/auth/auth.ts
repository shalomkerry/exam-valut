import {db  } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/auth_schema"

const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg", // or "pg" or "mysql",
    schema,
  }), 
  secret: process.env.BETTER_AUTH_SECRET!, // Required
  siteUrl: process.env.SITE_URL!,
  autoDatabase: true,
   emailAndPassword: {
    enabled: true,
  },
});
export default auth