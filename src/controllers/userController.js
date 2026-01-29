import { User } from '../models/index.js';

export const getUsers = async (_, res) => {
  res.json(await User.findAll());
};

export const getUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(user);
};

export const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ message: 'Email must be unique' });
    }
    res.status(400).json({ message: err.message, errors: err.errors });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.sendStatus(404);
  res.json(await user.update(req.body));
};

export const deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.sendStatus(404);
  await user.destroy();
  res.json({ message: 'User deleted' });
};