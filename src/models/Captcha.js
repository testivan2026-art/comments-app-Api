import { DataTypes } from 'sequelize';
import { sequelize } from '../../config/db.js';

export const Captcha = sequelize.define(
  'Captcha',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    tableName: 'captchas',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  }
);