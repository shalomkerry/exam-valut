import {db  } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import * as schema from "@/db/auth_schema"
import { nextCookies } from "better-auth/next-js";

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
  session: {
    strategy: "database", // Or "database" for stateful sessions
    maxAge:  24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60, // Refresh every 24 hours
    rememberMe: true, // Enables longer sessions if checked during sign-in
  },
 advanced: {
    cookiePrefix: "better-auth", // Custom cookie prefix
  }, 
  user:{
    additionalFields:{
      role:{
        type:["editor","approver","admin"],
        required:true,
        input:false,
        defaultValue:'editor'
      }
    }
  },
  plugins:[nextCookies()],
});
export default auth