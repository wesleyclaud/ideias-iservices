const { Route, User } = require('../../models');
const { Op } = require('sequelize');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const { count, rows } = await Route.findAndCountAll({
      where,
      include: [{ model: User, as: 'driver', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const route = await Route.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json(route);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const route = await Route.findByPk(req.params.id);
    if (!route) return res.status(404).json({ error: 'Rota não encontrada.' });
    await route.update(req.body);
    res.json(route);
  } catch (err) { next(err); }
};

module.exports = { list, create, update };
