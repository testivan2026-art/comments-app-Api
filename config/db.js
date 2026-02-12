import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(process.env.MYSQL_URL, {
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
  await sequelize.authenticate();
};