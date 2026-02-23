import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// ==============================
// Determine environment
// ==============================

const isProduction = process.env.NODE_ENV === "production";

// 1️⃣ Full database URL (Render / Railway / Local URL)
const databaseUrl =
  process.env.MYSQL_URL ||
  process.env.PROD_DB_URL ||
  process.env.LOCAL_DB_URL;

// 2️⃣ Docker-style config (DB_HOST etc.)
const useDockerConfig =
  process.env.DB_HOST &&
  process.env.DB_USER &&
  process.env.DB_PASSWORD &&
  process.env.DB_NAME;

let sequelize;

// ==============================
// Create Sequelize instance
// ==============================

if (databaseUrl) {
  sequelize = new Sequelize(databaseUrl, {
    dialect: "mariadb",
    logging: false,
    dialectOptions: isProduction
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  });
} else if (useDockerConfig) {
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 3306,
      dialect: "mariadb",
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 60000,
        idle: 10000,
      },
    }
  );
} else {
  throw new Error("❌ No valid database configuration found");
}

// ==============================
// Retry DB connection
// ==============================

export const testConnection = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      await sequelize.authenticate();
      console.log("✅ DB connected");
      return;
    } catch (error) {
      retries -= 1;
      console.log(
        `⏳ DB not ready. Retries left: ${retries}. Retrying in ${delay /
          1000}s...`
      );

      await new Promise((res) => setTimeout(res, delay));
    }
  }

  console.error("❌ Could not connect to DB after multiple attempts.");
  process.exit(1);
};

export { sequelize };