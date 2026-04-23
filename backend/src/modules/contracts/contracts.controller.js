const { Contract } = require('../../models');
const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

const list = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (status) where.status = status;
    if (search) where.title = { [Op.like]: `%${search}%` };

    const { count, rows } = await Contract.findAndCountAll({
      where,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({ total: count, page: parseInt(page), data: rows });
  } catch (err) { next(err); }
};

const getOne = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contrato não encontrado.' });
    res.json(contract);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });
  try {
    const count = await Contract.count();
    const code = `CTR-${String(count + 1).padStart(5, '0')}`;
    const contract = await Contract.create({ ...req.body, code, createdBy: req.user.id });
    res.status(201).json(contract);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) return res.status(404).json({ error: 'Contrato não encontrado.' });
    await contract.update(req.body);
    res.json(contract);
  } catch (err) { next(err); }
};

const counts = async (req, res, next) => {
  try {
    const total = await Contract.count({ where: { status: 'ativo' } });
    res.json({ ativos: total });
  } catch (err) { next(err); }
};

module.exports = { list, getOne, create, update, counts };
