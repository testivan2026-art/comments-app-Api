import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

const dbUrl = isProd ? process.env.PROD_DB_URL : process.env.LOCAL_DB_URL;

if (!dbUrl) {
  throw new Error("❌ Database URL not defined in .env");
}

export const sequelize = new Sequelize(dbUrl, {
  dialect: "mariadb",
  logging: false,
  dialectOptions: {
    connectTimeout: 30000,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000,
  },
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected");
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
    process.exit(1);
  }
};