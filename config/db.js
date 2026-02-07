import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || "mysql",
    logging: false,
    dialectOptions: {
      connectTimeout: 30000, // 30 секунд тайм-аут на з'єднання
      // якщо DB вимагатиме SSL (для PostgreSQL/DBaaS)
      ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000, // 30 секунд для отримання конекшну з пулу
      idle: 10000,    // 10 секунд тайм-аут бездіяльності
    },
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connection OK");
  } catch (error) {
    console.error("❌ DB connection failed", error);
    throw error;
  }
};