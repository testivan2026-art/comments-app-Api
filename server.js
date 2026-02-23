import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { sequelize, testConnection } from "./config/db.js";
import { Captcha } from "./src/models/index.js";
import { Op } from "sequelize";

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await testConnection();

    if (process.env.NODE_ENV !== "production") {
      await sequelize.sync({ alter: true });
      console.log(" DB synced");
    }

    // Cleanup expired captchas
    setInterval(async () => {
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

      await Captcha.destroy({
        where: {
          created_at: {
            [Op.lt]: fiveMinutesAgo,
          },
        },
      });
    }, 5 * 60 * 1000);

    app.listen(PORT, "0.0.0.0", () => {
      console.log("Server running on port", PORT);
    });
  } catch (err) {
    console.error("❌ Startup failed:", err.message);
    process.exit(1);
  }
};

start();