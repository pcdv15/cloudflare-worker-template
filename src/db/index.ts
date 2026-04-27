import { drizzle } from "drizzle-orm/d1";

import * as schema from "./schema";

export function getdb(d1: D1Database) {
  return drizzle(d1, { schema });
}

export type DbClient = ReturnType<typeof getdb>;
export * from "./schema";
