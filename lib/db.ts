


/*import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mysite",
  password: "postgres",
  port: 5432,
});

// ✅ helper function
export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

// ✅ optional default export
export default pool;
*/

import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// TEST CONNECTION (IMPORTANT DEBUG)
pool.on("connect", () => {
  console.log("✅ PostgreSQL Connected");
});

pool.on("error", (err) => {
  console.log("❌ DB Error:", err);
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};

export default pool;