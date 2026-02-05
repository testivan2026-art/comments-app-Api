import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: process.env.DB_DIALECT || "mariadb",
    logging: false,
  }
);

export const testConnection = async () => {
  let connected = false;

  while (!connected) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connection OK");
      connected = true;
    } catch (error) {
      console.log("⏳ Waiting for DB...");
      await new Promise(r => setTimeout(r, 5000));
    }
  }
};