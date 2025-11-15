import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as appSchema from "@/db/data_schema"; 
import * as authSchema from "@/db/auth_schema";

const fullSchema = {
    ...appSchema,
    ...authSchema,
};
const pool = new Pool({
  connectionString: process.env.NEXT_PUBLIC_DATABASE_URL,
});

export const db = drizzle(pool,{
  schema:fullSchema
});
