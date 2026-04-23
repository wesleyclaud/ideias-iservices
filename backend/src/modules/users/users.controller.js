const bcrypt = require('bcryptjs');
const { User } = require('../../models');
const { validationResult } = require('express-validator');

const list = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['passwordHash'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, { attributes: { exclude: ['passwordHash'] } });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    res.json(user);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const { name, email, password, role } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ error: 'E-mail já cadastrado.' });
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    const { passwordHash: _, ...data } = user.toJSON();
    res.status(201).json(data);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    const { name, role, isActive, avatarUrl } = req.body;
    await user.update({ name, role, isActive, avatarUrl });
    const { passwordHash: _, ...data } = user.toJSON();
    res.json(data);
  } catch (err) { next(err); }
};

const remove = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    await user.update({ isActive: false });
    res.json({ message: 'Usuário desativado.' });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, remove };
