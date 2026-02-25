import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema.js";
import * as relations from "./relations.js";
import { env } from "../env.js";

const { Pool } = pg;

const pool = new Pool({ connectionString: env.DATABASE_URL });
export const db = drizzle(pool, { schema: { ...schema, ...relations } });
export type Db = typeof db;
export { schema };
