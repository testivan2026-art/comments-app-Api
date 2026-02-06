import {sequelize}from '../../config/db.js';
import { User } from './User.js';
import { Comment } from './Comment.js';
import { File } from './File.js';

// relations
User.hasMany(Comment, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
});
Comment.belongsTo(User, { foreignKey: 'user_id' });

Comment.hasMany(Comment, {
  as: 'replies',
  foreignKey: 'parent_id',
  onDelete: 'CASCADE',
});

Comment.belongsTo(Comment, {
  as: 'parent',
  foreignKey: 'parent_id',
});

Comment.hasMany(File, { foreignKey: 'comment_id' });
File.belongsTo(Comment, { foreignKey: 'comment_id' });

export { sequelize, User, Comment, File };
