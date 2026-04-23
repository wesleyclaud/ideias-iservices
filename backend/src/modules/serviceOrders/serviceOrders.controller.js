const { ServiceOrder, User } = require('../../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const { count, rows } = await ServiceOrder.findAndCountAll({
      where,
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const os = await ServiceOrder.findByPk(req.params.id, {
      include: [
        { model: User, as: 'assignee', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'creator', attributes: ['id', 'name'] },
      ],
    });
    if (!os) return res.status(404).json({ error: 'OS não encontrada.' });
    res.json(os);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const { title, description, priority, assignedTo, scheduledAt } = req.body;
    const count = await ServiceOrder.count();
    const code = `OS-${String(count + 1).padStart(5, '0')}`;
    const os = await ServiceOrder.create({ code, title, description, priority, assignedTo, scheduledAt, createdBy: req.user.id });
    res.status(201).json(os);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const os = await ServiceOrder.findByPk(req.params.id);
    if (!os) return res.status(404).json({ error: 'OS não encontrada.' });
    await os.update(req.body);
    res.json(os);
  } catch (err) { next(err); }
};

const counts = async (req, res, next) => {
  try {
    const { ServiceOrder } = require('../../models');
    const [pendente, em_andamento, executada, qualificada, faturada] = await Promise.all([
      ServiceOrder.count({ where: { status: 'pendente' } }),
      ServiceOrder.count({ where: { status: 'em_andamento' } }),
      ServiceOrder.count({ where: { status: 'executada' } }),
      ServiceOrder.count({ where: { status: 'qualificada' } }),
      ServiceOrder.count({ where: { status: 'faturada' } }),
    ]);
    res.json({ pendente, em_andamento, executada, qualificada, faturada });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, counts };
