import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize("comments_app", "nodeuser", "123456789!", {
  host: "localhost",
  dialect: "mariadb",
});

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connection OK");
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  }
};