import postgres from "postgres";

const sql = postgres("", {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT as string, 10),
  database: process.env.DB_DATABASE,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export default sql;
