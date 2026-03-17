import { Pool } from "pg";

export const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mysite",
  password: "postgres",
  port: 5432,
});