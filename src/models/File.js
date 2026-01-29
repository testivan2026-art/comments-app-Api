import { DataTypes } from 'sequelize';
import {sequelize} from '../../config/db.js';

export const File = sequelize.define(
  'File',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    comment_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('image', 'text') },
    path: { type: DataTypes.STRING, allowNull: false },
    original_name: DataTypes.STRING,
    size: DataTypes.INTEGER,
  },
  {
    tableName: 'files',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
  }
);