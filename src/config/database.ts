import knex, { Knex } from "knex";
import dotenv from "dotenv";
import mysql from "mysql2/promise";
import logger from "./logger";

dotenv.config();

const dbName = process.env.DB_NAME || "your_default_db_name";

const db: Knex = knex({
  client: "mysql2",
  connection: {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3307,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

export const createDatabase = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    logger.info(`Database ${dbName} created or already exists`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database initialization failed: ${error.message}`);
    } else {
      throw new Error("Database initialization failed: Unknown error");
    }
  } finally {
    await connection.end();
  }
};

export const checkConnection = async () => {
  try {
    await db.raw("SELECT 1");
    // console.log("Database connected successfully!");
    logger.info("Database connected successfully!");
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Database connection failed: ${error.message}`);
    } else {
      throw new Error("Database connection failed: Unknown error");
    }
  }
};

export const createTableUser = async () => {
  try {
    // First check if the table exists
    const tableExists = await db.schema.hasTable("users");

    // Only create the table if it doesn't exist
    if (!tableExists) {
      await db.schema.createTable("users", (table) => {
        table.string("user_id").primary();
        table.string("user_email").notNullable().unique();
        table.string("user_name").notNullable().unique();
        table.string("user_first_name").notNullable();
        table.string("user_last_name").notNullable();
        table.string("user_phone").notNullable();
        table.string("user_password").notNullable();
        table.timestamps(true, true);
      });
      logger.info("Table 'users' created successfully");
    } else {
      logger.info("Table 'users' already exists");
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Table creation failed: ${error.message}`);
    } else {
      throw new Error("Table creation failed: Unknown error");
    }
  }
};

export default db;
